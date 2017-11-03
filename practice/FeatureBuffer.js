function FeatureBuffer(p_connection){
  this.connector = p_connection;
  this.data = {};
  this.stBoundedBy = {};
  this.fromServer = {};
}

FeatureBuffer.prototype.getFeatureIDsByLayerID = function(layer_id){
  if (this.data[layer_id] == undefined){
    LOG("no layer", layer_id);
    throw "this layer_id is not in buffer" + layer_id;
  }
  return this.data[layer_id];  
}

FeatureBuffer.prototype.getFeature = function(layer_id, feature_id){
  if (this.data[layer_id][feature_id] == undefined){
    LOG("no feature", layer_id, feature_id);
    throw "this layer_id, feature_id is not in buffer";
  }
  return this.data[layer_id][feature_id];
}

FeatureBuffer.prototype.createLayer = function(layer_id, isFromServer){
  if (!this.data.hasOwnProperty(layer_id)) {
    this.data[layer_id] = {};
  }
  if (isFromServer != undefined) this.fromServer[layer_id] = isFromServer;
  else this.fromServer[layer_id] = false;
}

FeatureBuffer.prototype.deleteBuffer = function(layer_id, feature_id){
  LOG("TODO deleteBuffer");
}

FeatureBuffer.prototype.setBuffer_layer = function(layer_data){
  for(var i = 0 ; i < layer_data.features.length; i++){
    var feature_id = layer_data.features[i].properties.name;
    this.setBuffer_feature(layer_data.name, feature_id, layer_data.features[i]);
  }
}

FeatureBuffer.prototype.setBuffer_feature = function(layer_id, feature_id, feature_data){
  if (!this.data.hasOwnProperty(layer_id)) {
    throw layer_id + " is not created layer";
  }
  this.data[layer_id][feature_id] = {};

  if (!Array.isArray(feature_data.temporalGeometry.coordinates[0][0][0]) 
   && feature_data.temporalGeometry.type == 'MovingPolygon'){ //old mf-json format for polygon
    var coord = feature_data.temporalGeometry.coordinates;
    var new_arr = [];
    for (var j = 0 ; j < coord.length ; j++){
      new_arr.push([coord[j]]);
    }
    feature_data.temporalGeometry.coordinates = new_arr;
    LOG("old data format coming..")
  }

  try{
    this.data[layer_id][feature_id] = JSON.parse(feature_data);
  }
  catch(e) {
    //throw new Stinuum.Exception("it is not json format", feature_data);
    this.data[layer_id][feature_id] = feature_data;
  }
}


FeatureBuffer.prototype.getLayerNameList = function(){
  var list = [];
  for (var key in this.data){
    if (this.data.hasOwnProperty(key)) {
      list.push(key);
    }
  }
  return list;
}

FeatureBuffer.prototype.getBoundedBy = function(layer){
  return this.stBoundedBy[layer];
}





//TODO remove
/*
FeatureBuffer.prototype.getBuffer = function(id) {
    if (id.length == 1) {
        if (this.data.hasOwnProperty(id[0])) {
            return this.data[id[0]];
        }
    } else if (id.length == 2) {
      if (this.data.hasOwnProperty(id[0])) {
          var temp = this.data[id[0]];
          if (temp.hasOwnProperty(id[1])) {
              return temp[id[1]];
          }

      }
    }
    LOG("TODO remove");
    return null;
}


FeatureBuffer.prototype.removeBuffer = function(id){
     if (id.length == 1) {
         if (getBuffer(id) !== null) {
             delete this.data[id[0]];
         }
     } else if (id.length == 2) {
         if (getBuffer(id) !== null) {
             delete this.data[id[0]][id[1]];
         }
     }
    LOG("TODO remove");
}


FeatureBuffer.prototype.updateBuffer = function(id, feature) {
  LOG("TODO remove");
  if (id.length == 1) {
    if (!this.data.hasOwnProperty(id[0])) {
      this.data[id[0]] = {};
    }
  } else if (id.length == 2) {
    if (!this.data.hasOwnProperty(id[0])) {
      this.data[id[0]] = {};
      this.data[id[0]][id[1]] = {};
      try{
        JSON.parse(feature);
        this.data[id[0]][id[1]] = JSON.parse(feature);
        console.log(this.data[id[0]][id[1]]);
      }
      catch(e) {
        this.data[id[0]][id[1]] =feature;
      }
      //this.data[id[0]][id[1]] = feature;
    } else {
      if (!this.data[id[0]].hasOwnProperty(id[1])) {
        this.data[id[0]][id[1]] = {};
        try{
          this.data[id[0]][id[1]] = JSON.parse(feature);
        }
        catch(e){
          this.data[id[0]][id[1]] = feature;
        }


      }
    }
  }
}
*/