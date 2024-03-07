# Generated by Django 4.2.9 on 2024-03-07 12:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Api', '0003_match'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='UserOne',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='UserOne', to=settings.AUTH_USER_MODEL, unique=True),
        ),
    ]
