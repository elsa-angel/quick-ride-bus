from django.http import JsonResponse
from django.db.models import Count
from collections import Counter
from base.models import Bus,Message,Reservation,Schedule
from django.contrib.auth.models import User
from django.db import connection
from collections import defaultdict
import calendar
from django.db.models.functions import TruncMonth
import re 
import uuid
from django.db.models import F
from django.utils import timezone
import pytz
from datetime import datetime


def BusCreationStats(request):
    # Query the bus data grouped by month using SQLite's strftime function
    bus_data = Bus.objects.extra(
        select={'month': "strftime('%m', created_at)"}
    ).values('month').annotate(count=Count('id')).order_by('month')

    # Format the data for the chart
    categories = [calendar.month_name[i] for i in range(1, 13)]
    series = [0] * 12

    # Populate the series data with the count of buses created each month
    for data in bus_data:
        month = int(data['month'])
        series[month - 1] = data['count']
    
    return JsonResponse({
        'categories': categories,
        'series': series
    })

def UserCreationStats(request):
    # Query the user data grouped by month using SQLite's strftime function
    user_data = User.objects.extra(
        select={'month': "strftime('%m', date_joined)"}
    ).values('month').annotate(count=Count('id')).order_by('month')

    # Format the data for the chart
    categories = [calendar.month_name[i] for i in range(1, 13)]  # List of month names (Jan, Feb, etc.)
    series = [0] * 12  # Initialize series with 0 for each month

    # Populate the series data with the count of users created each month
    for data in user_data:
        month = int(data['month'])
        series[month - 1] = data['count']

    return JsonResponse({
        'categories': categories,
        'series': series
    })

def ReservationCreationStats(request):
    # Query the reservation data grouped by month using SQLite's strftime function
    reservation_data = Reservation.objects.extra(
        select={'month': "strftime('%m', created_at)"}
    ).values('month').annotate(count=Count('id')).order_by('month')

    # Format the data for the chart
    categories = [calendar.month_name[i] for i in range(1, 13)]  # List of month names (Jan, Feb, etc.)
    series = [0] * 12  # Initialize series with 0 for each month

    # Populate the series data with the count of reservations created each month
    for data in reservation_data:
        month = int(data['month'])
        series[month - 1] = data['count']

    return JsonResponse({
        'categories': categories,
        'series': series
    })

def MessageCreationStats(request):
    # Query the message data grouped by month using SQLite's strftime function
    message_data = Message.objects.extra(
        select={'month': "strftime('%m', created_at)"}
    ).values('month').annotate(count=Count('id')).order_by('month')

    # Format the data for the chart
    categories = [calendar.month_name[i] for i in range(1, 13)]  # List of month names (Jan, Feb, etc.)
    series = [0] * 12  # Initialize series with 0 for each month

    # Populate the series data with the count of messages created each month
    for data in message_data:
        month = int(data['month'])
        series[month - 1] = data['count']

    return JsonResponse({
        'categories': categories,
        'series': series
    })

def BusVisits(request):
    # Query all schedules with bus and stops data
    schedules = Schedule.objects.all().select_related('bus')

    # Count the number of times each bus appears in the schedules
    bus_counts = Counter(schedule.bus.bus_name for schedule in schedules)

    # Prepare the data for the chart
    chart_data = [{
        'label': bus_name,
        'value': count
    } for bus_name, count in bus_counts.items()]

    return JsonResponse({'series': chart_data})

def PaymentMethodStats(request):
    # Regex pattern for UUIDs (Ewallet)
    uuid_pattern = r'^[a-f0-9\-]{36}$'

    # Filter reservations based on the payment method (Stripe vs Ewallet)
    stripe_reservations = Reservation.objects.filter(payment_id__startswith='cs_test_')
    
    # Use regex to identify Ewallet transactions (UUID format)
    ewallet_reservations = Reservation.objects.filter(payment_id__regex=uuid_pattern)

    # Grouping by month using TruncMonth
    stripe_month_counts = stripe_reservations.annotate(month=TruncMonth('created_at')).values('month').annotate(count=Count('id')).order_by('month')
    ewallet_month_counts = ewallet_reservations.annotate(month=TruncMonth('created_at')).values('month').annotate(count=Count('id')).order_by('month')

    # Prepare the chart data
    categories = [calendar.month_name[i] for i in range(1, 13)]
    
    stripe_series = [0] * 12
    ewallet_series = [0] * 12

    # Populate Stripe data
    for data in stripe_month_counts:
        month = data['month'].month  # Get the month part of the date
        stripe_series[month - 1] = data['count']

    # Populate Ewallet data
    for data in ewallet_month_counts:
        month = data['month'].month  # Get the month part of the date
        ewallet_series[month - 1] = data['count']

    # Return the data as JSON for chart rendering
    return JsonResponse({
        'categories': categories,
        'series': [
            {'name': 'Stripe', 'data': stripe_series},
            {'name': 'Ewallet', 'data': ewallet_series}
        ]
    })

