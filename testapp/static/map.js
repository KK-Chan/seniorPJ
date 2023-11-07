// 보안 토큰 불러오는 코드
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrf_token = getCookie('csrftoken');

function showLoadingScreen() {
    $('#loading-screen').css('display', 'flex');
}

function hideLoadingScreen() {
    $('#loading-screen').css('display', 'none');
}

// json1과 json2의 feature를 병합하는 함수
function mergeFeatures(json1, json2) {
    const mergedFeatures = [];

    for (const feature1 of json1) {
        for (const feature2 of json2) {
            if (feature1.properties.gid === feature2.gid) {
                const mergedFeature = {
                  ...feature1,
                  properties: { ...feature1.properties, facility_count: feature2.facility_count || 0 }
                };
                mergedFeatures.push(mergedFeature);
                break; // 해당 gid 값이 같은 경우에만 병합하고 루프 종료
            }
        }
    }

  return { type: 'FeatureCollection', features: mergedFeatures };
}

// 레이어 응답 코드 폴리곤
var geoJSON;
function load_polygon(selectedPgn) {
    if (selectedPgn) {
        showLoadingScreen()
        // AJAX 요청 보내기
        $.ajax({
            type: 'POST',
            url: "/polygon_data/",
            data: {
                'city': selectedPgn,
                'csrfmiddlewaretoken': csrf_token,
            },
            dataType: 'json',
            success: function(data) {
                hideLoadingScreen()

                //console.log(data); //콘솔에 출력
                var data_container = $('#data-container');
                console.log(selectedPgn)
                // 이전에 렌더링된 데이터 삭제
                data_container.empty();
                // 새로운 데이터 추가
                // GeoJSON 데이터를 지도에 추가
                geoJSON = JSON.parse(data.geo_1); // GeoJSON 데이터 파싱
                console.log(geoJSON); // 콘솔에 출력
                // 이전에 추가된 레이어 삭제

                if (map.getLayer('line-layer')) {
                    map.removeLayer('line-layer');
                }

                if (map.getSource('polygon-layer')) {
                    map.removeLayer('polygon-layer');
                    map.removeSource('polygon-layer');
                }


                // 새로운 레이어 추가
                map.addSource('polygon-layer', {
                    'type': 'geojson',
                    'data': geoJSON
                });
                map.addLayer({
                    'id': 'polygon-layer',
                    'type': 'fill',
                    'source': 'polygon-layer',
                    'layout': {},
                    'paint': {
                        'fill-color': '#5D75F9',
                        'fill-opacity': 0.5
                    }
                });

                map.addLayer({
                    'id': 'line-layer',
                    'type': 'line',
                    'source': 'polygon-layer',
                    'layout': {},
                    'paint': {
                        'line-color': 'transparent', // 테두리 라인 색상을 투명으로 설정
                        'line-width': 1 // 테두리 라인의 두께 설정
                    }
                });

                //console.log(polygonlayers)
            },
            error: function(request, status, error) {
                hideLoadingScreen()

                alert("선택된 지역은 데이터가 없습니다!")
                console.log(error)
                // 선택 해제 시 데이터 삭제
                $('#data-container').empty();
                if (map.getLayer('line-layer')) {
                    map.removeLayer('line-layer');
                }

                if (map.getSource('polygon-layer')) {
                    map.removeLayer('polygon-layer');
                    map.removeSource('polygon-layer');
                }
            }
        });
    } else {
        // 선택 해제 시 데이터 삭제
        $('#data-container').empty();
        if (map.getLayer('line-layer')) {
            map.removeLayer('line-layer');
        }

        if (map.getSource('polygon-layer')) {
            map.removeLayer('polygon-layer');
            map.removeSource('polygon-layer');
        }
    }
}



