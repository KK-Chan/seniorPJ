from django.urls import path, re_path
from . import views

urlpatterns = [
    re_path(r'soc_data/$', views.soc_data, name='soc_data'),
    re_path(r'pop_data/$', views.pop_data, name='pop_data'),
    re_path(r'grid_point/$', views.grid_point, name='grid_point'),

    re_path(r'export_point/$', views.export_point, name='export_point'),
    re_path(r'polygon_data/$', views.polygon_data, name='polygon_data'),
    re_path(r'ex_polygon_data/$', views.ex_polygon_data, name='ex_polygon_data'),

    re_path(r'point_data/$', views.point_data, name='point_data'),
    re_path(r'point_data_ta/$', views.point_data_ta, name='point_data_ta'),


    re_path(r'bu_polygon_data/$', views.bu_polygon_data, name='bu_polygon_data'),


    re_path(r'grid_accessibility/$', views.grid_accessibility, name='grid_accessibility'),
    re_path(r'tabletotal_pop/$', views.tabletotal_pop, name='tabletotal_pop'),

    re_path(r'', views.default_map, name='default'),
]