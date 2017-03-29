MFCollection.prototype.add= function(mf, id){
    if (Array.isArray(mf)){
      for (var i = 0 ; i < mf.length ; i++){
        this.add(mf[i]);
      }
    }
    else{
      if (mf.type != 'MovingFeature'){
        console.log("it is not MovingFeature!!@!@!");
        return -1;
      }
      if (this.inFeaturesIndexOf(mf) != -1 || this.inHiddenIndexOf(mf) != -1){
        console.log("this mf already exist.");
        return -2;
      }
      if (id != undefined && (this.inFeaturesIndexOfById(id) != -1 || this.inHiddenIndexOfById(id) != -1 ) ){
        console.log("this id already exist.");
        return -2;
      }

      if (id == undefined && mf.properties.name == undefined){
        alert("feature has no name!");
        return -1;
      }
      if (id != undefined){
        this.features.push(new MFPair(id, mf));
      }
      else{
        this.features.push(new MFPair(mf.properties.name, mf));
      }
    }
}


MFCollection.prototype.remove= function(mf){
  var index = this.inFeaturesIndexOf(mf);
  if(index === -1){
    index = this.inHiddenIndexOf(mf);
    if (index == -1){
      console.log("this mf is not exist in array", mf);
      return -1;
    }
    else{
      return this.removeByIndexInHidden(index);
    }
  }
  else{
    return this.removeByIndexInFeatures(index);
  }
  return 0;
}

MFCollection.prototype.removeById= function(id){
  var index = this.inFeaturesIndexOfById(id);
  if(index === -1){
    index = this.inHiddenIndexOfById(id);
    if (index == -1){
      return -1;
    }
    else{
      return this.removeByIndexInHidden(index);
    }
  }
  else{
    return this.removeByIndexInFeatures(index);
  }
  return 0;
}

MFCollection.prototype.removeByIndexInFeatures= function(index){
  var remove_pair = this.features.splice(index, 1)[0];

  // var prim = this.super.geometryViewer.primitives[remove_pair[0].id];
  // if (prim != undefined){
  //   this.viewer.scene.primitives.remove(prim);
  //   this.super.geometryViewer.primitives[remove_pair[0].id] = undefined;
  // }

  return remove_pair;
}

MFCollection.prototype.removeByIndexInHidden= function(index){
  var remove_pair = this.hiddenFeatures.splice(index, 1)[0];


  // var prim = this.super.geometryViewer.primitives[remove_pair[0].id];
  // if (prim != undefined){
  //   this.viewer.scene.primitives.remove(prim);
  //   this.super.geometryViewer.primitives[remove_pair[0].id] = undefined;
  // }

  return remove_pair;
}


MFCollection.prototype.inFeaturesIndexOfById= function(id){
  for (var i = 0 ; i < this.features.length ; i++){
    if (this.features[i].id == id){
      return i;
    }
  }
  return -1;
}

MFCollection.prototype.inHiddenIndexOfById= function(id){
  for (var i = 0 ; i < this.features.length ; i++){
    if (this.hiddenFeatures[i].id == id){
      return i;
    }
  }
  return -1;
}

MFCollection.prototype.inFeaturesIndexOf= function(mf){
  for (var i = 0 ; i < this.features.length ; i++){
    if (this.features[i].feature == mf){
      return i;
    }
  }
  return -1;
}

MFCollection.prototype.inHiddenIndexOf= function(mf){
  for (var i = 0 ; i < this.hiddenFeatures.length ; i++){
    if (this.hiddenFeatures[i].feature == mf){
      return i;
    }
  }
  return -1;
}


MFCollection.prototype.refresh = function(){

  for (var i = 0 ; i < this.hiddenFeatures.length ; i++){
    this.features.push(this.hiddenFeatures[i]);
  }

  this.hiddenFeatures = [];

}

MFCollection.prototype.findMinMaxGeometry = function(p_mf_arr){
  var mf_arr;
  if (p_mf_arr == undefined){
    mf_arr = this.features;
  }
  else{
    mf_arr = p_mf_arr;
  }

  if (mf_arr.length == 0){
    return -1;
  }

  var min_max = {};
  min_max.x = [];
  min_max.y = [];
  min_max.z = [];

  min_max.date = [];

  var first_date = new Date(mf_arr[0].feature.temporalGeometry.datetimes[0]);
  min_max.date = [first_date,first_date];

  for (var i = 0 ; i < mf_arr.length ; i++){
    var mf_min_max_coord = {};
    if (mf_arr[i].feature.temporalGeometry.type == "MovingPoint"){
      mf_min_max_coord = Stinuum.findMinMaxCoord(mf_arr[i].feature.temporalGeometry.coordinates);
    }
    else{
      var coord_arr = mf_arr[i].feature.temporalGeometry.coordinates;
      mf_min_max_coord = Stinuum.findMinMaxCoord(coord_arr[0][0]);
      for (var j = 1 ; j < coord_arr.length ; j++){
        mf_min_max_coord = Stinuum.findBiggerCoord(mf_min_max_coord, Stinuum.findMinMaxCoord(coord_arr[j][0]) );
      }
    }

    if (min_max.x.length == 0){
      min_max.x = mf_min_max_coord.x;
      min_max.y = mf_min_max_coord.y;
      min_max.z = mf_min_max_coord.z;
    }
    else{
      var xyz = Stinuum.findBiggerCoord(min_max, mf_min_max_coord);
      min_max.x = xyz.x;
      min_max.y = xyz.y;
      min_max.z = xyz.z;
    }

    var temp_max_min = Stinuum.findMinMaxTime(mf_arr[i].feature.temporalGeometry.datetimes);

    if (temp_max_min[0].getTime() < min_max.date[0].getTime()){
      min_max.date[0] = temp_max_min[0];
    }
    if (temp_max_min[1].getTime() > min_max.date[1].getTime()){
      min_max.date[1] = temp_max_min[1];
    }
  }

  if (p_mf_arr == undefined){
    this.min_max = min_max;
  }

  return min_max;
}

