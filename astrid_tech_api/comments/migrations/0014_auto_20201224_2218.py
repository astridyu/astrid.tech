# Generated by Django 3.1.4 on 2020-12-24 22:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0013_auto_20201224_2217'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='bannedip',
            options={'verbose_name': 'banned IP'},
        ),
    ]
