# Generated by Django 4.2.5 on 2023-10-27 07:33

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('testapp', '0011_경관지구_아산시_5179_국토계획_아산시_5179_도시지역_아산시_5179_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='경관지구_분류_아산_5179',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(blank=True, null=True, srid=5179)),
                ('코드값', models.CharField(blank=True, max_length=80, null=True)),
                ('코드값의미', models.CharField(blank=True, max_length=80, null=True)),
                ('mnum', models.CharField(blank=True, max_length=80, null=True)),
            ],
            options={
                'db_table': '경관지구_분류_아산_5179',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='국토계획_분류_아산_5179',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(blank=True, null=True, srid=5179)),
                ('코드값', models.CharField(blank=True, max_length=80, null=True)),
                ('코드값의미', models.CharField(blank=True, max_length=80, null=True)),
                ('mnum', models.CharField(blank=True, max_length=80, null=True)),
            ],
            options={
                'db_table': '국토계획_분류_아산_5179',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='도시지역_분류_아산_5179',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(blank=True, null=True, srid=5179)),
                ('코드값', models.CharField(blank=True, max_length=80, null=True)),
                ('코드값의미', models.CharField(blank=True, max_length=80, null=True)),
                ('mnum', models.CharField(blank=True, max_length=80, null=True)),
            ],
            options={
                'db_table': '도시지역_분류_아산_5179',
                'managed': False,
            },
        ),
        migrations.DeleteModel(
            name='경관지구_아산시_5179',
        ),
        migrations.DeleteModel(
            name='국토계획_아산시_5179',
        ),
        migrations.DeleteModel(
            name='도시지역_아산시_5179',
        ),
    ]
