MFOC.drawBackRadar = function(radar_id) {
    var radar_canvas = document.getElementById(radar_id);

    //  radar_canvas.style.top = document.getElementById(div_id).offsetTop + document.getElementById(div_id).offsetHeight + 10 + 'px';
    radar_canvas.style.position = 'absolute';
    radar_canvas.style.zIndex = '21';
    radar_canvas.style.right = '5px';


    //  radar_canvas.width = $('#'+div_id).width() + 'px';
    //  radar_canvas.height = $('#'+div_id).width()  + 'px';


    if (radar_canvas.getContext) {

        var h_width = radar_canvas.width / 2;
        var h_height = radar_canvas.height / 2;
        var ctx = radar_canvas.getContext('2d');

        //var h_width = ctx.canvas.clientWidth / 2;
        //var h_height = ctx.canvas.clientHeight / 2;
        var color = 'rgb(0,255,0)';

        for (var id = 0; id < 2; id++) {

            for (var j = 0; j < 2; j += 0.05) {
                ctx.beginPath();
                ctx.arc(h_width, h_height, h_width * (id + 1) / 2, j * Math.PI, (j + 0.025) * Math.PI);
                ctx.strokeStyle = color;
                ctx.stroke();
            }
        }

    } else {
        alert('canvas를 지원하지 않는 브라우저');
    }
}

MFOC.selectDegree = function(mfoc, div, parent, graph_id) {

    if (mfoc.features.length == 0) {
        console.log("no features");
        mfoc.setAnalysisDIV(parent, graph_id);
        return;
    }
    if (mfoc.cube_primitives != null) {
        mfoc.removeHeatMap();
        mfoc.setAnalysisDIV(parent, graph_id);
        return;
    }

    div.innerHTML = 'Set Degree' + '<br><br>';

    div.style.verticalAlign = 'initial';
    div.style.display = 'block';
    div.style.alignItems = 'initial';
    div.style.height = div.offsetHeight * 1 + 'px';

    div.onclick = null;
    var table = document.createElement('table');
    table.style.paddingTop = '10px';

    var degree_string = ['long(°) : ', 'lat(°) : ', 'time(days) : '];
    for (var i = 0; i < 3; i++) {
        var row = table.insertRow(table.rows.length);
        row.id = 'degree_row_' + i;
        var celll = row.insertCell(0);
        celll.innerHTML = degree_string[i];

        var cell2 = row.insertCell(1);
        var input = document.createElement('input');
        input.id = 'degree_' + i;
        input.value = 5;
        input.style.color = 'black';
        input.style.width = '30px';
        cell2.appendChild(input);

    }
    div.appendChild(table);

    var btn_div = document.createElement('div');
    var back_btn = document.createElement('input'),
        submit_btn = document.createElement('input');

    back_btn.type = 'button';
    submit_btn.type = 'button'
    back_btn.style.float = 'right';
    submit_btn.style.float = 'left';
    back_btn.style.color = 'black';
    submit_btn.style.color = 'black';
    back_btn.value = 'back';
    submit_btn.value = 'submit'

    submit_btn.onclick = (function(mfoc, parent, graph_id) {
        return function() {
            var x = document.getElementById('degree_0').value,
                y = document.getElementById('degree_1').value,
                time = document.getElementById('degree_2').value;
            document.getElementById(parent).innerHTML = 'Analysing...';
            mfoc.showHeatMap({
                x: x,
                y: y,
                time: time
            });

            mfoc.setAnalysisDIV(parent, graph_id);
        };
    })(mfoc, parent, graph_id);

    back_btn.onclick = (function(mfoc, parent, graph_id) {
        return function() {
            mfoc.setAnalysisDIV(parent, graph_id);
        };
    })(mfoc, parent, graph_id);

    btn_div.appendChild(back_btn);
    btn_div.appendChild(submit_btn);

    div.appendChild(btn_div);

    if (mfoc.mode != '3D') {
        document.getElementById('degree_row_2').style.visibility = 'hidden';
    }
}

MFOC.selectProperty = function(mfoc, graph_id) {
    if (mfoc.features.length == 0) {
        alert("no features");
        return;
    }
    if (document.getElementById('pro_menu')) {
        document.getElementById('pro_menu').remove();
    }
    document.getElementById(graph_id).innerHTML = '';
    document.getElementById(graph_id).style.height = '0%';
    document.getElementById(graph_id).style.cursor = 'pointer';

    //  document.getElementById(graph_id).style.width = '85%';
    //  document.getElementById(graph_id).style.left = '15%';

    var pro_menu = document.createElement('div');
    //  pro_menu.style.width='85%';
    //  pro_menu.style.position ='absolute';
    //  pro_menu.style.right='0';
    pro_menu.style.bottom = '0';
    pro_menu.style.backgroundColor = 'rgba(5, 5, 5, 0.8)';
    pro_menu.style.height = "5%";
    pro_menu.style.zIndex = "25";
    pro_menu.id = 'pro_menu';
    pro_menu.style.cursor = 'pointer';
    pro_menu.className = 'graph';

    var pro_type_arr = mfoc.getAllTypeFromProperties();

    for (var i = 0; i < pro_type_arr.length; i++) {
        var div = document.createElement('div');
        div.style.padding = "10px";
        div.style.color = 'white';
        div.style.float = 'left';
        div.style.textAlign = 'center';
        div.style.fontSize = 'x-large';
        div.style.verticalAlign = 'middle';
        div.style.width = 100 / (pro_type_arr.length + 1) - 3 + '%';
        div.innerHTML = pro_type_arr[i];
        div.id = 'btn' + pro_type_arr[i];
        div.onclick = (function(mfoc, name_arr, index, graph) {
            return function() {
                document.getElementById('pro_menu').style.bottom = '20%';
                document.getElementById('btn' + name_arr[index]).style.backgroundColor = 'rgba(100,100,100,0.8)';
                for (var i = 0; i < name_arr.length; i++) {
                    if (i == index) continue;
                    document.getElementById('btn' + name_arr[i]).style.backgroundColor = 'transparent';
                }
                mfoc.showProperty(name_arr[index], graph);
            };
        })(mfoc, pro_type_arr, i, graph_id);
        pro_menu.appendChild(div);
    }

    var close_div = document.createElement('div');
    close_div.style.padding = "10px";
    close_div.style.color = 'white';
    close_div.style.float = 'right';
    close_div.style.textAlign = 'center';
    close_div.style.fontSize = 'x-large';
    close_div.style.verticalAlign = 'middle';
    close_div.style.width = 100 / (pro_type_arr.length + 1) - 3 + '%';
    close_div.innerHTML = 'CLOSE';
    pro_menu.appendChild(close_div);

    close_div.onclick = (function(graph_id) {
        return function() {
            document.getElementById('pro_menu').remove();
            document.getElementById(graph_id).style.height = "0%";
        }
    })(graph_id);

    document.body.appendChild(pro_menu);
}
var LOG = console.log;



MFOC.prototype.drawMovingLineString = function(options){
  var geometry = options.temporalGeometry;
  var name = options.name;

  var polylineCollection = new Cesium.PolylineCollection();

  var r_color = this.getColor(name);


  var data = geometry;
  var heights = this.getListOfHeight(data.datetimes);


  for (var j = 0 ; j < data.coordinates.length ; j++){
    if (this.mode == '2D' || this.mode == 'GLOBE'){
      heights[j] = 0;
    }
    var positions = MFOC.makeDegreesArray(data.coordinates[j], heights[j]);
    polylineCollection.add(MFOC.drawOneLine(positions, r_color));
  }

  return polylineCollection;
}

MFOC.makeDegreesArray = function(pos_2d, height){
  var points = [];
  for (var i = 0; i < pos_2d.length; i++) {
    if (Array.isArray(height)){
      points.push(pos_2d[i][0], pos_2d[i][1], height[i]);
    }
    else{
      points.push(pos_2d[i][0], pos_2d[i][1], height);
    }
  }
  return points;
}

MFOC.drawInstanceOneLine = function(positions, r_color, width = 5){
  var carte = Cesium.Cartesian3.fromDegreesArrayHeights(positions);
  //console.log(positions,carte);
  var polyline =  new Cesium.PolylineGeometry({
    positions : carte,
    width : width
  });

  var geoInstance = new Cesium.GeometryInstance({
    geometry : Cesium.PolylineGeometry.createGeometry(polyline),
    attributes : {
      color : Cesium.ColorGeometryInstanceAttribute.fromColor(r_color)
    }
  });

  return geoInstance;
}

MFOC.drawOneLine = function(positions, r_color, width = 5){
  var material = new Cesium.Material.fromType('Color');
  material.uniforms.color = r_color;

  var line = {
    positions :  Cesium.Cartesian3.fromDegreesArrayHeights(positions) ,
    width : width,
    material : material
  };

  return line;
}

MFOC.prototype.drawMovingPoint = function(options){
  var geometry = options.temporalGeometry;
  var name = options.name;

  var pointCollection = new Cesium.PointPrimitiveCollection();

  var r_color = this.getColor(name);

  var data = geometry.coordinates;
  if(this.mode == '3D'){
    var heights = this.getListOfHeight(geometry.datetimes);
    for(var i = 0 ; i < data.length ; i++ ){
      pointCollection.add(MFOC.drawOnePoint(data[i], heights[i], r_color));
    }
  }
  else{
    for(var i = 0 ; i < data.length ; i++ ){
      pointCollection.add(MFOC.drawOnePoint(data[i], 0, r_color));
    }
  }
  pointCollection.name = name;
  return pointCollection;
}

MFOC.drawOnePoint = function(onePoint,height,r_color){ //it gets one point
  var pointInstance = new Cesium.PointPrimitive();
  var position = Cesium.Cartesian3.fromDegrees(onePoint[0],onePoint[1],height);;
  pointInstance.position = position;
  pointInstance.color = r_color;
  pointInstance.pixelSize = 6.0;
  return pointInstance;
}

MFOC.prototype.drawMovingPolygon = function(options){

  var geometry = options.temporalGeometry;
  var name = options.name;


  var r_color = this.getColor(name).withAlpha(0.3);

  var min_max_date = this.min_max.date;
  var coordinates = geometry.coordinates;
  var datetimes = geometry.datetimes;

  var prim;
  var poly_list = new Array();
  var heights = null;

  var with_height = false;
  if (this.mode == '3D'){
    with_height = true;
    heights = this.getListOfHeight(datetimes);
  }

  for (var i = 0; i < coordinates.length; i++) {
    var height;
    if (!with_height){
      height = 0;
    }
    else{
      height = heights[i];
    }
    poly_list.push(MFOC.drawOnePolygon(coordinates[i], height, with_height , r_color));
  }


  prim = new Cesium.Primitive({
    geometryInstances: poly_list,
    appearance: new Cesium.PerInstanceColorAppearance({})
  });

  return prim;
}

MFOC.drawOnePolygon = function(onePolygon, height, with_height, r_color ) { //it gets one polygon
  var coordinates = onePolygon;
  var points = [];

  var position;
  if (!with_height){
    height = 0;
    for (var i = 0; i < coordinates.length; i++) {
      points.push(coordinates[i][0]);
      points.push(coordinates[i][1]);
      points.push(height);
    }
  }
  else{
    if (height == null){
      for (var i = 0; i < coordinates.length; i++) {
        points.push(coordinates[i][0]);
        points.push(coordinates[i][1]);
        points.push(coordinates[i][2]);
      }
    }
    else{
      for (var i = 0; i < coordinates.length; i++) {
        points.push(coordinates[i][0]);
        points.push(coordinates[i][1]);
        points.push(height);
      }
    }
  }


  position = Cesium.Cartesian3.fromDegreesArrayHeights(points);

  var polygonHierarchy = new Cesium.PolygonHierarchy(position);

  var vertexF = new Cesium.VertexFormat({
    position : true,
    st : false,
    normal : true,
    color : true
  });

  var geometry = new Cesium.PolygonGeometry({
    polygonHierarchy : polygonHierarchy,
    vertexFormat : vertexF,
    perPositionHeight : true
  });

  var geoInstance = new Cesium.GeometryInstance({
    geometry : geometry,
    attributes : {
      color : Cesium.ColorGeometryInstanceAttribute.fromColor(r_color)
    }
  });
  return geoInstance;
}

MFOC.prototype.drawPathMovingPoint = function(options){
  var instances = [];

  var color = this.getColor(options.name);

  var data = options.temporalGeometry;
  var property = options.temporalProperty;
  var heights = 0;
  if (this.mode == '3D'){
    heights = this.getListOfHeight(data.datetimes, this.min_max.date);
  }
  var pro_min_max = null;
  if (property != undefined){
    pro_min_max = MFOC.findMinMaxProperties(property);
  }

  if (data.interpolations == 'Discrete'){
    return this.drawMovingPoint(options);
  }

  if (data.coordinates.length == 1){
    console.log("one");
  }
  else{
    if (property == undefined){
      var positions = MFOC.makeDegreesArray(data.coordinates, heights);
      instances.push(MFOC.drawInstanceOneLine(positions, color));
    }
    else{
      for (var index = 0 ; index < data.coordinates.length - 1; index++){
        var middle_value = (property.values[index] + property.values[index+1]) / 2;
        var blue_rate = (middle_value - pro_min_max.value[0]) / (pro_min_max.value[1] - pro_min_max.value[0]);
        if (blue_rate < 0.2){
          blue_rate = 0.2;
        }
        if (blue_rate > 0.9){
          blue_rate = 0.9;
        }
        color = new Cesium.Color(1.0 , 1.0 - blue_rate , 0 , blue_rate);

        var positions;
        if (this.mode == '2D' || this.mode == 'GLOBE'){
          positions =
          (data.coordinates[index].concat([0]))
          .concat(data.coordinates[index+1].concat([0]));
        }
        else {
          positions =
          (data.coordinates[index].concat(heights[index]))
          .concat(data.coordinates[index+1].concat(heights[index+1]));
        }

        instances.push(MFOC.drawInstanceOneLine(positions, color));
      }

    }
  }


  var prim = new Cesium.Primitive({
    geometryInstances: instances,
    appearance: new Cesium.PolylineColorAppearance(),
    allowPicking : true
  });
  prim.name = options.name;
  return prim;

}

