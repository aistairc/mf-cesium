var LOG = console.log;

function Stinuum(viewer){
    this.cesiumViewer = viewer;
    this.mode = 'STATICMAP';
    this.maxHeight = 30000000;

    this.geometryViewer = new Stinuum.GeometryViewer(this);
    this.mfCollection = new Stinuum.MFCollection(this);
    this.directionRadar = new Stinuum.DirectionRadar(this);
    this.temporalMap = new Stinuum.TemporalMap(this);
    this.occurrenceMap = new Stinuum.OccurrenceMap(this);
    this.propertyGraph = new Stinuum.PropertyGraph(this);

}

Stinuum.MFPair = function(id, feature){
  this.id = id;
  this.feature = feature;
}

Stinuum.OccurrenceMap = function(stinuum){
  this.super = stinuum;
  this.max_num = 0;
  this.primitive = null;
}


Stinuum.MFCollection = function(stinuum){
    this.super = stinuum;
    this.features = [];
    this.hiddenFeatures = [];
    this.colorCollection = {};
    this.min_max = {};
    this.whole_min_max = {};
}

Stinuum.PathDrawing = function(g_viewer){
  this.g_viewer = g_viewer;
  this.supersuper = g_viewer.super;
}

Stinuum.MovementDrawing = function(g_viewer){
  this.g_viewer = g_viewer;
  this.supersuper = g_viewer.super;
}

Stinuum.GeometryViewer = function(stinuum){
  this.super = stinuum;
  this.primitives = {};
  this.drawing = new Stinuum.PathDrawing(this);
  this.moving = new Stinuum.MovementDrawing(this);
  this.projection = null;
  this.time_label = [];
  this.label_timeout = undefined;
}

Stinuum.TemporalMap = function(stinuum){
    this.super = stinuum;
    this.temp_primitive = {};
}


Stinuum.DirectionRadar = function(stinuum){
    this.super = stinuum;
}


Stinuum.PropertyGraph = function(stinuum){
    this.super = stinuum;
    this.graph_id;
}


Stinuum.BoxCoord = function(){
  this.minimum = {};
  this.maximum = {};
};

Stinuum.SpatialInfo = function(){
  this.west = new Stinuum.DirectionInfo();
  this.east = new Stinuum.DirectionInfo();
  this.north = new Stinuum.DirectionInfo();
  this.south = new Stinuum.DirectionInfo();
}