var geoJSON;
function load_ex_polygon(selectedPgn_ex) {
    if (selectedPgn_ex) {
        showLoadingScreen();
        // AJAX 요청 보내기
        $.ajax({
            type: 'POST',
            url: "/ex_polygon_data/",
            data: {
                'ex': selectedPgn_ex,
                'csrfmiddlewaretoken': csrf_token,
            },
            dataType: 'json',
            success: function(data) {
                hideLoadingScreen();

                var data_container = $('#data-container');
                data_container.empty();

                geoJSON = JSON.parse(data.geo_1);

                if (map.getLayer('line-layer')) {
                    map.removeLayer('line-layer');
                }

                if (map.getSource('polygon-layer')) {
                    map.removeLayer('polygon-layer');
                    map.removeSource('polygon-layer');
                }

                // 새로운 레이어 추가
                map.addSource('polygon-layer', {
                    'type': 'geojson',
                    'data': geoJSON
                });

                // 케이스 별로 레이어 추가
                if (selectedPgn_ex === '국토계획') {
                    map.addLayer({
                        'id': 'polygon-layer',
                        'type': 'fill',
                        'source': 'polygon-layer',
                        'layout': {},
                        'paint': {
                            'fill-color': [
                                'match',
                                ['get', '코드값의미'], // '코드값의미' 속성 가져오기
                                '수산자원보호구역','#4B54DC',
                                '개발행위허가제한지역', '#D25757',
                                '기반시설부담구역', '#7657D2',
                                '개발밀도관리구역', '#D77453',
                                '토지거래계약에관한허가구역', '#34C69D',
                                '광역계획구역', '#DFDF75',
                                '기타용지', '#95D753',
                                '공공시설용지', '#E7A898',
                                '녹지용지', '#57D257',
                                '공업용지', '#EA6AEA',
                                '상업용지', '#4195E9',
                                '주거용지', '#ECB57D',
                                '제2종지구단위계획구역', '#D1D1D8',
                                '제1종지구단위계획구역', '#A1CCC0',
                                '지구단위계획구역', '#AEB5BB',
                                '도시계획구역', '#E8FFBF',
                                '도시자연공원구역', '#8DDC4B',
                                '용도구역기타', '#ECE8E8',
                                '용도구역미분류', '#FFEF80',
                                '성장관리방안 수립지역','#FFEF80',
                                '미분류', '#FFEF80',
                                '#808080' // 기본 색상 설정
                            ],
                            'fill-opacity': 0.3
                        }
                    });

               var legendLabels = [
                   '수산자원보호구역',
                    '개발행위허가제한지역',
                    '기반시설부담구역',
                    '개발밀도관리구역',
                    '토지거래계약에관한허가구역',
                    '광역계획구역',
                    '기타용지',
                    '공공시설용지',
                    '녹지용지',
                    '공업용지',
                    '상업용지',
                    '주거용지',
                    '제2종지구단위계획구역',
                    '제1종지구단위계획구역',
                    '지구단위계획구역',
                    '도시계획구역',
                    '도시자연공원구역',
                    '용도구역기타',
                    '용도구역미분류',
                    '성장관리방안 수립지역',
                    '미분류',
                ];
                var legendColors = [
                         '#4B54DC',
                         '#D25757',
                         '#7657D2',
                         '#D77453',
                         '#34C69D',
                         '#DFDF75',
                         '#95D753',
                         '#E7A898',
                         '#57D257',
                         '#EA6AEA',
                         '#4195E9',
                         '#ECB57D',
                         '#D1D1D8',
                         '#A1CCC0',
                         '#AEB5BB',
                         '#E8FFBF',
                         '#8DDC4B',
                         '#ECE8E8',
                         '#FFEF80',
                        '#FFEF80',
                         '#FFEF80',
                        ];
                createLegend(legendLabels, legendColors);

                } else if (selectedPgn_ex === '경관지구') {
                    map.addLayer({
                        'id': 'polygon-layer',
                        'type': 'fill',
                        'source': 'polygon-layer',
                        'layout': {},
                        'paint': {
                            'fill-color': [
                                'match',
                                ['get', '코드값의미'], // '코드값의미' 속성 가져오기
                                '자연경관지구', '#2D6F78',
                                '특화경관지구', '#144E3E',
                                '시가지경관지구', '#238948',
                                '시가지경관지구(일반)', '#34C69D',
                                '경관지구', '#24896D',
                                '기타', '#A1CCC0',
                                '미분류', '#DFEEEA',
                                '#808080' // 기본 색상 설정
                            ],
                            'fill-opacity': 0.3
                        }
                    });

                var legendLabels = ['자연경관지구',
                                    '특화경관지구',
                                    '시가지경관지구',
                                    '시가지경관지구(일반)',
                                    '경관지구'

                ];
                var legendColors = [
                         '#2D6F78',
                         '#144E3E',
                         '#238948',
                         '#34C69D',
                         '#24896D',
];

                createLegend(legendLabels, legendColors);
                } else if (selectedPgn_ex === '도시지역') {
                    map.addLayer({
                        'id': 'polygon-layer',
                        'type': 'fill',
                        'source': 'polygon-layer',
                        'layout': {},
                        'paint': {
                            'fill-color': [
                                'match',
                                ['get', '코드값의미'], // '코드값의미' 속성 가져오기
                                '제1종전용주거지역', '#FFFD04',
                                '제2종전용주거지역', '#FAF9BF',

                                '제1종일반주거지역', '#CDCE05',
                                '제2종일반주거지역', '#D9AE36',
                                '제3종일반주거지역', '#E4A46C',
                                '준주거지역', '#FAF9BF',

                                '중심상업지역', '#88247A',
                                '일반상업지역', '#DAA8D3',
                                '근린상업지역', '#B894D0',
                                '유통상업지역', '#A054AC',

                                '전용공업지역', '#87A1EB',
                                '일반공업지역', '#87A1EB',
                                '준공업지역', '#87A1EB',

                                '보전녹지지역', '#ABDDAE',
                                '생산녹지지역', '#8CC051',
                                '자연녹지지역', '#36BC9B',

                                '#808080' // 기본 색상 설정
                            ],
                            'fill-opacity': 0.3
                        }
                    });

                                    var legendLabels = ['제1종전용주거지역',
                                    '제2종전용주거지역',
                                    '제1종일반주거지역',
                                    '제2종일반주거지역',
                                    '제3종일반주거지역',
                                    '준주거지역',
                                    '중심상업지역',
                                    '일반상업지역',
                                    '근린상업지역',
                                    '유통상업지역',
                                    '전용공업지역',
                                    '일반공업지역',
                                    '준공업지역',
                                    '보전녹지지역',
                                    '생산녹지지역',
                                    '자연녹지지역',
                ];
                var legendColors = [
                                     '#FFFD04',
                                     '#FAF9BF',
                                     '#CDCE05',
                                     '#D9AE36',
                                     '#E4A46C',
                                     '#FAF9BF',
                                     '#88247A',
                                     '#DAA8D3',
                                     '#B894D0',
                                     '#A054AC',
                                     '#87A1EB',
                                     '#87A1EB',
                                     '#87A1EB',
                                     '#ABDDAE',
                                     '#8CC051',
                                     '#36BC9B',

                ];

                createLegend(legendLabels, legendColors);


                }

                map.addLayer({
                    'id': 'line-layer',
                    'type': 'line',
                    'source': 'polygon-layer',
                    'layout': {},
                    'paint': {
                        'line-color': '#000000',
                        'line-width': 0.2
                    }
                });

            },
            error: function(request, status, error) {
                hideLoadingScreen();

                alert("선택된 지역은 데이터가 없습니다!");
                console.log(error);

                // 선택 해제 시 데이터 삭제
                $('#data-container').empty();

                if (map.getLayer('line-layer')) {
                    map.removeLayer('line-layer');
                }

                if (map.getSource('polygon-layer')) {
                    map.removeLayer('polygon-layer');
                    map.removeSource('polygon-layer');
                }
            }
        });
    } else {
        // 선택 해제 시 데이터 삭제
        $('#data-container').empty();

        if (map.getLayer('line-layer')) {
            map.removeLayer('line-layer');
        }

        if (map.getSource('polygon-layer')) {
            map.removeLayer('polygon-layer');
            map.removeSource('polygon-layer');
        }
    }
}




var geoJSON;
function load_polygon_bu() {
        $.ajax({
            type: 'POST',
            url: "/bu_polygon_data/",
            data: {
                'csrfmiddlewaretoken': csrf_token,
            },
            dataType: 'json',
            success: function(data) {

                console.log(data); // 'soc_type_select' 값 사용 가능
                var geoJSON = JSON.parse(data.soc_type_select);

            },
            error: function(request, status, error) {
                console.log(error);
            }
        });
    }








function loadtypeOptions() {
    var typeSelect = document.getElementById('point-select');

    // AJAX 요청 보내기
    $.ajax({
        type: 'POST',
        url: "/soc_data/",
        data: {
            'csrfmiddlewaretoken': csrf_token,
        },
        dataType: 'json',
        success: function(response) {
            // 서버에서 반환된 결과를 이용하여 처리
//            console.log(response);
            var typeOptions = response;

            // Clear existing options except for the placeholder
            $(typeSelect).find('option:not(:first)').remove();

            // Add new options to typeSelect
            for (var i = 0; i < typeOptions.length; i++) {
                var option = document.createElement('option');
                option.value = typeOptions[i].value;
                option.textContent = typeOptions[i].label;
                typeSelect.appendChild(option);
            }

            // Chosen 초기화
            $(typeSelect).trigger('chosen:updated');
        },
        error: function(xhr, status, error) {
//            console.log(error);
        }
    });
}


/*
// 레이어 응답 코드 포인트
function load_point(selectedPnt) {
    if (selectedPnt) {
        $.ajax({
            type: 'POST',
            url: "/point_data/",
            data: {
                'point': selectedPnt,
                'csrfmiddlewaretoken': csrf_token,
            },
            dataType: 'json',
            success: function(data) {
                console.log(data);
                var selected_types = data.selected_types; // 'selected_types' 값 가져오기
                */
/*var geoJSON = data.soc_type_select; // 'soc_type_select' 값 가져오기*//*

                var geoJSON = JSON.parse(data.soc_type_select);
//                console.log(geoJSON)

                // point-layer 소스가 없으면 추가, 이미 있으면 데이터만 업데이트
                if (!map.getSource('point-layer')) {
                    map.addSource('point-layer', {
                        type: 'geojson',
                        data: geoJSON
                    });

                    map.addLayer({
                        id: 'point-layer',
                        type: 'circle',
                        source: 'point-layer',
                        paint: {
                            'circle-radius': 5,
                            'circle-color': '#00B992',
                            'circle-stroke-color': 'black',
                            'circle-stroke-width': 2
                        }
                    });
                } else {
                    map.getSource('point-layer').setData(geoJSON);
                }
            },
            error: function(request, status, error) {
                console.log(error);
            }
        });
    } else {
        // 선택된 항목이 없을 때, point-layer 제거
        if (map.getLayer('point-layer')) {
            map.removeLayer('point-layer');
        }
        if (map.getSource('point-layer')) {
            map.removeSource('point-layer');
        }
    }
}
*/

var point_layer_arry = []

