from django.contrib import admin
from .models import Bus,Schedule,Message,Booking,Reservation,Ewallet,Transaction

# Register your models here.

class BusAdmin(admin.ModelAdmin):
    list_display = ('bus_name', 'num_seats', 'created_at', 'updated_at')
    search_fields = ('bus_name',)
    list_filter = ('created_at', 'updated_at')

class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('bus', 'stops','stops_timings', 'stops_distance','running_days', 'created_at', 'updated_at')
    search_fields = ('bus__bus_name', 'stops','stops_timings', 'stops_distance','running_days')
    list_filter = ('created_at', 'updated_at')


class MessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email','message', 'created_at', 'updated_at')
    search_fields = ('email',)
    list_filter = ('created_at', 'updated_at')

class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'schedule', 'user', 'amount', 'reserved_seats', 'departure_stop', 'departure_time', 'arrival_stop', 'arrival_time', 'booking_date', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')

class ReservationAdmin(admin.ModelAdmin):
    list_display = ('id', 'schedule', 'user', 'payment_id', 'departure_stop', 'departure_time', 'arrival_stop', 'arrival_time', 'reserved_seats', 'amount', 'status', 'qr_code', 'booking_date', 'created_at', 'updated_at')
    search_fields = ('user__username', 'payment_id', 'departure_stop', 'arrival_stop', 'status') 
    list_filter = ('status', 'created_at')  

class EwalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance', 'created_at', 'updated_at')  
    search_fields = ('user__username',)  
    list_filter = ('created_at',)  

class TransactionAdmin(admin.ModelAdmin):
    list_display = ('ewallet', 'type', 'title', 'amount', 'status', 'created_at', 'updated_at')
    search_fields = ('ewallet__user__username', 'title') 
    list_filter = ('status', 'created_at')

admin.site.register(Bus, BusAdmin)
admin.site.register(Schedule, ScheduleAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(Booking, BookingAdmin)
admin.site.register(Reservation, ReservationAdmin)
admin.site.register(Ewallet, EwalletAdmin)
admin.site.register(Transaction, TransactionAdmin)