Stinuum.DirectionInfo =function(life=0, leng=0){
  this.total_life = life;
  this.total_length = leng;
}

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
    return this.drawMovingPolygon(options);
  }

  if (this.supersuper.mode == 'STATICMAP'){
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
  var surface_primitive;

  var heights = this.supersuper.getListOfHeight(datetimes);

  var color = this.supersuper.mfCollection.getColor(options.id).withAlpha(0.6);

  if (geometry.interpolations[0] == 'Discrete'){
    return this.drawMovingLineString(options);
  }

  if (geometry.interpolations[0] == 'Stepwise' && this.supersuper.mode == 'STATICMAP'){
    return this.drawMovingLineString(options);
  }

  if (this.supersuper.mode == 'STATICMAP'){
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

  var surface_primitive = new Cesium.Primitive({
    geometryInstances: surface,
    appearance: new Cesium.PerInstanceColorAppearance()
  });

  surface_primitive.id = options.id;
  return surface_primitive;

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

/*

// Stinuum.PathDrawing.prototype.drawPathMovingLineString = function(options){
//
//   var trianlgeCollection = new Cesium.PrimitiveCollection();
//
//   var data = options.temporalGeometry;
//   var property = options.temporalProperty;
//
//   var pro_min_max = null;
//   if (property != undefined){
//     pro_min_max = Stinuum.findMinMaxProperties(property);
//   }
//
//   var color = this.supersuper.mfCollection.getColor(options.id).withAlpha(0.7);
//
//   var heights = this.supersuper.getListOfHeight(data.datetimes);
//
//   var coord_arr = data.coordinates;
//   for (var i = 0; i < coord_arr.length ; i++){
//
//     if (i == 0){
//       pre_polyline = coord_arr[0];
//       continue;
//     }
//
//     if (property != undefined){
//       var middle_value = (property.values[i] + property.values[i+1]) / 2;
//       var blue_rate = (middle_value - pro_min_max.value[0]) / (pro_min_max.value[1] - pro_min_max.value[0]);
//       if (blue_rate < 0.2){
//         blue_rate = 0.2;
//       }
//       if (blue_rate > 0.9){
//         blue_rate = 0.9;
//       }
//
//       color = new Cesium.Color(1.0 , 1.0 - blue_rate , 0 , blue_rate);
//     }
//
//     trianlgeCollection.add(this.drawTrinaglesWithNextPos(pre_polyline, coord_arr[i], heights[i-1], heights[i], color));
//
//     pre_polyline = coord_arr[i];
//   }
//
//   return trianlgeCollection;
// }

// Stinuum.PathDrawing.prototype.drawTrinaglesWithNextPos = function(line_1, line_2, height1, height2, color){
//   var instances = [];
//   var i=0,
//   j=0;
//
//   var with_height = (this.supersuper.mode == 'SPACETIME');
//
//   while ( i < line_1.length - 1 && j < line_2.length - 1){
//     var new_color;
//     if (color == undefined){
//       new_color = Cesium.Color.fromRandom({
//         minimumRed : 0.8,
//         minimumBlue : 0.8,
//         minimumGreen : 0.8,
//         alpha : 0.4
//       });
//     }
//     else{
//       new_color = color;
//     }
//
//     var positions = [];
//     var point_1 = line_1[i];
//     var point_2 = line_2[j];
//
//     var next_point_1 = line_1[i+1];
//     var next_point_2 = line_2[j+1];
//
//     point_1.push(height1);
//     positions.push(point_1);
//     point_2.push(height2);
//     positions.push(point_2);
//
//     var dist1 = Stinuum.euclidianDistance2D(point_1, next_point_2);
//     var dist2 = Stinuum.euclidianDistance2D(point_2, next_point_1);
//
//     if (dist1 > dist2){
//       next_point_1.push(height1);
//       positions.push(next_point_1);
//       i++;
//     }
//     else{
//       next_point_2.push(height2);
//       positions.push(next_point_2);
//       j++;
//     }
//     instances.push(Stinuum.drawOnePolygon(positions,null,with_height,new_color));
//   }
//
//   while (i < line_1.length - 1 || j < line_2.length - 1){
//     var new_color;
//     if (color == undefined){
//       new_color = Cesium.Color.fromRandom({
//         minimumRed : 0.6,
//         minimumBlue : 0.0,
//         minimumGreen : 0.0,
//         alpha : 0.4
//       });
//     }
//     else{
//       new_color = color;
//     }
//
//     var positions = [];
//     var point_1 = line_1[i];
//     var point_2 = line_2[j];
//
//     point_1.push(height1);
//     positions.push(point_1);
//     point_2.push(height2);
//     positions.push(point_2);
//
//
//     if (i == line_1.length - 1){
//       var next_point = line_2[j+1];
//       next_point.push(height2);
//       positions.push(next_point);
//       j++;
//     }
//     else if (j == line_2.length - 1){
//       var next_point = line_1[i+1];
//       next_point.push(height1);
//       positions.push(next_point);
//       i++;
//     }
//     else {
//       alert("error");
//     }
//     instances.push(Stinuum.drawOnePolygon(positions,null,with_height,new_color));
//   }
//
//   var temp = new Cesium.Primitive({
//     geometryInstances : instances,
//     appearance : new Cesium.PerInstanceColorAppearance({   }),
//     show : true
//   });
//
//
//   return temp;
//
// }

*/
Stinuum.GeometryViewer.prototype.update = function(options){
  this.clear();
  this.super.mfCollection.findMinMaxGeometry();
  this.draw();
  this.animate(options);
  this.adjustCameraView();
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
    console.log(this.bounding_sphere);
  for (var index = 0 ; index < mf_arr.length ; index++){
    var mf = mf_arr[index];
    var path_prim, primitive;

    if (mf.feature.temporalGeometry.type == "MovingPoint"){
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
  this.adjustCameraView();
  //return 0;
  this.super.cesiumViewer.camera.flyTo({    destination : this.super.cesiumViewer.camera.position  });
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
        mf_arr.push(this.super.mfCollection.getFeatureById(id_arr[i]));
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
    if (options.change != undefined){
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
    "name" : "polygon_highlight",
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

  polylineCollection.add(Stinuum.drawOneLine(positions,Cesium.Color.WHITE));
  polylineCollection.add(Stinuum.drawOneLine([178,88,this.super.maxHeight*0.95,179,89,this.super.maxHeight,179.9,89.9,this.super.maxHeight*0.95],Cesium.Color.WHITE));

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

  var mf = this.super.mfCollection.getFeatureById(id).feature;
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
  var mf = this.super.mfCollection.getFeatureById(id).feature;
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
  //
  var bounding = this.bounding_sphere;
  var viewer = this.viewer;
  var geomview = this;
  if (bounding == undefined || bounding == -1){
    return;
  }


  setTimeout(function(){
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
  }, 300);

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

Stinuum.PropertyGraph.prototype.show = function(propertyName, divID){
  var pro_arr = [];
  for (var i = 0 ; i < this.super.mfCollection.features.length ; i ++){
    var pair = this.super.mfCollection.features[i];
    var property = Stinuum.getPropertyByName(pair.feature, propertyName, pair.id);
    if (property != -1){
      pro_arr.push(property);
    }
  }
  // if (pro_arr.length == 0){
  //   return -1;
  // }

  this.showPropertyArray(propertyName, pro_arr, divID);
}

Stinuum.PropertyGraph.prototype.showPropertyArray = function(propertyName, array, div_id){


  document.getElementById(div_id).innerHTML = '';

  //if put empty array.
  if (array == undefined || array.length == 0){
    return;
  }


  var name_arr = [];
  var object_arr = [];
  var propertyGraph = this;

  for (var i = 0 ; i < array.length ; i++){
    object_arr.push(array[i][0]);
    name_arr.push(array[i][1]);
  }

  var min_max = Stinuum.findMinMaxProperties(object_arr);

  var svg = d3.select("#"+div_id).append("svg");
  svg.attr("width",$("#"+div_id).width());
  svg.attr("height",$("#"+div_id).height());

  var margin = {top: 10, right: 20, bottom: 30, left: 50},
  width = $("#"+div_id).width() - margin.left - margin.right,
  height = $("#"+div_id).height() - margin.top - margin.bottom;


  var g = svg.append("g")
        .attr("transform", "translate("+ margin.left +"," + margin.top + " )")
        .attr("width", width)
        .attr("height", height);
//        .style("font-size","small");

  var x = d3.scaleTime()
  .rangeRound([0, width]);
  var y = d3.scaleLinear()
  .rangeRound([height, 0]);

  var line = d3.line()
  .x(function(d) { return x(d.date)})
  .y(function(d) { return y(d.value)});


  x.domain(min_max.date);
  y.domain(min_max.value);

  g.append("g")
  .attr("transform" , "translate(0,"+height+")")
  .attr("class","axis")
//  .style("font-size","small")
  .call(d3.axisBottom(x))
  .select(".domain")
  .remove();


  if (object_arr[0].uom == "null"){
    var y_axis = g.append("g");
    y_axis
    .attr("class","axis")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", '#000')
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    //.text(object_arr[0].uom)  ;
  }
//   else if(object_arr[0].name == undefined){
//     var y_axis = g.append("g");
//     y_axis
//     .attr("class","axis")
//     .call(d3.axisLeft(y))
//     .append("text")
//     .attr("fill", '#000')
//     .attr("transform", "rotate(-90)")
// //    .style("font-size","small")
//     .attr("y", 6)
//     .attr("dy", "0.71em")
//     .attr("text-anchor", "end")
//     .text(object_arr[0].uom)  ;
//   }
  else{
    var y_axis = g.append("g");
    y_axis
    .attr("class","axis")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", '#000')
    .attr("transform", "rotate(-90)")
//    .style("font-size","small")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text(propertyName+"("+object_arr[0].uom+")")  ;
  }
  console.log(object_arr);


  var graph_data = [];
  for (var id = 0 ; id < object_arr.length ; id++){
    var data = [];
    var object = object_arr[id];
    for (var i = 0 ; i < object.datetimes.length ; i++){
      var comp = {};
      var da = new Date(object.datetimes[i]).toISOString();

      comp.date = new Date(object.datetimes[i]);//dateparse(da);
      comp.value = object.values[i];

      data.push(comp);
    }

    if (object.interpolations == 'Spline'){
      line.curve(d3.curveCardinal);
    }
    else if (object.interpolations == 'Stepwise'){
      line.curve(d3.curveStepAfter)
    }

    var color = this.super.mfCollection.getColor(name_arr[id]);
    var r_color = d3.rgb(color.red * 255, color.green * 255, color.blue * 255);

    graph_data.push(data);
    if(object.interpolations == 'Discrete'){
      for (var i = 0 ; i < data.length ; i++){
        g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d,i) { return x(d.date); } )
        .attr("cy", function(d,i) { return y(d.value); } )
        .attr("r", 1)
        .style("fill", r_color);
      }
    }
    else{
      g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", r_color)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 3)
      .attr("d", line);
    }

  }

  var drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
  svg.call(drag);

  var start_coord;
  var rect ;

  function dragstarted(d){
    d3.event.sourceEvent.stopPropagation();
    start_coord = d3.mouse(this);
    rect = svg.append("rect")
      .attr("fill", d3.rgb(0,0,0,0.5));

    if (start_coord[0]-margin.right <= 0){
      return;
    }
    var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");

    viewer.clock.currentTime=Cesium.JulianDate.fromDate(new Date(formatDate(x.invert(start_coord[0]-51.09))));
    viewer.clock.shouldAnimate = false;
    //    console.log(rect);
    //  console.log(start_coord);
    //d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    d3.select(this).classed("dragging", true);
  }

  function dragged(d){
    var coord = d3.mouse(this);

    if (coord[0] > start_coord[0]){
      rect.attr("width", Math.abs(coord[0] - start_coord[0]) );
      rect.attr("height", height + margin.bottom);
      rect.attr("x", start_coord[0]);
    }
    else{
      rect.attr("width", Math.abs(coord[0] - start_coord[0]) );
      rect.attr("height", height + margin.bottom);
      rect.attr("x", coord[0]);
    }


  }

  function dragended(d){
    d3.select(this).classed("dragging", false);
    var end_coord = d3.mouse(this);
    var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");
  //  console.log(end_coord);
    var start_date, end_date;

    if (end_coord[0] > start_coord[0]){
      start_date = formatDate(x.invert(start_coord[0]-51.09));
      end_date =  formatDate(x.invert(end_coord[0]-51.09));
      if (end_coord[0] - start_coord[0] < 100){
        rect.remove();
        return;
      }
    }
    else{
      if (start_coord[0] - end_coord[0] < 100){
        rect.remove();
        return;
      }

      start_date = formatDate(x.invert(end_coord[0]-51.09));
      end_date =  formatDate(x.invert(start_coord[0]-51.09));
    }

    propertyGraph.super.mfCollection.spliceByTime(new Date(start_date), new Date(end_date));
    propertyGraph.super.geometryViewer.update();
    propertyGraph.show(propertyName, div_id);
    rect.remove();
  }



}
Stinuum.MFCollection.prototype.add= function(mf, id){
    if (Array.isArray(mf)){
      for (var i = 0 ; i < mf.length ; i++){
        this.add(mf[i]);
      }
    }
    else{
      if (mf.type != 'MovingFeature'){
        console.log("it is not MovingFeature!!@!@!");
        return -1;
      }
      if (this.inFeaturesIndexOf(mf) != -1 || this.inHiddenIndexOf(mf) != -1){
        console.log("this mf already exist.");
        return -2;
      }
      if (id != undefined && (this.inFeaturesIndexOfById(id) != -1 || this.inHiddenIndexOfById(id) != -1 ) ){
        console.log("this id already exist.");
        return -2;
      }

      if (id == undefined && mf.properties.name == undefined){
        alert("feature has no name!");
        return -1;
      }
      if (id != undefined){
        this.features.push(new Stinuum.MFPair(id, mf));
      }
      else{
        this.features.push(new Stinuum.MFPair(mf.properties.name, mf));
      }
    }
}


Stinuum.MFCollection.prototype.remove= function(mf){
  var index = this.inFeaturesIndexOf(mf);
  if(index === -1){
    index = this.inHiddenIndexOf(mf);
    if (index == -1){
      console.log("this mf is not exist in array", mf);
      return -1;
    }
    else{
      return this.removeByIndexInHidden(index);
    }
  }
  else{
    return this.removeByIndexInFeatures(index);
  }
  return 0;
}

Stinuum.MFCollection.prototype.removeById= function(id){
  var index = this.inFeaturesIndexOfById(id);
  if(index === -1){
    index = this.inHiddenIndexOfById(id);
    if (index == -1){
      return -1;
    }
    else{
      return this.removeByIndexInHidden(index);
    }
  }
  else{
    return this.removeByIndexInFeatures(index);
  }
  return 0;
}

Stinuum.MFCollection.prototype.removeByIndexInFeatures= function(index){
  var remove_pair = this.features.splice(index, 1)[0];

  // var prim = this.super.geometryViewer.primitives[remove_pair[0].id];
  // if (prim != undefined){
  //   this.viewer.scene.primitives.remove(prim);
  //   this.super.geometryViewer.primitives[remove_pair[0].id] = undefined;
  // }

  return remove_pair;
}

Stinuum.MFCollection.prototype.removeByIndexInHidden= function(index){
  var remove_pair = this.hiddenFeatures.splice(index, 1)[0];


  // var prim = this.super.geometryViewer.primitives[remove_pair[0].id];
  // if (prim != undefined){
  //   this.viewer.scene.primitives.remove(prim);
  //   this.super.geometryViewer.primitives[remove_pair[0].id] = undefined;
  // }

  return remove_pair;
}


Stinuum.MFCollection.prototype.inFeaturesIndexOfById= function(id){
  for (var i = 0 ; i < this.features.length ; i++){
    if (this.features[i].id == id){
      return i;
    }
  }
  return -1;
}

Stinuum.MFCollection.prototype.inHiddenIndexOfById= function(id){
  for (var i = 0 ; i < this.features.length ; i++){
    if (this.hiddenFeatures[i].id == id){
      return i;
    }
  }
  return -1;
}

Stinuum.MFCollection.prototype.inFeaturesIndexOf= function(mf){
  for (var i = 0 ; i < this.features.length ; i++){
    if (this.features[i].feature == mf){
      return i;
    }
  }
  return -1;
}

Stinuum.MFCollection.prototype.inHiddenIndexOf= function(mf){
  for (var i = 0 ; i < this.hiddenFeatures.length ; i++){
    if (this.hiddenFeatures[i].feature == mf){
      return i;
    }
  }
  return -1;
}


Stinuum.MFCollection.prototype.refresh = function(){

  for (var i = 0 ; i < this.hiddenFeatures.length ; i++){
    this.features.push(this.hiddenFeatures[i]);
  }

  this.hiddenFeatures = [];

}

Stinuum.MFCollection.prototype.findMinMaxGeometry = function(p_mf_arr){
  var mf_arr;
  if (p_mf_arr == undefined){
    mf_arr = this.features;
  }
  else{
    mf_arr = p_mf_arr;
  }

  if (mf_arr.length == 0){
    return -1;
  }

  var min_max = {};
  min_max.x = [];
  min_max.y = [];
  min_max.z = [];

  min_max.date = [];

  var first_date = new Date(mf_arr[0].feature.temporalGeometry.datetimes[0]);
  min_max.date = [first_date,first_date];

  for (var i = 0 ; i < mf_arr.length ; i++){
    var mf_min_max_coord = {};
    if (mf_arr[i].feature.temporalGeometry.type == "MovingPoint"){
      mf_min_max_coord = Stinuum.findMinMaxCoord(mf_arr[i].feature.temporalGeometry.coordinates);
    }
    else{
      var coord_arr = mf_arr[i].feature.temporalGeometry.coordinates;
      mf_min_max_coord = Stinuum.findMinMaxCoord(coord_arr[0][0]);
      for (var j = 1 ; j < coord_arr.length ; j++){
        mf_min_max_coord = Stinuum.findBiggerCoord(mf_min_max_coord, Stinuum.findMinMaxCoord(coord_arr[j][0]) );
      }
    }

    if (min_max.x.length == 0){
      min_max.x = mf_min_max_coord.x;
      min_max.y = mf_min_max_coord.y;
      min_max.z = mf_min_max_coord.z;
    }
    else{
      var xyz = Stinuum.findBiggerCoord(min_max, mf_min_max_coord);
      min_max.x = xyz.x;
      min_max.y = xyz.y;
      min_max.z = xyz.z;
    }

    var temp_max_min = Stinuum.findMinMaxTime(mf_arr[i].feature.temporalGeometry.datetimes);

    if (temp_max_min[0].getTime() < min_max.date[0].getTime()){
      min_max.date[0] = temp_max_min[0];
    }
    if (temp_max_min[1].getTime() > min_max.date[1].getTime()){
      min_max.date[1] = temp_max_min[1];
    }
  }

  if (p_mf_arr == undefined){
    this.min_max = min_max;
  }

  return min_max;
}

Stinuum.MFCollection.prototype.getWholeMinMax = function() {
  var whole_features_pair;
  whole_features_pair = this.features.concat(this.hiddenFeatures);
  this.whole_min_max = this.findMinMaxGeometry(whole_features_pair);
  return this.whole_min_max;
}

Stinuum.MFCollection.prototype.getColor = function(id){
  if (this.colorCollection[id] != undefined){
    return this.colorCollection[id];
  }
  var color = Cesium.Color.fromRandom({
    minimumRed : 0.2,
    minimumBlue : 0.2,
    minimumGreen : 0.2,
    alpha : 1.0
  });
  this.colorCollection[id] = color;
  return color;
}

Stinuum.MFCollection.prototype.setColor = function(id, color){
  this.colorCollection[id] = color;
}

Stinuum.MFCollection.prototype.getAllPropertyType = function(){
  var array = [];
  for (var i = 0 ; i < this.features.length ; i++){
    if (this.features[i].feature.temporalProperties == undefined) continue;
    for (var j = 0 ; j < this.features[i].feature.temporalProperties.length ; j++){
      var keys = Object.keys(this.features[i].feature.temporalProperties[j]);
      for (var k = 0 ; k < keys.length ; k++){
        if (keys[k] == 'datetimes') continue;
        array.push(keys[k]);
      }
      return array;


    }

  }
  return array;
}

Stinuum.MFCollection.prototype.spliceByTime = function(start, end){//Date, Date

  var mf_arr = this.features;
  var new_mf_arr = [];
  var del_mf_arr = [];
  for (var i = 0 ; i < mf_arr.length ; i++){
    var min_max_date = Stinuum.findMinMaxTime(mf_arr[i].feature.temporalGeometry.datetimes);
    if (min_max_date[0] >= start && min_max_date[1] <= end){
      new_mf_arr.push(mf_arr[i]);
    }
    else{
      del_mf_arr.push(mf_arr[i]);
    }
  }

  for (var i = 0 ; i < this.hiddenFeatures.length ; i++){
    var min_max_date = Stinuum.findMinMaxTime(this.hiddenFeatures[i].feature.temporalGeometry.datetimes);
    if (min_max_date[0] >= start && min_max_date[1] <= end){
      new_mf_arr.push(this.hiddenFeatures[i]);
    }
    else{
      del_mf_arr.push(this.hiddenFeatures[i]);
    }

  }

  this.features = new_mf_arr;
  this.hiddenFeatures = del_mf_arr;
}

Stinuum.MFCollection.prototype.getFeatureById = function(id){
  var inFeatures = this.getFeatureByIdInFeatures(id);
  if (inFeatures != -1){
    return inFeatures;
  }

  var inHidden = this.getFeatureByIdinHidden(id);
  if (inHidden != -1){
    return inHidden;
  }

  return -1;
}

Stinuum.MFCollection.prototype.getFeatureByIdInFeatures = function(id){
  for (var i = 0 ; i < this.features.length ; i++){
    if (this.features[i].id == id){
      return this.features[i];
    }
  }

  return -1;
}

Stinuum.MFCollection.prototype.getFeatureByIdinHidden = function(id){
  for (var i = 0 ; i < this.hiddenFeatures.length ; i++){
    if (this.hiddenFeatures[i].id == id){
      return this.hiddenFeatures[i];
    }
  }

  return -1;
}

Stinuum.MFCollection.prototype.getLength = function(){
  return this.features.length;
}

Stinuum.MFCollection.prototype.reset = function(){
  this.features = [];
  this.hiddenFeatures = [];
  this.colorCollection = [];

}

Stinuum.MFCollection.prototype.hide = function(mf_id){
  if (this.inFeaturesIndexOfById(mf_id) != -1){
    var index = this.inFeaturesIndexOfById(mf_id);
    var hidden_pair = this.features.splice(index, 1)[0];

    this.hiddenFeatures.push(hidden_pair);
  }
}

Stinuum.MFCollection.prototype.hideAll = function(mf_id){ //hide All except one mf
  var i = 0;
  while(1){
    if (i == this.features.length){
      break;
    }
    if (mf_id != undefined){
      if (this.features[i].id == mf_id){
        i++;
        continue;
      }
    }
    this.hide(this.features[i].id);
  }
}
Stinuum.MovementDrawing.prototype.moveMovingPoint = function(options){
  var czml = [];

  var geometry = options.temporalGeometry;
  var number = options.number;
  var multiplier = 10000;
  var length = geometry.datetimes.length;
  var start, stop;
  start = new Date(geometry.datetimes[0]).toISOString();
  stop = new Date(geometry.datetimes[length - 1]).toISOString();

  var availability = start + "/" + stop;

  if (geometry.interpolations[0] == "Spline" || geometry.interpolations[0] == "Linear"){
    var interpolations;
    if (geometry.interpolations[0] == "Spline"){
      interpolations = "HERMITE";
    }
    else{
      interpolations = "LINEAR";
    }
    var v = {};
    v.id = 'movingPoint_' + number;
    v.point = {
      "color" : {
        "rgba" : [0, 0, 0, 255]
      },
      "outlineColor" : {
        "rgba" : [255, 255, 255, 255]
      },
      "outlineWidth" : 4,
      "pixelSize" : 20
    };

    var carto = [];
    var point = geometry.coordinates;
    for (var i = 0 ; i < geometry.coordinates.length ; i++){
      carto.push(new Date(geometry.datetimes[i]).toISOString());
      carto.push(point[i][0]);
      carto.push(point[i][1]);
      var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[i]), this.supersuper.mfCollection.min_max.date, this.supersuper.maxHeight);
      if (this.supersuper.mode == 'SPACETIME'){
        carto.push(normalize);
      }
      else{
        carto.push(1000);
      }

    }
    v.availability = availability;
    v.position = {
      "interpolationAlgorithm": interpolations,
      "interpolationDegree": 2,
      "interval" : availability,
      "epoch" : start,
      "cartographicDegrees" : carto
    };
    czml.push(v);
  }
  else {
    var v = {};
    v.id = 'movingPoint_'+number;
    v.point = {
      "color" : {
        "rgba" : [255, 0, 0, 255]
      },
      "outlineColor" : {
        "rgba" : [255, 255, 255, 255]
      },
      "outlineWidth" : 2,
      "pixelSize" : 10
    };

    var carto = [];
    var point = geometry.coordinates;
    for (var i = 0 ; i < geometry.coordinates.length - 1 ; i++){
      var obj ={};
      if (geometry.interpolations[0] == "Stepwise"){
        var start_interval = new Date(geometry.datetimes[i]).toISOString();
        var finish_interval = new Date(geometry.datetimes[i+1]).toISOString();
        obj.interval = start_interval+"/"+finish_interval;
      }
      else{
        var start_interval = new Date(geometry.datetimes[i]).toISOString();
        var start_date = new Date(geometry.datetimes[i]);
        var finish_date = start_date.setHours(start_date.getHours() + multiplier/10000);
        var finish_interval = new Date(finish_date).toISOString();
        obj.interval = start_interval+"/"+finish_interval;
      }
      obj.cartographicDegrees = [];
      obj.cartographicDegrees.push(point[i][0]);
      obj.cartographicDegrees.push(point[i][1]);

      var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[i]), this.supersuper.mfCollection.min_max.date);
      if (this.supersuper.mode == 'SPACETIME'){
        obj.cartographicDegrees.push(normalize);
      }
      else{
        obj.cartographicDegrees.push(1000);
      }
      carto.push(obj);
    }
    v.availability = availability;
    v.position = carto;
    czml.push(v);
  }



  return czml;
}

