
$.ajaxSetup({
  async: false
});

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
            label_list += ")'></input>";
            label_list += "<input type = 'checkbox' onclick = 'getInformation(";
            label_list += k;
            label_list += ",";
            label_list += "\"";
            label_list += filename;
            label_list += "\"";
            label_list += ")'>";
            label_list += "</input>";
            label_list += "<div id = '";
            label_list += k.toString();
            label_list += filename.toString();
            label_list += "'></div>";

        }

        document.getElementById(label_id.toString()).innerHTML = label_list;
    });

}
function getInformation(radioItem, filename){

  $.getJSON(filename, function(data){
    var get_data = data.features[radioItem];
    var properties_name = [];
    for(var i = 0 ; i < get_data.temporalProperties.length ; i++){
      properties_name.push(get_data.temporalProperties[i].name);
    }
    var label_id = radioItem.toString() + filename.toString();
    var label_list = "";

    for(var i = 0 ; i < properties_name.length ; i++){
      var new_label_id =radioItem.toString() + "_" + i.toString() + "_" + filename.toString();
      label_list += "<div id = '"
      label_list += new_label_id;
      label_list += "' onclick = 'printInfo(\"";
      label_list += radioItem.toString();
      label_list += "_";
      label_list += i.toString();
      label_list += "_";
      label_list += filename.toString();
      label_list += "\"";
      label_list += " )'>";
      label_list += properties_name[i];
      label_list += "</div>";
    }
    console.log(label_list);
    document.getElementById(label_id.toString()).innerHTML = label_list;

  });
}
function printInfo(callValue){
  var info_index = callValue;
  var new_label_id = callValue;
  var typhoon_index;
  var filename;
  var interpolations;

  info_index = info_index.split("_");
  filename = info_index[2] + "_" + info_index[3];
  typhoon_index = info_index[0];
  info_index = info_index[1];
  $.getJSON(filename, function(data){

    var get_data = data.features[typhoon_index].temporalProperties[info_index];
    var print_target = document.getElementById("footer");
      Plotly.purge(print_target);
      if(get_data.interpolations == "Linear"){
        interpolations = "linear";
      }
      else if(get_data.interpolations == "Spline"){
        interpolations = "spline";
      }
    Plotly.plot( print_target, [{
	x: get_data.datetimes,
	y: get_data.values }], {
	margin: { t: 0 } },{line : {shape : interpolations}}   );
  });

}
function findFastestTime(filename){
  var start_time;
  $.getJSON(filename, function(data) {
     start_time = getTime2(data.features[0].temporalGeometry.datetimes[0]);
    for (var i = 0; i < data.features.length; i++) {
      for(var j = 0 ; j < data.features[i].temporalGeometry.datetimes.length ;j++){
        var compare_time = getTime2(data.features[i].temporalGeometry.datetimes[j]);
        if(start_time > compare_time ){
          start_time = compare_time;
        }
      }
    }
    start_time_global = start_time;
    start_time_global = Cesium.JulianDate.fromDate(start_time_global);
  });


}
function findLatestTime(filename){
  var start_time;
  $.getJSON(filename, function(data) {
     start_time = getTime2(data.features[0].temporalGeometry.datetimes[0]);
    for (var i = 0; i < data.features.length; i++) {
      for(var j = 0 ; j < data.features[i].temporalGeometry.datetimes.length ;j++){
        var compare_time = getTime2(data.features[i].temporalGeometry.datetimes[j]);
        if(start_time < compare_time){
          start_time = compare_time;
        }
      }
    }
    end_time_global = Cesium.JulianDate.fromDate(start_time);
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

function changeISO2Date(time){

time = time.replace(/\D/g," ");
var dtcomps = time.split(" ");

// modify month between 1 based ISO 8601 and zero based Date
dtcomps[1]--;

var convdt = new Date(Date.UTC(dtcomps[0],dtcomps[1],dtcomps[2],dtcomps[3],dtcomps[4],dtcomps[5]));
return convdt;

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
