function drawOnePolygon(onePolygon, id, height) {
    var coordinates = onePolygon;
    var points = new Array();
    var geoInstance;
    var position;

    if (scene.mode == Cesium.SceneMode.COLUMBUS_VIEW) {
        for (var i = 0; i < coordinates.length; i++) {
            points.push(coordinates[i][0]);
            points.push(coordinates[i][1]);
            points.push(height);
        }

        position = Cesium.Cartesian3.fromDegreesArrayHeights(points);

    } else {
        for (var i = 0; i < coordinates.length; i++) {
            points.push(coordinates[i][0]);
            points.push(coordinates[i][1]);
        }
        position = Cesium.Cartesian3.fromDegreesArray(points);
    }

    if (viewer.entities.getById(id)) {
        var target = viewer.entities.getById(id);
        target.geometry.polygonHierarchy = position;
    } else {
        geoInstance = new Cesium.GeometryInstance({
            id: id,
            geometry: new Cesium.PolygonGeometry({
                polygonHierarchy: new Cesium.PolygonHierarchy(position),
                perPositionHeight: true
            }),
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.ORANGE.withAlpha(0.3))
            }
        });
        return geoInstance;
    }

}

function drawPolygons(setOfPolygon) {
    var coordinates = setOfPolygon.temporalGeometry.coordinates;
    var datetimes = setOfPolygon.temporalGeometry.datetimes;
    var name = setOfPolygon.properties.name;
    var fastest_time;
    var slowest_time;
    var polyCollection;
    var poly_list = new Array();
    var heights = getListOfHeight(datetimes);

    for (var i = 0; i < coordinates.length; i++) {
        var id = name + "_polygon_" + i.toString();
        poly_list.push(drawOnePolygon(coordinates[i], id, heights[i]));
    }
    if (!viewer.entities.getById(name + "_polygon")) {
        polyCollection = new Cesium.Primitive({
            id: name + "_polygon",
            geometryInstances: poly_list,
            appearance: new Cesium.PerInstanceColorAppearance({})
        });
        return polyCollection;
    }
}

function drawOneTyphoon(oneTyphoon) {

    var coordinates = oneTyphoon.temporalGeometry.coordinates;
    var datetimes = oneTyphoon.temporalGeometry.datetimes;
    var name = oneTyphoon.properties.name;
    var one_poly = [];
    var new_line = [];
    var new_point = [];
    var geoInstance;
    var surface = [];
    var typhoon;
    var heights = getListOfHeight(datetimes);
    var id;
    var id_list = [];
    for (var i = 0; i < coordinates[0].length; i++) {
        new_line = [];
        for (var j = 0; j < coordinates.length; j++) {
            new_point = [];

            new_point.push(coordinates[i][j][0]);
            new_point.push(coordinates[i][j][1]);
            new_line.push(new_point);
        }
        one_poly.push(new_line);
    }

    for (var i = 0; i < one_poly.length; i++) {
        for (var j = 0; j < one_poly[i].length - 1, j++) {
            var temp_poly = new Array();
            var temp_point = new Array();
            var first = one_poly[i][j];
            var sec = one_poly[i + 1][j];
            var third = one_poly[i + 1][j + 1];
            var forth = one_poly[i][j + 1];

            temp_poly.push([first[0], first[1]], [sec[0], sec[1]], [third[0], third[1]], [forth[0], forth[1]]);
            id = name + "_typhoon_" + i + "_" + j;
            id_list.push(id);
            if (scene.mode == Cesium.SceneMode.COLUMBUS_VIEW) {
                geoInstance = drawOnePolygon(temp_poly, id, heights[i]);
            } else {
                geoInstance = drawOnePolygon(temp_poly, id, 0);
            }
            surface.push(geoInstance);
        }
    }

    if (viewer.entities.getById(id_list[0])) {
        for (var i = 0; i < id_list.length; i++) {
            var target = viewer.entities.getById(id_list[i]);
            target.geometryInstances = surface;
        }
    } else {
        var typhoon = new Cesium.Primitive({
            id: name + "_typhoon",
            geometryInstances: surface,
            appearance: new Cesium.PerInstanceColorAppearance({

            })
        });

        return typhoon;
    }
}

