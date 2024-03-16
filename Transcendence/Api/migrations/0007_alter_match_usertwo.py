# Generated by Django 4.2.9 on 2024-03-16 01:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Api', '0006_alter_match_usertwo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='UserTwo',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='UserTwo', to=settings.AUTH_USER_MODEL),
        ),
    ]
