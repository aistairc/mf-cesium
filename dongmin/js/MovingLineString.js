MovingLineString.prototype.calculateHeight = function(){

  var date_arr = this.temporalGeometry.datetimes;
  var min_max_date = findMinMaxTime(this.temporalGeometry.datetimes);

  for (var i = 0 ; i < date_arr.length ; i ++){
    this.height_arr.push(normalizeTime(new Date(date_arr[i]), min_max_date));
  }
}

MovingLineString.prototype.get3D = function(){
  if (this.height_arr.length == 0){
    this.calculateHeight();
  }
  if (this.triangles_prim_3d.length == 0){
    this.calculatePathForEachPoint();
  }

  return this.triangles_prim_3d;
}


MovingLineString.prototype.get2D = function(){
  return null;
}


MovingLineString.prototype.visualizePath3D = function(){

  for (var i = 0 ; i < this.triangles_prim_3d.length ; i++){
    viewer.scene.primitives.add(this.triangles_prim_3d[i]);
  }

}

MovingLineString.prototype.calculatePathForEachPoint = function(){
  if (this.height_arr.length == 0){
    this.calculateHeight();
  }
  var pre_polyline;
  var coord_arr = this.temporalGeometry.coordinates;
  for (var i = 0; i < coord_arr.length ; i++){
    if (i == 0){
      pre_polyline = coord_arr[0];
      continue;
    }

    this.next_mapping_point_arr[i-1] = this.makeTriangles(pre_polyline, coord_arr[i], this.height_arr[i-1], this.height_arr[i]);

    pre_polyline = coord_arr[i];
  }
}

MovingLineString.prototype.makeTriangles = function(line_1, line_2, height1, height2){
  var instances = [];
  var i=0,
  j=0;
  var array = [];
  array.push([line_1[0],line_2[0]]);

  //var height1 = this.height_arr, height2 = 0;

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

    var dist1 = calculateDist(point_1, next_point_2);
    var dist2 = calculateDist(point_2, next_point_1);

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
  LOG(instances);
  this.triangles_prim_3d.push(temp);
  return array;
}

MovingLineString.prototype.animateWithArray = function (id_arr, with_height){
  var multiplier = 10000;

  viewer.dataSources.removeAll();

  var czml = [{
    "id" : "document",
    "name" : "polyline_highligh",
    "version" : "1.0"
  }];

  var glo_start, glo_stop;
  glo_start = new Date(this.temporalGeometry.datetimes[0]).toISOString();
  glo_stop = glo_start;


  var geo_list = active_mfl.getGeometryListByIdArray(id_arr);
  for (var d = 0 ; d < id_arr.length ; d ++){
    var id = id_arr[d];
    var mls = active_mfl.getById(id_arr[d]);
    var geometry = geo_list[d];
    var datetime = geometry.datetimes;
    var length = datetime.length;


    if (mls.next_mapping_point_arr.length == 0){
      mls.calculatePathForEachPoint();
    }

    if (geometry.interpolations == "Spline" || geometry.interpolations == "Linear")
    {


      var next_point_each_line = mls.next_mapping_point_arr;
      var interpolations;
      if (geometry.interpolations == "Spline"){
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

        if (new Date(start).getTime() < new Date(glo_start).getTime()){
          glo_start = start;
        }
        if (new Date(stop).getTime() > new Date(glo_stop).getTime()){
          glo_stop = stop;
        }

        var availability = start + "/" + stop;
        var next_point = next_point_each_line[i];

        var czml_ref_obj = {
          "polyline" :{
            "width" : 5
          }
        };

        czml_ref_obj.id = "polyline_"+id+"_"+i;
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

        var height_1 = mls.height_arr[i];//this.height_collection[id][i] * with_height;
        var height_2 = mls.height_arr[i+1];//this.height_collection[id][i+1] * with_height ;
        if (!with_height){
          height_1 = 0;
          height_2 = 0;
        }

        for (var j = 0 ; j < next_point.length ; j++){
          ref_arr.push("v"+id+"_"+i+"_"+j+"#position");

          var czml_position_obj = {};
          czml_position_obj.id = "v"+id+"_"+i+"_"+j;
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
        if (geometry.interpolations == "Stepwise"){
          finish_iso = new Date(geometry.datetimes[i+1]).toISOString();
        }
        else{
          var finish_date = start_date;
          finish_date.setHours(start_date.getHours() + multiplier/10000) ;
          finish_iso = finish_date.toISOString();
        }

        if (new Date(start_iso).getTime() < new Date(glo_start).getTime()){
          glo_start = start_iso;
        }
        if (new Date(finish_iso).getTime() > new Date(glo_stop).getTime()){
          glo_stop = finish_iso;
        }



        var v = {};
        v.id ="polyline_"+id+"_"+i;
        v.availability = start_iso+"/"+finish_iso;

        var carto = [];
        var normalize = this.height_arr[i];//this.height_collection[id][i];

        var polyline = geometry.coordinates[i];
        for (var j = 0 ; j < polyline.length-1 ; j++){
          carto.push(polyline[j][0]);
          carto.push(polyline[j][1]);
          carto.push(normalize * with_height);
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
  }

  czml[0].clock = {
    "interval" : glo_start + "/" + glo_stop,
    "currentTime" : glo_start,
    "multiplier" : multiplier
  }

  LOG('czma' , czml);
  var load_czml = Cesium.CzmlDataSource.load(czml)
  viewer.dataSources.add(load_czml);


}
