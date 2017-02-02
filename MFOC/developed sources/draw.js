var LOG = console.log;
function drawOnePolygon(onePolygon, height, with_height, r_color = Cesium.Color.ORANGE.withAlpha(0.3)) { //it gets one polygon

  var coordinates = onePolygon;
  var points = [];

  var position;

  if (height == null){
    for (var i = 0; i < coordinates.length; i++) {
        points.push(coordinates[i][0]);
        points.push(coordinates[i][1]);
        points.push(coordinates[i][2]);
    }
  }
  else{
    for (var i = 0; i < coordinates.length; i++) {
        points.push(coordinates[i][0]);
        points.push(coordinates[i][1]);
        points.push(height);
    }
  }
  console.log(points);
  position = Cesium.Cartesian3.fromDegreesArrayHeights(points);

  var polygonHierarchy = new Cesium.PolygonHierarchy(position);
  var color = Cesium.ColorGeometryInstanceAttribute.fromColor(r_color);

  var vertexF = new Cesium.VertexFormat({
    position : true,
    st : true,
    normal : false,
    color : true
  });

  var geometry = new Cesium.PolygonGeometry({
    polygonHierarchy : polygonHierarchy,
    vertexFormat : vertexF,
    perPositionHeight : true
  });

  var geoInstance = new Cesium.GeometryInstance({
    geometry : geometry,
    attributes : {
      color : color
    }
  });
  return geoInstance;
}

var drawPolygons = function(mf_arr, with_height) { // it gets one object of features.
  var prim_collecion = new Cesium.PrimitiveCollection();
  var r_color = Cesium.Color.fromRandom({
    red : 0.0,
    minimumBlue : 0.2,
    minimumGreen : 0.2,
    alpha : 0.3
  });

  var min_max_date = findAllMinMaxTime(mf_arr);

  for (var id = 0 ; id < mf_arr.length ; id++){
    var setOfPolygon = mf_arr[id];
    var coordinates = setOfPolygon.temporalGeometry.coordinates;
    var datetimes = setOfPolygon.temporalGeometry.datetimes;
    var name = setOfPolygon.properties.name;
    var polyCollection;
    var poly_list = new Array();
    var heights = getListOfHeight(datetimes, min_max_date);

        var r_color = Cesium.Color.fromRandom({
          red : 0.0,
          minimumBlue : 0.2,
          minimumGreen : 0.2,
          alpha : 0.3
        });
    for (var i = 0; i < coordinates.length; i++) {

      poly_list.push(drawOnePolygon(coordinates[i], heights[i], with_height, r_color));
    }


    polyCollection = new Cesium.Primitive({
      geometryInstances: poly_list,
      appearance: new Cesium.PerInstanceColorAppearance({})
    });
    prim_collecion.add(polyCollection);
  }
  return prim_collecion;

}

var drawTyphoons = function(mf_arr, with_height) { // it gets one object of features.

  if ( !Array.isArray(mf_arr) ){
    mf_arr = [mf_arr];
  }
  var typhoonCollection = new Cesium.PrimitiveCollection();


  var min_max_date = findAllMinMaxTime(mf_arr);


  for (var id = 0 ; id < mf_arr.length ; id++){

    var oneTyphoon = mf_arr[id];
    var coordinates = oneTyphoon.temporalGeometry.coordinates;
    var datetimes = oneTyphoon.temporalGeometry.datetimes;
    var name = oneTyphoon.properties.name;

    var geoInstance;
    var surface = [];
    var typhoon;

    var heights = getListOfHeight(datetimes, min_max_date);

    var r_color = Cesium.Color.fromRandom({
      red : 0.0,
      minimumBlue : 0.2,
      minimumGreen : 0.2,
      alpha : 0.3
    });

    for (var i = 0; i < coordinates.length - 1; i++) {
      for (var j = 0; j < coordinates[i].length - 1 ; j++) {

        var temp_poly = new Array();
        var temp_point = new Array();
        var first = coordinates[i][j];
        var sec = coordinates[i + 1][j];
        var third = coordinates[i + 1][j + 1];
        var forth = coordinates[i][j + 1];


        if (with_height){
          temp_poly.push([first[0], first[1], heights[i]], [sec[0], sec[1], heights[i+1]],
             [third[0], third[1], heights[i+1]], [forth[0], forth[1], heights[i]]);
        }
        else{
          temp_poly.push([first[0], first[1], 0], [sec[0], sec[1], 0],
            [third[0], third[1], 0], [forth[0], forth[1], 0]);
        }

        geoInstance = drawOnePolygon(temp_poly, null, with_height, r_color);
        surface.push(geoInstance);
      }
    }
    var typhoon = new Cesium.Primitive({
      geometryInstances: surface,
      appearance: new Cesium.PerInstanceColorAppearance()
    });
    typhoonCollection.add(typhoon);
  }
  return typhoonCollection;

}


