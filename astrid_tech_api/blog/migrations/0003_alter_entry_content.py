# Generated by Django 3.2.4 on 2021-06-18 02:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_auto_20210618_0119'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entry',
            name='content',
            field=models.TextField(blank=True, default=''),
        ),
    ]
