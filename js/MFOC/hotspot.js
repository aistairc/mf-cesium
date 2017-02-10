var show3DHotSpotMovingPoint = function(mf_arr,x_deg,y_deg,time_deg, max_height = 15000000){//time_deg is seconds

  var min_max = findMinMaxCoordAndTimeInMFArray(mf_arr);

  var cube_data = [];
  var time_length = (min_max.date[1].getTime() - min_max.date[0].getTime())/(time_deg * 1000);
  var start = Cesium.JulianDate.fromDate(min_max.date[0]);

  var x_band = min_max.coord.max_x - min_max.coord.min_x,
  y_band = min_max.coord.max_y - min_max.coord.min_y;
  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  console.log(x_length, y_length);
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

  var max_num = 0;
//  console.log(cube_data);
  for (var mf = 0 ; mf < mf_arr.length ; mf++){
    var geometry = mf_arr[mf].temporalGeometry;
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
      var position = {        x : geometry.coordinates[time][0],
                              y : geometry.coordinates[time][1]      };

      x_property.addSample(jul_time, position.x);
      y_property.addSample(jul_time, position.y);
    }

    for (var i = 0 ; i < time_length - 1 ; i++){
      var middle_time = Cesium.JulianDate.addSeconds(cube_data[i].time,
                        time_deg/2,
                        new Cesium.JulianDate());
      var x_position = x_property.getValue(middle_time);
      var y_position = y_property.getValue(middle_time);

      if (x_position != undefined && y_position != undefined)
      {
        var x = getCubeIndexFromSample(x_position, x_deg, min_max.coord.min_x);
        var y = getCubeIndexFromSample(y_position, y_deg, min_max.coord.min_y);

        cube_data[i].count[x][y] += 1;
        max_num = Math.max(cube_data[i].count[x][y],max_num);
      }
    }
  }

  var cube_prim = makeCube(cube_data, min_max, x_deg, y_deg, max_num, max_height);

    console.log(max_num);
  return cube_prim;
}

function getCubeIndexFromSample(value, deg, min){
  return Math.floor((value - min) / deg);
}

var show3DHotSpotMovingPolygon = function(mf_arr,x_deg,y_deg,time_deg, max_height = 15000000){//time_deg is seconds

  var min_max = findMinMaxCoordAndTimeInMFArray(mf_arr);

  var cube_data = [];
  var time_length = (min_max.date[1].getTime() - min_max.date[0].getTime())/(time_deg * 1000);
  var start = Cesium.JulianDate.fromDate(min_max.date[0]);

  var x_band = min_max.coord.max_x - min_max.coord.min_x,
  y_band = min_max.coord.max_y - min_max.coord.min_y;
  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

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

  var max_num = 0;
  //  console.log(cube_data);
  for (var mf = 0 ; mf < mf_arr.length ; mf++){
    var geometry = mf_arr[mf].temporalGeometry;
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
      var normalize = normalizeTime(new Date(datetimes[time]), min_max.date, max_height);

      var coordinates = geometry.coordinates[time];
      var mbr = getMBRFromPolygon(coordinates);

      lower_x_property.addSample(jul_time, mbr.min_x);
      upper_x_property.addSample(jul_time, mbr.max_x);
      lower_y_property.addSample(jul_time, mbr.min_y);
      upper_y_property.addSample(jul_time, mbr.max_y);
    }

    for (var i = 0 ; i < time_length - 1 ; i++){
      var middle_time = Cesium.JulianDate.addSeconds(cube_data[i].time,
                        time_deg/2,
                        new Cesium.JulianDate());
      var mbr = {};
      mbr.min_x = lower_x_property.getValue(middle_time);
      mbr.max_x = upper_x_property.getValue(middle_time);
      mbr.min_y = lower_y_property.getValue(middle_time);
      mbr.max_y = upper_y_property.getValue(middle_time);


      if (mbr.max_y != undefined){
        var x_min = getCubeIndexFromSample(mbr.min_x, x_deg, min_max.coord.min_x);
        var y_min = getCubeIndexFromSample(mbr.min_y, y_deg, min_max.coord.min_y);
        var x_max = getCubeIndexFromSample(mbr.max_x, x_deg, min_max.coord.min_x);
        var y_max = getCubeIndexFromSample(mbr.max_y, y_deg, min_max.coord.min_y);

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

  console.log(max_num);

  var cube_prim = makeCube(cube_data, min_max, x_deg, y_deg, max_num, max_height);

  return cube_prim;
}


function makeCube(data,min_max, x_deg, y_deg, max_count, max_height){
  var boxCollection = new Cesium.PrimitiveCollection();
  var num = 0;


  for (var z = 0 ; z < data.length - 1 ; z++){

    var lower_time = normalizeTime(new Date(data[z].time.toString()),min_max.date,max_height);
    var upper_time = normalizeTime(new Date(data[z+1].time.toString()),min_max.date,max_height);

    for (var x = 0 ; x < data[z].count.length ; x++){
      for (var y = 0 ; y < data[z].count[x].length ; y++){
        var count = data[z].count[x][y];
        var positions = new BoxCoord();
        positions.minimum.x = min_max.coord.min_x + x_deg * x;
        positions.maximum.x = min_max.coord.min_x + x_deg * (x + 1);
        positions.minimum.y = min_max.coord.min_y + y_deg * y;
        positions.maximum.y = min_max.coord.min_y + y_deg * (y + 1);
        positions.minimum.z = lower_time;
        positions.maximum.z = upper_time;

        var rating = count/max_count;
        if (rating < 0.1){
          continue;
          //rating = 0.1;
        }


        var prim = drawOneCube(positions, rating) ;

        boxCollection.add(prim);
        num++;

      }

    }

    //  return boxCollection;
  }


  return boxCollection;
}
