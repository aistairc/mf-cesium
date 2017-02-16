MFOC.prototype.findMinMaxGeometry = function(mf_arr){
  if (mf_arr == undefined){
    mf_arr = this.features;
  }

  var min_max = {};
  min_max.x = [];
  min_max.y = [];
  min_max.z = [];

  min_max.date = [];

  var first_date = new Date(mf_arr[0].temporalGeometry.datetimes[0]);

  min_max.date = [first_date,first_date];
  for (var i = 0 ; i < mf_arr.length ; i++){
    var mf_min_max_coord = {};
    if (mf_arr[i].temporalGeometry.type == "MovingPoint"){
      mf_min_max_coord = MFOC.findMinMaxCoord(mf_arr[i].temporalGeometry.coordinates);
    }
    else{
      var coord_arr = mf_arr[i].temporalGeometry.coordinates;
      mf_min_max_coord = MFOC.findMinMaxCoord(coord_arr[0]);
      for (var j = 1 ; j < coord_arr.length ; j++){
        mf_min_max_coord = MFOC.findBiggerCoord(mf_min_max_coord, MFOC.findMinMaxCoord(coord_arr[j]) );
      }
    }

    if (min_max.x.length == 0){
      min_max.x = mf_min_max_coord.x;
      min_max.y = mf_min_max_coord.y;
      min_max.z = mf_min_max_coord.z;
    }
    else{
      var xyz = MFOC.findBiggerCoord(min_max, mf_min_max_coord);
      min_max.x = xyz.x;
      min_max.y = xyz.y;
      min_max.z = xyz.z;
    }

    var temp_max_min = MFOC.findMinMaxTime(mf_arr[i].temporalGeometry.datetimes);
    if (temp_max_min[0].getTime() < min_max.date[0].getTime()){
      min_max.date[0] = temp_max_min[0];
    }
    if (temp_max_min[1].getTime() > min_max.date[1].getTime()){
      min_max.date[1] = temp_max_min[1];
    }

  }

  return min_max;

}

MFOC.prototype.getListOfHeight = function(datetimes, min_max_date){
  if (min_max_date == undefined){
    //console.log("use this object's min_max");
    min_max_date = this.min_max.date;
  }

  var heights = [];
  for(var i = 0 ; i < datetimes.length ; i++){
    heights.push(MFOC.normalizeTime(new Date(datetimes[i]), min_max_date, this.max_height));
  }
  return heights;
}



