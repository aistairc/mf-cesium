
function getHighlight(feature, temporalProperty) {
  var pro_arr = [];
  var pair = stinuum.mfCollection.getFeatureByIdInFeatures(feature);
  var property = Stinuum.getPropertyByName(pair.feature, temporalProperty, pair.id);
  pro_arr.push(property);

  cleanGraphDIV();
  showGraphDIV("graph");

  stinuum.propertyGraph.showPropertyArray(temporalProperty, pro_arr, "graph");
  stinuum.temporalMap.show(feature, temporalProperty);
    //stinuum.geometryViewer.adjustCameraView();
}

function cleanGraphDIV() {
    if (document.getElementById('pro_menu')) {
        document.getElementById('pro_menu').remove();
    }
    document.getElementById("graph").innerHTML = '';
    document.getElementById("graph").style.height = '0%';
}

function showGraphDIV(graph_id){
  var pro_menu_div = document.createElement('div');
  pro_menu_div.style.bottom = '0';
  pro_menu_div.style.backgroundColor = 'rgba(55, 55, 55, 0.8)';
  pro_menu_div.style.height = "5%";
  pro_menu_div.style.zIndex = "25";
  pro_menu_div.id = 'pro_menu';
  pro_menu_div.style.cursor = 'pointer';
  pro_menu_div.className = 'graph';

  var close_div = document.createElement('div');
  close_div.style.padding = "10px";
  close_div.style.color = 'white';
  close_div.style.textAlign = 'center';
  close_div.style.fontSize = 'small';
  close_div.style.verticalAlign = 'middle';
  close_div.innerHTML = 'CLOSE';
  pro_menu_div.appendChild(close_div);

  close_div.onclick = (function(graph_id) {
      return function() {
          document.getElementById('pro_menu').remove();
          document.getElementById(graph_id).style.height = "0%";
      }
  })(graph_id);

  document.body.appendChild(pro_menu_div);
  document.getElementById('pro_menu').style.bottom = '20%';
  document.getElementById(graph_id).style.height = '20%';
  document.getElementById(graph_id).style.backgroundColor = 'rgba(5, 5, 5, 0.8)';
}
