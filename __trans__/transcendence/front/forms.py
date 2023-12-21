from django import forms
from .models import user

class UserForm(forms.ModelForm):
    class Meta:
        model = user
        fields = ['fname', 'lname', 'email', 'nickname', 'password']