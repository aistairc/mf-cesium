function DivListMaker(p_connection){
  this.connector = p_connection;
  this.isFeatureChecked = {};
}

DivListMaker.prototype.getLayerDivList = function(){
  // console.log('getLayerDivList')
  var upper_ul = document.createElement('ul');
  upper_ul.style.height = "10%";
  upper_ul.className = "input-group";
  var layer_name_list = buffer.getLayerNameList();
  for (var i = 0; i < layer_name_list.length; i++) {
    var layer_id = layer_name_list[i];
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.style.width = "inherit";
    a.innerText = layer_name_list[i];

    li.id = layer_name_list[i];
    li.onclick = (function(id) {
      return function() {
        changeMenuMode(MENU_STATE.features);
        // LOG(buffer);

        var features = buffer.getFeatureIDsByLayerID(id);
        var features_is_empty = Object.keys(features).length === 0 && features.constructor === Object;
        var callback = function(){
            printFeaturesList(id);
            afterChangingCheck();
            printCheckAllandUnCheck(id);  
            stinuum.geometryViewer.adjustCameraView();  
        };
        // LOG(features)
        // LOG(buffer.fromServer[id])
        if (features_is_empty && buffer.fromServer[id]){
          // LOG("features from server");
          // LOG(id, buffer.fromServer[id])
          connector.getFeaturesByLayerID(id, buffer.fromServer[id], callback);
          // connector.getFeaturesByLayerID(id, buffer.data[id], callback);
          // callback();
        }
        else{
          // LOG("features from local", features);
          callback();
        }
      };
    })(layer_id);
    li.style = "width:inherit";
    li.className = "list-group-item left-toolbar-item";
    li.appendChild(a);
    upper_ul.appendChild(li);

    if (this.isFeatureChecked[layer_id] == undefined) this.isFeatureChecked[layer_id] = {};
  }
  return upper_ul;
}

DivListMaker.prototype.turnOnFeature= function(layer_id, feature_id, check){
  // LOG("turnOnFeature")
  // LOG(this.isFeatureChecked[layer_id])
  if (this.isFeatureChecked[layer_id] == undefined){
    throw "isFeatureChecked[layer_id] is undefined in DivListMaker";
  }
  this.isFeatureChecked[layer_id][feature_id] = true;
}

DivListMaker.prototype.turnOffFeature= function(layer_id, feature_id){
  // LOG("turnOffFeature")
  if (this.isFeatureChecked[layer_id] == undefined){
    throw "isFeatureChecked[layer_id] is undefined in DivListMaker";
  }
  this.isFeatureChecked[layer_id][feature_id] = false;
}

DivListMaker.prototype.createLIforFeature= function(layer_id, feature_id, is_printed_features=false){
  let typeinfo = buffer.getFeatureIDsByLayerIDTemp(layer_id);
  // LOG("createLIforFeature", typeinfo)

  var li = document.createElement("li");
  var a = document.createElement("a");
  var ul = document.createElement("ul");
  var chk = document.createElement("input");
  var div = document.createElement("div");
  li.role = "presentation";
  div.className = "list-group-item left-toolbar-item";


 // ul.className = "list-group";
  
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
    if (!buffer.checkIfServerData(layer_id)){
      
      showFeature(layer_id, feature_id);
    }else{
      list_maker.turnOffFeature(layer_id,feature_id);
      
    }    
  }
  chk.checked = this.isFeatureChecked[layer_id][feature_id];
  chk.addEventListener('click', function(){
      toggleFeature(layer_id,feature_id);
  });
  // div.style.width = "100%";
  div.appendChild(chk);
  div.appendChild(a);
  li.appendChild(div);

  // if (typeinfo === true) {
  //   // var addBtn = document.createElement("button");
  //   var div2 = document.createElement("div");
  //   addBtn.innerText = "ADD"
  //   addBtn.addEventListener('click', function () {
  //     alert(layer_id, feature_id)
  //   })
  //   div2.appendChild(addBtn)
  //   div2.className = "list-group-item left-toolbar-add";
  //   div2.style.width= "20%"
  //   div2.style.float= "right"
  //   // addBtn.style.width= "100%"
  //   // addBtn.style.height= "100%"
  //   div2.style.color = "black"
  //   div.style.width = "80%";
  //   div.style.float= "left"
  //   li.appendChild(div);
  //   li.appendChild(div2)
  // }else{
  //   div.style.width = "100%";
  //   li.appendChild(div);
  // }

  return li;
}

