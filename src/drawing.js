
Stinuum.PathDrawing.prototype.drawMovingPoint = function(options){

  var geometry = options.temporalGeometry;
  var id = options.id;

  var pointCollection = new Cesium.PointPrimitiveCollection();

  var r_color = this.supersuper.mfCollection.getColor(id);

  var data = geometry.coordinates;
  if(this.supersuper.mode == 'SPACETIME'){
    var heights = this.supersuper.getListOfHeight(geometry.datetimes);
    for(var i = 0 ; i < data.length ; i++ ){
      pointCollection.add(Stinuum.drawOnePoint(data[i], heights[i], r_color));
    }
  }
  else{
    for(var i = 0 ; i < data.length ; i++ ){
      pointCollection.add(Stinuum.drawOnePoint(data[i], 0, r_color));
    }
  }
  pointCollection.id = id;
  return pointCollection;
}

Stinuum.PathDrawing.prototype.drawMovingLineString = function(options){
  var geometry = options.temporalGeometry;
  var id = options.id;

  var polylineCollection = new Cesium.PolylineCollection();

  var r_color = this.supersuper.mfCollection.getColor(id);

  var data = geometry;
  var heights = this.supersuper.getListOfHeight(data.datetimes);

  for (var j = 0 ; j < data.coordinates.length ; j++){
    if (this.supersuper.mode == 'STATICMAP' || this.supersuper.mode == 'ANIMATEDMAP'){
      heights[j] = 0;
    }
    var positions = Stinuum.makeDegreesArray(data.coordinates[j], heights[j]);
    polylineCollection.add(Stinuum.drawOneLine(positions, r_color));
  }

  return polylineCollection;
}

Stinuum.PathDrawing.prototype.drawMovingPolygon = function(options){

  var geometry = options.temporalGeometry;
  var id = options.id;


  var r_color = this.supersuper.mfCollection.getColor(id).withAlpha(0.3);

  var min_max_date = this.supersuper.mfCollection.min_max.date;
  var coordinates = geometry.coordinates;
  var datetimes = geometry.datetimes;

  var prim;
  var poly_list = new Array();
  var heights = null;

  var with_height = false;
  if (this.supersuper.mode == 'SPACETIME'){
    with_height = true;
    heights = this.supersuper.getListOfHeight(datetimes);
  }

  for (var i = 0; i < coordinates.length; i++) {
    var height;
    if (!with_height){
      height = 0;
    }
    else{
      height = heights[i];
    }
    poly_list.push(Stinuum.drawOnePolygon(coordinates[i], height, with_height , r_color));
  }


  prim = new Cesium.Primitive({
    geometryInstances: poly_list,
    appearance: new Cesium.PerInstanceColorAppearance({})
  });

  return prim;
}



Stinuum.PathDrawing.prototype.drawPathMovingPoint = function(options){
  var instances = [];
  var color = this.supersuper.mfCollection.getColor(options.id);

  var data = options.temporalGeometry;
  var property = options.temporalProperty;
  var heights = 0;
  if (this.supersuper.mode == 'SPACETIME'){
    heights = this.supersuper.getListOfHeight(data.datetimes, this.supersuper.mfCollection.min_max.date);
  }
  var pro_min_max = null;
  if (property != undefined){
    pro_min_max = Stinuum.findMinMaxProperties(property);
  }

  if (data.interpolations[0] == 'Discrete'){
    return this.drawMovingPoint(options);
  }

  if (data.interpolations[0] == 'Stepwise' && this.supersuper.mode == 'STATICMAP'){
    return this.drawMovingPoint(options);
  }

  if (data.coordinates.length == 1){
    console.log("one");
  }
  else{
    if (property == undefined){
      var positions = Stinuum.makeDegreesArray(data.coordinates, heights);
      instances.push(Stinuum.drawInstanceOneLine(positions, color));
    }
    else{
      for (var index = 0 ; index < data.coordinates.length - 1; index++){
        var middle_value = (property.values[index] + property.values[index+1]) / 2;
        var blue_rate = (middle_value - pro_min_max.value[0]) / (pro_min_max.value[1] - pro_min_max.value[0]);
        if (blue_rate < 0.2){
          blue_rate = 0.2;
        }
        if (blue_rate > 0.9){
          blue_rate = 0.9;
        }
        color = new Cesium.Color(1.0 , 1.0 - blue_rate , 0 , blue_rate);

        var positions;
        if (this.supersuper.mode == 'STATICMAP' || this.supersuper.mode == 'ANIMATEDMAP'){
          positions =
          (data.coordinates[index].concat([0]))
          .concat(data.coordinates[index+1].concat([0]));
        }
        else {
          if (geometry.interpolations[0] == 'Stepwise'){
            positions = (data.coordinates[index].concat(heights[index]))
            .concat(data.coordinates[index].concat(heights[index+1]));
          }
          else{
            positions =
            (data.coordinates[index].concat(heights[index]))
            .concat(data.coordinates[index+1].concat(heights[index+1]));
          }

        }

        instances.push(Stinuum.drawInstanceOneLine(positions, color));
      }

    }
  }


  var prim = new Cesium.Primitive({
    geometryInstances: instances,
    appearance: new Cesium.PolylineColorAppearance(),
    allowPicking : true
  });
  prim.id = options.id;
  return prim;

}

