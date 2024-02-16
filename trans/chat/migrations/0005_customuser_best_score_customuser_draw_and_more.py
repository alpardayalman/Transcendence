# Generated by Django 5.0 on 2024-02-14 19:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0004_customuser_is_2fa_enabled'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='best_score',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='customuser',
            name='draw',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='customuser',
            name='lose',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='customuser',
            name='score',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='customuser',
            name='win',
            field=models.IntegerField(default=0),
        ),
    ]