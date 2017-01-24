function PolylineJSON(data_path, viewer){
  this.viewer = viewer;
  this.data_path = data_path;
  this.data = null;
  this.collection = [];
  this.r_color = [];

  this.polyline_collection = [];
  this.triangle_primitives = [];

  this.polyline_collection_3d = [];
  this.triangle_primitives_3d = [];
  this.height_collection = [];

  this.max_point_of_polyline = [];
  this.max_path_line = [];

  this.mapping_next_point = [];
  this.mapping_path = [];
  this.pre_czml = null;
}

PolylineJSON.prototype.makePrimitive3d = function(){
  var feature = this.data.features;

  for (var i = 0 ; i < feature.length ; i++){
    var geometry = feature[i].temporalGeometry;
    this.height_collection[i] = [];

    var max_num = 0, max_path_line = [];


    var positions = [];
    var min_max_date = findMinMaxTime(geometry.datetimes);
    for ( var j = 0 ; j < geometry.coordinates.length ; j ++){
      if ( j > 0 ){
        if (max_num < geometry.coordinates[j].length + geometry.coordinates[j-1].length){
          max_num = geometry.coordinates[j].length;
          max_path_line = j;
        }
      }


      var datetimes = normalizeTime(new Date(geometry.datetimes[j]), min_max_date, 1000000);
      //  console.log(datetimes);
      positions.push(PolylineJSON.getPosition(geometry.coordinates[j], datetimes));
      this.height_collection[i].push(datetimes);
    }
    //  console.log(positions)
    this.polyline_collection_3d.push(makePolylineCollection(positions, this.r_color[i], 10));

    this.mapping3d(i);

    this.max_path_line[i] = max_path_line;
    this.max_point_of_polyline[i] = max_num;
  }

  //showPolyline();

}

PolylineJSON.prototype.loadJsonAndMakePrimitive = function(){
  var this_object = this;

  if (this.collection.length != 0){
    console.log('collection not null');
    var feature = this.data.features;
    for (var i = 0 ; i < feature.length ; i++){
      addRowtoTable(feature[i].properties.name, Cesium.Color.WHITE, i);
    }
  }
  else{
    return Cesium.loadJson(this.data_path).then(function(data){
      this_object.data = data;
      var feature = data.features;

      for (var i = 0 ; i < feature.length ; i++){
        var r_color = Cesium.Color.fromRandom({
          red : 0.0,
          minimumBlue : 0.2,
          minimumGreen : 0.2,
          alpha : 0.8
        });

        this_object.r_color.push(r_color);

        var geometry = feature[i].temporalGeometry;
        this_object.collection.push(geometry.coordinates);

        addRowtoTable(feature[i].properties.name, Cesium.Color.WHITE, i);

        var positions = [];
        for ( var j = 0 ; j < geometry.coordinates.length ; j ++){
          positions.push(PolylineJSON.getPosition(geometry.coordinates[j]));
        }

        this_object.polyline_collection.push(makePolylineCollection(positions, r_color, 10));

        this_object.mapping2d(i);
      }

      this_object.makePrimitive3d();
      //  console.log(this_object.collection);


    }).otherwise(function(error){
      console.log(error);
    });

  }
}


PolylineJSON.getPosition = function(cor, time = 0){
  var posi_arr = [];

  for ( var j = 0 ; j < cor.length ; j++ ){
    posi_arr.push(cor[j][0]);
    posi_arr.push(cor[j][1]);
    posi_arr.push(time);
  }
  //  console.log(posi_arr);
  return posi_arr;

}

PolylineJSON.prototype.mapping3d = function(index){
  var pre_polyline;
  var pre_height;


  for (var i = 0 ; i < this.collection[index].length ; i++){

    if (i == 0)
    {
      pre_polyline = this.collection[index][0];
      pre_height = this.height_collection[index][0];
      continue;
    }


    this.triangle_primitives_3d.push(PolylineJSON.makeTriangles(pre_polyline, this.collection[index][i],
      pre_height, this.height_collection[index][i]));
      pre_polyline = this.collection[index][i];
      pre_height = this.height_collection[index][i];
    }
}

PolylineJSON.prototype.mapping2d = function(index){
  var pre_polyline;
  this.mapping_next_point[index] = [];
  for (var i = 0 ; i < this.collection[index].length ; i++){

    if (i == 0)
    {
      pre_polyline = this.collection[index][0];
      continue;
    }

    this.mapping_next_point[index][i-1] = [];

    this.triangle_primitives.push(PolylineJSON.makeTriangles(pre_polyline, this.collection[index][i], undefined, undefined, this.mapping_next_point[index][i-1] ));
      pre_polyline = this.collection[index][i];
  }

  console.log(index, this.mapping_next_point[index]);
}

