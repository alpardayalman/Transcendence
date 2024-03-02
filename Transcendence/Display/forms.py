from django import forms
from Display.models import YourModel
from django.contrib.auth.forms import UserCreationForm
# from django.contrib.auth.models import User
from Chat.models import CustomUser

class YourModelForm(forms.ModelForm):
    class Meta:
        model = YourModel
        fields = ('field1', 'field2', 'field3', 'field4', 'priority', 'field6', 'email')

class CreateUserForm(UserCreationForm):

    class Meta:
        profile_photo = forms.ImageField(required=False, label='Profile Photo')
        model = CustomUser
        fields = ['username', 'email', 'first_name', 'last_name', 'password1', 'password2', 'profile_photo']
    
    def save(self, commit=True):
        user = super().save()
        print("31user= ", user)
        print("self.cleaned_data= ", self.cleaned_data)
        if self.cleaned_data['profile_photo']:
            print("\n\nprofile_photo= ", self.cleaned_data['profile_photo'])
            user.profile_photo = self.cleaned_data['profile_photo']
        if commit:
            user.save()
        return user