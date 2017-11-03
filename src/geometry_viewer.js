
Stinuum.GeometryViewer.prototype.update = function(options){
  this.clear();
  this.super.mfCollection.findMinMaxGeometry();
  this.draw();
  this.animate(options);
  //this.adjustCameraView();
}

Stinuum.GeometryViewer.prototype.clear = function(){
  this.super.cesiumViewer.clock.multiplier = 10;
  this.super.cesiumViewer.dataSources.removeAll();
  var temp = this.super.cesiumViewer.scene.primitives.get(0);
  this.super.cesiumViewer.entities.removeAll();
  this.super.cesiumViewer.scene.primitives.removeAll();
  this.super.cesiumViewer.scene.primitives.add(temp);

  this.primitives = {};
}

Stinuum.GeometryViewer.prototype.draw = function(){
  var mf_arr = this.super.mfCollection.features;

  if (mf_arr.length == 0){
    console.log("mf_arr is 0. something wrong");
    return -1;
  }

  var minmax = this.super.mfCollection.min_max;

  if (this.super.mode == 'SPACETIME'){
    this.bounding_sphere = Stinuum.getBoundingSphere(minmax, [0,this.super.maxHeight] );
    this.super.cesiumViewer.scene.primitives.add(this.drawZaxis());
    var entities = this.drawZaxisLabel();
    this.super.cesiumViewer.entities.add(entities.values[0]);
  }
  else if  (this.super.mode == 'ANIMATEDMAP'){
    return -1;
  }
  else{
    this.bounding_sphere = Stinuum.getBoundingSphere(minmax, [0,0] );

  }
  for (var index = 0 ; index < mf_arr.length ; index++){
    var mf = mf_arr[index];
    var path_prim, primitive;

    if (mf.feature.temporalGeometry.type == "MovingPoint"){
      if (this.super.mode != 'SPACETIME' && this.super.s_query_on) continue;
      primitive = this.drawing.drawPathMovingPoint({
        temporalGeometry : mf.feature.temporalGeometry,
        id : mf.id
      });
    }
    else if(mf.feature.temporalGeometry.type == "MovingPolygon"){
      primitive =this.drawing.drawPathMovingPolygon({
        temporalGeometry : mf.feature.temporalGeometry,
        id : mf.id
      });
    }
    else if(mf.feature.temporalGeometry.type == "MovingLineString"){
      primitive = this.drawing.drawPathMovingLineString({
        temporalGeometry : mf.feature.temporalGeometry,
        id : mf.id
      });
    }
    else{
      console.log("this type cannot be drawn", feature);
    }

    if (primitive != -1)
    {
        path_prim = this.super.cesiumViewer.scene.primitives.add(primitive);
        this.primitives[mf.id] = path_prim;
    }
  }
  
}

Stinuum.GeometryViewer.prototype.animate = function(options){
  var mf_arr;
  var current_time;

  var min_max = this.super.mfCollection.min_max;
  if (options != undefined){
    if (options.id == undefined){
      mf_arr = this.super.mfCollection.features;
    }
    else{
      mf_arr = [];
      var id_arr = [];
      if (!Array.isArray(options.id) ){
        id_arr.push(options.id);
      }
      else{
        id_arr = options.id;
      }

      for (var i = 0 ; i < id_arr.length ; i++){
        mf_arr.push(this.super.mfCollection.getMFPairById(id_arr[i]));
      }
      min_max = this.super.mfCollection.findMinMaxGeometry(mf_arr);
    }
  }
  else{
    mf_arr = this.super.mfCollection.features;
  }


  if (mf_arr.length == 0){
    return -1;
  }



  if (options != undefined){
    if (options.change != undefined && options.change){ //dont change current animation time.
      current_time = Cesium.JulianDate.toIso8601(this.super.cesiumViewer.clock.currentTime) ;
    }
    else{
      current_time = min_max.date[0].toISOString();
    }
  }
  else{
    current_time = min_max.date[0].toISOString();
  }


  var multiplier = 10000;
  var czml = [{
    "id" : "document",
    "name" : "animationOfMovingFeature",
    "version" : "1.0"
  }];

  czml[0].clock = {
    "interval" : min_max.date[0].toISOString() +"/" + min_max.date[1].toISOString(),
    "currentTime" : current_time,
    "multiplier" : multiplier
  }

  for (var index = 0 ; index < mf_arr.length ; index++){
    var feature = mf_arr[index].feature;
    if (feature.temporalGeometry.type == "MovingPoint"){
      czml = czml.concat(this.moving.moveMovingPoint({
        temporalGeometry : feature.temporalGeometry,
        number : index
      }));
    }
    else if(feature.temporalGeometry.type == "MovingPolygon"){
      czml = czml.concat(this.moving.moveMovingPolygon({
        temporalGeometry : feature.temporalGeometry,
        number : index
      }));
    }
    else if(feature.temporalGeometry.type == "MovingLineString"){
      czml = czml.concat(this.moving.moveMovingLineString({
        temporalGeometry : feature.temporalGeometry,
        number : index
      }));
    }
    else{
      console.log("this type cannot be animated", feature);
    }
  }

  var load_czml = Cesium.CzmlDataSource.load(czml);
  var promise = this.super.cesiumViewer.dataSources.add(load_czml);
  return min_max;
}

