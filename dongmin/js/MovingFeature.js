MovingFeature.getNewFeature = function (geometry){
  var obj;
  if (geometry.type == 'MovingPolygon'){
    obj = new MovingPolygon();
  }
  else if (geometry.type == 'MovingPoint'){
    obj = new MovingPoint();
  }
  else if (geometry.type == 'MovingLineString'){
    obj = new MovingLineString();
  }
  else{
    alert("undefined type");
    return;
  }
  return obj;
}
