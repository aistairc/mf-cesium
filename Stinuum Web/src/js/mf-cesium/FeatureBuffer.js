function FeatureBuffer(p_connection) {
  this.connector = p_connection;
  this.data = {};
  this.fromServer = {};
}
FeatureBuffer.prototype.getLayerID = function (feature_id){
  for (let [key, value] of Object.entries(this.fromServer)){
    if (value[feature_id] !== undefined){
      return key;
    }
  }
  return false;
}

FeatureBuffer.prototype.addTproperty = function (layer_id, feature_id, tgeometry_id, t_property, keyValue){
  let idx = false;
  for (let p_idx=0; p_idx < this.fromServer[layer_id][feature_id].temporalProperties.length;p_idx++){
    if (Object.keys(this.fromServer[layer_id][feature_id].temporalProperties[p_idx]).includes(keyValue)){
      idx = true;
      break;
    }
  }
  if (!idx){
    this.fromServer[layer_id][feature_id].temporalProperties.push(t_property);
  }
  return idx;
}

FeatureBuffer.prototype.getTgeometryID = function (layer_id, feature_id){
  let feature_info = this.getFeature(layer_id, feature_id);
  return feature_info.temporalGeometry.prisms[0].id;
}
FeatureBuffer.prototype.getFeatureIDsByLayerIDTemp = function (layer_id) {
  // LOG("getFeatureIDsByLayerID", layer_id)
  if (this.data[layer_id] !== undefined) {
    return false
  }else if(this.fromServer[layer_id] !== undefined){
    return true
  }else{
    // LOG("no layer", layer_id);
    throw "this layer_id is not in buffer" + layer_id;
  }

  // if (this.data[layer_id] == undefined) {
  //   LOG("no layer", layer_id);
  //   throw "this layer_id is not in buffer" + layer_id;
  // }
  // return this.data[layer_id];
}
FeatureBuffer.prototype.getFeatureIDsByLayerID = function (layer_id) {
  // LOG("getFeatureIDsByLayerID", layer_id)
  if (this.data[layer_id] != undefined) {
    // console.log(this.data[layer_id])
    return this.data[layer_id];
  }else if(this.fromServer[layer_id] != undefined){
    // console.log(this.fromServer[layer_id])
    return this.fromServer[layer_id];
  }else{
    // LOG("no layer", layer_id);
    throw "this layer_id is not in buffer" + layer_id;
  }
  
  // if (this.data[layer_id] == undefined) {
  //   LOG("no layer", layer_id);
  //   throw "this layer_id is not in buffer" + layer_id;
  // }
  // return this.data[layer_id];
}

FeatureBuffer.prototype.getFeature = function (layer_id, feature_id) {
  
  // if (this.data[layer_id][feature_id] == undefined) {
  //   LOG("no feature", layer_id, feature_id);
  //   throw "this layer_id, feature_id is not in buffer";
  // }
  // return this.data[layer_id][feature_id];
  if (this.data.hasOwnProperty(layer_id)){
    if (this.data[layer_id][feature_id] != undefined) {
      return this.data[layer_id][feature_id];  
    } 
  }else if(this.fromServer.hasOwnProperty(layer_id)){
    // LOG(this.fromServer[layer_id][feature_id])
    if(this.fromServer[layer_id][feature_id] != undefined){
      return this.fromServer[layer_id][feature_id];
    }
  }
  // LOG("no feature", layer_id, feature_id);
  throw "this layer_id, feature_id is not in buffer";
}

FeatureBuffer.prototype.createLayer = function (layer_id, isFromServer) {
  
  if (isFromServer == true) {
    this.fromServer[layer_id] = {};
  }
  else {
    if (!this.data.hasOwnProperty(layer_id)) {
      this.data[layer_id] = {};
    }
  }
  // else this.fromServer[layer_id] = false;
 
}

FeatureBuffer.prototype.deleteBuffer = function (layer_id, feature_id) {
  LOG("TODO deleteBuffer");
}

FeatureBuffer.prototype.setBuffer_layer = function (layer, feature_data) {
  // LOG("TODO setBuffer_layer");
  // LOG(feature_data)
  // LOG(feature_data.properties)
  if (feature_data.properties.trackerId != undefined) {
    var feature_id = feature_data.properties.trackerId
  } else {
    var feature_id = feature_data.properties.name
  }
  this.setBuffer_feature(layer, feature_id, feature_data);

}

