from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path('csrf-cookie/', views.csrf_cookie, name='csrf_cookie'),
    path('register', views.RegisterView, name='register'),
    path('login', views.LoginView, name='login'),
    path('schedule/', views.SearchScheduleView, name='schedule'),
    path('contact/', views.ContactUsView, name='contact-us'),
]