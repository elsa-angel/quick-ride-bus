from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout, get_user_model
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
            "isSuperUser": request.user.is_superuser,
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
    if request.method == "POST":
        try:
            data = json.loads(request.body)['data']
            email = data['email']
            password = data['password']

            # First, try to authenticate the user as a regular user (email is username)
            user = authenticate(request, username=email, password=password)

            # If the regular user authentication fails, check if it's a superuser
            if user is None:
                try:
                    # Get the user by email (because the superuser's username is different)
                    user = get_user_model().objects.get(email=email)

                    # Check if this user is a superuser
                    if user.is_superuser:
                        # Authenticate with their actual username
                        user = authenticate(request, username=user.username, password=password)
                    else:
                        return JsonResponse({"error": "Invalid login credentials"}, status=401)
                except get_user_model().DoesNotExist:
                    return JsonResponse({"error": "Invalid login credentials"}, status=401)

            # If the user is found, login the user and return a success response
            if user is not None:
                login(request, user)
                return JsonResponse({
                    "isAuthenticated": True,
                    "user": {
                        "id": request.user.id,
                        "name": user.first_name + " " + user.last_name,
                        "email": user.username,  # Assuming username is the email
                        "isSuperUser": user.is_superuser
                    }
                }, status=200)
            else:
                return JsonResponse({"error": "Invalid login credentials"}, status=401)
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

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
    
