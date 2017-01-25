function drawMultiSurface(list) {


  //solidtocsv += list[0] + ",";
  var last = [list[8] * 1,list[7] * 1,list[9] * 1];
  var first = [last[0] * -1,last[1] * -1,last[2] * -1];
  ENU = new Cesium.Matrix4();
  //ellipsoid = viewer.scene.globe.ellipsoid;
    position = Cesium.Cartesian3.fromDegrees(list[2] * 1,list[1] * 1,last[2] * 1);//make min z = 0
      angle = -0.2;
      orientation  = new Cesium.Matrix4(Math.cos(angle),-Math.sin(angle),0,0,
                                    Math.sin(angle), Math.cos(angle),0,0,
                                    0,0,1,0,
                                    0,0,0,1);
    Cesium.Transforms.eastNorthUpToFixedFrame(position,ellipsoid,ENU);//compute axes(x,y,z)

   var points = [];
   points.push(first);
   points.push([first[0], last[1], first[2]]);
   points.push([first[0], last[1], last[2]]);
   points.push([first[0], first[1], last[2]]);
   points.push([last[0], first[1] ,last[2]]);
   points.push([last[0], first[1], first[2]]);
   points.push([last[0], last[1], first[2]]);
   points.push(last);
   solidtocsv += "\"uuid" + list[0] + "\"" + ", \"Solid((((";
   createPolygonforbbox(points[0].concat(points[1]).concat(points[2]).concat(points[3]));
   solidtocsv += ")) , ((";
   createPolygonforbbox(points[4].concat(points[5]).concat(points[6]).concat(points[7]));
   solidtocsv += ")) , ((";
   createPolygonforbbox(points[6].concat(points[7]).concat(points[2]).concat(points[1]));
   solidtocsv += ")) , ((";
   createPolygonforbbox(points[0].concat(points[5]).concat(points[4]).concat(points[3]));
   solidtocsv += ")) , ((";
   createPolygonforbbox(points[0].concat(points[1]).concat(points[6]).concat(points[5]));
   solidtocsv += ")) , ((";
   createPolygonforbbox(points[2].concat(points[7]).concat(points[4]).concat(points[3]));
   solidtocsv += "))))\"\n";
   /*var pos = Cesium.Cartesian3.fromDegrees(61.296382224724795,35.628536117000692);
var carto  = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pos);
var lon = Cesium.Math.toDegrees(carto.longitude);
var lat = Cesium.Math.toDegrees(carto.latitude); */
}
function toCartesian3togetwgs84(vertices) {

  var result = [];
  var first;
  for(var k = 0;k < vertices.length;k += 3) {
   var offset = new Cesium.Cartesian3(vertices[k], vertices[k + 1], vertices[k + 2]);
    var finalPos = Cesium.Matrix4.multiplyByPoint(orientation, offset, new Cesium.Cartesian3());
    Cesium.Matrix4.multiplyByPoint(ENU, finalPos, finalPos);

    var carto  = Cesium.Ellipsoid.WGS84.cartesianToCartographic(finalPos);
    var lon = Cesium.Math.toDegrees(carto.longitude);
    var lat = Cesium.Math.toDegrees(carto.latitude);

   if(k == 0) {
    solidtocsv += lon + " " + lat + " " + carto.height;
    first = lon + " " + lat + " " + carto.height;
   }
   else {solidtocsv += "," + lon + " " + lat + " " + carto.height;}
   /*if(k == 0) {
    first = finalPos;
    solidtocsv += finalPos.x + " " + finalPos.y + " " + finalPos.z;
  }
   else {solidtocsv += ", " + finalPos.x + " " + finalPos.y + " " + finalPos.z;}
*/
    result.push(finalPos);
  }
  //solidtocsv += ", " + first.x + " " + first.y + " " + first.z;
  solidtocsv += ", " + first;
  return result;
}
function showInCesium(polygons ,polylines) {
   viewer.scene.primitives.add(new Cesium.Primitive({
                            geometryInstances : polygons,
                             appearance : new Cesium.PerInstanceColorAppearance()
  }));
  viewer.scene.primitives.add(new Cesium.Primitive({
                            geometryInstances : polylines,
                            appearance : new Cesium.PerInstanceColorAppearance()
  }));
}
function createPolygonforbbox(exterior,id) {
  var instance = new Cesium.GeometryInstance({
                      geometry : new Cesium.PolygonGeometry({
                                    polygonHierarchy : new Cesium.PolygonHierarchy(
                                      toCartesian3togetwgs84(exterior)
                                    ),
                                    perPositionHeight : true
                                }),
                      attributes : {
                        color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED.withAlpha(0.8))
                                }
                    })
 /*var instance2 = new Cesium.GeometryInstance({
                      geometry : new Cesium.PolygonOutlineGeometry({
                                    polygonHierarchy : new Cesium.PolygonHierarchy(
                                      toCartesian3(exterior)
                                    ),
                                    perPositionHeight : true
                                }),
                      attributes : {
                        color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLACK.withAlpha(0.2))
                                }
                    })*/
  Gaia.push(instance);
 //groupline.push(instance2);
}