MFOC.prototype.drawPathMovingPolygon = function(options){
  var geometry = options.temporalGeometry;
  var property = options.temporalProperty;

  var coordinates = geometry.coordinates;
  var datetimes = geometry.datetimes;

  var pro_min_max = null;
  if (property != undefined){
    pro_min_max = MFOC.findMinMaxProperties(property);
  }

  var geoInstance;
  var surface = [];
  var typhoon;

  var heights = this.getListOfHeight(datetimes);


  var color = this.getColor(options.name).withAlpha(0.6);

  if (geometry.interpolations == 'Discrete'){
    return this.drawMovingPolygon(options);
  }

  if (this.mode == '2D' || this.mode == 'GLOBE'){
    color = this.getColor(options.name).withAlpha(0.2);
  }
  for (var i = 0; i < coordinates.length - 1; i++) {
    for (var j = 0; j < coordinates[i].length - 1 ; j++) {
      var temp_poly = new Array();
      var temp_point = new Array();
      var first = coordinates[i][j];
      var sec = coordinates[i + 1][j];
      var third = coordinates[i + 1][j + 1];
      var forth = coordinates[i][j + 1];

      if (property != undefined){
        var middle_value = (property.values[i] + property.values[i+1]) / 2;
        var blue_rate = (middle_value - pro_min_max.value[0]) / (pro_min_max.value[1] - pro_min_max.value[0]);
        if (blue_rate < 0.2){
          blue_rate = 0.2;
        }
        if (blue_rate > 0.9){
          blue_rate = 0.9;
        }

        color = new Cesium.Color(1.0 , 1.0 - blue_rate , 0 , blue_rate);
      }

      if (this.mode == '3D'){
        temp_poly.push([first[0], first[1], heights[i]], [sec[0], sec[1], heights[i+1]],[third[0], third[1], heights[i+1]], [forth[0], forth[1], heights[i]]);
      }else{
        temp_poly.push([first[0], first[1], 0], [sec[0], sec[1], 0],       [third[0], third[1], 0], [forth[0], forth[1], 0]);
      }

      geoInstance = MFOC.drawOnePolygon(temp_poly, null, this.mode == '3D', color);
      surface.push(geoInstance);
    }
  }
  var typhoon = new Cesium.Primitive({
    geometryInstances: surface,
    appearance: new Cesium.PerInstanceColorAppearance()
  });

  typhoon.name = options.name;
  return typhoon;

}

MFOC.prototype.drawPathMovingLineString = function(options){
  var trianlgeCollection = new Cesium.PrimitiveCollection();

  var data = options.temporalGeometry;
  var property = options.temporalProperty;

  var pro_min_max = null;
  if (property != undefined){
    pro_min_max = MFOC.findMinMaxProperties(property);
  }

  var color = this.getColor(options.name).withAlpha(0.7);

  //;

  var heights = this.getListOfHeight(data.datetimes);

  var coord_arr = data.coordinates;
  for (var i = 0; i < coord_arr.length ; i++){

    if (i == 0){
      pre_polyline = coord_arr[0];
      continue;
    }

    if (property != undefined){
      var middle_value = (property.values[i] + property.values[i+1]) / 2;
      var blue_rate = (middle_value - pro_min_max.value[0]) / (pro_min_max.value[1] - pro_min_max.value[0]);
      if (blue_rate < 0.2){
        blue_rate = 0.2;
      }
      if (blue_rate > 0.9){
        blue_rate = 0.9;
      }

      color = new Cesium.Color(1.0 , 1.0 - blue_rate , 0 , blue_rate);
    }

    trianlgeCollection.add(this.drawTrinaglesWithNextPos(pre_polyline, coord_arr[i], heights[i-1], heights[i], color));

    pre_polyline = coord_arr[i];
  }

  return trianlgeCollection;
}


MFOC.prototype.drawTrinaglesWithNextPos = function(line_1, line_2, height1, height2, color){
  var instances = [];
  var i=0,
  j=0;

  var with_height = (this.mode == '3D');

  while ( i < line_1.length - 1 && j < line_2.length - 1){
    var new_color;
    if (color == undefined){
      new_color = Cesium.Color.fromRandom({
        minimumRed : 0.8,
        minimumBlue : 0.8,
        minimumGreen : 0.8,
        alpha : 0.4
      });
    }
    else{
      new_color = color;
    }

    var positions = [];
    var point_1 = line_1[i];
    var point_2 = line_2[j];

    var next_point_1 = line_1[i+1];
    var next_point_2 = line_2[j+1];

    point_1.push(height1);
    positions.push(point_1);
    point_2.push(height2);
    positions.push(point_2);

    var dist1 = MFOC.euclidianDistance2D(point_1, next_point_2);
    var dist2 = MFOC.euclidianDistance2D(point_2, next_point_1);

    if (dist1 > dist2){
      next_point_1.push(height1);
      positions.push(next_point_1);
      i++;
    }
    else{
      next_point_2.push(height2);
      positions.push(next_point_2);
      j++;
    }
    instances.push(MFOC.drawOnePolygon(positions,null,with_height,new_color));
  }

  while (i < line_1.length - 1 || j < line_2.length - 1){
    var new_color;
    if (color == undefined){
      new_color = Cesium.Color.fromRandom({
        minimumRed : 0.6,
        minimumBlue : 0.0,
        minimumGreen : 0.0,
        alpha : 0.4
      });
    }
    else{
      new_color = color;
    }

    var positions = [];
    var point_1 = line_1[i];
    var point_2 = line_2[j];

    point_1.push(height1);
    positions.push(point_1);
    point_2.push(height2);
    positions.push(point_2);


    if (i == line_1.length - 1){
      var next_point = line_2[j+1];
      next_point.push(height2);
      positions.push(next_point);
      j++;
    }
    else if (j == line_2.length - 1){
      var next_point = line_1[i+1];
      next_point.push(height1);
      positions.push(next_point);
      i++;
    }
    else {
      alert("error");
    }
    instances.push(MFOC.drawOnePolygon(positions,null,with_height,new_color));
  }

  var temp = new Cesium.Primitive({
    geometryInstances : instances,
    appearance : new Cesium.PerInstanceColorAppearance({   }),
    show : true
  });


  return temp;

}

MFOC.euclidianDistance2D = function(a, b) {
  var pow1 = Math.pow(a[0] - b[0], 2);
  var pow2 = Math.pow(a[1] - b[1], 2);
  return Math.sqrt(pow1 + pow2);
}

MFOC.euclidianDistance3D = function(a, b) {
  var pow1 = Math.pow(a[0] - b[0], 2);
  var pow2 = Math.pow(a[1] - b[1], 2);
  var pow3 = Math.pow(a[2] - b[2], 2);
  return Math.sqrt(pow1 + pow2 + pow3);
}


MFOC.drawOneCube = function(positions, rating = 1.0){
  var red_rate = 1.0, green_rate = 1.9 - rating * 1.9;
  var blue_rate = 0.0;

  if (green_rate > 1.0){
    green_rate = 1.0;
  }
  var alpha = rating + 0.1;
  if (alpha > 1.0) alpha = 1.0;
  var rating_color = new Cesium.Color(
    red_rate,
    green_rate,
    blue_rate,
    alpha
  );

  var size = MFOC.calcSidesBoxCoord(positions);

  var geometry = Cesium.BoxGeometry.fromDimensions({
    vertexFormat : Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
    dimensions :  new Cesium.Cartesian3( size[0], size[1], size[2] )
  });
  //console.log(positions, geometry);
  var position = Cesium.Cartesian3.fromDegrees( (positions.minimum.x + positions.maximum.x) / 2, (positions.maximum.y + positions.minimum.y) /2 , (positions.minimum.z + positions.maximum.z) / 2);

  var point3d = new Cesium.Cartesian3( 0.0, 0.0, 0.0 );
  var translation = Cesium.Transforms.eastNorthUpToFixedFrame( position );
  var matrix = Cesium.Matrix4.multiplyByTranslation( translation, point3d, new Cesium.Matrix4() );


  var geo_instance = new Cesium.GeometryInstance({
    geometry : geometry,
    modelMatrix : matrix,
    attributes : {
      color : Cesium.ColorGeometryInstanceAttribute.fromColor(rating_color)
    }

  } );

  return new Cesium.Primitive({
    geometryInstances : geo_instance,
    appearance : new Cesium.PerInstanceColorAppearance({
      translucent : true
    }),
    show : true
  });

}

MFOC.calcSidesBoxCoord = function(box_coord){
  var x_dist = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.minimum.z), Cesium.Cartesian3.fromDegrees(box_coord.maximum.x, box_coord.minimum.y, box_coord.minimum.z));
  var y_dist = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.minimum.z), Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.maximum.y, box_coord.minimum.z));
  var z_dist = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.minimum.z), Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.maximum.z));

  return [x_dist, y_dist, z_dist];
}


MFOC.prototype.drawZaxis = function(){
  var polylineCollection = new Cesium.PolylineCollection();
  var positions = [179,89,0,179,89,this.max_height];

  polylineCollection.add(MFOC.drawOneLine(positions,Cesium.Color.WHITE));
  polylineCollection.add(MFOC.drawOneLine([178,88,this.max_height*0.95,179,89,this.max_height,179.9,89.9,this.max_height*0.95],Cesium.Color.WHITE));

  for (var height = 10 ; height < 100 ; height += 20){
    for (var long = -179 ; long < 179 ; long += 10){
      polylineCollection.add(MFOC.drawOneLine([long,88,this.max_height * height / 100,long+5,89,this.max_height/100 * height],Cesium.Color.WHITE, 1));
    }
    for (var lat = -89 ; lat < 89 ; lat += 10){
      polylineCollection.add(MFOC.drawOneLine([179,lat,this.max_height * height / 100,179,lat+5,this.max_height/100 * height],Cesium.Color.WHITE, 1));
    }
  }


  return polylineCollection;
}

MFOC.prototype.drawZaxisLabel = function(){
  var entities = new Cesium.EntityCollection();
  var label = {
    position : Cesium.Cartesian3.fromDegrees(170, 88, this.max_height + 50000),
    label : {
      text : 'TIME',
      font : '18pt sans-serif',
      // fillColor : Cesium.Color.WHITE,
      // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      // outlineWidth : 1.0,
      // outlineColor : Cesium.Color.WHITE,
      verticalOrigin : Cesium.VerticalOrigin.TOP,
      pixelOffsetScaleByDistance : new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e7, 0.1)
    }
  };
  entities.add(label);

  for (var height = 10 ; height < 100 ; height += 20){
    var time_label = new Date(this.min_max.date[0].getTime() + (this.min_max.date[1].getTime() - this.min_max.date[0].getTime()) * height/100).toISOString().split('T')[0];
    var label = {
      position : Cesium.Cartesian3.fromDegrees(155, 88, this.max_height * height / 100),
      label : {
        text : time_label,
        font : '12pt sans-serif',
        // fillColor : Cesium.Color.WHITE,
        // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        // outlineWidth : 1.0,
        // outlineColor : Cesium.Color.WHITE,
        verticalOrigin : Cesium.VerticalOrigin.TOP,
        pixelOffsetScaleByDistance : new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e7, 0.1)
      }
    };
    entities.add(label);
  }

  return entities;

}


MFOC.prototype.showProjection = function(name){

  var mf = this.getFeatureByName(name);
  var color = this.getColor(name);

  var geometry = mf.temporalGeometry;
  var instances = [];
  var time_label = [];
  //upper
  var upper_pos = [];
  var right_pos = [];

  var heights = this.getListOfHeight(geometry.datetimes);

  for (var index = 0 ; index < geometry.coordinates.length ; index++){
    var xy;
    if (geometry.type != 'MovingPoint'){
      xy = MFOC.getCenter(geometry.coordinates[index], geometry.type);
    }
    else{
      xy = geometry.coordinates[index];
    }
    upper_pos = upper_pos.concat([xy[0], 89, heights[index]]);
    right_pos = right_pos.concat([179, xy[1], heights[index]]);
  }

  instances.push(MFOC.drawInstanceOneLine(upper_pos, color.withAlpha(1.0)));
  instances.push(MFOC.drawInstanceOneLine(right_pos, color.withAlpha(1.0)));

  for (var index = 0 ; index < 2 ; index++){
    var i = index * (geometry.coordinates.length-1);
    var xy;
    if (geometry.type != 'MovingPoint'){
      xy = MFOC.getCenter(geometry.coordinates[i], geometry.type);
    }
    else{
      xy = geometry.coordinates[i];
    }
    var h = heights[i];
    for (var j = xy[1] ; j < 87.4 ; j += 2.5){
      instances.push(MFOC.drawInstanceOneLine([xy[0], j, h, xy[0], j+1.25, h], Cesium.Color.WHITE.withAlpha(0.5)));
    }
    for (var j = xy[0] ; j < 177.4 ; j += 2.5){
      instances.push(MFOC.drawInstanceOneLine([j, xy[1], h, j+1.25, xy[1], h], Cesium.Color.WHITE.withAlpha(0.5)));
    }

  }
  //right

  var prim = new Cesium.Primitive({
    geometryInstances: instances,
    appearance: new Cesium.PolylineColorAppearance(),
    allowPicking : false
  });
  return prim;
}

