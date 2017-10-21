


/** File upload event */
function handleFileSelect(evt) {
  LOG("handleFileSelect");
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
      LOG(json_object);
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
    //his_featurelayer = list;
    printArea.innerHTML = "";
    printArea.appendChild(list);

    changeMenuMode("LAYER");
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
  if(getBuffer([layer]) == null){ // ths is new data.
    createLayer(layer);
    if(data.features != undefined){
      setBuffer_layer(data);
    }
    else{ // file is not layer
      setBuffer_feature(filename, data.properties.name, data);
    }
  }
}


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

  var layerlist = document.getElementById('list');
  layerlist.innerHTML = "";
  layerlist.appendChild(printPrintedLayersList());
  var list = printFeatures_local(layerID, features_list, "features");
  var printArea = document.getElementById('featureLayer');
  his_features = list;
  printArea.innerHTML = "";
  printArea.appendChild(list);
  printMenuState = "features";
  drawFeature();
}

function removeCheckAllandUnCheckBtn(){
  LOG("removeCheckAllandUnCheckBtn")
  if (document.getElementById('check_all_buttons')) {
    document.getElementById('check_all_buttons').remove();
  }
  cleanGraphDIV();
}

function printCheckAllandUnCheck(){
  LOG("printCheckAllandUnCheck");
  removeCheckAllandUnCheckBtn();

  var menu = document.getElementById('menu_list');
  var check_all = document.createElement('li');
  var chk_all = document.createElement('input');
  var unchk_all = document.createElement('input');

  check_all.style = "flex-grow : 0;align-items: center;justify-content: center;";
  //check_all.style.display = "flex";
  check_all.id = "check_all_buttons";
  check_all.style.display = "inline-block";
  check_all.style.padding = "10px";


  chk_all.type = 'button';
  chk_all.style.height = '100%';
  chk_all.style.width = "46%";
  chk_all.style.margin = "2%";
  chk_all.style.marginBottom = "0";
  chk_all.className = "btn btn-default";
  chk_all.value = 'ALL';
  chk_all.style.flex = '0';
  chk_all.style.position = 'relative';
  chk_all.onclick = (function(name) {
    return function() {
      checkAll(name);
    };
  })("chkf[]");
  check_all.appendChild(chk_all);

  unchk_all.type = 'button';
  unchk_all.className = "btn btn-default";
  unchk_all.style.height = '100%';
  unchk_all.style.width = "46%";
  unchk_all.style.position = "relative";
  unchk_all.style.margin = "2%";
  unchk_all.style.float = "right";
  unchk_all.style.marginBottom = "0";
  unchk_all.value = 'RESET';
  unchk_all.style.flex = '0';

  unchk_all.onclick = (function(name) {
    return function() {
      uncheckAll(name);
    };
  })("chkf[]");

  check_all.appendChild(unchk_all);

  menu.insertBefore(check_all, document.getElementById('featureLayer'));

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
  printMenuState = "features";

  printState.innerText = printMenuState;
  for (var i = 0; i < features_list.length; i++) {

    var data = getBuffer([layerID, features_list[i]]);
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
        drawFeature();
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

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}



/*

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