Stinuum.PathDrawing.prototype.drawPathMovingPolygon = function(options){
  var geometry = options.temporalGeometry;
  var property = options.temporalProperty;

  var coordinates = geometry.coordinates;
  var datetimes = geometry.datetimes;

  var pro_min_max = null;
  if (property != undefined){
    pro_min_max = Stinuum.findMinMaxProperties(property);
  }

  var geoInstance;
  var surface = [];
  var typhoon;

  var heights = this.supersuper.getListOfHeight(datetimes);

  var color = this.supersuper.mfCollection.getColor(options.id).withAlpha(0.6);

  if (geometry.interpolations[0] == 'Discrete'){
    return this.drawMovingPolygon(options);
  }

  if (geometry.interpolations[0] == 'Stepwise' && this.supersuper.mode == 'STATICMAP'){
    return this.drawMovingPoint(options);
  }

  if (this.supersuper.mode == 'STATICMAP' || this.supersuper.mode == 'ANIMATEDMAP'){
    color = this.supersuper.mfCollection.getColor(options.id).withAlpha(0.2);
  }

  for (var i = 0; i < coordinates.length - 1; i++) {
    var io = 0;
    for (var j = 0; j < coordinates[i][io].length - 1 ; j++) {
      var temp_poly = new Array();
      var temp_point = new Array();
      var first = coordinates[i][io][j];
      var sec = coordinates[i + 1][io][j];
      var third = coordinates[i + 1][io][j + 1];
      var forth = coordinates[i][io][j + 1];

      if (property != undefined){
        var middle_value = (property.values[i] + property.values[i+1]) / 2;
        var blue_rate = (middle_value - pro_min_max.value[0]) / (pro_min_max.value[1] - pro_min_max.value[0]);
        if (blue_rate < 0.2){
          blue_rate = 0.2;
        }
        if (blue_rate > 0.9){
          blue_rate = 0.9;
        }

        color = new Cesium.Color(1.0 , 1.0 - blue_rate , 0 , blue_rate);
      }

      if (this.supersuper.mode == 'SPACETIME'){
        if (geometry.interpolations[0] == 'Stepwise'){
          temp_poly.push([first[0], first[1], heights[i]], [first[0], first[1], heights[i+1]],[forth[0], forth[1], heights[i+1]], [forth[0], forth[1], heights[i]]);
        }
        else{
          temp_poly.push([first[0], first[1], heights[i]], [sec[0], sec[1], heights[i+1]],[third[0], third[1], heights[i+1]], [forth[0], forth[1], heights[i]]);
        }

      }else{
        temp_poly.push([first[0], first[1], 0], [sec[0], sec[1], 0], [third[0], third[1], 0], [forth[0], forth[1], 0]);
      }

      geoInstance = Stinuum.drawOnePolygon(temp_poly, null, this.supersuper.mode == 'SPACETIME', color);

      surface.push(geoInstance);
    }

  }

  var typhoon = new Cesium.Primitive({
    geometryInstances: surface,
    appearance: new Cesium.PerInstanceColorAppearance()
  });

  typhoon.id = options.id;
  return typhoon;

}