function load_point(selectedPnt) {
    if (selectedPnt) {
        showLoadingScreen();
        $.ajax({
            type: 'POST',
            url: "/point_data/",
            data: {
                'point': selectedPnt,
                'csrfmiddlewaretoken': csrf_token,
            },
            dataType: 'json',
            success: function(data) {
                var geoJSON = JSON.parse(data.soc_type_select);
                var selectedTypes = data.selected_types; // 'selected_types' 값을 가져옴
                var grid_access_before=JSON.parse(data.soc_before_grid_accessibility)

                if (map.getLayer('before_line-layer')) {
                    map.removeLayer('before_line-layer');
                }
                if (map.getSource('before_polygon-layer')) {
                    map.removeLayer('before_polygon-layer');
                    map.removeSource('before_polygon-layer');
                }

                var features = grid_access_before.features

                console.log(features)

                // 폴리곤 레이어의 색상 지정
                features.forEach(function(feature) {
                    var properties = feature.properties;
                    var value = properties.distance;
                    var gid = properties.gid;
                    var color;
                        // 등분위수에 따라 색상 지정
                    if (value < 0.5) {
                        color = '#D76475';
                    } else if (value <= 1) {
                        color = '#DF99A4';
                    } else if (value <= 2.5) {
                        color = '#ECC5CA';
                    } else if (value <= 5) {
                        color = '#F5F5B9';
                    } else if (value <= 10) {
                        color = '#C1E1E0';
                    } else if (value <= 25) {
                        color = '#92CAC7';
                    } else {
                        color = '#5FB4AD';
                    }

                    // 폴리곤의 속성으로 color 값을 추가
                    feature.properties.color = color;
                });

                // 소수점 2자리
                function formatDecimal(value) {
                    return parseFloat(value).toFixed(2);
                }
                // 범례 레이블과 색상 매핑
                var legendLabels = [
                    '0.5km 이내',
                    '0.5km ~ 1km',
                    '1km ~ 2.5km',
                    '2.5km ~ 5km',
                    '5km ~ 10km',
                    '10km ~ 25km',
                    '25km 초과'
                ];
                var legendColors = ['#D76475', '#DF99A4', '#ECC5CA', '#F5F5B9', '#C1E1E0', '#92CAC7', '#5FB4AD'];

                // 범례 생성 함수 호출
                createLegend(legendLabels, legendColors);

                map.addSource('before_polygon-layer', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': features
                    }
                });

               map.addLayer({
                    'id': 'before_polygon-layer',
                    'type': 'fill',
                    'source': 'before_polygon-layer',
                    'layout': {},
                    'paint': {
                        'fill-color': ['get', 'color'], // 폴리곤의 color 속성 값을 색상으로 사용
                        'fill-opacity': 0.6
                    }
                });


                map.addLayer({
                    'id': 'before_line-layer',
                    'type': 'line',
                    'source': 'before_polygon-layer',
                    'layout': {},
                    'paint': {
                        'line-color': '#FFFFFF', // 테두리 라인 색상을 투명으로 설정
                        'line-width': 0 // 테두리 라인의 두께 설정
                    }
                });

                map.setLayoutProperty('before_polygon-layer', 'visibility', 'none');


                if (map.getLayer(layerId)) {
                    map.removeLayer(layerId);
                }
                if (map.getSource(layerId)) {
                    map.removeSource(layerId);
                }
                // 새로운 point-layer 추가, 'selected_types'를 레이어 ID에 추가
                var layerId = 'point-layer-' + selectedTypes;
                map.addSource(layerId, {
                    type: 'geojson',
                    data: geoJSON
                });

                map.addLayer({
                    id: layerId,
                    type: 'circle',
                    source: layerId,
                    paint: {
                        'circle-radius': 5,
                        'circle-color': '#00B992',
                        'circle-stroke-color': 'black',
                        'circle-stroke-width': 2
                    }
                });
                point_layer_arry.push(layerId)
//                console.log(point_layer_arry)
                hideLoadingScreen();
            },
            error: function(request, status, error) {
                console.log(error);
            }
        });
    } else {
        // 선택된 항목이 없을 때, 해당 레이어 제거
        var layerId = 'point-layer-' + selectedTypes;
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
        if (map.getSource(layerId)) {
            map.removeSource(layerId);
        }
    }
}



// 포인트 레이어 속성정보 가져오기
var tableVisible = false;
function showTable(selectedPnt) {
    var tableContainer = $('#tableContainer');

    if (selectedPnt) {
        if (!tableVisible) {
            showLoadingScreen()
            // 테이블이 보이지 않는 상태라면 테이블을 보이도록 처리
            tableContainer.show();
            tableVisible = true; // 테이블 상태를 보이는 상태로 설정
        }

        $.ajax({
            type: 'POST',
            url: "/point_data_ta/",
            data: {
                'point': selectedPnt,
                'csrfmiddlewaretoken': csrf_token,
            },
            dataType: 'json',
            success: function(data) {
                hideLoadingScreen()
//                console.log(data)
                // 포인트 정보를 받아와서 테이블에 추가
                var tableBody = $('#dataTable tbody');
                tableBody.empty(); // 기존 테이블 내용 비우기

                // GeoJSON 데이터 파싱
                /*console.log(data);*/
                var geoJSON = data;

                // 포인트 정보를 테이블에 추가
                geoJSON.features.forEach(function(feature) {
                    var properties = feature.properties;
                    var coordinate = feature.geometry.coordinates;
                    var x = parseFloat(coordinate[0]).toFixed(2);
                    var y = parseFloat(coordinate[1]).toFixed(2);

                    var row = '<tr>' +
                        '<td>' + properties.fac_nm + '</td>' +
                        '<td>' + x + '</td>' +
                        '<td>' + y + '</td>' +
                        '</tr>';

                    tableBody.append(row);
                });

                // 테이블을 보여주는 부분을 보이게 처리
                tableContainer.show();
                tableVisible = true; // 테이블 상태를 보이는 상태로 설정
            },
            error: function(request, status, error) {
                hideLoadingScreen()
                /*alert("데이터가 없습니다!")*/
//                console.log(error);

                tableContainer.hide(); // 데이터가 없으면 테이블 숨기기
                tableVisible = false; // 테이블 상태를 숨긴 상태로 설정
            }
        });
    } else {
        hideLoadingScreen()
        // 선택한 도서관명이 없으면 테이블 숨기기
        tableContainer.hide();
        tableVisible = false; // 테이블 상태를 숨긴 상태로 설정
    }
}