Stinuum.MovementDrawing.prototype.moveMovingPolygon =function(options){
  var geometry = options.temporalGeometry,
  number = options.number;
  var multiplier = 10000;
  var czml = [];
  var ref_obj = {
    "id" : "dynamicPolygon_"+number,
    "polygon": {
      "positions": {
        "references": [
          "v_"+number+"_1#position",
          "v_"+number+"_2#position",
          "v_"+number+"_3#position",
          "v_"+number+"_4#position",
          "v_"+number+"_5#position",
          "v_"+number+"_6#position",
          "v_"+number+"_7#position",
          "v_"+number+"_8#position",

        ]
      },
      "perPositionHeight" : true,
      "material": {
        "solidColor": {
          "color": {
            "rgbaf" : [1, 0, 0, 1]
          }
        }
      }
    }
  };

  var length = geometry.datetimes.length;

  var start, stop;
  start = new Date(geometry.datetimes[0]).toISOString();
  stop = new Date(geometry.datetimes[length-1]).toISOString();
  var availability = start + "/" + stop;
  ref_obj.availability = availability;

  if (geometry.interpolations[0] == "Spline" || geometry.interpolations[0] == "Linear")
  {
    czml.push(ref_obj);
    var interpolations;
    if (geometry.interpolations[0] == "Spline"){
      interpolations = "HERMITE";
    }
    else{
      interpolations = "LINEAR";
    }

    for (var i = 0 ; i < geometry.coordinates[0][0].length-1 ; i++){
      var v = {};
      v.id = 'v_'+number+"_"+(i+1);
      v.position = {
        "interpolationAlgorithm": interpolations,
        "interpolationDegree": 2,
        "interval" : availability,
        "epoch" : start,
        "cartographicDegrees" : []
      };
      czml.push(v);

      var start_second = new Date(geometry.datetimes[0]).getTime();
      var carto = [];
      for (var j = 0 ; j < geometry.datetimes.length ; j ++){
        var seconds = new Date(geometry.datetimes[j]).getTime() - start_second;
        var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[j]), this.supersuper.mfCollection.min_max.date, this.supersuper.maxHeight);
        var polygon = geometry.coordinates[j][0];

        carto.push(seconds / 1000);
        carto.push(polygon[i][0]);
        carto.push(polygon[i][1]);
        if (this.supersuper.mode == 'STATICMAP' || this.supersuper.mode == 'ANIMATEDMAP')
        {
          carto.push(10000);
        }
        else{
          carto.push(normalize);
        }


      }

      v.position.cartographicDegrees = carto;
    }




  }
  else{
    for (var i = 0 ; i < geometry.datetimes.length - 1  ; i++){
      var start_date = new Date(geometry.datetimes[i]);
      var start_iso = start_date.toISOString();

      var finish_iso;
      if (geometry.interpolations[0] == "Stepwise"){
        finish_iso = new Date(geometry.datetimes[i+1]).toISOString();
      }
      else{
        var finish_date = start_date;
        finish_date.setHours(start_date.getHours() + multiplier/10000) ;
        finish_iso = finish_date.toISOString();
      }

      var v = {};
      v.id ="polygon_"+number+"_"+i;
      v.availability = start_iso+"/"+finish_iso;
      var carto = [];
      var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[i]), this.supersuper.mfCollection.min_max.date, this.supersuper.maxHeight);
      var polygon = geometry.coordinates[i][0];
      for (var j = 0 ; j < polygon.length-1 ; j++){
        carto.push(polygon[j][0]);
        carto.push(polygon[j][1]);
        if (this.supersuper.mode == 'STATICMAP')
        carto.push(normalize);
        else {
          carto.push(0);
        }
      }

      v.polygon = {
        "positions" : {
          "cartographicDegrees" : carto
        },
        "meterial" :{
          "solidColor" :{
            "color" : {
              "rgbaf" : [1, 0, 1, 1]
            }
          }
        },
        "perPositionHeight" : true
      };
      czml.push(v);
    }

  }


  return czml;
}

