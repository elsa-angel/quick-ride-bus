from base.models import *
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.conf import settings
import requests
from datetime import datetime

from django.views.decorators.csrf import csrf_protect,csrf_exempt
import json
from base.models import Bus,Schedule

@csrf_exempt
def ScheduleCoordinatesView(request):
    if request.method == 'GET':
        try:
            # Fetch all schedule objects
            schedules = Schedule.objects.all()  
            # Or filter by specific conditions if needed
            
            # Prepare the response data
            schedule_data = []

            for schedule in schedules:
                # Extract coordinates from the 'stops_coordinates' field
                coordinates_str = schedule.stops_coordinates
                
                # Remove curly braces, trim any trailing commas, and split by '},{' to separate coordinate pairs
                coordinates = coordinates_str.strip('{}').split('},{')  # Split by '},{' to separate coordinate pairs

                # Clean and convert coordinates (strip spaces and handle possible extra characters)
                coordinates = [
                    tuple(map(lambda x: float(x.strip()), coord.replace(' ', '').strip('},').split(':')))  # Clean up spaces and remove trailing '}'
                    for coord in coordinates
                ]
                
                schedule_data.append({
                    'id': schedule.id,
                    'bus_id': schedule.bus.id,
                    'stops_coordinates': coordinates,  # List of tuples (latitude, longitude)
                    'stops': schedule.stops,
                    'stops_timings': schedule.stops_timings,
                    'running_days': schedule.running_days,
                    'created_at': schedule.created_at,
                    'updated_at': schedule.updated_at,
                })

            return JsonResponse({'schedules': schedule_data}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        

def Buses(request):
    if request.method == 'GET':
        try:
          
            buses = Bus.objects.all()  
           
            bus_data = []

            for bus in buses:
                bus_data.append({
                    'id': bus.id,
                    'bus_name': bus.bus_name,
                   
                })

            return JsonResponse({'buses': bus_data}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        
def BusDetails(request, bus_id):
    if request.method == 'GET':
        try:
            current_day = datetime.now().strftime('%A')

            schedules = Schedule.objects.filter(bus=bus_id, running_days__icontains=current_day)

            schedule_data = []

            for schedule in schedules:
                coordinates = eval(schedule.stops_coordinates)  

                transformed_coordinates = [
                    [float(lat), float(lng)]  
                    for coord in coordinates
                    for lat, lng in coord.items()  
                ]

                schedule_data.append({
                    'bus_id': bus_id,
                    'stops': schedule.stops,
                    'stops_timings': schedule.stops_timings,
                    'stops_distance': schedule.stops_distance,
                    'running_days': schedule.running_days,
                    'coordinates': transformed_coordinates,  
                })

            return JsonResponse({'schedules': schedule_data}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        