FeatureBuffer.prototype.setBuffer_feature = function (layer_id, feature_id, feature_data) {
  // LOG("TODO setBuffer_feature");
  // LOG(layer_id)
  if (!this.data.hasOwnProperty(layer_id) && !this.fromServer.hasOwnProperty(layer_id)) {
    throw layer_id + " is not created layer";
  }

  
  if (this.fromServer.hasOwnProperty(layer_id)){
    this.fromServer[layer_id][feature_id] = feature_data;
    // try {
      
    //   feature_data = this.translateValue(JSON.parse(feature_data))
    //   feature_data = this.translateTime(JSON.parse(feature_data))
      
    //   this.fromServer[layer_id][feature_id] = JSON.parse(feature_data);
    // } catch (e) {
    //   //throw new Stinuum.Exception("it is not json format", feature_data);
    //   this.fromServer[layer_id][feature_id] = feature_data;
    // }
    
  }else{
    // console.log("defined")
    this.data[layer_id][feature_id] = {};
    // LOG(feature_data)
    if (feature_data.temporalGeometry.type == 'MovingGeometryCollection'){
      for (var prism_i = 0; prism_i < feature_data.temporalGeometry.prisms.length; prism_i++){
        var eachFeature = feature_data.temporalGeometry.prisms[prism_i];
        // LOG(eachFeature)
        if (!Array.isArray(eachFeature.coordinates[0][0][0]) &&  (eachFeature.type == 'MovingPolygon' || eachFeature.type == 'MovingLineString' || eachFeature.type == 'MovingPointCloud')) { //old mf-json format for polygon
          var coord = eachFeature.coordinates;
          var new_arr = [];
          for (var j = 0; j < coord.length; j++) {
            new_arr.push([coord[j]]);
          }
          feature_data.temporalGeometry.prisms[prism_i].coordinates = new_arr;
          LOG("old data format coming..")
        }
      }
    }
    else if (!Array.isArray(feature_data.temporalGeometry.coordinates[0][0][0]) &&
    // feature_data.temporalGeometry.type == 'MovingPolygon'||feature_data.temporalGeometry.type == 'MovingPoint'||feature_data.temporalGeometry.type == 'MovingLineString') { //old mf-json format for polygon
    (feature_data.temporalGeometry.type == 'MovingPolygon' || feature_data.temporalGeometry.type == 'MovingLineString' || feature_data.temporalGeometry.type == 'MovingPointCloud')) { //old mf-json format for polygon
      var coord = feature_data.temporalGeometry.coordinates;
      var new_arr = [];
      for (var j = 0; j < coord.length; j++) {
        new_arr.push([coord[j]]);
      }
      feature_data.temporalGeometry.coordinates = new_arr;
      LOG("old data format coming..")
    }

    try {
      // LOG("translateValue")
      feature_data = this.translateValue(feature_data)
      // LOG("translateTime")
      feature_data = this.translateTime(feature_data)
      // LOG(feature_data)
      this.data[layer_id][feature_id] = JSON.parse(feature_data);
    } catch (e) {
      // throw new Stinuum.Exception("it is not json format", feature_data);
      this.data[layer_id][feature_id] = feature_data;
    }
  }
  
}


FeatureBuffer.prototype.getLayerNameList = function () {
  var list = [];
  for (var key in this.data) {
    if (this.data.hasOwnProperty(key)) {
      list.push(key);
    }
  }
  for (var key in this.fromServer) {
    if (this.fromServer.hasOwnProperty(key)) {
      list.push(key);
    }
  }
  return list;
}

FeatureBuffer.prototype.checkIfServerData = function (layer_id) {
  if (this.data.hasOwnProperty(layer_id)){
    return false
  }else if(this.fromServer.hasOwnProperty(layer_id)){
    return true
  }
}
FeatureBuffer.prototype.getServerDataCount = function (layer_id) {

  var count = 0;
  if (this.checkIfServerData(layer_id)){
    count = Object.keys(this.fromServer[layer_id]).length
  }

  return count
}

FeatureBuffer.prototype.checkServerData = function (layer_id) {
  if(this.fromServer.hasOwnProperty(layer_id)){
    return false
  }else{
    return true
  }
}
FeatureBuffer.prototype.translateValue = function (feature_data){
  // LOG("translateValue")
  var new_featrue_data = feature_data
  var new_coordinates;
  
  if(feature_data.crs != undefined){
    var crs = SRSTranslator.crsCheck(feature_data.crs);
    if (crs != undefined){
      if (new_featrue_data.type == "MovingGeometryCollection"){
        var prisms = new_featrue_data.prisms
        for(var prism_i in prisms){
          var coordinates = prisms[prism_i].coordinates
          new_coordinates = this.changeCoordinates(crs, prisms[prism_i].type, coordinates)
          new_featrue_data.prisms[prism_i].coordinates = new_coordinates
  
        }
      }else{
        var coordinates = new_featrue_data.temporalGeometry.coordinates

        new_coordinates = this.changeCoordinates(crs, new_featrue_data.temporalGeometry.type, coordinates)
        new_featrue_data.temporalGeometry.coordinates = new_coordinates
      }
    }
  }
  return new_featrue_data
}

