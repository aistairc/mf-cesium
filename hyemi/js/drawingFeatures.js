function drawPolygon(filename, label_id, typhoonCollection) {
    var one_ty;
    var new_line;
    var new_point;
    var name_list = [];
    var p_ty = new Array();
    printNames(filename, label_id);
    $.getJSON(filename, function(p_data) {
        gl_p_data = p_data;
        for (var i = 0; i < gl_p_data.features.length; i++) {
            name_list.push(gl_p_data.features[i].properties.name);
        }


        if (scene.mode == Cesium.SceneMode.COLUMBUS_VIEW) {

            for (var i = 0; i < gl_p_data.features.length; i++) {
                one_ty = new Array();
                var p_geo = gl_p_data.features[i].temporalGeometry; //one typhoon
                var base = p_geo.datetimes[0].split(" ");
                var base_J = Cesium.JulianDate.fromIso8601(base[0] + "T" + base[1] + "Z");
                for (var k = 0; k < 9; k++) { //lines
                    new_line = new Array();
                    for (var j = 0; j < p_geo.coordinates.length; j++) {
                        new_point = new Array();
                        var temp_time = p_geo.datetimes[j].split(" ");
                        var temp_time_J = Cesium.JulianDate.fromIso8601(temp_time[0] + "T" + temp_time[1] + "Z");

                        new_point.push(p_geo.coordinates[j][k][0]);
                        new_point.push(p_geo.coordinates[j][k][1]);
                        new_point.push(Cesium.JulianDate.secondsDifference(temp_time_J, base_J) * 3);

                        new_line.push(new_point);
                    }
                    one_ty.push(new_line);
                }
                p_ty.push(one_ty);
            }

            var poly_list;
            var typhoon_poly;
            for (var i = 0; i < name_list.length; i++) { // one typ
                poly_list = new Array();
                for (var j = 0; j < 8; j++) { //line searching with 2

                    for (var k = 0; k < p_ty[i][j].length - 1; k++) {
                        var temp_poly = new Array();
                        var first = p_ty[i][j][k];
                        var sec = p_ty[i][j + 1][k];
                        var third = p_ty[i][j + 1][k + 1];
                        var forth = p_ty[i][j][k + 1];
                        temp_poly.push(first[0], first[1], first[2], sec[0], sec[1], sec[2], third[0], third[1], third[2], forth[0], forth[1], forth[2]);
                        var temp_instance = new Cesium.GeometryInstance({
                            geometry: new Cesium.PolygonGeometry({
                                polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(temp_poly)),
                                perPositionHeight: true,
                            }),
                            attributes: {
                                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.ORANGE.withAlpha(0.3))
                            }
                        });
                        poly_list.push(temp_instance);
                    }
                }
                typhoon_poly = new Cesium.Primitive({
                    id: name_list[i],
                    geometryInstances: poly_list,
                    appearance: new Cesium.PerInstanceColorAppearance({

                    })
                });
                typhoonCollection.add(typhoon_poly);
            }
            viewer.scene.primitives.add(typhoonCollection);

        } else {
            gl_p_data = p_data;
            for (var i = 0; i < gl_p_data.features.length; i++) {
                one_ty = new Array();
                var p_geo = gl_p_data.features[i].temporalGeometry; //one typhoon
                for (var k = 0; k < 9; k++) { //lines
                    new_line = new Array();
                    for (var j = 0; j < p_geo.coordinates.length; j++) {
                        new_point = new Array();
                        new_point.push(p_geo.coordinates[j][k][0]);
                        new_point.push(p_geo.coordinates[j][k][1]);
                        new_line.push(new_point);
                    }
                    one_ty.push(new_line);
                }
                p_ty.push(one_ty);
            }
            var poly_list;
            var typhoon_poly;
            for (var i = 0; i < name_list.length; i++) { // one typ
                poly_list = new Array();
                for (var j = 0; j < 8; j++) { //line searching with 2
                    for (var k = 0; k < p_ty[i][j].length - 1; k++) { //the number of poly in one typhoon
                        var temp_poly = new Array();
                        var first = p_ty[i][j][k];
                        var sec = p_ty[i][j + 1][k];
                        var third = p_ty[i][j + 1][k + 1];
                        var forth = p_ty[i][j][k + 1];
                        temp_poly.push(first[0], first[1], sec[0], sec[1], third[0], third[1], forth[0], forth[1]);

                        var temp_instance = new Cesium.GeometryInstance({
                            geometry: new Cesium.PolygonGeometry({
                                polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(temp_poly)),
                                perPositionHeight: true
                            }),
                            attributes: {
                                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.ORANGE.withAlpha(0.3))
                            }
                        });
                        poly_list.push(temp_instance);
                    }

                }
                typhoon_poly = new Cesium.Primitive({
                    id: name_list[i],
                    geometryInstances: poly_list,
                    appearance: new Cesium.PerInstanceColorAppearance()
                });
                typhoonCollection.add(typhoon_poly);
            }
        }
        //viewer.scene.primitives.add(typhoonCollection);

    });
}

