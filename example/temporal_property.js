
function getHighlight(feature, temporalProperty) {
  var pro_arr = [];
  var pair = stinuum.mfCollection.getFeatureByIdInFeatures(feature);
  if (pair == -1) return;
  var property = Stinuum.getPropertyByName(pair.feature, temporalProperty, pair.id);
  pro_arr.push(property);

  cleanGraphDIV();
  showGraphDIV("graph");

  stinuum.propertyGraph.showPropertyArray(temporalProperty, pro_arr, "graph");
  stinuum.temporalMap.show(feature, temporalProperty);
    //stinuum.geometryViewer.adjustCameraView();
}


function getHighlightInContext(feature, temporalProperty) {
  var context = document.getElementById("context");
  context.innerHTML = "";
  var pro_arr = [];
  var pair = stinuum.mfCollection.getFeatureByIdInFeatures(feature);
  if (pair == -1) return;
  var property = Stinuum.getPropertyByName(pair.feature, temporalProperty, pair.id);
  pro_arr.push(property);

  cleanGraphDIV();
  showGraphDIV("graph");

  stinuum.propertyGraph.showPropertyArray(temporalProperty, pro_arr, "graph");
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

function showContextMenu(id, pos){
  var context = document.getElementById("context");
  context.innerHTML = "";
  context.style = "z-index : 50;"
  context.style.position = "absolute";
  context.style.backgroundColor = "rgba(100,100,100, 0.7)"
  context.style.width = "7%";
  context.style.top = pos.y + "px";
  context.style.left = pos.x + "px";

  var feature = stinuum.mfCollection.getFeatureByIdInFeatures(id);
  for (var i = 0 ; i < feature.feature.temporalProperties.length ; i++){
      var keys = Object.keys(feature.feature.temporalProperties[i]);
      for (var k = 0 ; k < keys.length ; k++){
        if (keys[k] == 'datetimes') continue;
        var div = document.createElement("div");
        div.className = "context-menu";
        div.innerHTML = keys[k];
        div.id = 'context_' + keys[k];
        div.onclick = (function(id, key) {
            return function() {
                getHighlightInContext(id, key)
            };
        })(id, keys[k]);
        context.appendChild(div);
      }
  }
}
