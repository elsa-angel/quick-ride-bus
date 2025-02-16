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
    import rpdb; rpdb.set_trace()
    
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








