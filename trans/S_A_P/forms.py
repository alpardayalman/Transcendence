from django import forms
from .models import YourModel
from django.contrib.auth.forms import UserCreationForm
# from django.contrib.auth.models import User
from chat.models import CustomUser

class YourModelForm(forms.ModelForm):
    class Meta:
        model = YourModel
        fields = ('field1', 'field2', 'field3', 'field4', 'priority', 'field6', 'email')

class CreateUserForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name', 'last_name', 'password1', 'password2']