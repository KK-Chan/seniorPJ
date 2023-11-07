from django.shortcuts import render
import numpy as np
import pandas as pd
import geopandas as gpd
from .models import *
from django.http.response import *
from django.http import JsonResponse
from django.contrib.gis.serializers.geojson import Serializer as GeoJSONSerializer
from shapely.wkt import loads as wkt_loads
import json
from shapely.geometry import Point
from django.core.cache import cache
from django.contrib.gis.geos import GEOSGeometry
import math
from django.contrib.gis.db.models.functions import Transform
import time
from datetime import datetime
# Create your views here.
import osmnx as ox
import networkx as nx
import mapbox


 #### 11월 1일자 업데이트 ####
def default_map(request):
    mapbox_access_token = 'pk.eyJ1IjoibWFzNzk4OSIsImEiOiJjbG84ajEwcW8wMW1oMnNxY2tzZmJrengzIn0.6aM-kFV6ZlO5W9-0jkunLw'
    return render(request, 'default.html',
                  {'mapbox_access_token': mapbox_access_token})


def bu_polygon_data(request):
        start_time = datetime .now()  # APIView가 실행되기 전에 시작 시간을 기록

        bu = 지적_아산시_5179.objects.all().annotate(geom4326=Transform('geom', 4326)).values().iterator()
        bu= pd.DataFrame(bu)

        ###### 시간  20~40초 #####
        bu['geom4326'] = bu['geom4326'].apply(lambda x: GEOSGeometry(x).wkt).apply(wkt_loads)
        bu = gpd.GeoDataFrame(bu, geometry='geom4326', crs='EPSG:4326')
        bu = bu.to_json(default=int)
        ###### 시간  #####

        end_time = datetime.now()  # APIView가 실행된 후에 종료 시간을 기록
        execution_time = end_time - start_time  # 실행 시간을 계산
        print(f"Execution Time: {execution_time}")

        # Create the HTTP response with combined JSON data
        response = HttpResponse(content=bu, content_type='application/json')
        response['Content-Disposition'] = 'attachment; filename="bulidingnow.geojson"'

        return response




# 선택박스 뷰 ## 폴리곤
def polygon_data(request):
    if request.method == 'POST':
        selected_city = request.POST.get('city', None)
        if selected_city == '아산시':
            queryset = AsanAdong5179.objects.values('adm_nm')
            geo_1 = AsanAdong5179.objects.all()
        elif selected_city == '인구격자':
            queryset = AsanGridPop.objects.values('gid')
            geo_1 = AsanGridPop.objects.all()
        elif selected_city == '500M격자':
            queryset = 아산시500M인구.objects.values('gid')
            geo_1 = 아산시500M인구.objects.all()
        # GeoJSON 데이터 생성
        geojson_serializer = GeoJSONSerializer()
        geojson_data = geojson_serializer.serialize(geo_1)
        spe_df = pd.DataFrame(queryset)
        print(spe_df)
        return JsonResponse({'queryset': list(queryset), 'geo_1': geojson_data}, safe=False)
    return JsonResponse({'error': 'Invalid request method'})


# point-layer 내보내기
def export_point(request):
    if request.method == 'POST':
        try:
            # 수신된 데이터를 GeoDataFrame으로 변환
            data = json.loads(request.body)
            print(data)

            gdf = gpd.GeoDataFrame.from_features(data)
            gdf = gdf.set_crs('EPSG:4326', allow_override=False)
            print(gdf)

            gdf.to_file('C:/Users/user/OneDrive/바탕 화면/test/test.shp', encoding='cp949')

            # GeoDataFrame을 활용하여 원하는 작업 수행
            # 예: 데이터베이스에 저장하거나 공간 분석 수행

            # 작업 완료 후 응답 반환
            return JsonResponse({'message': 'Data received and processed successfully.'})
        except Exception as e:
            return JsonResponse({'error': str(e)})
    return JsonResponse({'error': 'Invalid request method'})


