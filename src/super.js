/**
* change mode of stinuum. It is one-to-one correspondence with cesium mode.
* @param {string} [mode]
* ` ``js
* stinuum.changmeMode("SPACETIME");
* ` ``
*/

Stinuum.prototype.changeMode = function(mode){
    if (mode == undefined){
      if (this.mode == 'STATICMAP' || this.mode == 'ANIMATEDMAP'){
        this.mode = 'SPACETIME';
      }
      else{
        this.mode = 'STATICMAP';
      }
    }
    else{
      this.mode = mode;
    }
    
    this.geometryViewer.update({
        change : true
    });

}

Stinuum.prototype.getListOfHeight = function(datetimes, min_max_date){
  if (min_max_date == undefined){
    min_max_date = this.mfCollection.min_max.date;
  }
  var heights = [];
  for(var i = 0 ; i < datetimes.length ; i++){
    heights.push(Stinuum.normalizeTime(new Date(datetimes[i]), min_max_date, this.maxHeight));
  }
  return heights;
}


Stinuum.getCenter = function(coordinates, type){
  var x=0,y=0;
  var length = coordinates.length;
  if (type == 'MovingPolygon'){
    length -= 1;
  }
  for (var i = 0 ; i < length ; i++){
    x += coordinates[i][0];
    y += coordinates[i][1];

  }
  x /= length;
  y /= length;

  return [x,y];
}


Stinuum.prototype.setBounding = function(min_max, height){
  //if (this.bounding != undefined) this.cesiumViewer.entities.remove(this.bounding);
  var bs;
  if (height[0] == 0 && height[1] == 0){
    bs = undefined;
  }
  else{
    var center = Cesium.Cartesian3.fromDegrees((min_max.x[0] + min_max.x[1]) / 2, (min_max.y[1] + min_max.y[0])/2, height[1] / 2);
    bs = center;//new Cesium.BoundingSphere(center, height[1] / 2);

  }
  this.bounding = bs;
}