MFOC.findMinMaxTime = function(datetimes){
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

MFOC.findMinMaxCoord = function(coordinates){
  var min_max = {};
  min_max.x = [];
  min_max.y = [];
  min_max.z = [];
  min_max.x[0] = coordinates[0][0];
  min_max.x[1] = coordinates[0][0];
  min_max.y[0] = coordinates[0][1];
  min_max.y[1] = coordinates[0][1];
  min_max.z = [];
  if (coordinates[0][2] != undefined){
    min_max.z[0] = coordinates[0][2];
    min_max.z[1] = coordinates[0][2];
  }
  for (var i = 0 ; i < coordinates.length ; i++){
    var coord = coordinates[i];
    if (min_max.x[0] > coord[0]){
      min_max.x[0] = coord[0];
    }
    if (min_max.x[1] < coord[0]){
      min_max.x[1] = coord[0];
    }
    if (min_max.y[0] > coord[1]){
      min_max.y[0] = coord[1];
    }
    if (min_max.y[1] < coord[1]){
      min_max.y[1] = coord[1];
    }
    if (coord[2] != undefined){
      if (min_max.z[0] > coord[2]){
        min_max.z[0] = coord[2];
      }
      if (min_max.z[1] < coord[2]){
        min_max.z[1] = coord[2];
      }
    }
  }

  return min_max;

}



MFOC.findBiggerCoord = function(min_max_1, min_max_2){
  var ret = {};
  ret.x = [];
  ret.y = [];
  ret.z = [];
  ret.x[0] = Math.min(min_max_1.x[0],min_max_2.x[0]);
  ret.y[0] = Math.min(min_max_1.y[0],min_max_2.y[0]);
  ret.x[1] = Math.max(min_max_1.x[1],min_max_2.x[1]);
  ret.y[1] = Math.max(min_max_1.y[1],min_max_2.y[1]);

  if (min_max_1.z.length != 0 && min_max_2.z.length != 0){
    ret.z[0] = Math.min(min_max_1.z[0],min_max_2.z[0]);
    ret.z[1] = Math.max(min_max_1.z[1],min_max_2.z[1]);
  }
  return ret;
}


MFOC.normalizeTime = function(date, min_max_date, value = 15000000){
  var separation = min_max_date[1].getTime() - min_max_date[0].getTime()
  return (date.getTime() - min_max_date[0].getTime())/separation * value;
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



MFOC.findMinMaxProperties = function(properties){
  console.log(properties);
  if (!Array.isArray(properties)){
    properties = [properties];
  }

  var first_date = new Date(properties[0].datetimes[0]);
  var first_value = properties[0].values[0];
  var min_max = {};
  min_max.date = [first_date,first_date];
  min_max.value = [first_value,first_value];
  for (var i = 0 ; i < properties.length ; i++){
    var temp_max_min = MFOC.findMinMaxTime(properties[i].datetimes);
    if (temp_max_min[0].getTime() < min_max.date[0].getTime()){
      min_max.date[0] = temp_max_min[0];
    }
    if (temp_max_min[1].getTime() > min_max.date[1].getTime()){
      min_max.date[1] = temp_max_min[1];
    }
    for (var j = 0 ; j < properties[i].values.length ; j++){
      if (min_max.value[0] > properties[i].values[j]){
        min_max.value[0] = properties[i].values[j];
      }
      if (min_max.value[1] < properties[i].values[j]){
        min_max.value[1] = properties[i].values[j];
      }
    }

  }
  return min_max;
}




MFOC.getMBRFromPolygon = function(coordinates){

  var mbr = MFOC.findMinMaxCoord(coordinates);
  return mbr;
}

MFOC.getPropertyByName = function(mf, name){
  if (mf.temporalProperties == undefined) return -1;

  for (var i = 0 ; i < mf.temporalProperties.length ; i++){
    if (mf.temporalProperties[i].name == name){
      return mf.temporalProperties[i];
    }
  }
  return -1;
}

MFOC.calculateDist = function(point_1, point_2){
  return Math.sqrt(Math.pow(point_1[0] - point_2[0],2) + Math.pow(point_1[1] - point_2[1],2));
}

MFOC.calculateCarteDist = function(point1, point2){
  if (point1.length == 2 && point1.length == point2.length)
  {
    var carte3_1 = Cesium.Cartesian3.fromDegrees(point1[0], point1[1]),
    carte3_2 =  Cesium.Cartesian3.fromDegrees(point2[0], point2[1]);
  }
  else if (point1.length == 3 && point1.length == point2.length){
    var carte3_1 = Cesium.Cartesian3.fromDegrees(point1[0], point1[1], point1[2]),
    carte3_2 =  Cesium.Cartesian3.fromDegrees(point2[0], point2[1], point2[2]);
  }
  else{
    alert("dist error");
    return;
  }

  return Cesium.Cartesian2.distance(Cesium.Cartesian2.fromCartesian3(carte3_1),Cesium.Cartesian2.fromCartesian3(carte3_2));
}


MFOC.getBoundingSphere = function(min_max, height){
  console.log(min_max,height);
  var middle_x = ( min_max.x[0] + min_max.x[1] ) / 2;
  var middle_y = ( min_max.y[0] + min_max.y[1] ) / 2;
  var middle_height = (height[0] + height[1]) / 2;

  var radius = MFOC.calculateCarteDist([middle_x,middle_y,middle_height], [min_max.x[0],min_max.y[0],height[0]]);
  return new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(middle_x,middle_y,middle_height), radius);
}





//----------------------it wiil be removed--------------

/*



function contains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
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
*/
