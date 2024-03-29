# Generated by Django 4.2.9 on 2024-02-19 01:07

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='YourModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('field1', models.CharField(default='HELLO', max_length=100)),
                ('field2', models.TextField()),
                ('field3', models.IntegerField()),
                ('field4', models.BooleanField(default=False)),
                ('priority', models.IntegerField(choices=[(0, 'Low'), (1, 'Normal'), (2, 'High')], default=0)),
                ('field6', models.DateTimeField(default=django.utils.timezone.now)),
                ('email', models.EmailField(default='', max_length=254)),
            ],
        ),
    ]
