var LOG = console.log;

function drawOnePolygon(onePolygon, height, with_height, r_color = Cesium.Color.ORANGE.withAlpha(0.3)) { //it gets one polygon
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
  var color = Cesium.ColorGeometryInstanceAttribute.fromColor(r_color);

  var vertexF = new Cesium.VertexFormat({
    position : true,
    st : true,
    normal : false,
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
      color : color
    }
  });
  return geoInstance;
}

var drawMovingPolygonArray = function(mf_arr, with_height) { // it gets one object of features.
  var prim_collecion = new Cesium.PrimitiveCollection();
  var r_color = Cesium.Color.fromRandom({
    red : 0.0,
    minimumBlue : 0.2,
    minimumGreen : 0.2,
    alpha : 0.3
  });

  var min_max_date = findAllMinMaxTime(mf_arr);

  for (var id = 0 ; id < mf_arr.length ; id++){
    var setOfPolygon = mf_arr[id];
    var coordinates = setOfPolygon.temporalGeometry.coordinates;
    var datetimes = setOfPolygon.temporalGeometry.datetimes;
    var name = setOfPolygon.properties.name;
    var polyCollection;
    var poly_list = new Array();
    var heights = null;
    if (with_height){
      heights = getListOfHeight(datetimes, min_max_date);
    }

    var r_color = Cesium.Color.fromRandom({
      red : 0.0,
      minimumBlue : 0.2,
      minimumGreen : 0.2,
      alpha : 0.3
    });

    for (var i = 0; i < coordinates.length; i++) {
      poly_list.push(drawOnePolygon(coordinates[i], heights[i], with_height, r_color));
    }


    polyCollection = new Cesium.Primitive({
      geometryInstances: poly_list,
      appearance: new Cesium.PerInstanceColorAppearance({})
    });
    prim_collecion.add(polyCollection);
  }
  return prim_collecion;

}

var drawVolumeMovingPolygonArray = function(mf_arr, with_height) { // it gets one object of features.

  if ( !Array.isArray(mf_arr) ){
    mf_arr = [mf_arr];
  }
  var typhoonCollection = new Cesium.PrimitiveCollection();


  var min_max_date = findAllMinMaxTime(mf_arr);


  for (var id = 0 ; id < mf_arr.length ; id++){

    var oneTyphoon = mf_arr[id];
    var coordinates = oneTyphoon.temporalGeometry.coordinates;
    var datetimes = oneTyphoon.temporalGeometry.datetimes;
    var name = oneTyphoon.properties.name;

    var geoInstance;
    var surface = [];
    var typhoon;

    var heights = getListOfHeight(datetimes, min_max_date);

    var r_color = Cesium.Color.fromRandom({
      red : 0.0,
      minimumBlue : 0.2,
      minimumGreen : 0.2,
      alpha : 0.3
    });

    for (var i = 0; i < coordinates.length - 1; i++) {
      for (var j = 0; j < coordinates[i].length - 1 ; j++) {

        var temp_poly = new Array();
        var temp_point = new Array();
        var first = coordinates[i][j];
        var sec = coordinates[i + 1][j];
        var third = coordinates[i + 1][j + 1];
        var forth = coordinates[i][j + 1];


        if (with_height){
          temp_poly.push([first[0], first[1], heights[i]], [sec[0], sec[1], heights[i+1]],
             [third[0], third[1], heights[i+1]], [forth[0], forth[1], heights[i]]);
        }
        else{
          temp_poly.push([first[0], first[1], 0], [sec[0], sec[1], 0],
            [third[0], third[1], 0], [forth[0], forth[1], 0]);
        }

        geoInstance = drawOnePolygon(temp_poly, null, with_height, r_color);
        surface.push(geoInstance);
      }
    }
    var typhoon = new Cesium.Primitive({
      geometryInstances: surface,
      appearance: new Cesium.PerInstanceColorAppearance()
    });
    typhoonCollection.add(typhoon);
  }
  return typhoonCollection;

}

