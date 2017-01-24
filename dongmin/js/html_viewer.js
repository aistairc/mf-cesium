(function init(){
  mode = 'home';
  polygon_mode = '2d';
  viewer = new Cesium.Viewer('cesiumContainer');
  scene = viewer.scene;

  scene.primitives.destroyPrimitives = false;
  point_tp_obj = new PointJSON('json_data/typhoon_2016.json',viewer);
  line_obj = new PolylineJSON('json_data/polyline.json', viewer);
})();


viewer.scene.morphComplete.addEventListener(function (){
  if (mode == 'point'){
    showPoint();
  }
  else if (mode == 'polygon'){

    if (viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW){
      drawZaxis();
      polygon_mode = '3d';
    }
    else {
      polygon_mode = '2d';
    }
  }else { // polyline

  }
  viewer.clear();
  viewer.scene.completeMorph();
});


function show_list(type){
  document.getElementById('name_list').innerHTML = '';
  mode = type;

  if (type == 'point'){
    point_tp_obj.loadJsonAndMakePrimitive();
  }
  else if (type == 'polygon'){
    poly_tp_obj.loadJsonAndMakePrimitive();
  }
  else{
    line_obj.loadJsonAndMakePrimitive();

  }
}
/*
function clearViewer(viewer){
  viewer.dataSources.removeAll();

  var temp = viewer.scene.primitives.get(0);
  viewer.entities.removeAll();
  viewer.scene.primitives.removeAll();
  viewer.scene.primitives.add(temp);
}
*/

Cesium.Viewer.prototype.clear = function(){
  this.clock.multiplier = 10;
  this.dataSources.removeAll();
  var temp = this.scene.primitives.get(0);
  this.entities.removeAll();
  this.scene.primitives.removeAll();
  this.scene.primitives.add(temp);
}

//add new row in typhoon name table.
function addRowtoTable(name, color, id){
  var m_table = document.getElementById('name_list');
  var row = m_table.insertRow( m_table.rows.length ); // 하단에 추가

  var cell1 = row.insertCell(0);
  cell1.innerHTML = name;
  color.alpha = 1.0;
  cell1.style.color = color.toCssColorString();

  if (mode == 'point'){
    cell1.onclick = function(){
       return highlightPoint(id);
     };
  }
  else if (mode == 'polygon'){
    cell1.onclick = function(){
      return animatePolygon(id);
    };
  }
  else{
    cell1.onclick = function(){
      return animatePolyline(id);
    };
  }

  var checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.id = "check"+id;
  //checkbox.checked = true;

  var cell2 = row.insertCell(1);
  cell2.appendChild(checkbox);
}

function makeAllUnvisible(){
  viewer.clear();
}

function highlightPoint(id){
  point_tp_obj.highlight(id);
  if (document.getElementById('check'+id).checked){
    point_tp_obj.animate(id);
  }
}
/*
function showPolygon(){
  viewer.clear();
  console.log(viewer.dataSources);
  if (polygon_mode == '3d'){
      if (viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW)

    for (var i = 0 ; i < poly_tp_obj.primitives_3d.length ; i++){
      if (document.getElementById('check'+i).checked){

      }
    }
  }
  else{
    for (var i = 0 ; i < poly_tp_obj.primitives_2d.length ; i++){
      if (document.getElementById('check'+i).checked){
        viewer.scene.primitives.add(poly_tp_obj.primitives_2d[i]);
      }
    }
  }

}

function showPolyline(){

  if (viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW){
    for (var i = 0 ; i < line_obj.polyline_collection_3d.length ; i++){
        viewer.scene.primitives.add(line_obj.polyline_collection_3d[i]);
    }
    for (var i = 0 ; i < line_obj.triangle_primitives_3d.length ; i ++){
      viewer.scene.primitives.add(line_obj.triangle_primitives_3d[i]);
    }
  }
  else{
    for (var i = 0 ; i < line_obj.polyline_collection.length ; i++){
      viewer.scene.primitives.add(line_obj.polyline_collection[i]);
    }
    for (var i = 0 ; i < line_obj.triangle_primitives.length ; i ++){
      //viewer.scene.primitives.add(line_obj.triangle_primitives[i]);
    }
  }
}
*/
var drawZaxis = function(){
  var timebar = viewer.entities.add({
    id : 'time',
    polyline :{
      positions :  Cesium.Cartesian3.fromDegreesArrayHeights([80,0,0,
                                                              80,0,15000000
      ]),
      width : 10,
      material :  new Cesium.PolylineArrowMaterialProperty(Cesium.Color.WHITE)
    }

  });
  viewer.entities.add({
    position : Cesium.Cartesian3.fromDegrees(80, 0, 15100000),

    label : {
      text : 'TIME',
      font : '14pt monospace',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
      outlineWidth : 2
    }
  });
}

