# Generated by Django 4.2.8 on 2023-12-22 16:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('S_A_P', '0011_alter_yourmodel_field6'),
    ]

    operations = [
        migrations.AddField(
            model_name='yourmodel',
            name='email',
            field=models.EmailField(default='', max_length=254),
        ),
    ]
