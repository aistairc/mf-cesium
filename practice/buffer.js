
function getBuffer(id) {
    if (id.length == 1) {
        if (buffer.hasOwnProperty(id[0])) {
            return buffer[id[0]];
        }
    } else if (id.length == 2) {
      if (buffer.hasOwnProperty(id[0])) {
          var temp = buffer[id[0]];
          if (temp.hasOwnProperty(id[1])) {
              return temp[id[1]];
          }

      }
    }
    return null;
}

function createLayer(layer_id){
  if (!buffer.hasOwnProperty(layer_id)) {
    buffer[layer_id] = {};
  }
}

function setBuffer_layer(layer_data){
  for(var i = 0 ; i < layer_data.features.length; i++){
    var feature_id = layer_data.features[i].properties.name;
    setBuffer_feature(layer_data.name, feature_id, layer_data.features[i]);
  }
}

function setBuffer_feature(layer_id, feature_id, feature_data){
  if (!buffer.hasOwnProperty(layer_id)) {
    throw new Stinuum.Exception(layer_id + " is not created layer", layer_id);
  }
  buffer[layer_id][feature_id] = {};
  try{
    buffer[layer_id][feature_id] = JSON.parse(feature_data);
  }
  catch(e) {
    //throw new Stinuum.Exception("it is not json format", feature_data);
    buffer[layer_id][feature_id] = feature_data;
  }
}

//TODO remove : chagne to setBuffer
function updateBuffer(id, feature) {
  if (id.length == 1) {
    if (!buffer.hasOwnProperty(id[0])) {
      buffer[id[0]] = {};
    }
  } else if (id.length == 2) {
    if (!buffer.hasOwnProperty(id[0])) {
      buffer[id[0]] = {};
      buffer[id[0]][id[1]] = {};
      try{
        JSON.parse(feature);
        buffer[id[0]][id[1]] = JSON.parse(feature);
        console.log(buffer[id[0]][id[1]]);
      }
      catch(e) {
        buffer[id[0]][id[1]] =feature;
      }
      //buffer[id[0]][id[1]] = feature;
    } else {
      if (!buffer[id[0]].hasOwnProperty(id[1])) {
        buffer[id[0]][id[1]] = {};
        try{
          buffer[id[0]][id[1]] = JSON.parse(feature);
        }
        catch(e){
          buffer[id[0]][id[1]] = feature;
        }


      }
    }
  }
}

function removeBuffer(id){
     if (id.length == 1) {
         if (getBuffer(id) !== null) {
             delete buffer[id[0]];
         }
     } else if (id.length == 2) {
         if (getBuffer(id) !== null) {
             delete buffer[id[0]][id[1]];
         }
     }
}

function getLayerNameList(){
  var list = [];
  for (var key in buffer){
    if (buffer.hasOwnProperty(key)) {
      list.push(key);
    }
  }
  return list;
}