MFOC.prototype.showHeightBar = function(name){

  var mf = this.getFeatureByName(name);
  var color = this.getColor(name);

  var geometry = mf.temporalGeometry;
  var instances = [];
  var time_label = [];
  //upper
  var pole = [];
  var upper_pos = [];
  var right_pos = [];

  var heights = this.getListOfHeight(geometry.datetimes);
  pole = [179,89,heights[0],179,89,heights[geometry.datetimes.length-1]];
  instances.push(MFOC.drawInstanceOneLine(pole, Cesium.Color.RED.withAlpha(1.0), 10));

  time_label.push({
    position : Cesium.Cartesian3.fromDegrees(160, 78, heights[0]),
    label : {
      text : geometry.datetimes[0],
      font : '12pt sans-serif',
      verticalOrigin : Cesium.VerticalOrigin.TOP
    }
  });
  time_label.push({
    position : Cesium.Cartesian3.fromDegrees(178, 60, heights[geometry.datetimes.length-1]),
    label : {
      text : geometry.datetimes[geometry.datetimes.length-1],
      font : '12pt sans-serif',
      verticalOrigin : Cesium.VerticalOrigin.TOP
    }
  });


  // show projection and red dot line
  // for (var index = 0 ; index < geometry.coordinates.length ; index++){
  //   var xy;
  //   if (geometry.type != 'MovingPoint'){
  //     xy = MFOC.getCenter(geometry.coordinates[index], geometry.type);
  //   }
  //   else{
  //     xy = geometry.coordinates[index];
  //   }
  //   upper_pos = upper_pos.concat([xy[0], 89, heights[index]]);
  //   right_pos = right_pos.concat([179, xy[1], heights[index]]);
  // }
  //
  // instances.push(MFOC.drawInstanceOneLine(upper_pos, color.withAlpha(1.0)));
  // instances.push(MFOC.drawInstanceOneLine(right_pos, color.withAlpha(1.0)));
  //
  // for (var index = 0 ; index < 2 ; index++){
  //   var i = index * (geometry.coordinates.length-1);
  //   var xy;
  //   if (geometry.type != 'MovingPoint'){
  //     xy = MFOC.getCenter(geometry.coordinates[i], geometry.type);
  //   }
  //   else{
  //     xy = geometry.coordinates[i];
  //   }
  //   var h = heights[i];
  //   for (var j = xy[1] ; j < 87.4 ; j += 2.5){
  //     instances.push(MFOC.drawInstanceOneLine([179, j, h, 179, j+1.25, h], Cesium.Color.RED.withAlpha(0.5)));
  //   }
  //   for (var j = xy[0] ; j < 177.4 ; j += 2.5){
  //     instances.push(MFOC.drawInstanceOneLine([j, 89, h, j+1.25, 89, h], Cesium.Color.RED.withAlpha(0.5)));
  //   }
  //
  // }

  var prim = new Cesium.Primitive({
    geometryInstances: instances,
    appearance: new Cesium.PolylineColorAppearance(),
    allowPicking : false
  });

  return [prim,time_label];
}
//draw movingfeature with z-value.
/*
var drawPolygonsWithZvalue = function(mf_arr, with_height){

}


var drawPointsWithZvalue = function(mf_arr, with_height, max_height = 1000){
  var pointCollection = new Cesium.PointPrimitiveCollection();
  var min_max = findAllMinMaxTimeAndZ(mf_arr, true);

  for (var id = 0 ; id < mf_arr.length ; id++){
    var r_color = Cesium.Color.fromRandom({
      red : 0.0,
      blue : 0.0,
      minimumGreen : 0.2,
      alpha : 1.0
    });

    var buffer = mf_arr[id];
    var heights = getListOfHeight(buffer.temporalGeometry.datetimes, min_max.date, max_height);
    var data = buffer.temporalGeometry.coordinates;
    for(var i = 0 ; i < data.length ; i++ ){
      var p_color = r_color.clone();
      p_color.red = data[i][2] / min_max.value[1];
      p_color.blue = data[i][2] / min_max.value[1];

      if (!with_height){
        heights[i] = 0;
      }
      pointCollection.add(drawOnePoint(data[i], heights[i], p_color));
    }
  }
  return pointCollection;
}


var drawLinesWithZvalue = function(mf_arr, with_height){

}

var drawTyphoonsWithZvalue = function(mf_arr, with_height){

}

var drawLinesPathWithZvalue = function(mf_arr, with_height){

}

var drawPointsPathWithZvalue = function(mf_arr, with_height){
  if ( !Array.isArray(mf_arr) ){
    mf_arr = [mf_arr];
  }



}
*/
﻿//User Method Definition

MFOC.prototype.add = null;
MFOC.prototype.drawPaths = null;
MFOC.prototype.clear = null;
MFOC.prototype.remove = null;
MFOC.prototype.drawFeatures = null;
MFOC.prototype.removeByName = null;
MFOC.prototype.showProperty = null;
MFOC.prototype.highlight = null;
MFOC.prototype.showHeatMap = null;
MFOC.prototype.animate = null;
MFOC.prototype.changeMode = null;
MFOC.prototype.showDirectionalRadar = null;
MFOC.prototype.setCameraView = null;

MFOC.prototype.add = function(mf){
  if (Array.isArray(mf)){
    for (var i = 0 ; i < mf.length ; i++){
      var mf_temp = mf[i];
      if (mf_temp.type != 'MovingFeature'){
        console.log("it is not MovingFeature!!@!@!");
        return 0;
      }
      if (this.features.indexOf(mf_temp) != -1){
        return this.features.length;
      }
      var index = this.zoomoutfeatures.indexOf(mf_temp);
      if (index != -1){
        this.zoomoutfeatures.splice(index, 1);
      }
      this.features.push(mf_temp);
    }
  }
  else{
    if (mf.type != 'MovingFeature'){
      console.log("it is not MovingFeature!!@!@!");
      return 0;
    }
    if (this.features.indexOf(mf) != -1){
      return this.features.length;
    }
    var index = this.zoomoutfeatures.indexOf(mf_temp);
    if (index != -1){
      this.zoomoutfeatures.splice(index, 1);
    }
    this.features.push(mf);
  }

  //this.min_max = this.findMinMax();
  return this.features.length;
}

MFOC.prototype.drawFeatures = function(options){
  var mf_arr;
  if (options != undefined){
    if (options.name == undefined){
      mf_arr = this.features;
    }
    else{
      mf_arr = [];
      var name_arr = [];
      if (!Array.isArray(options.name) ){
        name_arr.push(options.name);
      }
      else{
        name_arr = options.name;
      }

      for (var i = 0 ; i < name_arr.length ; i++){
        var feat = this.getFeatureByName(name_arr[i]);
        if (feat != -1){
          mf_arr.push(feat);
        }
      }
    }
  }
  else{
    mf_arr = this.features;
  }

  if (mf_arr.length == 0){
    console.log("mf_arr is 0. something wrong");
    return -1;
  }

  this.min_max = this.findMinMaxGeometry(mf_arr);
  if (this.mode == '3D'){
    this.bounding_sphere = MFOC.getBoundingSphere(this.min_max, [0,this.max_height] );
    this.viewer.scene.primitives.add(this.drawZaxis());
    var entities = this.drawZaxisLabel();
    console.log(entities);

    this.viewer.entities.add(entities.values[0]);


  }
  else{
    this.bounding_sphere = MFOC.getBoundingSphere(this.min_max, [0,0] );
  }


  for (var index = 0 ; index < mf_arr.length ; index++){
    var feature = mf_arr[index];
    var feat_prim;

    if (feature.temporalGeometry.type == "MovingPoint"){
      feat_prim = this.viewer.scene.primitives.add(this.drawMovingPoint(feature.temporalGeometry,feature.properties.name));
    }
    else if(feature.temporalGeometry.type == "MovingPolygon"){
      feat_prim = this.viewer.scene.primitives.add(this.drawMovingPolygon(feature.temporalGeometry,feature.properties.name));
    }
    else if(feature.temporalGeometry.type == "MovingLineString"){
      feat_prim = this.viewer.scene.primitives.add(this.drawMovingLineString(feature.temporalGeometry,feature.properties.name));
    }
    else{
      console.log("this type cannot be drawn", feature);
    }
    this.feature_prim_memory[feature.properties.name] = feat_prim;//찾아서 지울때 사용.
  }

}

MFOC.prototype.contains = function(obj) {
   var i = this.features.length;
   while (i--) {
       if (this.features[i] === obj) {
           return true;
       }
   }
   return false;
}

MFOC.prototype.drawPaths = function(options){

  var mf_arr;
  if (options != undefined){
    if (options.name == undefined){
      mf_arr = this.features;
    }
    else{
      mf_arr = [];
      var name_arr = [];
      if (!Array.isArray(options.name) ){
        name_arr.push(options.name);
      }
      else{
        name_arr = options.name;
      }

      for (var i = 0 ; i < name_arr.length ; i++){
        mf_arr.push(this.getFeatureByName(name_arr[i]));
      }
    }
  }
  else{
    mf_arr = this.features;
  }

  if (mf_arr.length == 0){
    console.log("mf_arr is 0. something wrong");
    return -1;
  }
  this.min_max = this.findMinMaxGeometry(mf_arr);

  if (this.mode == '3D'){
    this.bounding_sphere = MFOC.getBoundingSphere(this.min_max, [0,this.max_height] );
    this.viewer.scene.primitives.add(this.drawZaxis());
    var entities = this.drawZaxisLabel();
    this.viewer.entities.add(entities.values[0]);


  }
  else{
    this.bounding_sphere = MFOC.getBoundingSphere(this.min_max, [0,0] );
  }

  if (this.mode == 'GLOBE'){
    return this.min_max;
  }

  for (var index = 0 ; index < mf_arr.length ; index++){
    var feature = mf_arr[index];
    var path_prim;
    if (this.mode == 'GLOBE'){

    }
    else{
        if (feature.temporalGeometry.type == "MovingPoint"){
          var prim = this.drawPathMovingPoint({
            temporalGeometry : feature.temporalGeometry,
            name : feature.properties.name
          });
          path_prim = this.viewer.scene.primitives.add(prim);
        }
        else if(feature.temporalGeometry.type == "MovingPolygon"){
          path_prim = this.viewer.scene.primitives.add(this.drawPathMovingPolygon({
            temporalGeometry : feature.temporalGeometry,
            name : feature.properties.name
          }));
        }
        else if(feature.temporalGeometry.type == "MovingLineString"){
          path_prim = this.viewer.scene.primitives.add(this.drawPathMovingLineString({
            temporalGeometry : feature.temporalGeometry,
            name : feature.properties.name
          }));
        }
        else{
          console.log("this type cannot be drawn", feature);
        }
        this.path_prim_memory[feature.properties.name] = path_prim;
    }

  }
  //this.adjustCameraView();
  return this.min_max;
  //this.viewer.camera.flyTo({    destination : this.viewer.camera.position  });
}

MFOC.prototype.reset = function(){
  this.viewer.clock.multiplier = 10;
  this.viewer.dataSources.removeAll();
  var temp = this.viewer.scene.primitives.get(0);
  this.viewer.entities.removeAll();
  this.viewer.scene.primitives.removeAll();
  this.viewer.scene.primitives.add(temp);

  this.path_prim_memory = {};
  this.feature_prim_memory = {};
  this.features = [];
}

MFOC.prototype.clearViewer = function(){
  this.viewer.clock.multiplier = 10;
  this.viewer.dataSources.removeAll();
  var temp = this.viewer.scene.primitives.get(0);
  this.viewer.entities.removeAll();
  this.viewer.scene.primitives.removeAll();
  this.viewer.scene.primitives.add(temp);

  this.path_prim_memory = {};
  this.feature_prim_memory = {};
}

MFOC.prototype.clearAnimation = function(){
  this.viewer.clock.multiplier = 10;
  this.viewer.dataSources.removeAll();
}

MFOC.prototype.remove = function(mf){
  var index = this.features.indexOf(mf);
  if(index === -1){
    console.log("this mf is not exist in array", mf);
  }
  else{

    var remove_mf = this.features.splice(index, 1);

    if (remove_mf[0] != mf){
      console.log("it is something wrong!!!");
      return;
    }
    if (this.path_prim_memory[mf.properties.name] != undefined){
      this.viewer.scene.primitives.remove(this.path_prim_memory[mf.properties.name]);
      this.path_prim_memory[mf.properties.name] = undefined;
    }
    if (this.feature_prim_memory[mf.properties.name] != undefined){
      this.viewer.scene.primitives.remove(this.feature_prim_memory[mf.properties.name]);
      this.feature_prim_memory[mf.properties.name] = undefined;
    }
  }
  return this.features.length;
}