// 접근성 격자 부터
// 격자와 SOC 접근성 분석 도로 네트워크
function grid_accessibility() {
    var layerId = point_layer_arry[point_layer_arry.length - 1];
    if (map.getSource(layerId)._data.features.length > 0) {
        showLoadingScreen();
        // 서버로 전송할 데이터 준비 (예: pointData 변수)

        var soc = map.getSource(layerId)._data.features;
//        var grid = map.getSource('polygon-layer')._data.features;
        console.log(soc);
//        console.log(grid);

            // 데이터를 하나의 객체로 묶기
        var requestData = {
            'soc': soc,
//            'grid': grid
        };

        // 서버로 POST 요청 보내기
        $.ajax({
            type: 'POST',
            url: '/grid_accessibility/', // 서버의 엔드포인트 URL
            data: JSON.stringify(requestData), // 데이터를 JSON 문자열로 변환하여 전송
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'X-CSRFToken': csrf_token // CSRF 토큰을 가져와서 요청 헤더에 추가
            },
            success: function(response) {
                console.log('Data sent to server and processed successfully:', response);
                var gridAccessibility = JSON.parse(response.grid_accessibility);
                console.log(response.aa)
                console.log(response.bb)
//                console.log(gridAccessibility);

                hideLoadingScreen()

                // 이전에 추가된 레이어 삭제
                if (map.getLayer('line-layer')) {
                    map.removeLayer('line-layer');
                }
                if (map.getSource('polygon-layer')) {
                    map.removeLayer('polygon-layer');
                    map.removeSource('polygon-layer');
                }
                if (map.getSource(layerId)) {
                    map.removeLayer(layerId);
                    map.removeSource(layerId);
                }

                var features = gridAccessibility.features

                // 폴리곤 레이어의 색상 지정
                features.forEach(function(feature) {
                    var properties = feature.properties;
                    var value = properties.distance;
                    var gid = properties.gid;
                    var color;
                        // 등분위수에 따라 색상 지정
                    if (value < 0.5) {
                        color = '#D76475';
                    } else if (value <= 1) {
                        color = '#DF99A4';
                    } else if (value <= 2.5) {
                        color = '#ECC5CA';
                    } else if (value <= 5) {
                        color = '#F5F5B9';
                    } else if (value <= 10) {
                        color = '#C1E1E0';
                    } else if (value <= 25) {
                        color = '#92CAC7';
                    } else {
                        color = '#5FB4AD';
                    }

                    // 폴리곤의 속성으로 color 값을 추가
                    feature.properties.color = color;
                });

                // 소수점 2자리
                function formatDecimal(value) {
                    return parseFloat(value).toFixed(2);
                }
                // 범례 레이블과 색상 매핑
                var legendLabels = [
                    '0.5km 이내',
                    '0.5km ~ 1km',
                    '1km ~ 2.5km',
                    '2.5km ~ 5km',
                    '5km ~ 10km',
                    '10km ~ 25km',
                    '25km 초과'
                ];
                var legendColors = ['#D76475', '#DF99A4', '#ECC5CA', '#F5F5B9', '#C1E1E0', '#92CAC7', '#5FB4AD'];

                // 범례 생성 함수 호출
                createLegend(legendLabels, legendColors);

                map.addSource('polygon-layer', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': features
                    }
                });

               map.addLayer({
                    'id': 'polygon-layer',
                    'type': 'fill',
                    'source': 'polygon-layer',
                    'layout': {},
                    'paint': {
                        'fill-color': ['get', 'color'], // 폴리곤의 color 속성 값을 색상으로 사용
                        'fill-opacity': 0.8
                    }
                });


                map.addLayer({
                    'id': 'line-layer',
                    'type': 'line',
                    'source': 'polygon-layer',
                    'layout': {},
                    'paint': {
                        'line-color': '#FFFFFF', // 테두리 라인 색상을 투명으로 설정
                        'line-width': 0 // 테두리 라인의 두께 설정
                    }
                });


/*##################### 차트 차트 비교차트 #####################*/
aa=response.aa
bb=response.bb

var total = 306041;

// 백분율 계산
var percentageBefore = ((aa / total) * 100).toFixed(2);
var percentageAfter = ((bb / total) * 100).toFixed(2);

/*var options = {
    chart: {
        height: 350,
        type: 'radialBar',
    },
    plotOptions: {
        radialBar: {
          track: {
                  background: '#000'
          },
            startAngle: -90,
            endAngle: 90,
            hollow: {
                margin: 5,
                size: '30%',
                background: 'transparent',
                image: undefined,
            },
            dataLabels: {
                name: {
                    show: true,
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#000',
                    offsetY: 50,
                },
                value: {
                    show: true,
                    formatter: function (val) {
                        return val + "%";
                    },
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#000',
                    offsetY: -10,
                },
            },
        },
    },
    labels: ['before', 'after'],
    series: [percentageBefore, percentageAfter],
};

// 차트를 생성하고 표시
var chart1 = new ApexCharts(document.querySelector('#chart1'), options);
chart1.render();*/

        var data = [
            {
                name: '서비스 권역 내 인구',
                data: [aa, bb],
            },
            {
                name: '서비스 권역 외 인구',
                data: [total-aa, total-bb],
            }
        ];

        var options = {
            chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                stackType: '100%', // 스택된 수평 막대 차트로 설정
                background: '#ffffff' // 배경색 설정

            },
            plotOptions: {
                bar: {
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val.toFixed(2) + "%";
                },
                offsetY: -20,
                style: {
                    fontSize: '12px',
                    colors: ["#304758"]
                }
            },
            series: data, // 위에서 정의한 데이터를 사용
            xaxis: {
                categories: ['before','after'], // X 축 레이블
            },
            fill: {
                colors: ['#6091E8', '#E6E9EE'] // 막대 색상 지정
            }
        };

        // 차트를 생성하고 표시
        var chart1 = new ApexCharts(document.querySelector('#chart1'), options);
        chart1.render();


        var c = bb - aa;
        var featureCount = 0;
        var layers = map.getStyle().layers;
        var layerIdPattern = /^display-point-layer-/; // 원하는 패턴

        for (var i = 0; i < layers.length; i++) {
            if (layers[i].id.match(layerIdPattern)) {
                // 해당 패턴을 가지는 레이어의 피처 개수를 합산
                featureCount += map.queryRenderedFeatures({ layers: [layers[i].id] }).length;
            }
        }


var resultText = "시설: <span style='color: #000; font-weight: bold;'> +" + featureCount + "</span><br>" +
    "기존 서비스 권역 내 인구: <span style='color: red; font-weight: bold; font-family: sans-serif;'>" + Math.round(aa).toLocaleString() + " 명</span><br>" +
    "시설 추가 시 서비스 권역 내 인구: <span style='color: blue; font-weight: bold; font-family: sans-serif;'>" + bb.toLocaleString() + " 명</span><br>" +
    "증가: " + (c >= 0 ? "<span style='color: green; font-weight: bold; font-family: sans-serif;'>+ " : "<span style='color: red; font-weight: bold; font-family: sans-serif;'>- ") + Math.abs(c).toLocaleString() + "</span>";

        document.getElementById("text").innerHTML = resultText;

        var textElement = document.getElementById("text");

        // 배경색 및 폰트 설정
        textElement.style.fontFamily = "Arial, sans-serif"; // 폰트 설정
        textElement.style.fontSize = "20px"; // 폰트 크기 설정

        textElement.innerHTML = resultText; // 텍스트 내용 설정

                var layerIdsToRemove = displaylayers; // Use the correct variable name

                layerIdsToRemove.forEach(function(layerId) {
                    if (map.getLayer(layerId)) {
                        map.removeLayer(layerId);
                    }
                });

            },
            error: function(error) {

                hideLoadingScreen()

                console.error('Error sending data to server:', error);
                // 오류가 발생한 경우에 처리 (예: 오류 메시지 표시)
                alert('Error exporting data.');
            }
        });
    } else {
        hideLoadingScreen()
        // 선택 해제 시 데이터 삭제
        $('#data-container').empty();
        if (map.getLayer('line-layer')) {
            map.removeLayer('line-layer');
        }

        if (map.getSource('polygon-layer')) {
            map.removeLayer('polygon-layer');
            map.removeSource('polygon-layer');
        }
    }
}

