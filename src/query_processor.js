
//TODO : support multiple query. 
Stinuum.QueryProcessor.prototype.queryBySpatioTime = function(source_id_arr, target_id){
  if (!this.super.s_query_on){
    this.super.s_query_on = true;
    this.super.mfCollection.hideAll();
    this.result_pairs = [];
  }
  else{
    LOG("its already query mode");
    return;
  }
  
  if (!Array.isArray(source_id_arr)) source_id_arr = [source_id_arr];
  var result = [];
  for (var i = 0 ; i < source_id_arr.length ; i++){
    var source = this.super.mfCollection.getMFPairByIdinWhole(source_id_arr[i]);
    source = source.feature;

    var target = this.super.mfCollection.getMFPairByIdinWhole(target_id);
    target = target.feature;

    var new_target = this.makeQueryResultBySpatioTime(source, target);
    if (new_target != -1) result.push(new_target);
    result.push(source);  
  }
  
  for (var i = 0 ; i < result.length ; i++){
    var pair = new Stinuum.MFPair(result[i].properties.name, result[i]) ;
    if (result[i].temporalGeometry.datetimes.length == 0) continue;
    this.result_pairs.push(pair);
    this.super.mfCollection.features.push(pair);
  }
}

Stinuum.QueryProcessor.prototype.makeQueryResultBySpatioTime = function(source, p_target){
  target = Stinuum.copyObj(p_target);
  if (source.temporalGeometry == undefined || target.temporalGeometry == undefined){
    LOG(source, target);  
    throw new Error("temporalGeometry is undefined, query_processor, makeQueryResultBySpatioTime");
  }
  if (source.temporalGeometry.type == "MovingPolygon" && target.temporalGeometry.type == "MovingPoint"){ //Polygon Point 

  }
  //Polygon Polygon
  else if (source.temporalGeometry.type == "MovingPolygon" && target.temporalGeometry.type == "MovingPolygon"){
    throw new Stinuum.Exception("TODO polygon polygon", source);
  }
  //Point Polygon
  else if (source.temporalGeometry.type == "MovingPoint" && target.temporalGeometry.type == "MovingPolygon"){
    throw new Stinuum.Exception("TODO point polygon", source);
  }
  else{
    throw new Stinuum.Exception("point and point OR the others cannot be quried");
  }

  var sample_arr = Stinuum.getSampleProperties_Polygon(source.temporalGeometry);
  var t_geometry = target.temporalGeometry;
  var source_time_minmax = Stinuum.findMinMaxTime(source.temporalGeometry.datetimes);
  var target_time_minmax = Stinuum.findMinMaxTime(target.temporalGeometry.datetimes);
  if (source_time_minmax[0].getTime() > target_time_minmax[1].getTime() 
      || source_time_minmax[1].getTime() < target_time_minmax[0].getTime()){
    return -1;
  }
  var removed_indexes = [];
  for (var i = 0 ; i < t_geometry.datetimes.length ; i++){
    var coord = t_geometry.coordinates[i];
    var polygon_coords = [];
    for (var node = 0 ; node < sample_arr.length ; node++){
      var time = Cesium.JulianDate.fromDate(new Date(t_geometry.datetimes[i]));
      var sample_coord = sample_arr[node].getValue(time);
      if (sample_coord == undefined){
        break;
      }
      polygon_coords.push([Cesium.Math.DEGREES_PER_RADIAN * (Cesium.Cartographic.fromCartesian(sample_coord).longitude), 
        Cesium.Math.DEGREES_PER_RADIAN * (Cesium.Cartographic.fromCartesian(sample_coord).latitude)]);
    }
    LOG(coord, polygon_coords);
    Stinuum.QueryProcessor.moveToRelativeCoords(coord, polygon_coords);
    LOG(coord, polygon_coords);
    if (polygon_coords.length != sample_arr.length){
      removed_indexes.push(i);
    }
    else if (!Stinuum.QueryProcessor.isPointInPolygon(coord, polygon_coords)) {
      removed_indexes.push(i);
    }
    else{ //intersect..
      LOG(polygon_coords, coord);
    }

  }

  if (removed_indexes.length == t_geometry.datetimes.length) return -1;

  for (var i = removed_indexes.length - 1 ; i >= 0 ; i--){
    Stinuum.spliceElementInMovingPointByIndex(target, removed_indexes[i]);
  }
  LOG(target);

  return target;
}

Stinuum.QueryProcessor.moveToRelativeCoords = function(point, polygon){
  var isChanged = false;
  for (var i = 0 ; i < polygon.length - 1 ; i++){
    if (Math.abs(polygon[i][0] - polygon[i+1][0]) > 180){
      isChanged = true;
    }
  }
  if (isChanged){
    for (var i = 0 ; i < polygon.length ; i++){
      if (polygon[i][0] < 0){
        polygon[i][0] = 180 + (180 + polygon[i][0]);
      }
    }
    if (point[0] < 0 ) {
      var new_point = [point[0] + 360, point[1]] ;
      point = new_point;
    }
  }
}

