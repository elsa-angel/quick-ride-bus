from django.core.management.base import BaseCommand
from base.models import Reservation
from datetime import datetime
from django.utils import timezone
import pytz

class Command(BaseCommand):
    help = 'Update reservation statuses based on times'

    def handle(self, *args, **kwargs):
        # Get current time in Asia/Kolkata timezone
        now = timezone.now().astimezone(pytz.timezone('Asia/Kolkata'))
        print(f"Now: {now}")  # For debugging

        def convert_to_datetime(booking_date, time_str):
            if not time_str or not booking_date:
                print(f"Received empty or None value for time_str: {time_str} or booking_date: {booking_date}")  # Debugging output
                return None

            try:
                # Combine the booking_date and time_str into a single datetime string
                full_datetime_str = f"{booking_date} {time_str}"
                print(f"Attempting to convert: '{full_datetime_str}'")  # Debugging output

                # Parse the combined datetime string
                dt = datetime.strptime(full_datetime_str, '%Y-%m-%d %H:%M:%S')

                # Combine the parsed time with the booking date and localize to Asia/Kolkata
                kolkata_tz = pytz.timezone('Asia/Kolkata')
                dt = kolkata_tz.localize(dt)

                print(f"Successfully parsed and localized: {dt}")  # Debugging output
                return dt

            except ValueError as e:
                print(f"Failed to parse datetime: {e}")  # Debugging output
                return None
            except Exception as e:
                print(f"Error in convert_to_datetime: {e}")  # Error logging
                return None

        # Update reservations to 'completed' if arrival_time is less than current time
        reservations_to_complete = Reservation.objects.filter(
            status__in=['paid', 'started']
        )

        for reservation in reservations_to_complete:
            arrival_time = convert_to_datetime(reservation.booking_date, reservation.arrival_time)
            print(f"Reservation ID: {reservation.id}, Arrival Time: {reservation.arrival_time}, Booking Date: {reservation.booking_date}, Converted Arrival Time: {arrival_time}") 

            # Ensure arrival_time is not None and then compare
            if arrival_time and arrival_time < now:
                reservation.status = 'completed'
                reservation.save()

        # Update reservations to 'started' if departure_time is less than current time
        reservations_to_start = Reservation.objects.filter(
            status='paid'
        )

        for reservation in reservations_to_start:
            departure_time = convert_to_datetime(reservation.booking_date, reservation.departure_time)
            if departure_time and departure_time < now:
                reservation.status = 'started'
                reservation.save()

        # Log success message
        self.stdout.write(self.style.SUCCESS('Reservation statuses updated successfully.'))
