from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

# Create your models here.

class Bus(models.Model):
    bus_name = models.CharField(max_length=100)  
    num_seats = models.IntegerField() 
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)   
    
    def __str__(self):
        return self.bus_name
    

class Schedule(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)  
    stops = models.CharField(max_length=255)
    stops_timings = models.CharField(max_length=255)
    stops_distance = models.CharField(max_length=255)
    running_days = models.CharField(max_length=255)
    
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)  

    # def __str__(self):
    #     return self.name

class Message(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # def __str__(self):
    #     return self.name

class Booking(models.Model):
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)  
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    amount = models.CharField(max_length=255) 
    reserved_seats = models.TextField()  
    departure_stop = models.CharField(max_length=255) 
    departure_time = models.CharField(max_length=255)  
    arrival_stop = models.CharField(max_length=255)  
    arrival_time = models.CharField(max_length=255)  
    booking_date = models.CharField(max_length=255)  
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True) 

    # def __str__(self):
    #     return f"Booking {self.id} by {self.user}"

    class Meta:
        db_table = 'Booking'  

class Reservation(models.Model):
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    payment_id = models.CharField(max_length=255)
    departure_stop = models.CharField(max_length=255)
    departure_time = models.CharField(max_length=255)
    arrival_stop = models.CharField(max_length=255)
    arrival_time = models.CharField(max_length=255)
    reserved_seats = models.CharField(max_length=255)
    amount = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    qr_code = models.CharField(max_length=255)
    booking_date = models.CharField(max_length=255)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Reservation {self.id}"