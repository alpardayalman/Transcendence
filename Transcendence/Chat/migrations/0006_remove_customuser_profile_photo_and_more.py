# Generated by Django 4.2.9 on 2024-03-09 16:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Chat', '0005_remove_customuser_avatar'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='profile_photo',
        ),
        migrations.AddField(
            model_name='customuser',
            name='profile_picture',
            field=models.ImageField(default='profile_photo/default.jpg', upload_to='profile_pictures/'),
        ),
    ]
