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

  Promise.all(promises).then(function (arr) {
    document.getElementById('drop_zone').style.visibility = 'hidden';
    document.getElementById('drop_zone_bg').style.visibility = 'hidden';
    for (var i = 0; i < arr.length; i++) {
      var json_object = JSON.parse(arr[i]);
   

      if (json_object.name != undefined) {
        updateBuffer_local(json_object.name, json_object);
      } else {
        updateBuffer_local(files[i].name, json_object);
      }
    }

    var list = list_maker.getLayerDivList(); //printFeatureLayerList_local(layer_list_local);
    var list_div = div_id.left_upper_list;
    var printArea = document.getElementById(list_div);
    printArea.innerHTML = "";
    printArea.appendChild(list);

    changeMenuMode(MENU_STATE.layers);
  });

}
function handleEditorData(filename, data){
  updateBuffer_local(filename, data);
  var list = list_maker.getLayerDivList(); //printFeatureLayerList_local(layer_list_local);
  var list_div = div_id.left_upper_list;
  var printArea = document.getElementById(list_div);
  printArea.innerHTML = "";
  printArea.appendChild(list);

  changeMenuMode(MENU_STATE.layers);
}
function readFile(file) {

  var reader = new FileReader();
  var deferred = $.Deferred();

  reader.onload = function (event) {
    deferred.resolve(event.target.result);
  };

  reader.onerror = function () {
    deferred.reject(this);
  };

  reader.readAsText(file);
  return deferred.promise();
}

function updateBuffer_local(filename, data) {

  // need convert mf_trajectory to mf_prism
  if (data.type == "FeatureCollection"){
    if (data.features[0].temporalGeometry == undefined){
      data = convertTtoP(filename, data)
    }
  }else{
    if (data.temporalGeometry == undefined){
      data = convertTtoP(filename, data)
    }
  }
  
  var layer = data.name;
  console.log(data.name)
  if (layer == undefined) {
    
    layer = filename;
    data.name = layer
    console.log(data.name)
  }
  if (buffer.data[layer] == undefined) { // this is new data.
    buffer.createLayer(layer);

    if (data.features != undefined) {
  
      var count = 0
      for (var feature_i = 0; feature_i < data.features.length; feature_i++) {
        if (data.features[feature_i].properties.name == undefined) {
          data.features[feature_i].properties.name = layer + "_" + count
     
          count += 1;
        }
        buffer.setBuffer_layer(layer, data.features[feature_i]);
      }
     
      // buffer.setBuffer_layer(data.features[feature_i]);
    } else { // file is not layer
    

      buffer.setBuffer_feature(layer, data.properties.name, data);
    }
  }
}


function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}


function convertTtoP(filename, data) {

 
  var interpolation = "Linear"

  if(data.type == "Feature"){
   
    var newFeatures = []
    var NewPrism = {
      type: "Feature",
      properties: {},
      temporalGeometry: {}
    }
    var geometry = data.geometry;
    var properties = data.properties;
    var name = data.id;
    var FeatureType = "MovingPoint";
    var coordinates = geometry.coordinates;
    // var datetimes2 = convertDate(properties.datetimes)
    var datetimes = properties.datetimes
    
    var propertiesKey = Object.keys(properties)
    var propertiesValue = Object.values(properties)
    
    var tempData = {}
    var propertyType;
    var temporalProperties = []
    if (propertiesKey.length > 1){
      
      for(var p_i = 0; p_i < propertiesKey.length; p_i++){
        
        if (propertiesKey[p_i] == "datetimes"){
       
          tempData[propertiesKey[p_i]] = propertiesValue[p_i]
        }
        else{
        
          if (typeof(propertiesValue[p_i][0]) == 'string'){
            propertyType = "Text"
          }else{
            propertyType = "Measure"
          }
          tempData[propertiesKey[p_i]] = {
              type: propertyType,
              values: propertiesValue[p_i],
              interpolation: "Step"
          }
        }
       
      }
      temporalProperties.push(tempData)
      NewPrism.temporalProperties = temporalProperties;
    }
    

    var NewCoordinates = []
    for (var j = 0; j < coordinates.length; j++){
     
      NewCoordinates.push(coordinates[j])
    }
    NewPrism.properties.name = name;
    NewPrism.temporalGeometry.type = FeatureType;
    NewPrism.temporalGeometry.datetimes = datetimes;
    NewPrism.temporalGeometry.coordinates = NewCoordinates;
    NewPrism.temporalGeometry.interpolation = interpolation;
  
  
    return NewPrism;    
  }
  else{
    var newFeatures = []
    var NewPrism = {
      type: "FeatureCollection",
      features: newFeatures
    }
    var features = data.features;
 
    for (var i = 0; i < features.length; i++){
      var geometry = features[i].geometry;
      var properties = features[i].properties;
      var coordinates = geometry.coordinates;
      var name = features[i].id
      var FeatureType = "MovingPoint";
      var datetimes = properties.datetimes;   
      var NewCoordinates = []
      var propertiesKey = Object.keys(properties)
      var propertiesValue = Object.values(properties)
      
      var tempData = {}
      var propertyType;
      var temporalProperties = []
      if (propertiesKey.length > 1){
        for(var p_i = 0; p_i < propertiesKey.length; p_i++){
          
          if (propertiesKey[p_i] == "datetimes"){
            tempData[propertiesKey[p_i]] = propertiesValue[p_i]
          }
          else{
            
            if (typeof(propertiesValue[p_i][0]) == 'string'){
              propertyType = "Text"
            }else{
              propertyType = "Measure"
            }
            tempData[propertiesKey[p_i]] = {
                type: propertyType,
                values: propertiesValue[p_i],
                interpolation: "Step"
            }
          }
        }
        temporalProperties.push(tempData)
      }

      for (var j = 0; j < coordinates.length; j++){
  
        NewCoordinates.push(coordinates[j])
      }
      var newFeaturesData = {
        type: "Feature",
        geometry: null,
        properties: {
          name: name
        },
        temporalGeometry: {
          type: FeatureType,
          datetimes: datetimes,
          coordinates: NewCoordinates,
          interpolation: interpolation
        }
      }
      if(temporalProperties.length > 0){
        newFeaturesData.temporalProperties = temporalProperties
      }
      newFeatures.push(newFeaturesData);
    }
  
 
    return NewPrism;
  }
}
  // var typeList = {
  //   Point: "MovingPoint",
  //   MultiPoint: "MovingPoint",
  //   LineString: "MovingLineString",
  //   MultiLineString: "MovingLineString",
  //   Polygon: "MovingPolygon",
  //   MultiPolygon: "MovingPolygon"
  // }
  // check the array dimention
  /**
   * Point (nedd)
   * Multipoint (nedd)
   * LineString (need)
   * MultiLineString (no need)
   * Polygon (need)
   * MultiPolygon (no need)
   * GeometryCollection (need add function)
   */







