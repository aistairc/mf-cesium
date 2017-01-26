
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
  if (viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW){
    drawZaxis();

  }
  if (mode == 'polygon'){

    if (viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW){
      polygon_mode = '3d';
    }
    else {
      polygon_mode = '2d';
    }
  }

  viewer.clear();
  viewer.scene.completeMorph();
});


function show_list(type){
  document.getElementById('name_list').innerHTML = '';

  document.getElementById('btn_div').style.visibility= 'visible';
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
       return selectProperty(point_tp_obj, id);
     };
  }
  else if (mode == 'polygon'){
    cell1.onclick = function(){
      return selectProperty(poly_tp_obj, id);
    };
  }
  else{
    cell1.onclick = function(){
      return selectProperty(line_obj, id);
    };
  }

  var checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.id = "check"+id;
  //checkbox.checked = true;

  var cell2 = row.insertCell(1);
  cell2.appendChild(checkbox);
}

function selectProperty(obj, id){
  document.getElementById('property_list').innerHTML = '';
  document.getElementById('property_list').style.visibility = 'visible';
  document.getElementById('property_list').style.cursor = 'pointer';
  var property_list;
  if (obj.data.features == undefined){//point
    property_list = obj.data[id].temporalProperties;
  }
  else{
    property_list = obj.data.features[id].temporalProperties;
  }

  var table = document.getElementById('property_list');

  for (var i = 0 ; i < property_list.length ; i++){
    var property_object = property_list[i];
    var row = table.insertRow(table.rows.length);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = property_object.name;

    cell1.onclick = function(){
      document.getElementById('property_list').innerHTML = '';
      document.getElementById('property_list').style.visibility = 'hidden';
      document.getElementById('property_list').style.cursor = '';
      return showProperty(property_object);
    }


  }
}


function makeAllUnvisible(){
  viewer.clear();
}

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
    for (var i = 0 ; i < point_tp_obj.collection_2d.length ; i++){
        viewer.scene.primitives.add(point_tp_obj.collection_2d[i]);
    }

  }
}

function animatePolygon(){
  viewer.clear();
  var id_arr = [];
  for (var id = 0 ; id < poly_tp_obj.data.features.length ; id++){
    if (document.getElementById('check'+id).checked){
      if(viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW){
        viewer.scene.primitives.add(poly_tp_obj.primitives_3d[id]);
      }
      else{
        viewer.scene.primitives.add(poly_tp_obj.primitives_2d[id]);
      }
      id_arr.push(id);
    }
  }

  if (viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW){
    poly_tp_obj.animation_czml_arr(id_arr);
  }
  else {
    poly_tp_obj.animation_czml_arr(id_arr, 0);
  }
}

function animatePoint(){
  viewer.clear();
  var id_arr = [];
  for (var id = 0 ; id < point_tp_obj.data.length ; id++){

    if (document.getElementById('check'+id).checked){
      id_arr.push(id);
      if (viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW){
        viewer.scene.primitives.add(point_tp_obj.collection_3d[id]);
      }
      else{
        viewer.scene.primitives.add(point_tp_obj.collection_2d[id]);
      }
    }

  }
  point_tp_obj.animate_czml(id_arr, viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW);

}


function animatePolyline(){
  viewer.clear();

  var id_arr = [];

  for (var id = 0 ; id < line_obj.data.features.length ; id++){

    if (document.getElementById('check'+id).checked){
      id_arr.push(id);
      if (viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW){
        for (var i = 0 ; i < line_obj.triangle_primitives_3d[id].length ; i++){
            viewer.scene.primitives.add(line_obj.triangle_primitives_3d[id][i]);
        }

        viewer.scene.primitives.add(line_obj.polyline_collection_3d[id]);
      }

    }

  }

  if (viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW){
    line_obj.animation_czml_arr(id_arr);
  }

  else {
    console.log("animation 2d")
    //line_obj.animation_czml(id_arr[0], 0);
    line_obj.animation_czml_arr(id_arr, 0 );
  }


}

function animate_moving(){
  if (mode == 'point'){
    animatePoint();
  }
  else if (mode == 'polygon'){
    animatePolygon();
  }
  else{
    animatePolyline();
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
  document.getElementById('btn_div').style.visibility = 'hidden';

  document.getElementById('property_list').innerHTML = '';
  document.getElementById('property_list').style.visibility = 'hidden';
  document.getElementById('property_list').style.cursor = '';

  document.getElementById("cesiumContainer").style.height = '100%';
  document.getElementById("graph").style.height = '0%';

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
