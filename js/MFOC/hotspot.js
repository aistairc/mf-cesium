MFOC.prototype.makeBasicCube = function(degree){
  var min_max = this.min_max;
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
  console.log(time_length);
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

MFOC.prototype.drawSpaceTimeCubeMovingPolygon = function(geometry, degree, cube_data){
  var min_max = this.min_max;

  var x_deg = degree.x,
  y_deg = degree.y,
  time_deg = degree.time;

  var time_length = (min_max.date[1].getTime() - min_max.date[0].getTime())/(time_deg * 1000);
  var start = Cesium.JulianDate.fromDate(min_max.date[0]);

  var x_band = min_max.x[1] - min_max.x[0],
  y_band = min_max.y[1] - min_max.y[0];

  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  var max_num = this.hotspot_maxnum;
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
    var normalize = MFOC.normalizeTime(new Date(datetimes[time]), this.min_max.date, this.max_height);

    var coordinates = geometry.coordinates[time];
    var mbr = MFOC.getMBRFromPolygon(coordinates);

    lower_x_property.addSample(jul_time, mbr.x[0]);
    upper_x_property.addSample(jul_time, mbr.x[1]);
    lower_y_property.addSample(jul_time, mbr.y[0]);
    upper_y_property.addSample(jul_time, mbr.y[1]);
  }

  for (var i = 0 ; i < time_length - 1 ; i++){
    var middle_time = Cesium.JulianDate.addSeconds(cube_data[i].time, time_deg/2, new Cesium.JulianDate());
    var mbr = {
      x : [],
      y : []
    };

    mbr.x[0] = lower_x_property.getValue(middle_time);
    mbr.x[1] = upper_x_property.getValue(middle_time);
    mbr.y[0] = lower_y_property.getValue(middle_time);
    mbr.y[1] = upper_y_property.getValue(middle_time);


    if (mbr.y[1] != undefined){
      var x_min = MFOC.getCubeIndexFromSample(mbr.x[0], x_deg, min_max.x[0]);
      var y_min = MFOC.getCubeIndexFromSample(mbr.y[0], y_deg, min_max.y[0]);
      var x_max = MFOC.getCubeIndexFromSample(mbr.x[1], x_deg, min_max.x[0]);
      var y_max = MFOC.getCubeIndexFromSample(mbr.y[1], y_deg, min_max.y[0]);

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

  this.hotspot_maxnum = Math.max(max_num,this.hotspot_maxnum);
}

MFOC.prototype.drawSpaceTimeCubeMovingPoint = function(geometry, degree, cube_data){
  var min_max = this.min_max;

  var x_deg = degree.x,
  y_deg = degree.y,
  time_deg = degree.time;

  var time_length = (min_max.date[1].getTime() - min_max.date[0].getTime())/(time_deg * 1000);
  var start = Cesium.JulianDate.fromDate(min_max.date[0]);


  var x_band = min_max.x[1] - min_max.x[0],
  y_band = min_max.y[1] - min_max.y[0];

  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  var max_num = this.hotspot_maxnum;
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

  for (var time = 0 ; time < datetimes.length ; time++){
    var jul_time = Cesium.JulianDate.fromDate(new Date(datetimes[time]));
    var position = {        x : geometry.coordinates[time][0],y : geometry.coordinates[time][1]      };

    x_property.addSample(jul_time, position.x);
    y_property.addSample(jul_time, position.y);
  }

  for (var i = 0 ; i < time_length - 1 ; i++){
    var middle_time = Cesium.JulianDate.addSeconds(cube_data[i].time,time_deg/2,new Cesium.JulianDate());
    var x_position = x_property.getValue(middle_time);
    var y_position = y_property.getValue(middle_time);

    if (x_position != undefined && y_position != undefined){
      var x = MFOC.getCubeIndexFromSample(x_position, x_deg, min_max.x[0]);
      var y = MFOC.getCubeIndexFromSample(y_position, y_deg, min_max.y[0]);
      cube_data[i].count[x][y] += 1;
      console.log(i,x,y);
      max_num = Math.max(cube_data[i].count[x][y],max_num);
    }
  }
  this.hotspot_maxnum = Math.max(max_num,this.hotspot_maxnum);
}

MFOC.prototype.drawSpaceTimeCubeMovingLineString = function(geometry, degree, cube_data){
  var min_max = this.min_max;

  var x_deg = degree.x,
  y_deg = degree.y,
  time_deg = degree.time;

  var time_length = (min_max.date[1].getTime() - min_max.date[0].getTime())/(time_deg * 1000);
  var start = Cesium.JulianDate.fromDate(min_max.date[0]);

  var x_band = min_max.x[1] - min_max.x[0],
  y_band = min_max.y[1] - min_max.y[0];

  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  var max_num = this.hotspot_maxnum;
  var datetimes = geometry.datetimes;

  var x_property = [];
  var y_property = [];

  for (var i = 0 ; i < 2 ; i++){
    x_property[i] = new Cesium.SampledProperty(Number);
    y_property[i] = new Cesium.SampledProperty(Number);
  }

  if (geometry.interpolations == "Spline"){
    for (var i = 0 ; i < 2 ; i++){
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
    var normalize = MFOC.normalizeTime(new Date(datetimes[time]), this.min_max.date, this.max_height);

    var coordinates = geometry.coordinates[time];

    for (var i = 0 ; i < 2 ; i++){
      x_property[i].addSample(jul_time, coordinates[(coordinates.length - 1) * i][0]);
      y_property[i].addSample(jul_time, coordinates[(coordinates.length - 1) * i][1]);
    }

  }

  for (var i = 0 ; i < time_length - 1 ; i++){
    var middle_time = Cesium.JulianDate.addSeconds(cube_data[i].time, time_deg/2, new Cesium.JulianDate());
    var x_value = [];
    var y_value = [];

    for (var j = 0 ; j < 2 ; j++){
      x_value[j] = x_property[j].getValue(middle_time);
      y_value[j] = y_property[j].getValue(middle_time);
    }

    if (x_value[0] != undefined && y_value[0] != undefined){
      var x_min = MFOC.getCubeIndexFromSample(x_value[0], x_deg, min_max.x[0]);
      var y_min = MFOC.getCubeIndexFromSample(y_value[0], y_deg, min_max.y[0]);
      var x_max = MFOC.getCubeIndexFromSample(x_value[1], x_deg, min_max.x[0]);
      var y_max = MFOC.getCubeIndexFromSample(y_value[1], y_deg, min_max.y[0]);

      cube_data[i].count[x_min][y_min] += 1;
      cube_data[i].count[x_max][y_max] += 1;

      max_num = Math.max(cube_data[i].count[x_min][y_min],max_num);
      max_num = Math.max(cube_data[i].count[x_max][y_max],max_num);
    }
  }
  this.hotspot_maxnum = Math.max(max_num,this.hotspot_maxnum);
}

MFOC.prototype.makeCube = function(degree, cube_data){
  var boxCollection = new Cesium.PrimitiveCollection();
  var num = 0;
  var data = cube_data;
  var min_max = this.min_max;

  var max_count = this.hotspot_maxnum;
  var x_deg = degree.x,
  y_deg = degree.y;

  for (var z = 0 ; z < data.length - 1 ; z++){

    var lower_time = MFOC.normalizeTime(new Date(data[z].time.toString()),this.min_max.date,this.max_height);
    var upper_time = MFOC.normalizeTime(new Date(data[z+1].time.toString()),this.min_max.date,this.max_height);

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


        var prim = MFOC.drawOneCube(positions, rating) ;
        boxCollection.add(prim);
        num += count;

      }

    }

    //  return boxCollection;
  }
  return boxCollection;
}

MFOC.getCubeIndexFromSample = function(value, deg, min){
  return Math.floor((value - min) / deg);
}