MFOC.prototype.removeByName = function(name){
  var features = this.getFeatureByName(name);
  if (features == -1){
    return;
  }
  var index = this.features.indexOf(features);
  if(index === -1){
    console.log("this mf is not exist in array");
    return;
  }
  else{
    console.log(this.features, this.features[index], mf);
    return;
    var remove_mf = this.features.splice(index, 1);
    if (remove_mf[0] != mf){
      console.log(index, remove_mf[0], mf);
      console.log("it is something wrong!!!");
      return;
    }
    if (this.path_prim_memory[mf.properties.name] != undefined){
      this.viewer.scene.primitives.remove(this.path_prim_memory[mf.properties.name]);
      this.path_prim_memory[mf.properties.name] = undefined;
    }
    if (this.feature_prim_memory[mf.properties.name] != undefined){
      this.viewer.scene.primitives.remove(this.feature_prim_memory[mf.properties.name]);
      this.feature_prim_memory[mf.properties.name] = undefined;
    }
  }
  return this.features.length;
}

MFOC.prototype.showProperty = function(propertyName, divID){
  document.getElementById(divID).style.height = '20%';
  document.getElementById(divID).style.backgroundColor = 'rgba(5, 5, 5, 0.8)';
  var pro_arr = [];
  for (var i = 0 ; i < this.features.length ; i ++){
    var property = MFOC.getPropertyByName(this.features[i], propertyName);
    if (property != -1){
      pro_arr.push(property);
    }
  }
  if (pro_arr.length == 0){
    return;
  }
  this.showPropertyArray(propertyName, pro_arr, divID);
}

MFOC.prototype.highlight = function(movingfeatureName,propertyName){
  var mf_name = movingfeatureName;
  var pro_name = propertyName;

  var mf = this.getFeatureByName(mf_name);
  if (mf == -1){
    console.log("please add mf first.");
    return;
  }
  var property = MFOC.getPropertyByName(mf, pro_name)[0];
  if (property == -1){
    console.log("that property is not in this moving feature");
    return;
  }

  if (this.path_prim_memory[mf_name] != undefined){
    this.viewer.scene.primitives.remove(this.path_prim_memory[mf_name]);
    this.path_prim_memory[mf_name] = undefined;
  }
  if (this.feature_prim_memory[mf_name] != undefined){
    this.viewer.scene.primitives.remove(this.feature_prim_memory[mf_name]);
    this.feature_prim_memory[mf_name] = undefined;
  }

  this.min_max = this.findMinMaxGeometry([mf]);
  var type = mf.temporalGeometry.type;
  this.clearViewer();

  if (this.mode == '3D'){
    this.bounding_sphere = MFOC.getBoundingSphere(this.min_max, [0, this.max_height]  );
    this.viewer.scene.primitives.add(this.drawZaxis());
    var entities = this.drawZaxisLabel();
    for (var i = 0 ; i < entities.values.length ; i ++ ){
      this.viewer.entities.add(entities.values[i]);
    }

  }
  else{
    this.bounding_sphere = MFOC.getBoundingSphere(this.min_max, [0,0] );
  }


  var highlight_prim;
  if (type == 'MovingPolygon'){
    highlight_prim = this.viewer.scene.primitives.add(this.drawPathMovingPolygon({
      temporalGeometry : mf.temporalGeometry,
      temporalProperty : property
    }));
  }
  else if (type == 'MovingPoint'){
    highlight_prim = this.viewer.scene.primitives.add(this.drawPathMovingPoint({
      temporalGeometry :  mf.temporalGeometry,
      temporalProperty : property
    }));
  }
  else if (type == 'MovingLineString'){
    highlight_prim = this.viewer.scene.primitives.add(this.drawPathMovingLineString({
      temporalGeometry :  mf.temporalGeometry,
      temporalProperty : property
    }));
  }
  else{
    LOG('this type is not implemented.');
  }

  this.path_prim_memory[mf_name] = highlight_prim;
  this.animate({
    name : movingfeatureName
  });

  return this.min_max;
}

MFOC.prototype.removeHeatMap = function(){
  if (this.cube_primitives !=  null){
    this.primitives.remove(this.cube_primitives);
    this.cube_primitives = null;
  }
}

MFOC.prototype.showHeatMap = function(degree){
  if (degree == undefined){
    degree = {};
    degree.x = 5;
    degree.y = 5;
    degree.time = 5;
  }

  if (this.mode == '3D'){
    var x_deg = degree.x,
    y_deg = degree.y,
    z_deg = degree.time;

    var mf_arr = this.features;
    if (mf_arr.length == 0){
      return;
    }
    if (this.cube_primitives != null){
      this.primitives.remove(this.cube_primitives);
      this.cube_primitives == null;
    }
    degree.time = degree.time * 86400;
    this.min_max = this.findMinMaxGeometry(mf_arr);
    this.hotspot_maxnum = 0;
    var cube_data = this.makeBasicCube(degree);
    if (cube_data == -1){
      console.log("time degree 너무 큼");
      return;
    }

    for (var index = 0 ; index < mf_arr.length ; index++){
      var feature = mf_arr[index];

      if (feature.temporalGeometry.type == "MovingPoint"){
        this.draw3DHeatMapMovingPoint(feature.temporalGeometry, degree, cube_data);
      }
      else if(feature.temporalGeometry.type == "MovingPolygon"){
        this.draw3DHeatMapMovingPolygon(feature.temporalGeometry, degree, cube_data);
      }
      else if(feature.temporalGeometry.type == "MovingLineString"){
        this.draw3DHeatMapMovingLineString(feature.temporalGeometry, degree, cube_data);
      }
      else{
        console.log("nono", feature);
      }
    }
    if (this.hotspot_maxnum == 0){
      console.log("datetimes of data have too long gap. There is no hotspot");
      return;
    }
    var cube_prim = this.makeCube(degree, cube_data);

    this.cube_primitives = this.primitives.add(cube_prim);
  }
  else{
    var x_deg = degree.x,
    y_deg = degree.y;

    var mf_arr = this.features;
    if (mf_arr.length == 0){
      return;
    }
    if (this.cube_primitives != null){
      this.primitives.remove(this.cube_primitives);
      this.cube_primitives == null;
    }

    this.min_max = this.findMinMaxGeometry(mf_arr);
    this.hotspot_maxnum = 0;
    var map_data = this.makeBasicMap(degree);
    if (cube_data == -1){
      console.log("time degree 너무 큼");
      return;
    }

    for (var index = 0 ; index < mf_arr.length ; index++){
      var feature = mf_arr[index];
      if (feature.temporalGeometry.type == "MovingPoint"){
        this.draw2DHeatMapMovingPoint(feature.temporalGeometry, degree, map_data);
      }
      else if(feature.temporalGeometry.type == "MovingPolygon"){
        this.draw2DHeatMapMovingPolygon(feature.temporalGeometry, degree, map_data);
      }
      else if(feature.temporalGeometry.type == "MovingLineString"){
        this.draw2DHeatMapMovingLineString(feature.temporalGeometry, degree, map_data);
      }
      else{
        console.log("nono", feature);
      }
    }
    if (this.hotspot_maxnum == 0){
      console.log("datetimes of data have too long gap. There is no hotspot");
      return;
    }

    var cube_prim = this.makeMap(degree, map_data);

    this.cube_primitives = this.primitives.add(cube_prim);
  }

}

MFOC.prototype.animate = function(options){
  var mf_arr;
  var current_time;

  if (options != undefined){
    if (options.name == undefined){
      mf_arr = this.features;
    }
    else{
      mf_arr = [];
      var name_arr = [];
      if (!Array.isArray(options.name) ){
        name_arr.push(options.name);
      }
      else{
        name_arr = options.name;
      }

      for (var i = 0 ; i < name_arr.length ; i++){
        mf_arr.push(this.getFeatureByName(name_arr[i]));
      }
    }
  }
  else{
    mf_arr = this.features;
  }


  if (mf_arr.length == 0){
    return -1;
  }

  this.min_max = this.findMinMaxGeometry(mf_arr);

  if (options != undefined){
    if (options.change != undefined){
      current_time = Cesium.JulianDate.toIso8601(this.viewer.clock.currentTime) ;
    }
    else{
      current_time = this.min_max.date[0].toISOString();
    }
  }
  else{
    current_time = this.min_max.date[0].toISOString();
  }


  var multiplier = 10000;
  var czml = [{
    "id" : "document",
    "name" : "polygon_highlight",
    "version" : "1.0"
  }];

  czml[0].clock = {
    "interval" : this.min_max.date[0].toISOString() +"/" + this.min_max.date[1].toISOString(),
    "currentTime" : current_time,
    "multiplier" : multiplier
  }

  for (var index = 0 ; index < mf_arr.length ; index++){
    var feature = mf_arr[index];
    if (feature.temporalGeometry.type == "MovingPoint"){
      czml = czml.concat(this.moveMovingPoint({
        temporalGeometry : feature.temporalGeometry,
        number : index
      }));
    }
    else if(feature.temporalGeometry.type == "MovingPolygon"){
      czml = czml.concat(this.moveMovingPolygon({
        temporalGeometry : feature.temporalGeometry,
        number : index
      }));
    }
    else if(feature.temporalGeometry.type == "MovingLineString"){
      czml = czml.concat(this.moveMovingLineString({
        temporalGeometry : feature.temporalGeometry,
        number : index
      }));
    }
    else{
      console.log("this type cannot be animated", feature);
    }
  }



  var load_czml = Cesium.CzmlDataSource.load(czml);
  var promise = this.viewer.dataSources.add(load_czml);
  var mfoc = this;
  // if (mf_arr.length == 1){
  //   var id;
  //   if (mf_arr[0].temporalGeometry.type == 'MovingPolygon'){
  //     id = "dynamicPolygon_"+0;
  //   }
  //   else{
  //     id = 'movingPoint_' + 0;
  //   }
  //   promise.then(function(dataSources){
  //     console.log(dataSources.entities.getById(id));
  //     mfoc.viewer.trackedEntity = dataSources.entities.getById(id);
  //   })
  //   .otherwise(function(){
  //
  //   });
  //
  // }
  return this.min_max;
}

MFOC.prototype.changeMode = function(mode){
  if (mode == undefined){
    if (this.mode == '2D' || this.mode == 'GLOBE'){
      this.mode = '3D';
    }
    else{
      this.mode = '2D';
    }``
  }
  else{
    this.mode = mode;
  }


  this.clearViewer();
  this.drawPaths();

  this.animate({
    change: true
  });
  this.setAnalysisDIV('analysis','graph');
  this.adjustCameraView();
}

MFOC.prototype.showDirectionalRadar = function(canvasID){
  var radar_canvas = document.getElementById(canvasID);

  radar_canvas.innerHTML = '';
  radar_canvas.getContext('2d').clearRect(0, 0, radar_canvas.width, radar_canvas.height);

  if (this.radar_on){
    console.log('off radar');
    MFOC.drawBackRadar('analysis');
    this.color_arr ={};
    this.radar_on = false;
    return;
  }
  this.radar_on = true;

  var cumulative = new SpatialInfo();

  for (var index = 0 ; index < this.features.length ; index++){
    var feature = this.features[index];
    this.setColor(feature.properties.name, MFOC.addDirectionInfo(cumulative, feature.temporalGeometry));
  }

  var total_life = cumulative.west.total_life + cumulative.east.total_life + cumulative.north.total_life + cumulative.south.total_life;
  var total_length = cumulative.west.total_length + cumulative.east.total_length + cumulative.north.total_length + cumulative.south.total_length;
  var cnvs = document.getElementById(canvasID);
  if (cnvs.getContext){
    var h_width = cnvs.width / 2;
    var h_height = cnvs.height / 2;
    var ctx = cnvs.getContext('2d');
    var max_life = Math.max.apply(null, [cumulative.west.total_life , cumulative.east.total_life , cumulative.north.total_life, cumulative.south.total_life]);

    var max_length = Math.max.apply(null, [cumulative.west.total_length , cumulative.east.total_length , cumulative.north.total_length, cumulative.south.total_length]);
    var scale = 1 / (max_length/total_length) * 0.8;


    var length = [cumulative.west.total_length, cumulative.east.total_length, cumulative.north.total_length, cumulative.south.total_length];
    var length2 = [cumulative.west.total_length,- cumulative.east.total_length, cumulative.north.total_length, -cumulative.south.total_length];
    var life = [cumulative.west.total_life, cumulative.east.total_life, cumulative.north.total_life, cumulative.south.total_life];
    var velocity = [];
    var total_velocity = 0.0;
    for (var i = 0 ; i < length.length ; i++){
      if (life[i] == 0){
        velocity[i] = 0;
        continue;
      }
      velocity[i] = length[i]/life[i];

      total_velocity += velocity[i];
    }

    var color = ['rgb(255, 255, 0)','rgb(0, 255, 0)','Cyan','red'];

    for (var i = 0 ; i < life.length ; i++){

      for (var j = 0 ; j < 2 ; j += 0.1){
        ctx.beginPath();
        ctx.arc(h_width,h_height,h_width * life[i] / max_life, j * Math.PI,(j+0.05)*Math.PI);
        ctx.strokeStyle= color[i];
        ctx.stroke();
      }
    }

    for (var i = 0 ; i < 2 ; i++){
      ctx.beginPath();
      ctx.moveTo(h_width,h_height);
      ctx.lineTo(h_width - length2[i]/max_length * 0.375 * 0.9 * h_width, h_height - 0.25 * 1 * h_height * velocity[i]/total_velocity);
      ctx.lineTo(h_width - length2[i]/max_length * 0.5 * 0.9 *  h_width, h_height - 0.5 * 1 * h_height * velocity[i]/total_velocity);
      ctx.lineTo(h_width - length2[i]/max_length * 1.0 * 0.9 *  h_width, h_height);
      ctx.lineTo(h_width - length2[i]/max_length * 0.5 * 0.9 *  h_width, h_height + 0.5 * 1 * h_height * velocity[i]/total_velocity);
      ctx.lineTo(h_width - length2[i]/max_length * 0.375 * 0.9 *  h_width, h_height + 0.25 * 1 * h_height * velocity[i]/total_velocity);
      ctx.fillStyle= color[i];
      ctx.fill();
    }

    for (var i = 2 ; i < 4 ; i++){
      ctx.beginPath();
      ctx.moveTo(h_width,h_height);
      ctx.lineTo(h_width - velocity[i]/total_velocity * 0.25 * 1 * h_width, h_height - 0.375 * 0.9* h_height * length2[i]/max_length);
      ctx.lineTo(h_width - velocity[i]/total_velocity* 0.5 * 1 * h_width, h_height - 0.5 * 0.9  * h_height * length2[i]/max_length);
      ctx.lineTo(h_width, h_height - 1.0 * 0.9 *  h_height * length2[i]/max_length);
      ctx.lineTo(h_width +  velocity[i]/total_velocity * 0.5 * 1 * h_width, h_height - 0.5 * 0.9 * h_height * length2[i]/max_length);
      ctx.lineTo(h_width +  velocity[i]/total_velocity * 0.25 * 1 * h_width, h_height - 0.375 * 0.9 * h_height * length2[i]/max_length);
      ctx.fillStyle = color[i];
      ctx.fill();
    }


  }
  else{
    alert('canvas를 지원하지 않는 브라우저');
  }
}