function drawTyphoons(buffer) {
    var fastest_time;
    var slowest_time;
    var polyCollection;
    var poly_list = new Array();

    for (var i = 0; i < buffer.features.length; i++) {
        for (var j = 0; j < buffer.features[i].temporalGeometry.coordinates.length; j++) {
            viewer.entities.add(drawOneTyphoon(buffer.features[i]));
        }
    }
}

function drawOneLine(oneLine, id, heights) {
    var points = [];
    var positions;
    var line;
    if (scene.mode == Cesium.SceneMode.COLUMBUS_VIEW) {
        for (var i = 0; i < oneLine.length; i++) {
            var height = //
                points.push(oneLine[i][0], oneLine[i][0], height);
        }
        position = Cesium.Cartesian3.fromDegreesArrayHeights(points);
    } else {
        for (var i = 0; i < oneLine.length; i++) {
            points.push(oneLine[i][0], oneLine[i][0], 0);
        }
        position = Cesium.Cartesian3.fromDegreesArray(points);
    }

    if (viewer.entities.getById(id)) {
        var target = viewer.entities.getById(id);
        target.positions = position;
    } else {
        line = new Cesium.Polyline({
            id: id,
            positions: positions.
            color: Cesium.Color.WHITE,
            width: 2
        });
        return line;
    }
}

function drawLines(buffer) {
    var data = buffer.features;
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].temporalGeometry.coordinates.length; j++) {
            var id = data.properties.name + "_line_" + i.toString();
            if (scene.mode == Cesium.SceneMode.COLUMBUS_VIEW) {
                if (viewer.entities.getById(id)) {
                    drawOneLine(data[i].temporalGeometry.coordinates[j], id, data[i].temporalGeometry.datetimes);
                } else {
                    viewer.entities.add(drawOneLine(data[i].temporalGeometry.coordinates[j], id, data[i].temporalGeometry.datetimes));
                }

            } else {
                if (viewer.entities.getById(id)) {
                    drawOneLine(data[i].temporalGeometry.coordinates[j], id, 0);
                } else {
                    viewer.entities.add(drawOneLine(data[i].temporalGeometry.coordinates[j], id, 0));
                }
            }
        }
    }

}