FeatureBuffer.prototype.changeCoordinates = function(crs, type, coordinates){
  // LOG("changeCoordinates")
  LOG(crs, type,coordinates)
  
  if (type == "MovingPoint"){
    var new_coord = new Array()
    // console.log(coordinates)
    for(var i in coordinates){
      if(typeof(coordinates[i]) == "object" || typeof(coordinates[i]) == "array"){
        
        // new_coord.push(proj4(firstProjection).forward(coordinates[i]));
        new_coord.push(SRSTranslator.forward(coordinates[i], crs, "WGS84"))
        // new_coord.push(SRSTranslator.forward(coordinates[i], "WGS84", crs))
      }
    }
    return new_coord
  }else if(type == "MovingLineString"){
    var new_arr = new Array()
    for(var i in coordinates){
      if(typeof(coordinates[i]) == "object" || typeof(coordinates[i]) == "array") {
        var new_coord = new Array()
        // console.log(coordinates[i], typeof(coordinates[i]))
        for(var j in coordinates[i][0]){
          
          if(typeof(coordinates[i][0][j]) == "object" || typeof(coordinates[i][0][j]) == "array"){
            // console.log(coordinates[i][0][j])
            // new_coord.push(proj4(firstProjection).forward(coordinates[i][0][j]));
            new_coord.push(SRSTranslator.forward(coordinates[i][0][j], crs, "WGS84"))
            // new_coord.push(SRSTranslator.forward(coordinates[i][0][j], "WGS84", crs))
          }
        }
        // console.log(new_coord)
        new_arr.push([new_coord])
      }
    }
    return new_arr
  }else if(type == "MovingPolygon" || type == "MovingPointCloud"){
    var new_arr = new Array()
    for(var i in coordinates){
      if(typeof(coordinates[i]) == "object" || typeof(coordinates[i]) == "array") {
        var new_coord = new Array()
        // console.log(coordinates[i], typeof(coordinates[i]))
        for(var j in coordinates[i][0]){
          
          if(typeof(coordinates[i][0][j]) == "object" || typeof(coordinates[i][0][j]) == "array"){
            // console.log(coordinates[i][0][j])
            // new_coord.push(proj4(firstProjection).forward(coordinates[i][0][j]));
            new_coord.push(SRSTranslator.forward(coordinates[i][0][j], crs, "WGS84"))
            // new_coord.push(SRSTranslator.forward(coordinates[i][0][j], "WGS84", crs))
          }
        }
        // console.log(new_coord)
        new_arr.push([new_coord])
      }
    }
    return new_arr
  }
}

FeatureBuffer.prototype.translateTime = function(feature_data){
  // LOG("translateTime")
  var new_featrue_data = feature_data
  
  var f_type = feature_data.type
  if (feature_data.trs != undefined){
    var f_trs = this.checkTrs(feature_data.trs)
  }else{
    var f_trs = "GREGORIAN"
  }
  
  if(f_type == "MovingGeometryCollection"){
    var prisms = new_featrue_data.prisms
    for(var prism_i in prisms){
      var datetimes = prisms[prism_i].datetimes
      new_datetimes = this.changeDatetimes(f_trs, datetimes)
      new_featrue_data.prisms[prism_i].datetimes = new_datetimes

    }
  }else{
    var datetimes = new_featrue_data.temporalGeometry.datetimes

    new_datetimes = this.changeDatetimes(f_trs, datetimes)
    new_featrue_data.temporalGeometry.datetimes = new_datetimes
  }
  // LOG(Array.isArray(feature_data.temporalProperties), feature_data.temporalProperties)
  if (Array.isArray(feature_data.temporalProperties)){
    for(var property_i in feature_data.temporalProperties){
      var datetimes = feature_data.temporalProperties[property_i]['datetimes']
      new_datetimes = this.changeDatetimes(f_trs, datetimes)
      new_featrue_data.temporalProperties[property_i]['datetimes'] = new_datetimes
    }
  }
  return new_featrue_data

}


FeatureBuffer.prototype.checkTrs = function(f_trs){
  var trs_value
  // "type": "Link",
  // "properties": {
  //   "type": "OGCDEF",
  //   "href": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
  
  if((f_trs.type).toUpperCase() == "LINK"){
    var trs_href = f_trs.properties.href
    var temp_href = trs_href.split("/")
    var trs_value = temp_href[temp_href.length-1]
  }else{
    trs_value = f_trs.properties.name
  }
  // LOG(trs_value)
  return trs_value
} 