# 격자 내 시설 수
def grid_point(request):
    if request.method == 'POST':
        try:
            # 수신된 데이터를 GeoDataFrame으로 변환
            data = json.loads(request.body)
            print(data)

            point = data.get('point')
            print(point)

            point_gdf = gpd.GeoDataFrame.from_features(point)
            point_gdf = point_gdf.set_crs('EPSG:4326', allow_override=False)
            point_gdf = point_gdf.to_crs('EPSG:5179')
            print(point_gdf)


            polygon = data.get('polygon')
            print(polygon)

            polygon_gdf = gpd.GeoDataFrame.from_features(polygon)
            polygon_gdf = polygon_gdf.set_crs('EPSG:4326', allow_override=False)
            polygon_gdf = polygon_gdf.to_crs('EPSG:5179')
            print(polygon_gdf)

            sdf = gpd.sjoin(polygon_gdf, point_gdf, how='inner')
            print(sdf)

            # 그룹화하여 시설 수 계산
            facility_count = sdf.groupby('gid').size().reset_index()
            facility_count.columns = ['gid', 'facility_count']
            print(facility_count)

            # 격자 GeoDataFrame을 GeoJSON 형식으로 변환
            result_json = facility_count.to_json(orient='records')
            print(result_json)

            # JSON 형식으로 응답
            return JsonResponse({'facility_count': result_json}, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)})
    return JsonResponse({'error': 'Invalid request method'})



# 인구 버튼 누르면 폴리곤 뽑기
def pop_data(request):
    if request.method == 'POST':
        pop = Asanemdpop.objects.all()
        # GeoJSON 데이터 생성
        geojson_serializer = GeoJSONSerializer()
        pop_data = geojson_serializer.serialize(pop, use_natural_primary_keys=True)

        spe_df = pd.DataFrame(pop)
        # print(spe_df)
        return JsonResponse({'pop': pop_data}, safe=False)
    return JsonResponse({'error': 'Invalid request method'})


# 선택박스 뷰
def soc_data(request):
    if request.method == 'POST':
        soc = 천안아산시_SOC.objects.all().values()
    #print(selected_sig)

    soc_type = pd.DataFrame(soc)
    soc_type = soc_type[soc_type['sgg_nm_k'] == '아산시']
    soc_type['select_type']=soc_type['layer'].str.split("_",expand=True)[1]
    # print(soc_type)
    # 타입 구별
    type = soc_type['select_type'].unique()  # 타입 목록
    # type = sorted(type)
    # 응답 데이터 생성
    type_options = [{'value': e, 'label': e} for e in type]

    # Return the JSON response
    return JsonResponse(type_options, safe=False)


# old = cache.get('selected_types')
# selected_types = request.POST.getlist('point[]', None)
# # print(select)
# cache.set('selected_types', selected_types)
# # print(old)
#
# if len(selected_types) > 1:
#     new_items = list(set(selected_types) - set(old))
#     print(selected_types)
#     print(old)
#     print(new_items)
#     select = new_items[0]
#     # print(select)
# else:
#     print(selected_types)
#     select = selected_types[0]



# 아산시 주변의 도로 네트워크를 다운로드
G = ox.graph_from_place('Asan-si, South Korea', network_type='drive')


# 거리 계산 함수 정의
def calculate_road_distance_with_error_handling(point1, point2, graph):
    try:
        node1 = ox.nearest_nodes(graph, point1[0], point1[1])
        node2 = ox.nearest_nodes(graph, point2[0], point2[1])
        return nx.shortest_path_length(graph, node1, node2, weight='length')
    except nx.NetworkXNoPath:
        return None  # 경로가 없을 경우 None 반환

def calculate_distance(point1, point2):
    # 지구 반지름 (미터)
    radius = 6371000

    # 위도 및 경도를 라디안으로 변환
    lat1 = math.radians(point1[0])
    lon1 = math.radians(point1[1])
    lat2 = math.radians(point2[0])
    lon2 = math.radians(point2[1])

    # 히버니안 공식 계산
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = radius * c

    return distance


