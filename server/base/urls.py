from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path('csrf-cookie/', views.csrf_cookie, name='csrf_cookie'),
    path('register', views.RegisterView, name='register'),
    path('login', views.LoginView, name='login'),
    path('logout', views.LogoutView, name='logout'),
    path('auth-check/',views.check_authentication,name="auth-check"),
    path('schedule/', views.SearchScheduleView, name='schedule'),
    path('contact/', views.ContactUsView, name='contact-us'),
]