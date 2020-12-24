# Generated by Django 3.1.4 on 2020-12-24 22:16

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0011_auto_20201224_2214'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='authored_date',
            new_name='time_authored',
        ),
        migrations.AddField(
            model_name='bannedemail',
            name='time_banned',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='bannedip',
            name='time_banned',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
