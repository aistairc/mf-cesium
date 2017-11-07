
Stinuum.OccurrenceMap.prototype.show = function(degree){
  var min_max = this.super.mfCollection.min_max;
  if (degree == undefined){
    degree = {};
    degree.x = 5;
    degree.y = 5;
  }

  if (this.super.mode == 'SPACETIME'){
    if (degree.time == undefined) degree.time = (min_max.date[1].getTime() - min_max.date[0].getTime()) / (1000 * 10 * 86400);

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
    let cube_data = this.makeBasicCube(degree);
    if (cube_data == -1){
      alert("too large degree");
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
    if (map_data == -1){
      alert("too large degree");
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

//Discrete, TODO
Stinuum.OccurrenceMap.prototype.draw2DHeatMapMovingPolygon = function(geometry, degree, map_data){
  var min_max = this.super.mfCollection.min_max;

  var x_deg = degree.x,
  y_deg = degree.y;

  var x_band = min_max.x[1] - min_max.x[0],
  y_band = min_max.y[1] - min_max.y[0];

  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  var max_num = this.max_num;
  var datetimes = geometry.datetimes;
  
  var temp_map = [];
  for (var x = 0 ; x < x_length ; x++){
    temp_map[x] = [];
    for (var y = 0 ; y < y_length ; y++){
      temp_map[x][y] = 0;
    }
  }

  for (var i = 0 ; i < geometry.coordinates.length ; i++){
    var coords = geometry.coordinates[i][0];
    for (var j = 0 ; j < coords.length; j++){
      var x = coords[j][0];
      var y = coords[j][1];
      var x_index = Stinuum.getCubeIndexFromSample(x, x_deg, min_max.x[0]);
      var y_index = Stinuum.getCubeIndexFromSample(y, y_deg, min_max.y[0]);
      if (temp_map[x_index][y_index] == 0) temp_map[x_index][y_index] = 1;
    }
  }

  for (var i = 0 ; i < x_length ; i++){
    for (var j = 0 ; j < y_length; j++){
      if (temp_map[i][j] == 1) map_data[i][j] += 1;
      max_num = Math.max(map_data[i][j],max_num);
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

  if (geometry.interpolations == "Discrete"){

    for (var i = 0 ; i < geometry.coordinates.length ; i++){
      var coord = geometry.coordinates[i];
      var x_index = Stinuum.getCubeIndexFromSample(coord[0] , x_deg, min_max.x[0]);
      var y_index = Stinuum.getCubeIndexFromSample(coord[1], y_deg, min_max.y[0]);
      map_data[x_index][y_index] += 1;
      max_num = Math.max(map_data[x_index][y_index],max_num);
    }

  }
  else{
    var temp_map = [];
    for (var x = 0 ; x < x_length ; x++){
      temp_map[x] = [];
      for (var y = 0 ; y < y_length ; y++){
        temp_map[x][y] = 0;
      }
    }

    for (var i = 0 ; i < geometry.coordinates.length ; i++){
      var coords = geometry.coordinates[i];
      var x = coords[0];
      var y = coords[1];
      var x_index = Stinuum.getCubeIndexFromSample(x, x_deg, min_max.x[0]);
      var y_index = Stinuum.getCubeIndexFromSample(y, y_deg, min_max.y[0]);
      if (temp_map[x_index][y_index] == 0) temp_map[x_index][y_index] = 1;
    }

    for (var i = 0 ; i < x_length ; i++){
      for (var j = 0 ; j < y_length; j++){
        if (temp_map[i][j] == 1) map_data[i][j] += 1;
        max_num = Math.max(map_data[i][j],max_num);
      }
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
      if (count == 0 ) continue;
      var rating = count/max_count;
      if (rating < 0.05){
        let blue = -20 * rating + 1.0;
        var color = new Cesium.Color(0, 0, blue, blue);
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
      else if (rating > 0.1){
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

  let base_map = [];
  var min_max = this.super.mfCollection.min_max;

  var x_band = min_max.x[1] - min_max.x[0],
  y_band = min_max.y[1] - min_max.y[0];

  if (x_band < x_deg || y_band < y_deg) return -1;

  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);


  for (var x = 0 ; x < x_length ; x++){
    let x_arr = [];
    for (var y = 0 ; y < y_length ; y++){
      x_arr.push(0);
    }
    base_map.push(x_arr);
  }

  return base_map;
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
  var min_max = this.super.mfCollection.findMinMaxGeometry();

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

  if (geometry.interpolations == "Spline" || geometry.interpolations == "Linear"){
    var sample_list = Stinuum.getSampleProperties_Polygon(geometry);
    
    var polygon_size = geometry.coordinates[0][0].length;

    for (var i = 0 ; i < time_length - 1 ; i++){
      var middle_time = Cesium.JulianDate.addSeconds(cube_data[i].time, time_deg/2, new Cesium.JulianDate());
      var time = [cube_data[i].time, middle_time, cube_data[i+1].time];

      for (var ti = 0 ; ti <time.length ; ti++){
        var x_min = x_length + 1;
        var y_min = y_length + 1;
        var x_max = -1;
        var y_max = -1;
        for (var index = 0 ; index < polygon_size ; index++){
          var sample_coord = sample_list[index].getValue(time[ti]);
          if (sample_coord == undefined){
            //LOG("undefined");
            continue;
          }

          var long = Cesium.Math.DEGREES_PER_RADIAN * (Cesium.Cartographic.fromCartesian(sample_coord).longitude);
          var lat = Cesium.Math.DEGREES_PER_RADIAN * (Cesium.Cartographic.fromCartesian(sample_coord).latitude);
          if (long < 0) long += 180;

          var x = Stinuum.getCubeIndexFromSample(long, x_deg, min_max.x[0]);
          var y = Stinuum.getCubeIndexFromSample(lat , y_deg, min_max.y[0]);
          
          if (x < 0 || y < 0 || x > x_length || y > y_length){
            LOG(x,y);
            LOG(min_max)
            LOG(Cesium.Math.DEGREES_PER_RADIAN * Cesium.Cartographic.fromCartesian(sample_coord).longitude,
             Cesium.Math.DEGREES_PER_RADIAN * (Cesium.Cartographic.fromCartesian(sample_coord).latitude));
            LOG(x_deg);
            throw new Error("Wrong sampling");
          }

          if (x < x_min) x_min = x;
          if (y < y_min) y_min = y;
          if (x > x_max) x_max = x;
          if (y > y_max) y_max = y;
        }

        if (x_min == x_length + 1 && y_max == -1){
          continue;
        }

        for (var x_i = x_min ; x_i <= x_max ; x_i++){
          for (var y_i = y_min ; y_i <= y_max ; y_i++){
            cube_data[i].count[x_i][y_i] += 1;
            max_num = Math.max(cube_data[i].count[x_i][y_i],max_num);
          }
        }

      }

    }
  }
  else{
    //TODO : DISCRETE
  }
  this.max_num = Math.max(max_num, this.max_num);
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
  var datetimes = geometry.datetimes;


  if (geometry.interpolations == "Spline" || geometry.interpolations == "Linear"){
    var property;
    property = Stinuum.getSampleProperty_Point(geometry);
    for (var i = 0 ; i < time_length - 1 ; i++){
      var middle_time = Cesium.JulianDate.addSeconds(cube_data[i].time, time_deg/2 ,new Cesium.JulianDate());
      var time = [cube_data[i].time, middle_time, cube_data[i+1].time];

      for (var ti = 0 ; ti <time.length ; ti++){
        var sample_coord = property.getValue(time[ti]);
        if (sample_coord != undefined){
          var x = Stinuum.getCubeIndexFromSample(Cesium.Math.DEGREES_PER_RADIAN * (Cesium.Cartographic.fromCartesian(sample_coord).longitude), x_deg, min_max.x[0]);
          var y = Stinuum.getCubeIndexFromSample(Cesium.Math.DEGREES_PER_RADIAN * (Cesium.Cartographic.fromCartesian(sample_coord).latitude), y_deg, min_max.y[0]);
          cube_data[i].count[x][y] += 1;
          max_num = Math.max(cube_data[i].count[x][y],max_num);
        }
      }
    }
  }
  else{
    for (var i = 0 ; i < geometry.coordinates.length ; i++){
      var coord = geometry.coordinates[i];
      let time_value = new Date(geometry.datetimes[i]);
      var time_index = Stinuum.getCubeIndexFromSample(time_value.getTime(), time_deg * 1000, min_max.date[0].getTime());
      var x_index = Stinuum.getCubeIndexFromSample(coord[0], x_deg, min_max.x[0]);
      var y_index = Stinuum.getCubeIndexFromSample(coord[1], y_deg, min_max.y[0]);
      cube_data[time_index].count[x_index][y_index] += 1;
      max_num = Math.max(cube_data[time_index].count[x_index][y_index],max_num);
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
