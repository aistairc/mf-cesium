var LOG = console.log;

function drawOnePolygon(onePolygon, height, with_height, r_color = Cesium.Color.ORANGE.withAlpha(0.3)) { //it gets one polygon
  var coordinates = onePolygon;
  var points = [];

  var position;
  if (!with_height){
    height = 0;
    for (var i = 0; i < coordinates.length; i++) {
        points.push(coordinates[i][0]);
        points.push(coordinates[i][1]);
        points.push(height);
    }
  }
  else{
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
  }


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
    var heights = null;
    if (with_height){
      heights = getListOfHeight(datetimes, min_max_date);
    }

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

function drawOnePoint(onePoint,height,r_color){ //it gets one point
  var pointInstance = new Cesium.PointPrimitive();
  var position = Cesium.Cartesian3.fromDegrees(onePoint[0],onePoint[1],height);;
  pointInstance.position = position;
  pointInstance.color = r_color;
  return pointInstance;
}

var drawPoints = function(mf_arr, with_height){ //it gets set of points
  if ( !Array.isArray(mf_arr) ){
    mf_arr = [mf_arr];
  }
  var pointCollection = new Cesium.PointPrimitiveCollection();

  var min_max_date = findAllMinMaxTime(mf_arr);

  for (var id = 0 ; id < mf_arr.length ; id++){

    var r_color = Cesium.Color.fromRandom({
      red : 0.0,
      minimumBlue : 0.2,
      minimumGreen : 0.2,
      alpha : 1.0
    });
    var buffer = mf_arr[id];
    var heights = getListOfHeight(buffer.temporalGeometry.datetimes, min_max_date);
    var data = buffer.temporalGeometry.coordinates;
    if(with_height){
      for(var i = 0 ; i < data.length ; i++ ){
        pointCollection.add(drawOnePoint(data[i], heights[i], r_color));
      }
    }
    else{
      for(var i = 0 ; i < data.length ; i++ ){
        pointCollection.add(drawOnePoint(data[i], 0, r_color));
      }
    }
  }
  return pointCollection;
}

function drawOneLine(positions, r_color){
  var material = new Cesium.Material.fromType('Color');
  material.uniforms.color = r_color;

  var line = {
    positions :  Cesium.Cartesian3.fromDegreesArrayHeights(positions) ,
    width : 5,
    material : material
  };

  return line;
}

function makeDegreesArray(pos_2d, height){
  var points = [];
  for (var i = 0; i < pos_2d.length; i++) {
    if (Array.isArray(height)){
      points.push(pos_2d[i][0], pos_2d[i][1], height[i]);
    }
    else{
      points.push(pos_2d[i][0], pos_2d[i][1], height);
    }
  }
  return points;
}

var drawLines = function(mf_arr, with_height) { // it gets one object of features.
  if ( !Array.isArray(mf_arr) ){
    mf_arr = [mf_arr];
  }
  var polylineCollection = new Cesium.PolylineCollection();

  var min_max_date = findAllMinMaxTime(mf_arr);

  for (var id = 0 ; id < mf_arr.length ; id++){
    var r_color = Cesium.Color.fromRandom({
      red : 0.0,
      minimumBlue : 0.2,
      minimumGreen : 0.2,
      alpha : 1.0
    });

    var buffer = mf_arr[id];
    var data = buffer.temporalGeometry;
    var heights = getListOfHeight(data.datetimes, min_max_date);

    for (var j = 0 ; j < data.coordinates.length ; j++){
      if (!with_height){
        heights[j] = 0;
      }
      var positions = makeDegreesArray(data.coordinates[j], heights[j]);
      polylineCollection.add(drawOneLine(positions, r_color));
    }
  }
  return polylineCollection;
}

function calculateDistanceThree2D(p1, p2, p3) {
  var dis1 = euclidianDistance2D(p1, p3);
  var dis2 = euclidianDistance2D(p2, p3);
  return (dis1 + dis2) / 2;
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


var drawPointsPath = function(mf_arr, with_height){
  if ( !Array.isArray(mf_arr) ){
    mf_arr = [mf_arr];
  }
  var polylineCollection = new Cesium.PolylineCollection();

  var min_max_date = findAllMinMaxTime(mf_arr);

  for (var id = 0 ; id < mf_arr.length ; id++){
    var r_color = Cesium.Color.fromRandom({
      red : 0.0,
      minimumBlue : 0.2,
      minimumGreen : 0.2,
      alpha : 1.0
    });

    var buffer = mf_arr[id];
    var data = buffer.temporalGeometry;
    var heights = getListOfHeight(data.datetimes, min_max_date);

    var positions = makeDegreesArray(data.coordinates, heights);
    polylineCollection.add(drawOneLine(positions, r_color));
  }
  return polylineCollection;
}

var drawLinesPath = function(mf_arr, with_height){
  if ( !Array.isArray(mf_arr) ){
    mf_arr = [mf_arr];
  }
  var trianlgeCollection = new Cesium.PrimitiveCollection();

  var min_max_date = findAllMinMaxTime(mf_arr);

  for (var id = 0 ; id < mf_arr.length ; id ++ ){
    var data = mf_arr[id].temporalGeometry;
    var heights = getListOfHeight(data.datetimes, min_max_date);
    var coord_arr = data.coordinates;
    for (var i = 0; i < coord_arr.length ; i++){
      if (i == 0){
        pre_polyline = coord_arr[0];
        continue;
      }

      trianlgeCollection.add(drawTrinaglesWithNextPos(pre_polyline, coord_arr[i], heights[i-1], heights[i], with_height));



      pre_polyline = coord_arr[i];
    }
  }
  return trianlgeCollection;
}

function drawTrinaglesWithNextPos(line_1, line_2, height1, height2, with_height){
  var instances = [];
  var i=0,
  j=0;

  while ( i < line_1.length - 1 && j < line_2.length - 1){

    var color = Cesium.Color.fromRandom({
      minimumRed : 0.6,
      minimumBlue : 0.0,
      minimumGreen : 0.0,
      alpha : 0.4
    });

    var positions = [];
    var point_1 = line_1[i];
    var point_2 = line_2[j];

    var next_point_1 = line_1[i+1];
    var next_point_2 = line_2[j+1];

    point_1.push(height1);
    positions.push(point_1);
    point_2.push(height2);
    positions.push(point_2);

    var dist1 = euclidianDistance2D(point_1, next_point_2);
    var dist2 = euclidianDistance2D(point_2, next_point_1);

    if (dist1 > dist2){
      next_point_1.push(height1);
      positions.push(next_point_1);

      i++;
    }
    else{
      next_point_2.push(height2);
      positions.push(next_point_2);

      j++;
    }
    instances.push(drawOnePolygon(positions,null,with_height,color));
  }

  while (i < line_1.length - 1 || j < line_2.length - 1){
    var color = Cesium.Color.fromRandom({
      minimumRed : 0.6,
      minimumBlue : 0.0,
      minimumGreen : 0.0,
      alpha : 0.4
    });

    var positions = [];
    var point_1 = line_1[i];
    var point_2 = line_2[j];

    point_1.push(height1);
    positions.push(point_1);
    point_2.push(height2);
    positions.push(point_2);


    if (i == line_1.length - 1){
      var next_point = line_2[j+1];
      next_point.push(height2);
      positions.push(next_point);

      j++;
    }
    else if (j == line_2.length - 1){
      var next_point = line_1[i+1];
      next_point.push(height1);
      positions.push(next_point);

      i++;
    }
    else {
      alert("error");
    }
    instances.push(drawOnePolygon(positions,null,with_height,color));
  }

  var temp = new Cesium.Primitive({
    geometryInstances : instances,
    appearance : new Cesium.PerInstanceColorAppearance({   }),
    show : true
  });


  return temp;

}


function drawOneCube(lower, upper, ){

  /*

    var prim = new Cesium.Primitive({
      geometryInstances : instances,
      appearance : new Cesium.PerInstanceColorAppearance({
        translucent : true
      }),
      show : true
    });


    var p_geometry = Cesium.PolygonGeometry.createGeometry(polygon);

    return (new Cesium.GeometryInstance({
      geometry : p_geometry,
      attributes : {
        color : Cesium.ColorGeometryInstanceAttribute.fromColor(r_color)
      }

    } ));

    var box = new Cesium.BoxGeometry({
    vertexFormat : Cesium.VertexFormat.POSITION_ONLY,
    maximum : new Cesium.Cartesian3(250000.0, 250000.0, 250000.0),
    minimum : new Cesium.Cartesian3(-250000.0, -250000.0, -250000.0)
  });
  */

}
//draw movingfeature with z-value.

var drawPolygonsWithZvalue = function(mf_arr, with_height){

}


var drawPointsWithZvalue = function(mf_arr, with_height){
  var pointCollection = new Cesium.PointPrimitiveCollection();
  var min_max = findAllMinMaxTimeAndZ(mf_arr, true);

  LOG(min_max.value);
  for (var id = 0 ; id < mf_arr.length ; id++){
    var r_color = Cesium.Color.fromRandom({
      red : 0.0,
      blue : 0.0,
      minimumGreen : 0.2,
      alpha : 1.0
    });

    var buffer = mf_arr[id];
    var heights = getListOfHeight(buffer.temporalGeometry.datetimes, min_max.date, 1000);
    var data = buffer.temporalGeometry.coordinates;
    for(var i = 0 ; i < data.length ; i++ ){
      var p_color = r_color.clone();
      p_color.red = data[i][2] / min_max.value[1];
      p_color.blue = data[i][2] / min_max.value[1];

      if (!with_height){
        heights[i] = 0;
      }
      pointCollection.add(drawOnePoint(data[i], heights[i], p_color));
    }
  }
  return pointCollection;
}


var drawLinesWithZvalue = function(mf_arr, with_height){

}

var drawTyphoonsWithZvalue = function(mf_arr, with_height){

}

var drawLinesPathWithZvalue = function(mf_arr, with_height){

}

var drawPointsPathWithZvalue = function(mf_arr, with_height){
  if ( !Array.isArray(mf_arr) ){
    mf_arr = [mf_arr];
  }



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
      var dis1 = calculateDistanceThree2D(polyline1[cur_index1], polyline2[cur_index2], polyline1[next_index1]);
      var dis2 = calculateDistanceThree2D(polyline1[cur_index1], polyline2[cur_index2], polyline2[next_index2]);

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


function getDateFromISOString(timeValue) {
    var time = timeValue; //the basetime we will use for nomalization of datetimes
    var time_split = time.split('T'); //get date
    time_split[1] = time_split[1].replace('Z', ""); //get time
    var date_arr = time_split[0].split('-');
    var time_arr = time_split[1].split(':');
    var timestamp = new Date(date_arr[0], date_arr[1] - 1, date_arr[2], time_arr[0], time_arr[1], time_arr[2]);
    return timestamp;
}

function getDateFromISOString2(timevalue) {
    var time = timevalue; //the basetime we will use for nomalization of datetimes
    var time_split = time.split(' '); //get date
    var date_arr = time_split[0].split('-');
    var time_arr = time_split[1].split(':');
    var timestamp = new Date(date_arr[0], date_arr[1] - 1, date_arr[2], time_arr[0], time_arr[1], time_arr[2]);
    return timestamp;
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

function setClock(start, stop, multi) {
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.multiplier = multi;
    viewer.timeline.zoomTo(start, stop);
}

function setDefaultClock() {
    var start = Cesium.JulianDate.fromDate(new Date());
    var end = Cesium.JulianDate.addDays(start, 1, new Cesium.JulianDate());
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = end.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.multiplier = 1;
    viewer.timeline.zoomTo(start, end);
}
var show3DHitMapMovingPoint = function(mf_arr,x_deg,y_deg,time_deg){//time_deg is seconds
  var min_max = findMinMaxCoordAndTimeInMFArray(mf_arr);

  var cube_data = [];
  var time_length = (min_max.date[1].getTime() - min_max.date[0].getTime())/(time_deg * 1000);
  var start = Cesium.JulianDate.fromDate(min_max.date[0]);

  var x_band = min_max.coord.x_max - min_max.coord.x_min;
  y_band = min_max.coord.y_max - min_max.coord.y_min;
  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  for (var i = 0 ; i < time_length + 1 ; i++){
    cube_data[i] = {
      time : Cesium.JulianDate.addSeconds(start, time_deg * i, new Cesium.JulianDate())

    };
    cube_data[i].count = [];
    for (var x = 0 ; x < x_length ; x++){
      cube_data[i].count[x] = [];
      for (var y = 0 ; y < y_length ; y++){
        cube_data[i].count[x][y] = 0;
      }
    }
  }

  var max_num = 0;
//  console.log(cube_data);
  for (var mf = 0 ; mf < mf_arr.length ; mf++){
    var geometry = mf_arr[mf].temporalGeometry;
    var datetimes = geometry.datetimes;
    var property = new Cesium.SampledPositionProperty();
    if (geometry.interpolations == "Spline"){
      property.setInterpolationOptions({
        interpolationAlgorithm : Cesium.HermitePolynomialApproximation,
        interpolationDegree : 2
      });
    }
    for (var time = 0 ; time < datetimes.length ; time++){
      var jul_time = Cesium.JulianDate.fromDate(new Date(datetimes[time]));
      var normalize = normalizeTime(new Date(datetimes[time]), min_max.date);
      var position = {        x : geometry.coordinates[time][0],        y : geometry.coordinates[time][1]      };
      //Cesium.Cartesian2.fromElements(geometry.coordinates[time][0],geometry.coordinates[time][1]);
      property.addSample(jul_time, position);
    }

    for (var i = 0 ; i < time_length ; i++){
      var position = property.getValue(cube_data[i].time);

      if (position != undefined)
      {
      console.log(i, position);
      //  console.log(i, position);
        if (cube_data[i].count == undefined){
          var x = getCubeIndexFromSample(position.x, x_deg, min_max.coord.x_min);
          var y = getCubeIndexFromSample(position.y, y_deg, min_max.coord.y_min);
          cube_data[i].count[x][y] += 1;
          max_num = Math.max(cube_data[i].count[x][y],max_num);
        }

      }
    }
  }

  var cube_prim = makeCube(cube_data, min_max, x_deg, y_deg, max_num);


}

function getCubeIndexFromSample(value, deg, min){
  return Math.floor((value - min) / deg);
}


function makeCube(data,min_max, x_deg, y_deg, time_deg, max_num){
  var instances = [];
  for (var z = 0 ; z < data.length ; z++){
    var lower_iso_time = data[z].time.toString();
    var upper_iso_time = data[z+1].time.toString();
    for (var x = 0 ; x < data[z].count.length ; x++){
      for (var y = 0 ; y < data[z].count[x].length ; y++){
        var count = data[z].count[x][y];
        var lower_x = min_max.coord.x_min + x_deg * x;
        var upper_x = min_max.coord.x_min + x_deg * (x + 1);
        var lower_y = min_max.coord.y_min + y_deg * y;
        var lower_y = min_max.coord.y_min + y_deg * (y + 1);
        var lower = [lower_x, lower_y, normalizeTime(new Date(lower_iso_time), min_max.date)];
        var upper = [upper_x, upper_y, normalizeTime(new Date(upper_iso_time), min_max.date)];
        instances.push(drawOneCube(lower, upper, count/max_num));
      }
    }
  }
  return instances;
}
function calculatePathForEachPoint(mls){

  var pre_polyline;
  var coord_arr = mls.temporalGeometry.coordinates;
  var next_mapping_point_arr = [];
  for (var i = 0; i < coord_arr.length ; i++){
    if (i == 0){
      pre_polyline = coord_arr[0];
      continue;
    }

    next_mapping_point_arr[i-1] = findMapping(pre_polyline, coord_arr[i]);

    pre_polyline = coord_arr[i];
  }

  return next_mapping_point_arr;
}

function findMapping(line_1, line_2){
  var i=0,
  j=0;
  var array = [];
  array.push([line_1[0],line_2[0]]);
  while ( i < line_1.length - 1 && j < line_2.length - 1){
    var point_1 = line_1[i];
    var point_2 = line_2[j];

    var next_point_1 = line_1[i+1];
    var next_point_2 = line_2[j+1];

    var dist1 = calculateDist(point_1, next_point_2);
    var dist2 = calculateDist(point_2, next_point_1);

    var triangle = [];
    if (dist1 > dist2){
      array.push([next_point_1,point_2]);
      i++;
    }
    else{
      array.push([point_1,next_point_2]);
      j++;
    }
  }

  while (i < line_1.length - 1 || j < line_2.length - 1){
    var point_1 = line_1[i];
    var point_2 = line_2[j];

    if (i == line_1.length - 1){
      var next_point = line_2[j+1];
      array.push([point_1,next_point]);
      j++;
    }
    else if (j == line_2.length - 1){
      var next_point = line_1[i+1];
      array.push([next_point,point_2]);
      i++;
    }
    else {
      alert("error");
    }
  }
  return array;
}

var moveLineStringArray = function(mf_arr, with_height = 1){
  var multiplier = 10000;

  var czml = [{
    "id" : "document",
    "name" : "polyline_highligh",
    "version" : "1.0"
  }];

  var glo_start, glo_stop;
  glo_start = new Date(mf_arr[0].temporalGeometry.datetimes[0]);
  glo_stop = glo_start;

  var min_max_date = [];

  for (var id = 0 ; id < mf_arr.length ; id++){

    var geometry = mf_arr[id].temporalGeometry;
    var poly_min_max_date = findMinMaxTime(geometry.datetimes);
    if (poly_min_max_date[0] < new Date(global_start).getTime()){
      global_start = new Date(poly_min_max_date[0]);
    }
    if (poly_min_max_date[1] > new Date(global_stop).getTime()){
      global_stop = new Date(poly_min_max_date[1]);
    }

  }

  min_max_date = [global_start, global_stop];


  for (var d = 0 ; d < mf_arr.length ; d ++){

    var mls = mf_arr[d];
    var geometry = mls.temporalGeometry;
    var datetime = geometry.datetimes;
    var length = datetime.length;
    var next_mapping_point_arr = this.calculatePathForEachPoint(mls);

    if (geometry.interpolations == "Spline" || geometry.interpolations == "Linear")
    {


      var next_point_each_line = next_mapping_point_arr;
      var interpolations;
      if (geometry.interpolations == "Spline"){
        interpolations = "HERMITE";
      }
      else{
        interpolations = "LINEAR";
      }
      for (var i = 0 ; i < next_point_each_line.length ; i++ ){
        //한 줄 씩 start -> end로 polyline
        var start, stop;
        start = new Date(datetime[i]).toISOString();
        stop = new Date(datetime[i+1]).toISOString();

        var availability = start + "/" + stop;
        var next_point = next_point_each_line[i];

        var czml_ref_obj = {
          "polyline" :{
            "width" : 5
          }
        };

        czml_ref_obj.id = "polyline_"+id+"_"+i;
        czml_ref_obj.availability = availability;
        czml_ref_obj.polyline.perPositionHeight = true;
        czml_ref_obj.polyline.meterial = {
          "solidColor": {
            "color": {
              "rgba" : [255, 0, 0, 255]
            }
          }
        };

        var ref_arr =[];

        czml_ref_obj.polyline.positions = {
          "references" : ref_arr
        }
        czml.push(czml_ref_obj);

        var height_1 = normalizeTime(new Date(datetime[i]),min_max_date);//this.height_collection[id][i] * with_height;
        var height_2 = normalizeTime(new Date(datetime[i+1]),min_max_date);//this.height_collection[id][i+1] * with_height ;
        if (!with_height){
          height_1 = 0;
          height_2 = 0;
        }

        for (var j = 0 ; j < next_point.length ; j++){
          ref_arr.push("v"+id+"_"+i+"_"+j+"#position");

          var czml_position_obj = {};
          czml_position_obj.id = "v"+id+"_"+i+"_"+j;
          czml_position_obj.position = {
            "interpolationAlgorithm": interpolations,
            "interpolationDegree": 1,
            "interval" : availability,
            "epoch" : start
          };


          //console.log(j, next_point[j]);
          var carto = [
            0, next_point[j][0][0] , next_point[j][0][1], height_1,
            (new Date(datetime[i+1]).getTime() - new Date(datetime[i]).getTime()) /1000, next_point[j][1][0], next_point[j][1][1], height_2
          ];

          czml_position_obj.position.cartographicDegrees = carto;

          czml.push(czml_position_obj);
        }

      }
    }
    else{


      for (var i = 0 ; i < geometry.datetimes.length - 1 ; i++){
        var start_date = new Date(geometry.datetimes[i]);
        var start_iso = start_date.toISOString();

        var finish_iso;
        if (geometry.interpolations == "Stepwise"){
          finish_iso = new Date(geometry.datetimes[i+1]).toISOString();
        }
        else{
          var finish_date = start_date;
          finish_date.setHours(start_date.getHours() + multiplier/10000) ;
          finish_iso = finish_date.toISOString();
        }

        var v = {};
        v.id ="polyline_"+id+"_"+i;
        v.availability = start_iso+"/"+finish_iso;

        var carto = [];
        var normalize = normalizeTime(new Date(geometry.datetimes[i]), min_max_date);//this.height_collection[id][i];

        var polyline = geometry.coordinates[i];
        for (var j = 0 ; j < polyline.length-1 ; j++){
          carto.push(polyline[j][0]);
          carto.push(polyline[j][1]);
          carto.push(normalize * with_height);
        }

        v.polyline = {
          "width" : 5,
          "positions" : {
            "cartographicDegrees" : carto
          },
          "meterial" :{
            "solidColor" :{
              "color" : {
                "rgba" : [255, 0, 255, 255]
              }
            }
          }
        };
        czml.push(v);
      }

    }
  }

  czml[0].clock = {
    "interval" : glo_start.toISOString() + "/" + glo_stop.toISOString(),
    "currentTime" : glo_start.toISOString(),
    "multiplier" : multiplier
  }
}

var movePointArray = function(mf_arr, with_height = 1 ){
  var multiplier = 10000;
  var czml = [{
    "id" : "document",
    "name" : "point_highlight",
    "version" : "1.0"
  }];

  var glo_start, glo_stop;
  glo_start = new Date(mf_arr[0].temporalGeometry.datetimes[0]);
  glo_stop = glo_start;

  var min_max_date = [];

  for (var id = 0 ; id < mf_arr.length ; id++){

    var geometry = mf_arr[id].temporalGeometry;
    var poly_min_max_date = findMinMaxTime(geometry.datetimes);
    if (poly_min_max_date[0] < new Date(glo_start).getTime()){
      glo_start = new Date(poly_min_max_date[0]);
    }
    if (poly_min_max_date[1] > new Date(glo_stop).getTime()){
      glo_stop = new Date(poly_min_max_date[1]);
    }

  }

  min_max_date = [glo_start, glo_stop];

  czml[0].clock = {
    "interval" : glo_start.toISOString() +"/" + glo_stop.toISOString(),
    "currentTime" : glo_start.toISOString(),
    "multiplier" : multiplier
  }

  for (var p_id = 0 ; p_id < mf_arr.length ; p_id++){

    var geometry = mf_arr[p_id].temporalGeometry;

    var length = geometry.datetimes.length;
    var start, stop;
    start = new Date(geometry.datetimes[0]).toISOString();
    stop = new Date(geometry.datetimes[length - 1]).toISOString();

    var availability = start + "/" + stop;

    if (geometry.interpolations == "Spline" || geometry.interpolations == "Linear"){
      var interpolations;
      if (geometry.interpolations == "Spline"){
        interpolations = "HERMITE";
      }
      else{
        interpolations = "LINEAR";
      }
      var v = {};
      v.id = 'movingPoint_'+p_id;
      v.point = {
        "color" : {
          "rgba" : [0, 0, 0, 255]
        },
        "outlineColor" : {
          "rgba" : [255, 255, 255, 255]
        },
        "outlineWidth" : 4,
        "pixelSize" : 20
      };

      var carto = [];
      var point = geometry.coordinates;
      for (var i = 0 ; i < geometry.coordinates.length ; i++){
        carto.push(new Date(geometry.datetimes[i]).toISOString());
        carto.push(point[i][0]);
        carto.push(point[i][1]);
        var normalize = normalizeTime(new Date(geometry.datetimes[i]), min_max_date);
        if (with_height){
          carto.push(normalize);
        }
        else{
          carto.push(1000);
        }

      }
      v.availability = availability;
      v.position = {
        "interpolationAlgorithm": interpolations,
        "interpolationDegree": 2,
        "interval" : availability,
        "epoch" : start,
        "cartographicDegrees" : carto
      };
      czml.push(v);
    }
    else {
      var v = {};
      v.id = 'movingPoint';
      v.point = {
        "color" : {
          "rgba" : [0, 0, 0, 255]
        },
        "outlineColor" : {
          "rgba" : [255, 255, 255, 255]
        },
        "outlineWidth" : 4,
        "pixelSize" : 20
      };

      var carto = [];
      var point = geometry.coordinates;
      for (var i = 0 ; i < geometry.coordinates.length - 1 ; i++){
        var obj ={};
        if (geometry.interpolations == "Stepwise"){
          var start_interval = new Date(geometry.datetimes[i]).toISOString();
          var finish_interval = new Date(geometry.datetimes[i+1]).toISOString();
          obj.interval = start_interval+"/"+finish_interval;
        }
        else{
          var start_interval = new Date(geometry.datetimes[i]).toISOString();
          var start_date = new Date(geometry.datetimes[i]);
          var finish_date = start_date.setHours(start_date.getHours() + multiplier/10000);
          var finish_interval = new Date(finish_date).toISOString();
          obj.interval = start_interval+"/"+finish_interval;
        }
        obj.cartographicDegrees = [];
        obj.cartographicDegrees.push(point[i][1]);
        obj.cartographicDegrees.push(point[i][0]);

        var normalize = normalizeTime(new Date(geometry.datetimes[i]), min_max_date);
        if (with_height){
          obj.cartographicDegrees.push(normalize);
        }
        else{
          obj.cartographicDegrees.push(1000);
        }
        carto.push(obj);
      }
      v.availability = availability;
      v.position = carto;
      czml.push(v);
    }
  }


  return czml;
}

var movePolygonArray = function(mf_arr, with_height = 1 ){

  if (Array.isArray(mf_arr) == false){
    var mf = mf_arr;
    mf_arr = [];
    mf_arr.push(mf);
  }

  var czml = [{
    "id" : "document",
    "name" : "polygon_highlight",
    "version" : "1.0"
  }];
  var multiplier = 10000;

  var global_availabilty, global_start, global_stop;


  global_start = new Date(mf_arr[0].temporalGeometry.datetimes[0]);
  global_stop = global_start;
  var min_max_date = [];

  for (var id = 0 ; id < mf_arr.length ; id++){

    var geometry = mf_arr[id].temporalGeometry;
    var poly_min_max_date = findMinMaxTime(geometry.datetimes);
    if (poly_min_max_date[0] < new Date(global_start).getTime()){
      global_start = new Date(poly_min_max_date[0]);
    }
    if (poly_min_max_date[1] > new Date(global_stop).getTime()){
      global_stop = new Date(poly_min_max_date[1]);
    }

  }

  min_max_date = [global_start, global_stop];

  for (var id = 0 ; id < mf_arr.length ; id++){

    var ref_obj = {
      "id" : "dynamicPolygon_"+id,
      "polygon": {
        "positions": {
          "references": [
            "v_"+id+"_1#position",
            "v_"+id+"_2#position",
            "v_"+id+"_3#position",
            "v_"+id+"_4#position",
            "v_"+id+"_5#position",
            "v_"+id+"_6#position",
            "v_"+id+"_7#position",
            "v_"+id+"_8#position",

          ]
        },
        "perPositionHeight" : true,
        "material": {
          "solidColor": {
            "color": {
              "rgbaf" : [1, 0, 0, 1]
            }
          }
        }
      }
    };

    var geometry = mf_arr[id].temporalGeometry;
    var length = geometry.datetimes.length;

    var start, stop;
    start = new Date(geometry.datetimes[0]).toISOString();
    stop = new Date(geometry.datetimes[length-1]).toISOString();
    var availability = start + "/" + stop;
    ref_obj.availability = availability;

    if (geometry.interpolations == "Spline" || geometry.interpolations == "Linear")
    {
      czml.push(ref_obj);
      var interpolations;
      if (geometry.interpolations == "Spline"){
        interpolations = "HERMITE";
      }
      else{
        interpolations = "LINEAR";
      }

      if (geometry.coordinates.length == 0) continue;

      for (var i = 0 ; i < geometry.coordinates[0].length-1 ; i++){
        var v = {};
        v.id = 'v_'+id+"_"+(i+1);
        v.position = {
          "interpolationAlgorithm": interpolations,
          "interpolationDegree": 2,
          "interval" : availability,
          "epoch" : start,
          "cartographicDegrees" : []
        };
        czml.push(v);

        var start_second = new Date(geometry.datetimes[0]).getTime();
        var carto = [];
        for (var j = 0 ; j < geometry.datetimes.length ; j ++){
          var seconds = new Date(geometry.datetimes[j]).getTime() - start_second;
          var normalize = normalizeTime(new Date(geometry.datetimes[j]), min_max_date);
          var polygon = geometry.coordinates[j];

          carto.push(seconds / 1000);
          carto.push(polygon[i][0]);
          carto.push(polygon[i][1]);
          if (with_height == false)
          {
            carto.push(10000);
          }
          else{
            carto.push(normalize);
          }


        }

        v.position.cartographicDegrees = carto;
      }




    }
    else{
      for (var i = 0 ; i < geometry.datetimes.length - 1  ; i++){
        var start_date = new Date(geometry.datetimes[i]);
        var start_iso = start_date.toISOString();

        var finish_iso;
        if (geometry.interpolations == "Stepwise"){
          finish_iso = new Date(geometry.datetimes[i+1]).toISOString();
        }
        else{
          var finish_date = start_date;
          finish_date.setHours(start_date.getHours() + multiplier/10000) ;
          finish_iso = finish_date.toISOString();
        }

        var v = {};
        v.id ="polygon_"+id+"_"+i;
        v.availability = start_iso+"/"+finish_iso;
        var carto = [];
        var normalize = normalizeTime(new Date(geometry.datetimes[i]), min_max_date);
        var polygon = geometry.coordinates[i];
        for (var j = 0 ; j < polygon.length-1 ; j++){
          carto.push(polygon[j][0]);
          carto.push(polygon[j][1]);
          if (with_height == 1)
            carto.push(normalize);
          else {
            carto.push(0);
          }
        }

        v.polygon = {
          "positions" : {
            "cartographicDegrees" : carto
          },
          "meterial" :{
            "solidColor" :{
              "color" : {
                "rgbaf" : [1, 0, 1, 1]
              }
            }
          },
          "perPositionHeight" : true
        };
        czml.push(v);
      }

    }


  }
  czml[0].clock = {
    "interval" : global_start.toISOString()+"/"+global_stop.toISOString(),
    "currentTime" : global_start.toISOString(),
    "multiplier" : multiplier
  }
  return czml;
}

var showProperty = function(object_arr, div_id){
  document.getElementById(div_id).innerHTML = '';

  //if put empty array.
  if (object_arr == undefined || object_arr.length == 0){
    return;
  }

  var min_max_date = findMinMaxTimeAndValue(object_arr);
  var svg = d3.select("#"+div_id).append("svg");
  svg.attr("width",$(window).width());
  svg.attr("height",$(window).height() / 5);
  var margin = {top: 10, right: 20, bottom: 10, left: 50},
  width = $(window).width() - margin.left - margin.right,
  height = $(window).height() /5 - margin.top - margin.bottom;

  var g = svg.append("g")
        .attr("transform", "translate("+ margin.left +"," + 0 + " )");

  var x = d3.scaleTime()
  .rangeRound([0, width]);
  LOG(height);
  var y = d3.scaleLinear()
  .rangeRound([height, 0]);

  var line = d3.line()
  .x(function(d) { return x(d.date)})
  .y(function(d) { return y(d.value)});


  x.domain(min_max_date.date);
  y.domain(min_max_date.value);

  console.log(min_max_date);

  g.append("g")
  .attr("transform" , "translate(0,"+height+")")
  .call(d3.axisBottom(x))
  .select(".domain")
  .remove();

  g.append("g")
  .call(d3.axisLeft(y))
  .append("text")
  .attr("fill", "#000")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text(object_arr[0].name+"("+object_arr[0].uom+")");

  var graph_data = [];
  for (var id = 0 ; id < object_arr.length ; id++){
    var data = [];
    var object = object_arr[id];
    for (var i = 0 ; i < object.datetimes.length ; i++){
      var comp = {};
      var da = new Date(object.datetimes[i]).toISOString();

      comp.date = new Date(object.datetimes[i]);//dateparse(da);
      comp.value = object.values[i];
      console.log(comp);
      data.push(comp);
    }

    if (object.interpolations == 'Spline'){
      line.curve(d3.curveCardinal);
    }
    else if (object.interpolations == 'Stepwise'){
      line.curve(d3.curveStepAfter)
    }

    var r_color = d3.rgb(Math.random() *255,Math.random() *255,0);

    graph_data.push(data);
    if(object.interpolations == 'Discrete'){
      for (var i = 0 ; i < data.length ; i++){
        g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d,i) { return x(d.date); } )
        .attr("cy", function(d,i) { return y(d.value); } )
        .attr("r", 5);
      }
    }
    else{
      g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", r_color)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);
    }

  }
  svg.on("click", function () {
    var coords = d3.mouse(this);
    var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");

    var isodate = formatDate(x.invert(coords[0]));
    viewer.clock.currentTime=Cesium.JulianDate.fromDate(new Date(isodate));
    viewer.clock.shouldAnimate = false;
  });

}



function findMinMaxTimeAndValue(pro_arr){

  var first_date = new Date(pro_arr[0].datetimes[0]);
  var first_value = pro_arr[0].values[0];
  var min_max = {};
  min_max.date = [first_date,first_date];
  min_max.value = [first_value,first_value];
  for (var i = 0 ; i < pro_arr.length ; i++){
    var temp_max_min = findMinMaxTime(pro_arr[i].datetimes);
    if (temp_max_min[0].getTime() < min_max.date[0].getTime()){
      min_max.date[0] = temp_max_min[0];
    }
    if (temp_max_min[1].getTime() > min_max.date[1].getTime()){
      min_max.date[1] = temp_max_min[1];
    }
    for (var j = 0 ; j < pro_arr[i].values.length ; j++){
      if (min_max.value[0] > pro_arr[i].values[j]){
        min_max.value[0] = pro_arr[i].values[j];
      }
      if (min_max.value[1] < pro_arr[i].values[j]){
        min_max.value[1] = pro_arr[i].values[j];
      }
    }

  }
  return min_max;
}
function contains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


var normalizeTime = function(date, min_max_date, value = 15000000){
  var separation = min_max_date[1].getTime() - min_max_date[0].getTime()
  return (date.getTime() - min_max_date[0].getTime())/separation * value;
}


var findMinMaxTime = function(datetimes){
  var min_max_date = [];
  min_max_date[0] = new Date(datetimes[0]);
  min_max_date[1] = new Date(datetimes[0]);

for (var j = 1 ; j < datetimes.length ; j++){

  var time = new Date(datetimes[j]);

  if (min_max_date[0].getTime() > time.getTime()){
      min_max_date[0] = time;
    }
    if (min_max_date[1].getTime() < time.getTime()){
      min_max_date[1] = time;
    }
  }
  return min_max_date;
}

function findAllMinMaxTimeAndZ(mf_arr, is_point = false){

  var first_date = new Date(mf_arr[0].temporalGeometry.datetimes[0]);
  var first_value = mf_arr[0].temporalGeometry.coordinates[0][2];
  var min_max = {};
  min_max.date = [first_date,first_date];
  min_max.value = [ first_value, first_value];
  for (var i = 0 ; i < mf_arr.length ; i++){
    var temp_max_min = findMinMaxTime(mf_arr[i].temporalGeometry.datetimes);
    if (temp_max_min[0].getTime() < min_max.date[0].getTime()){
      min_max.date[0] = temp_max_min[0];
    }
    if (temp_max_min[1].getTime() > min_max.date[1].getTime()){
      min_max.date[1] = temp_max_min[1];
    }
    for (var j = 0 ; j < mf_arr[i].temporalGeometry.coordinates.length ; j++){
      var coord = mf_arr[i].temporalGeometry.coordinates;
      if (is_point){
        if (min_max.value[0] > coord[j][2]){
          min_max.value[0] = coord[j][2];
        }
        if (min_max.value[1] < coord[j][2]){
          min_max.value[1] = coord[j][2];
        }
      }
      else{
        for (var k = 0 ; k < coord[j].length ; k++){
          if (min_max.value[0] > coord[j][k][2]){
            min_max.value[0] = coord[j][k][2];
          }
          if (min_max.value[1] < coord[j][k][2]){
            min_max.value[1] = coord[j][k][2];
          }
        }
      }

    }

  }
  return min_max;
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

function findMinMaxCoordAndTimeInMFArray(mf_arr){
  var min_max = {};
  var first_date = new Date(mf_arr[0].temporalGeometry.datetimes[0]);
  min_max.date = [first_date,first_date];
  for (var i = 0 ; i < mf_arr.length ; i++){
    var mf_min_max_coord;
    if (mf_arr[i].temporalGeometry.type == "MovingPoint"){
      mf_min_max_coord = findMinMaxCoord(mf_arr[i].temporalGeometry.coordinates);
    }
    else{
      var coord_arr = mf_arr[i].temporalGeometry.coordinates;
      mf_min_max_coord.min_x = coord_arr[j][0][0];
      mf_min_max_coord.max_x = coord_arr[j][0][0];
      mf_min_max_coord.min_y = coord_arr[j][0][1];
      mf_min_max_coord.max_y = coord_arr[j][0][1];
      for (var j = 1 ; j < coord_arr.length ; j++){
        mf_min_max_coord = findBiggerCoord(mf_min_max_coord, findMinMaxCoord(coord_arr[j]) );
      }
    }

    if (min_max.coord == undefined){
      min_max.coord = mf_min_max_coord;
    }
    else{
      min_max.coord = findBiggerCoord(min_max.coord, mf_min_max_coord);
    }

    var temp_max_min = findMinMaxTime(mf_arr[i].temporalGeometry.datetimes);
    if (temp_max_min[0].getTime() < min_max.date[0].getTime()){
      min_max.date[0] = temp_max_min[0];
    }
    if (temp_max_min[1].getTime() > min_max.date[1].getTime()){
      min_max.date[1] = temp_max_min[1];
    }

  }

  return min_max;
}

function findBiggerCoord(min_max_1, min_max_2){
  var ret = {};
  ret.min_x = Math.min(min_max_1.min_x,min_max_2.min_x);
  ret.min_y = Math.min(min_max_1.min_y,min_max_2.min_y);
  ret.max_x = Math.max(min_max_1.max_x,min_max_2.max_x);
  ret.max_y = Math.max(min_max_1.max_y,min_max_2.max_y);
  return ret;
}

function findMinMaxCoord(coordinates){
  var min_max = {};
  min_max.min_x = coordinates[0][0];
  min_max.max_x = coordinates[0][0];
  min_max.min_y = coordinates[0][1];
  min_max.max_y = coordinates[0][1];

  for (var i = 0 ; i < coordinates.length ; i++){
    var coord = coordinates[i];
    if (min_max.min_x > coord[0]){
      min_max.min_x = coord[0];
    }
    if (min_max.max_x < coord[0]){
      min_max.max_x = coord[0];
    }
    if (min_max.min_y > coord[1]){
      min_max.min_y = coord[1];
    }
    if (min_max.max_y < coord[1]){
      min_max.max_y < coord[1];
    }
  }

  return min_max;

}

var getListOfHeight = function(datetimes, min_max_date, max_height = undefined){

  for(var i = 0 ; i < datetimes.length ; i++){
    datetimes[i] = new Date(datetimes[i]);
  }

  if (min_max_date == undefined){
    console.log("undefined");
    min_max_date = findMinMaxTime(datetimes);
  }

  var heights = [];
  for(var i = 0 ; i < datetimes.length ; i++){
    heights.push(normalizeTime(datetimes[i],min_max_date,max_height));
  }
  return heights;
}