function drawOnePoint(onePoint,height,r_color){ //it gets one point
  var pointInstance = new Cesium.PointPrimitive();
  var position = Cesium.Cartesian3.fromDegrees(onePoint[0],onePoint[1],height);;
  pointInstance.position = position;
  pointInstance.color = r_color;
  return pointInstance;
}

var drawMovingPointArray = function(mf_arr, with_height){ //it gets set of points
  if ( !Array.isArray(mf_arr) ){
    mf_arr = [mf_arr];
  }
  var pointCollection = new Cesium.PointPrimitiveCollection();

  var min_max_date = findAllMinMaxTime(mf_arr);

  for (var id = 0 ; id < mf_arr.length ; id++){

    var r_color = Cesium.Color.fromRandom({
      red : 0.0,
      minimumBlue : 0.2,
      minimumGreen : 0.2,
      alpha : 1.0
    });
    var buffer = mf_arr[id];
    var heights = getListOfHeight(buffer.temporalGeometry.datetimes, min_max_date);
    var data = buffer.temporalGeometry.coordinates;
    if(with_height){
      for(var i = 0 ; i < data.length ; i++ ){
        pointCollection.add(drawOnePoint(data[i], heights[i], r_color));
      }
    }
    else{
      for(var i = 0 ; i < data.length ; i++ ){
        pointCollection.add(drawOnePoint(data[i], 0, r_color));
      }
    }
  }
  return pointCollection;
}

function drawOneLine(positions, r_color){
  var material = new Cesium.Material.fromType('Color');
  material.uniforms.color = r_color;

  var line = {
    positions :  Cesium.Cartesian3.fromDegreesArrayHeights(positions) ,
    width : 5,
    material : material
  };

  return line;
}