MFOC.prototype.adjustCameraView = function(){
  var bounding = this.bounding_sphere;
  var viewer = this.viewer;

  if (bounding == undefined || bounding == -1){
    return;
  }


  setTimeout(function(){
    if (viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW){
    //  return;
      // viewer.camera.flyToBoundingSphere(bounding, {
      //   duration : 1.0,
      //   complete : function(){
      //     var sin = Math.sin(Math.PI / 2) * bounding.radius;
      //     viewer.camera.rotate(new Cesium.Cartesian3(1,0,0),-0.4);
      //   }
      // });
    viewer.camera.flyTo({
      duration : 0.5,
    //  endTransform :

      destination : Cesium.Cartesian3.fromDegrees(-50,-89,28000000),
      orientation : {
        direction : new Cesium.Cartesian3( 0.6886542487458516, 0.6475816335752261, -0.32617994043216153),
        up : new Cesium.Cartesian3(0.23760297490246338, 0.22346852237869355, 0.9453076990183581)
      }});
    }
    else{
      viewer.camera.flyToBoundingSphere(bounding, {
        duration : 0.5
      });
    }
}, 300);

}


MFOC.prototype.setAnalysisDIV = function(div_id, graph_id, radar_id = 'radar'){
  if (div_id == undefined){
    div_id = this.analysis_id;
    graph_id = this.graph_id;
  }

  var mfoc = this;
  this.graph_id = graph_id;
  this.analysis_id = div_id;

  var div = document.getElementById(div_id);
  div.innerHTML ='';
  div.style.top = '120px'
  //div.style.paddingTop = 0;
  div.style.color = 'white';
  div.style.backgroundColor = 'rgba(0,0,0,0.4)';
  div.style.right = '5px';
  div.style.border = '1px solid black';
//  div.style.width = '200px'
  div.style.padding = '0px';
  div.className = "list-group-item active";

  var title = document.createElement("div");
  title.appendChild(document.createTextNode("  ANALYSIS"));
  title.style.paddingTop = '4px';
  title.style.height = '10%';
  title.style.width = '100%';
  title.style.textAlign = 'center';
  title.style.verticalAlign = 'middle';
  title.style.display = 'flex';
  title.style.alignItems = 'center';
  //title.style.marginLeft = '5px';
  title.style.backgroundColor = '#787878';
  title.style.borderBottom = '3px double white';

  var div_arr = [];
  for (var i= 0 ; i < 3 ; i++){
    div_arr[i] = document.createElement("div");
    div_arr[i].style.height = '30%';
    div_arr[i].style.width = '100%';
    div_arr[i].style.cursor = "pointer";
    div_arr[i].style.verticalAlign = 'middle';
    div_arr[i].style.padding = '2%';
    div_arr[i].style.textAlign = 'center';
    div_arr[i].style.borderBottom = '1px solid white';
    div_arr[i].style.display = 'flex';
    div_arr[i].style.alignItems = 'center';
    //div_arr[i].style.backgroundColor = 'rgba(5,5,5,0.5)';
    div_arr[i].style.border = '1px solid white';
    //div_arr[i].style.borderRadius = '15px';
  }

  var properties_graph = div_arr[0],
  show_space_cube = div_arr[1],
  show_direction_radar = div_arr[2];

  properties_graph.appendChild(document.createTextNode("PROPERTY GRAPH"));
  show_space_cube.appendChild(document.createTextNode("TOGGLE HEATCUBE"));
  show_direction_radar.appendChild(document.createTextNode("DIRECTION RADAR"));

  properties_graph.onclick = (function(glo_mfoc, graph){
    return function(){
      MFOC.selectProperty(glo_mfoc, graph);
    };
  })(mfoc, graph_id);

  show_space_cube.onclick = (function(glo_mfoc, div, graph){
    return function(){
      this.style.cursor = 'auto';
      MFOC.selectDegree(mfoc, this, div, graph);
    }
  })(mfoc, div_id, graph_id);


  show_direction_radar.onclick = (function(glo_mfoc, canvas){
    return function(){
      glo_mfoc.showDirectionalRadar(canvas);
      glo_mfoc.clearViewer();
      glo_mfoc.drawPaths();
      glo_mfoc.animate();
      if (document.getElementById('pro_menu'))
        document.getElementById('pro_menu').remove();
      document.getElementById(glo_mfoc.graph_id).style.height="0%";
    }
  })(mfoc, radar_id);

  div.appendChild(title);
  div.appendChild(properties_graph);
  div.appendChild(show_space_cube);
  div.appendChild(show_direction_radar);

  MFOC.drawBackRadar(radar_id);
}



MFOC.prototype.clickMovingFeature = function(name){
  if (name == undefined){
     return;
  }

  if (this.projection != null){
    if (!this.projection.isDestroyed()){
      this.primitives.remove(this.projection);
    }
    this.projection = null;
  }
  if (this.time_label.length != 0){
    for (var i = 0 ; i < this.time_label.length ; i++){
      if (this.time_label[i] != null && this.time_label[i] != undefined)
        this.viewer.entities.remove(this.time_label[i]);
    }
  }
  if (this.label_timeout != undefined){
      window.clearTimeout(this.label_timeout);
  }

  this.time_label = [];

  if (this.mode == '3D'){
    var ret = this.showHeightBar(name);
    this.projection = this.primitives.add(ret[0]);

    var time_label = ret[1];
    for (var i  = 0 ; i < time_label.length ; i++){
      this.time_label.push(this.viewer.entities.add(time_label[i]));
    }

  }

  var mfoc = this;
  this.label_timeout = setTimeout(function(){
    if (mfoc.projection != null){
      if (!mfoc.projection.isDestroyed()){
        mfoc.primitives.remove(mfoc.projection);
      }
      mfoc.projection = null;
    }
    if (mfoc.time_label.length != 0){
      for (var i = 0 ; i < mfoc.time_label.length ; i++){
        if (mfoc.time_label[i] != null && mfoc.time_label[i] != undefined)
        mfoc.viewer.entities.remove(mfoc.time_label[i]);
      }
    }

},1500);


  return 1;

}


MFOC.prototype.update = function(){
  this.clearViewer();
  this.drawPaths();
  this.animate();
  return this.min_max;
}

MFOC.prototype.spliceByTime = function(start, end){//Date, Date
  var mf_arr = this.features;
  var new_mf_arr = [];
  var del_mf_arr = [];
  for (var i = 0 ; i < mf_arr.length ; i++){
    var min_max_date = MFOC.findMinMaxTime(mf_arr[i].temporalGeometry.datetimes);
    if (min_max_date[0] >= start && min_max_date[1] <= end){
      new_mf_arr.push(mf_arr[i]);
    }
    else{
      del_mf_arr.push(mf_arr[i]);
    }
  }

  for (var i = 0 ; i < this.zoomoutfeatures.length ; i++){
    var min_max_date = MFOC.findMinMaxTime(this.zoomoutfeatures[i].temporalGeometry.datetimes);
    if (min_max_date[0] >= start && min_max_date[1] <= end){
      new_mf_arr.push(this.zoomoutfeatures[i]);
    }
    else{
      del_mf_arr.push(this.zoomoutfeatures[i]);
    }

  }

  this.features = new_mf_arr;
  this.zoomoutfeatures = del_mf_arr;
}
function MFOC(viewer){
  this.viewer = viewer;
  this.primitives = viewer.scene.primitives;
  this.features = [];
  this.mode = '2D';
  this.max_height = 30000000;
  this.path_prim_memory = {};
  this.feature_prim_memory = {};
  this.cube_primitives = null;
  this.bounding_sphere = null;
  this.color_arr = {};
  this.radar_on = false;
  this.zoomoutfeatures = [];
  this.graph_id =null;
  this.analysis_id = null;
  this.radar_id = null;

  this.projection = null;
  this.time_label = [];
  this.label_timeout;

  this.is_animating = false;
  if (isNaN( new Date("2015-07-30 09:00:00").getTime() )){
    alert("this browser maybe something error to draw MovingFeatures.. i recommend chrome.");
  };

  var mfoc = this;

}


function BoxCoord(){
  this.minimum = {};
  this.maximum = {};
};

function DirectionInfo(life=0, leng=0){
  this.total_life = life;
  this.total_length = leng;
}

function SpatialInfo(){
  this.west = new DirectionInfo();
  this.east = new DirectionInfo();
  this.north = new DirectionInfo();
  this.south = new DirectionInfo();
}

var SampledProperty = function(){
  this.array = [];
  this.addSample = function(x, y){
    this.array.push({
      'x':x,
      'y':y});
    this.array.sort(function(a, b){
      var keyA = a.x,
      keyB = b.x;
      // Compare the 2 dates
      if(keyA < keyB) return -1;
      if(keyA > keyB) return 1;
      return 0;
    });
  };

  this.getValue =  function(x){
    if (x < this.array[0].x){
      return undefined;
    }
    for (var i = 0 ; i < this.array.length -1 ; i++){
      if (x >= this.array[i].x && x <= this.array[i+1].x){
        var b = this.array[i+1].y - this.array[i+1].x * (this.array[i+1].y - this.array[i].y)/(this.array[i+1].x - this.array[i].x);
        return (this.array[i+1].y - this.array[i].y)/(this.array[i+1].x - this.array[i].x) * x + b;
      }
    }
    return undefined;
  };
}
MFOC.prototype.moveMovingPoint = function(options){
  var czml = [];

  var geometry = options.temporalGeometry;
  var number = options.number;
  var multiplier = 10000;
  var length = geometry.datetimes.length;
  var start, stop;
  start = new Date(geometry.datetimes[0]).toISOString();
  stop = new Date(geometry.datetimes[length - 1]).toISOString();

  var availability = start + "/" + stop;

  if (geometry.interpolations == "Spline" || geometry.interpolations == "Linear"){
    var interpolations;
    if (geometry.interpolations == "Spline"){
      interpolations = "HERMITE";
    }
    else{
      interpolations = "LINEAR";
    }
    var v = {};
    v.id = 'movingPoint_' + number;
    v.point = {
      "color" : {
        "rgba" : [0, 0, 0, 255]
      },
      "outlineColor" : {
        "rgba" : [255, 255, 255, 255]
      },
      "outlineWidth" : 4,
      "pixelSize" : 20
    };

    var carto = [];
    var point = geometry.coordinates;
    for (var i = 0 ; i < geometry.coordinates.length ; i++){
      carto.push(new Date(geometry.datetimes[i]).toISOString());
      carto.push(point[i][0]);
      carto.push(point[i][1]);
      var normalize = MFOC.normalizeTime(new Date(geometry.datetimes[i]), this.min_max.date, this.max_height);
      if (this.mode == '3D'){
        carto.push(normalize);
      }
      else{
        carto.push(1000);
      }

    }
    v.availability = availability;
    v.position = {
      "interpolationAlgorithm": interpolations,
      "interpolationDegree": 2,
      "interval" : availability,
      "epoch" : start,
      "cartographicDegrees" : carto
    };
    czml.push(v);
  }
  else {
    var v = {};
    v.id = 'movingPoint_'+number;
    v.point = {
      "color" : {
        "rgba" : [255, 0, 0, 255]
      },
      "outlineColor" : {
        "rgba" : [255, 255, 255, 255]
      },
      "outlineWidth" : 2,
      "pixelSize" : 10
    };

    var carto = [];
    var point = geometry.coordinates;
    for (var i = 0 ; i < geometry.coordinates.length - 1 ; i++){
      var obj ={};
      if (geometry.interpolations == "Stepwise"){
        var start_interval = new Date(geometry.datetimes[i]).toISOString();
        var finish_interval = new Date(geometry.datetimes[i+1]).toISOString();
        obj.interval = start_interval+"/"+finish_interval;
      }
      else{
        var start_interval = new Date(geometry.datetimes[i]).toISOString();
        var start_date = new Date(geometry.datetimes[i]);
        var finish_date = start_date.setHours(start_date.getHours() + multiplier/10000);
        var finish_interval = new Date(finish_date).toISOString();
        obj.interval = start_interval+"/"+finish_interval;
      }
      obj.cartographicDegrees = [];
      obj.cartographicDegrees.push(point[i][0]);
      obj.cartographicDegrees.push(point[i][1]);

      var normalize = MFOC.normalizeTime(new Date(geometry.datetimes[i]), this.min_max.date);
      if (this.mode == '3D'){
        obj.cartographicDegrees.push(normalize);
      }
      else{
        obj.cartographicDegrees.push(1000);
      }
      carto.push(obj);
    }
    v.availability = availability;
    v.position = carto;
    czml.push(v);
  }



  return czml;
}

