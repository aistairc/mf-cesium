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

var calculateDist = function(point_1, point_2){
  return Math.sqrt(Math.pow(point_1[0] - point_2[0],2) + Math.pow(point_1[1] - point_2[1],2));
}

function findMinMaxCoordAndTimeInMFArray(mf_arr){
  var min_max = {};
  var first_date = new Date(mf_arr[0].temporalGeometry.datetimes[0]);

  min_max.date = [first_date,first_date];
  for (var i = 0 ; i < mf_arr.length ; i++){
    var mf_min_max_coord = {};
    if (mf_arr[i].temporalGeometry.type == "MovingPoint"){
      mf_min_max_coord = findMinMaxCoord(mf_arr[i].temporalGeometry.coordinates);
    }
    else{
      var coord_arr = mf_arr[i].temporalGeometry.coordinates;
      mf_min_max_coord.min_x = coord_arr[0][0][0];
      mf_min_max_coord.max_x = coord_arr[0][0][0];
      mf_min_max_coord.min_y = coord_arr[0][0][1];
      mf_min_max_coord.max_y = coord_arr[0][0][1];
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
      min_max.max_y = coord[1];
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



function getMBRFromPolygon(coordinates){

  var mbr = findMinMaxCoord(coordinates);
  return mbr;
}
