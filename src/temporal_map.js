
Stinuum.TemporalMap.prototype.show = function(mf_id,propertyName){
  var pro_name = propertyName;

  var mf = this.super.mfCollection.getMFPairById(mf_id);
  if (mf == -1){
    console.log("please add mf first.");
    return;
  }

  //Only this feature is viewed in graph.
  this.super.mfCollection.hideAll(mf_id);

  var property = Stinuum.getPropertyByName(mf.feature, pro_name, mf_id)[0];
  if (property == -1){
    console.log("that property is not in this moving feature");
    return;
  }

  if (this.super.geometryViewer.primitives[mf_id] != undefined){
    this.super.cesiumViewer.scene.primitives.remove(this.super.geometryViewer.primitives[mf_id]);
    this.super.geometryViewer.primitives[mf_id] = undefined;
  }


  this.super.mfCollection.min_max = this.super.mfCollection.findMinMaxGeometry([mf]);
  var type = mf.feature.temporalGeometry.type;
  this.super.geometryViewer.clear();

  if (this.super.mode == 'SPACETIME'){
    //this.bounding_sphere = Stinuum.getBoundingSphere(this.min_max, [0, this.max_height]  );
    this.super.cesiumViewer.scene.primitives.add(this.super.geometryViewer.drawZaxis());
    var entities = this.super.geometryViewer.drawZaxisLabel();
    for (var i = 0 ; i < entities.values.length ; i ++ ){
      this.super.cesiumViewer.entities.add(entities.values[i]);
    }

  }
  else{
  //  this.bounding_sphere = Stinuum.getBoundingSphere(this.min_max, [0,0] );
  }


  var highlight_prim;
  if (type == 'MovingPolygon'){
    highlight_prim = this.super.cesiumViewer.scene.primitives.add(this.super.geometryViewer.drawing.drawPathMovingPolygon({
      temporalGeometry : mf.feature.temporalGeometry,
      temporalProperty : property
    }));
  }
  else if (type == 'MovingPoint'){
    highlight_prim = this.super.cesiumViewer.scene.primitives.add(this.super.geometryViewer.drawing.drawPathMovingPoint({
      temporalGeometry : mf.feature.temporalGeometry,
      temporalProperty : property
    }));
  }
  else if (type == 'MovingLineString'){
    highlight_prim = this.super.cesiumViewer.scene.primitives.add(this.super.geometryViewer.drawing.drawPathMovingLineString({
      temporalGeometry : mf.feature.temporalGeometry,
      temporalProperty : property
    }));
  }
  else{
    LOG('this type is not implemented.');
  }

  this.super.geometryViewer.primitives[mf_id] = highlight_prim;
  this.super.geometryViewer.animate({
    id : mf_id
  });

  return 0;
}