Stinuum.GeometryViewer.prototype.drawZaxis = function(){
  var polylineCollection = new Cesium.PolylineCollection();
  var positions = [179,89,0,179,89,this.super.maxHeight];

  polylineCollection.add(Stinuum.drawOneLine(positions,Cesium.Color.WHITE , 5));
  polylineCollection.add(Stinuum.drawOneLine([178,88,this.super.maxHeight*0.95,179,89,this.super.maxHeight,179.9,89.9,this.super.maxHeight*0.95],Cesium.Color.WHITE , 5));

  for (var height = 10 ; height < 100 ; height += 20){
    for (var long = -179 ; long < 179 ; long += 10){
      polylineCollection.add(Stinuum.drawOneLine([long,88,this.super.maxHeight * height / 100,long+5,89,this.super.maxHeight/100 * height],Cesium.Color.WHITE, 1));
    }
    for (var lat = -89 ; lat < 89 ; lat += 10){
      polylineCollection.add(Stinuum.drawOneLine([179,lat,this.super.maxHeight * height / 100,179,lat+5,this.super.maxHeight/100 * height],Cesium.Color.WHITE, 1));
    }
  }


  return polylineCollection;
}

Stinuum.GeometryViewer.prototype.drawZaxisLabel = function(){
  var min_max = this.super.mfCollection.min_max;
  var entities = new Cesium.EntityCollection();
  var label = {
    position : Cesium.Cartesian3.fromDegrees(170, 88, this.super.maxHeight + 50000),
    label : {
      text : 'TIME',
      font : '18pt sans-serif',
      verticalOrigin : Cesium.VerticalOrigin.TOP,
      pixelOffsetScaleByDistance : new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e7, 0.1)
    }
  };
  entities.add(label);

  for (var height = 10 ; height < 100 ; height += 20){
    var time_label = new Date(min_max.date[0].getTime() + (min_max.date[1].getTime() - min_max.date[0].getTime()) * height/100).toISOString().split('T')[0];
    var label = {
      position : Cesium.Cartesian3.fromDegrees(155, 88, this.super.maxHeight * height / 100),
      label : {
        text : time_label,
        font : '12pt sans-serif',
        verticalOrigin : Cesium.VerticalOrigin.TOP,
        pixelOffsetScaleByDistance : new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e7, 0.1)
      }
    };
    entities.add(label);
  }

  return entities;

}

