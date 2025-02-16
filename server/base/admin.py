from django.contrib import admin
from .models import Bus,Schedule

# Register your models here.

class BusAdmin(admin.ModelAdmin):
    list_display = ('bus_name', 'num_seats', 'created_at', 'updated_at')
    search_fields = ('bus_name',)
    list_filter = ('created_at', 'updated_at')

class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('bus', 'stops', 'running_days', 'created_at', 'updated_at')
    search_fields = ('bus__bus_name', 'stops', 'running_days')
    list_filter = ('created_at', 'updated_at')

admin.site.register(Bus, BusAdmin)
admin.site.register(Schedule, ScheduleAdmin)