MFCollection.prototype.getWholeMinMax = function() {
  var whole_features_pair;
  whole_features_pair = this.features.concat(this.hiddenFeatures);
  this.whole_min_max = this.findMinMaxGeometry(whole_features_pair);
  return this.whole_min_max;
}

MFCollection.prototype.getColor = function(id){
  if (this.colorCollection[id] != undefined){
    return this.colorCollection[id];
  }
  var color = Cesium.Color.fromRandom({
    minimumRed : 0.2,
    minimumBlue : 0.2,
    minimumGreen : 0.2,
    alpha : 1.0
  });
  this.colorCollection[id] = color;
  return color;
}

MFCollection.prototype.setColor = function(id, color){
  this.colorCollection[id] = color;
}

MFCollection.prototype.getAllPropertyType = function(){
  var array = [];
  for (var i = 0 ; i < this.features.length ; i++){
    if (this.features[i].feature.temporalProperties == undefined) continue;
    for (var j = 0 ; j < this.features[i].feature.temporalProperties.length ; j++){
      var keys = Object.keys(this.features[i].feature.temporalProperties[j]);
      for (var k = 0 ; k < keys.length ; k++){
        if (keys[k] == 'datetimes') continue;
        array.push(keys[k]);
      }
      return array;


    }

  }
  return array;
}

MFCollection.prototype.spliceByTime = function(start, end){//Date, Date

  var mf_arr = this.features;
  var new_mf_arr = [];
  var del_mf_arr = [];
  for (var i = 0 ; i < mf_arr.length ; i++){
    var min_max_date = Stinuum.findMinMaxTime(mf_arr[i].feature.temporalGeometry.datetimes);
    if (min_max_date[0] >= start && min_max_date[1] <= end){
      new_mf_arr.push(mf_arr[i]);
    }
    else{
      del_mf_arr.push(mf_arr[i]);
    }
  }

  for (var i = 0 ; i < this.hiddenFeatures.length ; i++){
    var min_max_date = Stinuum.findMinMaxTime(this.hiddenFeatures[i].feature.temporalGeometry.datetimes);
    if (min_max_date[0] >= start && min_max_date[1] <= end){
      new_mf_arr.push(this.hiddenFeatures[i]);
    }
    else{
      del_mf_arr.push(this.hiddenFeatures[i]);
    }

  }

  this.features = new_mf_arr;
  this.hiddenFeatures = del_mf_arr;
}

MFCollection.prototype.getFeatureById = function(id){
  var inFeatures = this.getFeatureByIdInFeatures(id);
  if (inFeatures != -1){
    return inFeatures;
  }

  var inHidden = this.getFeatureByIdinHidden(id);
  if (inHidden != -1){
    return inHidden;
  }

  return -1;
}

MFCollection.prototype.getFeatureByIdInFeatures = function(id){
  for (var i = 0 ; i < this.features.length ; i++){
    if (this.features[i].id == id){
      return this.features[i];
    }
  }

  return -1;
}

MFCollection.prototype.getFeatureByIdinHidden = function(id){
  for (var i = 0 ; i < this.hiddenFeatures.length ; i++){
    if (this.hiddenFeatures[i].id == id){
      return this.hiddenFeatures[i];
    }
  }

  return -1;
}

MFCollection.prototype.getLength = function(){
  return this.features.length;
}

MFCollection.prototype.reset = function(){
  this.features = [];
  this.hiddenFeatures = [];
  this.colorCollection = [];

}

MFCollection.prototype.hide = function(mf_id){
  if (this.inFeaturesIndexOfById(mf_id) != -1){
    var index = this.inFeaturesIndexOfById(mf_id);
    var hidden_pair = this.features.splice(index, 1)[0];

    this.hiddenFeatures.push(hidden_pair);
  }
}

MFCollection.prototype.hideAll = function(mf_id){ //hide All except one mf
  var i = 0;
  while(1){
    if (i == this.features.length){
      break;
    }
    if (mf_id != undefined){
      if (this.features[i].id == mf_id){
        i++;
        continue;
      }
    }
    this.hide(this.features[i].id);
  }
}
