from django.db import models

# Create your models here.
class Login(models.Model):
    nickname = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    def __init__(self):
        pass

    def __redr__(self):
        print(f"fname:{self.fname} lname:{self.lname}.")

    def get_name(self):
        return self.name

    def get_age(self):
        return self.age


class Register(models.Model):
    fname = models.CharField(max_length=50)
    lname = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    nickname = models.CharField(max_length=50)
    email = models.CharField(max_length=100)
    def __init__(self):
        pass

    def __redr__(self):
        print(f"fname:{self.fname} lname:{self.lname} age:{self.age}.")

    def __get_name__(self):
        return self.name

    def get_age(self):
        return self.age
