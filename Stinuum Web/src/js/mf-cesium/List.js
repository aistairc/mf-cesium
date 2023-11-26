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
  // LOG("removeCheckAllandUnCheckBtn");
  if (document.getElementById(div_id.chk_unchk_li)) {
    document.getElementById(div_id.chk_unchk_li).remove();
  }
}

function printCheckAllandUnCheck(layer_id){
  // LOG("printCheckAllandUnCheck", layer_id);
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
  
  if (buffer.checkIfServerData(layer_id)){
    chk_all.type = 'button';
    chk_all.className = "chk_unchk_btn btn btn-default";
    chk_all.value = 'ADD';
    chk_all.onclick = (function(layerID) {
      return function() {
        getServerEachData(layer_id)
      };
    })(layer_id);
  }else{
    chk_all.type = 'button';
    chk_all.className = "chk_unchk_btn btn btn-default";
    chk_all.value = 'ALL';
    chk_all.onclick = (function(layerID) {
      return function() {

        checkAllandUpdate(layerID);
      };
    })(layer_id);
  }
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
  // LOG("afterChangingCheck");
  update_printed_features();
  clearAnalysis();
  // refresh(); //All whole -> features And remove Anlaysis mf.
  drawFeatures();
}

function checkAllandUpdate(layer_id) {
  // LOG("checkAllandUpdate", layer_id);
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
  // LOG("uncheckAllandUpdate", layer_id);
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
  var layer_features = list_maker.getDivAllFeaturesAreTurnedOn();
  var list_div = document.getElementById(div_id.printed_features);
  list_div.innerHTML = "";
  
  if (layer_features) list_div.appendChild(layer_features);
}

function getServerEachData(layer_id){
  connector.uploadServerData2(layer_id);
  // var serverDataCount = buffer.getServerDataCount(layer_id)
  // // var href_list = connector.selectData[layer_id].slice(serverDataCount+1, 11+10)
  // // console.log(href_list.length)
  // if (connector.selectData[layer_id].length - serverDataCount >= 10){
  //   // var href_list = connector.selectData[layer_id].slice(serverDataCount+1, serverDataCount+1+10)
  //   var href_list = connector.selectData[layer_id].
  //   console.log(href_list, connector.selectData[layer_id], serverDataCount)
  //   connector.uploadServerData2(layer_id, href_list);
  // }else{
  //   var href_list = connector.selectData[layer_id].slice(serverDataCount)
  //   console.log(href_list, connector.selectData[layer_id], serverDataCount)
  //   connector.uploadServerData2(layer_id, href_list);
  //
  // }
  // console.log( buffer.getServerDataCount(layer_id), connector.selectData[layer_id].length)
}
/*
function checkAll(name) {
    var layerID;
    var checked = document.getElementsByName(name);
    for (var i = 0; i < checked.length; i++) {
        var temp = checked[i].id;
        temp = temp.split("##");
        var feature_layer = temp[1];
        layerID = feature_layer;
        var feature_name = temp[0];
        console.log(feature_layer, feature_name);
        var data = getBuffer([feature_layer, feature_name]);
        if (checked[i].checked == true) {
            stinuum.mfCollection.add(data);
        } else {
            checked[i].checked = true;
            stinuum.mfCollection.add(data);
        }
    }

    if (printedLayerList.contains(layerID)) {

        var layer_checked = document.getElementById(layerID);
        var index = printedLayerList.indexOf(layerID);
        bool_printedLayerList[index] = 1;
        layer_checked.checked = true;

    }

    cleanGraphDIV();

    drawFeatures();
}



function uncheckAll(name) {
    var layerID;
    var checked = document.getElementsByName(name);
    for (var i = 0; i < checked.length; i++) {
        var temp = checked[i].id;
        temp = temp.split("##");
        var feature_layer = temp[1];
        layerID = feature_layer;
        var feature_name = temp[0];
        var data = getBuffer([feature_layer, feature_name]);
        if (checked[i].checked == true) {
            checked[i].checked = false;
            stinuum.mfCollection.remove(data);
        } else {
            stinuum.mfCollection.remove(data);
        }
    }
    if (printedLayerList.contains(layerID)) {
        var layer_checked = document.getElementById(layerID);
        layer_checked.checked = false;
        var index = printedLayerList.indexOf(layerID);
        bool_printedLayerList[index] = 0;
    }
    cleanGraphDIV();
    drawFeatures();
}
*/