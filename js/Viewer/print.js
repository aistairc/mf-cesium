var isMoving = false;
var property_name;
var features = new Array();
var checked_list = [];
var url_list = [];
var default_set = false;

var his_featurelayer;
var his_features;
var his_feature;
var his_temporalproperty;
var printMenuState = "layer";

function backButton(){
  var printArea = document.getElementById('featureLayer');
  var printProperty = document.getElementById('property');
  var printGraph = document.getElementById('graph');
  if(printMenuState == "layer"){}
  else if(printMenuState == "features"){
    printMenuState = 'layer';
    printArea.innerHTML = "";
    printArea.appendChild(his_featurelayer);

  }
  else if(printMenuState == "feature"){
    printMenuState = 'features';
    drawFeature();
    printArea.innerHTML = "";
    printProperty.innerHTML = "";
    printGraph.innerHTML = "";
    printGraph.style.height = "0%";
    printArea.appendChild(his_features);
  }
  else{
    console.log("nothing to do");
  }
  console.log(printMenuState);
}


function changeMode() {
    if (default_set == false) {
      default_set = true;
    } else {
        mfoc.clearViewer();
        var bounding = mfoc.drawPaths();
        mfoc.animate();
        MFOC.adjustCameraView(viewer, bounding);
    }
}
function getHeatmap(){
  var form = document.getElementById('heatmap_value');
  var x = form.elements[0].value;
  var y = form.elements[1].value;
  var z = form.elements[2].value;
  if(x == "" || y == "" || z == ""){
    console.log("warning!");
  }

  console.log(x,y,z);
  //
}
function addCanvas() {
    var getInfo = document.getElementById('movement');
    getInfo.onclick = (function() {
        return function() {
            console.log("click");
            mfoc.showDirectionalRader('canvas_geoinfo');
        }
    })();
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
function printProperty(data){
  var name = data.name;
  var description = data.description;
  var feature_list = data.features;

  var feature_property = [];
  for(var i = 0 ; i < feature_list.length ; i++){
    var type = feature_list[i].type;
    var properties_name = feature_list[i].properties.name;
    feature_property.push([properties_name, type]);
  }
  console.log(feature_list);
  console.log(feature_property);
  var property_panel = document.getElementById('property');
  var li = document.createElement('li');
  var li2 = document.createElement('li');
  var li3 = document.createElement('li');

  li.innerText = name;
  li2.innerText = description;

  li.className = "list-group-item active";
  li2.className = "list-group-item";

  var ul = document.createElement('ul');
  ul.className = "list-group-item";
  var upper_ul = document.createElement('ul');
  //upper_ul.className = "list-group-item";
  for(var i = 0 ; i < feature_property.length; i++){
    var temp_li = document.createElement('li');
    var temp_li2 = document.createElement('li');

    temp_li.className = "list-group-item";
    temp_li2.className = "list-group-item";

    temp_li.innerText = feature_property[i][0];
    temp_li2.innerText = feature_property[i][1];

    ul.appendChild(temp_li);
    ul.appendChild(temp_li2);
  }

  li3.appendChild(ul);
  upper_ul.appendChild(li);
  upper_ul.appendChild(li2);
  upper_ul.appendChild(li3);

  return upper_ul;
}
function updateProperties(id, name) {
    /*
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
    */
    var chk = document.getElementById(id + "_" + name);
    console.log(id, name, chk);
    if (chk.checked == true) {
        if (property_name !== name) {
            temp_property = property_name;
            property_name = name;
            if (temp_property !== "") {
                $('input:checkbox[name="' + temp_property + '"]').each(function() {
                    if (this.checked) {
                        this.checked = false;
                    }
                });
            }

        }
        $('input:checkbox[name="' + name + '"]').each(function() {
            if (this.checked == false) {
                this.checked = true;
            }
        });
        var graph = document.getElementById('graph').style;
        graph.height = "20%";
        var cesiumContainer = document.getElementById("cesiumContainer");
        //graph.opacity = "0.5";
        mfoc.showProperty(name, "graph");
        console.log("finish");
    } else {
        $('input:checkbox[name="' + name + '"]').each(function() {
            if (this.checked) {
                this.checked = false;
            }
        });
        property_name = "";
        var graph = document.getElementById('graph').style;
        graph.height = "0%";
        var cesiumContainer = document.getElementById("cesiumContainer");
        cesiumContainer.style.height = "100%";
    }

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
    printMenuState = "layer";

    var target = document.getElementsByClassName("vertical");
    //var upper_ul = document.getElementsByName('featureLayer');
    var upper_ul = document.createElement('ul');
    //upper_ul.style = "overflow-y : scroll;";
    //console.log(upper_ul);
    for (var i = 0; i < arr.length; i++) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        var ul = document.createElement('ul');

        var new_url = url + "/" + arr[i] + "/$ref";

        ul.id = arr[i];
        //ul.style = "overflow-y : scroll;";
        a.innerText = arr[i];
        a.onclick = (function(url, id) {
            return function() {
                getFeatures(url, id);
            };
        })(new_url, arr[i]);
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

function printFeatureLayerList_local(arr,url,id){
  printMenuState = "layer";

  var target = document.getElementsByClassName("vertical");
  //var upper_ul = document.getElementsByName('featureLayer');
  var upper_ul = document.createElement('ul');
  upper_ul.className = "list-group-item";
  //upper_ul.style = "overflow-y : scroll;";
  //console.log(upper_ul);
  for (var i = 0; i < arr.length; i++) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      var ul = document.createElement('ul');

      var new_url = url + "/" + arr[i] + ".json";

      ul.id = arr[i];
      //ul.style = "overflow-y : scroll;";
      a.innerText = arr[i];
      a.onclick = (function(url, id) {
          return function() {
              getFeatures_local(url, id);
          };
      })(new_url, arr[i]);
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
function printFeatures(layerID, features_list, id) { //피쳐레이어아이디,
    var target = document.createElement('ul');
    target.className = "list-group-item";
    printMenuState = "features";
    for (var i = 0; i < features_list.length; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        var ul = document.createElement("ul");
        var chk = document.createElement("input");
        var span = document.createElement("span");
        var div = document.createElement("div");

        //span.className = "input-group-addon";
        div.className = "input-group";
        li.className = "list-group-item";
        ul.className = "list-group";
        li.role = "presentation";
        a.innerText = features_list[i];
        a.onclick = (function(layer, feature){
          return function(){
            getFeature(layer, feature);
          }
        })(layerID, features_list[i]);

        chk.type = "checkbox";
        chk.checked = "true";
        chk.name = 'chkf[]';

        chk.id = features_list[i] + "_" + layerID;
        chk.onclick = (function() {
            return function() {
                drawFeature();
            }
        })();


        div.appendChild(a);
        div.appendChild(chk);
        //li.appendChild(a);
        //li.appendChild(span);
        li.appendChild(div);
        target.appendChild(li);

    }

    his_features = target;

    return target;
    //drawFeature();


}

function printFeature(featureID, data, id) {
    printMenuState = 'feature';

    //var target = document.getElementById(featureID);
    var target = document.createElement('ul');
    if (!features.contains(data)) {
        features.push(data);
      }
        var name = data.features[0].properties.name;
        var temporalProperties = data.features[0].temporalProperties;
        var li = document.createElement("li");
        var a = document.createElement("a");
        var ul = document.createElement("ul");

        li.className = "list-group-item";
        li.role = "presentation";
        //ul.className = "list-group";
        ul.id = name;
        a.innerText = name;

        for (var i = 0; i < temporalProperties.length; i++) {
            var li_temp = document.createElement("li");
            var a_temp = document.createElement("a");
            var ul_temp = document.createElement("ul");
            var div_temp = document.createElement("div");
            var chk_temp = document.createElement("input");

            li_temp.className = "list-group-item";
            li_temp.role = "presentation";
            ul_temp.className = "list-group";

            a_temp.innerText = temporalProperties[i].name;
            a_temp.onclick = (function(feature, temporalProperty) {
                return function() {
                  var bouding = mfoc.highlight(feature, temporalProperty);
                  MFOC.adjustCameraView(viewer,bouding);
                }
            })(name, temporalProperties[i].name);
            /*
            chk_temp.id = name + "_" + temporalProperties[i].name;
            chk_temp.name = temporalProperties[i].name;
            chk_temp.type = "checkbox";
            chk_temp.onclick = (function(f_name, tp_name) {
                var getid = id.split("_");
                return function() {
                    updateProperties(f_name, tp_name);
                };
            })(name, chk_temp.name);
            */

            div_temp.appendChild(a_temp);
          //  div_temp.appendChild(chk_temp);
            //li_temp.appendChild(a_temp);
            //li_temp.appendChild(chk_temp);
            li_temp.appendChild(div_temp);
            ul.appendChild(li_temp);
        }
        li.appendChild(a);
        li.appendChild(ul);

        console.log(target);
        his_feature = target;
        return li;




}

function getCheckedFeatures() {
    var checked = document.getElementsByName("chkf[]");
    for (var i = 0; i < checked.length; i++) {
        var temp = checked[i].id;
        temp = temp.split("_");
        var feature_layer = temp[1];
        var feature_name = temp[0];
        var data = getBuffer([feature_layer, feature_name]);
        if (checked[i].checked == true) {
            console.log(data);
            mfoc.add(data.features[0]);
        } else {
            mfoc.remove(data.features[0]);
        }
    }
}

function drawFeature() { //아이디로 찾을까
    mfoc.clearViewer();
    getCheckedFeatures();
    var bounding = mfoc.drawPaths();
    mfoc.animate();
    MFOC.adjustCameraView(viewer, bounding);
}
