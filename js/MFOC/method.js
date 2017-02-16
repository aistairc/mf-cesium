//User Method Definition

MFOC.prototype.add = null;
MFOC.prototype.drawPaths = null;
MFOC.prototype.clear = null;
MFOC.prototype.remove = null;
MFOC.prototype.drawFeatures = null;
MFOC.prototype.removeByName = null;
MFOC.prototype.showProperty = null;
MFOC.prototype.highlight = null;
MFOC.prototype.showSpaceTimeCube = null;
MFOC.prototype.animate = null;
MFOC.prototype.changeMode = null;
MFOC.prototype.showDirectionalRader = null;
MFOC.prototype.setCameraView = null;
MFOC.prototype.add = function(mf){
  if (Array.isArray(mf)){
    for (var i = 0 ; i < mf.length ; i++){
      var mf_temp = mf[i];
      if (mf_temp.type != 'MovingFeature'){
        console.log("it is not MovingFeature!!@!@!");
        return 0;
      }
      this.features.push(mf_temp);
    }
  }
  else{
    if (mf.type != 'MovingFeature'){
      console.log("it is not MovingFeature!!@!@!");
      return 0;
    }
    this.features.push(mf);
  }

  //this.min_max = this.findMinMax();
  return this.features.length;
}

MFOC.prototype.drawFeatures = function(options){
  var mf_arr;
  if (options != undefined){
    if (options.name == undefined){
      mf_arr = this.features;
    }
    else{
      mf_arr = [];
      var name_arr = [];
      if (!Array.isArray(options.name) ){
        name_arr.push(options.name);
      }
      else{
        name_arr = options.name;
      }

      for (var i = 0 ; i < name_arr.length ; i++){
        var feat = this.getFeatureByName(name_arr[i]);
        if (feat != -1){
          mf_arr.push(feat);
        }
      }
    }
  }
  else{
    mf_arr = this.features;
  }

  this.min_max = this.findMinMaxGeometry(mf_arr);
  this.bounding_sphere = MFOC.getBoundingSphere(this.min_max, [0,this.max_height] );

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

  this.adjustCameraView();
}

MFOC.prototype.drawPaths = function(options){

  var mf_arr;
  if (options != undefined){
    if (options.name == undefined){
      mf_arr = this.features;
    }
    else{
      mf_arr = [];
      var name_arr = [];
      if (!Array.isArray(options.name) ){
        name_arr.push(options.name);
      }
      else{
        name_arr = options.name;
      }

      for (var i = 0 ; i < name_arr.length ; i++){
        mf_arr.push(this.getFeatureByName(name_arr[i]));
      }
    }
  }
  else{
    mf_arr = this.features;
  }

  this.min_max = this.findMinMaxGeometry(mf_arr);
  this.bounding_sphere = MFOC.getBoundingSphere(this.min_max, [0,this.max_height] );

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

  this.adjustCameraView();

  //this.viewer.camera.flyTo({    destination : this.viewer.camera.position  });
}