function removeLayerAndLegend() {

    var layerId = point_layer_arry[point_layer_arry.length - 1];

    if (map.getLayer('line-layer')) {
        map.removeLayer('line-layer');
    }

    if (map.getSource('polygon-layer')) {
        map.removeLayer('polygon-layer');
        map.removeSource('polygon-layer');
    }

    if (map.getSource(layerId)) {
        map.removeLayer(layerId);
        map.removeSource(layerId);
    }
}
// 까지
function Show_layer_3D() {

      let layerId = 'polygon-layer-3D';
      let isLayerVisible = false;

      document.getElementById('toggle3DLayer').addEventListener('click', function () {
        if (isLayerVisible) {
          if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
          }
          isLayerVisible = false;
        } else {
        map.addLayer({
          id: 'polygon-layer-3D',
          type: 'fill-extrusion',
          source: 'polygon-layer',
          paint: {
            'fill-extrusion-color': ['get', 'color'],
            'fill-extrusion-height': [
              'case',
              ['<=', ['get', 'distance'], 0.5],
              ['*', ['-', ['get', 'distance'], 10], -220],
              ['all', ['>', ['get', 'distance'], 0.5], ['<=', ['get', 'distance'], 1]],
              ['*', ['-', ['get', 'distance'], 10], -180],
              ['all', ['>', ['get', 'distance'], 1], ['<=', ['get', 'distance'], 2.5]],
              ['*', ['-', ['get', 'distance'], 10], -140],
              ['all', ['>', ['get', 'distance'], 2.5], ['<=', ['get', 'distance'], 5]],
              ['*', ['-', ['get', 'distance'], 10], -100],
              ['all', ['>', ['get', 'distance'], 5], ['<=', ['get', 'distance'], 10]],
              ['*', ['-', ['get', 'distance'], 10], -60],
              ['all', ['>', ['get', 'distance'], 10], ['<=', ['get', 'distance'], 25]],
              ['*', ['-', ['get', 'distance'], 10], -20],
              ['*', ['-', ['get', 'distance'], 10], -10],
            ],
            'fill-extrusion-opacity': 0.7,
          },
        });

          isLayerVisible = true;
        }
      });
}




// 접근성 분석
var dfJSON;
function accessibility(selectedCase) {
    if (selectedCase) {
        // 데이터 요청이 시작될 때 로딩 화면을 표시
        showLoadingScreen();

        $.ajax({
            type: 'POST',
            url: "/local_g_statistic/",
            data: {
                'case': selectedCase,
                'csrfmiddlewaretoken': csrf_token,
            },

            dataType: 'json',
            success: function(data) {
                // 성공적으로 데이터를 받아왔을 때 로딩 화면을 숨깁니다.
                hideLoadingScreen();

                // JSON 데이터 파싱
                dfJSON = JSON.parse(data.df_json);
//                console.log(dfJSON);
                // 데이터 로딩이 완료되었을 때 화면을 숨깁니다.
                $('#loading-screen').fadeOut('slow');
            },

            error: function(request, status, error) {
                alert("선택된 지역은 데이터가 없습니다!")
//                console.log(error);

                // 데이터 로딩이 실패했을 때도 로딩 화면을 숨깁니다.
                hideLoadingScreen();
            }
        });
    }
}


// 범례 생성
function createLegend(legendLabels, legendColors) {
 d3.select('#legend-container').select('svg').remove();

  var legend = d3.select('#legend-container')
    .append('svg')
    .attr('class', 'legend')
    .attr('width', 145);

  var legendRectSize = 18;
  var legendSpacing = 4;

  // 계산된 범례 컨테이너의 높이
  var legendHeight = legendLabels.length * (legendRectSize + legendSpacing);

  // 범례 컨테이너의 높이 설정
  legend.attr('height', legendHeight);

  var legendEntries = legend.selectAll('.legend-entry')
    .data(legendLabels)
    .enter()
    .append('g')
    .attr('class', 'legend-entry')
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var vert = i * height;
      return 'translate(0,' + vert + ')';
    });

  legendEntries.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', function(d, i) {
      return legendColors[i];
    });

  legendEntries.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) {
      return d;
    });
}


// 버튼 클릭 시 폴리곤의 색상 지정 함수
function setPolygonColor() {
    // 이전에 추가된 레이어 삭제
    if (map.getLayer('line-layer')) {
        map.removeLayer('line-layer');
    }
    if (map.getSource('polygon-layer')) {
        map.removeLayer('polygon-layer');
        map.removeSource('polygon-layer');
    }

    // 폴리곤의 속성값을 가져와서 색상 지정
    var features = geoJSON.features;
    var properties = features.properties;
//    console.log(properties)

    // json1과 json2의 feature를 병합하는 함수
    function mergeFeatures(json1, json2) {
        const mergedFeatures = [];

        for (const feature1 of json1.features) {
            for (const feature2 of json2) {
                if (feature1.properties.gid === feature2.gid) {
                    const mergedFeature = {
                      ...feature1,
                      properties: { ...feature1.properties, z_i: feature2.z_i || 0 }
                    };
                    mergedFeatures.push(mergedFeature);
                    break; // 해당 gid 값이 같은 경우에만 병합하고 루프 종료
                }
            }
        }

      return { type: 'FeatureCollection', features: mergedFeatures };
    }

    // json1과 json2를 병합
    const mergedJSON = mergeFeatures(geoJSON, dfJSON);
//    console.log(mergedJSON);

    features = mergedJSON.features

    // 등분위수 계산을 위해 데이터를 배열에 저장
    var dataValues = [];
    features.forEach(function(feature) {
        var properties = feature.properties;
        var value = properties.z_i; // 데이터의 속성값
        dataValues.push(value);
    });

    var dataValue = dataValues.filter(item => item !== 0 && item !== '0');

    // 등분위수 계산을 위해 데이터를 오름차순으로 정렬
    dataValue.sort(function(a, b) {
        return a - b;
    });

    // 등분위수 계산 (4분위수로 나누는 경우)
    var firstQuintile = d3.quantile(dataValue, 0.20);
    var secondQuintile = d3.quantile(dataValue, 0.40);
    var thirdQuintile = d3.quantile(dataValue, 0.60);
    var fourthQuintile = d3.quantile(dataValue, 0.80);

    // 폴리곤 레이어의 색상 지정
    features.forEach(function(feature) {
        var properties = feature.properties;
        var value = properties.z_i;
        var gid = properties.gid;
        var color;
            // 등분위수에 따라 색상 지정
        if (value <= firstQuintile) {
            color = '#2b83ba';
        } else if (value <= secondQuintile) {
            color = '#abdda4';
        } else if (value <= thirdQuintile) {
            color = '#ffffbf';
        } else if (value <= fourthQuintile) {
            color = '#fdae61';
        } else {
            color = '#d7191c';
        }

        // 폴리곤의 속성으로 color 값을 추가
        feature.properties.color = color;
    });

    // 등분위수 색상 설정
    var colorScale = d3.scaleThreshold()
        .domain([firstQuintile, secondQuintile, thirdQuintile, fourthQuintile])
        .range(['#2b83ba', '#abdda4', '#ffffbf', '#fdae61', '#d7191c']);

    // 소수점 2자리
    function formatDecimal(value) {
        return parseFloat(value).toFixed(2);
    }
    // 범례 레이블과 색상 매핑
    var legendLabels = [
        '~ ' + formatDecimal(firstQuintile),
        formatDecimal(firstQuintile) + ' ~ ' + formatDecimal(secondQuintile),
        formatDecimal(secondQuintile) + ' ~ ' + formatDecimal(thirdQuintile),
        formatDecimal(thirdQuintile) + ' ~ ' + formatDecimal(fourthQuintile),
        formatDecimal(fourthQuintile) + ' ~ '
    ];
    var legendColors = ['#2b83ba', '#abdda4', '#ffffbf', '#fdae61', '#d7191c'];

    // 범례 생성 함수 호출
    createLegend(legendLabels, legendColors);

    map.addSource('polygon-layer', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': features
        }
    });

    map.addLayer({
        'id': 'polygon-layer',
        'type': 'fill',
        'source': 'polygon-layer',
        'layout': {},
        'paint': {
            'fill-color': ['get', 'color'], // 폴리곤의 color 속성 값을 색상으로 사용
            'fill-opacity': 0.8
        }
    });

    map.addLayer({
        'id': 'line-layer',
        'type': 'line',
        'source': 'polygon-layer',
        'layout': {},
        'paint': {
            'line-color': '#000000', // 테두리 라인 색상을 투명으로 설정
            'line-width': 1 // 테두리 라인의 두께 설정
        }
    });
}