function drawOnePolygon(datetime, typhoonNum, filename) {
    var p_id = datetime;
    p_id += "_";
    p_id += typhoonNum;
    if(viewer.entities.getById(p_id)){
      viewer.entities.remove(viewer.entities.getById(p_id));
    }
    else{
      $.getJSON(filename, function(p_data) {

          var hover = p_data.features[typhoonNum];
          var time = hover.temporalGeometry.datetimes;
          if(!datetime.includes(":")){
            var time_stamp = datetime.toString() + " 00:00:00";
          }
          else{
            var time_stamp = datetime.toString() + ":00";
          }

          var target_index = time.indexOf(time_stamp);

          var poly_coordinate = hover.temporalGeometry.coordinates[target_index];
          var points = [];


          if (scene.mode == Cesium.SceneMode.COLUMBUS_VIEW) {
              for (var i = 0; i < poly_coordinate.length; i++) {
                  var base_time = getTime2(time[0]);
                  var target_time = getTime2(time_stamp);
                  var height = (target_time - base_time)*3/1000;
              
                  points.push(poly_coordinate[i][0]);
                  points.push(poly_coordinate[i][1]);
                  points.push(height);
              }

              viewer.entities.add({
                  id: p_id,
                  polygon: {
                      hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(points),
                      material: Cesium.Color.RED,
                      perPositionHeight: true,
                  }
              });
          } else {
              for (var i = 0; i < poly_coordinate.length; i++) {
                  points.push(poly_coordinate[i][0]);
                  points.push(poly_coordinate[i][1]);
              }

              viewer.entities.add({
                  id: p_id,
                  polygon: {
                      hierarchy: Cesium.Cartesian3.fromDegreesArray(points),
                      material: Cesium.Color.RED
                  }
              });
          }

      });
    }



}

function drawline(filename, label_id, lineCollection) {
    $.getJSON(filename, function(data) {
        gl_data = data;
        //make PolylineCollection for containing several polylines.
        var line_list = [];
        var line_time_list = [];
        var point_list = [];

        if (scene.mode == Cesium.SceneMode.COLUMBUS_VIEW) {
          for (var i = 0; i < gl_data.length; i++) {
              line_list = [];
              line_time_list = [];
              point_list = [];

              line_list = data[i].temporalGeometry.coordinates;
              line_time_list = data[i].temporalGeometry.datetimes;
              name_list[i] = data[i].properties.name;

              var base_time = data[i].temporalGeometry.datetimes[0]; //the basetime we will use for nomalization of datetimes
              base_time = getTime(base_time);

              for (var j in line_list) {
                  point_list[3 * j] = line_list[j][1];
                  point_list[3 * j + 1] = line_list[j][0];
                  point_list[3*j +2] = (getTime(line_time_list[j])-base_time)*3/1000;

              }

              lineCollection.add({ //add a set of points of polyline at PolylineCollection.
                  id: i,
                  positions: Cesium.Cartesian3.fromDegreesArrayHeights(point_list), //add points as array
                  color: Cesium.Color.WHITE,
                  width: 2
              });

          }
        }

        else{
          for (var i = 0; i < gl_data.length; i++) {
              line_list = [];
              line_time_list = [];
              point_list = [];

              line_list = data[i].temporalGeometry.coordinates;
              line_time_list = data[i].temporalGeometry.datetimes;
              name_list[i] = data[i].properties.name;

              var base_time = data[i].temporalGeometry.datetimes[0]; //the basetime we will use for nomalization of datetimes
              base_time = getTime(base_time);

              for (var j in line_list) {
                  point_list[2 * j] = line_list[j][1];
                  point_list[2 * j + 1] = line_list[j][0];

              }

              lineCollection.add({ //add a set of points of polyline at PolylineCollection.
                  id: i,
                  positions: Cesium.Cartesian3.fromDegreesArray(point_list), //add points as array
                  color: Cesium.Color.WHITE,
                  width: 2
              });

          }
        }

        viewer.scene.primitives.add(lineCollection);

        var label_list = "";
        for (var k = 0; k < name_list.length; k++) {
            label_list += "<label style = 'color:white' onclick = 'changeColor(";
            label_list += k;
            label_list += ")'>";
            label_list += name_list[k];
            label_list += "</label>";
            label_list += "<input type = 'checkbox' id = '";
            label_list += k;
            label_list += "_radioItem' onclick = 'getMoving(";
            label_list += k;
            label_list += ")'></input></br>";
        }
        document.getElementById("toolbar_point").innerHTML = label_list;


    });
}

