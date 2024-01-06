from django.contrib import admin
from .models import Room, Message, CustomUser

# Register your models here.

admin.site.register(Room)
# admin.site.register(User)
admin.site.register(Message)
admin.site.register(CustomUser)