
function printNames(filename, label_id) {
    var label_list = "";
    window.name_list = [];
    $.getJSON(filename, function(data) {
        for (var i = 0; i < data.features.length; i++) {
            window.name_list.push(data.features[i].properties.name);
        }
        for (var k = 0; k < window.name_list.length; k++) {
            label_list += "<label style = 'color:white' onclick = 'changeColor_poly(";
            label_list += k;
            label_list += ",";
            label_list += "\"";
            label_list += filename;
            label_list += "\"";
            label_list += ")'>";
            label_list += name_list[k];
            label_list += "</label>";
            label_list += "<input type = 'checkbox' onclick = 'getMovingPolygon(";
            label_list += k;
            label_list += ",";
            label_list += "\"";
            label_list += filename;
            label_list += "\"";
            label_list += ")'></input></br>";
        }

        document.getElementById(label_id.toString()).innerHTML = label_list;
    });

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

function getTime(timeValue) {
    var time = timeValue; //the basetime we will use for nomalization of datetimes
    var time_split = time.split('T'); //get date
    time_split[1] = time_split[1].replace('Z', ""); //get time
    var date_arr = time_split[0].split('-');
    var time_arr = time_split[1].split(':');
    var timestamp = new Date(date_arr[0], date_arr[1] - 1, date_arr[2], time_arr[0], time_arr[1], time_arr[2]);
    return timestamp;
}

function getTime2(timevalue){
  var time = timevalue; //the basetime we will use for nomalization of datetimes
  var time_split = time.split(' '); //get date
  var date_arr = time_split[0].split('-');
  var time_arr = time_split[1].split(':');
  var timestamp = new Date(date_arr[0], date_arr[1] - 1, date_arr[2], time_arr[0], time_arr[1], time_arr[2]);
  return timestamp;
}

function setClock(start, stop, multi){
  var setStart = start;
  var setStop = stop;
  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  viewer.clock.multiplier = multi;
  viewer.timeline.zoomTo(start, stop);
}

function setDefaultClock(){
  var start = Cesium.JulianDate.fromDate(new Date());
  var end = Cesium.JulianDate.addDays(start, 1, new Cesium.JulianDate());
  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = end.clone();
  viewer.clock.currentTime = start.clone();
  viewer.clock.multiplier = 1;
  viewer.timeline.zoomTo(start, end);
}
