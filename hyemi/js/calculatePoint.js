

function calculateSurfaceWithTriangle(polyline1,polyline2){
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
