from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.conf import settings
from django.core.mail import EmailMessage
from django.utils import timezone
from django.urls import reverse
from base.models import *
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from django.middleware.csrf import get_token

from django.views.decorators.csrf import csrf_protect,csrf_exempt
import json
from base.models import Schedule,Booking,Message,Reservation
from datetime import datetime

@csrf_protect
def csrf_cookie(request):
    return JsonResponse({'message': 'CSRF cookie set'})

def check_authentication(request):
    csrf_token = get_token(request)
    if request.user.is_authenticated:
        return JsonResponse({
            "isAuthenticated": True,
            "user": {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
            },
            'csrftoken': csrf_token
        },status=200)
    return JsonResponse({"authenticated": False, "error": "User not logged in", 'csrftoken': csrf_token},status=401)

def RegisterView(request):
    # import rpdb; rpdb.set_trace()

    if request.method == "POST":
        data = json.loads(request.body)['data']
        username = data['email']
        name = data['name']
        email = data['email']
        password = data['password']
        password_confirmation = data['confirmPassword']

        # Split the name into first_name and last_name
        name_parts = name.split(' ')  # This splits by spaces

        if len(name_parts) > 1:
            first_name = name_parts[0]
            last_name = ' '.join(name_parts[1:])  # Join remaining parts in case there's a middle name
        else:
            first_name = name_parts[0]
            last_name = ''  # If there's no last name, set it as empty string

        user_data_has_error = False
        response_data = {} 

        # Check if username already exists
        if User.objects.filter(username=username).exists():
            user_data_has_error = True
            response_data['error'] = "Username already exists"

        # Check if email already exists
        if User.objects.filter(email=email).exists():
            user_data_has_error = True
            response_data['error'] = "Email already exists"

        # Check password length
        if len(password) < 5:
            user_data_has_error = True
            response_data['error'] = "Password must be at least 5 characters"

        if password != password_confirmation:
            user_data_has_error = True
            response_data['error'] = "Passwords do not match"

        # If there are any errors, send them as a response
        if user_data_has_error:
            return JsonResponse(response_data, status=400)

        # If no errors, create the user
        try:
            new_user = User.objects.create_user(
                first_name=first_name,
                last_name=last_name,
                username=username, 
                email=email,
                password=password
            )
            response_data['success'] = "Account created successfully. You can now log in."
            return JsonResponse(response_data, status=201)

        except Exception as e:
            response_data['error'] = f"An error occurred: {str(e)}"
            return JsonResponse(response_data, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_protect
def LoginView(request):
    # import rpdb; rpdb.set_trace()
    
    if request.method == "POST":
        try:
            data = json.loads(request.body)['data']
            email = data['email']
            password = data['password']
            # import rpdb; rpdb.set_trace()
            user = authenticate(request, username=email, password=password)

            if user is not None:
                login(request, user)
                return JsonResponse ({
                    "isAuthenticated": True,
                    "user": {
                        "id": request.user.id,
                        "name": user.first_name + user.last_name,
                        "email": user.username,
                    }
                
                }, status=200)
            else:
                 return JsonResponse ({"error": "Invalid login credentials"},status=401)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSOn format"}, status=400)
        
    return JsonResponse({"error": "Method not allowed"}, status=405)

def LogoutView(request):
    if request.method == "POST":
        try:
            logout(request)
            return JsonResponse({"message": "Logout successful"}, status=200)
        except Exception as e:
            return JsonResponse({"error": "Logout Failed", "details": str(e)}, status=500)
    return JsonResponse({"error": "Method not allowed"}, status=405)

def SearchScheduleView(request):
    # import rpdb; rpdb.set_trace()

    if request.method == 'POST':
        data = json.loads(request.body)['formData']
        from_city = data['from']
        to_city = data['to']
        date = data['date']
        time = data['time']

        try:
            # Convert the input date and time to a datetime object for comparison
            search_datetime = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
            weekday = search_datetime.strftime('%A')
        except ValueError:
            return JsonResponse({"error": "Invalid date or time format."}, status=400)

        user_id = request.user.id if request.user.is_authenticated else None

        # Filter schedules by matching from_city, to_city, date, and time
        schedules = Schedule.objects.filter(
            stops__icontains=from_city,
        ).filter(
            stops__icontains=to_city
        ).filter(
            running_days__icontains=weekday,
        )

        available_schedules = []
        for schedule in schedules:
            stop_timings = schedule.stops_timings.split(',')
            stops = schedule.stops.split(',')
            
            stop_times_dict = {}
            from_time = None
            to_time = None

            if from_city in stops and to_city in stops:
                from_index = stops.index(from_city)
                to_index = stops.index(to_city)
                
                if from_index < to_index:  # "from" should come before "to"
                    for idx, stop_time in enumerate(stop_timings):
                        stop_time_obj = None
                        try:
                            stop_time_obj = datetime.strptime(stop_time.strip(), "%H:%M").time()
                            stop_times_dict[stops[idx]] = stop_time_obj
                            if stops[idx] == from_city:
                                from_time = stop_time_obj
                            elif stops[idx] == to_city:
                                to_time = stop_time_obj
                        except ValueError:
                            continue

                    if from_time and to_time:
                        # Compare the stop times to the search time
                        if from_time <= search_datetime.time() <= to_time:
                            # Calculate time difference
                            time_difference = datetime.combine(datetime.today(), to_time) - datetime.combine(datetime.today(), from_time)

                            # Calculate fare (distanceAtTo - distanceAtFrom)
                            from_index = stops.index(from_city)
                            to_index = stops.index(to_city)

                            distance_at_from = schedule.stops_distance.split(',')[from_index]  # Assuming stops_distance contains comma-separated distances
                            distance_at_to = schedule.stops_distance.split(',')[to_index]

                            try:
                                distance_at_from = float(distance_at_from)
                                distance_at_to = float(distance_at_to)
                                fare = 10 * (distance_at_to - distance_at_from)
                            except ValueError:
                                fare = 0  # In case of invalid distance format

                            available_schedules.append({
                                "schedule": schedule,
                                "from_time": from_time,
                                "to_time": to_time,
                                "time_difference": time_difference,
                                "fare": fare,
                                "user_id": user_id
                            })
                else:
                    continue
            else:
                continue

        if not available_schedules:
            return JsonResponse({"message": "No schedules found matching your criteria."}, status=404)

        # Format the schedules for the response
        response_data = {
            "schedules": [
                {
                    "id": schedule['schedule'].id,
                    "user_id": schedule['user_id'],
                    "bus_name": schedule['schedule'].bus.bus_name,
                    "from": from_city,
                    "to": to_city,
                    "date": date,
                    "from_time": str(schedule['from_time']),
                    "to_time": str(schedule['to_time']),
                    "time_difference": str(schedule['time_difference']),
                    "fare": schedule['fare'],
                }
                for schedule in available_schedules
            ]
        }

        return JsonResponse(response_data, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=405)

def BookingView(request):
    # import rpdb; rpdb.set_trace()

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            schedule_id = data['schedule_id']
            user_id = data['user_id']
            booking_date = data['booking_date']
            departure_stop = data['departure_stop']
            arrival_stop = data['arrival_stop']
            fare = data['fare']
            reserved_seats = data.get('reserved_seats', 'null')  
            departure_time = data['departure_time']
            arrival_time = data['arrival_time']
            
            schedule = Schedule.objects.get(id=schedule_id)

            booking = Booking.objects.create(
                schedule=schedule,
                user_id=user_id,
                amount=fare,  
                reserved_seats=reserved_seats,
                departure_stop=departure_stop,
                departure_time=departure_time,
                arrival_stop=arrival_stop,
                arrival_time=arrival_time,
                booking_date=booking_date
            )
            
            return JsonResponse({
                'booking_id': booking.id,
                'message': 'Booking created successfully',
            }, status=201)

        except Schedule.DoesNotExist:
            return JsonResponse({"error": "Schedule not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)


def BookingDetailsView(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
        response_data = {
            'booking_id': booking.id,
            'user_id': booking.user.id,
            'schedule': {
                'id': booking.schedule.id,
                'bus': {
                    'bus_name': booking.schedule.bus.bus_name,
                    'num_seats': booking.schedule.bus.num_seats,
                },
                # Add more details here if needed
            },
            'departure_stop': booking.departure_stop,
            'departure_time': booking.departure_time,
            'arrival_stop': booking.arrival_stop,
            'arrival_time': booking.arrival_time,
            'reserved_seats': booking.reserved_seats,
            'amount': booking.amount,
            'booking_date': booking.booking_date,
        }
        return JsonResponse(response_data)

    except Booking.DoesNotExist:
        return JsonResponse({"error": "Booking not found"}, status=404)
    

def SeatAvailabilityView(request, booking_id):
    try:
        # Get the booking object
        booking = get_object_or_404(Booking, id=booking_id)
        schedule = booking.schedule

        # If occupied_seats are tracked by reservations, fetch them based on the schedule and booking date
        occupied_seats = Reservation.objects.filter(
            schedule=schedule,
            status__in=['paid', 'started'],  # Add any relevant status you need
        ).values_list('reserved_seats', flat=True)
        
        # Flatten the list of reserved seats and remove duplicates
        occupied_seats = list(set(seat for seats in occupied_seats for seat in seats.split(',')))

        return JsonResponse({
            # 'reserved_seats': reserved_seats,
            'occupied_seats': occupied_seats,
        })

    except Booking.DoesNotExist:
        return JsonResponse({"error": "Booking not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

def UpdateBookingSeatsView(request, booking_id):
    try:
        # Parse the JSON data from request.body
        data = json.loads(request.body)
        
        # Fetch the booking object
        booking = get_object_or_404(Booking, id=booking_id)

        # Get the reserved seats from the parsed data
        reserved_seats = data.get('reserved_seats')
        
        if reserved_seats is not None:
            # Update the reserved_seats field on the booking
            booking.reserved_seats = reserved_seats
            booking.save()

        return JsonResponse({'message': 'Booking updated successfully'}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def ContactUsView(request):
    if request.method == "POST":
        # Parse the incoming JSON data from the request body
        try:
            data = json.loads(request.body)['data']
            name = data.get('name', '').strip()
            email = data.get('email', '').strip()
            message = data.get('message', '').strip()

            # Initialize an empty response dictionary
            response_data = {}

            # Validate the data
            if not name:
                response_data['error'] = "Name is required."
                return JsonResponse(response_data, status=400)
            
            if not email:
                response_data['error'] = "Email is required."
                return JsonResponse(response_data, status=400)
            
            if not message:
                response_data['error'] = "Message is required."
                return JsonResponse(response_data, status=400)
            
            # Optionally, check if email is valid (simple regex check)
            import re
            email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
            if not re.match(email_regex, email):
                response_data['error'] = "Invalid email address."
                return JsonResponse(response_data, status=400)

            # Save the message data to the database
            message_instance = Message.objects.create(
                name=name,
                email=email,
                message=message
            )

            response_data['success'] = "Your message has been submitted successfully!"
            return JsonResponse(response_data, status=201)
        
        except json.JSONDecodeError:
            response_data['error'] = "Invalid JSON data."
            return JsonResponse(response_data, status=400)
    
    else:
        # Handle cases where the request method is not POST
        response_data = {
            "error": "Invalid request method."
        }
        return JsonResponse(response_data, status=405)