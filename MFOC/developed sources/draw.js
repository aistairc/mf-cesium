var LOG = console.log;
function drawOnePolygon(onePolygon, with_height) { //it gets one polygon

  var coordinates = onePolygon;
  var points = [];

  var position;

  for (var i = 0; i < coordinates.length; i++) {
      points.push(coordinates[i][0]);
      points.push(coordinates[i][1]);
      points.push(coordinates[i][2]);
  }
  position = Cesium.Cartesian3.fromDegreesArrayHeights(points);

  var polygonHierarchy = new Cesium.PolygonHierarchy(position);
  var color = Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.ORANGE.withAlpha(0.3));


  var geometry = new Cesium.PolygonGeometry({
    polygonHierarchy : polygonHierarchy,
    //vertexFormat : vertexF,
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

var drawPolygons = function(setOfPolygon, with_height) { // it gets one object of features.
  var coordinates = setOfPolygon.temporalGeometry.coordinates;
  var datetimes = setOfPolygon.temporalGeometry.datetimes;
  var name = setOfPolygon.properties.name;
  var polyCollection;
  var poly_list = new Array();
  var heights = getListOfHeight(datetimes);

  if(with_height){
    for (var i = 0; i < coordinates.length; i++) {
      poly_list.push(drawOnePolygon(coordinates[i], heights[i], with_height));
    }
  }
  else{
    for (var i = 0; i < coordinates.length; i++) {
      poly_list.push(drawOnePolygon(coordinates[i], 0, with_height));
    }
  }

  polyCollection = new Cesium.Primitive({
    geometryInstances: poly_list,
    appearance: new Cesium.PerInstanceColorAppearance({})
  });
  return polyCollection;
}

function drawTyphoon(oneTyphoon, with_height) { // it gets one object of features.
  var coordinates = oneTyphoon.temporalGeometry.coordinates;
  var datetimes = oneTyphoon.temporalGeometry.datetimes;
  var name = oneTyphoon.properties.name;
  var one_poly = [];
  var new_line = [];
  var new_point = [];
  var geoInstance;
  var surface = [];
  var typhoon;
  var heights = getListOfHeight(datetimes);
  for (var i = 0; i < coordinates.length; i++) {
    new_line = [];
    for (var j = 0; j < coordinates[0].length; j++) {
      new_point = [];
      new_point.push(coordinates[i][j][0]);
      new_point.push(coordinates[i][j][1]);
      new_line.push(new_point);
    }
    one_poly.push(new_line);
  }

  console.log(one_poly);
  for (var i = 0; i < one_poly.length - 1; i++) {
    for (var j = 0; j < one_poly[i].length - 1 ; j++) {

      var temp_poly = new Array();
      var temp_point = new Array();
      var first = one_poly[i][j];
      var sec = one_poly[i + 1][j];
      var third = one_poly[i + 1][j + 1];
      var forth = one_poly[i][j + 1];


      if (with_height){
        temp_poly.push([first[0], first[1], heights[i]], [sec[0], sec[1], heights[i+1]],
           [third[0], third[1], heights[i+1]], [forth[0], forth[1], heights[i]]);
      }
      else{
        temp_poly.push([first[0], first[1], 0], [sec[0], sec[1], 0],
          [third[0], third[1], 0], [forth[0], forth[1], 0]);
      }

      geoInstance = drawOnePolygon(temp_poly, with_height);
      surface.push(geoInstance);
    }
  }
  var typhoon = new Cesium.Primitive({
    geometryInstances: surface,
    appearance: new Cesium.PerInstanceColorAppearance({

    })
  });
  return typhoon;
}


function drawOnePoint(onePoint,height, with_height){ //it gets one point
  var pointInstance = new PointPrimitive();
  var position;
  if (with_height) {
    position = Cesium.Cartesian3.fromDegrees(onePoint[0],onePoint[1],height);
  }
  else{
    position = Cesium.Cartesian3.fromDegrees(onePoint[0],onePoint[1],height);
  }
  pointInstance.position = position;
  return pointInstance;
}

function drawPoints(buffer, with_height){ //it gets set of points
  var pointCollection = new Cesium.PointPrimitiveCollection();
  var heights = getListOfHeight(buffer.temporalGeometry.datetimes);
  var data = buffer.temporalGeometry.coordinates;
  if(with_height){
    for(var i = 0 ; i < data.length ; i++ ){
      pointCollection.add(drawOnePoint(data[i], heights[i], with_height));
    }
  }
  else{
    for(var i = 0 ; i < data.length ; i++ ){
      pointCollection.add(drawOnePoint(data[i], 0, with_height));
    }
  }
  return pointCollection;
}

function drawOneLine(oneLine, height, with_height) { //it gets one object of features
  var points = [];
  var positions;
  var line;
  if (with_height) {
    for (var i = 0; i < oneLine.length; i++) {
      points.push(oneLine[i][0], oneLine[i][1], height);
    }
    position = Cesium.Cartesian3.fromDegreesArrayHeights(points);
  } else {
    for (var i = 0; i < oneLine.length; i++) {
      points.push(oneLine[i][0], oneLine[i][1], 0);
    }
    position = Cesium.Cartesian3.fromDegreesArray(points);
  }

  line = new Cesium.Polyline({
    positions: positions,
    color: Cesium.Color.WHITE,
    width: 2
  });
  return line;
}

function drawLines(buffer, with_height) { // it gets one object of features.
  var data = buffer.temporalGeometry;
  var heights = getListOfHeight(data.datetimes);
  var polylineCollection = new Cesium.PolylineCollection();

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
  return polylineCollection;
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
