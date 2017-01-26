function PointJSON(data_path, viewer){
  this.data_path = data_path;
  this.data;
  this.viewer = viewer;
  this.is_exist_2d = false;
  this.is_exist_3d = false;
  this.collection_2d = [];
  this.collection_3d = [];
  this.color_arr = [];
  this.pre_czml;

  this.loadJsonAndMakePrimitive = function(){
    var this_object = this;
    return Cesium.loadJson(this.data_path).then(function(data){
    this_object.viewer.clear();
    this_object.data = data;
    for (var i=0;i< data.length ; i++){

      var r_color = Cesium.Color.fromRandom({
        red : 0.0,
        minimumBlue : 0.2,
        minimumGreen : 0.2,
        alpha : 1.0
      })

      this_object.color_arr.push(r_color);

      addRowtoTable.apply(this,[data[i].properties.name, r_color, i]);

      var positions =[];
      positions.push(PointJSON.getPosition3d(data[i].temporalGeometry));

      this_object.collection_3d.push(makePolylineCollection(positions,r_color));

      var positions2 =[];
      positions2.push(PointJSON.getPosition2d(data[i].temporalGeometry));

      this_object.collection_2d.push(makePolylineCollection(positions2,r_color));
    }

//    showPoint();


  }).otherwise(function(error){
      console.log(error);
    });

  };
}



PointJSON.getPosition3d = function(geometry){
  var posi_arr = [];

  for ( var j = 0 ; j < geometry.coordinates.length ; j++ ){
    posi_arr.push(geometry.coordinates[j][1]);
    posi_arr.push(geometry.coordinates[j][0]);
    var str_date = geometry.datetimes[j];
    var new_date = strtoDate(str_date);
    //console.log(ymd[0]+"-"+month+"-"+ymd[2]+"T"+date_T[1]);
    posi_arr.push( (new_date.getTime() - 1467400000000)/1000);

  }

  return posi_arr;

}

PointJSON.getPosition2d = function(geometry){
  var posi_arr = [];

  for ( var j = 0 ; j < geometry.coordinates.length ; j++ ){
    posi_arr.push(geometry.coordinates[j][1]);
    posi_arr.push(geometry.coordinates[j][0]);
    posi_arr.push(1000);
  }

  return posi_arr;

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

/*
PointJSON.prototype.highlight = function(_id){

  //turn red
  var pre_point_collection = this.collection_2d[_id];
  var positions2 =[];
  positions2.push(PointJSON.getPosition2d(this.data[_id].temporalGeometry));
  var point_highlight = makePolylineCollection(positions2,Cesium.Color.RED);
  this.collection_2d[_id] = point_highlight;


  var this_object = this;
  showPoint();
  this_object.collection_2d[_id] = pre_point_collection;

}
*/

function show_time_point(entity){

  for (var i = 0 ; i< selectedTime.length ; i++){
    viewer.entities.remove(selectedTime[i]);
  }
  selectedTime = [];
  for (var i = 0; i < entity.timestamp.length; i++){

    var this_time = viewer.entities.add({
      position : entity.polyline.positions.getValue()[i],
      label : {
        text : entity.timestamp[i],
        font : '8pt Helvetica',
        fillColor : Cesium.Color.WHITE,
        horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
        pixelOffset : new Cesium.Cartesian2(20, 0)
      }
    });

    selectedTime.push(this_time);

  }


}

PointJSON.prototype.animate_czml = function(p_id_arr, with_height){
  var multiplier = 10000;
  var viewer = this.viewer;
  LOG(viewer.dataSources);
  viewer.dataSources.removeAll();
  var czml = [{
      "id" : "document",
      "name" : "point_highlight",
      "version" : "1.0"
  }];

  var glo_start, glo_stop;
  glo_start = strtoisostr(this.data[p_id_arr[0]].temporalGeometry.datetimes[0]);
  glo_stop = glo_start;

  for (var id_index = 0 ; id_index < p_id_arr.length ; id_index++){
    var p_id = p_id_arr[id_index];
    var geometry = this.data[p_id].temporalGeometry;
    LOG(geometry);
    var min_max_date = [];
    min_max_date = findMinMaxTime(geometry.datetimes);

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
          carto.push(normalize * with_height);
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
          obj.cartographicDegrees.push(normalize * with_height);
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
  this.viewer.dataSources.add(load_czml);
}

/*
PointJSON.prototype.computePath_point = function(p_id){
  var property = new Cesium.SampledPositionProperty();
  var positions = PointJSON.getPosition2d(this.data[p_id].temporalGeometry);

    positions = PointJSON.getPosition3d(this.data[p_id].temporalGeometry);
  var carte_positions = Cesium.Cartesian3.fromDegreesArrayHeights(positions);
  for (var i = 0 ; i < carte_positions.length ; i++){
    var time = Cesium.JulianDate.fromIso8601(strtoisostr(this.data[p_id].temporalGeometry.datetimes[i]));
    var position = carte_positions[i];

    property.addSample(time, position);
  }
  return property;
}


PointJSON.prototype.animate = function(p_id){
  if (anime_entity != null){
    this.viewer.entities.remove(anime_entity);
  }

  var position = this.computePath_point(p_id);

  console.log(position);
  var entity = viewer.entities.add({
    availability : new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
            start : Cesium.JulianDate.fromIso8601(strtoisostr(this.data[p_id].temporalGeometry.datetimes[0])),
            stop : Cesium.JulianDate.fromIso8601(strtoisostr(this.data[p_id].temporalGeometry.datetimes[this.data[p_id].temporalGeometry.datetimes.length -1]))
        })]),
    point : {
      pixelSize : 20,
      color : Cesium.Color.BLACK,
      outlineColor : Cesium.Color.WHITE,
      outlineWidth : 5,
      show : true
    },
    position : position,
    orientation : new Cesium.VelocityOrientationProperty(position)
  });

  entity.position.setInterpolationOptions({
          interpolationDegree : 1,
          interpolationAlgorithm : Cesium.LinearApproximation
  });

  console.log(entity);
  viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(strtoisostr(this.data[p_id].temporalGeometry.datetimes[0]));
  viewer.clock.stopTime = Cesium.JulianDate.fromIso8601(strtoisostr(this.data[p_id].temporalGeometry.datetimes[this.data[p_id].temporalGeometry.datetimes.length -1]));

  viewer.clock.multiplier = 15000;

  anime_entity = entity;
}
*/
