function DivListMaker(p_connection){
  this.connection = p_connection;
  this.isFeatureChecked = {};
}

DivListMaker.prototype.getLayerDivList = function(){
  var upper_ul = document.createElement('ul');
  upper_ul.style.height = "10%";
  upper_ul.className = "input-group";
  var layer_name_list = buffer.getLayerNameList();
  for (var i = 0; i < layer_name_list.length; i++) {
    var layer_id = layer_name_list[i];
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
        afterChangingCheck();
      };
    })(layer_id);
    li.style = "width:inherit";
    li.className = "list-group-item";
    li.appendChild(a);
    upper_ul.appendChild(li);

    if (this.isFeatureChecked[layer_id] == undefined) this.isFeatureChecked[layer_id] = {};
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
  div.className = "list-group-item";
  div.style.width = "100%";
//  ul.className = "list-group";
  
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
    showFeature(layer_id, feature_id);
  }
  chk.checked = this.isFeatureChecked[layer_id][feature_id];
  chk.addEventListener('click', function(){
      toggleFeature(layer_id,feature_id);
  });

  div.appendChild(chk);
  div.appendChild(a);

  li.appendChild(div);
  return li;
}

DivListMaker.prototype.getFeaturesDivList = function(layer_id){
  var target = document.createElement('ul');
  var features_list = buffer.getFeatureIDsByLayerID(layer_id);
  target.className = "input-group";
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
  target.className = "input-group";
  for (var layer_id in object){
    for (var i = 0 ; i < object[layer_id].length ; i++){
      var feature_id = object[layer_id][i];
      target.appendChild(this.createLIforFeature(layer_id, feature_id, true));
    }
  }
  if (target.childNodes.length == 0) return 0;
  return target;
}

DivListMaker.prototype.getDivProperties = function(layer_id, feature_id){

  var feature = buffer.getFeature(layer_id, feature_id);
  var upper_ul = document.createElement("ul");
  var temp_feature_property = [];
  for (var key in feature.properties) {
      temp_feature_property.push([key, feature.properties[key]]);
  }
  //upper_ul.className = "list-group";
  upper_ul.style.paddingTop = '10px';
  upper_ul.style.paddingLeft = '5px';

  for (var j = 0; j < temp_feature_property.length; j++) {
    var t_property = document.createElement('li');
    t_property.className = "property-list";
    t_property.innerText = temp_feature_property[j][0] + " : " + temp_feature_property[j][1];
    upper_ul.appendChild(t_property);
  } 
  return upper_ul;
}

DivListMaker.prototype.getTemporalPropertiesListDiv = function(layer_id, feature_id){
  var feature = buffer.getFeature(layer_id, feature_id);

  var name = feature.properties.name;
  var temporalProperties = feature.temporalProperties;
  var li = document.createElement("li");
  var ul = document.createElement("ul");

  //li.className = "list-group-item";
  li.role = "presentation";
  li.style.marginLeft = "5%";
  li.style.textAlign = "left";
  li.style.display ="block";
  ul.id = name;
  var temporalProperties_name = Object.keys(temporalProperties[0]);
  console.log(temporalProperties_name);
  for (var i = 0; i < temporalProperties_name.length; i++) {
    if (temporalProperties_name[i] == 'datetimes') continue;
    var li_temp = document.createElement("li");
    var a_temp = document.createElement("a");
    var div_temp = document.createElement("div");
    var chk_temp = document.createElement("input");

    li_temp.className = "list-group-item";
    li_temp.style.display = "inline-block";
    li_temp.role = "presentation";

    a_temp.innerText = temporalProperties_name[i];
    a_temp.onclick = (function(feature_id, temporalProperty) {
      return function() {
        getHighlight(feature_id, temporalProperty);
      }
    })(name, temporalProperties_name[i]);
    div_temp.appendChild(a_temp);
    li_temp.appendChild(div_temp);
    ul.appendChild(li_temp);
  }
  li.appendChild(ul);
  return li;
}