var displaylayers = [];

function addPointOnClick(e) {
    var coordinates = e.lngLat;

    // 새로운 포인트를 Feature로 생성
    var newPoint = {
        type: 'Feature',
        properties: {
            pk: 'Sample Point',
            x: 'Sample Point',
            y: 'Sample Point',
            시설명: 'Sample Point',
            주소: 'Sample Point'
        },
        geometry: {
            type: 'Point',
            coordinates: [coordinates.lng, coordinates.lat]
        }
    };

    var layerId = point_layer_arry[point_layer_arry.length - 1];
    var pointData = map.getSource(layerId);
    var features = pointData._data.features || [];
    features.push(newPoint);
    pointData.setData({
        type: 'FeatureCollection',
        crs: { properties: { name: 'EPSG:4326' }, type: 'name' },
        features: features
    });

    // 추가한 포인트를 기존 레이어에 추가
    map.getSource(layerId).setData(pointData._data);


    // 클릭한 위치에서 이소크론 계산
    var isochroneUrl = 'https://api.mapbox.com/isochrone/v1/mapbox/driving/';
    isochroneUrl += coordinates.lng + ',' + coordinates.lat;
    isochroneUrl += '?contours_minutes=5&polygons=true';
    isochroneUrl += '&access_token=pk.eyJ1Ijoicm9kcm9kcm9kIiwiYSI6ImNsbzhjenA0NDAwMHEya3FxbmNqdjdqN3oifQ.jGTNuYvPIy6haMMPJVZQOQ';

  fetch(isochroneUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('이소크론 데이터를 가져오는 데 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            // 이소크론 데이터를 가져와서 지도에 표시
            var isochroneSourceId = 'isochrone-' + Date.now();
            var isochroneSourceId_line = 'isochrone_line' + Date.now();
            map.addSource(isochroneSourceId, {
                type: 'geojson',
                data: data
            });

            map.addLayer({
                id: isochroneSourceId,
                type: 'fill',
                source: isochroneSourceId,
                paint: {
                    'fill-color': '#756bb1',
                    'fill-opacity':0.4
                }
            });

            map.addLayer({
                id: isochroneSourceId_line,
                type: 'line',
                source: isochroneSourceId,
              paint: {
                'line-color': '#756bb1',
                'line-width': 1
              }
            });
            displaylayers.push(isochroneSourceId_line)
            displaylayers.push(isochroneSourceId)
        })
        .catch(error => {
            console.error('이소크론 데이터 가져오기 오류:', error);
        });


                // 클릭한 위치에서 이소크론 계산
    var isochroneUrl1 = 'https://api.mapbox.com/isochrone/v1/mapbox/walking/';
    isochroneUrl1 += coordinates.lng + ',' + coordinates.lat;
    isochroneUrl1 += '?contours_minutes=5&polygons=true';
    isochroneUrl1 += '&access_token=pk.eyJ1Ijoicm9kcm9kcm9kIiwiYSI6ImNsbzhjenA0NDAwMHEya3FxbmNqdjdqN3oifQ.jGTNuYvPIy6haMMPJVZQOQ';

  fetch(isochroneUrl1)
        .then(response => {
            if (!response.ok) {
                throw new Error('이소크론 데이터를 가져오는 데 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            // 이소크론 데이터를 가져와서 지도에 표시
            var isochroneSourceId1 = 'isochrone-1' + Date.now();
            var isochroneSourceId_lines1 = 'isochrone-lines1' + Date.now();

            map.addSource(isochroneSourceId1, {
                type: 'geojson',
                data: data
            });

            map.addLayer({
                id: isochroneSourceId1,
                type: 'fill',
                source: isochroneSourceId1,
                paint: {
                    'fill-color': '#9fbc60',
                    'fill-opacity': 0.7
                }
            });

            map.addLayer({
                id: isochroneSourceId_lines1,
                type: 'line',
                source: isochroneSourceId1,
              paint: {
                'line-color': '#9fbc60',
                'line-width': 1
              }
            });
            displaylayers.push(isochroneSourceId_lines1)
            displaylayers.push(isochroneSourceId1)
        })
        .catch(error => {
            console.error('이소크론 데이터 가져오기 오류:', error);
        });


    // 새로운 레이어를 만들어서 클릭으로 추가된 포인트 표시
    var displayLayerId = 'display-point-layer-' + Date.now();
    map.addSource(displayLayerId, {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: [newPoint]
        }
    });

    map.addLayer({
        id: displayLayerId,
        type: 'circle',
        source: displayLayerId,
        paint: {
            'circle-radius': 7,
            'circle-color': '#FFCE55',
            'circle-stroke-color': 'black',
            'circle-stroke-width': 3
        }
    });
    console.log(displayLayerId)
    displaylayers.push(displayLayerId)
    console.log(displaylayers)

}

// 버튼 상태를 나타내는 변수
var isAddingPoint = false;
// 'Add Point' 버튼 클릭 이벤트 리스너
function add_point() {
    // 버튼 상태를 토글
    isAddingPoint = !isAddingPoint;

    // 'Add Point' 버튼 엘리먼트를 찾음
    var addButton = document.getElementById('addPointButton');

    // 버튼 텍스트 업데이트 (옵션)
    if (isAddingPoint) {
        addButton.textContent = '추가 취소';
    } else {
        addButton.textContent = '시설 추가';
    }

    // 클릭 이벤트를 활성화하거나 비활성화
    if (isAddingPoint) {
        // 클릭 이벤트 활성화
        map.on('click', addPointOnClick);
    } else {
        // 클릭 이벤트 비활성화
        map.off('click', addPointOnClick);
    }
}

// 버튼 클릭 시 현재 맵에 있는 point-layer 내보내기
function export_point() {
    // 서버로 전송할 데이터 준비 (예: pointData 변수)
    var features = map.getSource('point-layer')._data.features;
//    console.log(features);

    // 서버로 POST 요청 보내기
    $.ajax({
        type: 'POST',
        url: '/export_point/', // 서버의 엔드포인트 URL
        data: JSON.stringify(features), // 데이터를 JSON 문자열로 변환하여 전송
        contentType: 'application/json',
        dataType: 'json',
        headers: {
            'X-CSRFToken': csrf_token // CSRF 토큰을 가져와서 요청 헤더에 추가
        },
        success: function(response) {
            console.log('Data sent to server and processed successfully:', response);
            // 성공한 경우에 원하는 작업 수행 (예: 메시지 표시)
            alert('Data exported successfully.');
        },
        error: function(error) {
            console.error('Error sending data to server:', error);
            // 오류가 발생한 경우에 처리 (예: 오류 메시지 표시)
            alert('Error exporting data.');
        }
    });
}

// 버튼 클릭 시 현재 맵에 있는 격자와 포인트 중첩
function grid_point() {
    var layerId = point_layer_arry[point_layer_arry.length - 1];
    var point = map.getSource(layerId)._data.features;
    var polygon = map.getSource('polygon-layer')._data.features;
//    console.log(point);
//    console.log(polygon);

    // 서버로 POST 요청 보내기 (예: features1와 features2를 하나로 결합한 후 전송)
    var combinedFeatures = {
        "point": point,
        "polygon": polygon
    };

    showLoadingScreen();

    // 서버로 POST 요청 보내기
    $.ajax({
        type: 'POST',
        url: '/grid_point/', // 서버의 엔드포인트 URL
        data: JSON.stringify(combinedFeatures), // 데이터를 JSON 문자열로 변환하여 전송
        contentType: 'application/json',
        dataType: 'json',
        headers: {
            'X-CSRFToken': csrf_token // CSRF 토큰을 가져와서 요청 헤더에 추가
        },
        success: function(response) {
            console.log('Data sent to server and processed successfully:', response);
            var facilityCountData = JSON.parse(response.facility_count);
//            console.log(facilityCountData);

            hideLoadingScreen()

            // 이전에 추가된 레이어 삭제
            if (map.getLayer('line-layer')) {
                map.removeLayer('line-layer');
            }
            if (map.getSource('polygon-layer')) {
                map.removeLayer('polygon-layer');
                map.removeSource('polygon-layer');
            }
            if (map.getLayer('point-layer')) {
                map.removeLayer('point-layer');
            }

            // json1과 json2를 병합
            const mergedJSON = mergeFeatures(polygon, facilityCountData);
//            console.log(mergedJSON);

            features = mergedJSON.features

            // 등분위수 계산을 위해 데이터를 배열에 저장
            var dataValues = [];
            features.forEach(function(feature) {
                var properties = feature.properties;
                var value = properties.facility_count; // 데이터의 속성값
                dataValues.push(value);
            });

            var dataValue = dataValues.filter(item => item !== 0 && item !== '0');

            // 등분위수 계산을 위해 데이터를 오름차순으로 정렬
            dataValue.sort(function(a, b) {
                return a - b;
            });

            // 등분위수 계산 (4분위수로 나누는 경우)
            var firstQuintile = d3.quantile(dataValue, 0.20);
            var secondQuintile = d3.quantile(dataValue, 0.40);
            var thirdQuintile = d3.quantile(dataValue, 0.60);
            var fourthQuintile = d3.quantile(dataValue, 0.80);

            // 폴리곤 레이어의 색상 지정
            features.forEach(function(feature) {
                var properties = feature.properties;
                var value = properties.facility_count;
                var gid = properties.gid;
                var color;
                    // 등분위수에 따라 색상 지정
                if (value <= firstQuintile) {
                    color = '#2b83ba';
                } else if (value <= secondQuintile) {
                    color = '#abdda4';
                } else if (value <= thirdQuintile) {
                    color = '#ffffbf';
                } else if (value <= fourthQuintile) {
                    color = '#fdae61';
                } else {
                    color = '#d7191c';
                }

                // 폴리곤의 속성으로 color 값을 추가
                feature.properties.color = color;
            });

            // 등분위수 색상 설정
            var colorScale = d3.scaleThreshold()
                .domain([firstQuintile, secondQuintile, thirdQuintile, fourthQuintile])
                .range(['#2b83ba', '#abdda4', '#ffffbf', '#fdae61', '#d7191c']);

            // 소수점 2자리
            function formatDecimal(value) {
                return parseFloat(value).toFixed(2);
            }
            // 범례 레이블과 색상 매핑
            var legendLabels = [
                '~ ' + formatDecimal(firstQuintile),
                formatDecimal(firstQuintile) + ' ~ ' + formatDecimal(secondQuintile),
                formatDecimal(secondQuintile) + ' ~ ' + formatDecimal(thirdQuintile),
                formatDecimal(thirdQuintile) + ' ~ ' + formatDecimal(fourthQuintile),
                formatDecimal(fourthQuintile) + ' ~ '
            ];
            var legendColors = ['#2b83ba', '#abdda4', '#ffffbf', '#fdae61', '#d7191c'];

            // 범례 생성 함수 호출
            createLegend(legendLabels, legendColors);

            map.addSource('polygon-layer', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': features
                }
            });

            map.addLayer({
                'id': 'polygon-layer',
                'type': 'fill',
                'source': 'polygon-layer',
                'layout': {},
                'paint': {
                    'fill-color': ['get', 'color'], // 폴리곤의 color 속성 값을 색상으로 사용
                    'fill-opacity': 0.8
                }
            });

            map.addLayer({
                'id': 'line-layer',
                'type': 'line',
                'source': 'polygon-layer',
                'layout': {},
                'paint': {
                    'line-color': '#000000', // 테두리 라인 색상을 투명으로 설정
                    'line-width': 1 // 테두리 라인의 두께 설정
                }
            });
            // 성공한 경우에 원하는 작업 수행 (예: 메시지 표시)
            alert('Data exported successfully.');
        },
        error: function(error) {

            hideLoadingScreen()

            console.error('Error sending data to server:', error);
            // 오류가 발생한 경우에 처리 (예: 오류 메시지 표시)
            alert('Error exporting data.');
        }
    });
}


