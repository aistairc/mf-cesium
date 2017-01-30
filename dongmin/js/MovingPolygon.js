MovingPolygon.prototype.visualizePath3D = function(){
  if (this.triangles_prim_3d == undefined){//make triangle
    //LOG(this);
    this.makePrimitive3d();
  }

  viewer.scene.primitives.add(this.triangles_prim_3d);
}

MovingPolygon.prototype.animateWithArray = function(mfl, id_arr, with_height = false){
  viewer.dataSources.removeAll();

  var czml = [{
    "id" : "document",
    "name" : "polygon_highlight",
    "version" : "1.0"
  }];
  var multiplier = 10000;

  var global_availabilty, global_start, global_stop;

  var geo_list = mfl.getGeometryListByIdArray(id_arr);

  global_start = new Date(geo_list[0].datetimes[0]).toISOString();
  global_stop = global_start;


  for (var id = 0 ; id < id_arr.length ; id++){

    var ref_obj = {
      "id" : "dynamicPolygon_"+id,
      "polygon": {
        "positions": {
          "references": [
            "v_"+id+"_1#position",
            "v_"+id+"_2#position",
            "v_"+id+"_3#position",
            "v_"+id+"_4#position",
            "v_"+id+"_5#position",
            "v_"+id+"_6#position",
            "v_"+id+"_7#position",
            "v_"+id+"_8#position",

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



    var geometry = geo_list[id];
    var length = geometry.datetimes.length;


    var min_max_date = [];
    min_max_date = findMinMaxTime(geometry.datetimes);

    var start, stop;
    start = new Date(geometry.datetimes[0]).toISOString();
    stop = new Date(geometry.datetimes[length-1]).toISOString();
    var availability = start + "/" + stop;
    ref_obj.availability = availability;

    if (new Date(start).getTime() < new Date(global_start).getTime()){
      global_start = start;
    }
    if (new Date(stop).getTime() > new Date(global_stop).getTime()){
      global_stop = stop;
    }

    if (geometry.interpolations == "Spline" || geometry.interpolations == "Linear")
    {
      czml.push(ref_obj);
      var interpolations;
      if (geometry.interpolations == "Spline"){
        interpolations = "HERMITE";
      }
      else{
        interpolations = "LINEAR";
      }

      if (geometry.coordinates.length == 0) continue;

      for (var i = 0 ; i < geometry.coordinates[0].length-1 ; i++){
        var v = {};
        v.id = 'v_'+id+"_"+(i+1);
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
          var normalize = normalizeTime(new Date(geometry.datetimes[j]), min_max_date);
          var polygon = geometry.coordinates[j];

          carto.push(seconds / 1000);
          carto.push(polygon[i][0]);
          carto.push(polygon[i][1]);
          if (with_height == false)
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
        if (geometry.interpolations == "Stepwise"){
          finish_iso = new Date(geometry.datetimes[i+1]).toISOString();
        }
        else{
          var finish_date = start_date;
          finish_date.setHours(start_date.getHours() + multiplier/10000) ;
          finish_iso = finish_date.toISOString();
        }

        if (new Date(finish_iso).getTime() > new Date(global_stop).getTime()){
          global_stop = finish_iso;
        }
        if (new Date(start_iso).getTime() < new Date(global_start).getTime()){
          global_start = start_iso;
        }

        var v = {};
        v.id ="polygon_"+id+"_"+i;
        v.availability = start_iso+"/"+finish_iso;
        var carto = [];
        var normalize = normalizeTime(new Date(geometry.datetimes[i]), min_max_date);
        var polygon = geometry.coordinates[i];
        for (var j = 0 ; j < polygon.length-1 ; j++){
          carto.push(polygon[j][0]);
          carto.push(polygon[j][1]);
          if (with_height)
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


  }
  czml[0].clock = {
    "interval" : global_start+"/"+global_stop,
    "currentTime" : global_start,
    "multiplier" : multiplier
  }

  if (czml.length > 2){
    var load_czml = Cesium.CzmlDataSource.load(czml)
    viewer.dataSources.add(load_czml);

  }
  LOG(czml);
}

MovingPolygon.makeVolumePolygonPair = function(poly_1, poly_2, color){
  var instances = [];
  for (var k = 0 ; k < poly_1.length-1 ; k++){
    var position = [];

    var long_lat = poly_2[k];
    var pre_long_lat = poly_1[k];

    var next_long_lat = poly_2[k+1];
    var next_pre_long_lat= poly_1[k+1];

    position.push(long_lat[0]);
    position.push(long_lat[1]);
    position.push(long_lat[2]);

    position.push(next_long_lat[0]);
    position.push(next_long_lat[1]);
    position.push(next_long_lat[2]);

    position.push(next_pre_long_lat[0]);
    position.push(next_pre_long_lat[1]);
    position.push(next_pre_long_lat[2]);

    position.push(pre_long_lat[0]);
    position.push(pre_long_lat[1]);
    position.push(pre_long_lat[2]);

    instances.push(makePolygonWithHeight(position, color));

  }

  return instances;
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



MovingPolygon.prototype.makePrimitive3d = function(){
  var instances = [];
  var r_color = Cesium.Color.fromRandom({
    red : 0.0,
    minimumBlue : 0.2,
    minimumGreen : 0.2,
    alpha : 0.5
  });

  var geometry = this.temporalGeometry;

  //find min time, max time
  var min_max_date = [];
  min_max_date = findMinMaxTime(geometry.datetimes);

  var pre_polygon,
  pre_dates;

  for (var j = 0 ; j < geometry.coordinates.length ; j ++){
    if (j == 0){
      pre_polygon = geometry.coordinates[0];
      pre_dates = geometry.datetimes[0];
      continue;
    }

    var normalize = normalizeTime(new Date(geometry.datetimes[j]), min_max_date);
    var pre_normalize = normalizeTime(new Date(pre_dates), min_max_date);

    var polygon_cor = geometry.coordinates[j];

    for (var k = 0 ; k < geometry.coordinates[j].length ; k++){
      pre_polygon[k][2] = pre_normalize;
      polygon_cor[k][2] = normalize;
    }

    instances = instances.concat(MovingPolygon.makeVolumePolygonPair(pre_polygon,polygon_cor,r_color));

    pre_polygon = geometry.coordinates[j];
    pre_dates = geometry.datetimes[j];

  }

  var prim = new Cesium.Primitive({
    geometryInstances : instances,
    appearance : new Cesium.PerInstanceColorAppearance({
      translucent : true
    }),
    show : true
  });

  this.triangles_prim_3d = prim;
}
