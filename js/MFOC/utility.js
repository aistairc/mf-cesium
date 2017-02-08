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
