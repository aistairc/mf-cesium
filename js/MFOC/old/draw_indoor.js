//draw movingfeature with z-value.

var drawPolygonsWithZvalue = function(mf_arr, with_height){

}


var drawPointsWithZvalue = function(mf_arr, with_height, max_height = 1000){
  var pointCollection = new Cesium.PointPrimitiveCollection();
  var min_max = findAllMinMaxTimeAndZ(mf_arr, true);

  for (var id = 0 ; id < mf_arr.length ; id++){
    var r_color = Cesium.Color.fromRandom({
      red : 0.0,
      blue : 0.0,
      minimumGreen : 0.2,
      alpha : 1.0
    });

    var buffer = mf_arr[id];
    var heights = getListOfHeight(buffer.temporalGeometry.datetimes, min_max.date, max_height);
    var data = buffer.temporalGeometry.coordinates;
    for(var i = 0 ; i < data.length ; i++ ){
      var p_color = r_color.clone();
      p_color.red = data[i][2] / min_max.value[1];
      p_color.blue = data[i][2] / min_max.value[1];

      if (!with_height){
        heights[i] = 0;
      }
      pointCollection.add(drawOnePoint(data[i], heights[i], p_color));
    }
  }
  return pointCollection;
}


var drawLinesWithZvalue = function(mf_arr, with_height){

}

var drawTyphoonsWithZvalue = function(mf_arr, with_height){

}

var drawLinesPathWithZvalue = function(mf_arr, with_height){

}

var drawPointsPathWithZvalue = function(mf_arr, with_height){
  if ( !Array.isArray(mf_arr) ){
    mf_arr = [mf_arr];
  }



}
