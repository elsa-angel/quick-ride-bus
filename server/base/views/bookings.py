from django.views.decorators.csrf import csrf_protect,csrf_exempt
import json
from base.models import Schedule,Booking
from base.models import *
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.conf import settings
import requests


def BookingView(request):
    # import rpdb; rpdb.set_trace()

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            schedule_id = data['schedule_id']
            user_id = data['user_id']
            booking_date = data['booking_date']
            departure_stop = data['departure_stop']
            arrival_stop = data['arrival_stop']
            fare = data['fare']
            reserved_seats = data.get('reserved_seats', 'null')  
            departure_time = data['departure_time']
            arrival_time = data['arrival_time']
            
            schedule = Schedule.objects.get(id=schedule_id)

            booking = Booking.objects.create(
                schedule=schedule,
                user_id=user_id,
                amount=fare,  
                reserved_seats=reserved_seats,
                departure_stop=departure_stop,
                departure_time=departure_time,
                arrival_stop=arrival_stop,
                arrival_time=arrival_time,
                booking_date=booking_date
            )
            
            return JsonResponse({
                'booking_id': booking.id,
                'message': 'Booking created successfully',
            }, status=201)

        except Schedule.DoesNotExist:
            return JsonResponse({"error": "Schedule not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)


def BookingDetailsView(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
        response_data = {
            'booking_id': booking.id,
            'user_id': booking.user.id,
            'schedule': {
                'id': booking.schedule.id,
                'bus': {
                    'bus_name': booking.schedule.bus.bus_name,
                    'num_seats': booking.schedule.bus.num_seats,
                },
                # Add more details here if needed
            },
            'departure_stop': booking.departure_stop,
            'departure_time': booking.departure_time,
            'arrival_stop': booking.arrival_stop,
            'arrival_time': booking.arrival_time,
            'reserved_seats': booking.reserved_seats,
            'amount': booking.amount,
            'booking_date': booking.booking_date,
        }
        return JsonResponse(response_data)

    except Booking.DoesNotExist:
        return JsonResponse({"error": "Booking not found"}, status=404)
    

def UpdateBookingSeatsView(request, booking_id):
    try:
        # Parse the JSON data from request.body
        data = json.loads(request.body)
        
        # Fetch the booking object
        booking = get_object_or_404(Booking, id=booking_id)

        # Get the reserved seats from the parsed data
        reserved_seats = data.get('reserved_seats')
        
        if reserved_seats is not None:
            # Update the reserved_seats field on the booking
            booking.reserved_seats = reserved_seats
            booking.save()

        return JsonResponse({'message': 'Booking updated successfully'}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)