def ReservationStatusStats(request):
    # Filter reservations based on status
    completed_reservations = Reservation.objects.filter(status='completed')
    cancelled_reservations = Reservation.objects.filter(status='cancelled')

    # Group by month using TruncMonth
    completed_month_counts = completed_reservations.annotate(month=TruncMonth('created_at')).values('month').annotate(count=Count('id')).order_by('month')
    cancelled_month_counts = cancelled_reservations.annotate(month=TruncMonth('created_at')).values('month').annotate(count=Count('id')).order_by('month')

    # Prepare the chart data
    categories = [calendar.month_name[i] for i in range(1, 13)]  # Names of months
    
    completed_series = [0] * 12  # Initialize an array for completed reservations
    cancelled_series = [0] * 12  # Initialize an array for cancelled reservations

    # Populate completed reservation data
    for data in completed_month_counts:
        month = data['month'].month  # Get the month part of the date
        completed_series[month - 1] = data['count']

    # Populate cancelled reservation data
    for data in cancelled_month_counts:
        month = data['month'].month  # Get the month part of the date
        cancelled_series[month - 1] = data['count']

    # Return the data in a format that can be used for rendering the chart
    return JsonResponse({
        'categories': categories,
        'series': [
            {'name': 'Completed', 'data': completed_series},
            {'name': 'Cancelled', 'data': cancelled_series}
        ]
    })

def UpcomingReservations(request):
    # Get the current time in Asia/Kolkata timezone
    current_time = timezone.now().astimezone(pytz.timezone('Asia/Kolkata'))

    # Query all reservations for the authenticated user
    user = request.user
    reservations = Reservation.objects.filter(user=user)

    # Prepare the list for upcoming reservations
    upcoming_reservations = []

    # Loop through reservations and filter those that are upcoming
    for reservation in reservations:
        try:
            # Get the correct departure date based on the booking date
            booking_date = reservation.booking_date  # e.g., "2025-04-30"
            departure_time_str = reservation.departure_time  # e.g., "08:00:00"
            
            # Combine booking_date with the departure_time to form a complete datetime
            departure_datetime = datetime.strptime(f"{booking_date} {departure_time_str}", "%Y-%m-%d %H:%M:%S")
            
            # Localize the datetime to Asia/Kolkata timezone
            departure_datetime = pytz.timezone('Asia/Kolkata').localize(departure_datetime)

            # Debugging: Log comparison times
            print(f"Current time: {current_time}")
            print(f"Departure time for reservation {reservation.id}: {departure_datetime}")

            # Check if the departure datetime is greater than or equal to current_time
            if departure_datetime >= current_time:
                upcoming_reservations.append(reservation)
            else:
                print(f"Reservation {reservation.id} is skipped (departure time is earlier than current time).")

        except ValueError:
            # Handle invalid departure_time format
            print(f"Invalid departure_time format for reservation {reservation.id}.")
            pass

    # Log filtered upcoming reservations
    print(f"Upcoming reservations after filtering: {[r.id for r in upcoming_reservations]}")

    # Sort the upcoming reservations by departure_datetime (time)
    upcoming_reservations.sort(key=lambda r: pytz.timezone('Asia/Kolkata').localize(
        datetime.strptime(r.departure_time, "%H:%M:%S").replace(
            year=current_time.year,
            month=current_time.month,
            day=current_time.day
        )
    ))

    # Limit the list to 5 upcoming reservations
    upcoming_reservations = upcoming_reservations[:5]

    # Prepare the response data
    data = [{
        'id': reservation.id,
        'departure_time': reservation.departure_time,
        'departure_date': reservation.booking_date,
        'departure_stop': reservation.departure_stop,
        'arrival_stop': reservation.arrival_stop,
        'reserved_seats': reservation.reserved_seats,
        'amount': reservation.amount,
    } for reservation in upcoming_reservations]

    return JsonResponse({'upcoming_reservations': data})