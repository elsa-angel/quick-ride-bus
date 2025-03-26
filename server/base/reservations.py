from django.contrib.auth.decorators import login_required  
from django.http import JsonResponse
from base.models import Reservation,Schedule,User,Booking,Ewallet,Transaction
from django.shortcuts import get_object_or_404
from django.db import transaction as db_transaction
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

import json

def ReservationView(request):
    if request.method == 'GET':
        try:
            # Fetch the reservations for the authenticated user
            user = request.user  # Assuming you're using Django's built-in User model for authentication
            reservations = Reservation.objects.filter(user=user)  # Filter reservations by user

            # Prepare the response data
            reservation_data = []

            for reservation in reservations:
                reservation_data.append({
                    'id': reservation.id,
                    'schedule_id': reservation.schedule.id,
                    "bus_name": reservation.schedule.bus.bus_name,
                    'username': reservation.user.first_name,

                    'user_id': reservation.user.id,
                    'payment_id': reservation.payment_id,
                    'departure_stop': reservation.departure_stop,
                    'departure_time': reservation.departure_time,
                    'arrival_stop': reservation.arrival_stop,
                    'arrival_time': reservation.arrival_time,
                    'reserved_seats': reservation.reserved_seats,
                    'amount': reservation.amount,
                    'status': reservation.status,
                    'qr_code': reservation.qr_code,
                    'booking_date': reservation.booking_date,
                    'created_at': reservation.created_at,
                    'updated_at': reservation.updated_at,
                })

            return JsonResponse({'reservations': reservation_data}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)

            schedule_id = data['schedule_id']
            user_id = data['user_id']
            payment_id = data['payment_id']
            amount = data['amount']
            status = data['status']
            departure_stop = data['departure_stop']
            departure_time = data['departure_time']
            arrival_stop = data['arrival_stop']
            arrival_time = data['arrival_time']
            reserved_seats = data['reserved_seats']
            booking_date = data['booking_date']
            qr_code = data.get('qr_code', 'null') 

            # Fetch the related schedule and user
            schedule = Schedule.objects.get(id=schedule_id)
            user = User.objects.get(id=user_id)

            # Create a new Reservation object
            reservation = Reservation.objects.create(
                schedule=schedule,
                user=user,
                payment_id=payment_id,
                amount=amount,
                status=status,
                departure_stop=departure_stop,
                departure_time=departure_time,
                arrival_stop=arrival_stop,
                arrival_time=arrival_time,
                reserved_seats=reserved_seats,
                booking_date=booking_date,
                qr_code=qr_code
            )
            
            # Return a success response with the reservation ID
            return JsonResponse({
                'reservation_id': reservation.id,
                'message': 'Reservation created successfully',
            }, status=201)

        except Schedule.DoesNotExist:
            return JsonResponse({"error": "Schedule not found"}, status=404)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except KeyError as e:
            return JsonResponse({"error": f"Missing required field: {str(e)}"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)

def ReservedSeatsView(request, booking_id):
    try:
        # Retrieve the booking object using booking_id
        booking = get_object_or_404(Booking, id=booking_id)
        
        # Get the schedule_id and other booking details
        schedule_id = booking.schedule.id
        booking_date = booking.booking_date
        departure_stop = booking.departure_stop
        arrival_stop = booking.arrival_stop

        # Get the schedule object associated with the booking
        schedule = get_object_or_404(Schedule, id=schedule_id)
        stops = schedule.stops.split(',')  # Assuming stops are stored as comma-separated values

        # Retrieve the reservations that overlap with this booking's departure and arrival stops
        existing_reservations = Reservation.objects.filter(
            schedule_id=schedule_id,
            booking_date=booking_date,
            status__in=['paid', 'started']  # Only considering 'paid' or 'started' reservations
        )

        # Filter the reservations based on whether their departure and arrival stops overlap
        filtered_reservations = []
        for reservation in existing_reservations:
            departure_index = stops.index(reservation.departure_stop)
            arrival_index = stops.index(reservation.arrival_stop)

            current_departure_index = stops.index(departure_stop)
            current_arrival_index = stops.index(arrival_stop)

            # Check for overlapping reservation (whether the stop ranges intersect)
            if not (current_departure_index >= arrival_index or current_arrival_index <= departure_index):
                filtered_reservations.append(reservation)

        # Extract reserved seats for the filtered reservations
        reserved_seats = []
        for reservation in filtered_reservations:
            reserved_seats += reservation.reserved_seats.split(',')  # Assuming reserved_seats is a comma-separated string

        # Remove duplicate seats from the list
        blocked_seats = list(set(reserved_seats))

        # Return the result including the blocked seats
        return JsonResponse({
            'schedule_id': schedule_id,
            'booking_date': booking_date,
            'reserved_seats': blocked_seats,  # List of blocked/reserved seats
        })

    except Booking.DoesNotExist:
        return JsonResponse({'message': 'Booking details not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

# def ReservedSeatsView(request, booking_id):
#     try:
#         # Retrieve the booking object using booking_id
#         booking = get_object_or_404(Booking, id=booking_id)
        
#         # Get the schedule_id, booking_date, departure_stop, and arrival_stop from the booking
#         schedule_id = booking.schedule.id
#         booking_date = booking.booking_date
#         departure_stop = booking.departure_stop
#         arrival_stop = booking.arrival_stop

#         # Retrieve the schedule object associated with the booking
#         schedule = get_object_or_404(Schedule, id=schedule_id)
#         stops = schedule.stops.split(',')  # Assuming stops are stored as comma-separated values

#         # Retrieve the reservations that overlap with this booking's departure and arrival stops
#         existing_reservations = Reservation.objects.filter(
#             schedule_id=schedule_id,
#             booking_date=booking_date,
#             status__in=['paid', 'started']  # Only considering 'paid' or 'started' reservations
#         )

#         # Filter the reservations based on whether their departure and arrival stops overlap
#         filtered_reservations = []
#         for reservation in existing_reservations:
#             departure_index = stops.index(reservation.departure_stop)
#             arrival_index = stops.index(reservation.arrival_stop)

#             current_departure_index = stops.index(departure_stop)
#             current_arrival_index = stops.index(arrival_stop)

#             # Check for overlapping reservation (whether the stop ranges intersect)
#             if not (current_departure_index >= arrival_index or current_arrival_index <= departure_index):
#                 filtered_reservations.append(reservation)

#         # Extract reserved seats for the filtered reservations
#         reserved_seats = []
#         for reservation in filtered_reservations:
#             reserved_seats += reservation.reserved_seats.split(',')  # Assuming reserved_seats is a comma-separated string

#         # Extract seats already reserved by the booking itself (from the booking model)
#         reserved_seats += booking.reserved_seats.split(',')

#         # Remove duplicate seats from the list
#         blocked_seats = list(set(reserved_seats))

#         # Return the result including the blocked seats
#         return JsonResponse({
#             'schedule_id': schedule_id,
#             'booking_date': booking_date,
#             'reserved_seats': blocked_seats,  # List of blocked/reserved seats
#         })

#     except Booking.DoesNotExist:
#         return JsonResponse({'message': 'Booking details not found'}, status=404)
#     except Schedule.DoesNotExist:
#         return JsonResponse({'message': 'Schedule not found'}, status=404)
#     except Reservation.DoesNotExist:
#         return JsonResponse({'message': 'Reservation not found'}, status=404)
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=400)

@login_required
def ReservationCancel(request, reservation_id):
    try:
        with db_transaction.atomic():
            reservation = get_object_or_404(Reservation, id=reservation_id, user=request.user)
            
            reservation.status = 'cancelled'
            reservation.save()

            ewallet, created = Ewallet.objects.get_or_create(user=request.user, defaults={'balance': 0})

            amount_to_refund = int(reservation.amount)  

            ewallet.balance += amount_to_refund
            ewallet.save()

            transaction = Transaction.objects.create(
                ewallet=ewallet,
                title=f"Refund for reservation ID {reservation.id}",
                amount=amount_to_refund,  
                type='C',  
                description="Refund for cancelled booking.",
                status='Success' 
            )

            
            return JsonResponse({
                'message': 'Reservation successfully cancelled and refund processed.',
                'refund_amount': amount_to_refund  # Return the refund amount as an integer
            }, status=200)

    except Exception as e:
        db_transaction.rollback()
        return JsonResponse({"error": f"An error occurred while cancelling the reservation: {str(e)}"}, status=500)
    
# @api_view(['GET'])
# def TransactionsView(request):
#     try:
#         # Check if the user is authenticated
#         if not request.user.is_authenticated:
#             return JsonResponse({'error': 'User not authenticated'}, status=401)

#         # Get the currently authenticated user
#         user = request.user

#         # Retrieve the user's e-wallet
#         ewallet = get_object_or_404(Ewallet, user=user)

#         # Retrieve transactions associated with the user's e-wallet
#         transactions = Transaction.objects.filter(ewallet=ewallet).order_by('-created_at')

#         # Prepare the transaction data in a format suitable for the frontend
#         transaction_data = []
#         for transaction in transactions:
#             transaction_data.append({
#                 'title': transaction.title,
#                 'vendor': transaction.description,  # Assuming the description contains the vendor info
#                 'date': transaction.created_at.isoformat(),  # ISO formatted date
#                 'amount': transaction.amount,
#                 'currency': '₹',  # Assuming INR for simplicity
#                 'action': transaction.type,
#             })

#         return Response(transaction_data)

#     except Exception as e:
#         return JsonResponse({'error': 'An error occurred: ' + str(e)}, status=500)

@login_required
def TransactionsView(request):
    if request.method == 'GET':
        try:
            # Fetch the currently authenticated user
            user = request.user

            # Retrieve the user's e-wallet
            ewallet = get_object_or_404(Ewallet, user=user)

            # Retrieve transactions associated with the e-wallet
            transactions = Transaction.objects.filter(ewallet=ewallet).order_by('-created_at')

            # Prepare the response data
            transaction_data = []

            for transaction in transactions:
                transaction_data.append({
                    'title': transaction.title,
                    'vendor': transaction.description,  # Assuming 'description' contains the vendor info
                    'date': transaction.created_at.isoformat(),  # ISO formatted date
                    'amount': transaction.amount,
                    'currency': '₹',  # Assuming INR for simplicity
                    'action': transaction.type,  # 'credit' or 'debit'
                })

            # Return the transaction data as JSON
            return JsonResponse({'transactions': transaction_data}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)