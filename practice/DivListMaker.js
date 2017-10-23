function DivListMaker(p_connection){
  this.connection = p_connection;
  this.isFeatureChecked = {};
}

DivListMaker.prototype.getLayerDivList = function(){
  var upper_ul = document.createElement('ul');
  upper_ul.style.height = "10%";
  var layer_name_list = buffer.getLayerNameList();
  for (var i = 0; i < layer_name_list.length; i++) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.style = "width:inherit";
    a.innerText = layer_name_list[i];

    li.id = layer_name_list[i];
    li.onclick = (function(id) {
      return function() {
        changeMenuMode(MENU_STATE.features);
        printFeaturesList(id);
        printCheckAllandUnCheck(id);
        update_printed_features();
      };
    })(layer_name_list[i]);
    li.style = "width:inherit";
    li.className = "list-group-item";
    li.appendChild(a);
    upper_ul.appendChild(li);

    this.isFeatureChecked[layer_name_list[i]] = {};
  }
  return upper_ul;
}

DivListMaker.prototype.turnOnFeature= function(layer_id, feature_id){
  if (this.isFeatureChecked[layer_id] == undefined){
    throw "isFeatureChecked[layer_id] is undefined in DivListMaker";
  }
  this.isFeatureChecked[layer_id][feature_id] = true;
}

DivListMaker.prototype.turnOffFeature= function(layer_id, feature_id){
  if (this.isFeatureChecked[layer_id] == undefined){
    throw "isFeatureChecked[layer_id] is undefined in DivListMaker";
  }
  this.isFeatureChecked[layer_id][feature_id] = false;
}

DivListMaker.prototype.createLIforFeature= function(layer_id, feature_id, is_printed_features=false){
  var li = document.createElement("li");
  var a = document.createElement("a");
  var ul = document.createElement("ul");
  var chk = document.createElement("input");
  var div = document.createElement("div");
  
  li.role = "presentation";
  div.className = "input-group";
  div.style.width = "100%";
  ul.className = "list-group";
  
  a.style.width = "90%";
  a.innerText = feature_id;
  if (!is_printed_features){
    a.onclick = (function(layer, feature) {
      return function() {
        //LOG("dra");
        changeMenuMode(MENU_STATE.one_feature);
        removeCheckAllandUnCheckBtn();
        printFeatureProperties(layer, feature);
        //getFeature(layer, feature);
      }
    })(layer_id, feature_id);  
  }
  
  chk.type = "checkbox";
  chk.name = layer_id + "##" + feature_id;
  chk.style.float = "left";

  if (this.isFeatureChecked[layer_id][feature_id] == undefined){
    this.isFeatureChecked[layer_id][feature_id] = true;
  }
  chk.checked = this.isFeatureChecked[layer_id][feature_id];
  chk.onclick = (function(layer, feature) {
    return function(layer,feature) {
      toggleFeature(layer,feature);
    }
  })(layer_id, feature_id);

  div.appendChild(chk);
  div.appendChild(a);

  li.appendChild(div);
  return li;
}

DivListMaker.prototype.getFeaturesDivList = function(layer_id){
  var target = document.createElement('ul');
  var features_list = buffer.getFeatureIDsByLayerID(layer_id);
  target.className = "list-group-item";
  for (var feature_id in features_list) {
    var data = buffer.getFeature(layer_id, feature_id);//buffer.getBuffer([layer_id, features_list[i]]);
    var li = this.createLIforFeature(layer_id, feature_id);
    
    target.appendChild(li);
  }
  return target;
}

/**
object = {
  "layer1" : [feature1, feature2, ...],
  "layer2" : [feature111, ...]
}
*/
DivListMaker.prototype.getFeaturesAndLayersTurnedOn = function(){
  var object = {};
  for (var layer_id in this.isFeatureChecked){
    if (this.isFeatureChecked.hasOwnProperty(layer_id)){
      object[layer_id] = [];
      for (var feature_id in this.isFeatureChecked[layer_id]){
        if (this.isFeatureChecked[layer_id].hasOwnProperty(feature_id)){
          if (this.isFeatureChecked[layer_id][feature_id]) object[layer_id].push(feature_id);
        }
      }
    }
  }
  return object;
}

DivListMaker.prototype.getDivAllFeaturesAreTurnedOn = function(){
  var object = this.getFeaturesAndLayersTurnedOn();
  var target = document.createElement('ul');
  target.className = "list-group-item";
  for (var layer_id in object){
    for (var i = 0 ; i < object[layer_id].length ; i++){
      var feature_id = object[layer_id][i];
      target.appendChild(this.createLIforFeature(layer_id, feature_id));
    }
  }
  return target;
}