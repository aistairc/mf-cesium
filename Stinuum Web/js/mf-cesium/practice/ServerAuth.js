function ServerAuth() {
  this.on = false; //is Server connected?
  this.server_url;
  this.token = getCookie('XSRF-TOKEN')
  this.session_id = getCookie('SESSION')
  this.selectValue;
  this.selectData = {};

}


function getCookie(name) {
  var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value? value[2] : null;
}

ServerAuth.prototype.getFeatureID = function(layer_id, address, count){
  console.log("getFeatureID")
  var featureIDlist; 
  var data = {
    title: layer_id,
    address: address,
  }
  $.ajax({
    url: '/eachFeature',
    type: 'POST', 
    data: data,
    async: false,
    success: function(data){
      if (data.ok){
        console.log(data.data)
        featureIDlist = data.data.link
      }
      else{
        featureIDlist = []
        alert("Login Please")
        location.href = '/'
      }
      
    }
  });

  this.selectData[layer_id] = []
  for (var i in featureIDlist){
    var href = featureIDlist[i].href
    this.selectData[layer_id].push(href)
  }
  if (featureIDlist.length > 1){
    return (featureIDlist).splice(0, count);
  }else if (featureIDlist.length != 0){
    return featureIDlist;
  }else{

  }
}
ServerAuth.prototype.uploadServerData = function(layer_id, feature_id){
  console.log("uploadServerData")
  buffer.createLayer(layer_id, true)
  // if(this.token == undefined || this.session_id == undefined){
  //   alert("Login Please")
  //   location.href = '/'
  // }
  for(var i in feature_id){
    console.log(feature_id)
    if(feature_id[i].href != undefined){
      var feature_data
      var data = {
        type: -1,
        address: feature_id[i].href,
        // token: this.token,
        // session_id: this.session_id,
      }
      $.ajax({
        url: '/eachFeature',
        type: 'POST', 
        data: data,
        async: false,
        success: function(data){
          if (data.ok){
            feature_data = data.data
          }else{
            alert("Login Please")
            location.href = '/'
          }
          // console.log(feature_data)
        }
      });
      LOG(feature_data)
      // if(new Date(feature_data.time[0]).getTime() != new Date(feature_data.time[1]).getTime()){
      //   buffer.setBuffer_feature(layer_id, feature_data.id, feature_data)  
      // }   
      buffer.setBuffer_feature(layer_id, feature_data.id, feature_data)  
    }
  }
  var list = list_maker.getLayerDivList(); //printFeatureLayerList_local(layer_list_local);
  var list_div = div_id.left_upper_list;
  var printArea = document.getElementById(list_div);
  printArea.innerHTML = "";
  printArea.appendChild(list);
}

ServerAuth.prototype.uploadServerData2 = function(layer_id, feature_href){
  // buffer.createLayer(layer_id, true)
  console.log("uploadServerData2")
  // if(this.token == undefined || this.session_id == undefined){
  //   alert("Login Please")
  //   location.href = '/'
  // }
  for(var i in feature_href){
   
    if (typeof(feature_href[i]) == "string"){
      var feature_data
      var data = {
        type: -1,
        address: feature_href[i],
        token: this.token,
        session_id: this.session_id
      }
      $.ajax({
        url: '/eachFeature',
        type: 'POST', 
        data: data,
        async: false,
        success: function(data){
          if (data.ok){
            feature_data = data.data
          }else{
            alert("Login Please")
            location.href = '/'
          }
        
        }
      });
      // if(new Date(feature_data.time[0]).getTime() != new Date(feature_data.time[1]).getTime()){
      //   buffer.setBuffer_feature(layer_id, feature_data.id, feature_data)  
      // }   
      buffer.setBuffer_feature(layer_id, feature_data.id, feature_data)  
    }
  }
  var list = list_maker.getLayerDivList(); //printFeatureLayerList_local(layer_list_local);
  var list_div = div_id.left_upper_list;
  var printArea = document.getElementById(list_div);
  printArea.innerHTML = "";
  printArea.appendChild(list);
}


