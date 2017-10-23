

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}


/** File upload event */
function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.

  var output = [];
  var promises = [];

  for (var i = 0, f; f = files[i]; i++) {
    var promise = readFile(f);
    promises.push(promise);
  }
  Promise.all(promises).then(function(arr){
    document.getElementById('drop_zone').style.visibility = 'hidden';
    document.getElementById('drop_zone_bg').style.visibility = 'hidden';
    for(var i = 0 ; i < arr.length ; i++){

      var json_object = JSON.parse(arr[i]);
      LOG("handleFileSelect", json_object);
      if (!Array.isArray(json_object.temporalGeometry.coordinates[0][0][0]) 
        && json_object.temporalGeometry.type == 'MovingPolygon'){ //old mf-json format for polygon
        var coord = json_object.temporalGeometry.coordinates;
        var new_arr = [];
        for (var j = 0 ; j < coord.length ; j++){
          new_arr.push([coord[j]]);
        }
        json_object.temporalGeometry.coordinates = new_arr;
      }
      if(json_object.name != undefined){
        updateBuffer_local(json_object.name, json_object);
      }
      else{
        updateBuffer_local(files[i].name, json_object);
      }
    }

    var list = list_maker.getLayerDivList();//printFeatureLayerList_local(layer_list_local);
    var list_div = div_id.left_upper_list;
    var printArea = document.getElementById(list_div);
    printArea.innerHTML = "";
    printArea.appendChild(list);

    changeMenuMode(MENU_STATE.layers);
  });
}

function readFile(file) {
  LOG("readFile")
  var reader = new FileReader();
  var deferred = $.Deferred();

  reader.onload = function(event) {
    deferred.resolve(event.target.result);
  };

  reader.onerror = function() {
    deferred.reject(this);
  };

  reader.readAsText(file);
  return deferred.promise();
}

function updateBuffer_local(filename, data){
  LOG("updateBuffer_local")
  var layer = data.name;
  if (layer == undefined) layer = filename;
  if(buffer.getBuffer([layer]) == null){ // ths is new data.
    buffer.createLayer(layer);
    if(data.features != undefined){
      buffer.setBuffer_layer(data);
    }
    else{ // file is not layer
      buffer.setBuffer_feature(filename, data.properties.name, data);
    }
  }
}


/*
function getFeatures_local(layerID, features_list) {
  LOG("getFeatures_local")
  var features = [];
  var printFeatures_list = [];
  var getdata;

  if(!printedLayerList.contains(layerID)){
    printedLayerList.push(layerID);
    var index = printedLayerList.indexOf(layerID);
    bool_printedLayerList[index] = 1;
  }

  var layerlist = document.getElementById(div_id.printed_features);
  layerlist.innerHTML = "";
  layerlist.appendChild(printPrintedLayersList());
  var list = printFeatures_local(layerID, features_list, "features");
  var printArea = document.getElementById('featureLayer');
  his_features = list;
  printArea.innerHTML = "";
  printArea.appendChild(list);
  printMenuState = MENU_STATE.features;
  drawFeatures();
}

function printFeatures_local(layerID, features_list, id) { //피쳐레이어아이디,
  LOG("printFeatures_local")
  var printedLayer = document.getElementById('layer_list');
  var property_panel = document.getElementById("property_panel");
  var target = document.createElement('ul');

  var printState = document.getElementById('printMenuState');
  var menu = document.getElementById('menu_list');
  var uploadButton = document.getElementById('uploadButton');

  printedLayer.style.visibility = "visible";
  property_panel.style.visibility = "hidden";

  //check_button = check_all;
  target.className = "list-group-item";
  printMenuState = MENU_STATE.features;

  printState.innerText = printMenuState;
  for (var i = 0; i < features_list.length; i++) {

    var data = buffer.getBuffer([layerID, features_list[i]]);
    var li = document.createElement("li");
    var a = document.createElement("a");
    var ul = document.createElement("ul");
    var chk = document.createElement("input");
    var span = document.createElement("span");
    var div = document.createElement("div");

    //span.className = "input-group-addon";
    div.className = "input-group";
    //li.className = "list-group-item";
    ul.className = "list-group";
    li.role = "presentation";


    a.innerText =features_list[i].properties.name;
    a.onclick = (function(layer, feature) {
      return function() {
        removeCheckAllandUnCheckBtn();
        getFeature(layer, feature);
      }
    })(layerID, features_list[i].properties.name);

    chk.type = "checkbox";
    chk.checked = "true";
    chk.name = 'chkf[]';

    chk.id = features_list[i].properties.name + "##" + layerID;
    chk.onclick = (function() {
      return function() {
        drawFeatures();
      }
    })();

    div.appendChild(chk);
    div.appendChild(a);

    li.appendChild(div);
    target.appendChild(li);

  }

  his_features = target;

  return target;
}



function printFeatureLayerList_local(arr) {
  LOG("printFeatureLayerList_local");
  printMenuState = "LAYER";
  var printState = document.getElementById('printMenuState');
  printState.innerText = printMenuState;
  var target = document.getElementsByClassName("vertical");
  var upper_ul = document.createElement('ul');
  //upper_ul.className = "list-group-item";
  console.log(arr);
  for (var i = 0; i < arr.length; i++) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    var ul = document.createElement('ul');

    ul.id = arr[i];
    a.innerText = arr[i];

    var data = getBuffer([arr[i]]);//the single layer data. coontains several feature
    var feature_list = [];
    for(var j in data){
      feature_list.push(data[j]);
    }
    a.onclick = (function(id, feature) {
      return function() {
        getFeatures_local(id,feature);
        printCheckAllandUnCheck();
      };
    })(arr[i], feature_list);
    getFeatures_local(arr[i],feature_list);
    li.style = "width:inherit";
    a.style = "width:inherit";
    li.className = "list-group-item";
    ul.className = "list-group";
    li.appendChild(a);
    li.appendChild(ul);

    upper_ul.appendChild(li);
  }
  his_featurelayer = upper_ul;
  return upper_ul;
}
*/