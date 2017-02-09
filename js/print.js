function putProperties(id, name) {
    var obj = searchPropertyInfo(id, name);
    //obj = JSON.parse(obj);
    console.log(obj);
    if (obj !== null) {
        var isExistPro = false;
        if (properties.length != 0) {
            if (properties[0].name == obj.name) {
                isExistPro = true;
                if (!properties.contains(obj)) {
                    properties.push(obj);
                }
            }
            if (isExistPro == false) {
                properties = [];
                properties.push(obj);
            }
        } else {
            console.log(obj);
            properties.push(obj);
        }
    }
}

function delProperties(id, name) {
    var obj = searchPropertyInfo(id, name);
    if (properties.contains(obj)) {
        var index = properties.indexOf(obj);
        properties.splice(index, 1);
    }
}

function updateProperties(id, name) {
    var elem = document.getElementById(id + "_" + name);
    var prop_info = searchPropertyInfo(id, name);
    //comnpare prop_info with already_selected prop at properties
    if (properties.length !== 0) {
        if (prop_info.name == properties[0].name) {
            if (properties.contains(prop_info)) {
                delProperties(id, name);
            } else {
                putProperties(id, name);
            }
        } else {
            $('input:checkbox[name="' + properties[0].name + '"]').each(function() {
                //this.checked = true; //checked 처리
                if (this.checked) { //checked 처리된 항목의 값
                    this.checked = false;
                }
            });
            properties = [];
            putProperties(id, name);
        }
    } else {
        putProperties(id, name);
    }
    showProperty(properties, "graph");
}

function searchPropertyInfo(id, name) {
    for (var i = 0; i < features.length; i++) {
        if (features[i].features[0].properties.name == id) {
            var temporalProperties = features[i].features[0].temporalProperties;
            for (var j = 0; j < temporalProperties.length; j++) {
                if (temporalProperties[j].name == name) {
                    return temporalProperties[j];
                }
            }
        }
    }
    return NULL;
}
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

function printFeature(data, id) {
    var div = document.createElement("div");
    var json = JSON.parse(data);
    features.push(json);
    var name = json.features[0].properties.name;
    var temporalProperties = json.features[0].temporalProperties;

    div.innerText = name;
    var target = document.getElementById("feature");
    target.appendChild(div);
    for (var i = 0; i < temporalProperties.length; i++) {
        var temp_div = document.createElement("div");
        temp_div.innerText = temporalProperties[i].name;
        target.appendChild(temp_div);

        var chk = document.createElement("input");
        chk.id = name + "_" + temporalProperties[i].name;
        chk.name = temporalProperties[i].name;
        //chk.name = temporalProperties[i].name;
        chk.type = "checkbox";

        chk.onclick = (function(id) {
            var getid = id.split("_");

            //var checked = $("input:checkbox[id='"+id+"']").is(':checked');
            return function() {
                //console.log(checked);
                updateProperties(getid[0], getid[1]);
            };
        })(chk.id);
        target.appendChild(chk);
    }
}



function printFeatureLayerList(arr, url, id) {
    //label_list += "<form name = 'featureLayers'>";
    for (var i = 0; i < arr.length; i++) {
        var parameter = arr[i];
        var div = document.createElement("div");
        var new_url = url + "/" + parameter + "/$ref";
        div.id = arr[i];
        div.innerText = arr[i];
        div.name = "Layer";
        div.onclick = (function(url, p, id) {
            return function() {
                getFeatures(url, p, id);
            };
        })(new_url, parameter, div.id);

        var target = document.getElementById("featureLayers");
        target.appendChild(div);
        var chk = document.createElement("input");
        target = document.getElementById("featureLayers");
        target.appendChild(div);
    }
}
var feature = new Array();
var checked_list = [];
var url_list = [];

function getCheckedFeatures(id, name, url){
    return new Promise(function(resolved, rejected) {
      $('input:checkbox[name="' + name + '"]').each(function() {
          if (this.checked) {
              var feature_layer = this.id;
              feature_layer = feature_layer.split("_");
              feature_layer = feature_layer[1];
              var new_url = url + feature_layer;
              new_url += getToken(url);
              url_list.push(new_url);
          }
      });
      var geometryInstances = new Array();
      for (var l = 0; l < url_list.length; l++) {
          var promise = request3(url_list[l]);
          promise.then(function(feature_data) {
              feature_data = JSON.parse(feature_data);
              for (var i = 0; i < feature_data.features.length; i++) {
                  geometryInstances.push(feature_data.features[i]);
              }

          }).catch(function(error) {
              console.log(error);
          });
      }
      resolved(geometryInstances);
    }
}
function drawFeature(id, name, url) {
    var geometryInstances = new Array();
    var promise = getCheckedFeatures(id, name, url);
      promise.then(function(feature_data){
      geometryInstances = feature_data;
      var type = geometryInstances[0].features[0].temporalGeometry.type;
      var print;
      var hight_option;

      if(scene.mode == Cesium.SceneMode.COLUMBUS_VIEW){
        hight_option = true;
      }
      else{
        hight_option = false;
      }

      if(type == "MovingPoint"){
        print = drawPoints(geometryInstances,hight_option);
      }
      else if(type == "MovingPolygon"){
        print = drawLines(geometryInstances,hight_option);
      }
      else if(type == "MovingLine"){
        print = drawPolygons(geometryInstances, hight_option);
      }
      //all clear
      viewer.scene.primitives.add(print);
    }).catch(function(error){
      console.log(error);
    });



}
function drawMoving(id, name, url){
  var geometryInstances = new Array();
  var promise = getCheckedFeatures(id, name, url);
    promise.then(function(feature_data){
    geometryInstances = feature_data;
    var type = geometryInstances[0].features[0].temporalGeometry.type;
    var print;
    var hight_option;

    if(scene.mode == Cesium.SceneMode.COLUMBUS_VIEW){
      hight_option = true;
    }
    else{
      hight_option = false;
    }

    if(type == "MovingPoint"){
      //print = drawPoints(geometryInstances,hight_option);
    }
    else if(type == "MovingPolygon"){
      //print = drawLines(geometryInstances,hight_option);
    }
    else if(type == "MovingLine"){
      //print = drawPolygons(geometryInstances, hight_option);
    }
    //all clear
    viewer.scene.primitives.add(print);
  }).catch(function(error){
    console.log(error);
  });
}
function printFeatures(layerID, arr, url, id) {

    var label_list;
    for (var i = 0; i < arr.length; i++) {
        var parameter = arr[i];
        var div = document.createElement("div");
        div.id = arr[i];
        div.innerText = arr[i];
        var chk = document.createElement("input");
        chk.type = "checkbox";
        chk.checked = "true";
        chk.name = layerID;
        chk.id = layerID + "_" + arr[i];
        var new_url = url + "/" + arr[i];
        chk.onclick = (function(d_id, name, b_url) {
            return function() {
                drawFeature(d_id, name, b_url);
            }
        })(div.id, chk.name, url);

        div.onclick = (function(url) {
            return function() {
                getFeature(url);
            };
        })(new_url);

        var target = document.getElementById("features");
        target.appendChild(div);
        target.appendChild(chk);

    }
}
