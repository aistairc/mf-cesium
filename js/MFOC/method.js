//User Method Definition

MFOC.prototype.add = null;
MFOC.prototype.drawPaths = null;
MFOC.prototype.clear = null;
MFOC.prototype.remove = null;
MFOC.prototype.drawFeatures = null;
MFOC.prototype.removeByIndex = null;
MFOC.prototype.showProperty = null;
MFOC.prototype.highlight = null;
MFOC.prototype.showHOTSPOT = null;
MFOC.prototype.animate = null;
MFOC.prototype.changeMode = null;

MFOC.prototype.add = function(mf){
  if (mf.type != 'MovingFeature'){
    console.log("it is not MovingFeature!!@!@!");
    return 0;
  }
  this.features.push(mf);
  //this.min_max = this.findMinMax();
  return this.features.length - 1;
}

MFOC.prototype.drawFeatures = function(options){

  var mf_arr;
  if (options.movingfeature == undefined){
    mf_arr = this.features;
  }
  else{
    mf_arr = [];
    if (Array.isArray(options.movingfeature) ){
      mf_arr = options.movingfeature;
    }
    else{
      mf_arr.push(options.movingfeature);
    }

    this.features = this.features.concat(mf_arr);
  }

  this.min_max = this.findMinMaxGeometry(mf_arr);

  for (var index = 0 ; index < mf_arr.length ; index++){
    var feature = mf_arr[index];
    var feat_prim;
    if (feature.temporalGeometry.type == "MovingPoint"){
      feat_prim = this.viewer.scene.primitives.add(this.drawMovingPoint(feature.temporalGeometry));
    }
    else if(feature.temporalGeometry.type == "MovingPolygon"){
      feat_prim = this.viewer.scene.primitives.add(this.drawMovingPolygon(feature.temporalGeometry));
    }
    else if(feature.temporalGeometry.type == "MovingLineString"){
      feat_prim = this.viewer.scene.primitives.add(this.drawMovingLineString(feature.temporalGeometry));
    }
    else{
      console.log("this type cannot be drawn", feature);
    }

    this.feature_prim_memory[feature.properties.name] = feat_prim;//찾아서 지울때 사용.

  }

}

MFOC.prototype.drawPaths = function(options){
  var mf_arr;
  if (options.movingfeature == undefined){
    mf_arr = this.features;
  }
  else{
    mf_arr = [];
    if (Array.isArray(options.movingfeature) ){
      mf_arr = options.movingfeature;
    }
    else{
      mf_arr.push(options.movingfeature);
    }
    this.features = this.features.concat(mf_arr);
    console.log(this.features);
  }

  this.min_max = this.findMinMaxGeometry(mf_arr);

  for (var index = 0 ; index < mf_arr.length ; index++){
    var feature = mf_arr[index];
    var path_prim;
    if (feature.temporalGeometry.type == "MovingPoint"){
      path_prim = this.viewer.scene.primitives.add(this.drawPathMovingPoint({
        temporalGeometry : feature.temporalGeometry
      }));
    }
    else if(feature.temporalGeometry.type == "MovingPolygon"){
      path_prim = this.viewer.scene.primitives.add(this.drawPathMovingPolygon({
        temporalGeometry : feature.temporalGeometry
      }));
    }
    else if(feature.temporalGeometry.type == "MovingLineString"){
      path_prim = this.viewer.scene.primitives.add(this.drawPathMovingLineString({
        temporalGeometry : feature.temporalGeometry
      }));
    }
    else{
      console.log("this type cannot be drawn", feature);
    }

    this.path_prim_memory[feature.properties.name] = path_prim;
  }
}

MFOC.prototype.clear = function(){
  this.viewer.clock.multiplier = 10;
  this.viewer.dataSources.removeAll();
  var temp = this.viewer.scene.primitives.get(0);
  this.viewer.entities.removeAll();
  this.viewer.scene.primitives.removeAll();
  this.viewer.scene.primitives.add(temp);

  this.path_prim_memory = {};
  this.feature_prim_memory = {};
  this.features = [];
}

MFOC.prototype.remove = function(mf){

}

MFOC.prototype.removeByIndex = function(index){

}

MFOC.prototype.showProperty = function(property_name){

}

MFOC.prototype.highlight = function(mf, property_name){

}

MFOC.prototype.showHOTSPOT = function(x_deg, y_deg, time_deg){

}

MFOC.prototype.animate = function(mf){
  var mf_arr;
  if (mf == undefined){
    mf_arr = [mf];
  }
  else{
    mf_arr = this.features;
  }
}

MFOC.prototype.changeMode = function(mode){
  if (mode == undefined){
    if (this.mode == '2D'){
      this.mode = '3D';
    }
    else{
      this.mode = '2D';
    }
  }
  else{
    this.mode = mode;
  }
}
