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