ServerAuth.prototype.getServerDataList = function(titleNames){
  this.turnOnLoading();
  this.on = true
  // this.selectValue.names[0] = '20200106'
  // console.log("id Value")
  // console.log(this.selectValue.names)
  var sampleCount = this.selectValue.count;
  var address = this.selectValue.address;
  if(titleNames.length != 0 ){
    console.log(buffer.fromServer)
    for(var name_i in titleNames){
      
      if (name_i !== "contains"){
        if(buffer.checkServerData(titleNames[name_i])){
          
          var featureID = this.getFeatureID(titleNames[name_i], address, sampleCount[name_i])
          console.log(featureID)
          if (featureID.length != 0){
            this.uploadServerData(titleNames[name_i], featureID, address)
          }
        }
      }
    }
    this.turnOffLoading();
    changeMenuMode(MENU_STATE.layers);
    // sessionStorage.clear()
  }else{
    return -1;
  }
 
}
ServerAuth.prototype.start = function () {
  // alert(getCookie("LoginChecker"))
  /**
   * 1. FeatureCollection - title - name
   * 2. features title - name
   */
  console.log("start")
  if (sessionStorage.length != 0){
    document.getElementById('drop_zone').style.visibility = 'hidden';
    document.getElementById('drop_zone_bg').style.visibility = 'hidden';
   
    this.selectValue = JSON.parse(sessionStorage.getItem("foo"));
    var titleNames = this.selectValue.names;
   
    // console.log(this.token, this.session_id)
    // if(this.token == undefined || this.session_id == undefined){
    //   alert("Login Please")
    //   location.href = '/'
    // }
    // else{
    showSelectItemsDialog('server', titleNames)
    // }
  }else{
    return -1;
  }
  // this.getTemporalGeometry("20190614","20190614-0000000001")
  // this.getTemporalGeometry(this.selectValue.names[0],"20191206-0000092621")
  // this.getTemporalProperties(this.selectValue.names[0],"20191206-0000092621")
}
ServerAuth.prototype.getNameIndex = function(layer_id){
  var index = this.selectValue.names.indexOf(layer_id)
  return index
}
ServerAuth.prototype.makeOneFeature = function(layer_id, feature_id, feature_time){
  console.log("makeOneFeature")
  // if(this.token == undefined || this.session_id == undefined){
  //   alert("Login Please")
  //   location.href = '/'
  // }
  this.turnOnLoading();
  var tempObj = new Object()
  
  tempObj.geometry = null
  tempObj.properties = {
    name: feature_id
  }
  var time
  if(new Date(feature_time[0]).getTime() === new Date(feature_time[1]).getTime()){
    
    time = feature_time[0]
    
  }else{
    time = feature_time
    
  } 

  var temporalGeometry = this.getTemporalGeometry(layer_id, feature_id, time)
  var temporalProperties = this.getTemporalProperties(layer_id, feature_id, time)

  if (temporalGeometry[0].type !== undefined){

    tempObj.temporalGeometry = this.checkData(temporalGeometry[0])
  }
  console.log(temporalProperties.temporalProperties[0])
  if (temporalProperties.temporalProperties.length !== 0 && temporalProperties.temporalProperties[0].datetimes !== undefined){
    tempObj.temporalProperties = temporalProperties.temporalProperties
  }
  console.log(tempObj)
  this.turnOffLoading();
  return tempObj
}

