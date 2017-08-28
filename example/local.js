
var filelist_local = [];
var layer_list_local = [];

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.

  // files is a FileList of File objects. List some properties.
  var output = [];
  var promises = [];


  for (var i = 0, f; f = files[i]; i++) {
    var promise = readFile(f);
    promises.push(promise);
  }
  Promise.all(promises).then(function(arr){

    var dropZone = document.getElementById('drop_zone');
    dropZone.style.visibility = 'hidden';
    for(var i = 0 ; i < arr.length ; i++){

      var json_object = JSON.parse(arr[i]);

      if(json_object.name != undefined){
        if(!layer_list_local.contains(json_object.name)){
          layer_list_local.push(json_object.name);
          updateBuffer_local(json_object.name, json_object,true);
        }
      }
      else{
        if(!layer_list_local.contains(files[i].name)){
          layer_list_local.push(files[i].name);
          updateBuffer_local(files[i].name, json_object,true);
        }
      }
    }

    var list = printFeatureLayerList_local(layer_list_local);
    var printArea = document.getElementById('featureLayer');
    his_featurelayer = list;
    printArea.innerHTML = "";
    printArea.appendChild(list);
    printMenuState = "layer";
    var printState = document.getElementById('printMenuState');
    printState.innerText = printMenuState;
    //selectProperty('graph');
  });
  /*
  var promise = readFile(files[0]);
  promise.then(function(data){
  var dropZone = document.getElementById('drop_zone');
  dropZone.style.visibility = 'hidden';
  var json_object = JSON.parse(data);

  if(json_object.name != undefined){
  if(!layer_list_local.contains(json_object.name)){
  layer_list_local.push(json_object.name);
  updateBuffer_local(json_object.name, json_object,true);
}
}
else{
if(!layer_list_local.contains(files[0].name)){
layer_list_local.push(files[0].name);
updateBuffer_local(files[0].name, json_object,true);
}
}
var feature = getBuffer([files[0].name]);
var feature_list = [];
for(var j in feature){
feature_list.push(feature[j]);
}
drawFeature();
getFeatures_local(files[0].name,feature_list);
//var graph = document.getElementById);
selectProperty('graph');

printMenuState = "layer";
},function(err){
console.log("fail to get single feature");
});
*/


}
function handleFileSelect_upload(evt){

  if(printMenuState == "layer"){
    var files = evt.target.files;
    var output = [];
    var promises = [];
    for(var i = 0, f; f = files[i];i++){
      var promise = readFile(f);
      promises.push(promise);
    }
    Promise.all(promises).then(function(arr) {


      for(var i = 0 ; i < arr.length ; i++){
        var parse = JSON.parse(arr[i]);

        var dropZone = document.getElementById('drop_zone');
        dropZone.style.visibility = 'hidden';
        if(parse.name != undefined){
          if(!layer_list_local.contains(parse.name)){
            layer_list_local.push(parse.name);
            updateBuffer_local(parse.name, parse,true);
          }

        }
        else{
          if(!layer_list_local.contains(files[i].name)){
            layer_list_local.push(files[i].name);
            updateBuffer_local(files[i].name, parse,true);
          }
        }

      }

      var list = printFeatureLayerList_local(layer_list_local);
      var printArea = document.getElementById('featureLayer');
      his_featurelayer = list;
      printArea.innerHTML = "";
      printArea.appendChild(list);
      printMenuState = "layer";
    });
  }
}

function readFile(file) {
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

function updateBuffer_local(filename, data,bool){
  if(bool == true){
    var layer = data.name;
    if(getBuffer([layer])==null){
      filelist_local.push(layer);

      if(data.features != undefined){
        for(var i = 0 ; i < data.features.length; i++){
          var feature = data.features[i].properties.name;

          updateBuffer([layer,feature],data.features[i],true);

        }
      }
      else{
        updateBuffer([filename,data.properties.name],data,true);
      }

    }

  }
}

var inputbutton_height;
function printFeatureLayerList_local(arr) {

  printMenuState = "layer";
  var printState = document.getElementById('printMenuState');
  printState.innerText = printMenuState;
  var target = document.getElementsByClassName("vertical");
  var upper_ul = document.createElement('ul');
  //upper_ul.className = "list-group-item";

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

function getFeatures_local(layerID, features_list) {
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

function printFeatures_local(layerID, features_list, id) { //피쳐레이어아이디,
  var printedLayer = document.getElementById('layer_list');
  var property_panel = document.getElementById("property_panel");
  var target = document.createElement('ul');
  var check_all = document.createElement('li');
  var chk_all = document.createElement('input');
  var unchk_all = document.createElement('input');
  var printState = document.getElementById('printMenuState');
  var menu = document.getElementById('menu_list');
  var uploadButton = document.getElementById('uploadButton');

  // uploadButton.style.visibility = "hidden";
  //
  // uploadButton.style.padding = "0";
  // uploadButton.style.height = 0;
  printedLayer.style.visibility = "visible";
  property_panel.style.visibility = "hidden";
  check_all.style.display = "flex";
  check_all.style.position = "absolute";
  check_all.className = "list-group-item";

  chk_all.type = 'button';
  chk_all.style = "min-height : 100%;min-width : 50%";

  chk_all.className = "btn btn-default";
  chk_all.value = 'check all';
  //chk_all.style.display = "flex";
  chk_all.style.flex = '0';
  chk_all.style.position = 'relative';
  chk_all.onclick = (function(name) {
    return function() {
      checkAll(name);
    };
  })("chkf[]");
  check_all.appendChild(chk_all);
  check_all.id = "check_all_buttons";
  check_all.style = "flex-grow : 0;align-items: center;justify-content: center;";

  //unchk_all.style.display = "flex";
  unchk_all.type = 'button';
  unchk_all.className = "btn btn-default";
  unchk_all.style = "min-height : 100% ; min-width : 50%";
  unchk_all.style.position = "relative";
  unchk_all.value = 'uncheck all';
  unchk_all.style.flex = '0';

  unchk_all.onclick = (function(name) {
    return function() {
      uncheckAll(name);
    };
  })("chkf[]");

  check_all.appendChild(unchk_all);

  //menu.insertBefore(check_all, document.getElementById('featureLayer'));
  //check_button = check_all;
  target.className = "list-group-item";
  printMenuState = "features";

  if(!layerID.includes("\'")){

    //printState.innerText = printMenuState + " :" + layerID;
  }
  else{
    //printState.innerText = printMenuState + " :" + parse_layer_name(layerID);
  }
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

    //li.appendChild(a);
    //li.appendChild(span);
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
function getParameterByName(name, url) {
if (!url) {
url = window.location.href;
}
name = name.replace(/[\[\]]/g, "\\$&");
var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
results = regex.exec(url);
if (!results) return null;
if (!results[2]) return '';
return decodeURIComponent(results[2].replace(/\+/g, " "));
}
*/