def point_data(request):
    if request.method == 'POST':
        old_items = cache.get('selected_types', [])
        selected_types = request.POST.getlist('point[]', None)
        cache.set('selected_types', selected_types)

        if len(selected_types) == 1:
            selected_types = selected_types[0]
        elif len(selected_types) == 0:
            selected_types = None
        elif len(selected_types) < len(old_items):
            selected_types = selected_types[-1]
        else:
            new_items = selected_types
            # print(new_items)
            # print(old_items)
            added_items = [item for item in new_items if item not in old_items]
            # print(added_items)

            selected_types = added_items[0]

        soc = 천안아산시_SOC.objects.all().values()

    soc_type = pd.DataFrame(soc)
    soc_type = soc_type[soc_type['sgg_nm_k'] == '아산시']
    soc_type['soc_type'] = soc_type['layer'].str.split("_", expand=True)[1]

    soc_type_select = soc_type[soc_type['soc_type'] == f'{selected_types}']

    soc_type_select = soc_type_select[['id', 'emd_nm','fac_nm', 'fac_add', 'soc_type','type', 'geom']]

    grid = 아산시500M인구.objects.all().values()
    grid = pd.DataFrame(grid)
    grid['geom'] = grid['geom'].apply(lambda x: wkt_loads(GEOSGeometry(x).wkt))
    grid = gpd.GeoDataFrame(grid, geometry='geom', crs='EPSG:5179')
    grid=grid.to_crs('EPSG:4326')
    soc_type_select['geom'] = soc_type_select['geom'].apply(lambda x: wkt_loads(GEOSGeometry(x).wkt))

    soc_type_select = gpd.GeoDataFrame(soc_type_select, geometry='geom', crs='EPSG:5179')
    soc_type_select = soc_type_select.to_crs('EPSG:4326')
    soc_list = [(i, j) for i, j in zip(list(soc_type_select.geometry.x), list(soc_type_select.geometry.y))]

    soc_index = soc_type_select.fac_nm.to_list()

    grid_point = grid.copy()
    grid_point['geom'] = grid_point.geometry.centroid
    grid_list = [(i, j) for i, j in zip(list(grid_point.geometry.x), list(grid_point.geometry.y))]
    grid_index = grid_point.gid.to_list()


    distances = []

    start = time.time()

    # 각 좌표 쌍 간의 거리를 계산
    # for coord1 in grid_list:
    #     dist_row = []
    #     for coord2 in soc_list:
    #         dist_val = calculate_road_distance_with_error_handling(coord1, coord2, G)
    #         if dist_val is not None:
    #             dist_val_km = round((dist_val / 1000), 2)
    #             dist_row.append(dist_val_km)
    #         else:
    #             dist_row.append(None)  # 경로가 없을 경우 None으로 표시
    #     distances.append(dist_row)

    # 각 좌표 쌍 간의 거리를 계산
    for coord1 in grid_list:
        dist_row = []
        for coord2 in soc_list:
            dist_val = calculate_distance(coord1, coord2)
            if dist_val is not None:
                dist_val_km = round((dist_val / 1000), 2)
                dist_row.append(dist_val_km)
            else:
                dist_row.append(None)  # 경로가 없을 경우 None으로 표시
        distances.append(dist_row)

    # 데이터프레임 생성
    df = pd.DataFrame(distances, index=grid_index, columns=soc_index)
    df['min'] = df.min(axis=1)

    end = time.time()

    print(f"{end - start:.5f}")

    result_df = df[['min']]
    result_df = result_df.reset_index()
    result_df.columns = ['gid', 'distance']
    result_df = pd.merge(grid, result_df, on='gid')
    result_df = result_df[result_df['distance'].notnull()]
    # 뭘집어넣야 될까???



    ## before grid
    result_json = result_df.to_json(default=int)
    # print(result_df)
    # result_df.to_csv( "C:/Users/user/OneDrive/바탕 화면/(B100)국토통계_인구정보-총 인구 수(전체)-(격자) 500M_충청남도 아산시_202304/test.csv",encoding="cp949")

    dis10 = ['주제공원','공연문화시설','노인여가복지시설','종합병원','응급의료시설','보건기관']
    if any(item in selected_types for item in dis10):
        aa = result_df['val'].loc[result_df['distance'] <= 10].sum()
        pp = result_df[result_df['distance'] <= 10]
        pp = pp.describe()
        print(aa)
        cache.set('aa', aa,60*60)
        cache.set('pp', pp ,60*60)
    else:
        aa = result_df['val'].loc[result_df['distance'] <= 0.75].sum()
        pp = result_df[result_df['distance'] <=  0.75]
        pp = pp.describe()
        cache.set('aa', aa,60*60)
        cache.set('pp', pp ,60*60)
        print(aa)

    aa=cache.get('aa', [])
    print(aa)
    soc_type_select = soc_type_select.to_crs('EPSG:4326').to_json()  # 좌표계 건들지마용!

    response_data = {
        'selected_types': selected_types,
        'soc_type_select': soc_type_select,
        'soc_before_grid_accessibility':result_json,
    }

    return JsonResponse(response_data)


