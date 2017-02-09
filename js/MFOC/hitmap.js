var show3DHitMapMovingPoint = function(mf_arr,x_deg,y_deg,time_deg){//time_deg is seconds
  var min_max = findMinMaxCoordAndTimeInMFArray(mf_arr);

  var cube_data = [];
  var time_length = (min_max.date[1].getTime() - min_max.date[0].getTime())/(time_deg * 1000);
  var start = Cesium.JulianDate.fromDate(min_max.date[0]);

  var x_band = min_max.coord.x_max - min_max.coord.x_min;
  y_band = min_max.coord.y_max - min_max.coord.y_min;
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
    var property = new Cesium.SampledPositionProperty();
    if (geometry.interpolations == "Spline"){
      property.setInterpolationOptions({
        interpolationAlgorithm : Cesium.HermitePolynomialApproximation,
        interpolationDegree : 2
      });
    }
    for (var time = 0 ; time < datetimes.length ; time++){
      var jul_time = Cesium.JulianDate.fromDate(new Date(datetimes[time]));
      var normalize = normalizeTime(new Date(datetimes[time]), min_max.date);
      var position = {        x : geometry.coordinates[time][0],        y : geometry.coordinates[time][1]      };
      //Cesium.Cartesian2.fromElements(geometry.coordinates[time][0],geometry.coordinates[time][1]);
      property.addSample(jul_time, position);
    }

    for (var i = 0 ; i < time_length ; i++){
      var position = property.getValue(cube_data[i].time);

      if (position != undefined)
      {
      console.log(i, position);
      //  console.log(i, position);
        if (cube_data[i].count == undefined){
          var x = getCubeIndexFromSample(position.x, x_deg, min_max.coord.x_min);
          var y = getCubeIndexFromSample(position.y, y_deg, min_max.coord.y_min);
          cube_data[i].count[x][y] += 1;
          max_num = Math.max(cube_data[i].count[x][y],max_num);
        }

      }
    }
  }

  var cube_prim = makeCube(cube_data, min_max, x_deg, y_deg, max_num);


}

function getCubeIndexFromSample(value, deg, min){
  return Math.floor((value - min) / deg);
}


function makeCube(data,min_max, x_deg, y_deg, time_deg, max_num){
  var instances = [];
  for (var z = 0 ; z < data.length ; z++){
    var lower_iso_time = data[z].time.toString();
    var upper_iso_time = data[z+1].time.toString();
    for (var x = 0 ; x < data[z].count.length ; x++){
      for (var y = 0 ; y < data[z].count[x].length ; y++){
        var count = data[z].count[x][y];
        var lower_x = min_max.coord.x_min + x_deg * x;
        var upper_x = min_max.coord.x_min + x_deg * (x + 1);
        var lower_y = min_max.coord.y_min + y_deg * y;
        var lower_y = min_max.coord.y_min + y_deg * (y + 1);
        var lower = [lower_x, lower_y, normalizeTime(new Date(lower_iso_time), min_max.date)];
        var upper = [upper_x, upper_y, normalizeTime(new Date(upper_iso_time), min_max.date)];
        instances.push(drawOneCube(lower, upper, count/max_num));
      }
    }
  }
  return instances;
}