Stinuum.MovementDrawing.prototype.moveMovingLineString = function(options){
  var czml = [];
  var geometry = options.temporalGeometry;
  var number = options.number
  var datetime = geometry.datetimes;
  var length = datetime.length;
  var multiplier = 10000;
  var next_mapping_point_arr = Stinuum.calculatePathForEachPoint(geometry);

  if (geometry.interpolations[0] == "Spline" || geometry.interpolations[0] == "Linear")
  {
    var next_point_each_line = next_mapping_point_arr;
    var interpolations;
    if (geometry.interpolations[0] == "Spline"){
      interpolations = "HERMITE";
    }
    else{
      interpolations = "LINEAR";
    }
    for (var i = 0 ; i < next_point_each_line.length ; i++ ){
      //한 줄 씩 start -> end로 polyline

      var start, stop;
      start = new Date(datetime[i]).toISOString();
      stop = new Date(datetime[i+1]).toISOString();

      var availability = start + "/" + stop;
      var next_point = next_point_each_line[i];

      var czml_ref_obj = {
        "polyline" :{
          "width" : 5
        }
      };

      czml_ref_obj.id = "polyline_"+number+"_"+i;
      czml_ref_obj.availability = availability;
      czml_ref_obj.polyline.perPositionHeight = true;
      czml_ref_obj.polyline.meterial = {
        "solidColor": {
          "color": {
            "rgba" : [255, 0, 0, 255]
          }
        }
      };

      var ref_arr =[];

      czml_ref_obj.polyline.positions = {
        "references" : ref_arr
      }
      czml.push(czml_ref_obj);

      var height_1 = Stinuum.normalizeTime(new Date(datetime[i]),this.supersuper.mfCollection.min_max.date,this.supersuper.maxHeight);
      var height_2 = Stinuum.normalizeTime(new Date(datetime[i+1]),this.supersuper.mfCollection.min_max.date,this.supersuper.maxHeight);;
      if (this.supersuper.mode == 'STATICMAP'){
        height_1 = 0;
        height_2 = 0;
      }

      for (var j = 0 ; j < next_point.length ; j++){
        ref_arr.push("v"+number+"_"+i+"_"+j+"#position");

        var czml_position_obj = {};
        czml_position_obj.id = "v"+number+"_"+i+"_"+j;
        czml_position_obj.position = {
          "interpolationAlgorithm": interpolations,
          "interpolationDegree": 1,
          "interval" : availability,
          "epoch" : start
        };


        //console.log(j, next_point[j]);
        var carto = [
          0, next_point[j][0][0] , next_point[j][0][1], height_1,
          (new Date(datetime[i+1]).getTime() - new Date(datetime[i]).getTime()) /1000, next_point[j][1][0], next_point[j][1][1], height_2
        ];

        czml_position_obj.position.cartographicDegrees = carto;

        czml.push(czml_position_obj);
      }

    }
  }
  else{
    for (var i = 0 ; i < geometry.datetimes.length - 1 ; i++){
      var start_date = new Date(geometry.datetimes[i]);
      var start_iso = start_date.toISOString();

      var finish_iso;
      if (geometry.interpolations[0] == "Stepwise"){
        finish_iso = new Date(geometry.datetimes[i+1]).toISOString();
      }
      else{
        var finish_date = start_date;
        finish_date.setHours(start_date.getHours() + multiplier/10000) ;
        finish_iso = finish_date.toISOString();
      }

      var v = {};
      v.id ="polyline_"+number+"_"+i;
      v.availability = start_iso+"/"+finish_iso;

      var carto = [];
      var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[i]), this.supersuper.mfCollection.min_max.date, this.supersuper.maxHeight);//this.height_collection[id][i];

      if (this.supersuper.mode == 'STATICMAP'){
        normalize = 0;
      }

      var polyline = geometry.coordinates[i];
      for (var j = 0 ; j < polyline.length-1 ; j++){
        carto.push(polyline[j][0]);
        carto.push(polyline[j][1]);
        carto.push(normalize);
      }

      v.polyline = {
        "width" : 5,
        "positions" : {
          "cartographicDegrees" : carto
        },
        "meterial" :{
          "solidColor" :{
            "color" : {
              "rgba" : [255, 0, 255, 255]
            }
          }
        }
      };
      czml.push(v);
    }

  }

  return czml;
}



Stinuum.calculatePathForEachPoint = function(mls){

  var pre_polyline;
  var coord_arr = mls.coordinates;
  var next_mapping_point_arr = [];
  for (var i = 0; i < coord_arr.length ; i++){
    if (i == 0){
      pre_polyline = coord_arr[0];
      continue;
    }

    next_mapping_point_arr[i-1] = Stinuum.findMapping(pre_polyline, coord_arr[i]);

    pre_polyline = coord_arr[i];
  }

  return next_mapping_point_arr;
}

Stinuum.findMapping = function(line_1, line_2){
  var i=0,
  j=0;
  var array = [];
  array.push([line_1[0],line_2[0]]);
  while ( i < line_1.length - 1 && j < line_2.length - 1){
    var point_1 = line_1[i];
    var point_2 = line_2[j];

    var next_point_1 = line_1[i+1];
    var next_point_2 = line_2[j+1];

    var dist1 = Stinuum.calculateCarteDist(point_1, next_point_2);
    var dist2 = Stinuum.calculateCarteDist(point_2, next_point_1);

    var triangle = [];
    if (dist1 > dist2){
      array.push([next_point_1,point_2]);
      i++;
    }
    else{
      array.push([point_1,next_point_2]);
      j++;
    }
  }

  while (i < line_1.length - 1 || j < line_2.length - 1){
    var point_1 = line_1[i];
    var point_2 = line_2[j];

    if (i == line_1.length - 1){
      var next_point = line_2[j+1];
      array.push([point_1,next_point]);
      j++;
    }
    else if (j == line_2.length - 1){
      var next_point = line_1[i+1];
      array.push([next_point,point_2]);
      i++;
    }
    else {
      alert("error");
    }
  }
  return array;
}