def point_data_ta(request):
    if request.method == 'POST':
        old_items = cache.get('selected_types_ta', [])
        selected_types_ta = request.POST.getlist('point[]', None)
        cache.set('selected_types_ta', selected_types_ta)

        if len(selected_types_ta) == 1:
            selected_types_ta = selected_types_ta[0]
        elif len(selected_types_ta) == 0:
            selected_types_ta = None
        elif len(selected_types_ta) < len(old_items):
            selected_types_ta = selected_types_ta[-1]
        else:
            new_items = selected_types_ta
            added_items = [item for item in new_items if item not in old_items]
            # print(added_items)

            selected_types_ta = added_items[0]

        soc = 천안아산시_SOC.objects.all().values()

    soc_type = pd.DataFrame(soc)
    soc_type = soc_type[soc_type['sgg_nm_k'] == '아산시']
    soc_type['soc_type'] = soc_type['layer'].str.split("_", expand=True)[1]

    soc_type_select = soc_type[soc_type['soc_type'] == f'{selected_types_ta}']

    soc_type_select = soc_type_select[['id', 'emd_nm','fac_nm', 'fac_add', 'soc_type','type', 'geom']]

    soc_type_select['geom'] = soc_type_select['geom'].apply(lambda x: wkt_loads(GEOSGeometry(x).wkt))
    # print(soc_type_select)
    soc_type_select = gpd.GeoDataFrame(soc_type_select, geometry='geom', crs='EPSG:5179')


    soc_type_select = soc_type_select.to_crs('EPSG:4326').to_json()  # 좌표계 건들지마용!


    # Create the HTTP response with combined JSON data
    response = HttpResponse(content=soc_type_select, content_type='application/json')
    response['Content-Disposition'] = 'attachment; filename="soc_type_select.geojson"'
    return response