Stinuum.PathDrawing.prototype.drawPathMovingLineString = function(options){
  return 0;
  //TODO
  // var trianlgeCollection = new Cesium.PrimitiveCollection();
  //
  // var data = options.temporalGeometry;
  // var property = options.temporalProperty;
  //
  // var pro_min_max = null;
  // if (property != undefined){
  //   pro_min_max = Stinuum.findMinMaxProperties(property);
  // }
  //
  // var color = this.supersuper.mfCollection.getColor(options.id).withAlpha(0.7);
  //
  // var heights = this.supersuper.getListOfHeight(data.datetimes);
  //
  // var coord_arr = data.coordinates;
  // for (var i = 0; i < coord_arr.length ; i++){
  //
  //   if (i == 0){
  //     pre_polyline = coord_arr[0];
  //     continue;
  //   }
  //
  //   if (property != undefined){
  //     var middle_value = (property.values[i] + property.values[i+1]) / 2;
  //     var blue_rate = (middle_value - pro_min_max.value[0]) / (pro_min_max.value[1] - pro_min_max.value[0]);
  //     if (blue_rate < 0.2){
  //       blue_rate = 0.2;
  //     }
  //     if (blue_rate > 0.9){
  //       blue_rate = 0.9;
  //     }
  //
  //     color = new Cesium.Color(1.0 , 1.0 - blue_rate , 0 , blue_rate);
  //   }
  //
  //   trianlgeCollection.add(this.drawTrinaglesWithNextPos(pre_polyline, coord_arr[i], heights[i-1], heights[i], color));
  //
  //   pre_polyline = coord_arr[i];
  // }
  //
  // return trianlgeCollection;
}

Stinuum.PathDrawing.prototype.drawTrinaglesWithNextPos = function(line_1, line_2, height1, height2, color){
  var instances = [];
  var i=0,
  j=0;

  var with_height = (this.supersuper.mode == 'SPACETIME');

  while ( i < line_1.length - 1 && j < line_2.length - 1){
    var new_color;
    if (color == undefined){
      new_color = Cesium.Color.fromRandom({
        minimumRed : 0.8,
        minimumBlue : 0.8,
        minimumGreen : 0.8,
        alpha : 0.4
      });
    }
    else{
      new_color = color;
    }

    var positions = [];
    var point_1 = line_1[i];
    var point_2 = line_2[j];

    var next_point_1 = line_1[i+1];
    var next_point_2 = line_2[j+1];

    point_1.push(height1);
    positions.push(point_1);
    point_2.push(height2);
    positions.push(point_2);

    var dist1 = Stinuum.euclidianDistance2D(point_1, next_point_2);
    var dist2 = Stinuum.euclidianDistance2D(point_2, next_point_1);

    if (dist1 > dist2){
      next_point_1.push(height1);
      positions.push(next_point_1);
      i++;
    }
    else{
      next_point_2.push(height2);
      positions.push(next_point_2);
      j++;
    }
    instances.push(Stinuum.drawOnePolygon(positions,null,with_height,new_color));
  }

  while (i < line_1.length - 1 || j < line_2.length - 1){
    var new_color;
    if (color == undefined){
      new_color = Cesium.Color.fromRandom({
        minimumRed : 0.6,
        minimumBlue : 0.0,
        minimumGreen : 0.0,
        alpha : 0.4
      });
    }
    else{
      new_color = color;
    }

    var positions = [];
    var point_1 = line_1[i];
    var point_2 = line_2[j];

    point_1.push(height1);
    positions.push(point_1);
    point_2.push(height2);
    positions.push(point_2);


    if (i == line_1.length - 1){
      var next_point = line_2[j+1];
      next_point.push(height2);
      positions.push(next_point);
      j++;
    }
    else if (j == line_2.length - 1){
      var next_point = line_1[i+1];
      next_point.push(height1);
      positions.push(next_point);
      i++;
    }
    else {
      alert("error");
    }
    instances.push(Stinuum.drawOnePolygon(positions,null,with_height,new_color));
  }

  var temp = new Cesium.Primitive({
    geometryInstances : instances,
    appearance : new Cesium.PerInstanceColorAppearance({   }),
    show : true
  });


  return temp;

}


Stinuum.makeDegreesArray = function(pos_2d, height){
  var points = [];
  for (var i = 0; i < pos_2d.length; i++) {
    if (Array.isArray(height)){
      points.push(pos_2d[i][0], pos_2d[i][1], height[i]);
    }
    else{
      points.push(pos_2d[i][0], pos_2d[i][1], height);
    }
  }
  return points;
}

Stinuum.drawInstanceOneLine = function(positions, r_color, width = 5){
  var carte = Cesium.Cartesian3.fromDegreesArrayHeights(positions);
  var polyline =  new Cesium.PolylineGeometry({
    positions : carte,
    width : width
  });

  var geoInstance = new Cesium.GeometryInstance({
    geometry : Cesium.PolylineGeometry.createGeometry(polyline),
    attributes : {
      color : Cesium.ColorGeometryInstanceAttribute.fromColor(r_color)
    }
  });

  return geoInstance;
}

Stinuum.drawOneLine = function(positions, r_color, width = 5){
  var material = new Cesium.Material.fromType('Color');
  material.uniforms.color = r_color;

  var line = {
    positions :  Cesium.Cartesian3.fromDegreesArrayHeights(positions) ,
    width : width,
    material : material
  };

  return line;
}

