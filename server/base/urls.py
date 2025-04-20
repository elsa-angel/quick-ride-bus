from django.urls import path # type: ignore
from . import views
from .views import *

urlpatterns = [
    path('csrf-cookie/', views.csrf_cookie, name='csrf_cookie'),
    path('register', views.RegisterView, name='register'),
    path('login', views.LoginView, name='login'),
    path('logout', views.LogoutView, name='logout'),
    path('auth-check/',views.check_authentication,name="auth-check"),
     path('auth/google/', GoogleLoginView, name='google-login'),
    path('schedule/', SearchScheduleView, name='schedule'),
    path('bookings/', BookingView, name='bookings'),
    path('bookings/<int:booking_id>/', BookingDetailsView, name='booking_details'),
    path('bookingsupdate/<int:booking_id>/', UpdateBookingSeatsView, name='update_booking_seats'),
    path('reservations/', ReservationView, name='reservation'),
    path('reserved_seats/<int:booking_id>/', ReservedSeatsView, name='reserved_seats'),
    path('reservations/cancel/<int:reservation_id>/', ReservationCancel, name='cancel_reservation'), 
    path('transactions/', TransactionsView, name='ewallet_transaction'),
    path('ewalletupdate/', EwalletUpdateView, name='ewallet_update'),


    path('contact/', views.ContactUsView, name='contact-us'),

    path('location/', ScheduleCoordinatesView, name='location_tracking'),

    path('buses/', Buses, name='buses'),
    path('bus_details/<int:bus_id>/', BusDetails, name='bus_details'),



]