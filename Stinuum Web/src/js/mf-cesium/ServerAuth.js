function ServerAuth() {
  this.on = false; //is Server connected?
  this.selectValue = {};
  this.selectData = {};
  this.ServerURL = ""
}


ServerAuth.prototype.setServerURL = function (serverURL){
  this.ServerURL = serverURL
}

ServerAuth.prototype.getFeatureID = function(layer_id, address, count){
  console.log("getFeatureID", address, layer_id, count)
  var featureIDlist; 
  var data = {
    title: layer_id,
    address: address,
    limit: count
  };
  $.ajax({
    url: '/eachFeature',
    type: 'POST', 
    data: data,
    async: false,
    success: function(data){
      if (data.ok){
        featureIDlist = data.data;
      }
      else{
        featureIDlist = [];
        window.alert("Login Please");
        location.href = '/';
      }
      
    }
  });
  let nextHref = ""
  if (featureIDlist.links.length > 1){
    nextHref = featureIDlist.links[1].href;
  }else{
    nextHref = "false"
  }
  this.selectData[layer_id] = {
    "next": nextHref,
    "numberMatched": featureIDlist.numberMatched,
    "numberReturned": featureIDlist.numberReturned
  };
  console.log(featureIDlist);
  return featureIDlist.features;
  // if (featureIDlist.features.length > 1){
  //   return (featureIDlist.features).splice(0, count);
  // }else if (featureIDlist.features.length != 0){
  //   return featureIDlist.features;
  // }else{
  //
  // }
}
ServerAuth.prototype.uploadServerData = function(layer_id, feature_id){
  console.log("uploadServerData", feature_id);
  buffer.createLayer(layer_id, true);
  // if(this.token == undefined || this.session_id == undefined){
  //   alert("Login Please")
  //   location.href = '/'
  // }
  for(var i in feature_id){
    // console.log(i, feature_id.features[i].id)
    if(feature_id[i].id !== undefined){
      var feature_data;
      var data = {
        type: -1,
        // address: feature_id[i].href,
        address: this.ServerURL+"/collections/"+layer_id+"/items/"+feature_id[i].id
        // token: this.token,
        // session_id: this.session_id,
      }
      console.log(data);
      $.ajax({
        url: '/eachFeature',
        type: 'POST', 
        data: data,
        async: false,
        success: function(data){
          if (data.ok){

            feature_data = data.data;
            console.log(data.data);
          }else{
            alert("Login Please");
            location.href = '/';
          }
          // console.log(feature_data)
        }
      });
      console.log("hererere", layer_id, feature_data.id, feature_data)
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

ServerAuth.prototype.uploadServerData2 = function(layer_id){
  // buffer.createLayer(layer_id, true)
  console.log("uploadServerData2")
  let nextHref = this.selectData[layer_id].next;
  if (nextHref !== "false"){

    var feature_data;
    var data = {
      type: -1,
      address: nextHref,
    };
    $.ajax({
      url: '/eachFeature',
      type: 'POST',
      data: data,
      async: false,
      success: function(data){
        if (data.ok){
          feature_data = data.data;
        }else{
          alert("Login Please");
          location.href = '/';
        }
      }
    });
    console.log(feature_data);

    this.selectData[layer_id].numberReturned = feature_data.numberReturned;
    this.selectData[layer_id].numberLoaded += feature_data.numberReturned;
    if (this.selectData[layer_id].numberLoaded === this.selectData[layer_id].numberMatched){
      this.selectData[layer_id].next = "false";
    }
    else{
      if (feature_data.links.length > 1){
        this.selectData[layer_id].next = feature_data.links[1].href;
      }else{
        this.selectData[layer_id].next = "false";
      }
    }

    if (feature_data.features !== undefined){
      for (let each_feature of feature_data.features){
        buffer.setBuffer_feature(layer_id, each_feature.id, each_feature);
      }
    }
    var list = list_maker.getLayerDivList(); //printFeatureLayerList_local(layer_list_local);
    var list_div = div_id.left_upper_list;
    var printArea = document.getElementById(list_div);
    printArea.innerHTML = "";
    printArea.appendChild(list);
  }

  // for(var i in feature_href){
  //
  //   if (typeof(feature_href[i]) == "string"){
  //     var feature_data
  //     var data = {
  //       type: -1,
  //       address: feature_href[i],
  //     }
  //     $.ajax({
  //       url: '/eachFeature',
  //       type: 'POST',
  //       data: data,
  //       async: false,
  //       success: function(data){
  //         if (data.ok){
  //           feature_data = data.data
  //         }else{
  //           alert("Login Please")
  //           location.href = '/'
  //         }
  //       }
  //     });
  //     // if(new Date(feature_data.time[0]).getTime() != new Date(feature_data.time[1]).getTime()){
  //     //   buffer.setBuffer_feature(layer_id, feature_data.id, feature_data)
  //     // }
  //     buffer.setBuffer_feature(layer_id, feature_data.id, feature_data)
  //   }
  // }
  // var list = list_maker.getLayerDivList(); //printFeatureLayerList_local(layer_list_local);
  // var list_div = div_id.left_upper_list;
  // var printArea = document.getElementById(list_div);
  // printArea.innerHTML = "";
  // printArea.appendChild(list);
}


ServerAuth.prototype.getServerDataList = function(titleNames){
  console.log("getServerDataList")
  this.turnOnLoading();
  this.on = true
  // this.selectValue.names[0] = '20200106'
  // console.log("id Value")
  // console.log(this.selectValue.names)
  let sampleCount = this.selectValue.count;
  let address = this.selectValue.address;
  if(titleNames.length !== 0 ){
    console.log(buffer.fromServer)
    for(var name_i in titleNames){
      
      if (name_i !== "contains"){
        if(buffer.checkServerData(titleNames[name_i])){
          
          let featureID = this.getFeatureID(titleNames[name_i], address, sampleCount[name_i])
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
    let id_list = Array();
    let bbox_list = Array();
    let time_list = Array();
    let count_list = Array();
    for (let eachValue of JSON.parse(sessionStorage.getItem("foo"))){
      id_list.push(eachValue.mfc_id)
      bbox_list.push(eachValue.mfc_bbox)
      time_list.push(eachValue.mfc_time)
      count_list.push(parseInt(eachValue.mfc_limit))
    }
    this.selectValue = {}
    this.selectValue.address = this.ServerURL+"/collections"
    this.selectValue.names = id_list
    this.selectValue.bbox = bbox_list
    this.selectValue.time = time_list
    this.selectValue.count = count_list
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

  let temporalGeometry = this.getTemporalGeometry(layer_id, feature_id, time)
  let temporalProperties = this.getTemporalProperties(layer_id, feature_id, time)
  console.log(temporalGeometry)
  if (temporalGeometry.type !== undefined){

    tempObj.temporalGeometry = this.checkData(temporalGeometry)
  }
  console.log(temporalProperties)
  // console.log(temporalProperties.temporalProperties[0])
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
  let temporalGeometryAddress = this.selectValue.address+"/"+layer_id+"/items/"+feature_id+"/tGeometries";

  let temporalGeometry;
  let data = {
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
  var temporalPropertiesAddress = this.selectValue.address+"/"+layer_id+"/items/"+feature_id+"/tProperties";
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
  console.log("get properties", temporalProperties)
  let tPropertiesWithValue = this.getEachTemporalProperty(temporalProperties.temporalProperties, temporalPropertiesAddress)
  console.log(tPropertiesWithValue)
  return tPropertiesWithValue
}

ServerAuth.prototype.getEachTemporalProperty = function (tProperties, address){
  let tPropertiesWithValue = {temporalProperties: []}
  var data = {
    type: 1,
    address: "",
    limit: 1000
  }
  for (let tProperty of tProperties){
    let tempValue = {
      datetimes: []
    }
    tempValue[tProperty.name] = {type: tProperty.type}
    if (tProperty.form !== undefined){
      tempValue[tProperty.name].form = tProperty.form;
    }
    data.address = address + "/" + tProperty.name;
    $.ajax({
      url: '/eachFeature',
      type: 'POST',
      data:  data,
      traditional: true,
      async: false,
      success: function(data){
        if(data.ok){
          // console.log(data.data)
          tempValue.datetimes = data.data.temporalProperties[0].datetimes;
          tempValue[tProperty.name].values = data.data.temporalProperties[0].values;
          tempValue[tProperty.name].interpolation = data.data.temporalProperties[0].interpolation;
        }
      },error: function(err){
        console.log(err)
      }
    });
    tempValue.datetimes = this.reformattingTime(tempValue.datetimes)
    tPropertiesWithValue.temporalProperties.push(tempValue);
  }
  return tPropertiesWithValue
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

ServerAuth.prototype.reformattingTime = function (tempDatetimes) {
  console.log(typeof tempDatetimes, tempDatetimes);

  console.log("hi");
  let newDatetimes = [];
  for(let eachTime of tempDatetimes){
    if (eachTime.match(/\+/g)?.length === 1){
      let CheckisoDateString = eachTime.length - (eachTime.lastIndexOf("+") + 1);
      if (CheckisoDateString === 3){
        let formattedDateString = eachTime.replace(/(\d{1})(\d{1})Z$/, '$1$2:00');
        console.log(formattedDateString);
        newDatetimes.push(formattedDateString);
      }else{
        newDatetimes.push(eachTime);
      }
    }
    else if (eachTime.match(/\-/g)?.length === 3){
      let CheckisoDateString = eachTime.length - (eachTime.lastIndexOf("-") + 1);
      if (CheckisoDateString === 3){
        let formattedDateString = eachTime.replace(/(\d{1})(\d{1})Z$/, '$1$2:00');
        console.log(formattedDateString);
        newDatetimes.push(formattedDateString);
      }else{
        newDatetimes.push(eachTime);
      }
    }else{
      newDatetimes.push(eachTime);
    }
  }
  return newDatetimes;


  // let newDatetimes = [];
  // for(let eachTime of tempDatetimes){
  //   let sliceIndex = eachTime.lastIndexOf("-")
  //   let utmCheckSize = eachTime.length - sliceIndex;
  //   if (utmCheckSize === 4){
  //     let newDateTime = eachTime.slice(0, sliceIndex+1)
  //     let utmAreaInfo = eachTime.slice(sliceIndex + 1, eachTime.indexOf("Z"))
  //     newDateTime += utmAreaInfo + ":00"
  //     newDatetimes.push(newDateTime)
  //   }
  // }
  // return newDatetimes
}


ServerAuth.prototype.checkData = function(feature_data){
  if (feature_data.type == 'MovingGeometryCollection'){
    for (var prism_i = 0; prism_i < feature_data.prisms.length; prism_i++){
      var eachFeature = feature_data.prisms[prism_i];
      feature_data.prisms[prism_i].datetimes = this.reformattingTime(eachFeature.datetimes);
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
    feature_data.datetimes = this.reformattingTime(feature_data.datetimes);
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