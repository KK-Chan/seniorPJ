# Generated by Django 4.1.7 on 2023-08-04 01:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('testapp', '0002_asanadong5179_asangridpop_asanslib_delete_adminsgg_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='AsanAccessibility',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, db_column='Name', max_length=100, null=True)),
                ('x', models.IntegerField(blank=True, db_column='X', null=True)),
                ('y', models.IntegerField(blank=True, db_column='Y', null=True)),
                ('pop', models.IntegerField(blank=True, db_column='Pop', null=True)),
                ('case', models.IntegerField(blank=True, db_column='Case', null=True)),
            ],
            options={
                'db_table': 'asan_accessibility',
                'managed': False,
            },
        ),
        migrations.AlterModelTable(
            name='asanadong5179',
            table='asan_adong_5179',
        ),
        migrations.AlterModelTable(
            name='asangridpop',
            table='asan_grid_pop',
        ),
        migrations.AlterModelTable(
            name='asanslib',
            table='asan_slib',
        ),
    ]