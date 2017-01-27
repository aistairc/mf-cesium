var start_time_global;
var end_time_global;

function getMovingLineString(polyline1, timeline, polyline2, timeline2) { //in advanced, we put 3D points to this function.
    var point_list = calculateMovingPath(polyline1, polyline2);
    var point1;
    var point2;
    for (var j = 0; j < point_list.length - 1; j++) { //like number of movelines
        var start = Cesium.JulianDate.fromIso8601(timeline);
        var stop = Cesium.JulianDate.fromIso8601(timeline2);
        point1 = new Cesium.SampledPositionProperty();
        point1.addSample(start, Cesium.Cartesian3.fromDegrees(point_list[j][0][0], point_list[j][0][1], point_list[j][0][2]));
        point1.addSample(stop, Cesium.Cartesian3.fromDegrees(point_list[j][1][0], point_list[j][1][1], point_list[j][1][2]));
        point2 = new Cesium.SampledPositionProperty();
        point2.addSample(start, Cesium.Cartesian3.fromDegrees(point_list[j + 1][0][0], point_list[j + 1][0][1], point_list[j + 1][0][2]));
        point2.addSample(stop, Cesium.Cartesian3.fromDegrees(point_list[j + 1][1][0], point_list[j + 1][1][1], point_list[j + 1][1][2]));
        viewer.entities.add({
            polyline: {
                positions: new Cesium.PositionPropertyArray([point1, point2])
            }
        });
    }
    setClock(start, stop, 3000);
}

function getMovingAllPolygon(filename) {
    setDefaultClock();
    var start1 = findFastestTime(filename);
    var end1 = findLatestTime(filename);

    setClock(start1, end1, 3000);

    $.getJSON(filename, function(p_data) {
        for (var i = 0; i < p_data.features.length; i++) {
            getMovingPolygon(i, filename);
        }


    });

}

function getMovingAll() {
    setDefaultClock();
    if(polygon_all == true){
      polygon_all = false;
      $.getJSON("typhoon2015_buffer.json", function(p_data) {
          for (var i = 0; i < p_data.features.length; i++) {
              getMovingPolygon(i, "typhoon2015_buffer.json");
          }


      });
      $.getJSON("typhoon2016_buffer.json", function(p_data) {
          for (var i = 0; i < p_data.features.length; i++) {
              getMovingPolygon(i, "typhoon2016_buffer.json");
          }


      });
    }
    else{
      var start;
      var end;
      var start1 = findFastestTime("typhoon2015_buffer.json");
      var end1 = findLatestTime("typhoon2015_buffer.json");
      var start2 = findFastestTime("typhoon2016_buffer.json");
      var end2 = findLatestTime("typhoon2016_buffer.json");

      if (start1 > start2) {
          start = start2;
      } else {
          start = start1;
      }
      if (end1 > end2) {
          end = end1;
      } else {
          end = end2;
      }

      start_time_global = start;
      end_time_global = end;
      polygon_all = true;

      $.getJSON("typhoon2015_buffer.json", function(p_data) {
          for (var i = 0; i < p_data.features.length; i++) {
              getMovingPolygon(i, "typhoon2015_buffer.json");
          }


      });
      $.getJSON("typhoon2016_buffer.json", function(p_data) {
          for (var i = 0; i < p_data.features.length; i++) {
              getMovingPolygon(i, "typhoon2016_buffer.json");
          }


      });

      start = Cesium.JulianDate.fromDate(start);
      end = Cesium.JulianDate.fromDate(end);
      setClock(start,end,3000);
    }



}

