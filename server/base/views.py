from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.conf import settings
from django.core.mail import EmailMessage
from django.utils import timezone
from django.urls import reverse
from .models import *
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_protect,csrf_exempt
import json
from .models import Schedule
from datetime import datetime

@csrf_protect
def csrf_cookie(request):
    return JsonResponse({'message': 'CSRF cookie set'})

@csrf_exempt
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

@csrf_exempt
def LoginView(request):
    # import rpdb; rpdb.set_trace()
    
    if request.method == "POST":
        data = json.loads(request.body)['data']
        email = data['email']
        password = data['password']
        # import rpdb; rpdb.set_trace()
        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            response_data = {
                # "first_name": user.first_name,
                "email": user.username,
                "password":user.password,
                "success": True,
                "message": "Login successful"
            }
            return JsonResponse(response_data, status=200)
        else:
            response_data = {
                "success": False,
                "error": "Invalid login credentials"
            }
            return JsonResponse(response_data, status=400)

    response_data = {
        "success": False,
        "error": "Invalid request method"
    }
    return JsonResponse(response_data, status=405)

@csrf_exempt
def SearchScheduleView(request):
    # import rpdb; rpdb.set_trace()

    if request.method == 'POST':
        # data = json.loads(request.body)
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

        # Filter schedules by matching from_city, to_city, date, and time
        schedules = Schedule.objects.filter(
            stops__icontains=from_city,  # Search for departure city in the stops
        ).filter(
            stops__icontains=to_city    # Search for destination city in the stops
        ).filter(
            running_days__icontains=weekday,  # Assuming running_days includes the date or day information
        )

        # import rpdb; rpdb.set_trace()
        # Filter further based on time if needed
        available_schedules = []
        for schedule in schedules:
            # Assuming that stops_timings stores the time info in a suitable format
            stop_timings = schedule.stops_timings.split(',')
            stops = schedule.stops.split(',')  # Split stops into list for easier processing
            
            stop_times_dict = {}  # Store times for each stop in a dictionary
            from_time = None
            to_time = None

            # Ensure the "from" stop comes before the "to" stop in the stops field
            if from_city in stops and to_city in stops:
                from_index = stops.index(from_city)
                to_index = stops.index(to_city)
                
                if from_index < to_index:  # Check if "from" comes before "to"
                    for idx, stop_time in enumerate(stop_timings):
                        stop_time_obj = None
                        try:
                            stop_time_obj = datetime.strptime(stop_time.strip(), "%H:%M").time()  # Convert to time object
                            stop_times_dict[stops[idx]] = stop_time_obj
                            if stops[idx] == from_city:
                                from_time = stop_time_obj
                            elif stops[idx] == to_city:
                                to_time = stop_time_obj
                        except ValueError:
                            continue

                    # Check if the times for both "from" and "to" are available
                    if from_time and to_time:
                        # Compare the stop times to the search time
                        if from_time <= search_datetime.time() <= to_time:
                            available_schedules.append(schedule)
                else:
                    # "to" is before "from" in stops list
                    continue
            else:
                # One of the cities is not in the stops list
                continue

        if not available_schedules:
            return JsonResponse({"message": "No schedules found matching your criteria."}, status=404)

        # Format the schedules for the response
        response_data = {
            "schedules": [
                {
                    "bus_name": schedule.bus.bus_name,
                    "from": from_city,
                    "to": to_city,
                    "date": date,
                    "from_time": str(from_time),
                    "to_time": str(to_time),
                }
                for schedule in available_schedules
            ]
        }

        return JsonResponse(response_data, status=200)

    # If method is not POST, return method not allowed
    return JsonResponse({"error": "Invalid request method"}, status=405)