Stinuum.OccurrenceMap.prototype.show = function(degree){
  if (degree == undefined){
    degree = {};
    degree.x = 5;
    degree.y = 5;
    degree.time = 5;
  }

  if (this.super.mode == 'SPACETIME'){
    var x_deg = degree.x,
    y_deg = degree.y,
    z_deg = degree.time;

    var mf_arr = this.super.mfCollection.features;
    if (mf_arr.length == 0){
      return;
    }
    if (this.primitive != null){
      this.super.cesiumViewer.scene.primitives.remove(this.primitive);
      this.primitive == null;
    }
    degree.time = degree.time * 86400;
    this.super.mfCollection.min_max = this.super.mfCollection.findMinMaxGeometry(mf_arr);
    this.max_num = 0;
    var cube_data = this.makeBasicCube(degree);
    if (cube_data == -1){
      console.log("time degree 너무 큼");
      return;
    }

    for (var index = 0 ; index < mf_arr.length ; index++){
      var feature = mf_arr[index].feature;

      if (feature.temporalGeometry.type == "MovingPoint"){
        this.draw3DHeatMapMovingPoint(feature.temporalGeometry, degree, cube_data);
      }
      else if(feature.temporalGeometry.type == "MovingPolygon"){
        this.draw3DHeatMapMovingPolygon(feature.temporalGeometry, degree, cube_data);
      }
      else if(feature.temporalGeometry.type == "MovingLineString"){
        this.draw3DHeatMapMovingLineString(feature.temporalGeometry, degree, cube_data);
      }
      else{
        console.log("nono", feature);
      }
    }
    if (this.max_num == 0){
      console.log("datetimes of data have too long gap. There is no hotspot");
      return;
    }
    var cube_prim = this.makeCube(degree, cube_data);

    this.primitive = this.super.cesiumViewer.scene.primitives.add(cube_prim);
  }
  else{
    var x_deg = degree.x,
    y_deg = degree.y;

    var mf_arr = this.super.mfCollection.features;
    if (mf_arr.length == 0){
      return;
    }
    if (this.primitive != null){
      this.super.cesiumViewer.scene.primitives.remove(this.primitive);
      this.primitive == null;
    }

    this.super.mfCollection.min_max = this.super.mfCollection.findMinMaxGeometry(mf_arr);
    this.max_num = 0;
    var map_data = this.makeBasicMap(degree);
    if (cube_data == -1){
      console.log("time degree 너무 큼");
      return;
    }

    for (var index = 0 ; index < mf_arr.length ; index++){
      var feature = mf_arr[index].feature;
      if (feature.temporalGeometry.type == "MovingPoint"){
        this.draw2DHeatMapMovingPoint(feature.temporalGeometry, degree, map_data);
      }
      else if(feature.temporalGeometry.type == "MovingPolygon"){
        this.draw2DHeatMapMovingPolygon(feature.temporalGeometry, degree, map_data);
      }
      else if(feature.temporalGeometry.type == "MovingLineString"){
        this.draw2DHeatMapMovingLineString(feature.temporalGeometry, degree, map_data);
      }
      else{
        console.log("nono", feature);
      }
    }
    if (this.max_num == 0){
      console.log("datetimes of data have too long gap. There is no hotspot");
      return;
    }

    var cube_prim = this.makeMap(degree, map_data);

    this.primitive = this.super.cesiumViewer.scene.primitives.add(cube_prim);
  }

}

Stinuum.OccurrenceMap.prototype.remove = function(){
  if (this.primitive !=  null){
    this.super.cesiumViewer.scene.primitives.remove(this.primitive);
    this.primitive = null;
  }
}


Stinuum.OccurrenceMap.prototype.draw2DHeatMapMovingPolygon = function(geometry, degree, map_data){
  var min_max = this.super.mfCollection.min_max;

  var x_deg = degree.x,
  y_deg = degree.y;

  var x_band = min_max.x[1] - min_max.x[0],
  y_band = min_max.y[1] - min_max.y[0];

  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  var max_num = this.max_num;

  var value_property = [];

  for (var point = 0 ; point < geometry.coordinates[0][0].length - 1; point++){
    var temp = new SampledProperty(Number);
    value_property[point] = temp;
  }

  var temp_map = [];
  for (var x = 0 ; x < x_length ; x++){
    temp_map[x] = [];
    for (var y = 0 ; y < y_length ; y++){
      temp_map[x][y] = 0;
    }
  }

  for (var index = 0 ; index < geometry.coordinates.length ; index++){
    var coord = geometry.coordinates[index];

    for (var point = 0 ; point < coord[0].length - 1; point++){
      value_property[point].addSample(coord[0][point][0], coord[0][point][1]);
    }
  }

  for (var x_index = 0 ; x_index < x_length ; x_index++){
    for (var point = 0 ; point < value_property.length ; point++){
      var x_value = min_max.x[0] + x_deg * x_index;
      var y_value = value_property[point].getValue(x_value);
      if (y_value != undefined){
        var y_index = Stinuum.getCubeIndexFromSample(y_value, y_deg, min_max.y[0]);
        if (temp_map[x_index][y_index] == 0){
          temp_map[x_index][y_index] = 1;
        }
      }

    }
  }
  for (var x = 0 ; x < x_length ; x++){
    for (var y = 0 ; y < y_length ; y++){
      if (temp_map[x][y] == 1){
        map_data[x][y] += 1;
        max_num = Math.max(map_data[x][y],max_num);
      }
    }
  }

  this.max_num = Math.max(max_num,this.max_num);

}

Stinuum.OccurrenceMap.prototype.draw2DHeatMapMovingLineString = function(geometry, degree, map_data){
  var min_max = this.super.mfCollection.min_max;

  var x_deg = degree.x,
  y_deg = degree.y;

  var x_band = min_max.x[1] - min_max.x[0],
  y_band = min_max.y[1] - min_max.y[0];

  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  var max_num = this.max_num;

  var max_coordinates_length = Stinuum.findMaxCoordinatesLine(geometry);

  var value_property = [];

  for (var point = 0 ; point < max_coordinates_length; point++){
    var temp = new SampledProperty(Number);
    value_property[point] = temp;
  }

  var temp_map = [];
  for (var x = 0 ; x < x_length ; x++){
    temp_map[x] = [];
    for (var y = 0 ; y < y_length ; y++){
      temp_map[x][y] = 0;
    }
  }


  for (var index = 0 ; index < geometry.coordinates.length ; index++){
    var coord = geometry.coordinates[index];
    for (var point = 0 ; point < max_coordinates_length; point){
      value_property[point].addSample(coord[point][0], coord[point][1]);
    }
  }

  for (var x_index = 0 ; x_index < x_length ; x_index++){
    for (var point = 0 ; point < value_property.length ; point++){
      var x_value = min_max.x[0] + x_deg * x_index;
      var y_value = value_property[point].getValue(x_value);
      if (y_value != undefined){
        var y_index = Stinuum.getCubeIndexFromSample(y_value, y_deg, min_max.y[0]);
        if (temp_map[x_index][y_index] == 0){
          temp_map[x_index][y_index] = 1;
        }
      }

    }
  }

  for (var x = 0 ; x < x_length ; x++){
    for (var y = 0 ; y < y_length ; y++){
      if (temp_map[x][y] == 1){
        map_data[x][y] += 1;
        max_num = Math.max(map_data[x][y],max_num);
      }
    }
  }

  this.max_num = Math.max(max_num,this.max_num);

}

Stinuum.OccurrenceMap.prototype.draw2DHeatMapMovingPoint = function(geometry, degree, map_data){
  var min_max = this.super.mfCollection.min_max;

  var x_deg = degree.x,
  y_deg = degree.y;

  var x_band = min_max.x[1] - min_max.x[0],
  y_band = min_max.y[1] - min_max.y[0];

  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  var max_num = this.max_num;

  var value_property = new SampledProperty(Number);


  var temp_map = [];
  for (var x = 0 ; x < x_length ; x++){
    temp_map[x] = [];
    for (var y = 0 ; y < y_length ; y++){
      temp_map[x][y] = 0;
    }
  }


  for (var index = 0 ; index < geometry.coordinates.length ; index++){
    var coord = geometry.coordinates[index];

    value_property.addSample(coord[0], coord[1]);

  }
  for (var x_index = 0 ; x_index < x_length ; x_index++){
      var x_value = min_max.x[0] + x_deg * x_index;
      var y_value = value_property.getValue(x_value);

      if (y_value != undefined){

        var y_index = Stinuum.getCubeIndexFromSample(y_value, y_deg, min_max.y[0]);
        map_data[x_index][y_index] += 1;
        max_num = Math.max(map_data[x_index][y_index],max_num);
      }

  }

  this.max_num = Math.max(max_num,this.max_num);

}

Stinuum.OccurrenceMap.prototype.makeMap = function(degree, map_data){
  //var boxCollection = new Cesium.PrimitiveCollection();
  var num = 0;
  var data = map_data;
  var min_max = this.super.mfCollection.min_max;

  var max_count = this.max_num;
  var x_deg = degree.x,
  y_deg = degree.y;

  var instances = [];

  for (var x = 0 ; x < data.length - 1 ; x++){
    for (var y = 0 ; y < data[x].length ; y++){
      var count = data[x][y];
      var rating = count/max_count;
      if (rating < 0.1){
        continue;
      }
      var green_rate = 2.0 - 2.0 * rating;
      if (green_rate > 1.0) green_rate = 1.0;
      var color = new Cesium.Color(1.0, green_rate, 0.0, rating);
      instances.push(new Cesium.GeometryInstance({
        geometry : new Cesium.RectangleGeometry({
          rectangle : Cesium.Rectangle.fromDegrees(min_max.x[0] + x_deg * x, min_max.y[0] + y_deg * y , min_max.x[0] + x_deg * (x+1), min_max.y[0] + y_deg * (y+1)),
          height : 50000
        }),
        attributes : {
          color : Cesium.ColorGeometryInstanceAttribute.fromColor(color)
        }
      }));

    }

    //  return boxCollection;
  }

  return new Cesium.Primitive({
    geometryInstances : instances,
    appearance : new Cesium.PerInstanceColorAppearance()
  });
}


Stinuum.OccurrenceMap.prototype.makeBasicMap = function(degree){
  var x_deg = degree.x,
  y_deg = degree.y;

  var cube_data = [];
  var min_max = this.super.mfCollection.min_max;

  var x_band = min_max.x[1] - min_max.x[0],
  y_band = min_max.y[1] - min_max.y[0];

  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  for (var x = 0 ; x < x_length ; x++){
    cube_data[x] = [];
    for (var y = 0 ; y < y_length ; y++){
      cube_data[x][y] = 0;
    }
  }
  return cube_data;
}