MFOC.prototype.moveMovingPolygon =function(options){
  var geometry = options.temporalGeometry,
  number = options.number;
  var multiplier = 10000;
  var czml = [];
  var ref_obj = {
    "id" : "dynamicPolygon_"+number,
    "polygon": {
      "positions": {
        "references": [
          "v_"+number+"_1#position",
          "v_"+number+"_2#position",
          "v_"+number+"_3#position",
          "v_"+number+"_4#position",
          "v_"+number+"_5#position",
          "v_"+number+"_6#position",
          "v_"+number+"_7#position",
          "v_"+number+"_8#position",

        ]
      },
      "perPositionHeight" : true,
      "material": {
        "solidColor": {
          "color": {
            "rgbaf" : [1, 0, 0, 1]
          }
        }
      }
    }
  };

  var length = geometry.datetimes.length;

  var start, stop;
  start = new Date(geometry.datetimes[0]).toISOString();
  stop = new Date(geometry.datetimes[length-1]).toISOString();
  var availability = start + "/" + stop;
  ref_obj.availability = availability;

  if (geometry.interpolations == "Spline" || geometry.interpolations == "Linear")
  {
    czml.push(ref_obj);
    var interpolations;
    if (geometry.interpolations == "Spline"){
      interpolations = "HERMITE";
    }
    else{
      interpolations = "LINEAR";
    }

    for (var i = 0 ; i < geometry.coordinates[0].length-1 ; i++){
      var v = {};
      v.id = 'v_'+number+"_"+(i+1);
      v.position = {
        "interpolationAlgorithm": interpolations,
        "interpolationDegree": 2,
        "interval" : availability,
        "epoch" : start,
        "cartographicDegrees" : []
      };
      czml.push(v);

      var start_second = new Date(geometry.datetimes[0]).getTime();
      var carto = [];
      for (var j = 0 ; j < geometry.datetimes.length ; j ++){
        var seconds = new Date(geometry.datetimes[j]).getTime() - start_second;
        var normalize = MFOC.normalizeTime(new Date(geometry.datetimes[j]), this.min_max.date, this.max_height);
        var polygon = geometry.coordinates[j];

        carto.push(seconds / 1000);
        carto.push(polygon[i][0]);
        carto.push(polygon[i][1]);
        if (this.mode == '2D' || this.mode == 'GLOBE')
        {
          carto.push(10000);
        }
        else{
          carto.push(normalize);
        }


      }

      v.position.cartographicDegrees = carto;
    }




  }
  else{
    for (var i = 0 ; i < geometry.datetimes.length - 1  ; i++){
      var start_date = new Date(geometry.datetimes[i]);
      var start_iso = start_date.toISOString();

      var finish_iso;
      if (geometry.interpolations == "Stepwise"){
        finish_iso = new Date(geometry.datetimes[i+1]).toISOString();
      }
      else{
        var finish_date = start_date;
        finish_date.setHours(start_date.getHours() + multiplier/10000) ;
        finish_iso = finish_date.toISOString();
      }

      var v = {};
      v.id ="polygon_"+number+"_"+i;
      v.availability = start_iso+"/"+finish_iso;
      var carto = [];
      var normalize = MFOC.normalizeTime(new Date(geometry.datetimes[i]), this.min_max.date, this.max_height);
      var polygon = geometry.coordinates[i];
      for (var j = 0 ; j < polygon.length-1 ; j++){
        carto.push(polygon[j][0]);
        carto.push(polygon[j][1]);
        if (this.mode == '2D')
        carto.push(normalize);
        else {
          carto.push(0);
        }
      }

      v.polygon = {
        "positions" : {
          "cartographicDegrees" : carto
        },
        "meterial" :{
          "solidColor" :{
            "color" : {
              "rgbaf" : [1, 0, 1, 1]
            }
          }
        },
        "perPositionHeight" : true
      };
      czml.push(v);
    }

  }


  return czml;
}

MFOC.prototype.moveMovingLineString = function(options){
  var czml = [];
  var geometry = options.temporalGeometry;
  var number = options.number
  var datetime = geometry.datetimes;
  var length = datetime.length;
  var multiplier = 10000;
  var next_mapping_point_arr = MFOC.calculatePathForEachPoint(geometry);

  if (geometry.interpolations == "Spline" || geometry.interpolations == "Linear")
  {
    var next_point_each_line = next_mapping_point_arr;
    var interpolations;
    if (geometry.interpolations == "Spline"){
      interpolations = "HERMITE";
    }
    else{
      interpolations = "LINEAR";
    }
    for (var i = 0 ; i < next_point_each_line.length ; i++ ){
      //한 줄 씩 start -> end로 polyline

      var start, stop;
      start = new Date(datetime[i]).toISOString();
      stop = new Date(datetime[i+1]).toISOString();

      var availability = start + "/" + stop;
      var next_point = next_point_each_line[i];

      var czml_ref_obj = {
        "polyline" :{
          "width" : 5
        }
      };

      czml_ref_obj.id = "polyline_"+number+"_"+i;
      czml_ref_obj.availability = availability;
      czml_ref_obj.polyline.perPositionHeight = true;
      czml_ref_obj.polyline.meterial = {
        "solidColor": {
          "color": {
            "rgba" : [255, 0, 0, 255]
          }
        }
      };

      var ref_arr =[];

      czml_ref_obj.polyline.positions = {
        "references" : ref_arr
      }
      czml.push(czml_ref_obj);

      var height_1 = MFOC.normalizeTime(new Date(datetime[i]),this.min_max.date,this.max_height);
      var height_2 = MFOC.normalizeTime(new Date(datetime[i+1]),this.min_max.date,this.max_height);;
      if (this.mode == '2D'){
        height_1 = 0;
        height_2 = 0;
      }

      for (var j = 0 ; j < next_point.length ; j++){
        ref_arr.push("v"+number+"_"+i+"_"+j+"#position");

        var czml_position_obj = {};
        czml_position_obj.id = "v"+number+"_"+i+"_"+j;
        czml_position_obj.position = {
          "interpolationAlgorithm": interpolations,
          "interpolationDegree": 1,
          "interval" : availability,
          "epoch" : start
        };


        //console.log(j, next_point[j]);
        var carto = [
          0, next_point[j][0][0] , next_point[j][0][1], height_1,
          (new Date(datetime[i+1]).getTime() - new Date(datetime[i]).getTime()) /1000, next_point[j][1][0], next_point[j][1][1], height_2
        ];

        czml_position_obj.position.cartographicDegrees = carto;

        czml.push(czml_position_obj);
      }

    }
  }
  else{
    for (var i = 0 ; i < geometry.datetimes.length - 1 ; i++){
      var start_date = new Date(geometry.datetimes[i]);
      var start_iso = start_date.toISOString();

      var finish_iso;
      if (geometry.interpolations == "Stepwise"){
        finish_iso = new Date(geometry.datetimes[i+1]).toISOString();
      }
      else{
        var finish_date = start_date;
        finish_date.setHours(start_date.getHours() + multiplier/10000) ;
        finish_iso = finish_date.toISOString();
      }

      var v = {};
      v.id ="polyline_"+number+"_"+i;
      v.availability = start_iso+"/"+finish_iso;

      var carto = [];
      var normalize = MFOC.normalizeTime(new Date(geometry.datetimes[i]), this.min_max.date, this.max_height);//this.height_collection[id][i];

      if (this.mode == '2D'){
        normalize = 0;
      }

      var polyline = geometry.coordinates[i];
      for (var j = 0 ; j < polyline.length-1 ; j++){
        carto.push(polyline[j][0]);
        carto.push(polyline[j][1]);
        carto.push(normalize);
      }

      v.polyline = {
        "width" : 5,
        "positions" : {
          "cartographicDegrees" : carto
        },
        "meterial" :{
          "solidColor" :{
            "color" : {
              "rgba" : [255, 0, 255, 255]
            }
          }
        }
      };
      czml.push(v);
    }

  }

  return czml;
}



MFOC.calculatePathForEachPoint = function(mls){

  var pre_polyline;
  var coord_arr = mls.coordinates;
  var next_mapping_point_arr = [];
  for (var i = 0; i < coord_arr.length ; i++){
    if (i == 0){
      pre_polyline = coord_arr[0];
      continue;
    }

    next_mapping_point_arr[i-1] = MFOC.findMapping(pre_polyline, coord_arr[i]);

    pre_polyline = coord_arr[i];
  }

  return next_mapping_point_arr;
}

MFOC.findMapping = function(line_1, line_2){
  var i=0,
  j=0;
  var array = [];
  array.push([line_1[0],line_2[0]]);
  while ( i < line_1.length - 1 && j < line_2.length - 1){
    var point_1 = line_1[i];
    var point_2 = line_2[j];

    var next_point_1 = line_1[i+1];
    var next_point_2 = line_2[j+1];

    var dist1 = MFOC.calculateCarteDist(point_1, next_point_2);
    var dist2 = MFOC.calculateCarteDist(point_2, next_point_1);

    var triangle = [];
    if (dist1 > dist2){
      array.push([next_point_1,point_2]);
      i++;
    }
    else{
      array.push([point_1,next_point_2]);
      j++;
    }
  }

  while (i < line_1.length - 1 || j < line_2.length - 1){
    var point_1 = line_1[i];
    var point_2 = line_2[j];

    if (i == line_1.length - 1){
      var next_point = line_2[j+1];
      array.push([point_1,next_point]);
      j++;
    }
    else if (j == line_2.length - 1){
      var next_point = line_1[i+1];
      array.push([next_point,point_2]);
      i++;
    }
    else {
      alert("error");
    }
  }
  return array;
}
MFOC.addDirectionInfo = function(cumulative, geometry){
  var life = MFOC.calculateLife(geometry) / 1000000;
  var length = MFOC.calculateLength(geometry);

  var start_point = geometry.coordinates[0];
  var end_point = geometry.coordinates[geometry.coordinates.length-1];

  if (geometry.type != "MovingPoint" ){ // Polygon, LineString
    start_point = MFOC.getCenter(start_point, geometry.type);
    end_point = MFOC.getCenter(end_point, geometry.type);
  }

  var dist_x, dist_y;

  dist_x = end_point[0] - start_point[0];
  dist_y = end_point[1] - start_point[1];

  var r_color ;
  if (dist_x == 0){
    if (dist_y > 0){
      cumulative.north.total_life += life;
      cumulative.north.total_length += length;
      r_color = Cesium.Color.fromRandom({
        maximumRed : 0.2,
        minimumBlue : 0.7,
        minimumGreen : 0.6,
        alpha : 1.0
      });
    }
    else if (dist_y < 0){
      cumulative.south.total_life += life;
      cumulative.south.total_length += length;
      r_color = Cesium.Color.fromRandom({
        minimumRed : 0.7,
        maximumBlue : 0.2,
        maximumGreen : 0.2,
        alpha : 1.0
      });
    }
    else{

    }
  }
  else{
    var slope = dist_y / dist_x ;
    if (slope < 1 && slope > -1){
      if (dist_x > 0 ){
        cumulative.east.total_life += life;
        cumulative.east.total_length += length;
        r_color = Cesium.Color.fromRandom({
          maximumRed : 0.2,
          maximumBlue : 0.2,
          minimumGreen : 0.7,
          alpha : 1.0
        });
      }
      else{
        cumulative.west.total_life += life;
        cumulative.west.total_length += length;
        r_color = Cesium.Color.fromRandom({
          minimumRed : 0.7,
          maximumBlue : 0.2,
          minimumGreen : 0.7,
          alpha : 1.0
        });
      }
    }
    else {
      if (dist_y >0){
        cumulative.north.total_life += life;
        cumulative.north.total_length += length;
        r_color = Cesium.Color.fromRandom({
          maximumRed : 0.2,
          minimumBlue : 0.7,
          minimumGreen : 0.6,
          alpha : 1.0
        });
      }
      else{
        cumulative.south.total_life += life;
        cumulative.south.total_length += length;
        r_color = Cesium.Color.fromRandom({
          minimumRed : 0.7,
          maximumBlue : 0.2,
          maximumGreen : 0.2,
          alpha : 1.0
        });
      }
    }
  }

  return r_color;


}


MFOC.calculateLife = function(geometry){
  return - new Date(geometry.datetimes[0]).getTime() + new Date(geometry.datetimes[geometry.datetimes.length-1]).getTime();
};

