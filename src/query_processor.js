
Stinuum.QueryProcessor.prototype.queryByTime = function(start, end){
  var mf_arr = this.super.features;
  var new_mf_arr = [];
  var del_mf_arr = [];
  for (var i = 0 ; i < mf_arr.length ; i++){
    var min_max_date = Stinuum.findMinMaxTime(mf_arr[i].feature.temporalGeometry.datetimes);
    del_mf_arr.push(mf_arr[i]);
    if (min_max_date[1] >= start && min_max_date[0] <= end){
      new_mf_arr.push(new Stinuum.MFPair(mf_arr[i].id, this.sliceFeatureByTime(mf_arr[i].feature, start, end)));
    }
  }

  for (var i = 0 ; i < this.super.hiddenFeatures.length ; i++){
    var min_max_date = Stinuum.findMinMaxTime(this.super.hiddenFeatures[i].feature.temporalGeometry.datetimes);
    del_mf_arr.push(this.super.hiddenFeatures[i]);
    if (min_max_date[1] >= start && min_max_date[0] <= end){
      new_mf_arr.push(new Stinuum.MFPair(mf_arr[i].id, this.sliceFeatureByTime(mf_arr[i].feature, start, end)));
    }
  }

  this.super.features = new_mf_arr;
  this.super.hiddenFeatures = del_mf_arr;
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

Stinuum.QueryProcessor.prototype.queryBySpatioTime = function(source, target){
  var mf_arr = this.super.features;
  if (Array.isArray(source) && Array.isArray(target) ){
    for (var s_i = 0 ; s_i < source.length ; s_i++){
      for (var i = 0 ; i < target.length ; i++){
        this.queryBySpatioTime(source[s_i], target[i]);
      }  
    }
  }
  else if(Array.isArray(source)){
    for (var s_i = 0 ; s_i < source.length ; s_i++){
        this.queryBySpatioTime(source[s_i], target);
      
    }
  }
  else if(Array.isArray(target)){
      for (var i = 0 ; i < target.length ; i++){
        this.queryBySpatioTime(source, target[i]);
      }  
    
  }
  else{
    var source_id = source.properties.name;
    var target_id = target.properties.name;
    if (this.super.inHiddenIndexOfById(source_id) == -1){
      this.super.hiddenFeatures.push(new Stinuum.MFPair(source_id, source));
    }
    if (this.super.inHiddenIndexOfById(target_id) == -1){
      this.super.hiddenFeatures.push(new Stinuum.MFPair(target_id, target));
    }

    // feature에 있으면 그거 그대로 쓰고.
    if (this.super.inFeaturesIndexOfById(source_id) != -1){
      source = this.super.getMFPairByIdInFeatures(source_id).feature;
    }
    else{// 없으면, timeslice
      source = this.sliceFeatureByTime(source, this.super.min_max.date[0], this.super.min_max.date[1]);
      this.super.features.push(new Stinuum.MFPair(source_id, source) );
    }

    //target은 feature에서 제거. query결과가 target
    if (this.super.inFeaturesIndexOfById(target_id) != -1){
      target = this.super.getMFPairByIdInFeatures(target_id).feature;
      this.super.removeByIndexInFeatures(this.super.inFeaturesIndexOfById(target_id));
    }
    else{
      target = this.sliceFeatureByTime(target, this.super.min_max.date[0], this.super.min_max.date[1]);
    }

    //if (Stinuum. )
  }

  

}