def grid_accessibility(request):
    if request.method == 'POST':
        try:
            # 수신된 데이터를 GeoDataFrame으로 변환
            data = json.loads(request.body)
            # print(data)

            soc = data['soc']
            # grid = data['grid']

            gdf_soc = gpd.GeoDataFrame.from_features(soc)
            # print(gdf_soc)
            types = gdf_soc['soc_type'].iloc[0]
            # print(types)
            gdf_soc = gdf_soc.set_crs('EPSG:4326', allow_override=False)
            soc_list = [(i, j) for i, j in zip(list(gdf_soc.geometry.x), list(gdf_soc.geometry.y))]
            # print(gdf_soc)
            soc_index = gdf_soc.fac_nm.to_list()

            # print(soc_list)

            # gdf_grid = gpd.GeoDataFrame.from_features(grid)
            # gdf_grid = gdf_grid.set_crs('EPSG:4326', allow_override=False)
            # grid_point = gdf_grid.copy()
            grid = 아산시500M인구.objects.all().annotate(geom4326=Transform('geom', 4326)).values().iterator()
            grid = pd.DataFrame(grid)
            ###### 시간  20~40초 #####
            grid['geom4326'] = grid['geom4326'].apply(lambda x: wkt_loads(GEOSGeometry(x).wkt))
            grid = gpd.GeoDataFrame(grid, geometry='geom4326', crs='EPSG:4326')
            ###### 시간  #####

            grid_point = grid.copy()
            gdf_grid = grid.copy()
            grid_point['geom4326'] = grid_point.geometry.centroid
            grid_list = [(i, j) for i, j in zip(list(grid_point.geometry.x), list(grid_point.geometry.y))]
            grid_index = grid_point.gid.to_list()

            # print(grid_list)

            distances = []

            start = time.time()

            # # 각 좌표 쌍 간의 거리를 계산
            for coord1 in grid_list:
                dist_row = []
                for coord2 in soc_list:
                    dist_val = calculate_distance(coord1, coord2)
                    if dist_val is not None:
                        dist_val_km = round((dist_val / 1000), 2)
                        dist_row.append(dist_val_km)
                    else:
                        dist_row.append(None)  # 경로가 없을 경우 None으로 표시
                distances.append(dist_row)



            # 각 좌표 쌍 간의 거리를 계산
            # for coord1 in grid_list:
            #     dist_row = []
            #     for coord2 in soc_list:
            #         dist_val = calculate_road_distance_with_error_handling(coord1, coord2, G)
            #         if dist_val is not None:
            #             dist_val_km = round((dist_val / 1000), 2)
            #             dist_row.append(dist_val_km)
            #         else:
            #             dist_row.append(None)  # 경로가 없을 경우 None으로 표시
            #     distances.append(dist_row)


            # 데이터프레임 생성
            df = pd.DataFrame(distances, index=grid_index, columns=soc_index)
            df['min'] = df.min(axis=1)

            end = time.time()

            print(f"{end - start:.5f}")

            result_df = df[['min']]
            result_df = result_df.reset_index()
            result_df.columns = ['gid', 'distance']
            result_df = pd.merge(gdf_grid, result_df, on='gid')
            result_df = result_df[result_df['distance'].notnull()]
            result_df['distance'] = result_df['distance'].astype(float)
            result_df['val'] = result_df['val'].astype(float)
            # result_df.to_csv( "C:/Users/user/OneDrive/바탕 화면/(B100)국토통계_인구정보-총 인구 수(전체)-(격자) 500M_충청남도 아산시_202304/test1.csv",encoding="cp949")

            result_json = result_df.to_json(default=str)
            # print(result_df)

            # print(aa)

            dis10 = ['주제공원', '공연문화시설', '노인여가복지시설', '종합병원', '응급의료시설', '보건기관']
            if any(item in types for item in dis10):
                bb = result_df['val'].loc[result_df['distance'] <= 10].sum()
                qq = result_df[result_df['distance'] <= 10]
                qq = qq.describe()
                # print(bb)
                cache.set('bb', bb)
                cache.set('qq', qq)
            else:
                bb = result_df['val'].loc[result_df['distance'] <= 0.75].sum()
                qq = result_df[result_df['distance'] <= 0.75]
                qq = qq.describe()
                # print(bb)
                cache.set('bb', bb)

            aa = cache.get('aa', [])
            pp = cache.get('pp', [])
            print(pp)
            # aa = aa.round(0)
            # print(aa)
            bb = cache.get('bb', [])
            print(qq)
            # print(aa)
            # print(bb)
            # bb = cache.get('bb', [])
            # print(result_df)

            return JsonResponse({'grid_accessibility': result_json,'aa':aa ,'bb':bb}, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)})
    return JsonResponse({'error': 'Invalid request method'})


def tabletotal_pop(request):
    if request.method == 'POST':
        data = Asanemdpop.objects.all()

        data = pd.DataFrame.from_records(data.values().all())
        data = data[['temp','총인구','유아','초등학생','중학생','고등학생','성인','생산가능','노인','geom']]
        data['geom'] = data['geom'].apply(lambda x: wkt_loads(GEOSGeometry(x).wkt))
        data = gpd.GeoDataFrame(data, geometry='geom', crs='EPSG:5179')
        data = data.to_crs('EPSG:4326').to_json(default=int)  # 좌표계 건들지마용!
        print(data)

        data = HttpResponse(content=data, content_type='application/json')
        return data


def ex_polygon_data(request):
    if request.method == 'POST':
        selected_ex = request.POST.get('ex', None)
        if selected_ex == '경관지구':
            queryset = 경관지구_분류_아산_5179.objects.values('코드값','코드값의미')
            geo_1 = 경관지구_분류_아산_5179.objects.all()
        elif selected_ex == '국토계획':
            queryset = 국토계획_분류_아산_5179.objects.values('코드값','코드값의미')
            geo_1 = 국토계획_분류_아산_5179.objects.all()
        elif selected_ex == '도시지역':
            queryset = 도시지역_분류_아산_5179.objects.values('코드값','코드값의미')
            geo_1 = 도시지역_분류_아산_5179.objects.all()
        else:
            print("aa")
        # GeoJSON 데이터 생성
        geojson_serializer = GeoJSONSerializer()
        geojson_data = geojson_serializer.serialize(geo_1)
        spe_df = pd.DataFrame(queryset)
        print(spe_df)
        return JsonResponse({'queryset': list(queryset), 'geo_1': geojson_data}, safe=False)
    return JsonResponse({'error': 'Invalid request method'})