function getMovingPolygon(radioItem, filename) {
    var filename_name = filename.toString();
    filename_name = filename_name.split(".")[0];
    var id = filename_name + radioItem.toString();

    $.getJSON(filename, function(p_data) {
        if (contains(selected_poly_radio, id)) {
            var already_selected = selected_poly_radio.indexOf(id);
            selected_poly_radio.splice(already_selected, 1);
            viewer.dataSources.removeAll();
            setDefaultClock();

        } else {
            selected_poly_radio.push(id);
            var gl_p_data = p_data;
            var one_ty = new Array();
            var timeline = new Array();
            var p_geo = gl_p_data.features[radioItem].temporalGeometry; //one typhoon
            var interpolation = p_geo.interpolations;
            var base = getTime2(p_geo.datetimes[0]);

            for (var j = 0; j < p_geo.coordinates.length; j++) {
                var one_poly = new Array();
                for (var k = 0; k < 9; k++) {
                    var one_point = new Array();
                    one_point.push(p_geo.coordinates[j][k][0]);
                    one_point.push(p_geo.coordinates[j][k][1]);
                    if (scene.mode == Cesium.SceneMode.COLUMBUS_VIEW) {
                        one_point.push((getTime2(p_geo.datetimes[j]) - base) * 3 / 1000);
                    } else {
                        one_point.push(0);
                    }
                    one_poly.push(one_point);
                }
                one_ty.push(one_poly);
            }
            var ty_new_point = new Array(); //get the polygon points for drawing interpolating.

            for (var i = 0; i < one_ty.length; i++) {

                ty_new_point.push(one_ty[i]);

                var base = getTime2(p_geo.datetimes[i]); //to change string time to javascript Date time
                timeline.push(base.toISOString());

            }
            czml_poly = [];
            var new_czml_poly = {};
            var color_info = {};
            var availability;
            if (polygon_all == true) {
                availability = start_time_global.toISOString();
                availability += "/";
                availability += end_time_global.toISOString();
            } else {
                availability = timeline[0].toString();
                availability += "/";
                availability += timeline[timeline.length - 1].toString();
            }

            new_czml_poly.id = "document";
            new_czml_poly.version = "1.0";
            new_czml_poly.name = "CZML polygon";

            czml_poly.push(new_czml_poly);
            new_czml_poly = {};
            new_czml_poly.id = "dynamicPolygon";
            new_czml_poly.availability = availability;
            new_czml_poly.polygon = {};

            new_czml_poly.polygon.positions = {};
            new_czml_poly.polygon.positions.references = [];
            new_czml_poly.polygon.perPositionHeight = true;
            new_czml_poly.polygon.material = {};
            new_czml_poly.polygon.material.solidColor = {};
            new_czml_poly.polygon.material.solidColor.color = [];
            new_czml_poly.polygon.positions.references = new Array();

            color_info.interval = availability;
            color_info.rgbaf = [1, 0, 1, 1];
            new_czml_poly.polygon.material.solidColor.color.push(color_info);
            czml_poly.push(new_czml_poly);

            for (var j = 0; j < 8; j++) {
                new_czml_poly = {};
                if (interpolation == "Spline" || interpolation == "Linear") {
                    new_czml_poly.id = "polygons" + j.toString();
                    new_czml_poly.position = {};
                    new_czml_poly.position.interval = availability;
                    new_czml_poly.position.epoch = timeline[0];
                    new_czml_poly.position.cartographicDegrees = [];
                    if (interpolation == "Spline") {
                        new_czml_poly.position.interpolationDegree = 2;
                        new_czml_poly.position.interpolationAlgorithm = "LAGRANGE";
                        for (var i = 0; i < ty_new_point.length; i++) {
                            new_czml_poly.position.cartographicDegrees.push(timeline[i]);
                            new_czml_poly.position.cartographicDegrees.push(ty_new_point[i][j][0], ty_new_point[i][j][1], ty_new_point[i][j][2]);

                        }
                        czml_poly.push(new_czml_poly);
                    } else if (interpolation == "Linear") {
                        new_czml_poly.position.interpolationAlgorithm = "LINEAR";
                        new_czml_poly.position.interpolationDegree = 1;
                        for (var i = 0; i < ty_new_point.length; i++) {
                            new_czml_poly.position.cartographicDegrees.push(timeline[i]);
                            new_czml_poly.position.cartographicDegrees.push(ty_new_point[i][j][0], ty_new_point[i][j][1], ty_new_point[i][j][2]);
                        }
                        czml_poly.push(new_czml_poly);
                    }
                } else {
                    for (var k = 0; k < ty_new_point.length; k++) {
                        new_czml_poly = {};
                        var availability_temp = timeline[k].toString();
                        availability_temp += "/";
                        if (interpolation == "Discrete") {
                            var next_time = changeISO2Date(timeline[k]);
                            next_time = new Date(next_time.getTime() + 10000000);
                            next_time = next_time.toISOString();
                            availability_temp += next_time.toString();
                        } else if (interpolation == "Stepwise") {
                            if (k == ty_new_point.length - 1) {
                                availability_temp += timeline[k].toString();
                            } else {
                                availability_temp += timeline[k + 1].toString();
                            }
                        }
                        new_czml_poly.id = "polygons" + j.toString() + k.toString();
                        new_czml_poly.position = {};
                        new_czml_poly.position.interval = availability_temp;
                        new_czml_poly.position.epoch = timeline[0];
                        new_czml_poly.position.cartographicDegrees = [];
                        new_czml_poly.position.interpolationAlgorithm = "LINEAR";
                        new_czml_poly.position.interpolationDegree = 1;
                        new_czml_poly.position.cartographicDegrees.push(ty_new_point[k][j][0], ty_new_point[k][j][1], ty_new_point[k][j][2]);
                        czml_poly.push(new_czml_poly);
                    }
                }
            }
            czml_poly[1].polygon.positions.references = [];
            if (interpolation == "Linear" || interpolation == "Spline") {
                for (var i = 0; i < 8; i++) {
                    var temp_id = "polygons" + i.toString();
                    czml_poly[1].polygon.positions.references.push(temp_id + "#position");
                }
            } else {
                for (var i = 0; i < 8; i++) {
                    for (var j = 0; j < ty_new_point.length; j++) {
                        var temp_id = "polygons" + i.toString() + j.toString();
                        czml_poly[1].polygon.positions.references.push(temp_id + "#position");
                    }
                }
            }


            viewer.dataSources.add(Cesium.CzmlDataSource.load(czml_poly));


        }
    });


}