MFOC.calculateLength = function(geometry){
  var total = 0;
  for (var i = 0 ; i < geometry.coordinates.length - 1 ; i++){
    var point1;
    var point2;
    if (geometry.type == "MovingPoint"){
      point1 = geometry.coordinates[i];
      point2 = geometry.coordinates[i+1];
    }
    else{
      point1 = MFOC.getCenter(geometry.coordinates[i], geometry.type);
      point2 = MFOC.getCenter(geometry.coordinates[i+1], geometry.type);
    }
    //total += MFOC.calculateDist(point1, point2);
    total += MFOC.calculateCarteDist(point1, point2);

  }

  return total;
};


MFOC.getCenter = function(coordinates, type){
  var x=0,y=0;
  var length = coordinates.length;
  if (type == 'MovingPolygon'){
    length -= 1;
  }
  for (var i = 0 ; i < length ; i++){
    x += coordinates[i][0];
    y += coordinates[i][1];

  }
  x /= length;
  y /= length;

  return [x,y];
}






MFOC.prototype.showPropertyArray = function(propertyName, array, div_id){


  document.getElementById(div_id).innerHTML = '';

  //if put empty array.
  if (array == undefined || array.length == 0){
    return;
  }


  var name_arr = [];
  var object_arr = [];
  var mfoc = this;

  for (var i = 0 ; i < array.length ; i++){
    object_arr.push(array[i][0]);
    name_arr.push(array[i][1]);
  }

  var min_max = MFOC.findMinMaxProperties(object_arr);

  var svg = d3.select("#"+div_id).append("svg");
  svg.attr("width",$("#"+div_id).width());
  svg.attr("height",$("#"+div_id).height());

  var margin = {top: 10, right: 20, bottom: 30, left: 50},
  width = $("#"+div_id).width() - margin.left - margin.right,
  height = $("#"+div_id).height() - margin.top - margin.bottom;


  var g = svg.append("g")
        .attr("transform", "translate("+ margin.left +"," + margin.top + " )")
        .attr("width", width)
        .attr("height", height);

  var x = d3.scaleTime()
  .rangeRound([0, width]);
  var y = d3.scaleLinear()
  .rangeRound([height, 0]);

  var line = d3.line()
  .x(function(d) { return x(d.date)})
  .y(function(d) { return y(d.value)});


  x.domain(min_max.date);
  y.domain(min_max.value);

  g.append("g")
  .attr("transform" , "translate(0,"+height+")")
  .attr("class","axis")
  .style("font-size","x-large")
  .call(d3.axisBottom(x))
  .select(".domain")
  .remove();

  var y_axis = g.append("g");
  y_axis
  .attr("class","axis")
  .call(d3.axisLeft(y))
  .append("text")
  .attr("fill", '#000')
  .attr("transform", "rotate(-90)")
  .style("font-size","large")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text(object_arr[0].name+"("+object_arr[0].uom+")")  ;


  var graph_data = [];
  for (var id = 0 ; id < object_arr.length ; id++){
    var data = [];
    var object = object_arr[id];
    for (var i = 0 ; i < object.datetimes.length ; i++){
      var comp = {};
      var da = new Date(object.datetimes[i]).toISOString();

      comp.date = new Date(object.datetimes[i]);//dateparse(da);
      comp.value = object.values[i];

      data.push(comp);
    }

    if (object.interpolations == 'Spline'){
      line.curve(d3.curveCardinal);
    }
    else if (object.interpolations == 'Stepwise'){
      line.curve(d3.curveStepAfter)
    }

    var color = this.getColor(name_arr[id]);
    var r_color = d3.rgb(color.red * 255, color.green * 255, color.blue * 255);

    graph_data.push(data);
    if(object.interpolations == 'Discrete'){
      for (var i = 0 ; i < data.length ; i++){
        g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d,i) { return x(d.date); } )
        .attr("cy", function(d,i) { return y(d.value); } )
        .attr("r", 1)
        .style("fill", r_color);
      }
    }
    else{
      g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", r_color)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 3)
      .attr("d", line);
    }

  }

  var drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
  svg.call(drag);

  var start_coord;
  var rect ;

  function dragstarted(d){
    d3.event.sourceEvent.stopPropagation();
    start_coord = d3.mouse(this);
    rect = svg.append("rect")
      .attr("fill", d3.rgb(0,0,0,0.5));

    if (start_coord[0]-margin.right <= 0){
      return;
    }
    var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");
    console.log(start_coord);
    viewer.clock.currentTime=Cesium.JulianDate.fromDate(new Date(formatDate(x.invert(start_coord[0]-51.09))));
    viewer.clock.shouldAnimate = false;
    //    console.log(rect);
    //  console.log(start_coord);
    //d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    d3.select(this).classed("dragging", true);
  }

  function dragged(d){
    var coord = d3.mouse(this);

    if (coord[0] > start_coord[0]){
      rect.attr("width", Math.abs(coord[0] - start_coord[0]) );
      rect.attr("height", height + margin.bottom);
      rect.attr("x", start_coord[0]);
    }
    else{
      rect.attr("width", Math.abs(coord[0] - start_coord[0]) );
      rect.attr("height", height + margin.bottom);
      rect.attr("x", coord[0]);
    }


  }

  function dragended(d){
    d3.select(this).classed("dragging", false);
    var end_coord = d3.mouse(this);
    var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");
  //  console.log(end_coord);
    var start_date, end_date;

    if (end_coord[0] > start_coord[0]){
      start_date = formatDate(x.invert(start_coord[0]-51.09));
      end_date =  formatDate(x.invert(end_coord[0]-51.09));
      if (end_coord[0] - start_coord[0] < 100){
        rect.remove();
        return;
      }
    }
    else{
      if (start_coord[0] - end_coord[0] < 100){
        rect.remove();
        return;
      }

      start_date = formatDate(x.invert(end_coord[0]-51.09));
      end_date =  formatDate(x.invert(start_coord[0]-51.09));
    }

    mfoc.spliceByTime(new Date(start_date), new Date(end_date));
    mfoc.update();
    mfoc.showProperty(propertyName, div_id);
  }



}



MFOC.prototype.makeBasicMap = function(degree){
  var x_deg = degree.x,
  y_deg = degree.y;

  var cube_data = [];
  var min_max = this.min_max;

  var x_band = min_max.x[1] - min_max.x[0],
  y_band = min_max.y[1] - min_max.y[0];

  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  for (var x = 0 ; x < x_length ; x++){
    cube_data[x] = [];
    for (var y = 0 ; y < y_length ; y++){
      cube_data[x][y] = 0;
    }
  }
  return cube_data;
}

MFOC.prototype.draw2DHeatMapMovingPolygon = function(geometry, degree, map_data){
  var min_max = this.min_max;

  var x_deg = degree.x,
  y_deg = degree.y;

  var x_band = min_max.x[1] - min_max.x[0],
  y_band = min_max.y[1] - min_max.y[0];

  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  var max_num = this.hotspot_maxnum;

  var value_property = [];

  for (var point = 0 ; point < geometry.coordinates[0].length - 1; point++){
    var temp = new SampledProperty(Number);
    value_property[point] = temp;
  }

  var temp_map = [];
  for (var x = 0 ; x < x_length ; x++){
    temp_map[x] = [];
    for (var y = 0 ; y < y_length ; y++){
      temp_map[x][y] = 0;
    }
  }

  for (var index = 0 ; index < geometry.coordinates.length ; index++){
    var coord = geometry.coordinates[index];

    for (var point = 0 ; point < coord.length - 1; point++){
      value_property[point].addSample(coord[point][0], coord[point][1]);
    }
  }

  for (var x_index = 0 ; x_index < x_length ; x_index++){
    for (var point = 0 ; point < value_property.length ; point++){
      var x_value = min_max.x[0] + x_deg * x_index;
      var y_value = value_property[point].getValue(x_value);
      if (y_value != undefined){
        var y_index = MFOC.getCubeIndexFromSample(y_value, y_deg, min_max.y[0]);
        if (temp_map[x_index][y_index] == 0){
          temp_map[x_index][y_index] = 1;
        }
      }

    }
  }
  for (var x = 0 ; x < x_length ; x++){
    for (var y = 0 ; y < y_length ; y++){
      if (temp_map[x][y] == 1){
        map_data[x][y] += 1;
        max_num = Math.max(map_data[x][y],max_num);
      }
    }
  }

  this.hotspot_maxnum = Math.max(max_num,this.hotspot_maxnum);

}

MFOC.prototype.draw2DHeatMapMovingLineString = function(geometry, degree, map_data){
  var min_max = this.min_max;

  var x_deg = degree.x,
  y_deg = degree.y;

  var x_band = min_max.x[1] - min_max.x[0],
  y_band = min_max.y[1] - min_max.y[0];

  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  var max_num = this.hotspot_maxnum;

  var max_coordinates_length = MFOC.findMaxCoordinatesLine(geometry);

  var value_property = [];

  for (var point = 0 ; point < max_coordinates_length; point++){
    var temp = new SampledProperty(Number);
    value_property[point] = temp;
  }

  var temp_map = [];
  for (var x = 0 ; x < x_length ; x++){
    temp_map[x] = [];
    for (var y = 0 ; y < y_length ; y++){
      temp_map[x][y] = 0;
    }
  }


  for (var index = 0 ; index < geometry.coordinates.length ; index++){
    var coord = geometry.coordinates[index];
    for (var point = 0 ; point < max_coordinates_length; point){
      value_property[point].addSample(coord[point][0], coord[point][1]);
    }
  }

  for (var x_index = 0 ; x_index < x_length ; x_index++){
    for (var point = 0 ; point < value_property.length ; point++){
      var x_value = min_max.x[0] + x_deg * x_index;
      var y_value = value_property[point].getValue(x_value);
      if (y_value != undefined){
        var y_index = MFOC.getCubeIndexFromSample(y_value, y_deg, min_max.y[0]);
        if (temp_map[x_index][y_index] == 0){
          temp_map[x_index][y_index] = 1;
        }
      }

    }
  }

  for (var x = 0 ; x < x_length ; x++){
    for (var y = 0 ; y < y_length ; y++){
      if (temp_map[x][y] == 1){
        map_data[x][y] += 1;
        max_num = Math.max(map_data[x][y],max_num);
      }
    }
  }

  this.hotspot_maxnum = Math.max(max_num,this.hotspot_maxnum);

}

MFOC.prototype.draw2DHeatMapMovingPoint = function(geometry, degree, map_data){
  var min_max = this.min_max;

  var x_deg = degree.x,
  y_deg = degree.y;

  var x_band = min_max.x[1] - min_max.x[0],
  y_band = min_max.y[1] - min_max.y[0];

  var x_length = Math.ceil(x_band/x_deg);
  var y_length = Math.ceil(y_band/y_deg);

  var max_num = this.hotspot_maxnum;

  var value_property = new SampledProperty(Number);


  var temp_map = [];
  for (var x = 0 ; x < x_length ; x++){
    temp_map[x] = [];
    for (var y = 0 ; y < y_length ; y++){
      temp_map[x][y] = 0;
    }
  }


  for (var index = 0 ; index < geometry.coordinates.length ; index++){
    var coord = geometry.coordinates[index];

    value_property.addSample(coord[0], coord[1]);

  }
  for (var x_index = 0 ; x_index < x_length ; x_index++){
      var x_value = min_max.x[0] + x_deg * x_index;
      var y_value = value_property.getValue(x_value);

      if (y_value != undefined){

        var y_index = MFOC.getCubeIndexFromSample(y_value, y_deg, min_max.y[0]);
        map_data[x_index][y_index] += 1;
        max_num = Math.max(map_data[x_index][y_index],max_num);
      }

  }

  this.hotspot_maxnum = Math.max(max_num,this.hotspot_maxnum);

}

MFOC.prototype.makeMap = function(degree, map_data){
  //var boxCollection = new Cesium.PrimitiveCollection();
  var num = 0;
  var data = map_data;
  var min_max = this.min_max;

  var max_count = this.hotspot_maxnum;
  var x_deg = degree.x,
  y_deg = degree.y;

  var instances = [];

  for (var x = 0 ; x < data.length - 1 ; x++){
    for (var y = 0 ; y < data[x].length ; y++){
      var count = data[x][y];
      var rating = count/max_count;
      if (rating < 0.1){
        continue;
      }
      var green_rate = 2.0 - 2.0 * rating;
      if (green_rate > 1.0) green_rate = 1.0;
      var color = new Cesium.Color(1.0, green_rate, 0.0, rating);
      instances.push(new Cesium.GeometryInstance({
        geometry : new Cesium.RectangleGeometry({
          rectangle : Cesium.Rectangle.fromDegrees(min_max.x[0] + x_deg * x, min_max.y[0] + y_deg * y , min_max.x[0] + x_deg * (x+1), min_max.y[0] + y_deg * (y+1)),
          height : 50000
        }),
        attributes : {
          color : Cesium.ColorGeometryInstanceAttribute.fromColor(color)
        }
      }));

    }

    //  return boxCollection;
  }

  return new Cesium.Primitive({
    geometryInstances : instances,
    appearance : new Cesium.PerInstanceColorAppearance()
  });
}


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

MFOC.prototype.draw3DHeatMapMovingPolygon = function(geometry, degree, cube_data){
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
    var time = [cube_data[i].time, middle_time, cube_data[i+1].time];

    for (var ti = 0 ; ti <time.length ; ti++){
      var mbr = {
        x : [],
        y : []
      };

      mbr.x[0] = lower_x_property.getValue(time[ti]);
      mbr.x[1] = upper_x_property.getValue(time[ti]);
      mbr.y[0] = lower_y_property.getValue(time[ti]);
      mbr.y[1] = upper_y_property.getValue(time[ti]);


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

  }
  this.hotspot_maxnum = Math.max(max_num,this.hotspot_maxnum);

}