ServerAuth.prototype.getTemporalGeometry = function (layer_id, feature_id, feature_time){
  // https://dpsdev.aaic.hpcc.jp/mf/collections/20190614/mfeatures/featureKeys
  // var index = this.getNameIndex(layer_id);
  console.log("getTemporalGeometry")
  var temporalGeometryAddress = this.selectValue.address+"/"+layer_id+"/mfeatures/"+feature_id+"/temporalGeometry";

  var temporalGeometry;
  var data = {
    type: 0,
    // token: this.token,
    // session_id: this.session_id,
    address: temporalGeometryAddress,
    time: feature_time,
    limit: 1000
  }
  LOG(data)

  $.ajax({
    url: '/eachFeature',
    type: 'POST',
    data:  data,
    async: false, 
    traditional: true,       
    success: function(data){
    
      if (data.ok){
        console.log(data.data)
        temporalGeometry = data.data
      }else{
        temporalGeometry = {}
        alert("Login Please")
        location.href = '/'
        
      }
    },
    error: function(err){
      console.log(err)  
    }
    
  });
  console.log(temporalGeometry)
  return temporalGeometry
}

ServerAuth.prototype.getTemporalProperties = function (layer_id, feature_id, feature_time){
  var index = this.getNameIndex(layer_id);
  var temporalPropertiesAddress = this.selectValue.address+"/"+layer_id+"/mfeatures/"+feature_id+"/temporalProperties";
  var temporalProperties;
  var data = {
    type: 1,
    address: temporalPropertiesAddress,
    name: feature_id,
    time: feature_time,
    limit: 1000
  }
  $.ajax({
    url: '/eachFeature',
    type: 'POST',
    data:  data,
    traditional: true,  
    async: false,           
    success: function(data){
      if(data.ok){
        // console.log(data.data)
        temporalProperties = data.data
      }else{
        // console.log(data.data)
        temporalProperties = []        
      
      }
    },error: function(err){
      console.log(err)  
    }
  });
  console.log(temporalProperties)
  return temporalProperties
}

ServerAuth.prototype.turnOnLoading = function (layer_id = 'layers') {
  document.getElementById(div_id.server_state).style.visibility = 'visible';

  var middle = document.createElement('div');
  middle.style = "display: table-cell;    vertical-align: middle;";

  var text = document.createElement('div');
  text.innerText = 'Loading ' + layer_id.toString() + ' ...';
  text.style = "width: 100%; font-size:50px; margin-bottom : 10px;";

  middle.appendChild(text);

  var icon = document.createElement('i');
  icon.className = "fa fa-spinner fa-spin";
  icon.style = "margin-left: auto; margin-right: auto; font-size:50px";
  middle.appendChild(icon);
  document.getElementById(div_id.server_state).appendChild(middle);
}


ServerAuth.prototype.turnOffLoading = function () {
  document.getElementById(div_id.server_state).style.visibility = 'hidden';
  document.getElementById(div_id.server_state).innerHTML = '';
}
ServerAuth.prototype.checkData = function(feature_data){
  if (feature_data.type == 'MovingGeometryCollection'){
    for (var prism_i = 0; prism_i < feature_data.prisms.length; prism_i++){
      var eachFeature = feature_data.prisms[prism_i];

      if (!Array.isArray(eachFeature.coordinates[0][0][0]) &&  (eachFeature.type == 'MovingPolygon' || eachFeature.type == 'MovingLineString' || eachFeature.type == 'MovingPointCloud')) { //old mf-json format for polygon
        var coord = eachFeature.coordinates;
        var new_arr = [];
        for (var j = 0; j < coord.length; j++) {
          new_arr.push([coord[j]]);
        }
        feature_data.prisms[prism_i].coordinates = new_arr;
        LOG("old data format coming..")
      }
    }
  }
  else if (!Array.isArray(feature_data.coordinates[0][0][0]) &&
  // feature_data.type == 'MovingPolygon'||feature_data.type == 'MovingPoint'||feature_data.type == 'MovingLineString') { //old mf-json format for polygon
  (feature_data.type == 'MovingPolygon' || feature_data.type == 'MovingLineString' || feature_data.type == 'MovingPointCloud')) { //old mf-json format for polygon
    var coord = feature_data.coordinates;
    var new_arr = [];
    LOG("eachFeature test")
    for (var j = 0; j < coord.length; j++) {
      new_arr.push([coord[j]]);
    }
    feature_data.coordinates = new_arr;
    LOG("old data format coming..")
  }

  return feature_data
}