function showPoint(){
  viewer.clear();

  if (viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW){
    for (var i = 0 ; i < point_tp_obj.collection_3d.length ; i++){
        viewer.scene.primitives.add(point_tp_obj.collection_3d[i]);
    }
    drawZaxis();
  }
  else{
    console.log("showPoint_not coul");
    for (var i = 0 ; i < point_tp_obj.collection_2d.length ; i++){
        viewer.scene.primitives.add(point_tp_obj.collection_2d[i]);
    }
    console.log(viewer.scene.primitives);
  }
}

function animatePolygon(id){
  viewer.clear();
  if(polygon_mode == '3d'){
    viewer.scene.primitives.add(poly_tp_obj.primitives_3d[id]);
  }

  if (document.getElementById('check'+id).checked){
    if (polygon_mode == '3d')
      poly_tp_obj.animation_czml(id);
    else {
      console.log("animation 2d")
      poly_tp_obj.animation_czml(id, 0);
    }
  }
  else{
    viewer.scene.primitives.add(poly_tp_obj.primitives_2d[id]);
  }
}


function animatePolyline(id){
  viewer.clear();
  if (viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW){
    viewer.scene.primitives.add(line_obj.polyline_collection_3d[id]);
    viewer.scene.primitives.add(line_obj.triangle_primitives_3d[id]);
  }
  else {
    viewer.scene.primitives.add(line_obj.polyline_collection[id]);
  }

  if (document.getElementById('check'+id).checked){
    if (viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW)
      line_obj.animation_czml(id);
    else {
      console.log("animation 2d")
      line_obj.animation_czml(id, 0);
    }
  }
  else{

  }


}


function select_year(){

  document.getElementById('name_list').innerHTML = '';

  var m_table = document.getElementById('name_list');
  var row = m_table.insertRow( m_table.rows.length ); // 하단에 추가

  var cell1 = row.insertCell(0);
  cell1.innerHTML = '2016';
  cell1.onclick = function(){
    poly_tp_obj = new PolygonJSON('json_data/typhoon2016_buffer.json',viewer);
    return show_list('polygon');
  }

  var row2 = m_table.insertRow( m_table.rows.length ); //
  var cell2 = row2.insertCell(0);
  cell2.innerHTML = '2015';
  cell2.onclick = function(){
    poly_tp_obj = new PolygonJSON('json_data/typhoon2015_buffer.json',viewer);
    return show_list('polygon');
    //console.log(poly_tp_obj_15.obj);
  }

}

function viewMain(){
  mode = 'home';
  isFirst = true;
  selectedTime = [];
  anime_entity = null;
  pre_cl = null, pre_entity = null;


  viewer.clear();


  document.getElementById('name_list').innerHTML = '';
  document.getElementById('btn_div').innerHTML = '';

  var m_table = document.getElementById('name_list');
  var row = m_table.insertRow( m_table.rows.length ); // 하단에 추가
  var cell1 = row.insertCell(0);
  cell1.innerHTML = 'point typhoon';
  cell1.onclick = function(){
    return show_list('point');
  }

  var row2 = m_table.insertRow( m_table.rows.length ); //
  var cell2 = row2.insertCell(0);
  cell2.innerHTML = 'polygon typhoon';
  cell2.onclick = function(){
    return select_year();
    //console.log(poly_tp_obj_15.obj);
  }

  var row3 = m_table.insertRow( m_table.rows.length ); //
  var cell3 = row3.insertCell(0);
  cell3.innerHTML = 'polyline';
  cell3.onclick = function(){
    return show_list('line');
    //console.log(poly_tp_obj_15.obj);
  }
}