Stinuum.OccurrenceMap.prototype.makeBasicCube = function(degree){
  var min_max = this.super.mfCollection.min_max;
  var cube_data = [];

  var x_deg = degree.x,
  y_deg = degree.y,
  time_deg = degree.time;

  var x_band = min_max.x[1] - min_max.x[0],
  y_band = min_max.y[1] - min_max.y[0];

  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  var time_length = (min_max.date[1].getTime() - min_max.date[0].getTime())/(time_deg * 1000);
  if (time_length < 1){
    return -1;
  }
  var start = Cesium.JulianDate.fromDate(min_max.date[0]);

  for (var i = 0 ; i < time_length + 1 ; i++){
    cube_data[i] = {
      time : Cesium.JulianDate.addSeconds(start, time_deg * i, new Cesium.JulianDate())

    };
    cube_data[i].count = [];

    for (var x = 0 ; x < x_length ; x++){

      cube_data[i].count[x] = [];
      for (var y = 0 ; y < y_length ; y++){
        cube_data[i].count[x][y] = 0;
      }
    }
  }
  return cube_data;
}

Stinuum.OccurrenceMap.prototype.draw3DHeatMapMovingPolygon = function(geometry, degree, cube_data){
  var min_max = this.super.mfCollection.min_max;

  var x_deg = degree.x,
  y_deg = degree.y,
  time_deg = degree.time;

  var time_length = (min_max.date[1].getTime() - min_max.date[0].getTime())/(time_deg * 1000);
  var start = Cesium.JulianDate.fromDate(min_max.date[0]);

  var x_band = min_max.x[1] - min_max.x[0],
  y_band = min_max.y[1] - min_max.y[0];

  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  var max_num = this.max_num;
  var datetimes = geometry.datetimes;

  var lower_x_property = new Cesium.SampledProperty(Number);
  var upper_x_property = new Cesium.SampledProperty(Number);

  var lower_y_property = new Cesium.SampledProperty(Number);
  var upper_y_property = new Cesium.SampledProperty(Number);


  if (geometry.interpolations == "Spline"){
    upper_y_property.setInterpolationOptions({
      interpolationAlgorithm : Cesium.HermitePolynomialApproximation,
      interpolationDegree : 2
    });
    lower_y_property.setInterpolationOptions({
      interpolationAlgorithm : Cesium.HermitePolynomialApproximation,
      interpolationDegree : 2
    });
    upper_x_property.setInterpolationOptions({
      interpolationAlgorithm : Cesium.HermitePolynomialApproximation,
      interpolationDegree : 2
    });
    lower_x_property.setInterpolationOptions({
      interpolationAlgorithm : Cesium.HermitePolynomialApproximation,
      interpolationDegree : 2
    });

  }

  for (var time = 0 ; time < datetimes.length ; time++){
    var jul_time = Cesium.JulianDate.fromDate(new Date(datetimes[time]));
    var normalize = Stinuum.normalizeTime(new Date(datetimes[time]), this.super.mfCollection.min_max.date, this.super.maxHeight);

    var coordinates = geometry.coordinates[time][0];
    var mbr = Stinuum.getMBRFromPolygon(coordinates);

    lower_x_property.addSample(jul_time, mbr.x[0]);
    upper_x_property.addSample(jul_time, mbr.x[1]);
    lower_y_property.addSample(jul_time, mbr.y[0]);
    upper_y_property.addSample(jul_time, mbr.y[1]);
  }

  for (var i = 0 ; i < time_length - 1 ; i++){
    var middle_time = Cesium.JulianDate.addSeconds(cube_data[i].time, time_deg/2, new Cesium.JulianDate());
    var time = [cube_data[i].time, middle_time, cube_data[i+1].time];

    for (var ti = 0 ; ti <time.length ; ti++){
      var mbr = {
        x : [],
        y : []
      };

      mbr.x[0] = lower_x_property.getValue(time[ti]);
      mbr.x[1] = upper_x_property.getValue(time[ti]);
      mbr.y[0] = lower_y_property.getValue(time[ti]);
      mbr.y[1] = upper_y_property.getValue(time[ti]);


      if (mbr.y[1] != undefined){
        var x_min = Stinuum.getCubeIndexFromSample(mbr.x[0], x_deg, min_max.x[0]);
        var y_min = Stinuum.getCubeIndexFromSample(mbr.y[0], y_deg, min_max.y[0]);
        var x_max = Stinuum.getCubeIndexFromSample(mbr.x[1], x_deg, min_max.x[0]);
        var y_max = Stinuum.getCubeIndexFromSample(mbr.y[1], y_deg, min_max.y[0]);

        var x_equal = (x_min == x_max);
        var y_equal = (y_min == y_max);

        if (x_equal && y_equal){
          cube_data[i].count[x_min][y_min] += 1;
        }
        else if(x_equal){
          cube_data[i].count[x_min][y_min] += 1;
          cube_data[i].count[x_min][y_max] += 1;
        }
        else if(y_equal){
          cube_data[i].count[x_min][y_min] += 1;
          cube_data[i].count[x_max][y_min] += 1;
        }
        else{
          cube_data[i].count[x_max][y_min] += 1;
          cube_data[i].count[x_max][y_max] += 1;
          cube_data[i].count[x_min][y_min] += 1;
          cube_data[i].count[x_min][y_max] += 1;
        }
        max_num = Math.max(cube_data[i].count[x_min][y_min],max_num);
        max_num = Math.max(cube_data[i].count[x_min][y_max],max_num);
        max_num = Math.max(cube_data[i].count[x_max][y_min],max_num);
        max_num = Math.max(cube_data[i].count[x_max][y_max],max_num);
      }

    }

  }
  this.max_num = Math.max(max_num,this.max_num);

}

Stinuum.OccurrenceMap.prototype.draw3DHeatMapMovingPoint = function(geometry, degree, cube_data){
  var min_max = this.super.mfCollection.min_max;

  var x_deg = degree.x,
  y_deg = degree.y,
  time_deg = degree.time;

  var time_length = (min_max.date[1].getTime() - min_max.date[0].getTime())/(time_deg * 1000);
  var start = Cesium.JulianDate.fromDate(min_max.date[0]);


  var x_band = min_max.x[1] - min_max.x[0],
  y_band = min_max.y[1] - min_max.y[0];

  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  var max_num = this.max_num;
  //  console.log(cube_data);
  var datetimes = geometry.datetimes;
  var x_property = new Cesium.SampledProperty(Number);
  var y_property = new Cesium.SampledProperty(Number);

  if (geometry.interpolations == "Spline"){
    x_property.setInterpolationOptions({
      interpolationAlgorithm : Cesium.HermitePolynomialApproximation,
      interpolationDegree : 2
    });
    y_property.setInterpolationOptions({
      interpolationAlgorithm : Cesium.HermitePolynomialApproximation,
      interpolationDegree : 2
    });
  }

  for (var time = 0 ; time < datetimes.length; time++){
    var jul_time = Cesium.JulianDate.fromDate(new Date(datetimes[time]));
    var position = {        x : geometry.coordinates[time][0],y : geometry.coordinates[time][1]      };

    x_property.addSample(jul_time, position.x);
    y_property.addSample(jul_time, position.y);
  }

  for (var i = 0 ; i < time_length - 1 ; i++){
    var middle_time = Cesium.JulianDate.addSeconds(cube_data[i].time,time_deg/2,new Cesium.JulianDate());
    var time = [cube_data[i].time, middle_time, cube_data[i+1].time];

    for (var ti = 0 ; ti <time.length ; ti++){
      var x_position = x_property.getValue(time[ti]);
      var y_position = y_property.getValue(time[ti]);

      if (x_position != undefined && y_position != undefined){
        var x = Stinuum.getCubeIndexFromSample(x_position, x_deg, min_max.x[0]);
        var y = Stinuum.getCubeIndexFromSample(y_position, y_deg, min_max.y[0]);
        cube_data[i].count[x][y] += 1;
        max_num = Math.max(cube_data[i].count[x][y],max_num);
      }

    }

  }

  this.max_num = Math.max(max_num,this.max_num);
}

Stinuum.OccurrenceMap.prototype.draw3DHeatMapMovingLineString = function(geometry, degree, cube_data){
  var min_max = this.super.mfCollection.min_max;

  var x_deg = degree.x,
  y_deg = degree.y,
  time_deg = degree.time;

  var time_length = (min_max.date[1].getTime() - min_max.date[0].getTime())/(time_deg * 1000);
  var start = Cesium.JulianDate.fromDate(min_max.date[0]);

  var x_band = min_max.x[1] - min_max.x[0],
  y_band = min_max.y[1] - min_max.y[0];

  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  var max_num = this.max_num;
  var datetimes = geometry.datetimes;

  var x_property = [];
  var y_property = [];

  var max_coordinates_length = Stinuum.findMaxCoordinatesLine(geometry);

  for (var i = 0 ; i <  max_coordinates_length; i++){
    x_property[i] = new Cesium.SampledProperty(Number);
    y_property[i] = new Cesium.SampledProperty(Number);
  }

  if (geometry.interpolations == "Spline"){
    for (var i = 0 ; i < max_coordinates_length ; i++){
      x_property[i].setInterpolationOptions({
        interpolationAlgorithm : Cesium.HermitePolynomialApproximation,
        interpolationDegree : 2
      });
      y_property[i].setInterpolationOptions({
        interpolationAlgorithm : Cesium.HermitePolynomialApproximation,
        interpolationDegree : 2
      });
    }
  }

  for (var time = 0 ; time < datetimes.length ; time++){
    var jul_time = Cesium.JulianDate.fromDate(new Date(datetimes[time]));
    var normalize = Stinuum.normalizeTime(new Date(datetimes[time]), this.super.mfCollection.min_max.date, this.super.maxHeight);

    var coordinates = geometry.coordinates[time];

    for (var i = 0 ; i < max_coordinates_length ; i++){
      if (coordinates[i] != undefined){
        x_property[i].addSample(jul_time, coordinates[i][0]);
        y_property[i].addSample(jul_time, coordinates[i][1]);
      }
    }

  }

  for (var i = 0 ; i < time_length - 1 ; i++){
    var middle_time = Cesium.JulianDate.addSeconds(cube_data[i].time, time_deg/2, new Cesium.JulianDate());
    var time = [cube_data[i].time, middle_time, cube_data[i+1].time];

    for (var ti = 0 ; ti <time.length ; ti++){
      var x_value = [];
      var y_value = [];

      var is_undefined = false;
      for (var j = 0 ; j < max_coordinates_length ; j++){
        x_value[j] = x_property[j].getValue(middle_time);
        y_value[j] = y_property[j].getValue(middle_time);
        if (x_value[j] != undefined && y_value[j] != undefined){
          var x_index = Stinuum.getCubeIndexFromSample(x_value[j], x_deg, min_max.x[0]);
          var y_index = Stinuum.getCubeIndexFromSample(y_value[j], y_deg, min_max.y[0]);

          cube_data[i].count[x_index][y_index] += 1;

          max_num = Math.max(cube_data[i].count[x_index][y_index],max_num);
        }
      }
    }



  }
  this.max_num = Math.max(max_num,this.max_num);
}

