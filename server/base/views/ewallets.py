from base.models import *
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.conf import settings
import requests
from datetime import datetime
from django.contrib.auth.decorators import login_required  
from rest_framework.response import Response
from django.db import transaction
from django.utils import timezone
import uuid

from django.views.decorators.csrf import csrf_protect,csrf_exempt
import json
from base.models import Reservation,Schedule,User,Booking,Ewallet,Transaction
from django.db import transaction
from django.db import transaction as db_transaction



@login_required
def EwalletUpdateView(request):
    if request.method == "POST":
        try:
            # Parse JSON data from the request body
            data = json.loads(request.body)

            amount = data.get('amount')

            sessionId = data.get('sessionId')

            amount = float(amount)

            if not amount or amount <= 0:
                return JsonResponse({'error': 'Invalid amount'}, status=400)

            user = request.user  

            ewallet = Ewallet.objects.get(user=user)

            # Update the ewallet balance
            ewallet.balance += amount  
            ewallet.save()

            # Create a transaction record
            transaction = Transaction.objects.create(
                ewallet=ewallet,
                type='credit',  
                transaction_rel_id=sessionId,
                title='Recharged',
                amount=amount,
                description='Payment for the user account',
                status='Success'  
            )

            return JsonResponse({
                'message': 'Ewallet balance updated successfully',
                'new_balance': ewallet.balance
            })
        except Ewallet.DoesNotExist:
            return JsonResponse({'error': 'Ewallet not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@login_required
def EwalletPaymentView(request, booking_id):
    try:
        # Fetch the booking
        booking = Booking.objects.get(id=booking_id, user=request.user)
        
        # Calculate total amount (for example, based on number of reserved seats)
        total_amount = int(booking.amount) * len(booking.reserved_seats.split(','))
        
        # Check if user has enough balance in eWallet
        user_ewallet = Ewallet.objects.get(user=request.user)
        if user_ewallet.balance < total_amount:
            return JsonResponse({'error': 'Insufficient eWallet balance'}, status=400)
        
        # Initialize transaction variable
        transaction_record = None
        
        # Deduct amount from eWallet balance (atomic operation)
        with transaction.atomic():
            # Deduct balance
            user_ewallet.balance -= total_amount
            user_ewallet.save()

            # Mark booking as paid
            booking.payment_status = 'Paid'
            booking.save()

            # Create a transaction record
            transaction_id = str(uuid.uuid4())  # Generate a unique transaction ID
            transaction_record = Transaction.objects.create(
                ewallet=user_ewallet,
                transaction_rel_id=transaction_id,  # Correctly use the model attribute
                type='debit',
                title=f"Payment for booking {booking_id}",
                amount=total_amount,
                description='Payment via eWallet',
                status='Completed',  # Consider adding more transaction statuses
            )

        # Check if transaction was created successfully
        if transaction_record:
            return JsonResponse({
                'success': True, 
                'message': 'Payment successful',
                'transaction': {
                    'id': transaction_record.transaction_rel_id,  # Return the correct field
                }
            })
        else:
            return JsonResponse({'error': 'Transaction creation failed'}, status=500)

    except Booking.DoesNotExist:
        return JsonResponse({'error': 'Booking not found'}, status=404)
    
    except Ewallet.DoesNotExist:
        return JsonResponse({'error': 'eWallet not found'}, status=404)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)