function makeDegreesArray(pos_2d, height){
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

var drawMovingLineStringArray = function(mf_arr, with_height) { // it gets one object of features.
  if ( !Array.isArray(mf_arr) ){
    mf_arr = [mf_arr];
  }
  var polylineCollection = new Cesium.PolylineCollection();

  var min_max_date = findAllMinMaxTime(mf_arr);

  for (var id = 0 ; id < mf_arr.length ; id++){
    var r_color = Cesium.Color.fromRandom({
      red : 0.0,
      minimumBlue : 0.2,
      minimumGreen : 0.2,
      alpha : 1.0
    });

    var buffer = mf_arr[id];
    var data = buffer.temporalGeometry;
    var heights = getListOfHeight(data.datetimes, min_max_date);

    for (var j = 0 ; j < data.coordinates.length ; j++){
      if (!with_height){
        heights[j] = 0;
      }
      var positions = makeDegreesArray(data.coordinates[j], heights[j]);
      polylineCollection.add(drawOneLine(positions, r_color));
    }
  }
  return polylineCollection;
}

function calculateDistanceThree2D(p1, p2, p3) {
  var dis1 = euclidianDistance2D(p1, p3);
  var dis2 = euclidianDistance2D(p2, p3);
  return (dis1 + dis2) / 2;
}

function calculateDistanceThree3D(p1, p2, p3) {
  var dis1 = euclidianDistance3D(p1, p3);
  var dis2 = euclidianDistance3D(p2, p3);
  return (dis1 + dis2) / 2;
}

function euclidianDistance2D(a, b) {
  var pow1 = Math.pow(a[0] - b[0], 2);
  var pow2 = Math.pow(a[1] - b[1], 2);
  return Math.sqrt(pow1 + pow2);
}

function euclidianDistance3D(a, b) {
  var pow1 = Math.pow(a[0] - b[0], 2);
  var pow2 = Math.pow(a[1] - b[1], 2);
  var pow3 = Math.pow(a[2] - b[2], 2);
  return Math.sqrt(pow1 + pow2 + pow3);
}


var drawMovingPointPath = function(mf_arr, with_height){
  if ( !Array.isArray(mf_arr) ){
    mf_arr = [mf_arr];
  }
  var polylineCollection = new Cesium.PolylineCollection();

  var min_max_date = findAllMinMaxTime(mf_arr);

  for (var id = 0 ; id < mf_arr.length ; id++){
    var r_color = Cesium.Color.fromRandom({
      red : 0.0,
      minimumBlue : 0.2,
      minimumGreen : 0.2,
      alpha : 1.0
    });

    var buffer = mf_arr[id];
    var data = buffer.temporalGeometry;
    var heights = getListOfHeight(data.datetimes, min_max_date);

    var positions = makeDegreesArray(data.coordinates, heights);
    polylineCollection.add(drawOneLine(positions, r_color));
  }
  return polylineCollection;
}

var drawMovingLinePath = function(mf_arr, with_height){
  if ( !Array.isArray(mf_arr) ){
    mf_arr = [mf_arr];
  }
  var trianlgeCollection = new Cesium.PrimitiveCollection();

  var min_max_date = findAllMinMaxTime(mf_arr);

  for (var id = 0 ; id < mf_arr.length ; id ++ ){
    var data = mf_arr[id].temporalGeometry;
    var heights = getListOfHeight(data.datetimes, min_max_date);
    var coord_arr = data.coordinates;
    for (var i = 0; i < coord_arr.length ; i++){
      if (i == 0){
        pre_polyline = coord_arr[0];
        continue;
      }

      trianlgeCollection.add(drawTrinaglesWithNextPos(pre_polyline, coord_arr[i], heights[i-1], heights[i], with_height));



      pre_polyline = coord_arr[i];
    }
  }
  return trianlgeCollection;
}

function drawTrinaglesWithNextPos(line_1, line_2, height1, height2, with_height){
  var instances = [];
  var i=0,
  j=0;

  while ( i < line_1.length - 1 && j < line_2.length - 1){

    var color = Cesium.Color.fromRandom({
      minimumRed : 0.6,
      minimumBlue : 0.0,
      minimumGreen : 0.0,
      alpha : 0.4
    });

    var positions = [];
    var point_1 = line_1[i];
    var point_2 = line_2[j];

    var next_point_1 = line_1[i+1];
    var next_point_2 = line_2[j+1];

    point_1.push(height1);
    positions.push(point_1);
    point_2.push(height2);
    positions.push(point_2);

    var dist1 = euclidianDistance2D(point_1, next_point_2);
    var dist2 = euclidianDistance2D(point_2, next_point_1);

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
    instances.push(drawOnePolygon(positions,null,with_height,color));
  }

  while (i < line_1.length - 1 || j < line_2.length - 1){
    var color = Cesium.Color.fromRandom({
      minimumRed : 0.6,
      minimumBlue : 0.0,
      minimumGreen : 0.0,
      alpha : 0.4
    });

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
    instances.push(drawOnePolygon(positions,null,with_height,color));
  }

  var temp = new Cesium.Primitive({
    geometryInstances : instances,
    appearance : new Cesium.PerInstanceColorAppearance({   }),
    show : true
  });


  return temp;

}


function drawOneCube(positions, rating = 1.0){
  var red_rate = 1.0, green_rate = (-2 * rating) + 2;

  var rating_color = new Cesium.Color(
    1.0,
    green_rate,
    0.0,
    rating
  );

  if (rating < 0){
    rating_color = new Cesium.Color(
      1.0,
      green_rate,
      0.5,
      0.2
    );
  }
  var size = calcSidesBoxCoord(positions);

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

function calcSidesBoxCoord(box_coord){
  var x_dist = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.minimum.z), Cesium.Cartesian3.fromDegrees(box_coord.maximum.x, box_coord.minimum.y, box_coord.minimum.z));
  var y_dist = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.minimum.z), Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.maximum.y, box_coord.minimum.z));
  var z_dist = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.minimum.z), Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.maximum.z));

  return [x_dist, y_dist, z_dist];
}
