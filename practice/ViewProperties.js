//print one Feature's TemporalProperties List and properties.
function printFeatureProperties(layer_id, feature_id){
  turnOnProperties();
  var printProper = document.getElementById(div_id.properties);
  printProper.innerHTML = "";
  printProper.appendChild(list_maker.getDivProperties(layer_id,feature_id) );

  changeMenuMode(MENU_STATE.one_feature, feature_id);
  var left_upper_div = document.getElementById(div_id.left_upper_list);
  left_upper_div.innerHTML = '';

  var list = list_maker.getTemporalPropertiesListDiv(layer_id, feature_id);
  left_upper_div.appendChild(list);
}

function turnOnProperties(){
  document.getElementById(div_id.properties_panel).style.visibility = "visible";
  document.getElementById(div_id.menu_list).style.height = '70%';
}

function turnOffProperties(){
  document.getElementById(div_id.properties_panel).style.visibility = "hidden";
  document.getElementById(div_id.menu_list).style.height = '100%';
}

function showTemporalMap(featureID, temporalPropertyName) {
  changeOptionToolbarToCloseDIV();
  stinuum.temporalMap.show(featureID, temporalPropertyName);
}


function showTemporalMapInContext(featureID, temporalPropertyName) {
  var context = document.getElementById("context");
  context.innerHTML = "";
  document.getElementById("featureName").style.visibility = "hidden";
  showOneFeatureGraph(featureID, temporalPropertyName);

  showTemporalMap(featureID, temporalPropertyName)
}

function showOneFeatureGraph(feature, temporalProperty){
  var pair = stinuum.mfCollection.getMFPairByIdInFeatures(feature);
  if (pair == -1) return;
  var property = Stinuum.getPropertyByName(pair.feature, temporalProperty, pair.id);

  cleanGraphDIV();
  showGraphDIV("graph");

  stinuum.propertyGraph.showPropertyArray(temporalProperty, [property], "graph");
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

  var feature = stinuum.mfCollection.getMFPairByIdInFeatures(id);
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
                showTemporalMapInContext(id, key)
            };
        })(id, keys[k]);
        context.appendChild(div);
      }
  }
}
