
function changeMode(){
  mfoc.reset();
  drawFeature();
  drawMoving();
}

function putProperties(id, name) {
    var obj = searchPropertyInfo(id, name);
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
    if (properties.length !== 0) {
        if (prop_info.name == properties[0].name) {
            if (properties.contains(prop_info)) {
                delProperties(id, name);
            } else {
                putProperties(id, name);
            }
        } else {
            $('input:checkbox[name="' + properties[0].name + '"]').each(function() {
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
    mfoc.showProperty(properties, "graph");
}


function searchPropertyInfo(id, name) { //
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

function printFeatureLayerList(arr, url, id) { //출력할피쳐리스트, 베이스주소, 출력할화면요소아이디
    var target = document.getElementsByClassName("vertical");
    var upper_ul = document.getElementsByName('featureLayer');
    upper_ul.style = "overflow-y : scroll;";
    console.log(upper_ul);
    for(var i = 0 ; i < arr.length ; i++){
      var li  = document.createElement('li');
      var a  = document.createElement('a');
      var ul  = document.createElement('ul');

      var new_url = url + "/" + arr[i] + "/$ref";

      ul.id = arr[i];
      a.innerText = arr[i];
      a.onclick = (function(url, id) {
          return function() {
              getFeatures(url, id);
          };
      })(new_url, arr[i]);

      li.appendChild(a);
      li.appendChild(ul);

      upper_ul[0].appendChild(li);
    }

}
var feature = new Array();
var checked_list = [];
var url_list = [];

function printFeatures(layerID, features_list, id) { //피쳐레이어아이디,
    var target = document.getElementById(layerID);
    for(var i = 0 ; i < features_list.length ; i++){
      var li = document.createElement("li");
      var a = document.createElement("a");
      var ul = document.createElement("ul");
      var chk = document.createElement("input");

      a.innerText = features_list[i];
      a.onclick = (function(layerid, featureid) {
          return function() {
              getFeature(layerid, featureid);
          };
      })(layerID, features_list[i]);
      ul.id = features_list[i];
      chk.type = "checkbox";
      chk.checked = "true";
      chk.name = 'chkf[]';
      chk.id = features_list[i]+"_"+layerID;
      chk.onclick = (function() {
          return function() {
              drawFeature();
          }
      })();

      li.appendChild(a);
      li.appendChild(chk);
      li.appendChild(ul);
      target.appendChild(li);

    }

    var but = document.createElement("button");
    but.onclick = (function() {
        return function() {
            drawMoving();
        }
    })();

    drawFeature();
    drawMoving();
}

function printFeature(featureID, data, id) {

    var target = document.getElementById(featureID);
    if(!features.contains(data)){
      features.push(data);
      var name = data.features[0].properties.name;
      var temporalProperties = data.features[0].temporalProperties;
      var li = document.createElement("li");
      var a = document.createElement("a");
      var ul = document.createElement("ul");

      ul.id = name;
      a.innerText = name;

      for (var i = 0; i < temporalProperties.length; i++) {
        var li_temp = document.createElement("li");
        var a_temp = document.createElement("a");
        var ul_temp = document.createElement("ul");
        var div_temp = document.createElement("div");
        var chk_temp = document.createElement("input");

        a_temp.innerText = temporalProperties[i].name;
        chk_temp.id = name + "_" + temporalProperties[i].name;
        chk_temp.name = temporalProperties[i].name;
        chk_temp.type = "checkbox";
        chk_temp.onclick = (function(id) {
            var getid = id.split("_");
            return function() {
                updateProperties(getid[0], getid[1]);
            };
        })(chk_temp.id);

        div_temp.appendChild(a_temp);
        div_temp.appendChild(chk_temp);
        //li_temp.appendChild(a_temp);
        //li_temp.appendChild(chk_temp);
        li_temp.appendChild(div_temp);
        ul.appendChild(li_temp);
      }
      li.appendChild(a);
      li.appendChild(ul);
      target.appendChild(li);

    }

}

function getCheckedFeatures() {
    var features_data = [];
    var checked = document.getElementsByName("chkf[]");
    for(var i = 0 ; i < checked.length ; i++){
      if(checked[i].checked == true){
        var temp = checked[i].id;
        temp = temp.split("_");
        var feature_layer = temp[1];
        var feature_name = temp[0];
        features_data.push(getBuffer([feature_layer, feature_name]));
      }
    }
    return features_data;
}

function drawFeature() { //아이디로 찾을까

    var geometryInstances = getCheckedFeatures();
    console.log(geometryInstances);
    if(geometryInstances.length !== 0){
      var temp = geometryInstances[0];
      var t_features = [];

      for (var i = 0; i < geometryInstances.length; i++) {
          var json = geometryInstances[i];
          mfoc.add(json.features[0]);

      }
      mfoc.drawPaths();
    }
}

function drawMoving() {

    geometryInstances = getCheckedFeatures();
    if(geometryInstances.length !== 0){
      var t_features = [];
      for (var i = 0; i < geometryInstances.length; i++) {
          var json = geometryInstances[i];
          mfoc.add(json.features[0]);
      }
      mfoc.animate();
    }

}
