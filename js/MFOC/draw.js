var LOG = console.log;



MFOC.prototype.drawMovingLineString = function(geometry, name){
  var polylineCollection = new Cesium.PolylineCollection();

  var r_color = this.getColor(name);


  var data = geometry;
  var heights = this.getListOfHeight(data.datetimes);


  for (var j = 0 ; j < data.coordinates.length ; j++){
    if (this.mode == '2D'){
      heights[j] = 0;
    }
    var positions = MFOC.makeDegreesArray(data.coordinates[j], heights[j]);
    polylineCollection.add(MFOC.drawOneLine(positions, r_color));
  }

  return polylineCollection;
}

MFOC.makeDegreesArray = function(pos_2d, height){
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

MFOC.drawInstanceOneLine = function(positions, r_color, width = 5){
  var carte = Cesium.Cartesian3.fromDegreesArrayHeights(positions);
  //console.log(positions,carte);
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

MFOC.drawOneLine = function(positions, r_color, width = 5){
  var material = new Cesium.Material.fromType('Color');
  material.uniforms.color = r_color;

  var line = {
    positions :  Cesium.Cartesian3.fromDegreesArrayHeights(positions) ,
    width : width,
    material : material
  };

  return line;
}

MFOC.prototype.drawMovingPoint = function(geometry, name){
  var pointCollection = new Cesium.PointPrimitiveCollection();

  var r_color = this.getColor(name);

  var data = geometry.coordinates;
  if(this.mode == '3D'){
    var heights = this.getListOfHeight(geometry.datetimes);
    for(var i = 0 ; i < data.length ; i++ ){
      pointCollection.add(MFOC.drawOnePoint(data[i], heights[i], r_color));
    }
  }
  else{
    for(var i = 0 ; i < data.length ; i++ ){
      pointCollection.add(MFOC.drawOnePoint(data[i], 0, r_color));
    }
  }

  return pointCollection;
}

MFOC.drawOnePoint = function(onePoint,height,r_color){ //it gets one point
  var pointInstance = new Cesium.PointPrimitive();
  var position = Cesium.Cartesian3.fromDegrees(onePoint[0],onePoint[1],height);;
  pointInstance.position = position;
  pointInstance.color = r_color;
  return pointInstance;
}

MFOC.prototype.drawMovingPolygon = function(geometry,color){

  var r_color = this.getColor(name);

  var min_max_date = this.min_max.date;
  var coordinates = geometry.coordinates;
  var datetimes = geometry.datetimes;

  var prim;
  var poly_list = new Array();
  var heights = null;

  var with_height = false;
  if (this.mode == '3D'){
    with_height = true;
    heights = this.getListOfHeight(datetimes);
  }

  for (var i = 0; i < coordinates.length; i++) {
    var height = heights[i];
    if (!with_height){
      height = 0;
    }
    poly_list.push(MFOC.drawOnePolygon(coordinates[i], height, with_height , r_color));
  }


  prim = new Cesium.Primitive({
    geometryInstances: poly_list,
    appearance: new Cesium.PerInstanceColorAppearance({})
  });

  return prim;
}

MFOC.drawOnePolygon = function(onePolygon, height, with_height, r_color ) { //it gets one polygon
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

MFOC.prototype.drawPathMovingPoint = function(options){
  var instances = [];

  var color = this.getColor(options.name);

  var data = options.temporalGeometry;
  var property = options.temporalProperty;
  var heights = 0;
  if (this.mode == '3D'){
    heights = this.getListOfHeight(data.datetimes, this.min_max.date);
  }
  var pro_min_max = null;
  if (property != undefined){
    pro_min_max = MFOC.findMinMaxProperties(property);
  }

  if (property == undefined){
    var positions = MFOC.makeDegreesArray(data.coordinates, heights);

    instances.push(MFOC.drawInstanceOneLine(positions, color));
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
      if (this.mode == '2D'){
        positions =
        (data.coordinates[index].concat([0]))
        .concat(data.coordinates[index+1].concat([0]));
      }
      else {
        positions =
        (data.coordinates[index].concat(heights[index]))
        .concat(data.coordinates[index+1].concat(heights[index+1]));
      }

      instances.push(MFOC.drawInstanceOneLine(positions, color));
    }

  }

  var prim = new Cesium.Primitive({
    geometryInstances: instances,
    appearance: new Cesium.PolylineColorAppearance(),
    allowPicking : true
  });
  prim.name = options.name;
  return prim;

}

MFOC.prototype.drawPathMovingPolygon = function(options){
  var geometry = options.temporalGeometry;
  var property = options.temporalProperty;

  var coordinates = geometry.coordinates;
  var datetimes = geometry.datetimes;

  var pro_min_max = null;
  if (property != undefined){
    pro_min_max = MFOC.findMinMaxProperties(property);
  }

  var geoInstance;
  var surface = [];
  var typhoon;

  var heights = this.getListOfHeight(datetimes);


  var color = this.getColor(options.name).withAlpha(0.6);

  if (this.mode == '2D'){
    color = this.getColor(options.name).withAlpha(0.2);
  }
  for (var i = 0; i < coordinates.length - 1; i++) {
    for (var j = 0; j < coordinates[i].length - 1 ; j++) {
      var temp_poly = new Array();
      var temp_point = new Array();
      var first = coordinates[i][j];
      var sec = coordinates[i + 1][j];
      var third = coordinates[i + 1][j + 1];
      var forth = coordinates[i][j + 1];

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

      if (this.mode == '3D'){
        temp_poly.push([first[0], first[1], heights[i]], [sec[0], sec[1], heights[i+1]],
          [third[0], third[1], heights[i+1]], [forth[0], forth[1], heights[i]]);
      }
      else{
        temp_poly.push([first[0], first[1], 0], [sec[0], sec[1], 0],
            [third[0], third[1], 0], [forth[0], forth[1], 0]);
      }

      geoInstance = MFOC.drawOnePolygon(temp_poly, null, this.mode == '3D', color);
      surface.push(geoInstance);
    }
  }
  var typhoon = new Cesium.Primitive({
    geometryInstances: surface,
    appearance: new Cesium.PerInstanceColorAppearance()
  });

  typhoon.name = options.name;
  return typhoon;

}

MFOC.prototype.drawPathMovingLineString = function(options){
  var trianlgeCollection = new Cesium.PrimitiveCollection();

  var data = options.temporalGeometry;
  var property = options.temporalProperty;

  var pro_min_max = null;
  if (property != undefined){
    pro_min_max = MFOC.findMinMaxProperties(property);
  }

  var color = this.getColor(options.name).withAlpha(0.7);

  //;

  var heights = this.getListOfHeight(data.datetimes);

  var coord_arr = data.coordinates;
  for (var i = 0; i < coord_arr.length ; i++){

    if (i == 0){
      pre_polyline = coord_arr[0];
      continue;
    }

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

    trianlgeCollection.add(this.drawTrinaglesWithNextPos(pre_polyline, coord_arr[i], heights[i-1], heights[i], color));

    pre_polyline = coord_arr[i];
  }

  return trianlgeCollection;
}


MFOC.prototype.drawTrinaglesWithNextPos = function(line_1, line_2, height1, height2, color){
  var instances = [];
  var i=0,
  j=0;

  var with_height = (this.mode == '3D');

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

    var dist1 = MFOC.euclidianDistance2D(point_1, next_point_2);
    var dist2 = MFOC.euclidianDistance2D(point_2, next_point_1);

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
    instances.push(MFOC.drawOnePolygon(positions,null,with_height,new_color));
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
    instances.push(MFOC.drawOnePolygon(positions,null,with_height,new_color));
  }

  var temp = new Cesium.Primitive({
    geometryInstances : instances,
    appearance : new Cesium.PerInstanceColorAppearance({   }),
    show : true
  });


  return temp;

}

MFOC.euclidianDistance2D = function(a, b) {
  var pow1 = Math.pow(a[0] - b[0], 2);
  var pow2 = Math.pow(a[1] - b[1], 2);
  return Math.sqrt(pow1 + pow2);
}

MFOC.euclidianDistance3D = function(a, b) {
  var pow1 = Math.pow(a[0] - b[0], 2);
  var pow2 = Math.pow(a[1] - b[1], 2);
  var pow3 = Math.pow(a[2] - b[2], 2);
  return Math.sqrt(pow1 + pow2 + pow3);
}


MFOC.drawOneCube = function(positions, rating = 1.0){
  var red_rate = 1.0, green_rate = 1.9 - rating * 1.9;
  var blue_rate = 0.0;

  if (green_rate > 1.0){
    green_rate = 1.0;
  }
  var alpha = rating + 0.4;
  if (alpha > 1.0) alpha = 1.0;
  var rating_color = new Cesium.Color(
    red_rate,
    green_rate,
    blue_rate,
    alpha
  );

  var size = MFOC.calcSidesBoxCoord(positions);

  var geometry = Cesium.BoxGeometry.fromDimensions({
    vertexFormat : Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
    dimensions :  new Cesium.Cartesian3( size[0], size[1], size[2] )
  });
  //console.log(positions, geometry);
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

MFOC.calcSidesBoxCoord = function(box_coord){
  var x_dist = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.minimum.z), Cesium.Cartesian3.fromDegrees(box_coord.maximum.x, box_coord.minimum.y, box_coord.minimum.z));
  var y_dist = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.minimum.z), Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.maximum.y, box_coord.minimum.z));
  var z_dist = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.minimum.z), Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.maximum.z));

  return [x_dist, y_dist, z_dist];
}


