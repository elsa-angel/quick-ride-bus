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

from django.middleware.csrf import get_token

from django.views.decorators.csrf import csrf_protect,csrf_exempt
import json
from base.models import Schedule,Booking,Message,Reservation
from datetime import datetime

def SearchScheduleView(request):
    # import rpdb; rpdb.set_trace()

    if request.method == 'POST':
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

        user_id = request.user.id if request.user.is_authenticated else None

        # Filter schedules by matching from_city, to_city, date, and time
        schedules = Schedule.objects.filter(
            stops__icontains=from_city,
        ).filter(
            stops__icontains=to_city
        ).filter(
            running_days__icontains=weekday,
        )

        available_schedules = []
        for schedule in schedules:
            stop_timings = schedule.stops_timings.split(',')
            stops = schedule.stops.split(',')
            
            stop_times_dict = {}
            from_time = None
            to_time = None

            if from_city in stops and to_city in stops:
                from_index = stops.index(from_city)
                to_index = stops.index(to_city)
                
                if from_index < to_index:  # "from" should come before "to"
                    for idx, stop_time in enumerate(stop_timings):
                        stop_time_obj = None
                        try:
                            stop_time_obj = datetime.strptime(stop_time.strip(), "%H:%M").time()
                            stop_times_dict[stops[idx]] = stop_time_obj
                            if stops[idx] == from_city:
                                from_time = stop_time_obj
                            elif stops[idx] == to_city:
                                to_time = stop_time_obj
                        except ValueError:
                            continue

                    if from_time and to_time:
                        # Compare the stop times to the search time
                        if from_time <= search_datetime.time() <= to_time:
                            # Calculate time difference
                            time_difference = datetime.combine(datetime.today(), to_time) - datetime.combine(datetime.today(), from_time)

                            # Calculate fare (distanceAtTo - distanceAtFrom)
                            from_index = stops.index(from_city)
                            to_index = stops.index(to_city)

                            distance_at_from = schedule.stops_distance.split(',')[from_index]  # Assuming stops_distance contains comma-separated distances
                            distance_at_to = schedule.stops_distance.split(',')[to_index]

                            try:
                                distance_at_from = float(distance_at_from)
                                distance_at_to = float(distance_at_to)
                                fare = 10 * (distance_at_to - distance_at_from)
                            except ValueError:
                                fare = 0  # In case of invalid distance format

                            available_schedules.append({
                                "schedule": schedule,
                                "from_time": from_time,
                                "to_time": to_time,
                                "time_difference": time_difference,
                                "fare": fare,
                                "user_id": user_id
                            })
                else:
                    continue
            else:
                continue

        if not available_schedules:
            return JsonResponse({"message": "No schedules found matching your criteria."}, status=404)

        # Format the schedules for the response
        response_data = {
            "schedules": [
                {
                    "id": schedule['schedule'].id,
                    "user_id": schedule['user_id'],
                    "bus_name": schedule['schedule'].bus.bus_name,
                    "from": from_city,
                    "to": to_city,
                    "date": date,
                    "from_time": str(schedule['from_time']),
                    "to_time": str(schedule['to_time']),
                    "time_difference": str(schedule['time_difference']),
                    "fare": schedule['fare'],
                }
                for schedule in available_schedules
            ]
        }

        return JsonResponse(response_data, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=405)