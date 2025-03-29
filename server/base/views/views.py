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
from django.conf import settings
import requests
from django.contrib.auth.backends import ModelBackend

from django.middleware.csrf import get_token

from django.views.decorators.csrf import csrf_protect,csrf_exempt
import json
from base.models import Schedule,Booking,Message,Reservation
from datetime import datetime


GOOGLE_CLIENT_ID = settings.GOOGLE_CLIENT_ID

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/tokeninfo"

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
                "name": f"{request.user.first_name} {request.user.last_name}",
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

def verify_google_token(token):
    try:
        # Verify the Google token with Google's server
        response = requests.get(f"{GOOGLE_TOKEN_URL}?id_token={token}")
        if response.status_code != 200:
            return None
        return response.json()
    except requests.RequestException:
        return None

@csrf_protect
def GoogleLoginView(request):

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            token = data.get("token")

            if not token:
                return JsonResponse({"error": "Token is required"}, status=400)

            # Verify the token using Google's API
            google_data = verify_google_token(token)
            if not google_data:
                return JsonResponse({"error": "Invalid Google token"}, status=400)
            
            # import rpdb; rpdb.set_trace()

            # Extract necessary fields from the Google data
            email = google_data.get("email")
            first_name = google_data.get("given_name", "")
            last_name = google_data.get("family_name", "")  # Default empty string if not available

            # Check if user exists, if not, create a new user
            user, created = User.objects.get_or_create(
                username=email, defaults={
                    "first_name": first_name,
                    "last_name": last_name, 
                    "email": email,
                }
            )

            # Authenticate user and log them in with the ModelBackend
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')

            return JsonResponse({
                "isAuthenticated": True,
                "user": {
                    "id": user.id,
                    "name": f"{user.first_name} {user.last_name}",
                    "email": user.username,
                }
            }, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
    return JsonResponse({"error": "Method not allowed"}, status=405)


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