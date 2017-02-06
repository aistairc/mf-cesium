
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