Stinuum.OccurrenceMap.prototype.makeCube = function(degree, cube_data){
  var boxCollection = new Cesium.PrimitiveCollection();
  var num = 0;
  var data = cube_data;
  var min_max = this.super.mfCollection.min_max;

  var max_count = this.max_num;
  var x_deg = degree.x,
  y_deg = degree.y;

  for (var z = 0 ; z < data.length - 1 ; z++){

    var lower_time = Stinuum.normalizeTime(new Date(data[z].time.toString()),this.super.mfCollection.min_max.date,this.super.maxHeight);
    var upper_time = Stinuum.normalizeTime(new Date(data[z+1].time.toString()),this.super.mfCollection.min_max.date,this.super.maxHeight);

    for (var x = 0 ; x < data[z].count.length ; x++){
      for (var y = 0 ; y < data[z].count[x].length ; y++){
        var count = data[z].count[x][y];

        var positions = new Stinuum.BoxCoord();
        positions.minimum.x = min_max.x[0] + x_deg * x;
        positions.maximum.x = min_max.x[0] + x_deg * (x + 1);
        positions.minimum.y = min_max.y[0] + y_deg * y;
        positions.maximum.y = min_max.y[0] + y_deg * (y + 1);
        positions.minimum.z = lower_time;
        positions.maximum.z = upper_time;

        var rating = count/max_count;
        if (rating < 0.1){

          continue;
          //rating = 0.1;
        }

        var prim = Stinuum.drawOneCube(positions, rating) ;
        boxCollection.add(prim);
        num += count;

      }

    }

    //  return boxCollection;
  }
  return boxCollection;
}

Stinuum.getCubeIndexFromSample = function(value, deg, min){
  return Math.floor((value - min) / deg);
}


var SampledProperty = function(){
  this.array = [];
  this.addSample = function(x, y){
    this.array.push({
      'x':x,
      'y':y});
    this.array.sort(function(a, b){
      var keyA = a.x,
      keyB = b.x;
      // Compare the 2 dates
      if(keyA < keyB) return -1;
      if(keyA > keyB) return 1;
      return 0;
    });
  };

  this.getValue =  function(x){
    if (x < this.array[0].x){
      return undefined;
    }
    for (var i = 0 ; i < this.array.length -1 ; i++){
      if (x >= this.array[i].x && x <= this.array[i+1].x){
        var b = this.array[i+1].y - this.array[i+1].x * (this.array[i+1].y - this.array[i].y)/(this.array[i+1].x - this.array[i].x);
        return (this.array[i+1].y - this.array[i].y)/(this.array[i+1].x - this.array[i].x) * x + b;
      }
    }
    return undefined;
  };
}
Stinuum.DirectionRadar.prototype.remove = function(canvasID){
  var radar_canvas = document.getElementById(canvasID);
  radar_canvas.innerHTML = '';
  radar_canvas.getContext('2d').clearRect(0, 0, radar_canvas.width, radar_canvas.height);

  this.super.mfCollection.colorCollection = {};
}

Stinuum.DirectionRadar.prototype.show = function(canvasID){
  var radar_canvas = document.getElementById(canvasID);

  radar_canvas.innerHTML = '';
  radar_canvas.getContext('2d').clearRect(0, 0, radar_canvas.width, radar_canvas.height);

  var cumulative = new Stinuum.SpatialInfo();

  for (var index = 0 ; index < this.super.mfCollection.features.length ; index++){
    var mf = this.super.mfCollection.features[index];
    this.super.mfCollection.setColor(mf.id, Stinuum.addDirectionInfo(cumulative, mf.feature.temporalGeometry));
  }

  var total_life = cumulative.west.total_life + cumulative.east.total_life + cumulative.north.total_life + cumulative.south.total_life;
  var total_length = cumulative.west.total_length + cumulative.east.total_length + cumulative.north.total_length + cumulative.south.total_length;
  var cnvs = document.getElementById(canvasID);
  if (cnvs.getContext){
    var h_width = cnvs.width / 2;
    var h_height = cnvs.height / 2;
    var ctx = cnvs.getContext('2d');
    var max_life = Math.max.apply(null, [cumulative.west.total_life , cumulative.east.total_life , cumulative.north.total_life, cumulative.south.total_life]);

    var max_length = Math.max.apply(null, [cumulative.west.total_length , cumulative.east.total_length , cumulative.north.total_length, cumulative.south.total_length]);
    var scale = 1 / (max_length/total_length) * 0.8;


    var length = [cumulative.west.total_length, cumulative.east.total_length, cumulative.north.total_length, cumulative.south.total_length];
    var length2 = [cumulative.west.total_length,- cumulative.east.total_length, cumulative.north.total_length, -cumulative.south.total_length];
    var life = [cumulative.west.total_life, cumulative.east.total_life, cumulative.north.total_life, cumulative.south.total_life];
    var velocity = [];
    var total_velocity = 0.0;
    for (var i = 0 ; i < length.length ; i++){
      if (life[i] == 0){
        velocity[i] = 0;
        continue;
      }
      velocity[i] = length[i]/life[i];

      total_velocity += velocity[i];
    }

    var color = ['rgb(255, 255, 0)','rgb(0, 255, 0)','Cyan','red'];

    for (var i = 0 ; i < life.length ; i++){

      for (var j = 0 ; j < 2 ; j += 0.1){
        ctx.beginPath();
        ctx.arc(h_width,h_height,h_width * life[i] / max_life, j * Math.PI,(j+0.05)*Math.PI);
        ctx.strokeStyle= color[i];
        ctx.stroke();
      }
    }

    for (var i = 0 ; i < 2 ; i++){
      ctx.beginPath();
      ctx.moveTo(h_width,h_height);
      ctx.lineTo(h_width - length2[i]/max_length * 0.375 * 0.9 * h_width, h_height - 0.25 * 1 * h_height * velocity[i]/total_velocity);
      ctx.lineTo(h_width - length2[i]/max_length * 0.5 * 0.9 *  h_width, h_height - 0.5 * 1 * h_height * velocity[i]/total_velocity);
      ctx.lineTo(h_width - length2[i]/max_length * 1.0 * 0.9 *  h_width, h_height);
      ctx.lineTo(h_width - length2[i]/max_length * 0.5 * 0.9 *  h_width, h_height + 0.5 * 1 * h_height * velocity[i]/total_velocity);
      ctx.lineTo(h_width - length2[i]/max_length * 0.375 * 0.9 *  h_width, h_height + 0.25 * 1 * h_height * velocity[i]/total_velocity);
      ctx.fillStyle= color[i];
      ctx.fill();
    }

    for (var i = 2 ; i < 4 ; i++){
      ctx.beginPath();
      ctx.moveTo(h_width,h_height);
      ctx.lineTo(h_width - velocity[i]/total_velocity * 0.25 * 1 * h_width, h_height - 0.375 * 0.9* h_height * length2[i]/max_length);
      ctx.lineTo(h_width - velocity[i]/total_velocity* 0.5 * 1 * h_width, h_height - 0.5 * 0.9  * h_height * length2[i]/max_length);
      ctx.lineTo(h_width, h_height - 1.0 * 0.9 *  h_height * length2[i]/max_length);
      ctx.lineTo(h_width +  velocity[i]/total_velocity * 0.5 * 1 * h_width, h_height - 0.5 * 0.9 * h_height * length2[i]/max_length);
      ctx.lineTo(h_width +  velocity[i]/total_velocity * 0.25 * 1 * h_width, h_height - 0.375 * 0.9 * h_height * length2[i]/max_length);
      ctx.fillStyle = color[i];
      ctx.fill();
    }


  }
  else{
    alert('canvas를 지원하지 않는 브라우저');
  }
}

Stinuum.DirectionRadar.drawBackRadar = function(radar_id) {
    var radar_canvas = document.getElementById(radar_id);

    if (radar_canvas.getContext) {
        var h_width = radar_canvas.width / 2;
        var h_height = radar_canvas.height / 2;
        var ctx = radar_canvas.getContext('2d');

        var color = 'rgb(0,255,0)';
        for (var id = 0; id < 2; id++) {
            for (var j = 0; j < 2; j += 0.05) {
                ctx.beginPath();
                ctx.arc(h_width, h_height, h_width * (id + 1) / 2, j * Math.PI, (j + 0.025) * Math.PI);
                ctx.strokeStyle = color;
                ctx.stroke();
            }
        }

    } else {
        alert('canvas를 지원하지 않는 브라우저');
    }
}

