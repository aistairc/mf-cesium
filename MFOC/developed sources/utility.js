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


function getTime(timeValue) {
    var time = timeValue; //the basetime we will use for nomalization of datetimes
    var time_split = time.split('T'); //get date
    time_split[1] = time_split[1].replace('Z', ""); //get time
    var date_arr = time_split[0].split('-');
    var time_arr = time_split[1].split(':');
    var timestamp = new Date(date_arr[0], date_arr[1] - 1, date_arr[2], time_arr[0], time_arr[1], time_arr[2]);
    return timestamp;
}

function getTime2(timevalue) {
    var time = timevalue; //the basetime we will use for nomalization of datetimes
    var time_split = time.split(' '); //get date
    var date_arr = time_split[0].split('-');
    var time_arr = time_split[1].split(':');
    var timestamp = new Date(date_arr[0], date_arr[1] - 1, date_arr[2], time_arr[0], time_arr[1], time_arr[2]);
    return timestamp;
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

var getListOfHeight = function(datetimes, min_max_date){

  for(var i = 0 ; i < datetimes.length ; i++){
    datetimes[i] = new Date(datetimes[i]);
  }

  if (min_max_date == undefined){
    console.log("undefined");
    min_max_date = findMinMaxTime(datetimes);
  }

  var heights = [];
  for(var i = 0 ; i < datetimes.length ; i++){
    heights.push(normalizeTime(datetimes[i],min_max_date));
  }
  return heights;
}
