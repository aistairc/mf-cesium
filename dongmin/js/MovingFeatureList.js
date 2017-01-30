//MovingFeatureList.prototype.getById(id){}
MovingFeatureList.prototype.requestFeatureList = function(feature_url){
  var url = getParameterByName('url');
  var mfl =this;
  showLoading();
  return $.getJSON(url +'/'+feature_url , function(data){

    if (data.features == undefined){
      for (var i = 0 ; i < data.length ; i++){
        var obj = MovingFeature.getNewFeature(data[i].temporalGeometry);
        obj.viewer = viewer;
        if (data[i].id == undefined){
          obj.id = 'mf' + Object.keys(mfl.list).length;//mfl.list.length;
        }

        mergeObject(obj, data[i]);
        //mfl.list.push(obj);
        mfl.list[obj.id] = obj;
        mfl.name_list.push({'name' : data[i].properties.name, 'id' : obj.id});
      }
    }
    else{
      mfl.name = data.name;
      for (var i = 0 ; i < data.features.length ; i++){
        var obj = MovingFeature.getNewFeature(data.features[i].temporalGeometry);
        obj.viewer = viewer;

        if (data.features[i].id == undefined){
          obj.id = 'mf' + Object.keys(mfl.list).length;
        }

        mergeObject(obj, data.features[i]);
        mfl.list[obj.id] = obj;

        //mfl.list.push(obj);
        mfl.name_list.push({'name' : data.features[i].properties.name, 'id' : obj.id});

      }
    }

    showListTable();
  });
}

MovingFeatureList.prototype.loadFeaturesInLocalJSONFile = function(path){
  var mfl = this;
  showLoading();
  return $.getJSON(path, function(data){

    if (data.features == undefined){
      for (var i = 0 ; i < data.length ; i++){
        var obj = MovingFeature.getNewFeature(data[i].temporalGeometry);
        obj.viewer = viewer;
        if (data[i].id == undefined){
          obj.id = 'mf' + Object.keys(mfl.list).length;//mfl.list.length;
        }

        mergeObject(obj, data[i]);
        //mfl.list.push(obj);
        mfl.list[obj.id] = obj;
        mfl.name_list.push({'name' : data[i].properties.name, 'id' : obj.id});
      }
    }
    else{
      mfl.name = data.name;
      for (var i = 0 ; i < data.features.length ; i++){
        var obj = MovingFeature.getNewFeature(data.features[i].temporalGeometry);
        obj.viewer = viewer;

        if (data.features[i].id == undefined){
          obj.id = 'mf' + Object.keys(mfl.list).length;
        }

        mergeObject(obj, data.features[i]);
        mfl.list[obj.id] = obj;

        //mfl.list.push(obj);
        mfl.name_list.push({'name' : data.features[i].properties.name, 'id' : obj.id});

      }
    }

    showListTable();
  });

}

MovingFeatureList.prototype.getAllNameList = function(){
  if (this.name_list.length == 0){
    //Request Server
  }
  else{
    return this.name_list;
  }

}

MovingFeatureList.prototype.getGeometryListByIdArray = function(id_arr){
  var geos = [];
  for (var i = 0 ; i < id_arr.length ; i++){
    geos.push(this.getTemporalGeometryById(id_arr[i]));
  }
  return geos;
}

MovingFeatureList.prototype.getById = function(id){

  if (typeof this.list[id] != 'undefined')
    return this.list[id];
  //Request Server
  return 0;

}

MovingFeatureList.prototype.getTemporalGeometryById = function(id){
/*  for (var i = 0 ; i < this.list.length ; i++){
    if (this.list[i].id == id){
      return this.list[i].temporalGeometry;
    }
  }
  */
  if (typeof this.list[id] != 'undefined'){
    return this.list[id].temporalGeometry;
  }
  //Request Server
  return 0;

}


MovingFeatureList.prototype.animateMoving = function(id_arr, with_height){

  var type = null;
  for (var i = 0 ; i < id_arr.length ; i++){//check same type.
    var geometry = this.getTemporalGeometryById(id_arr[i]);

    if (type == null){
      type = geometry.type;
    }
    else if(type == geometry.type){
      continue;
    }
    else{
      type = 'different_type';
      return type;
    }
  }

  if (with_height){
    for (var i = 0 ; i < id_arr.length ; i++){
      this.getById(id_arr[i]).visualizePath3D();
    }
  }

  var first_data = this.getById(id_arr[0]);

  first_data.animateWithArray(this, id_arr, with_height);

  return type;
}
