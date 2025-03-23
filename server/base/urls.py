from django.urls import path # type: ignore
from . import views
from .views import *

urlpatterns = [
    path('csrf-cookie/', views.csrf_cookie, name='csrf_cookie'),
    path('register', views.RegisterView, name='register'),
    path('login', views.LoginView, name='login'),
    path('logout', views.LogoutView, name='logout'),
    path('auth-check/',views.check_authentication,name="auth-check"),
    path('schedule/', views.SearchScheduleView, name='schedule'),
    path('bookings/', views.BookingView, name='bookings'),
    path('bookings/<int:booking_id>/', views.BookingDetailsView, name='booking_details'),
    path('reserved_seats/<int:booking_id>/', views.SeatAvailabilityView, name='seat_availability'),
    path('bookingsupdate/<int:booking_id>/', views.UpdateBookingSeatsView, name='update_booking_seats'),
    path('reservations/', ReservationView, name='reservation'),
    path('reserved_seats/<int:booking_id>/', ReservedSeatsView, name='reserved_seats'),
    path('contact/', views.ContactUsView, name='contact-us'),
]