Stinuum.QueryProcessor.isPointInPolygon = function(point, polygon){

  var virtual_line = [point, [180,0]];
  var intersect_num = 0;
  for (var i = 0 ; i < polygon.length - 1; i++){
    var line = [polygon[i], polygon[i+1]];
    var intersect = Stinuum.QueryProcessor.do_intersect_lines(virtual_line, line);
    if (intersect == 1){
      intersect_num++;
    }
    else if (intersect == 0){
      virtual_line[1][0] -= 1;
      intersect_num = 0;
      i = -1;
    }
  } 
  if (intersect % 2 == 1) return true;
  else return false;
}

Stinuum.QueryProcessor.do_intersect_lines = function(line_1, line_2){
  var a = line_1[0];
  var b = line_1[1];
  var c = line_2[0];
  var d = line_2[1];
  var fn = Stinuum.QueryProcessor.ccw;
  var abc = fn(a,b,c);
  var abd = fn(a,b,d);
  var cda = fn(c,d,a);
  var cdb = fn(c,d,b);

  var ab = abc * abd;
  var cd = cda * cdb;
  if (ab < 0 && cd < 0) return 1;
  else if (ab == 0 || cd == 0) return 0;
  else return -1;
}

Stinuum.QueryProcessor.ccw = function(a,b,c){//counter-clock wise
  var ret = (a[0] * b[1] - a[1] * b[0]) + (b[0] * c[1] - c[0] * b[1]) + (c[0] * a[1] - a[0] * c[1]);
  if (ret > 0) return 1;
  else if (ret == 0) return 0;
  else return -1;
}

Stinuum.QueryProcessor.prototype.queryByTime = function(start, end){
  this.super.mfCollection.hideAll();
  if (this.super.s_query_on){
    for (var i = 0 ; i < this.result_pairs.length ; i++){
      var sliced_feature = this.sliceFeatureByTime(this.result_pairs[i].feature,start, end);
      if (sliced_feature.temporalGeometry.datetimes.length != 0) 
        this.super.mfCollection.features.push(new Stinuum.MFPair(this.result_pairs[i].id, sliced_feature));  
    }
  }
  else{
    var hid_arr = this.super.mfCollection.wholeFeatures;
    var new_mf_arr = [];

    for (var i = 0 ; i < hid_arr.length ; i++){
      var min_max_date = Stinuum.findMinMaxTime(hid_arr[i].feature.temporalGeometry.datetimes);
      if (min_max_date[1] <= end && min_max_date[0] >= start){
        new_mf_arr.push(hid_arr[i]);
      }
      else{
        if (min_max_date[1] >= start && min_max_date[0] <= end){
          var sliced_feature = this.sliceFeatureByTime(hid_arr[i].feature, start, end);
          if (sliced_feature.temporalGeometry.datetimes.length != 0) 
            new_mf_arr.push(new Stinuum.MFPair(hid_arr[i].id, sliced_feature));
        }  
      }
    }

    this.super.mfCollection.features = new_mf_arr;
  }
  
}

Stinuum.QueryProcessor.prototype.sliceFeatureByTime = function(feature, start, end){
  var new_feature = Stinuum.copyObj(feature);
  
  var geometry = new_feature.temporalGeometry;
  var properties = new_feature.temporalProperties;

  var front_splice = 0, start_i = -1, end_i = -1;
  for (var i = 0 ; i < geometry.datetimes.length ; i++){
    var date = new Date(geometry.datetimes[i]);
    if (date > start){
      start_i = i;
      break;
    }
    else{
      front_splice += 1;
    }
  }
  for (var i = start_i ; i < geometry.datetimes.length; i++){
    var date = new Date(geometry.datetimes[i]);
    if (date >= end){
      end_i = i;
      break;
    } 
  }
  if (geometry.datetimes.length != properties[0].datetimes.length){
    throw new ERR("TODO.. property length is different from geometry datetimes.", new_feature);
  }

  if (end_i != -1){
    geometry.datetimes.splice(end_i, Number.MAX_VALUE);
    geometry.coordinates.splice(end_i, Number.MAX_VALUE);
  }

  if (front_splice != 0){
    geometry.datetimes.splice(0, front_splice);
    geometry.coordinates.splice(0, front_splice);
  }
  

  for (var pro_i = 0 ; pro_i < properties.length ; pro_i++){
    var property = properties[pro_i];
    for (var key in property){
      if (!property.hasOwnProperty(key)) continue;
      var array;
      if (Array.isArray(property[key])){
        array = property[key];
      }
      else{
        array = property[key].values;
      }
      if (end_i != -1) array.splice(end_i, Number.MAX_VALUE);
      if (front_splice != 0) array.splice(0, front_splice);
    }
  }

  if (start_i == end_i){
    if (geometry.datetimes.length != 0) throw new Stinuum.Exception("Something wrong in Slice Feature by time");
  }
  //TODO
  //make Sample and append start and end

  return new_feature;
}