Stinuum.GeometryViewer.prototype.showProjection = function(id){

  var mf = this.super.mfCollection.getMFPairById(id).feature;
  var color = this.super.mfCollection.getColor(id);

  var geometry = mf.temporalGeometry;
  var instances = [];
  var time_label = [];
  //upper
  var upper_pos = [];
  var right_pos = [];

  var heights = this.super.getListOfHeight(geometry.datetimes);

  for (var index = 0 ; index < geometry.coordinates.length ; index++){
    var xy;
    if (geometry.type != 'MovingPoint'){
      xy = Stinuum.getCenter(geometry.coordinates[index], geometry.type);
    }
    else{
      xy = geometry.coordinates[index];
    }
    upper_pos = upper_pos.concat([xy[0], 89, heights[index]]);
    right_pos = right_pos.concat([179, xy[1], heights[index]]);
  }

  instances.push(Stinuum.drawInstanceOneLine(upper_pos, color.withAlpha(1.0)));
  instances.push(Stinuum.drawInstanceOneLine(right_pos, color.withAlpha(1.0)));

  for (var index = 0 ; index < 2 ; index++){
    var i = index * (geometry.coordinates.length-1);
    var xy;
    if (geometry.type != 'MovingPoint'){
      xy = Stinuum.getCenter(geometry.coordinates[i], geometry.type);
    }
    else{
      xy = geometry.coordinates[i];
    }
    var h = heights[i];
    for (var j = xy[1] ; j < 87.4 ; j += 2.5){
      instances.push(Stinuum.drawInstanceOneLine([xy[0], j, h, xy[0], j+1.25, h], Cesium.Color.WHITE.withAlpha(0.5)));
    }
    for (var j = xy[0] ; j < 177.4 ; j += 2.5){
      instances.push(Stinuum.drawInstanceOneLine([j, xy[1], h, j+1.25, xy[1], h], Cesium.Color.WHITE.withAlpha(0.5)));
    }

  }
  //right

  var prim = new Cesium.Primitive({
    geometryInstances: instances,
    appearance: new Cesium.PolylineColorAppearance(),
    allowPicking : false
  });
  return prim;
}

Stinuum.GeometryViewer.prototype.showHeightBar = function(id){
  var mf = this.super.mfCollection.getMFPairById(id).feature;
  var color = this.super.mfCollection.getColor(id);

  var geometry = mf.temporalGeometry;
  var instances = [];
  var time_label = [];
  //upper
  var pole = [];
  var upper_pos = [];
  var right_pos = [];

  var heights = this.super.getListOfHeight(geometry.datetimes);
  pole = [179,89,heights[0],179,89,heights[geometry.datetimes.length-1]];
  instances.push(Stinuum.drawInstanceOneLine(pole, Cesium.Color.RED.withAlpha(1.0), 10));

  time_label.push({
    position : Cesium.Cartesian3.fromDegrees(160, 78, heights[0]),
    label : {
      text : geometry.datetimes[0],
      font : '12pt sans-serif',
      verticalOrigin : Cesium.VerticalOrigin.TOP
    }
  });
  time_label.push({
    position : Cesium.Cartesian3.fromDegrees(178, 60, heights[geometry.datetimes.length-1]),
    label : {
      text : geometry.datetimes[geometry.datetimes.length-1],
      font : '12pt sans-serif',
      verticalOrigin : Cesium.VerticalOrigin.TOP
    }
  });


  var prim = new Cesium.Primitive({
    geometryInstances: instances,
    appearance: new Cesium.PolylineColorAppearance(),
    allowPicking : false
  });

  return [prim,time_label];
}

Stinuum.GeometryViewer.prototype.adjustCameraView = function(){
  //TODO
  LOG("adjustCameraView");

  var bounding = this.bounding_sphere;
  var viewer = this.viewer;
  var geomview = this;
  if (bounding == undefined || bounding == -1){
    return;
  }
  if (geomview.super.mode == "SPACETIME"){
    geomview.super.cesiumViewer.camera.flyTo({
      duration : 0.5,
      destination : Cesium.Cartesian3.fromDegrees(-50,-89,28000000),
      orientation : {
        direction : new Cesium.Cartesian3( 0.6886542487458516, 0.6475816335752261, -0.32617994043216153),
        up : new Cesium.Cartesian3(0.23760297490246338, 0.22346852237869355, 0.9453076990183581)
      }});
  }
  else{
    geomview.super.cesiumViewer.camera.flyToBoundingSphere(bounding, {
      duration : 0.5
    });
  }

  // setTimeout(function(){
  //   if (geomview.super.mode == "SPACETIME"){
  //   geomview.super.cesiumViewer.camera.flyTo({
  //     duration : 0.5,
  //     destination : Cesium.Cartesian3.fromDegrees(-50,-89,28000000),
  //     orientation : {
  //       direction : new Cesium.Cartesian3( 0.6886542487458516, 0.6475816335752261, -0.32617994043216153),
  //       up : new Cesium.Cartesian3(0.23760297490246338, 0.22346852237869355, 0.9453076990183581)
  //     }});
  //   }
  //   else{
  //     geomview.super.cesiumViewer.camera.flyToBoundingSphere(bounding, {
  //       duration : 0.5
  //     });
  //   }
  // }, 300);

}