FeatureBuffer.prototype.changeDatetimes = function(trs, datetimes){
  // LOG("convertDate")
  var new_datetimes = new Array()
  if (trs.toUpperCase() == "GREGORIAN"){
    for(var i in datetimes){
      if (typeof(datetimes[i]) != "function"){
        var tempTime = new Date(datetimes[i])
        new_datetimes.push(tempTime.toISOString())
      }
    }
    // LOG(new_datetimes)
    return new_datetimes
  }else{
    for(var i in datetimes){
      if (typeof(datetimes[i]) != "function"){
        var tempTime = new Date(datetimes[i])
        
        if(datetimes[i][datetimes[i].length-1] != "Z"){
       
          var new_time =leadingZeros(tempTime.getFullYear(), 4) + '-' +
            leadingZeros(tempTime.getMonth() + 1, 2) + '-' +
            leadingZeros(tempTime.getDate(), 2) + 'T' +
            leadingZeros(tempTime.getHours(), 2) + ':' +
            leadingZeros(tempTime.getMinutes(), 2) + ':' +
            leadingZeros(tempTime.getSeconds(), 2) + '.'+leadingZeros(tempTime.getMilliseconds(), 3)+'Z';
  
            new_datetimes.push(new_time)
        }else{
          new_datetimes.push(datetimes[i])
        }
      }
    }
    // console.log(new_datetimes)
    return new_datetimes
  }

}

// FeatureBuffer.prototype.translateValue = function (feature_data){

//   var new_featrue_data = feature_data
//   var new_coordinates;
  
//   if(feature_data.crs != undefined){
//     var crs = SRSTranslator.crsCheck(feature_data.crs);
//     if (crs != undefined){
//       if (new_featrue_data.temporalGeometry.type == "MovingGeometryCollection"){
//         var prisms = new_featrue_data.temporalGeometry.prisms
//         for(var prism_i in prisms){
//           var coordinates = prisms[prism_i].coordinates
//           new_coordinates = this.changeCoordinates(crs, prisms[prism_i].type, coordinates)
//           new_featrue_data.temporalGeometry.prisms[prism_i].coordinates = new_coordinates
  
//         }
    
//       }else{
//         var coordinates = new_featrue_data.temporalGeometry.coordinates

//         new_coordinates = this.changeCoordinates(crs, new_featrue_data.temporalGeometry.type, coordinates)
//         new_featrue_data.temporalGeometry.coordinates = new_coordinates
//       }
//     }
//   }
// }

   // // var copy = JSON.parse(JSON.stringify(obj));

  // // var copy = {};
  // // for(var i in obj) {
  // //     if(typeof(obj[i])=="object" && obj[i] != null){
  // //         copy[i] = Stinuum.copyObj(obj[i]);
  // //     }else{
  // //         copy[i] = obj[i];
  // //     }
  // // }
  // if (obj === null || typeof (obj) !== 'object'){
  //     return obj;
  // }
  // var copy = obj.constructor();

  // for (var attr in obj) {
  //     if (obj.hasOwnProperty(attr)) {
  //         copy[attr] = Stinuum.copyObj(obj[attr]);
  //     }
  // }

//TODO remove
/*
FeatureBuffer.prototype.getBuffer = function(id) {
    if (id.length == 1) {
        if (this.data.hasOwnProperty(id[0])) {
            return this.data[id[0]];
        }
    } else if (id.length == 2) {
      if (this.data.hasOwnProperty(id[0])) {
          var temp = this.data[id[0]];
          if (temp.hasOwnProperty(id[1])) {
              return temp[id[1]];
          }

      }
    }
    LOG("TODO remove");
    return null;
}


FeatureBuffer.prototype.removeBuffer = function(id){
     if (id.length == 1) {
         if (getBuffer(id) !== null) {
             delete this.data[id[0]];
         }
     } else if (id.length == 2) {
         if (getBuffer(id) !== null) {
             delete this.data[id[0]][id[1]];
         }
     }
}


FeatureBuffer.prototype.updateBuffer = function(id, feature) {
  LOG("TODO remove");
  if (id.length == 1) {
    if (!this.data.hasOwnProperty(id[0])) {
      this.data[id[0]] = {};
    }
  } else if (id.length == 2) {
    if (!this.data.hasOwnProperty(id[0])) {
      this.data[id[0]] = {};
      this.data[id[0]][id[1]] = {};
      try{
        JSON.parse(feature);
        this.data[id[0]][id[1]] = JSON.parse(feature);
        console.log(this.data[id[0]][id[1]]);
      }
      catch(e) {
        this.data[id[0]][id[1]] =feature;
      }
      //this.data[id[0]][id[1]] = feature;
    } else {
      if (!this.data[id[0]].hasOwnProperty(id[1])) {
        this.data[id[0]][id[1]] = {};
        try{
          this.data[id[0]][id[1]] = JSON.parse(feature);
        }
        catch(e){
          this.data[id[0]][id[1]] = feature;
        }


      }
    }
  }
}
*/
