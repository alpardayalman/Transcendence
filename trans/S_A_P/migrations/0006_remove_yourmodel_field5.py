# Generated by Django 4.2.8 on 2023-12-22 16:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('S_A_P', '0005_alter_yourmodel_field5'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='yourmodel',
            name='field5',
        ),
    ]