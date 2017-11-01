

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