MFOC.prototype.draw3DHeatMapMovingPoint = function(geometry, degree, cube_data){
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

  for (var time = 0 ; time < datetimes.length; time++){
    var jul_time = Cesium.JulianDate.fromDate(new Date(datetimes[time]));
    var position = {        x : geometry.coordinates[time][0],y : geometry.coordinates[time][1]      };

    x_property.addSample(jul_time, position.x);
    y_property.addSample(jul_time, position.y);
  }

  for (var i = 0 ; i < time_length - 1 ; i++){
    var middle_time = Cesium.JulianDate.addSeconds(cube_data[i].time,time_deg/2,new Cesium.JulianDate());
    var time = [cube_data[i].time, middle_time, cube_data[i+1].time];

    for (var ti = 0 ; ti <time.length ; ti++){
      var x_position = x_property.getValue(time[ti]);
      var y_position = y_property.getValue(time[ti]);

      if (x_position != undefined && y_position != undefined){
        var x = MFOC.getCubeIndexFromSample(x_position, x_deg, min_max.x[0]);
        var y = MFOC.getCubeIndexFromSample(y_position, y_deg, min_max.y[0]);
        cube_data[i].count[x][y] += 1;
        max_num = Math.max(cube_data[i].count[x][y],max_num);
      }

    }

  }

  this.hotspot_maxnum = Math.max(max_num,this.hotspot_maxnum);
}

MFOC.prototype.draw3DHeatMapMovingLineString = function(geometry, degree, cube_data){
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

  var max_coordinates_length = MFOC.findMaxCoordinatesLine(geometry);

  for (var i = 0 ; i <  max_coordinates_length; i++){
    x_property[i] = new Cesium.SampledProperty(Number);
    y_property[i] = new Cesium.SampledProperty(Number);
  }

  if (geometry.interpolations == "Spline"){
    for (var i = 0 ; i < max_coordinates_length ; i++){
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

    for (var i = 0 ; i < max_coordinates_length ; i++){
      if (coordinates[i] != undefined){
        x_property[i].addSample(jul_time, coordinates[i][0]);
        y_property[i].addSample(jul_time, coordinates[i][1]);
      }
    }

  }

  for (var i = 0 ; i < time_length - 1 ; i++){
    var middle_time = Cesium.JulianDate.addSeconds(cube_data[i].time, time_deg/2, new Cesium.JulianDate());
    var time = [cube_data[i].time, middle_time, cube_data[i+1].time];

    for (var ti = 0 ; ti <time.length ; ti++){
      var x_value = [];
      var y_value = [];

      var is_undefined = false;
      for (var j = 0 ; j < max_coordinates_length ; j++){
        x_value[j] = x_property[j].getValue(middle_time);
        y_value[j] = y_property[j].getValue(middle_time);
        if (x_value[j] != undefined && y_value[j] != undefined){
          var x_index = MFOC.getCubeIndexFromSample(x_value[j], x_deg, min_max.x[0]);
          var y_index = MFOC.getCubeIndexFromSample(y_value[j], y_deg, min_max.y[0]);

          cube_data[i].count[x_index][y_index] += 1;

          max_num = Math.max(cube_data[i].count[x_index][y_index],max_num);
        }
      }
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
  console.log(max_count);
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
MFOC.prototype.findMinMaxGeometry = function(mf_arr){
  if (mf_arr == undefined){
    mf_arr = this.features;
  }

  var min_max = {};
  min_max.x = [];
  min_max.y = [];
  min_max.z = [];

  min_max.date = [];

  var first_date = new Date(mf_arr[0].temporalGeometry.datetimes[0]);

  min_max.date = [first_date,first_date];
  for (var i = 0 ; i < mf_arr.length ; i++){
    var mf_min_max_coord = {};
    if (mf_arr[i].temporalGeometry.type == "MovingPoint"){
      mf_min_max_coord = MFOC.findMinMaxCoord(mf_arr[i].temporalGeometry.coordinates);
    }
    else{
      var coord_arr = mf_arr[i].temporalGeometry.coordinates;
      mf_min_max_coord = MFOC.findMinMaxCoord(coord_arr[0]);
      for (var j = 1 ; j < coord_arr.length ; j++){
        mf_min_max_coord = MFOC.findBiggerCoord(mf_min_max_coord, MFOC.findMinMaxCoord(coord_arr[j]) );
      }
    }

    if (min_max.x.length == 0){
      min_max.x = mf_min_max_coord.x;
      min_max.y = mf_min_max_coord.y;
      min_max.z = mf_min_max_coord.z;
    }
    else{
      var xyz = MFOC.findBiggerCoord(min_max, mf_min_max_coord);
      min_max.x = xyz.x;
      min_max.y = xyz.y;
      min_max.z = xyz.z;
    }

    var temp_max_min = MFOC.findMinMaxTime(mf_arr[i].temporalGeometry.datetimes);

    if (temp_max_min[0].getTime() < min_max.date[0].getTime()){
      min_max.date[0] = temp_max_min[0];
    }
    if (temp_max_min[1].getTime() > min_max.date[1].getTime()){
      min_max.date[1] = temp_max_min[1];
    }

  }
  return min_max;

}

MFOC.prototype.getListOfHeight = function(datetimes, min_max_date){
  if (min_max_date == undefined){
    //console.log("use this object's min_max");
    min_max_date = this.min_max.date;
  }

  var heights = [];
  for(var i = 0 ; i < datetimes.length ; i++){
    heights.push(MFOC.normalizeTime(new Date(datetimes[i]), min_max_date, this.max_height));
  }
  return heights;
}



MFOC.findMinMaxTime = function(datetimes){
  var min_max_date = [];
  min_max_date[0] = new Date(datetimes[0]);
  min_max_date[1] = new Date(datetimes[0]);

for (var j = 1 ; j < datetimes.length ; j++){

  var time = new Date(datetimes[j]);

  if (min_max_date[0].getTime() > time.getTime()){
      min_max_date[0] = time;
    }
    if (min_max_date[1].getTime() < time.getTime()){
      min_max_date[1] = time;
    }
  }
  return min_max_date;
}

MFOC.findMinMaxCoordArray = function(coordinates_arr){
  var mf_min_max_coord = MFOC.findMinMaxCoord(coordinates_arr[0]);
  for (var j = 1 ; j < coordinates_arr.length ; j++){
    mf_min_max_coord = MFOC.findBiggerCoord(mf_min_max_coord, MFOC.findMinMaxCoord(coordinates_arr[j]) );
  }
  return mf_min_max_coord;
}

MFOC.findMinMaxCoord = function(coordinates){
  var min_max = {};
  min_max.x = [];
  min_max.y = [];
  min_max.z = [];
  min_max.x[0] = coordinates[0][0];
  min_max.x[1] = coordinates[0][0];
  min_max.y[0] = coordinates[0][1];
  min_max.y[1] = coordinates[0][1];
  min_max.z = [];
  if (coordinates[0][2] != undefined){
    min_max.z[0] = coordinates[0][2];
    min_max.z[1] = coordinates[0][2];
  }
  for (var i = 0 ; i < coordinates.length ; i++){
    var coord = coordinates[i];
    if (min_max.x[0] > coord[0]){
      min_max.x[0] = coord[0];
    }
    if (min_max.x[1] < coord[0]){
      min_max.x[1] = coord[0];
    }
    if (min_max.y[0] > coord[1]){
      min_max.y[0] = coord[1];
    }
    if (min_max.y[1] < coord[1]){
      min_max.y[1] = coord[1];
    }
    if (coord[2] != undefined){
      if (min_max.z[0] > coord[2]){
        min_max.z[0] = coord[2];
      }
      if (min_max.z[1] < coord[2]){
        min_max.z[1] = coord[2];
      }
    }
  }

  return min_max;

}



MFOC.findBiggerCoord = function(min_max_1, min_max_2){
  var ret = {};
  ret.x = [];
  ret.y = [];
  ret.z = [];
  ret.x[0] = Math.min(min_max_1.x[0],min_max_2.x[0]);
  ret.y[0] = Math.min(min_max_1.y[0],min_max_2.y[0]);
  ret.x[1] = Math.max(min_max_1.x[1],min_max_2.x[1]);
  ret.y[1] = Math.max(min_max_1.y[1],min_max_2.y[1]);

  if (min_max_1.z.length != 0 && min_max_2.z.length != 0){
    ret.z[0] = Math.min(min_max_1.z[0],min_max_2.z[0]);
    ret.z[1] = Math.max(min_max_1.z[1],min_max_2.z[1]);
  }
  return ret;
}


MFOC.normalizeTime = function(date, min_max_date, value = 15000000){
  var separation = min_max_date[1].getTime() - min_max_date[0].getTime()
  return (date.getTime() - min_max_date[0].getTime())/separation * value;
}



function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}



MFOC.findMinMaxProperties = function(properties){
  console.log(properties);
  if (!Array.isArray(properties)){
    properties = [properties];
  }

  var first_date = new Date(properties[0].datetimes[0]);
  var first_value = properties[0].values[0];
  var min_max = {};
  min_max.date = [first_date,first_date];
  min_max.value = [first_value,first_value];
  for (var i = 0 ; i < properties.length ; i++){
    var temp_max_min = MFOC.findMinMaxTime(properties[i].datetimes);
    if (temp_max_min[0].getTime() < min_max.date[0].getTime()){
      min_max.date[0] = temp_max_min[0];
    }
    if (temp_max_min[1].getTime() > min_max.date[1].getTime()){
      min_max.date[1] = temp_max_min[1];
    }
    for (var j = 0 ; j < properties[i].values.length ; j++){
      if (min_max.value[0] > properties[i].values[j]){
        min_max.value[0] = properties[i].values[j];
      }
      if (min_max.value[1] < properties[i].values[j]){
        min_max.value[1] = properties[i].values[j];
      }
    }

  }
  return min_max;
}




MFOC.getMBRFromPolygon = function(coordinates){
  var mbr = MFOC.findMinMaxCoord(coordinates);
  return mbr;
}

MFOC.getPropertyByName = function(mf, name){
  if (mf.temporalProperties == undefined) return -1;

  for (var i = 0 ; i < mf.temporalProperties.length ; i++){
    if (mf.temporalProperties[i].name == name){
      return [mf.temporalProperties[i], mf.properties.name];
    }
  }
  return -1;
}

MFOC.calculateDist = function(point_1, point_2){
  return Math.sqrt(Math.pow(point_1[0] - point_2[0],2) + Math.pow(point_1[1] - point_2[1],2));
}

MFOC.calculateCarteDist = function(point1, point2){
  if (point1.length == 2 && point1.length == point2.length)
  {
    var carte3_1 = Cesium.Cartesian3.fromDegrees(point1[0], point1[1]),
    carte3_2 =  Cesium.Cartesian3.fromDegrees(point2[0], point2[1]);
  }
  else if (point1.length == 3 && point1.length == point2.length){
    var carte3_1 = Cesium.Cartesian3.fromDegrees(point1[0], point1[1], point1[2]),
    carte3_2 =  Cesium.Cartesian3.fromDegrees(point2[0], point2[1], point2[2]);
  }
  else{
    alert("dist error");
    return;
  }

  return Cesium.Cartesian2.distance(Cesium.Cartesian2.fromCartesian3(carte3_1),Cesium.Cartesian2.fromCartesian3(carte3_2));
}


MFOC.getBoundingSphere = function(min_max, height){
  var middle_x = ( min_max.x[0] + min_max.x[1] ) / 2;
  var middle_y = ( min_max.y[0] + min_max.y[1] ) / 2;
  var middle_height = (height[0] + height[1]) / 2;

  var radius = MFOC.calculateCarteDist([middle_x,middle_y,middle_height], [min_max.x[0],min_max.y[0],height[0]]);
  return new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(middle_x,middle_y,middle_height), radius);
}


MFOC.prototype.getColor = function(name){
  if (this.color_arr[name] != undefined){
    return this.color_arr[name];
  }
  var color = Cesium.Color.fromRandom({
    minimumRed : 0.2,
    minimumBlue : 0.2,
    minimumGreen : 0.2,
    alpha : 1.0
  });
  this.color_arr[name] = color;
  return color;
}

MFOC.prototype.setColor = function(name, color){
  this.color_arr[name] = color;
}

MFOC.prototype.getFeatureByName = function(name){
  for (var i = 0 ; i < this.features.length ; i++){
    if (this.features[i].properties.name == name){
      return this.features[i];
    }
  }
  return -1;
}


MFOC.findMaxCoordinatesLine = function(geometry){
  var max_length = 0;
  for (var i = 0 ; i < geometry.coordinates.length ; i++){
    if (max_length < geometry.coordinates[i].length){
      max_length = geometry.coordinates[i].length;
    }
  }
  return max_length;
}



MFOC.prototype.getAllTypeFromProperties = function(){
  var array = [];
  for (var i = 0 ; i < this.features.length ; i++){

    if (this.features[i].temporalProperties == undefined) continue;
    for (var j = 0 ; j < this.features[i].temporalProperties.length ; j++){
      var name = this.features[i].temporalProperties[j].name;
      var push = true;
      for (var k = 0 ; k < array.length ; k++){
        if (array[k] == name){
          push = false;
        }
      }
      if (push){
        array.push(name);
      }
    }

  }
  return array;
}







//----------------------it wiil be removed--------------

/*



function contains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}
*/
