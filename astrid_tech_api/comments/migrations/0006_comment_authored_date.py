# Generated by Django 3.1.4 on 2020-12-24 21:46

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0005_auto_20201224_2143'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='authored_date',
            field=models.DateField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
