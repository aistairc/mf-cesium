
Stinuum.findMinMaxTime = function(datetimes){
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

Stinuum.findMinMaxCoordArray = function(coordinates_arr){
  var mf_min_max_coord = Stinuum.findMinMaxCoord(coordinates_arr[0]);
  for (var j = 1 ; j < coordinates_arr.length ; j++){
    mf_min_max_coord = Stinuum.findBiggerCoord(mf_min_max_coord, Stinuum.findMinMaxCoord(coordinates_arr[j]) );
  }
  return mf_min_max_coord;
}

Stinuum.findMinMaxCoord = function(coordinates){
  var min_max = {};
  min_max.x = [];
  min_max.y = [];
  min_max.z = [];

  var start = coordinates[0];
  min_max.x[0] = start[0];
  min_max.x[1] = start[0];
  min_max.y[0] = start[1];
  min_max.y[1] = start[1];
  min_max.z = [];
  if (coordinates[0][2] != undefined){
    min_max.z[0] = start[2];
    min_max.z[1] = start[2];
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


Stinuum.findBiggerCoord = function(min_max_1, min_max_2){
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

Stinuum.normalizeTime = function(date, min_max_date, value = 15000000){
  var separation = min_max_date[1].getTime() - min_max_date[0].getTime()
  return (date.getTime() - min_max_date[0].getTime())/separation * value;
}

Stinuum.findMinMaxProperties = function(properties){
  if (!Array.isArray(properties)){
    properties = [properties];
  }

  var first_date = new Date(properties[0].datetimes[0]);
  var first_value = properties[0].values[0];
  var min_max = {};
  min_max.date = [first_date,first_date];
  min_max.value = [first_value,first_value];
  for (var i = 0 ; i < properties.length ; i++){
    var temp_max_min = Stinuum.findMinMaxTime(properties[i].datetimes);
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

Stinuum.getMBRFromPolygon = function(coordinates){
  var mbr = Stinuum.findMinMaxCoord(coordinates);
  return mbr;
}

Stinuum.getPropertyByName = function(mf, name, id){
  if (mf.temporalProperties == undefined) return -1;

  for (var i = 0 ; i < mf.temporalProperties.length ; i++){
    var property = mf.temporalProperties[i][name];
    if (property != undefined){
      property.datetimes = mf.temporalProperties[i].datetimes;
      return [property, id];
    }
  }
  return -1;
}

Stinuum.calculateDist = function(point_1, point_2){
  return Math.sqrt(Math.pow(point_1[0] - point_2[0],2) + Math.pow(point_1[1] - point_2[1],2));
}

Stinuum.calculateCarteDist = function(point1, point2){
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

Stinuum.getBoundingSphere = function(min_max, height){
  var middle_x = ( min_max.x[0] + min_max.x[1] ) / 2;
  var middle_y = ( min_max.y[0] + min_max.y[1] ) / 2;
  var middle_height = (height[0] + height[1]) / 2;

  var radius = Stinuum.calculateCarteDist([middle_x,middle_y,middle_height], [min_max.x[0],min_max.y[0],height[0]]);
  console.log(min_max);
  return new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(middle_x,middle_y,middle_height), radius * 3);
}

Stinuum.findMaxCoordinatesLine = function(geometry){
  var max_length = 0;
  for (var i = 0 ; i < geometry.coordinates.length ; i++){
    if (max_length < geometry.coordinates[i].length){
      max_length = geometry.coordinates[i].length;
    }
  }
  return max_length;
}

Stinuum.addPolygonSample = function(geometry, index, property){
  var datetimes = geometry.datetimes;
  for (var time = 0 ; time < geometry.coordinates.length ; time++){
    var coords = geometry.coordinates[time][0];
    var juldate = Cesium.JulianDate.fromDate(new Date(datetimes[time]));
    property.addSample(juldate, Cesium.Cartesian3.fromDegrees(coords[index][0],coords[index][1]));
  }
}

Stinuum.getSampleProperties_Polygon = function(polygon){
  if (polygon.type != "MovingPolygon") throw new Stinuum.Exception("It should be MovingPolygon temporalGeometry", polygon);
  var polygon_size = polygon.coordinates[0][0].length;
  if (polygon_size < 4) new ERR("polygon_size is less than 3", polygon_size);
  var isSpline = polygon.interpolations == "Spline";
  var sample_list = [];

  for (var i = 0 ; i < polygon_size ; i++){
    var property = new Cesium.SampledProperty(Cesium.Cartesian3);
    if (isSpline){
      property.setInterpolationOptions({
      interpolationDegree : 2,
      interpolationAlgorithm : Cesium.HermitePolynomialApproximation
    });
    }
    Stinuum.addPolygonSample(polygon, i, property);
    sample_list.push(property);
  }
  return sample_list;
}

Stinuum.getSampleProperty_Point = function(geometry){
  if (geometry.type != "MovingPoint") throw new Stinuum.Exception("It should be MovingPoint", geometry);
  var isSpline = polygon.interpolations == "Spline";
  var datetimes = geometry.datetimes;
  var property = new Cesium.SampledProperty(Cesium.Cartesian3);
  if (isSpline){
    property.setInterpolationOptions({
      interpolationDegree : 2,
      interpolationAlgorithm : Cesium.HermitePolynomialApproximation
    });
  }
  for (var i = 0 ; i < geometry.coordinates.length ; i++){
    var juldate = Cesium.JulianDate.fromDate(new Date(datetimes[i]));
    property.addSample(juldate, Cesium.Cartesian3.fromDegrees(eometry.coordinates[i][0],eometry.coordinates[i][1]));
  }
  return property;
}