Stinuum.addDirectionInfo = function(cumulative, geometry){
  var life = Stinuum.calculateLife(geometry) / 1000000;
  var length = Stinuum.calculateLength(geometry);

  var start_point = geometry.coordinates[0][0];
  var end_point = geometry.coordinates[geometry.coordinates.length-1][0];

  if (geometry.type != "MovingPoint" ){ // Polygon, LineString
    start_point = Stinuum.getCenter(start_point, geometry.type);
    end_point = Stinuum.getCenter(end_point, geometry.type);
  }

  var dist_x, dist_y;

  dist_x = end_point[0] - start_point[0];
  dist_y = end_point[1] - start_point[1];

  var r_color ;
  if (dist_x == 0){
    if (dist_y > 0){
      cumulative.north.total_life += life;
      cumulative.north.total_length += length;
      r_color = Cesium.Color.fromRandom({
        maximumRed : 0.2,
        minimumBlue : 0.7,
        minimumGreen : 0.6,
        alpha : 1.0
      });
    }
    else if (dist_y < 0){
      cumulative.south.total_life += life;
      cumulative.south.total_length += length;
      r_color = Cesium.Color.fromRandom({
        minimumRed : 0.7,
        maximumBlue : 0.2,
        maximumGreen : 0.2,
        alpha : 1.0
      });
    }
    else{

    }
  }
  else{
    var slope = dist_y / dist_x ;
    if (slope < 1 && slope > -1){
      if (dist_x > 0 ){
        cumulative.east.total_life += life;
        cumulative.east.total_length += length;
        r_color = Cesium.Color.fromRandom({
          maximumRed : 0.2,
          maximumBlue : 0.2,
          minimumGreen : 0.7,
          alpha : 1.0
        });
      }
      else{
        cumulative.west.total_life += life;
        cumulative.west.total_length += length;
        r_color = Cesium.Color.fromRandom({
          minimumRed : 0.7,
          maximumBlue : 0.2,
          minimumGreen : 0.7,
          alpha : 1.0
        });
      }
    }
    else {
      if (dist_y >0){
        cumulative.north.total_life += life;
        cumulative.north.total_length += length;
        r_color = Cesium.Color.fromRandom({
          maximumRed : 0.2,
          minimumBlue : 0.7,
          minimumGreen : 0.6,
          alpha : 1.0
        });
      }
      else{
        cumulative.south.total_life += life;
        cumulative.south.total_length += length;
        r_color = Cesium.Color.fromRandom({
          minimumRed : 0.7,
          maximumBlue : 0.2,
          maximumGreen : 0.2,
          alpha : 1.0
        });
      }
    }
  }

  return r_color;


}

Stinuum.calculateLife = function(geometry){
  return - new Date(geometry.datetimes[0]).getTime() + new Date(geometry.datetimes[geometry.datetimes.length-1]).getTime();
};

Stinuum.calculateLength = function(geometry){
  var total = 0;
  for (var i = 0 ; i < geometry.coordinates.length - 1 ; i++){
    var point1;
    var point2;
    if (geometry.type == "MovingPoint"){
      point1 = geometry.coordinates[i];
      point2 = geometry.coordinates[i+1];
    }
    else{
      point1 = Stinuum.getCenter(geometry.coordinates[i][0], geometry.type);
      point2 = Stinuum.getCenter(geometry.coordinates[i+1][0], geometry.type);
    }
    //total += Stinuum.calculateDist(point1, point2);
    total += Stinuum.calculateCarteDist(point1, point2);

  }

  return total;
};
Stinuum.prototype.changeMode = null;

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
Stinuum.TemporalMap.prototype.show = function(mf_id,propertyName){
  var pro_name = propertyName;

  var mf = this.super.mfCollection.getFeatureById(mf_id);
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

Stinuum.findMinMaxTime = function(datetimes){
  var min_max_date = [];
  min_max_date[0] = new Date(datetimes[0]);
  min_max_date[1] = new Date(datetimes[0]);

  for (var j = 1 ; j < datetimes.length ; j++){
    var time = new Date(datetimes[j]);

    if (min_max_date[0].getTime() > time.getTime()){
      min_max_date[0] = time;
    }
    if (min_max_date[1].getTime() < time.getTime()){
      min_max_date[1] = time;
    }
  }
  return min_max_date;
}

Stinuum.findMinMaxCoordArray = function(coordinates_arr){
  var mf_min_max_coord = Stinuum.findMinMaxCoord(coordinates_arr[0]);
  for (var j = 1 ; j < coordinates_arr.length ; j++){
    mf_min_max_coord = Stinuum.findBiggerCoord(mf_min_max_coord, Stinuum.findMinMaxCoord(coordinates_arr[j]) );
  }
  return mf_min_max_coord;
}

Stinuum.findMinMaxCoord = function(coordinates){
  var min_max = {};
  min_max.x = [];
  min_max.y = [];
  min_max.z = [];

  var start = coordinates[0];
  min_max.x[0] = start[0];
  min_max.x[1] = start[0];
  min_max.y[0] = start[1];
  min_max.y[1] = start[1];
  min_max.z = [];
  if (coordinates[0][2] != undefined){
    min_max.z[0] = start[2];
    min_max.z[1] = start[2];
  }

  for (var i = 0 ; i < coordinates.length ; i++){
    var coord = coordinates[i];
    if (min_max.x[0] > coord[0]){
      min_max.x[0] = coord[0];
    }
    if (min_max.x[1] < coord[0]){
      min_max.x[1] = coord[0];
    }
    if (min_max.y[0] > coord[1]){
      min_max.y[0] = coord[1];
    }
    if (min_max.y[1] < coord[1]){
      min_max.y[1] = coord[1];
    }
    if (coord[2] != undefined){
      if (min_max.z[0] > coord[2]){
        min_max.z[0] = coord[2];
      }
      if (min_max.z[1] < coord[2]){
        min_max.z[1] = coord[2];
      }
    }
  }

  return min_max;

}


Stinuum.findBiggerCoord = function(min_max_1, min_max_2){
  var ret = {};
  ret.x = [];
  ret.y = [];
  ret.z = [];
  ret.x[0] = Math.min(min_max_1.x[0],min_max_2.x[0]);
  ret.y[0] = Math.min(min_max_1.y[0],min_max_2.y[0]);
  ret.x[1] = Math.max(min_max_1.x[1],min_max_2.x[1]);
  ret.y[1] = Math.max(min_max_1.y[1],min_max_2.y[1]);

  if (min_max_1.z.length != 0 && min_max_2.z.length != 0){
    ret.z[0] = Math.min(min_max_1.z[0],min_max_2.z[0]);
    ret.z[1] = Math.max(min_max_1.z[1],min_max_2.z[1]);
  }
  return ret;
}

Stinuum.normalizeTime = function(date, min_max_date, value = 15000000){
  var separation = min_max_date[1].getTime() - min_max_date[0].getTime()
  return (date.getTime() - min_max_date[0].getTime())/separation * value;
}

Stinuum.findMinMaxProperties = function(properties){
  if (!Array.isArray(properties)){
    properties = [properties];
  }

  var first_date = new Date(properties[0].datetimes[0]);
  var first_value = properties[0].values[0];
  var min_max = {};
  min_max.date = [first_date,first_date];
  min_max.value = [first_value,first_value];
  for (var i = 0 ; i < properties.length ; i++){
    var temp_max_min = Stinuum.findMinMaxTime(properties[i].datetimes);
    if (temp_max_min[0].getTime() < min_max.date[0].getTime()){
      min_max.date[0] = temp_max_min[0];
    }
    if (temp_max_min[1].getTime() > min_max.date[1].getTime()){
      min_max.date[1] = temp_max_min[1];
    }
    for (var j = 0 ; j < properties[i].values.length ; j++){
      if (min_max.value[0] > properties[i].values[j]){
        min_max.value[0] = properties[i].values[j];
      }
      if (min_max.value[1] < properties[i].values[j]){
        min_max.value[1] = properties[i].values[j];
      }
    }

  }
  return min_max;
}

Stinuum.getMBRFromPolygon = function(coordinates){
  var mbr = Stinuum.findMinMaxCoord(coordinates);
  return mbr;
}

Stinuum.getPropertyByName = function(mf, name, id){
  if (mf.temporalProperties == undefined) return -1;

  for (var i = 0 ; i < mf.temporalProperties.length ; i++){
    var property = mf.temporalProperties[i][name];
    if (property != undefined){
      property.datetimes = mf.temporalProperties[i].datetimes;
      return [property, id];
    }
  }
  return -1;
}

Stinuum.calculateDist = function(point_1, point_2){
  return Math.sqrt(Math.pow(point_1[0] - point_2[0],2) + Math.pow(point_1[1] - point_2[1],2));
}

Stinuum.calculateCarteDist = function(point1, point2){
  if (point1.length == 2 && point1.length == point2.length)
  {
    var carte3_1 = Cesium.Cartesian3.fromDegrees(point1[0], point1[1]),
    carte3_2 =  Cesium.Cartesian3.fromDegrees(point2[0], point2[1]);
  }
  else if (point1.length == 3 && point1.length == point2.length){
    var carte3_1 = Cesium.Cartesian3.fromDegrees(point1[0], point1[1], point1[2]),
    carte3_2 =  Cesium.Cartesian3.fromDegrees(point2[0], point2[1], point2[2]);
  }
  else{
    alert("dist error");
    return;
  }

  return Cesium.Cartesian2.distance(Cesium.Cartesian2.fromCartesian3(carte3_1),Cesium.Cartesian2.fromCartesian3(carte3_2));
}

Stinuum.getBoundingSphere = function(min_max, height){
  var middle_x = ( min_max.x[0] + min_max.x[1] ) / 2;
  var middle_y = ( min_max.y[0] + min_max.y[1] ) / 2;
  var middle_height = (height[0] + height[1]) / 2;

  var radius = Stinuum.calculateCarteDist([middle_x,middle_y,middle_height], [min_max.x[0],min_max.y[0],height[0]]);
  return new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(middle_x,middle_y,middle_height), radius);
}

Stinuum.findMaxCoordinatesLine = function(geometry){
  var max_length = 0;
  for (var i = 0 ; i < geometry.coordinates.length ; i++){
    if (max_length < geometry.coordinates[i].length){
      max_length = geometry.coordinates[i].length;
    }
  }
  return max_length;
}