Stinuum.GeometryViewer.prototype.clickMovingFeature = function(id){
  var geo_viewer = this;

  if (id == undefined){
     return;
  }

  if (geo_viewer.projection != null){
    if (!geo_viewer.projection.isDestroyed()){
      geo_viewer.super.cesiumViewer.scene.primitives.remove(this.projection);
    }
    geo_viewer.projection = null;
  }
  if (geo_viewer.time_label.length != 0){
    for (var i = 0 ; i < geo_viewer.time_label.length ; i++){
      if (geo_viewer.time_label[i] != null && geo_viewer.time_label[i] != undefined)
        geo_viewer.super.cesiumViewer.entities.remove(geo_viewer.time_label[i]);
    }
  }
  if (geo_viewer.label_timeout != undefined){
      window.clearTimeout(geo_viewer.label_timeout);
  }

  geo_viewer.time_label = [];

  if (geo_viewer.super.mode == 'SPACETIME'){
    var ret = this.showHeightBar(id);
    geo_viewer.projection = geo_viewer.super.cesiumViewer.scene.primitives.add(ret[0]);

    var time_label = ret[1];
    for (var i  = 0 ; i < time_label.length ; i++){
      geo_viewer.time_label.push(geo_viewer.super.cesiumViewer.entities.add(time_label[i]));
    }
  }

  //TODO click highlight => blinking

  geo_viewer.label_timeout = setTimeout(function(){
    if (geo_viewer.projection != null){
      if (!geo_viewer.projection.isDestroyed()){
        geo_viewer.super.cesiumViewer.scene.primitives.remove(geo_viewer.projection);
      }
      geo_viewer.projection = null;
    }
    if (geo_viewer.time_label.length != 0){
      for (var i = 0 ; i < geo_viewer.time_label.length ; i++){
        if (geo_viewer.time_label[i] != null && geo_viewer.time_label[i] != undefined)
        geo_viewer.super.cesiumViewer.entities.remove(geo_viewer.time_label[i]);
      }
    }

},10000);


  return 1;

}

Stinuum.GeometryViewer.prototype.drawBoundingBox = function(bounding_box, layer_id){
  // if (bounding_box.bbox[1] < -90 || bounding_box.bbox[3] > 90 || bounding_box.bbox[0] < -180 || bounding_box.bbox[1] > 180){
  //   return;
  // }
  var coords = Cesium.Rectangle.fromDegrees(bounding_box.bbox[0],bounding_box.bbox[1], bounding_box.bbox[2], bounding_box.bbox[3]);
  var box_entity = this.super.cesiumViewer.entities.add({
    id : layer_id,
    rectangle :{
      coordinates : coords,
      height :0,
      material : Cesium.Color.YELLOW.withAlpha(0.1),
      outline:true,
      outlineColor: Cesium.Color.RED,
      outlineWidth : 5.0
    }
  });
  if (this.super.mode == 'STATIC_MAP') this.super.cesiumViewer.zoomTo(box_entity, new Cesium.HeadingPitchRange(0,0,20000000));
  else this.super.cesiumViewer.zoomTo(box_entity);
}

Stinuum.GeometryViewer.prototype.removeBoundingBox = function(layer_id){
  var ret = this.super.cesiumViewer.entities.removeById(layer_id);
}