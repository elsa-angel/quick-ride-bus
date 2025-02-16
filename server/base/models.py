from django.db import models

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