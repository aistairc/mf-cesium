
OccurrenceMap.prototype.show = function(degree){
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

OccurrenceMap.prototype.remove = function(){
  if (this.primitive !=  null){
    this.super.cesiumViewer.scene.primitives.remove(this.primitive);
    this.primitive = null;
  }
}


OccurrenceMap.prototype.draw2DHeatMapMovingPolygon = function(geometry, degree, map_data){
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

OccurrenceMap.prototype.draw2DHeatMapMovingLineString = function(geometry, degree, map_data){
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

OccurrenceMap.prototype.draw2DHeatMapMovingPoint = function(geometry, degree, map_data){
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

OccurrenceMap.prototype.makeMap = function(degree, map_data){
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


OccurrenceMap.prototype.makeBasicMap = function(degree){
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

OccurrenceMap.prototype.makeBasicCube = function(degree){
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

OccurrenceMap.prototype.draw3DHeatMapMovingPolygon = function(geometry, degree, cube_data){
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

OccurrenceMap.prototype.draw3DHeatMapMovingPoint = function(geometry, degree, cube_data){
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

OccurrenceMap.prototype.draw3DHeatMapMovingLineString = function(geometry, degree, cube_data){
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

OccurrenceMap.prototype.makeCube = function(degree, cube_data){
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

        var positions = new BoxCoord();
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
