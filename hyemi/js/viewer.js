function calCenter(maxmin_xyz) {
  var boundingBoxLength = [maxmin_xyz[0] - maxmin_xyz[3], maxmin_xyz[1] - maxmin_xyz[4], maxmin_xyz[2] - maxmin_xyz[5]];
  var maxLength = Math.max(boundingBoxLength[0], boundingBoxLength[1], boundingBoxLength[2]);
  if(userScale == 0) {
    scale = 400 / maxLength;
  }else scale = userScale;
  
  translate = [-(boundingBoxLength[0] / 2) - maxmin_xyz[3] + x, -(boundingBoxLength[1] / 2) - maxmin_xyz[4] + y, -maxmin_xyz[5]];
}

function transformCoordinates(myvertices) {
  for (var i = 0; i < myvertices.length / 3; i++) {
    myvertices[i * 3] = (myvertices[i * 3] +translate[0]) * scale;
    myvertices[i * 3 + 1] = (myvertices[i * 3 + 1] +translate[1]) * scale;
    myvertices[i * 3 + 2] = (myvertices[i * 3 + 2] +translate[2]) * scale;

    myvertices[i * 3] = Math.floor( myvertices[i * 3] * 1000000000) / 1000000000
    myvertices[i * 3 + 1] = Math.floor( myvertices[i * 3 + 1] * 1000000000) / 1000000000
    myvertices[i * 3 + 2] = Math.floor( myvertices[i * 3 + 2] * 1000000000) / 1000000000

  }
}
function draw(indoor,maxmin_xyz) {
  console.log("before draw");
  console.log(new Date(Date.now()));
  calCenter(maxmin_xyz);
  var cells = indoor.primalSpaceFeature;
  group = [];
  groupline = [];
  HilightCell = [];
  colors = [Cesium.Color.BLUE.withAlpha(0.1),Cesium.Color.GREEN.withAlpha(0.1),Cesium.Color.VIOLET.withAlpha(0.1),Cesium.Color.YELLOW.withAlpha(1),Cesium.Color.WHITE.withAlpha(1)];
  for(var i = 0; i < cells.length; i++) {
      var surfaces = cells[i].geometry;
      var type = cells[i].type;
      var floor = cells[i].floor;
      var cellid = cells[i].cellid;
      HilightCell[cellid] = [];
      solidtocsv += cellid + ", \"Solid(((";
      for(var j = 0; j < surfaces.length; j++) {

          transformCoordinates(surfaces[j].exterior);

          transformCoordinates(surfaces[j].interior);
          if(surfaces[j].interior.length == 0) {
            createPolygon(surfaces[j].exterior, surfaces[j].polyonid, type, floor);
            HilightCell[cellid].push(surfaces[j].polyonid);
          }
          else {
            createPolygonwithHole(surfaces[j].exterior, surfaces[j].interior, surfaces[j].polyonid, type, floor);
            HilightCell[cellid].push(surfaces[j].polyonid);
          }
          if(j != surfaces.length - 1) {
            solidtocsv += ") , (";
          }
          
      }
      solidtocsv += ")))\"\n";
  }
    
 /*console.log("draw cell finish");
console.log(new Date(Date.now()));
 var cellboundary = indoor.cellSpaceBoundaryMember;
    
      for(var j = 0; j < cellboundary.length; j++) {
        if(cellboundary[0].geometry[0] instanceof Polygon) {
          transformCoordinates(cellboundary[j].geometry[0].exterior);
          createPolygon(cellboundary[j].geometry[0].exterior,cellboundary[j].cellBoundaryid,0);
        }
        else {
          transformCoordinates(cellboundary[j].geometry[0].points);
          createPolygon(cellboundary[j].geometry[0].points,cellboundary[j].cellBoundaryid,0);
        }
      } */
      addToPrimitive(group,groupline);
      //console.log("draw boundary finish");
      //console.log(new Date(Date.now()));
    /*var graphs = indoor.multiLayeredGraph;

    for(var i = 0; i < graphs.length; i++){
        //var states = graphs[i].stateMember;
        //for(var j = 0; j < states.length; j++){
        //    transformCoordinates(states[j].position);
        //    var result = toCartesian3(states[j].position);
        //   var redSphere = viewer.entities.add({
        //        name : 'Red sphere with black outline',
        //        position: result[0],
        //        ellipsoid : {
        //            radii : new Cesium.Cartesian3(1000.0, 1000.0, 1000.0),
        //            material : Cesium.Color.RED.withAlpha(0.5),
        //        }
        //    });
        //}

        var edges = {};
        var trasitions = graphs[i].transitionMember;
        for(var j = 0; j < trasitions.length; j++){
            transformCoordinates(trasitions[j].line);
            var redTube = viewer.entities.add({
                name : trasitions[j].transitionid,
                polyline : {
                    //positions : Cesium.Cartesian3.fromDegreesArrayHeights(trasitions[j].line),//
                    positions : toCartesian3(trasitions[j].line),
                    material : Cesium.Color.AQUAMARINE.withAlpha(1)
                }
            });
            edges[trasitions[j].transitionid] = redTube;
            //console.log(redTube);
        }
        NetworkDictionary[graphs[i].graphid] = edges;
    }
    console.log("draw transition finish");
    console.log(new Date(Date.now()));*/
    viewer.zoomTo(viewer.entities);
    console.log("zoom finish");
    console.log(new Date(Date.now()));
}
function drawTransition(indoor) {
  var graphs = indoor.multiLayeredGraph;
  for(var i = 0; i < graphs.length; i++){
      var edges = {};
      var trasitions = graphs[i].transitionMember;
      for(var j = 0; j < trasitions.length; j++){
         // transformCoordinates(trasitions[j].line);
          var redTube = viewer.entities.add({
              name : trasitions[j].transitionid,
              polyline : {
                  positions : toCartesian3(trasitions[j].line),
                  material : Cesium.Color.AQUAMARINE.withAlpha(1)
              }
          });
          edges[trasitions[j].transitionid] = redTube;
      }
      NetworkDictionary[graphs[i].graphid] = edges;
    }
}
function toggleNetwork() {
  return function() {
    for(var gid in NetworkDictionary) {
      for(var eid in NetworkDictionary[gid]) {
        NetworkDictionary[gid][eid].show = !NetworkDictionary[gid][eid].show;
      }
    }
  };
  
}
function toCartesian3(vertices,type) {
  if(type == 2)solidtocsv += ", ";
  solidtocsv += "(";
  var result = [];
  
  for(var k = 0;k < vertices.length;k += 3) {
   var offset = new Cesium.Cartesian3(vertices[k], vertices[k + 1], vertices[k + 2]);
    var finalPos = Cesium.Matrix4.multiplyByPoint(orientation, offset, new Cesium.Cartesian3());
    //var finalPos = Cesium.Matrix4.multiplyByPoint(ENU, offset, new Cesium.Cartesian3());
    Cesium.Matrix4.multiplyByPoint(ENU, finalPos, finalPos);

    var carto  = Cesium.Ellipsoid.WGS84.cartesianToCartographic(finalPos);     
    var lon = Cesium.Math.toDegrees(carto.longitude); 
    var lat = Cesium.Math.toDegrees(carto.latitude);

   if(k == 0) {
    //solidtocsv += lon + " " + lat + " " + carto.height;
    solidtocsv += vertices[k] + " " + vertices[k + 1] + " " + vertices[k + 2];
   }
   else {
    //solidtocsv += "," + lon + " " + lat + " " + carto.height;
    solidtocsv += "," + vertices[k] + " " + vertices[k + 1] + " " + vertices[k + 2]
  }

    result.push(finalPos);
  }
  solidtocsv += ")";
  return result;
}
function addToPrimitive(polygons ,polylines) {
  //console.log(polygons);
   viewer.scene.primitives.add(new Cesium.Primitive({
                            geometryInstances : polygons,
                             appearance : new Cesium.PerInstanceColorAppearance({faceForward : false})
                            //appearance : new Cesium.MaterialAppearance({
                            //  material : Cesium.Material.fromType('Color', {
                            //              color : new Cesium.Color(0.0, 0.0, 1.0, 0.05)
                            //            })
                            //})
  }));
  /*viewer.scene.primitives.add(new Cesium.Primitive({
                            geometryInstances : polylines,
                            appearance : new Cesium.PerInstanceColorAppearance()
                            //appearance : new Cesium.MaterialAppearance({
                             // material : Cesium.Material.fromType('Color', {
                             //             color : new Cesium.Color(0.0, 0.0, 0.0, 0.3)
                             //           })
                            //})
  }));*/
}
function createPolygon(exterior,id,color,floor) {
var lineID = id + "l";
  var instance = new Cesium.GeometryInstance({
                      geometry : new Cesium.PolygonGeometry({
                                    polygonHierarchy : new Cesium.PolygonHierarchy(
                                      //Cesium.Cartesian3.fromDegreesArrayHeights(exterior)
                                      toCartesian3(exterior,1)
                                    ),
                                    //material : Cesium.Color.BLUE.withAlpha(0.01),
                                    perPositionHeight : true
                                    //outline : true,
                                    //outlineColor : Cesium.Color.BLACK.withAlpha(0.1),
                                    //outlineWidth : 2.0
                                }),
                      attributes : {
                        color : Cesium.ColorGeometryInstanceAttribute.fromColor(colors[color])
                                },
                      id : id
                    })
  /*var instance2 = new Cesium.GeometryInstance({
                      geometry : new Cesium.PolygonOutlineGeometry({
                                    polygonHierarchy : new Cesium.PolygonHierarchy(
                                      //Cesium.Cartesian3.fromDegreesArrayHeights(exterior)
                                      toCartesian3(exterior)
                                    ),
                                    //material : Cesium.Color.BLUE.withAlpha(0.01),
                                    perPositionHeight : true
                                    //outline : true,
                                    //outlineColor : Cesium.Color.BLACK.withAlpha(0.1),
                                    //outlineWidth : 2.0
                                }),
                      attributes : {
                        color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLACK.withAlpha(0.2))
                                },
                      id : lineID
                    })*/
  if(Index[floor] === undefined) {
    Index[floor] = 0;
    ControlVisible[floor] = new Array();
    ControlVisibleLine[floor] = new Array();
    preIndex[floor] = 1;
  }
  //console.log(floor);
  //console.log(Index);
  //console.log(ControlVisible);
  ControlVisible[floor][Index[floor]] = [id, color];
  ControlVisibleLine[floor][Index[floor]] = lineID;
  Index[floor]++;
  /*if(color == 1) {room[id] = instance;roomline[lineID] = instance2;}
  else if(color == 2) {corridor[id] = instance;corridorline[lineID] = instance2;}
  else if(color == 3) {stair[id] = instance;stairline[lineID] = instance2;}
  else if(color == 4) {door[id] = instance;doorline[lineID] = instance2;}*/
  group.push(instance);
  //groupline.push(instance2);
}
function createPolygonwithHole(exterior,interior,id,color,floor) {
 var lineID = id + "l";
  var instance = new Cesium.GeometryInstance({
                      geometry : new Cesium.PolygonGeometry({
                                    polygonHierarchy : new Cesium.PolygonHierarchy(
                                      toCartesian3(exterior,1),[toCartesian3(interior,2)]
                                      //Cesium.Cartesian3.fromDegreesArrayHeights(exterior),[ Cesium.Cartesian3.fromDegreesArrayHeights(interior)]
                                    ),
                                    perPositionHeight : true
                                }),
                      attributes : {
                        color : Cesium.ColorGeometryInstanceAttribute.fromColor(colors[color])
                                },
                      id : id
                    })
  /*var instance2 = new Cesium.GeometryInstance({
                      geometry : new Cesium.PolygonOutlineGeometry({
                                    polygonHierarchy : new Cesium.PolygonHierarchy(
                                      toCartesian3(exterior),[toCartesian3(interior)]
                                      //Cesium.Cartesian3.fromDegreesArrayHeights(exterior),[ Cesium.Cartesian3.fromDegreesArrayHeights(interior)]
                                    ),
                                    perPositionHeight : true
                                }),
                      attributes : {
                        color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLACK.withAlpha(0.2))
                                },
                      id : lineID
                    })*/
  if(Index[floor] === undefined) {
    Index[floor] = 0;
    ControlVisible[floor] = new Array();
    ControlVisibleLine[floor] = new Array();
  }
  ControlVisible[floor][Index[floor]] = [id, color];
  ControlVisibleLine[floor][Index[floor]] = lineID;
  Index[floor] ++;
  /*if(color == 1) {room[id] = instance;roomline[lineID] = instance2;}
  else if(color == 2) {corridor[id] = instance;corridorline[lineID] = instance2;}
  else if(color == 3) {stair[id] = instance;stairline[lineID] = instance2;}
  else if(color == 4) {door[id] = instance;doorline[lineID] = instance2;}*/
  group.push(instance);
  //groupline.push(instance2);
}