from django.contrib import admin
from .models import YourModel
from .twofa.models import AuthInfo
# Register your models here.
admin.site.register(YourModel)
admin.site.register(AuthInfo)