function changeColor(labelValue) {

    var id_l;
    if (contains(selected, labelValue)) { //already existed item, then we removed highlight.
        //delete labelValue at Array.selected
        var already_selected = selected.indexOf(labelValue);
        selected.splice(already_selected, 1);
        //console.log(selected);
        for (var k in gl_data[labelValue].temporalGeometry.datetimes) {

            id_l = k.toString();
            id_l += '_l_';
            id_l += gl_data[labelValue].properties.name;

            viewer.entities.remove(viewer.entities.getById(id_l));

            //console.log(id_l);
        }
        polyline = lines.get(labelValue);
        polyline.material.uniforms.color = Cesium.Color.WHITE;
        viewer.trackedEntity = undefined;
    } else {
        selected.push(labelValue);
        //cor_list = [];
        change_shape = labelValue;
        polyline = lines.get(change_shape);
        var time = gl_data[change_shape].temporalGeometry.datetimes[0];
        //console.log (labelValue);
        polyline = lines.get(change_shape); //get is search polyline by index which is number.



        if (scene.mode == Cesium.SceneMode.COLUMBUS_VIEW) {
            //get the coordinates of polyline
            for (var j in gl_data[change_shape].temporalGeometry.coordinates) {

                cor_list[3 * j] = gl_data[change_shape].temporalGeometry.coordinates[j][1];
                cor_list[3 * j + 1] = gl_data[change_shape].temporalGeometry.coordinates[j][0];

            }
            //get the timestamps of polyline
            time = getTime(time);
            for (var j in gl_data[change_shape].temporalGeometry.datetimes) {
                cor_list[3 * j + 2] = parseInt((getTime(gl_data[change_shape].temporalGeometry.datetimes[j]) - time) / currSec) * 6000;
                time_list[j] = gl_data[change_shape].temporalGeometry.datetimes[j];
            }

            for (var k in gl_data[change_shape].temporalGeometry.datetimes) {
                var id_l = k.toString();
                id_l += '_l_';
                id_l += gl_data[change_shape].properties.name;
                viewer.entities.add({
                    id: id_l,
                    position: Cesium.Cartesian3.fromDegrees(cor_list[3 * k], cor_list[3 * k + 1], cor_list[3 * k + 2]),
                    label: {
                        text: time_list[k],
                        font: '10px'
                    }
                });

            }

            polyline.material.uniforms.color = Cesium.Color.HOTPINK; //polyline.material has attributes related to poly_option
            viewer.trackedEntity = polyline;

        } else {
            for (var j in gl_data[change_shape].temporalGeometry.coordinates) {

                cor_list[2 * j] = gl_data[change_shape].temporalGeometry.coordinates[j][1];
                cor_list[2 * j + 1] = gl_data[change_shape].temporalGeometry.coordinates[j][0];

            }
            for (var j in gl_data[change_shape].temporalGeometry.datetimes) {
                time_list[j] = gl_data[change_shape].temporalGeometry.datetimes[j];
            }
            //get the timestamps of polyline
            for (var k in gl_data[change_shape].temporalGeometry.datetimes) {
                //console.log(k);
                var id_l = k.toString();
                id_l += '_l_';
                id_l += gl_data[change_shape].properties.name;
                //  console.log(id_l);
                viewer.entities.add({
                    id: id_l,
                    position: Cesium.Cartesian3.fromDegrees(cor_list[2 * k], cor_list[2 * k + 1]),
                    label: {
                        text: time_list[k],
                        font: '10px'
                    }
                });

            }
            polyline.material.uniforms.color = Cesium.Color.HOTPINK; //polyline.material has attributes related to poly_option
            viewer.trackedEntity = polyline;

        }
    }
}