// 읍면동 인구 폴리곤
var popJSON;
function load_pop() {
    if (map.getSource('highlight-source')) {
        map.removeLayer('highlight-polygon');
        map.removeLayer('label-layer');
        map.removeSource('highlight-source');
    }

    if (map.getLayer('pop-line')) {
        map.removeLayer('pop-line');
    }

    if (map.getSource('pop-polygon')) {
        map.removeLayer('pop-polygon');
        map.removeSource('pop-polygon');

    } else {

        showLoadingScreen()
        // AJAX 요청 보내기
        $.ajax({
            type: 'POST',
            url: "/pop_data/",
            data: {
                'csrfmiddlewaretoken': csrf_token,
            },
            dataType: 'json',
            success: function(data) {
                hideLoadingScreen()

                //console.log(data); //콘솔에 출력
                var data_container = $('#data-container');
                // 이전에 렌더링된 데이터 삭제
                data_container.empty();
                // 새로운 데이터 추가
                // GeoJSON 데이터를 지도에 추가
                popJSON = JSON.parse(data.pop); // GeoJSON 데이터 파싱
//                console.log(popJSON); // 콘솔에 출력

                popJSON.features.forEach(function(feature) {
                    // 각 피처에 ID를 추가합니다. 이 예제에서는 'adm_cd2'를 ID로 사용합니다.
                    feature.id = feature.properties.읍면동;
                });

                // 새로운 레이어 추가
                map.addSource('pop-polygon', {
                    'type': 'geojson',
                    'data': popJSON
                });
                map.addLayer({
                    'id': 'pop-polygon',
                    'type': 'fill',
                    'source': 'pop-polygon',
                    'layout': {},
                    'paint': {
                        'fill-color': '#5D75F9',
                        'fill-opacity': 0
                    }
                });

                map.addLayer({
                    'id': 'pop-line',
                    'type': 'line',
                    'source': 'pop-polygon',
                    'layout': {},
                    'paint': {
                        'line-color': 'black', // 테두리 라인 색상을 투명으로 설정
                        'line-width': 0.5 // 테두리 라인의 두께 설정
                    }
                });

                //console.log(polygonlayers)
            },
            error: function(request, status, error) {
                hideLoadingScreen()

                alert("선택된 지역은 데이터가 없습니다!")
//                console.log(error)
                // 선택 해제 시 데이터 삭제
                $('#data-container').empty();
            }
        });
    }
}