MFOC.prototype.drawZaxis = function(){
  var polylineCollection = new Cesium.PolylineCollection();
  var positions = [179,89,0,179,89,this.max_height];

  polylineCollection.add(MFOC.drawOneLine(positions,Cesium.Color.WHITE));
  polylineCollection.add(MFOC.drawOneLine([178,88,this.max_height*0.95,179,89,this.max_height,179.9,89.9,this.max_height*0.95],Cesium.Color.WHITE));

  for (var height = 10 ; height < 100 ; height += 20){
    for (var long = -179 ; long < 179 ; long += 10){
      polylineCollection.add(MFOC.drawOneLine([long,88,this.max_height * height / 100,long+5,89,this.max_height/100 * height],Cesium.Color.WHITE, 1));
    }
    for (var lat = -89 ; lat < 89 ; lat += 10){
      polylineCollection.add(MFOC.drawOneLine([179,lat,this.max_height * height / 100,179,lat+5,this.max_height/100 * height],Cesium.Color.WHITE, 1));
    }
  }


  return polylineCollection;
}

MFOC.prototype.drawZaxisLabel = function(){
  var label = {
    position : Cesium.Cartesian3.fromDegrees(178, 88, this.max_height/2 + 50000),
    label : {
      text : 'time',
      font : '15pt monospace',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth : 2,
      verticalOrigin : Cesium.VerticalOrigin.TOP,
      pixelOffsetScaleByDistance : new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e7, 0.1)
    }
  };
  return label;
}