MFOC.prototype.reset = function(){
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

MFOC.prototype.clearViewer = function(){
  this.viewer.clock.multiplier = 10;
  this.viewer.dataSources.removeAll();
  var temp = this.viewer.scene.primitives.get(0);
  this.viewer.entities.removeAll();
  this.viewer.scene.primitives.removeAll();
  this.viewer.scene.primitives.add(temp);

  this.path_prim_memory = {};
  this.feature_prim_memory = {};
}

MFOC.prototype.clearAnimation = function(){
  this.viewer.clock.multiplier = 10;
  this.viewer.dataSources.removeAll();
}

MFOC.prototype.remove = function(mf){
  var index = this.features.indexOf(mf);
  if(index === -1){
    console.log("this mf is not exist in array");
  }
  else{
    console.log(this.features, this.features[index], mf);
    return;
    var remove_mf = this.features.splice(index, 1);
    if (remove_mf[0] != mf){
      console.log(index, remove_mf[0], mf);
      console.log("it is something wrong!!!");
      return;
    }
    if (this.path_prim_memory[mf.properties.name] != undefined){
      this.viewer.scene.primitives.remove(this.path_prim_memory[mf.properties.name]);
      this.path_prim_memory[mf.properties.name] = undefined;
    }
    if (this.feature_prim_memory[mf.properties.name] != undefined){
      this.viewer.scene.primitives.remove(this.feature_prim_memory[mf.properties.name]);
      this.feature_prim_memory[mf.properties.name] = undefined;
    }
  }
  return this.features.length;
}

MFOC.prototype.removeByName = function(name){
  var features = this.getFeatureByName(name);
  if (features == -1){
    return;
  }
  var index = this.features.indexOf(features);
  if(index === -1){
    console.log("this mf is not exist in array");
    return;
  }
  else{
    console.log(this.features, this.features[index], mf);
    return;
    var remove_mf = this.features.splice(index, 1);
    if (remove_mf[0] != mf){
      console.log(index, remove_mf[0], mf);
      console.log("it is something wrong!!!");
      return;
    }
    if (this.path_prim_memory[mf.properties.name] != undefined){
      this.viewer.scene.primitives.remove(this.path_prim_memory[mf.properties.name]);
      this.path_prim_memory[mf.properties.name] = undefined;
    }
    if (this.feature_prim_memory[mf.properties.name] != undefined){
      this.viewer.scene.primitives.remove(this.feature_prim_memory[mf.properties.name]);
      this.feature_prim_memory[mf.properties.name] = undefined;
    }
  }
  return this.features.length;
}

MFOC.prototype.showProperty = function(propertyName, divID){
  var pro_arr = [];
  for (var i = 0 ; i < this.features.length ; i ++){
    var property = MFOC.getPropertyByName(this.features[i], propertyName);
    if (property != -1){
      pro_arr.push(property);
    }
  }
  this.showPropertyArray(pro_arr, divID);
}

MFOC.prototype.highlight = function(movingfeatureName,propertyName){
  var mf_name = movingfeatureName;
  var pro_name = propertyName;

  var mf = this.getFeatureByName(mf_name);
  if (mf == -1){
    console.log("please add mf first.");
    return;
  }
  var property = MFOC.getPropertyByName(mf, pro_name);
  if (property == -1){
    console.log("that property is not in this moving feature");
    return;
  }

  if (this.path_prim_memory[mf_name] != undefined){
    this.viewer.scene.primitives.remove(this.path_prim_memory[mf_name]);
    this.path_prim_memory[mf_name] = undefined;
  }
  if (this.feature_prim_memory[mf_name] != undefined){
    this.viewer.scene.primitives.remove(this.feature_prim_memory[mf_name]);
    this.feature_prim_memory[mf_name] = undefined;
  }

  this.min_max = this.findMinMaxGeometry(this.features);
  var type = mf.temporalGeometry.type;

  var mmtime = MFOC.findMinMaxTime(mf.temporalGeometry.datetimes);
  var bounding_sphere = MFOC.getBoundingSphere(MFOC.findMinMaxCoord(mf.temporalGeometry.coordinates), [MFOC.normalizeTime(mmtime[0], this.min_max.date, this.max_height),
  MFOC.normalizeTime(mmtime[1], this.min_max.date, this.max_height)]  );

  var highlight_prim;
  if (type == 'MovingPolygon'){
    highlight_prim = this.viewer.scene.primitives.add(this.drawPathMovingPolygon({
      temporalGeometry : mf.temporalGeometry,
      temporalProperty : property
    }));
  }
  else if (type == 'MovingPoint'){
    highlight_prim = this.viewer.scene.primitives.add(this.drawPathMovingPoint({
      temporalGeometry :  mf.temporalGeometry,
      temporalProperty : property
    }));
  }
  else if (type == 'MovingLineString'){
    highlight_prim = this.viewer.scene.primitives.add(this.drawPathMovingLineString({
      temporalGeometry :  mf.temporalGeometry,
      temporalProperty : property
    }));
  }
  else{
    LOG('this type is not implemented.');
  }

  this.path_prim_memory[mf_name] = highlight_prim;
  var this_mfoc = this;
  this.viewer.camera.flyToBoundingSphere(bounding_sphere, {
    duration : 1.0
  });
}

MFOC.prototype.removeSpaceTimeCube = function(){
  if (this.cube_primitives !=  null){
    this.primitives.remove(this.cube_primitives);
    this.cube_primitives = null;
  }
}

MFOC.prototype.showSpaceTimeCube = function(degree){
  var x_deg = degree.x,
  y_deg = degree.y,
  z_deg = degree.time;

  var mf_arr = this.features;

  degree.time = degree.time * 86400;
  this.min_max = this.findMinMaxGeometry(mf_arr);
  this.hotspot_maxnum = 0;
  var cube_data = this.makeBasicCube(degree);
  if (cube_data == -1){
    console.log("time degree 너무 큼");
    return;
  }

  for (var index = 0 ; index < mf_arr.length ; index++){
    var feature = mf_arr[index];

    if (feature.temporalGeometry.type == "MovingPoint"){
      this.drawSpaceTimeCubeMovingPoint(feature.temporalGeometry, degree, cube_data);
    }
    else if(feature.temporalGeometry.type == "MovingPolygon"){
      this.drawSpaceTimeCubeMovingPolygon(feature.temporalGeometry, degree, cube_data);
    }
    else if(feature.temporalGeometry.type == "MovingLineString"){
      this.drawSpaceTimeCubeMovingLineString(feature.temporalGeometry, degree, cube_data);
    }
    else{
      console.log("nono", feature);
    }
  }
  if (this.hotspot_maxnum == 0){
    console.log("datetimes of data have too long gap. There is no hotspot");
    return;
  }
  var cube_prim = this.makeCube(degree, cube_data);

  this.cube_primitives = this.primitives.add(cube_prim);

}

MFOC.prototype.getFeatureByName = function(name){
  for (var i = 0 ; i < this.features.length ; i++){
    if (this.features[i].properties.name == name){
      return this.features[i];
    }
  }
  return -1;
}

MFOC.prototype.animate = function(options){
  var mf_arr;
  if (options != undefined){
    if (options.name == undefined){
      mf_arr = this.features;
    }
    else{
      mf_arr = [];
      var name_arr = [];
      if (!Array.isArray(options.name) ){
        name_arr.push(options.name);
      }
      else{
        name_arr = options.name;
      }

      for (var i = 0 ; i < name_arr.length ; i++){
        mf_arr.push(this.getFeatureByName(name_arr[i]));
      }
    }
  }
  else{
    mf_arr = this.features;
  }


  this.min_max = this.findMinMaxGeometry(mf_arr);
  var multiplier = 10000;
  var czml = [{
    "id" : "document",
    "name" : "polygon_highlight",
    "version" : "1.0"
  }];

  czml[0].clock = {
    "interval" : this.min_max.date[0].toISOString() +"/" + this.min_max.date[1].toISOString(),
    "currentTime" : this.min_max.date[0].toISOString(),
    "multiplier" : multiplier
  }

  for (var index = 0 ; index < mf_arr.length ; index++){
    var feature = mf_arr[index];
    if (feature.temporalGeometry.type == "MovingPoint"){
      czml = czml.concat(this.moveMovingPoint({
        temporalGeometry : feature.temporalGeometry,
        number : index
      }));
    }
    else if(feature.temporalGeometry.type == "MovingPolygon"){
      czml = czml.concat(this.moveMovingPolygon({
        temporalGeometry : feature.temporalGeometry,
        number : index
      }));
    }
    else if(feature.temporalGeometry.type == "MovingLineString"){
      czml = czml.concat(this.moveMovingLineString({
        temporalGeometry : feature.temporalGeometry,
        number : index
      }));
    }
    else{
      console.log("this type cannot be animated", feature);
    }
  }

  var load_czml = Cesium.CzmlDataSource.load(czml);
  viewer.dataSources.add(load_czml);
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

MFOC.prototype.showDirectionalRader = function(canvasID){
  var cumulative = new SpatialInfo();

  for (var index = 0 ; index < this.features.length ; index++){
    var feature = this.features[index];
    MFOC.addDirectionInfo(cumulative, feature.temporalGeometry);
  }

  var total_life = cumulative.west.total_life + cumulative.east.total_life + cumulative.north.total_life + cumulative.south.total_life;
  var total_length = cumulative.west.total_length + cumulative.east.total_length + cumulative.north.total_length + cumulative.south.total_length;
  var cnvs = document.getElementById(canvasID);
  if (cnvs.getContext){
    var h_width = cnvs.width / 2;
    var h_height = cnvs.height / 2;
    var ctx = cnvs.getContext('2d');

    var max_life = Math.max.apply(null, [cumulative.west.total_life , cumulative.east.total_life , cumulative.north.total_life, cumulative.south.total_life]);

    var max_length = Math.max.apply(null, [cumulative.west.total_length , cumulative.east.total_length , cumulative.north.total_length, cumulative.south.total_length]);
    var scale = 1 / (max_length/total_length) * 0.8;


    var length = [cumulative.west.total_length, cumulative.east.total_length, cumulative.north.total_length, cumulative.south.total_length];
    var length2 = [cumulative.west.total_length,- cumulative.east.total_length, cumulative.north.total_length, -cumulative.south.total_length];
    var life = [cumulative.west.total_life, cumulative.east.total_life, cumulative.north.total_life, cumulative.south.total_life];
    var velocity = [];
    var total_velocity = 0.0;
    for (var i = 0 ; i < length.length ; i++){
      if (life[i] == 0){
        velocity[i] = 0;
        continue;
      }
      velocity[i] = length[i]/life[i];

      total_velocity += velocity[i];
    }

    var color = ['rgb(255, 255, 0)','rgb(0, 255, 0)','blue','red'];

    for (var i = 0 ; i < life.length ; i++){

      for (var j = 0 ; j < 2 ; j += 0.1){
        ctx.beginPath();
        ctx.arc(h_width,h_height,h_width * life[i] / max_life, j * Math.PI,(j+0.05)*Math.PI);
        ctx.strokeStyle= color[i];
        ctx.stroke();
      }
    }

    for (var i = 0 ; i < 2 ; i++){
      ctx.beginPath();
      ctx.moveTo(h_width,h_height);
      ctx.lineTo(h_width - length2[i]/max_length * 0.375 * 0.9 * h_width, h_height - 0.25 * 1 * h_height * velocity[i]/total_velocity);
      ctx.lineTo(h_width - length2[i]/max_length * 0.5 * 0.9 *  h_width, h_height - 0.5 * 1 * h_height * velocity[i]/total_velocity);
      ctx.lineTo(h_width - length2[i]/max_length * 1.0 * 0.9 *  h_width, h_height);
      ctx.lineTo(h_width - length2[i]/max_length * 0.5 * 0.9 *  h_width, h_height + 0.5 * 1 * h_height * velocity[i]/total_velocity);
      ctx.lineTo(h_width - length2[i]/max_length * 0.375 * 0.9 *  h_width, h_height + 0.25 * 1 * h_height * velocity[i]/total_velocity);
      ctx.fillStyle= color[i];
      ctx.fill();
    }

    for (var i = 2 ; i < 4 ; i++){
      ctx.beginPath();
      ctx.moveTo(h_width,h_height);
      ctx.lineTo(h_width - velocity[i]/total_velocity * 0.25 * 1 * h_width, h_height - 0.375 * 0.9* h_height * length2[i]/max_length);
      ctx.lineTo(h_width - velocity[i]/total_velocity* 0.5 * 1 * h_width, h_height - 0.5 * 0.9  * h_height * length2[i]/max_length);
      ctx.lineTo(h_width, h_height - 1.0 * 0.9 *  h_height * length2[i]/max_length);
      ctx.lineTo(h_width +  velocity[i]/total_velocity * 0.5 * 1 * h_width, h_height - 0.5 * 0.9 * h_height * length2[i]/max_length);
      ctx.lineTo(h_width +  velocity[i]/total_velocity * 0.25 * 1 * h_width, h_height - 0.375 * 0.9 * h_height * length2[i]/max_length);
      ctx.fillStyle = color[i];
      ctx.fill();
    }


  }
  else{
    alert('canvas를 지원하지 않는 브라우저');
  }
}


MFOC.prototype.adjustCameraView = function(){
  var this_mfoc = this;
  var bounding = this.bounding_sphere;
  console.log(bounding);
  if (this.mode == '3D'){
    this.viewer.camera.flyToBoundingSphere(this.bounding_sphere, {
      duration : 1.0,
      complete : function(){
        var sin = Math.sin(Math.PI / 2) * bounding.radius;
        console.log(this_mfoc.viewer.camera.position);
        this_mfoc.viewer.camera.rotate(new Cesium.Cartesian3(1,0,0),-0.4);
      }
    });
  }
  else{
    this.viewer.camera.flyToBoundingSphere(this.bounding_sphere, {
      duration : 1.0
    });
  }
}
