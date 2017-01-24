var makePolylineCollection= function(position, r_color , width = 3){
  var polylines = new Cesium.PolylineCollection();

  var material = new Cesium.Material.fromType('Color');
  material.uniforms.color = r_color;

  for (var i = 0 ; i < position.length ; i++){
    polylines.add({
      positions :  Cesium.Cartesian3.fromDegreesArrayHeights(position[i]) ,
      width : width,
      material : material
    });
  }


  return polylines;

}


var makePolygonWithHeight = function (position, r_color){
  var vertexF = new Cesium.VertexFormat({
    position : true,
    st : false,
    normal : true,
    color : true
  });

  var polygon = new Cesium.PolygonGeometry({
    polygonHierarchy : new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.fromDegreesArrayHeights(position)
    ),
    vertexFormat : vertexF,
    perPositionHeight : true
  });

  var p_geometry = Cesium.PolygonGeometry.createGeometry(polygon);

  return (new Cesium.GeometryInstance({
    geometry : p_geometry,
    attributes : {
      color : Cesium.ColorGeometryInstanceAttribute.fromColor(r_color)

    }

  } ));
};


var normalizeTime = function(date, min_max_date, value = 15000000){
  var separation = min_max_date[1] - min_max_date[0];
  return (date.getTime() - min_max_date[0])/separation * value;
};


var findMinMaxTime = function(datetimes){
  var min_max_date = [];
  min_max_date[0] = new Date(datetimes[0]).getTime();
  min_max_date[1] = new Date(datetimes[0]).getTime();

  for (var j = 1 ; j < datetimes.length ; j++){

    var time = new Date(datetimes[j]).getTime();

    if (min_max_date[0] > time){
      min_max_date[0] = time;
    }
    if (min_max_date[1] < time){
      min_max_date[1] = time;
    }
  }
  return min_max_date;
};
