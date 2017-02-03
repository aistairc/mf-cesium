

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