function changeMode(buffer) {
    for (var i = 0; i < buffer.features.length; i++) {
        if (buffer.features[i].properties.type == "MovingPolygon") {
            if (viewer.entities.getById(buffer.features[i].properties.name + "_polygon_" + i)) {
                    if (scene.mode == Cesium.SceneMode.COLUMBUS_VIEW) {
                        drawOnePolygon(buffer.features[i].temporalGeometry.coordinates, buffer.features[i].properties.name + "_polygon" + i, buffer.features[i].temporalGeometry.datetimes);
                    } else {
                        drawOnePolygon(buffer.features[i].temporalGeometry.coordinates, buffer.features[i].properties.name + "_polygon" + i, 0);
                    }
                }
            }
            else if (buffer.features[i].properties.type == "MovingPoint") {
                if (viewer.entities.getById(buffer.features[i].properties.name + "_line_" + i)) {
                    if (scene.mode == Cesium.SceneMode.COLUMBUS_VIEW) {
                        drawOneLine(buffer.features[i].temporalGeometry.coordinates, buffer.features[i].properties.name + "_line_" + i, buffer.features[i].temporalGeometry.datetimes);
                    } else {
                        drawOneLine(buffer.features[i].temporalGeometry.coordinates, buffer.features[i].properties.name + "_line_" + i, 0);
                    }
                }

            } else if (buffer.features[i].properties.type == "MovingLineString") {
              if(viewer.entities.getById(buffer.features[i].properties.name + "_lineString_" + i)){}
            }
        }



    }

    function drawSurfaceBetween2Polylines(polyline1,polyline2){
      var surface_line_list = calculateMovingPath(polyline1, polyline2);
      var triangle_list = [];
      for(var i = 0 ; i < surface_line_list.length-1 ; i++){
        triangle_list.push(calculateTriangleWithLines(surface_line_list[i],surface_line_list[i+1]));
      }
      return triangle_list;
    }

    function calculateMovingPath(polyline1,polyline2){
      var surface = new Array();
      var cur_index1 = 0;
      var cur_index2 = 0;
      var next_index1 = cur_index1+1;
      var next_index2 = cur_index2+1
      var curr_point;
      var next_point;
      var line = [];

      line.push(polyline1[cur_index1],polyline2[cur_index2]);
      surface.push(line);

      while(1){
        if(next_index1 == polyline1.length && next_index2 == polyline2.length){
          break;
        }
        if(next_index1 == polyline1.length){
          cur_point = cur_index1;
          next_point = next_index2;
          line = [];
          line.push(polyline1[cur_point],polyline2[next_point]);
          cur_index2 = next_index2;
          next_index2 = next_index2 + 1;
        }
        else if(next_index2 == polyline2.length){
          cur_point = cur_index2;
          next_point = next_index1;
          line = [];
          line.push(polyline1[next_point],polyline2[cur_point]);
          cur_index1 = next_index1;
          next_index1 = next_index1 + 1;
        }
        else{
          var dis1 = calculateDistanceThree3D(polyline1[cur_index1], polyline2[cur_index2],polyline1[next_index1]);
          var dis2 = calculateDistanceThree3D(polyline1[cur_index1], polyline2[cur_index2],polyline2[next_index2]);

          if(dis1 < dis2) {
            cur_point = cur_index2;
            next_point = next_index1;
            line = [];
            line.push(polyline1[next_point],polyline2[cur_point]);
            cur_index1 = next_index1;
            next_index1 = next_index1 + 1;

          }
          else{
            cur_point = cur_index1;
            next_point = next_index2;
            line.push(polyline1[cur_point],polyline2[next_point]);
            cur_index2 = next_index2;
            next_index2 = next_index2 + 1;
          }
        }
        surface.push(line);
      }

    return surface;
    }
    function calculateTriangleWithLines(polyline1,polyline2){
      var triangle = [];
      if(polyline1[0] == polyline2[0]){
        triangle.push(polyline1[0],polyline1[1],polyline2[1]);
      }
      else if(polyline1[1] == polyline2[1]){
        triangle.push(polyline1[0],polyline1[1],polyline2[0]);
      }
      else if(polyline1[0] == polyline2[1]){
        triangle.push(polyline1[0],polyline1[1],polyline2[0]);
      }
      else if(polyline1[1] == polyline2[0]){
        triangle.push(polyline1[0],polyline1[1],polyline2[1]);
      }
      else {
        triangle.push(polyline1[0],polyline1[1],polyline2[1],polyline2[0]);
      }
      return triangle;
    }

    function get2Dpoints(coordinates) {
        var temp_point = new Array();
        var temp_list = new Array();
        var poly_lines = new Array();
        for (var i = 0; i < coordinates.length; i++) {
            for (var j = 0; j < coordinates[i].length; j++) {
                temp_point.push(coordinates[i][j][0], coordinates[i][j][1]);
                temp_list.push(temp_point);
                temp_point = [];
            }
            poly_lines.push(temp_list);
            temp_list = [];
        }
        return poly_lines;
    }

    function get3DPoints(coordinates, timeline, timebase) { //coordinates is the set of points.
        var temp_point = new Array();
        var temp_list = new Array();
        var poly_lines = new Array();
        var time = (getTime2(timeline) - getTime2(timebase)) / (1000);
        for (var i = 0; i < coordinates.length; i++) {
            temp_point.push(coordinates[i][0]);
            temp_point.push(coordinates[i][1]);
            if (scene.mode == Cesium.SceneMode.COLUMBUS_VIEW) {
                temp_point.push(time);
            } else {
                temp_point.push(0);
            }
            poly_lines.push(temp_point);
            temp_point = [];
            //console.log((getTime2(timeline) - getTime2(timebase)) / 1000);
        }

        return poly_lines;
    }

    function euclidianDistance2D(a, b) {
        var pow1 = Math.pow(a[0] - b[0], 2);
        var pow2 = Math.pow(a[1] - b[1], 2);
        return Math.sqrt(pow1 + pow2);
    }

    function euclidianDistance3D(a, b) {
        var pow1 = Math.pow(a[0] - b[0], 2);
        var pow2 = Math.pow(a[1] - b[1], 2);
        var pow3 = Math.pow(a[2] - b[2], 2);
        return Math.sqrt(pow1 + pow2 + pow3);
    }

    function calculateDistanceThree3D(p1, p2, p3) {
        var dis1 = euclidianDistance3D(p1, p3);
        var dis2 = euclidianDistance3D(p2, p3);
        return (dis1 + dis2) / 2;
    }