MFOC.prototype.showProjection = function(name){
  if (this.projection != null){
    if (!this.projection.isDestroyed()){
      this.primitives.remove(this.projection);
    }
    this.projection = null;
  }

  var mf = this.getFeatureByName(name);
  var color = this.getColor(name);

  var geometry = mf.temporalGeometry;
  var instances = [];
  var time_label = [];
  //upper
  var upper_pos = [];
  var right_pos = [];

  var heights = this.getListOfHeight(geometry.datetimes);

  for (var index = 0 ; index < geometry.coordinates.length ; index++){
    var xy;
    if (geometry.type != 'MovingPoint'){
      xy = MFOC.getCenter(geometry.coordinates[index], geometry.type);
    }
    else{
      xy = geometry.coordinates[index];
    }
    upper_pos = upper_pos.concat([xy[0], 89, heights[index]]);
    right_pos = right_pos.concat([179, xy[1], heights[index]]);
  }

  instances.push(MFOC.drawInstanceOneLine(upper_pos, color.withAlpha(1.0)));
  instances.push(MFOC.drawInstanceOneLine(right_pos, color.withAlpha(1.0)));

  for (var index = 0 ; index < 2 ; index++){
    var i = index * (geometry.coordinates.length-1);
    var xy;
    if (geometry.type != 'MovingPoint'){
      xy = MFOC.getCenter(geometry.coordinates[i], geometry.type);
    }
    else{
      xy = geometry.coordinates[i];
    }
    var h = heights[i];
    for (var j = xy[1] ; j < 87.4 ; j += 2.5){
      instances.push(MFOC.drawInstanceOneLine([xy[0], j, h, xy[0], j+1.25, h], Cesium.Color.WHITE.withAlpha(0.5)));
    }
    for (var j = xy[0] ; j < 177.4 ; j += 2.5){
      instances.push(MFOC.drawInstanceOneLine([j, xy[1], h, j+1.25, xy[1], h], Cesium.Color.WHITE.withAlpha(0.5)));
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
