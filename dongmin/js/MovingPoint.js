MovingPoint.prototype.visualizePath3D = function(){
  if (this.line_prim_3d == null){
    this.makeLinePrimitive();
  }
  this.viewer.scene.primitives.add(this.line_prim_3d);
}

MovingPoint.prototype.makeLinePrimitive = function(){
  var r_color = Cesium.Color.fromRandom({
    red : 0.0,
    minimumBlue : 0.2,
    minimumGreen : 0.2,
    alpha : 1.0
  });

  var positions = [];
  positions.push(MovingPoint.getPosition3d(this.temporalGeometry));
  this.line_prim_3d = makePolylineCollection(positions,r_color);

}



MovingPoint.getPosition3d = function(geometry){
  var posi_arr = [];
  var min_max_date = MovingPoint.findMinMaxTime(geometry.datetimes);
  for ( var j = 0 ; j < geometry.coordinates.length ; j++ ){
    posi_arr.push(geometry.coordinates[j][1]);
    posi_arr.push(geometry.coordinates[j][0]);
    var str_date = geometry.datetimes[j];

    posi_arr.push(normalizeTime(strtoDate(str_date),min_max_date));

  }
  return posi_arr;
}

//--------------------------remove------------------------------
MovingPoint.findMinMaxTime = function(datetimes){
  var min_max_date = [];
  min_max_date[0] = strtoDate(datetimes[0]).getTime();
  min_max_date[1] = strtoDate(datetimes[0]).getTime();

  for (var j = 1 ; j < datetimes.length ; j++){

    var time = strtoDate(datetimes[j]).getTime();

    if (min_max_date[0] > time){
      min_max_date[0] = time;
    }
    if (min_max_date[1] < time){
      min_max_date[1] = time;
    }
  }
  return min_max_date;
}


MovingPoint.prototype.animateWithArray = function(mfl, id_arr, with_height){
  var multiplier = 10000;

  LOG(viewer.dataSources);
  viewer.dataSources.removeAll();
  var czml = [{
      "id" : "document",
      "name" : "point_highlight",
      "version" : "1.0"
  }];

  var glo_start, glo_stop;
  glo_start = strtoisostr(this.temporalGeometry.datetimes[0]);
  glo_stop = glo_start;

  for (var id_index = 0 ; id_index < id_arr.length ; id_index++){
    var p_id = id_arr[id_index];
    var geometry = mfl.list[p_id].temporalGeometry;

    var min_max_date = [];
    min_max_date = MovingPoint.findMinMaxTime(geometry.datetimes);
    LOG(min_max_date);

    var length = geometry.datetimes.length;
    var start, stop;
    start = strtoisostr(geometry.datetimes[0]);
    stop = strtoisostr(geometry.datetimes[length - 1]);

    if (new Date(start).getTime() < new Date(glo_start).getTime()){
      glo_start = start;
    }
    if (new Date(stop).getTime() > new Date(glo_stop).getTime()){
      glo_stop = stop;
    }

    var availability = start + "/" + stop;

    if (geometry.interpolations == "Spline" || geometry.interpolations == "Linear"){
      var interpolations;
      if (geometry.interpolations == "Spline"){
        interpolations = "HERMITE";
      }
      else{
        interpolations = "LINEAR";
      }
      var v = {};
        v.id = 'movingPoint_'+p_id;
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
        carto.push(strtoisostr(geometry.datetimes[i]));
        carto.push(point[i][1]);
        carto.push(point[i][0]);
        var normalize = normalizeTime(strtoDate(geometry.datetimes[i]), min_max_date);
        if (with_height){
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
        v.id = 'movingPoint';
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
      for (var i = 0 ; i < geometry.coordinates.length - 1 ; i++){
        var obj ={};
        if (geometry.interpolations == "Stepwise"){
          var start_interval = strtoisostr(geometry.datetimes[i]);
          var finish_interval = strtoisostr(geometry.datetimes[i+1]);
          obj.interval = start_interval+"/"+finish_interval;
        }
        else{
          var start_interval = strtoisostr(geometry.datetimes[i]);
          var start_date = strtoDate(geometry.datetimes[i]);
          var finish_date = start_date.setHours(start_date.getHours() + multiplier/10000);
          var finish_interval = new Date(finish_date).toISOString();
          obj.interval = start_interval+"/"+finish_interval;
        }
        obj.cartographicDegrees = [];
        obj.cartographicDegrees.push(point[i][1]);
        obj.cartographicDegrees.push(point[i][0]);

        var normalize = normalizeTime(strtoDate(geometry.datetimes[i]), min_max_date);
        if (with_height){
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
  }

  czml[0].clock = {
        "interval" : glo_start +"/" + glo_stop,
        "currentTime" : glo_start,
        "multiplier" : multiplier
  }

  LOG(czml);
  var load_czml = Cesium.CzmlDataSource.load(czml)
  viewer.dataSources.add(load_czml);
}


function strtoDate(str_date){
  var date_T = str_date.split("T");
  var ymd = date_T[0].split("-");
  var month = ymd[1];
  if (month.length == 1)
  {
    month = "0" + month;
  }

  if (ymd[2].length == 1)
  {
    ymd[2] = "0" + ymd[2];
  }

  var new_date = new Date(ymd[0]+"-"+month+"-"+ymd[2]+"T"+date_T[1]);
  return new_date;
}

function strtoisostr(str_date){
  var date_T = str_date.split("T");
  var ymd = date_T[0].split("-");
  var month = ymd[1];
  if (month.length == 1)
  {
    month = "0" + month;
  }

  if (ymd[2].length == 1)
  {
    ymd[2] = "0" + ymd[2];
  }

  var new_date = ymd[0]+"-"+month+"-"+ymd[2]+"T"+date_T[1];
  return new_date;
}