// for (var i = 0; i < features.length; i++){
//   var name = features[i].id;
//   var geometry = features[i].geometry;
//   var properties = features[i].properties;
//   var newType = geometry.type;
//   var datetimes = properties.datetimes;
//   var coordinates = geometry.coordinates;
//   var newCoordinates = [];
//   for (var j = 0; j < coordinates.length; j++){
//     newCoordinates.push([coordinates[j]])
//   }
//   if (name == undefined){
//     name = filename+"_"+i
//   }
//   var eachFeature = {
//     type: "Feature",
//     geometry: null,
//     properties: {
//       name: name
//     },
//     temporalGeometry:{
//       type: typeList[newType],
//       datetimes: datetimes,
//       coordinates: newCoordinates,
//       interpolation: ["Linear"]
//     }
//   }
//   newFeatures.push(eachFeature)
// }
// LOG(JSON.stringify(newData))
// return newData
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

// {
//   "type": "FeatureCollection",
//   "name": "mfjson_Trajectory_test.json",
//   "features": [{
//     "type": "Feature",
//     "geometry": null,
//     "properties": {
//       "name": "A"
//     },
//     "temporalGeometry": {
//       "type": "MovingLineString",
//       "datetimes": ["2012-01-17T12:33:51Z", "2012-01-17T12:33:56Z", "2012-01-17T12:34:00Z"],
//       "coordinates": [
//         [
//           [11, 2],
//           [12, 3]
//         ],
//         [
//           [12, 3],
//           [10, 3]
//         ]
//       ],
//       "interpolation": ["Linear"]
//     }
//   }]
// }

// {
//   "type": "FeatureCollection",
//   "name": "mfjson_Trajectory_test copy 2.json",
//   "features": [{
//     "type": "Feature",
//     "geometry": null,
//     "properties": {
//       "name": "A"
//     },
//     "temporalGeometry": {
//       "type": "MovingLineString",
//       "datetimes": ["2012-01-17T12:33:51Z", "2012-01-17T12:33:52Z"],
//       "coordinates": [
//         [
//           [
//             [143.9, 8.7, 3000000],
//             [143.60710678118656, 7.992893218813451, 3000000]
//           ]
//         ],
//         [
//           [
//             [143.4, 8.5, 3000000],
//             [143.10710678118656, 7.792893218813452, 3000000]
//           ]
//         ]
//       ],
//       "interpolation": ["Linear"]
//     }
//   }]
// }

// [{
//   "id": "document",
//   "version": "1.0"
// },
// {
//   "id": "Plane",
//   "availability": "2011-07-14T22:01:01.000Z/2011-07-14T22:01:05.000Z",
//   "model": {
//       "gltf": "CesiumMilkTruck/CesiumMilkTruck.gltf",
//       "scale": 1,
//       "show": [{
//           "interval": "2011-07-14T22:01:01.000Z/2011-07-14T22:01:05.000Z",
//           "boolean": true
//       }]
//   },
  
//   "position": {
//       "cartographicDegrees": [
//           "2011-07-14T22:01:01.000Z",    139.757083,    35.627701,    0.5,
//           "2011-07-14T22:01:02.000Z",    139.757399,    35.627701,    2,
//           "2011-07-14T22:01:03.000Z",    139.757555,    35.627688,    4,
//           "2011-07-14T22:01:04.000Z",    139.757651,    35.627596,    4,
//           "2011-07-14T22:01:05.000Z",    139.757716,    35.627483,    4
//       ]
//   },
//   "orientation": {
//       "unitQuaternion": [
//           "2011-07-14T22:01:01.000Z", 0.000004449973300240297, 0, 0, 0.5000029999910001,
//           "2011-07-14T22:01:02.000Z", 0.000004449999667218524, -0.04357786811497334, 0, 0.5000000373911798,
//           "2011-07-14T22:01:03.000Z", 0.000003853781460789935, 0, -0.0000022249817637850593, 0.5000040980594173,
//           "2011-07-14T22:01:04.000Z", 0.0000022249817637850593, 0, -0.000003853781460789935, 0.5000040980594173, 
//           "2011-07-14T22:01:05.000Z", 0, 0, -0.000004449973300240297, 0.5000029999910001 
//       ]
//   }
// }
// ]
/**
 * 1. model -> 이미지, 3d 모델(object, gltf)
 * 2. server
 * 3. scale, rotation
*/