function drawOnePoint(onePoint,height){ //it gets one point
  var pointInstance = new PointPrimitive();
  var position = Cesium.Cartesian3.fromDegrees(onePoint[0],onePoint[1],height);;
  pointInstance.position = position;
  return pointInstance;
}

var drawPoints = function(mf_arr, with_height){ //it gets set of points
  if ( !Array.isArray(mf_arr) ){
    mf_arr = [mf_arr];
  }
  var pointCollection = new Cesium.PointPrimitiveCollection();

  var min_max_date = findAllMinMaxTime(mf_arr);

  for (var id = 0 ; id < mf_arr.length ; id++){
    var buffer = mf_arr[id];
    var heights = getListOfHeight(buffer.temporalGeometry.datetimes, min_max_date);
    var data = buffer.temporalGeometry.coordinates;
    if(with_height){
      for(var i = 0 ; i < data.length ; i++ ){
        pointCollection.add(drawOnePoint(data[i], heights[i]));
      }
    }
    else{
      for(var i = 0 ; i < data.length ; i++ ){
        pointCollection.add(drawOnePoint(data[i], 0));
      }
    }
  }
  return pointCollection;
}

function drawOneLine(oneLine, height) { //it gets one object of features
  var points = [];
  var positions;
  var line;

  for (var i = 0; i < oneLine.length; i++) {
    points.push(oneLine[i][0], oneLine[i][1], height);
  }
  position = Cesium.Cartesian3.fromDegreesArrayHeights(points);

  line = new Cesium.Polyline({
    positions: positions,
    color: Cesium.Color.WHITE,
    width: 2
  });
  return line;
}

var drawLines= function(mf_arr, with_height) { // it gets one object of features.
  if ( !Array.isArray(mf_arr) ){
    mf_arr = [mf_arr];
  }
  var polylineCollection = new Cesium.PolylineCollection();

  var min_max_date = findAllMinMaxTime(mf_arr);

  for (var id = 0 ; id < mf_arr.length ; id++){
    var buffer = mf_arr[id];
    var data = buffer.temporalGeometry;
    var heights = getListOfHeight(data.datetimes, min_max_date);

    if(with_height){
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data.coordinates.length; j++) {
          polylineCollection.add(drawOneLine(data.coordinates[j], heights[j]));
        }
      }
    }
    else{
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data.coordinates.length; j++) {
          polylineCollection.add(drawOneLine(data.coordinates[j], 0));
        }
      }
    }
  }
  return polylineCollection;
}

function findAllMinMaxTime(mf_arr){
  var first_date = new Date(mf_arr[0].temporalGeometry.datetimes[0]);
  var min_max_date = [first_date,first_date];
  for (var i = 0 ; i < mf_arr.length ; i++){
    var temp_max_min = findMinMaxTime(mf_arr[i].temporalGeometry.datetimes);
    if (temp_max_min[0].getTime() < min_max_date[0].getTime()){
      min_max_date[0] = temp_max_min[0];
    }
    if (temp_max_min[1].getTime() > min_max_date[1].getTime()){
      min_max_date[1] = temp_max_min[1];
    }
  }
  return min_max_date;
}
function drawSurfaceBetween2Polylines(polyline1, polyline2) {
  var surface_line_list = calculateMovingPath(polyline1, polyline2);
  var triangle_list = [];
  for (var i = 0; i < surface_line_list.length - 1; i++) {
    triangle_list.push(calculateTriangleWithLines(surface_line_list[i], surface_line_list[i + 1]));
  }
  return triangle_list;
}