/*
// 읍면동 인구 테이블
var popTableVisible = false;
function showPopTable() {
    var tableContainer = $('#popTable');

    if (!popTableVisible) {
        showLoadingScreen()
        // 테이블이 보이지 않는 상태라면 테이블을 보이도록 처리
        tableContainer.show();
        popTableVisible = true; // 테이블 상태를 보이는 상태로 설정

        $.ajax({
            type: 'POST',
            url: "/pop_data/",
            data: {
                'csrfmiddlewaretoken': csrf_token,
            },
            dataType: 'json',
            success: function(data) {
                hideLoadingScreen()
                // 포인트 정보를 받아와서 테이블에 추가
                var tableBody = $('#popData tbody');
                tableBody.empty(); // 기존 테이블 내용 비우기

                // GeoJSON 데이터 파싱
                popJSON = JSON.parse(data.pop);

                // 포인트 정보를 테이블에 추가
                popJSON.features.forEach(function(feature) {
                    var properties = feature.properties;

                    var row = '<tr>' +
                        '<td>' + properties.읍면동 + '</td>' +
                        '<td>' + properties.유아 + '</td>' +
                        '<td>' + properties.초등학생 + '</td>' +
                        '<td>' + properties.중학생 + '</td>' +
                        '<td>' + properties.고등학생 + '</td>' +
                        '<td>' + properties.성인 + '</td>' +
                        '<td>' + properties.생산가능 + '</td>' +
                        '<td>' + properties.노인 + '</td>' +
                        '</tr>';

                    tableBody.append(row);
                });

                // 테이블을 보여주는 부분을 보이게 처리
                tableContainer.show();
                popTableVisible = true; // 테이블 상태를 보이는 상태로 설정
            },
            error: function(request, status, error) {
                hideLoadingScreen()
                alert("데이터가 없습니다!")
//                console.log(error);

                tableContainer.hide(); // 데이터가 없으면 테이블 숨기기
                popTableVisible = false; // 테이블 상태를 숨긴 상태로 설정
            }
        });
    } else {
        tableContainer.hide();
        popTableVisible = false;
    }
}
*/




// 읍면동 인구 테이블
var popTableVisible = false;
function showPopTable() {
    var tableContainer = $('#popTable');
    if (!popTableVisible) {
        showLoadingScreen()
        // 테이블이 보이지 않는 상태라면 테이블을 보이도록 처리
        tableContainer.show();
        popTableVisible = true; // 테이블 상태를 보이는 상태로 설정

        $.ajax({
            type: 'POST',
            url: "/pop_data/",
            data: {
                'csrfmiddlewaretoken': csrf_token,
            },
            dataType: 'json',
            success: function(data) {
                hideLoadingScreen()
                // 포인트 정보를 받아와서 테이블에 추가
                var tableBody = $('#popData tbody');
                tableBody.empty(); // 기존 테이블 내용 비우기

                // GeoJSON 데이터 파싱
                popJSON = JSON.parse(data.pop);

                // 포인트 정보를 테이블에 추가
                popJSON.features.forEach(function(feature) {
                    var properties = feature.properties;

                    var row = '<tr>' +
                        '<td>' + properties.읍면동 + '</td>' +
                        '<td>' + properties.유아 + '</td>' +
                        '<td>' + properties.초등학생 + '</td>' +
                        '<td>' + properties.중학생 + '</td>' +
                        '<td>' + properties.고등학생 + '</td>' +
                        '<td>' + properties.성인 + '</td>' +
                        '<td>' + properties.생산가능 + '</td>' +
                        '<td>' + properties.노인 + '</td>' +
                        '</tr>';

                    tableBody.append(row);
                });

                // 테이블을 보여주는 부분을 보이게 처리
                tableContainer.show();
                popTableVisible = true; // 테이블 상태를 보이는 상태로 설정
            },
            error: function(request, status, error) {
                hideLoadingScreen()
                alert("데이터가 없습니다!")
                console.log(error);

                tableContainer.hide(); // 데이터가 없으면 테이블 숨기기
                popTableVisible = false; // 테이블 상태를 숨긴 상태로 설정
            }
        });
    } else {
        tableContainer.hide();
        popTableVisible = false;
    }
}


var chart2Visible = false;

function tablepopbasicinfo() {
    var chart2Container = $('#chart2');

    if (!chart2Visible) {
        showLoadingScreen()
        // 테이블이 보이지 않는 상태라면 테이블을 보이도록 처리
        chart2Container.show();
        chart2Visible = true; // 테이블 상태를 보이는 상태로 설정

        $.ajax({
                type: 'POST',
                url: "/tabletotal_pop/",
                data: {
                    'csrfmiddlewaretoken': csrf_token,
                },
                dataType: 'json',
                success: function (data) {
                    var features = data.features;
                    var categories = [];  // X 축 레이블 (읍면동 이름) 배열 생성
                    var seriesData = [];  // 각 읍면동의 '총인구' 데이터 배열 생성

                    // GeoJSON 데이터를 반복하여 필요한 정보 추출
                    features.forEach(function (feature) {
                        var properties = feature.properties;
                        categories.push(properties.temp);  // 읍면동 이름을 X 축 레이블로 사용
                        seriesData.push(parseInt(properties.노인));  // 각 읍면동의 '총인구' 데이터를 추가
                    });

                    var features = data.features;
                    var categories = [];  // 읍면동 이름 배열 생성
                    var seriesData = {};  // 각 연령별 인구 데이터 배열 생성

                    // 각 연령 그룹 이름 설정
                    var ageGroups = [
                        '유아',
                        '초등학생',
                        '중학생',
                        '고등학생',
                        '성인',
                        '생산가능',
                        '노인'
                    ];

                    // 초기화: 각 연령 그룹별 데이터 배열 생성 및 초기화
                    ageGroups.forEach(function (ageGroup) {
                        seriesData[ageGroup] = [];
                    });

                    // GeoJSON 데이터를 반복하여 필요한 정보 추출
                    features.forEach(function (feature) {
                        var properties = feature.properties;
                        categories.push(properties.temp);  // 읍면동 이름 추가

                        // 각 연령 그룹의 '총인구' 데이터를 배열로 추출 및 해당 연령 그룹에 추가
                        ageGroups.forEach(function (ageGroup) {
                            var ageGroupPopulation = parseInt(properties[ageGroup]);
                            seriesData[ageGroup].push(ageGroupPopulation);
                        });
                    });

                    // Stacked Bar 차트 설정
                var options2 = {
                    series: ageGroups.map(function (ageGroup) {
                        return {
                            name: ageGroup,  // 연령 그룹 이름을 시리즈 이름으로 사용
                            data: seriesData[ageGroup]  // 해당 연령 그룹의 데이터 배열
                        };
                    }),
                    chart: {
                        type: 'bar',
                        height: 500,
                        width: 479,
                        stacked: true
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            dataLabels: {
                                position: 'top'
                            }
                        }
                    },
                    xaxis: {
                        title: {
                            text: '읍면돟',  // Y 축 제목
                        },
                        categories: categories,  // 읍면동 이름을 X 축 레이블로 사용
                        labels: {
                            formatter: function (val) {
                                return val;  // X 축 레이블 포맷
                            }
                        }
                    },
                    yaxis: {
                        title: {
                            text: '인구수',  // Y 축 제목
                        },
                    },
                    tooltip: {
                        y: {
                            formatter: function (val) {
                                return val;  // 툴팁 포맷
                            }
                        }
                    },
                    fill: {
                        opacity: 1
                    },
                    legend: {
                        position: 'top',
                        horizontalAlign: 'left',
                        offsetX: 40
                    },
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontSize: '0px',
                            fontWeight: 300
                        }
                    },
                    colors: ['#008FFB','#00E396','#FEB019','#FF4560','#775DD0','#81D4FA','#8D5B4C']
                };

                var chart = new ApexCharts(document.querySelector("#chart2"), options2);
                chart.render();

                // 테이블을 보여주는 부분을 보이게 처리
                chart2Container.show();
                chart2Visible = true; // 테이블 상태를 보이는 상태로 설정
            },
            error: function(request, status, error) {
                hideLoadingScreen()
                alert("데이터가 없습니다!")
//                console.log(error);

                chart2Container.hide(); // 데이터가 없으면 테이블 숨기기
                chart2Visible = false; // 테이블 상태를 숨긴 상태로 설정
            }
        });
    } else {
        chart2Container.hide();
        chart2Visible = false;
    }
}

