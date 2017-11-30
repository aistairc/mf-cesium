
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

  this.super.mfCollection.findMinMaxGeometry();
  var type = mf.feature.temporalGeometry.type;
  this.super.geometryViewer.clear();

  if (this.super.mode == 'SPACETIME'){
    this.super.setBounding(this.super.mfCollection.min_max, [0, this.super.maxHeight]  );
    this.super.cesiumViewer.scene.primitives.add(this.super.geometryViewer.drawZaxis());
    var entities = this.super.geometryViewer.drawZaxisLabel();
    for (var i = 0 ; i < entities.values.length ; i ++ ){
      this.super.cesiumViewer.entities.add(entities.values[i]);
    }
  }
  else{
    this.super.setBounding(this.super.mfCollection.min_max, [0,0] );
  }

  var highlight_prim;
  if (type == 'MovingPolygon'){
    highlight_prim = this.super.cesiumViewer.scene.primitives.add(this.super.geometryViewer.drawing.drawPathMovingPolygon({
      temporalGeometry : mf.feature.temporalGeometry,
      temporalProperty : property,
      id : mf_id
    }));
  }
  else if (type == 'MovingPoint'){
    highlight_prim = this.super.cesiumViewer.scene.primitives.add(this.super.geometryViewer.drawing.drawPathMovingPoint({
      temporalGeometry : mf.feature.temporalGeometry,
      temporalProperty : property,
      id : mf_id
    }));
  }
  else if (type == 'MovingLineString'){
    highlight_prim = this.super.cesiumViewer.scene.primitives.add(this.super.geometryViewer.drawing.drawPathMovingLineString({
      temporalGeometry : mf.feature.temporalGeometry,
      temporalProperty : property,
      id : mf_id
    }));
  }
  else{
    LOG('this type is not implemented.');
  }

  this.super.geometryViewer.primitives[mf_id] = highlight_prim;
  this.super.geometryViewer.animate();

  return 0;
}

Stinuum.TemporalMap.drawPathMovingPoint = function(data, property, heights){
  let instances = [];
  var pro_min_max = pro_min_max = Stinuum.findMinMaxProperties(property);

  //if array is too long, pick sample.
  if (data.coordinates.length > 100){
    LOG(heights)
    let one_line_length = data.coordinates.length / 100;
    let start_i = 0;
    let end_i = one_line_length;
    while (start_i < data.coordinates.length){
      let sub_coordinates = data.coordinates.slice(Math.floor(start_i), Math.floor(end_i) + 1);
      let sub_heights;
      if (heights == 0){ //2D
        sub_heights = heights;
      }
      else{ //3D
        sub_heights = heights.slice(Math.floor(start_i), Math.floor(end_i) + 1);
      }
      let positions = Stinuum.makeDegreesArray(sub_coordinates, sub_heights);
      let sum = 0;
      for (let i = Math.floor(start_i); i <= Math.floor(end_i) ; i++){
        sum += property.values[i];
      }
      let propertyAverage = sum / (Math.floor(end_i) + 1 - Math.floor(start_i));
      let color = Stinuum.TemporalMap.getPropertyColor(propertyAverage, pro_min_max.value);
      instances.push(Stinuum.drawInstanceOneLine(positions, color));
      start_i = end_i;
      end_i += one_line_length;
    }
  }
  else{
    for (let index = 0 ; index < data.coordinates.length - 1; index++){
      let color = Stinuum.TemporalMap.getPropertyColor((property.values[index] + property.values[index + 1])/2, pro_min_max.value)

      let positions;
      if (heights == 0){
        positions = (data.coordinates[index].concat([0]))
        .concat(data.coordinates[index+1].concat([0]));
      }
      else {
        if (data.interpolations[0] == 'Stepwise'){
          positions = (data.coordinates[index].concat(heights[index]))
          .concat(data.coordinates[index].concat(heights[index+1]));
        }
        else{
          positions = (data.coordinates[index].concat(heights[index]))
          .concat(data.coordinates[index+1].concat(heights[index+1]));
        }

      }
      instances.push(Stinuum.drawInstanceOneLine(positions, color));
    }
  }
  LOG(instances);
  return instances;
}



Stinuum.TemporalMap.getPropertyColor = function(value, min_max_value){
  let blue_rate = (value - min_max_value[0]) / (min_max_value[1] - min_max_value[0]);
  if (blue_rate < 0.2){
    blue_rate = 0.2;
  }
  if (blue_rate > 0.9){
    blue_rate = 0.9;
  }
  let color = new Cesium.Color(1.0 , 1.0 - blue_rate , 0 , 0.8);
  return color;
}
