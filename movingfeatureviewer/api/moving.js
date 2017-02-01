var Moving = function(){};

Moving.prototype.calculatePathForEachPoint =function(mls){

  var pre_polyline;
  var coord_arr = mls.temporalGeometry.coordinates;
  var next_mapping_point_arr = [];
  for (var i = 0; i < coord_arr.length ; i++){
    if (i == 0){
      pre_polyline = coord_arr[0];
      continue;
    }

    next_mapping_point_arr[i-1] = this.findMapping(pre_polyline, coord_arr[i]);

    pre_polyline = coord_arr[i];
  }

  return next_mapping_point_arr;
}

Moving.prototype.findMapping = function(line_1, line_2){
  var i=0,
  j=0;
  var array = [];
  array.push([line_1[0],line_2[0]]);
  while ( i < line_1.length - 1 && j < line_2.length - 1){
    var point_1 = line_1[i];
    var point_2 = line_2[j];

    var next_point_1 = line_1[i+1];
    var next_point_2 = line_2[j+1];

    var dist1 = calculateDist(point_1, next_point_2);
    var dist2 = calculateDist(point_2, next_point_1);

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



Moving.prototype.moveLineStringArray = function(mf_arr, with_height = 1){
  var multiplier = 10000;

  var czml = [{
    "id" : "document",
    "name" : "polyline_highligh",
    "version" : "1.0"
  }];

  var glo_start, glo_stop;
  glo_start = new Date(mf_arr[0].temporalGeometry.datetimes[0]);
  glo_stop = glo_start;

  var min_max_date = [];

  for (var id = 0 ; id < mf_arr.length ; id++){

    var geometry = mf_arr[id].temporalGeometry;
    var poly_min_max_date = findMinMaxTime(geometry.datetimes);
    if (poly_min_max_date[0] < new Date(global_start).getTime()){
      global_start = new Date(poly_min_max_date[0]);
    }
    if (poly_min_max_date[1] > new Date(global_stop).getTime()){
      global_stop = new Date(poly_min_max_date[1]);
    }

  }

  min_max_date = [global_start, global_stop];


  for (var d = 0 ; d < mf_arr.length ; d ++){

    var mls = mf_arr[d];
    var geometry = mls.temporalGeometry;
    var datetime = geometry.datetimes;
    var length = datetime.length;
    var next_mapping_point_arr = this.calculatePathForEachPoint(mls);

    if (geometry.interpolations == "Spline" || geometry.interpolations == "Linear")
    {


      var next_point_each_line = next_mapping_point_arr;
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

        var height_1 = normalizeTime(new Date(datetime[i]),min_max_date);//this.height_collection[id][i] * with_height;
        var height_2 = normalizeTime(new Date(datetime[i+1]),min_max_date);//this.height_collection[id][i+1] * with_height ;
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

        var v = {};
        v.id ="polyline_"+id+"_"+i;
        v.availability = start_iso+"/"+finish_iso;

        var carto = [];
        var normalize = normalizeTime(new Date(geometry.datetimes[i]), min_max_date);//this.height_collection[id][i];

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
    "interval" : glo_start.toISOString() + "/" + glo_stop.toISOString(),
    "currentTime" : glo_start.toISOString(),
    "multiplier" : multiplier
  }
}

Moving.prototype.movePointArray = function(mf_arr, with_height = 1 ){
  var multiplier = 10000;
  var czml = [{
    "id" : "document",
    "name" : "point_highlight",
    "version" : "1.0"
  }];

  var glo_start, glo_stop;
  glo_start = new Date(mf_arr[0].temporalGeometry.datetimes[0]);
  glo_stop = glo_start;

  var min_max_date = [];

  for (var id = 0 ; id < mf_arr.length ; id++){

    var geometry = mf_arr[id].temporalGeometry;
    var poly_min_max_date = findMinMaxTime(geometry.datetimes);
    if (poly_min_max_date[0] < new Date(glo_start).getTime()){
      glo_start = new Date(poly_min_max_date[0]);
    }
    if (poly_min_max_date[1] > new Date(glo_stop).getTime()){
      glo_stop = new Date(poly_min_max_date[1]);
    }

  }

  min_max_date = [glo_start, glo_stop];

  czml[0].clock = {
    "interval" : glo_start.toISOString() +"/" + glo_stop.toISOString(),
    "currentTime" : glo_start.toISOString(),
    "multiplier" : multiplier
  }

  for (var p_id = 0 ; p_id < mf_arr.length ; p_id++){

    var geometry = mf_arr[p_id].temporalGeometry;

    var length = geometry.datetimes.length;
    var start, stop;
    start = strtoisostr(geometry.datetimes[0]);
    stop = strtoisostr(geometry.datetimes[length - 1]);

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
        var normalize = normalizeTime(new Date(geometry.datetimes[i]), min_max_date);
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


  return czml;
}

var findMinMaxTime_point = function(datetimes){
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


Moving.prototype.movePolygonArray = function(mf_arr, with_height = 1 ){

  if (Array.isArray(mf_arr) == false){
    var mf = mf_arr;
    mf_arr = [];
    mf_arr.push(mf);
  }

  var czml = [{
    "id" : "document",
    "name" : "polygon_highlight",
    "version" : "1.0"
  }];
  var multiplier = 10000;

  var global_availabilty, global_start, global_stop;


  global_start = new Date(mf_arr[0].temporalGeometry.datetimes[0]);
  global_stop = global_start;
  var min_max_date = [];

  for (var id = 0 ; id < mf_arr.length ; id++){

    var geometry = mf_arr[id].temporalGeometry;
    var poly_min_max_date = findMinMaxTime(geometry.datetimes);
    if (poly_min_max_date[0] < new Date(global_start).getTime()){
      global_start = new Date(poly_min_max_date[0]);
    }
    if (poly_min_max_date[1] > new Date(global_stop).getTime()){
      global_stop = new Date(poly_min_max_date[1]);
    }

  }

  min_max_date = [global_start, global_stop];
  console.log(min_max_date);

  for (var id = 0 ; id < mf_arr.length ; id++){

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

    var geometry = mf_arr[id].temporalGeometry;
    var length = geometry.datetimes.length;

    var start, stop;
    start = new Date(geometry.datetimes[0]).toISOString();
    stop = new Date(geometry.datetimes[length-1]).toISOString();
    var availability = start + "/" + stop;
    ref_obj.availability = availability;

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

        var v = {};
        v.id ="polygon_"+id+"_"+i;
        v.availability = start_iso+"/"+finish_iso;
        var carto = [];
        var normalize = normalizeTime(new Date(geometry.datetimes[i]), min_max_date);
        var polygon = geometry.coordinates[i];
        for (var j = 0 ; j < polygon.length-1 ; j++){
          carto.push(polygon[j][0]);
          carto.push(polygon[j][1]);
          if (with_height == 1)
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
    "interval" : global_start.toISOString()+"/"+global_stop.toISOString(),
    "currentTime" : global_start.toISOString(),
    "multiplier" : multiplier
  }
  return czml;
}
