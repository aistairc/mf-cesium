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
