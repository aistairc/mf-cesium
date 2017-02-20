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
      if (this.contains(mf_temp)){
        return this.features.length;
      }
      this.features.push(mf_temp);
    }
  }
  else{
    if (mf.type != 'MovingFeature'){
      console.log("it is not MovingFeature!!@!@!");
      return 0;
    }
    if (this.contains(mf)){
      return this.features.length;
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

  if (mf_arr.length == 0){
    console.log("mf_arr is 0. something wrong");
    return -1;
  }

  this.min_max = this.findMinMaxGeometry(mf_arr);
  if (this.mode == '3D'){
    this.bounding_sphere = MFOC.getBoundingSphere(this.min_max, [0,this.max_height] );
  }
  else{
    this.bounding_sphere = MFOC.getBoundingSphere(this.min_max, [0,0] );
  }


  for (var index = 0 ; index < mf_arr.length ; index++){
    var feature = mf_arr[index];
    var feat_prim;

    if (feature.temporalGeometry.type == "MovingPoint"){
      feat_prim = this.viewer.scene.primitives.add(this.drawMovingPoint(feature.temporalGeometry,feature.properties.name));
    }
    else if(feature.temporalGeometry.type == "MovingPolygon"){
      feat_prim = this.viewer.scene.primitives.add(this.drawMovingPolygon(feature.temporalGeometry,feature.properties.name));
    }
    else if(feature.temporalGeometry.type == "MovingLineString"){
      feat_prim = this.viewer.scene.primitives.add(this.drawMovingLineString(feature.temporalGeometry,feature.properties.name));
    }
    else{
      console.log("this type cannot be drawn", feature);
    }
    this.feature_prim_memory[feature.properties.name] = feat_prim;//찾아서 지울때 사용.
  }

}

MFOC.prototype.contains = function(obj) {
   var i = this.features.length;
   while (i--) {
       if (this.features[i] === obj) {
           return true;
       }
   }
   return false;
}

MFOC.prototype.drawPaths = function(options){

  console.log("drawPaths", this.features.length);
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

  if (mf_arr.length == 0){
    console.log("mf_arr is 0. something wrong");
    return -1;
  }
  this.min_max = this.findMinMaxGeometry(mf_arr);

  if (this.mode == '3D'){
    this.bounding_sphere = MFOC.getBoundingSphere(this.min_max, [0,this.max_height] );
  }
  else{
    this.bounding_sphere = MFOC.getBoundingSphere(this.min_max, [0,0] );
  }


  for (var index = 0 ; index < mf_arr.length ; index++){
    var feature = mf_arr[index];
    var path_prim;

    if (feature.temporalGeometry.type == "MovingPoint"){
      path_prim = this.viewer.scene.primitives.add(this.drawPathMovingPoint({
        temporalGeometry : feature.temporalGeometry,
        name : feature.properties.name
      }));
    }
    else if(feature.temporalGeometry.type == "MovingPolygon"){
      path_prim = this.viewer.scene.primitives.add(this.drawPathMovingPolygon({
        temporalGeometry : feature.temporalGeometry,
        name : feature.properties.name
      }));
    }
    else if(feature.temporalGeometry.type == "MovingLineString"){
      path_prim = this.viewer.scene.primitives.add(this.drawPathMovingLineString({
        temporalGeometry : feature.temporalGeometry,
        name : feature.properties.name
      }));
    }
    else{
      console.log("this type cannot be drawn", feature);
    }
    this.path_prim_memory[feature.properties.name] = path_prim;
  }
  //this.adjustCameraView();
  return this.bounding_sphere;
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
    console.log("this mf is not exist in array", mf);
  }
  else{
    console.log(this.features, this.features[index], mf);

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
    console.log(this.features, this.features[index]);
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
  document.getElementById(divID).style.height = '20%';
  document.getElementById(divID).style.backgroundColor = 'rgba(5, 5, 5, 0.8)';
  var pro_arr = [];
  for (var i = 0 ; i < this.features.length ; i ++){
    var property = MFOC.getPropertyByName(this.features[i], propertyName);
    if (property != -1){
      pro_arr.push(property);
    }
  }
  if (pro_arr.length == 0){
    return;
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
  var property = MFOC.getPropertyByName(mf, pro_name)[0];
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

  var min_max = this.findMinMaxGeometry([mf]);
  var type = mf.temporalGeometry.type;

  var mmtime = MFOC.findMinMaxTime(mf.temporalGeometry.datetimes);


  var bounding_sphere;
  if (this.mode == '3D'){
    bounding_sphere = MFOC.getBoundingSphere(MFOC.findMinMaxCoordArray(mf.temporalGeometry.coordinates), [MFOC.normalizeTime(mmtime[0], min_max.date, this.max_height),
    MFOC.normalizeTime(mmtime[1], min_max.date, this.max_height)]  );
  }
  else{
    bounding_sphere = MFOC.getBoundingSphere(MFOC.findMinMaxCoordArray(mf.temporalGeometry.coordinates), [0,0] );
  }

  this.clearViewer();
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

  return bounding_sphere;
}

MFOC.prototype.removeSpaceTimeCube = function(){
  if (this.cube_primitives !=  null){
    this.primitives.remove(this.cube_primitives);
    this.cube_primitives = null;
  }
}

MFOC.prototype.showSpaceTimeCube = function(degree){
  if (degree == undefined){
    degree = {};
    degree.x = 5;
    degree.y = 5;
    degree.time = 5;
  }
  var x_deg = degree.x,
  y_deg = degree.y,
  z_deg = degree.time;

  var mf_arr = this.features;
  if (mf_arr.length == 0){
    return;
  }
  if (this.cube_primitives != null){
    this.primitives.remove(this.cube_primitives);
    this.cube_primitives == null;
  }
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

  if (mf_arr.length == 0){
    return -1;
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

    var color = ['rgb(255, 255, 0)','rgb(0, 255, 255)','blue','red'];

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

MFOC.adjustCameraView = function(viewer, bounding){

  if (bounding == undefined || bounding == -1){
    return;
  }

  setTimeout(function(){
    if (viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW){
      viewer.camera.flyToBoundingSphere(bounding, {
        duration : 1.0,
        complete : function(){
          var sin = Math.sin(Math.PI / 2) * bounding.radius;
          viewer.camera.rotate(new Cesium.Cartesian3(1,0,0),-0.4);
        }
      });
    }
    else{
      viewer.camera.flyToBoundingSphere(bounding, {
        duration : 1.0
      });
    }
  }, 1000);

}


MFOC.prototype.setAnalysisDIV = function(div_id, graph_id){

  var mfoc = this;
  var div = document.getElementById(div_id);
  div.innerHTML ='';
  div.style.top = '10%'
  div.style.paddingTop = 0;
  div.style.color = 'white';
  div.style.backgroundColor = 'rgba(255,255,255,0.5)';
  div.style.right = '5px';
  div.style.border = '1px solid white';
  div.style.width = '200px'

  var title = document.createElement("div");
  title.appendChild(document.createTextNode("ANALYSIS"));
  title.style.paddingTop = '4px';
  title.style.height = '9%';
  title.style.width = '100%';
  title.style.textAlign = 'center';
  title.style.verticalAlign = 'middle';
  title.style.backgroundColor = 'rgba(5,5,5,0.5)';
  title.style.borderBottom = '3px double white';

  var div_arr = [];
  for (var i= 0 ; i < 3 ; i++){
    div_arr[i] = document.createElement("div");
    div_arr[i].style.height = '30%';
    div_arr[i].style.width = '100%';
    div_arr[i].style.verticalAlign = 'middle';
    div_arr[i].style.padding = '2%';
    div_arr[i].style.textAlign = 'center';
    div_arr[i].style.borderBottom = '1px solid white';
    div_arr[i].style.display = 'flex';
    div_arr[i].style.alignItems = 'center';
    div_arr[i].style.backgroundColor = 'rgba(5,5,5,0.5)';
  }

  var properties_graph = div_arr[0],
  show_space_cube = div_arr[1],
  show_direction_rade = div_arr[2];

  properties_graph.appendChild(document.createTextNode("PROPERTY GRAPH"));
  show_space_cube.appendChild(document.createTextNode("TOGGLE HOTSPOT"));
  show_direction_rade.appendChild(document.createTextNode("DIRECTION RADER"));

  properties_graph.onclick = (function(glo_mfoc, graph){
    return function(){
      MFOC.selectProperty(glo_mfoc, graph);
    };
  })(mfoc, graph_id);

  show_space_cube.onclick = (function(glo_mfoc, div, graph){
    return function(){
      MFOC.selectDegree(mfoc, this, div, graph);
    }
  })(mfoc, div_id, graph_id);


  show_direction_rade.onclick = (function(glo_mfoc, canvas){
    return function(){
      glo_mfoc.showDirectionalRader(canvas);
    }
  })(mfoc, 'rader');

  div.appendChild(title);
  div.appendChild(properties_graph);
  div.appendChild(show_space_cube);
  div.appendChild(show_direction_rade);

  MFOC.drawBackRader(div_id);
}
