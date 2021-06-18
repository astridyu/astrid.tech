# Generated by Django 3.2.4 on 2021-06-18 23:57

import blog.models
import datetime
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SyndicationTarget',
            fields=[
                ('id', models.URLField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=50)),
                ('enabled', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.CharField(max_length=32, primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=32)),
                ('color', models.CharField(blank=True, max_length=10)),
                ('background_color', models.CharField(blank=True, max_length=10)),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('title', models.TextField()),
                ('description', models.TextField()),
                ('slug_name', models.TextField()),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('published_date', models.DateTimeField()),
                ('updated_date', models.DateTimeField()),
                ('content', models.TextField()),
                ('tags', models.ManyToManyField(to='blog.Tag')),
            ],
        ),
        migrations.CreateModel(
            name='Entry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('title', models.CharField(blank=True, max_length=128, null=True)),
                ('slug_name', models.CharField(blank=True, max_length=64, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('created_date', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('published_date', models.DateTimeField(blank=True, default=datetime.datetime.now, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('deleted_date', models.DateTimeField(blank=True, null=True)),
                ('date', models.DateField(default=datetime.datetime.now)),
                ('ordinal', models.IntegerField(default=blog.models.default_entry_ordinal)),
                ('reply_to', models.URLField(blank=True, null=True)),
                ('location', models.URLField(blank=True, null=True)),
                ('repost_of', models.URLField(blank=True, null=True)),
                ('content_type', models.CharField(default='text/markdown', max_length=127)),
                ('content', models.TextField(blank=True, default='')),
                ('tags', models.ManyToManyField(blank=True, to='blog.Tag')),
            ],
            options={
                'unique_together': {('date', 'ordinal')},
            },
        ),
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField()),
                ('caption', models.TextField(blank=True, null=True)),
                ('spoiler', models.BooleanField(default=False)),
                ('entry', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='blog.entry')),
            ],
        ),
        migrations.CreateModel(
            name='Syndication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('location', models.URLField(blank=True, null=True)),
                ('status', models.CharField(choices=[('SY', 'Syndicated'), ('SC', 'Scheduled'), ('ER', 'Error')], default='SC', max_length=2)),
                ('entry', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='blog.entry')),
                ('target', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.RESTRICT, to='blog.syndicationtarget')),
            ],
            options={
                'unique_together': {('entry', 'target')},
            },
        ),
    ]
