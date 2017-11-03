function printFeaturesList(layer){
  current_layer = layer;
	var list = list_maker.getFeaturesDivList(layer);
  var printArea = document.getElementById(div_id.left_upper_list);
  printArea.innerHTML = "";
  printArea.appendChild(list);
}

function changeMenuMode(mode, feature_id){
    printMenuState = mode;
    var printState = document.getElementById(div_id.menu_mode);
    if (mode != MENU_STATE.one_feature) printState.innerText = printMenuState;
    else printState.innerText = feature_id;
}


function removeCheckAllandUnCheckBtn(){
  LOG("removeCheckAllandUnCheckBtn")
  if (document.getElementById(div_id.chk_unchk_li)) {
    document.getElementById(div_id.chk_unchk_li).remove();
  }
}

function printCheckAllandUnCheck(layer_id){
  LOG("printCheckAllandUnCheck", layer_id);
  removeCheckAllandUnCheckBtn();

  var menu = document.getElementById('menu_list');
  var chk_unchk_li = document.createElement('li');
  var chk_all = document.createElement('input');
  var unchk_all = document.createElement('input');

  chk_unchk_li.style = "flex-grow : 0;align-items: center;justify-content: center;";
  chk_unchk_li.id = div_id.chk_unchk_li;
  chk_unchk_li.style.display = "inline-block";
  chk_unchk_li.style.padding = "10px";
  chk_unchk_li.style.paddingBottom = "1px";

  chk_all.type = 'button';
  chk_all.className = "chk_unchk_btn btn btn-default";
  chk_all.value = 'ALL';
  chk_all.onclick = (function(layerID) {
    return function() {
      checkAllandUpdate(layerID);
    };
  })(layer_id);

  chk_unchk_li.appendChild(chk_all);

  unchk_all.type = 'button';
  unchk_all.className = "chk_unchk_btn btn btn-default";
  unchk_all.style.float = "right";
  unchk_all.value = 'RESET';

  unchk_all.onclick = (function(layerID) {
    return function() {
      uncheckAllandUpdate(layerID);
    };
  })(layer_id);

  chk_unchk_li.appendChild(unchk_all);

  menu.insertBefore(chk_unchk_li, document.getElementById(div_id.left_upper_list));
}

function afterChangingCheck(){
  LOG("afterChangingCheck");
  update_printed_features();
  clearAnalysis();
  refresh(); //All whole -> features And remove Anlaysis mf.
  drawFeatures();
}

function checkAllandUpdate(layer_id) {
  LOG("checkAllandUpdate", layer_id);
  var features = buffer.getFeatureIDsByLayerID(layer_id);
  for (var feature_id in features){
    list_maker.turnOnFeature(layer_id, feature_id);
    var ft = buffer.getFeature(layer_id, feature_id);
    stinuum.mfCollection.add(ft);
  }

  printFeaturesList(layer_id);
  afterChangingCheck();
}

function uncheckAllandUpdate(layer_id) {
  LOG("uncheckAllandUpdate", layer_id);
  var features = buffer.getFeatureIDsByLayerID(layer_id);
  for (var feature_id in features){
    list_maker.turnOffFeature(layer_id, feature_id);
    var ft = buffer.getFeature(layer_id, feature_id);
    stinuum.mfCollection.remove(ft);
  }

  printFeaturesList(layer_id);
  afterChangingCheck();
}

function update_printed_features(){
  //Dont use in Demo
  /*
  var layer_features = list_maker.getDivAllFeaturesAreTurnedOn();
  var list_div = document.getElementById(div_id.printed_features);
  list_div.innerHTML = "";

  if (layer_features) list_div.appendChild(layer_features);
  */
}
