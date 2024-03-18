# Generated by Django 4.2.9 on 2024-03-09 22:32

import Chat.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Chat', '0009_customuser_is_42_student'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='profile_picture',
            field=models.ImageField(blank=True, default='default/default.jpg', null=True, upload_to=Chat.models.CustomUser.where_to_upload),
        ),
    ]