Stinuum.drawOnePoint = function(onePoint,height,r_color){ //it gets one point
  var pointInstance = new Cesium.PointPrimitive();
  var position = Cesium.Cartesian3.fromDegrees(onePoint[0],onePoint[1],height);;
  pointInstance.position = position;
  pointInstance.color = r_color;
  pointInstance.pixelSize = 6.0;
  return pointInstance;
}

Stinuum.drawOnePolygon = function(onePolygon, height, with_height, r_color ) { //it gets one polygon
  var coordinates = onePolygon;
  var points = [];

  var position;
  if (!with_height){
    height = 0;
    for (var i = 0; i < coordinates.length; i++) {
      points.push(coordinates[i][0]);
      points.push(coordinates[i][1]);
      points.push(height);
    }
  }
  else{
    if (height == null){
      for (var i = 0; i < coordinates.length; i++) {
        points.push(coordinates[i][0]);
        points.push(coordinates[i][1]);
        points.push(coordinates[i][2]);
      }
    }
    else{
      for (var i = 0; i < coordinates.length; i++) {
        points.push(coordinates[i][0]);
        points.push(coordinates[i][1]);
        points.push(height);
      }
    }
  }

  position = Cesium.Cartesian3.fromDegreesArrayHeights(points);

  var polygonHierarchy = new Cesium.PolygonHierarchy(position);

  var vertexF = new Cesium.VertexFormat({
    position : true,
    st : false,
    normal : true,
    color : true
  });

  var geometry = new Cesium.PolygonGeometry({
    polygonHierarchy : polygonHierarchy,
    vertexFormat : vertexF,
    perPositionHeight : true
  });

  var geoInstance = new Cesium.GeometryInstance({
    geometry : geometry,
    attributes : {
      color : Cesium.ColorGeometryInstanceAttribute.fromColor(r_color)
    }
  });
  return geoInstance;
}

Stinuum.euclidianDistance2D = function(a, b) {
  var pow1 = Math.pow(a[0] - b[0], 2);
  var pow2 = Math.pow(a[1] - b[1], 2);
  return Math.sqrt(pow1 + pow2);
}

Stinuum.euclidianDistance3D = function(a, b) {
  var pow1 = Math.pow(a[0] - b[0], 2);
  var pow2 = Math.pow(a[1] - b[1], 2);
  var pow3 = Math.pow(a[2] - b[2], 2);
  return Math.sqrt(pow1 + pow2 + pow3);
}

Stinuum.drawOneCube = function(positions, rating = 1.0){
  var red_rate = 1.0, green_rate = 1.9 - rating * 1.9;
  var blue_rate = 0.0;

  if (green_rate > 1.0){
    green_rate = 1.0;
  }
  var alpha = rating + 0.1;
  if (alpha > 1.0) alpha = 1.0;
  var rating_color = new Cesium.Color(
    red_rate,
    green_rate,
    blue_rate,
    alpha
  );

  var size = Stinuum.calcSidesBoxCoord(positions);

  var geometry = Cesium.BoxGeometry.fromDimensions({
    vertexFormat : Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
    dimensions :  new Cesium.Cartesian3( size[0], size[1], size[2] )
  });

  var position = Cesium.Cartesian3.fromDegrees( (positions.minimum.x + positions.maximum.x) / 2, (positions.maximum.y + positions.minimum.y) /2 , (positions.minimum.z + positions.maximum.z) / 2);

  var point3d = new Cesium.Cartesian3( 0.0, 0.0, 0.0 );
  var translation = Cesium.Transforms.eastNorthUpToFixedFrame( position );
  var matrix = Cesium.Matrix4.multiplyByTranslation( translation, point3d, new Cesium.Matrix4() );

  var geo_instance = new Cesium.GeometryInstance({
    geometry : geometry,
    modelMatrix : matrix,
    attributes : {
      color : Cesium.ColorGeometryInstanceAttribute.fromColor(rating_color)
    }

  } );

  return new Cesium.Primitive({
    geometryInstances : geo_instance,
    appearance : new Cesium.PerInstanceColorAppearance({
      translucent : true
    }),
    show : true
  });

}

Stinuum.calcSidesBoxCoord = function(box_coord){
  var x_dist = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.minimum.z), Cesium.Cartesian3.fromDegrees(box_coord.maximum.x, box_coord.minimum.y, box_coord.minimum.z));
  var y_dist = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.minimum.z), Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.maximum.y, box_coord.minimum.z));
  var z_dist = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.minimum.z), Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.maximum.z));

  return [x_dist, y_dist, z_dist];
}