DivListMaker.prototype.getFeaturesDivList = function(layer_id){
  var target = document.createElement('ul');
  var features_list = buffer.getFeatureIDsByLayerID(layer_id);
  // console.log("getFeaturesDivList")
  target.className = "input-group";
  for (var feature_id in features_list) {
    //var data = buffer.getFeature(layer_id, feature_id);
    //buffer.getBuffer([layer_id, features_list[i]]);
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
      // console.log(feature_id)
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
  
  var ul = document.createElement("ul");

  ul.id = name;
  ul.className = "input-group";
  var  temporalProperties_name = new Array();
  let hide_items = ["DATETIMES", "IMAGE" ,"DETECTION"];
  if (feature.temporalGeometry.type == "MovingGeometryCollection")  {
    if (Array.isArray(temporalProperties)){
      for(var i = 0; i < temporalProperties.length; i++){
        var keys = Object.keys(temporalProperties[i]);
        for (var k = 0; k < keys.length; k++) {
            if (keys[k].toUpperCase() == 'DATETIMES') continue;
            // LOG(temporalProperties[i][keys[k]].type)
            if(hide_items.indexOf(temporalProperties[i][keys[k]].type.toUpperCase())>=0){
            // if(hide_items.indexOf(temporalProperties[i][keys[k]].type) >= 0){
                continue;
            }
            if(temporalProperties_name.indexOf(keys[k])>=0){
                continue;
            }
            // LOG(keys[k])
            temporalProperties_name.push(keys[k])
        }
        
      }
    } 
    else {
      // LOG(temporalProperties);
      throw new Error("temporalPr" +
          "operties should be array");
      //temporalProperties_name = Object.keys(temporalProperties);
    }
    // LOG("here temporalProperties_name", temporalProperties_name);
    for (var i = 0; i < temporalProperties_name.length; i++) {
      
        // LOG(temporalProperties_name[i])
        
        var li_temp = document.createElement("li");
        var a_temp = document.createElement("a");
        var div_temp = document.createElement("div");
    
        div_temp.className = "list-group-item left-toolbar-item";
        //div_temp.style.display = "inline-block";
        div_temp.role = "presentation";
    
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
    return ul;
  }
  else{
    if (Array.isArray(temporalProperties)) {
      // LOG("here : ", temporalProperties.length)
  
      for(var p_i = 0;p_i < temporalProperties.length;p_i++ ){
        var keys = Object.keys(temporalProperties[p_i]);
        for (var k = 0; k < keys.length; k++) {
            if (keys[k].toUpperCase() == 'DATETIMES') continue;
            // LOG(temporalProperties[p_i][keys[k]])
            // LOG(temporalProperties[p_i][keys[k]].type)
            // LOG(temporalProperties[p_i][keys[k]].type.toUpperCase())
            if(hide_items.indexOf(temporalProperties[p_i][keys[k]].type.toUpperCase())>=0){
            // if(hide_items.indexOf(temporalProperties[p_i][keys[k]].type)>=0){
                continue;
            }
            if(temporalProperties_name.indexOf(keys[k])>=0){
                continue;
            }
            // LOG(keys[k])
            temporalProperties_name.push(keys[k])
        }
      }
      
    }
    else {
      // LOG(temporalProperties);
      throw new Error("temporalProperties should be array");
      //temporalProperties_name = Object.keys(temporalProperties);
    }
    // LOG("here temporalProperties_name", temporalProperties_name);
    for (var i = 0; i < temporalProperties_name.length; i++) {
      
      var li_temp = document.createElement("li");
      var a_temp = document.createElement("a");
      var div_temp = document.createElement("div");
  
      div_temp.className = "list-group-item left-toolbar-item";
      //div_temp.style.display = "inline-block";
      div_temp.role = "presentation";
  
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
    return ul;
  }
}

DivListMaker.prototype.getLayersTurnedOn = function(){
  var layers = [];
  for (var layer_id in this.isFeatureChecked){
    if (this.isFeatureChecked.hasOwnProperty(layer_id)){
      for (var feature_id in this.isFeatureChecked[layer_id]){
        if (this.isFeatureChecked[layer_id].hasOwnProperty(feature_id)){
          if (this.isFeatureChecked[layer_id][feature_id]){
            layers.push(layer_id);
            break;
          } 
        }
      }
    }
  }
  return layers;
}

DivListMaker.prototype.getDropdownDIVofFeaturesWithType = function(type, appendLayer = false){
  var dwn_btn_id = "btn_"+type;
  var feature_ids = [];
  var features = this.getFeaturesAndLayersTurnedOn();
  for (var layer_id in features){
    if (this.isFeatureChecked.hasOwnProperty(layer_id)){
      for (var i = 0 ; i < features[layer_id].length ; i++){
        var f_id = features[layer_id][i];
        if (buffer.getFeature(layer_id, f_id).temporalGeometry.type == type){
          feature_ids.push(f_id);
        }
      }
    }
  }
  var dwn_div = document.createElement("div");
  dwn_div.className = "dropdown";
  dwn_div.style.width = "20%";
  dwn_div.value = undefined;

  var dwn_btn = document.createElement("button");
  dwn_btn.type = 'button';
  dwn_btn.id = dwn_btn_id;
  dwn_btn.className = 'upper_toolbar_btn';
  dwn_btn.innerText = type;
  dwn_btn.style.width = '90%';
  dwn_btn.setAttribute("data-toggle","dropdown");

  var dropdown_icon = document.createElement("span");
  dropdown_icon.className = 'caret';

  dwn_btn.appendChild(dropdown_icon);
  var list = document.createElement("ul");
  list.className = 'dropdown-menu';
  list.role = "menu";
  list.setAttribute("aria-labelledby",dwn_btn_id);

  list.innerHTML += '<input type="text" class="drop-item" placeholder="Search.." id="myInput" onkeyup="filterFunction('+appendLayer+')">';
  list.appendChild(this.makeDropDownDivider());
  list.appendChild(this.makeDropDownHeader('Features'));

  for (var i = 0 ; i < feature_ids.length ; i++){
    var feature_li = document.createElement("li");
    feature_li.role = "presentation";
    feature_li.id = feature_ids[i];
    var a = document.createElement("a");
    a.role = "presentation";
    a.tabindex = "-1";
    a.href ="#";
    a.className = "drop-item";
    if (appendLayer) a.className += " first";
    else a.className += " second";
    a.innerText = feature_ids[i];
    feature_li.appendChild(a);
    feature_li.onclick = (function(feature_id, btn_id) {
      return function() {
        document.getElementById(btn_id).innerText = feature_id;
        dwn_div.value = [feature_id];
      }
    })(feature_ids[i], dwn_btn_id);
    list.appendChild(feature_li);
  }

  if (appendLayer){
    list.appendChild(this.makeDropDownDivider());
    list.appendChild(this.makeDropDownHeader('Layers'));

    var layer_list = this.getLayersTurnedOn();
    for (var i = 0 ; i < layer_list.length ; i++){
      var li = document.createElement("li");
      li.role = "presentation";
      li.id = layer_list[i];
      var a = document.createElement("a");
      a.role = "presentation";
      a.tabindex = "-1";
      a.href ="#";
      a.className = "drop-item";
      if (appendLayer) a.className += " first";
      else a.className += " second";
      a.innerText = "Layer : " + layer_list[i];
      li.appendChild(a);
      li.onclick = (function(layer_id, btn_id) {
        return function() {
          document.getElementById(btn_id).innerText = "Layer : " + layer_id;
          dwn_div.value = [];
          var feature_list_inLayer = buffer.getFeatureIDsByLayerID(layer_id);
          for (var fi in feature_list_inLayer){
            if (feature_list_inLayer.hasOwnProperty(fi)){
              dwn_div.value.push(fi);
            }
          }
        }
      })(layer_list[i], dwn_btn_id);
      list.appendChild(li);
    }    
    
  }
  dwn_div.appendChild(dwn_btn);
  dwn_div.appendChild(list);
  return dwn_div;
}

/*
  list.innerHTML += '<li role="presentation" class="divider" style="background-color : rgb(200,200,200);"></li>';
  list.innerHTML += '<li class="dropdown-header">Layers</li>';
*/
DivListMaker.prototype.makeDropDownDivider = function(){
  var li = document.createElement('li');
  li.role = "presentation";
  li.className = "divider";
  li.style = "background-color : rgb(200,200,200)";
  return li;
}


DivListMaker.prototype.makeDropDownHeader = function(name){
  var li = document.createElement('li');
  li.className = "dropdown-header";
  li.innerText = name;
  return li;
}

function filterFunction(appendLayer){
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  var className = "drop-item";
  if (appendLayer) className+=" first";
  else className += " second";
  a = document.getElementsByClassName(className);
  for (i = 0; i < a.length; i++) {
      if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
          a[i].style.display = "";
      } else {
          a[i].style.display = "none";
      }
  }
}