# Generated by Django 3.2.4 on 2021-06-20 16:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('printer3d', '0001_squashed_0002_auto_20210201_0427'),
    ]

    operations = [
        migrations.AlterField(
            model_name='printer',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