PolylineJSON.makeTriangles = function(line_1, line_2, height1 = 0, height2 = 0, array = []){
    var instances = [];
    var i=0,
    j=0;

    array.push([line_1[0],line_2[0]]);
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

      positions = positions.concat(point_1);
      positions.push(height1);

      positions = positions.concat(point_2);
      positions.push(height2);

      var dist1 = PolylineJSON.calculateDist(point_1, next_point_2);
      var dist2 = PolylineJSON.calculateDist(point_2, next_point_1);

      var triangle = [];
      if (dist1 > dist2){
        array.push([next_point_1,point_2]);
        positions = positions.concat(next_point_1);
        positions.push(height1);
        i++;
      }
      else{
        array.push([point_1,next_point_2]);
        positions = positions.concat(next_point_2);
        positions.push(height2);
        j++;
      }

      instances.push(makePolygonWithHeight(positions, color));
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
      positions = positions.concat(point_1);
      positions.push(height1);
      positions = positions.concat(point_2);
      positions.push(height2);

      if (i == line_1.length - 1){
        var next_point = line_2[j+1];

        array.push([point_1,next_point]);
        positions = positions.concat(next_point);
        positions.push(height2);
        j++;
      }
      else if (j == line_2.length - 1){
        var next_point = line_1[i+1];

        array.push([next_point,point_2]);

        positions = positions.concat(next_point);
        positions.push(height1);
        i++;
      }
      else {
        alert("error");
      }

      instances.push(makePolygonWithHeight(positions, color));
    }

    var temp = new Cesium.Primitive({
      geometryInstances : instances,
      //    releaseGeometryInstances : false,
      appearance : new Cesium.PerInstanceColorAppearance({
        //translucent : false
      }),
      show : true
    });

    return temp;
}

PolylineJSON.calculateDist = function(point_1, point_2){
  return Math.sqrt(Math.pow(point_1[0] - point_2[0],2) + Math.pow(point_1[1] - point_2[1],2));
}

PolylineJSON.prototype.getPath = function(id){

}

PolylineJSON.prototype.animation_czml = function(id, with_height = 1){
  if (this.mapping_path[id]==undefined){
    //this.getPath(id);
  }
  var viewer = this.viewer;
  viewer.dataSources.removeAll();
  var czml = [{
    "id" : "document",
    "name" : "polyline_highligh",
    "version" : "1.0"
  }];


  var glo_start, glo_stop;
  var datetime = this.data.features[id].temporalGeometry.datetimes;
  var length = datetime.length;

  glo_start = new Date(datetime[0]).toISOString();
  glo_stop = new Date(datetime[length-1]).toISOString();
  czml[0].clock = {
    "interval" : glo_start + "/" + glo_stop,
    "currentTime" : glo_start,
    "multiplier" : 10000
  }

  var next_point_each_line = this.mapping_next_point[id];
  console.log(next_point_each_line.length);
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
    czml_ref_obj.id = "polyline_"+i;
    czml_ref_obj.availability = availability;
    czml_ref_obj.polyline.perPositionHeight = true;
    czml_ref_obj.polyline.meterial = {
      "solidColor": {
        "color": {
          "rgbaf" : [1, 0, 0, 1]
        }
      }
    };

    czml.push(czml_ref_obj);

    var height_1 = this.height_collection[id][i] * with_height;
    var height_2 = this.height_collection[id][i+1] * with_height;

    var ref_arr = [];
    for (var j = 0 ; j < next_point.length ; j++){
      ref_arr.push("v"+i+"_"+j+"#position");

      var czml_position_obj = {};
      czml_position_obj.id = "v"+i+"_"+j;
      czml_position_obj.position = {
        "interpolationAlgorithm": "LINEAR",
        "interpolationDegree": 1,
        "interval" : availability,
        "epoch" : start
      };


      console.log(j, next_point[j]);
      var carto = [
        0, next_point[j][0][0] , next_point[j][0][1], height_1,
        (new Date(datetime[i+1]).getTime() - new Date(datetime[i]).getTime()) /1000, next_point[j][1][0], next_point[j][1][1], height_2
      ];

      czml_position_obj.position.cartographicDegrees = carto;

      czml.push(czml_position_obj);
    }

    czml[1].polyline.positions = {
      "references" : ref_arr
    }




  }

  console.log(czml);
  this.pre_czml = Cesium.CzmlDataSource.load(czml)
  this.viewer.dataSources.add(this.pre_czml);


}