function calculateMovingPath(polyline1, polyline2) {
  var surface = new Array();
  var cur_index1 = 0;
  var cur_index2 = 0;
  var next_index1 = cur_index1 + 1;
  var next_index2 = cur_index2 + 1
  var curr_point;
  var next_point;
  var line = [];

  line.push(polyline1[cur_index1], polyline2[cur_index2]);
  surface.push(line);

  while (1) {
    if (next_index1 == polyline1.length && next_index2 == polyline2.length) {
      break;
    }
    if (next_index1 == polyline1.length) {
      cur_point = cur_index1;
      next_point = next_index2;
      line = [];
      line.push(polyline1[cur_point], polyline2[next_point]);
      cur_index2 = next_index2;
      next_index2 = next_index2 + 1;
    } else if (next_index2 == polyline2.length) {
      cur_point = cur_index2;
      next_point = next_index1;
      line = [];
      line.push(polyline1[next_point], polyline2[cur_point]);
      cur_index1 = next_index1;
      next_index1 = next_index1 + 1;
    } else {
      var dis1 = calculateDistanceThree3D(polyline1[cur_index1], polyline2[cur_index2], polyline1[next_index1]);
      var dis2 = calculateDistanceThree3D(polyline1[cur_index1], polyline2[cur_index2], polyline2[next_index2]);

      if (dis1 < dis2) {
        cur_point = cur_index2;
        next_point = next_index1;
        line = [];
        line.push(polyline1[next_point], polyline2[cur_point]);
        cur_index1 = next_index1;
        next_index1 = next_index1 + 1;

      } else {
        cur_point = cur_index1;
        next_point = next_index2;
        line.push(polyline1[cur_point], polyline2[next_point]);
        cur_index2 = next_index2;
        next_index2 = next_index2 + 1;
      }
    }
    surface.push(line);
  }

  return surface;
}



function get2Dpoints(coordinates) {
  var temp_point = new Array();
  var temp_list = new Array();
  var poly_lines = new Array();
  for (var i = 0; i < coordinates.length; i++) {
    for (var j = 0; j < coordinates[i].length; j++) {
      temp_point.push(coordinates[i][j][0], coordinates[i][j][1]);
      temp_list.push(temp_point);
      temp_point = [];
    }
    poly_lines.push(temp_list);
    temp_list = [];
  }
  return poly_lines;
}


function get3DPoints(coordinates, timeline, timebase, with_height) { //coordinates is the set of points.
  var temp_point = new Array();
  var temp_list = new Array();
  var poly_lines = new Array();
  var time = (getTime2(timeline) - getTime2(timebase)) / (1000);
  for (var i = 0; i < coordinates.length; i++) {
    temp_point.push(coordinates[i][0]);
    temp_point.push(coordinates[i][1]);
    if (with_height) {
      temp_point.push(time);
    } else {
      temp_point.push(0);
    }
    poly_lines.push(temp_point);
    temp_point = [];
    //console.log((getTime2(timeline) - getTime2(timebase)) / 1000);
  }

  return poly_lines;
}
function calculateDistanceThree3D(p1, p2, p3) {
  var dis1 = euclidianDistance3D(p1, p3);
  var dis2 = euclidianDistance3D(p2, p3);
  return (dis1 + dis2) / 2;
}
function euclidianDistance2D(a, b) {
  var pow1 = Math.pow(a[0] - b[0], 2);
  var pow2 = Math.pow(a[1] - b[1], 2);
  return Math.sqrt(pow1 + pow2);
}

function euclidianDistance3D(a, b) {
  var pow1 = Math.pow(a[0] - b[0], 2);
  var pow2 = Math.pow(a[1] - b[1], 2);
  var pow3 = Math.pow(a[2] - b[2], 2);
  return Math.sqrt(pow1 + pow2 + pow3);
}
function calculateTriangleWithLines(polyline1, polyline2) {
  var triangle = [];
  if (polyline1[0] == polyline2[0]) {
    triangle.push(polyline1[0], polyline1[1], polyline2[1]);
  } else if (polyline1[1] == polyline2[1]) {
    triangle.push(polyline1[0], polyline1[1], polyline2[0]);
  } else if (polyline1[0] == polyline2[1]) {
    triangle.push(polyline1[0], polyline1[1], polyline2[0]);
  } else if (polyline1[1] == polyline2[0]) {
    triangle.push(polyline1[0], polyline1[1], polyline2[1]);
  } else {
    triangle.push(polyline1[0], polyline1[1], polyline2[1], polyline2[0]);
  }
  return triangle;
}
