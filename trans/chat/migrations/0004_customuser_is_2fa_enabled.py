# Generated by Django 5.0.1 on 2024-02-11 17:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_alter_customuser_blockeds_alter_customuser_friends'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='is_2fa_enabled',
            field=models.BooleanField(default=False),
        ),
    ]
