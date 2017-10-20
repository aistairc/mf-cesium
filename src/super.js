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
    
    this.occurrenceMap.remove();
    this.s_query_on = false;
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
