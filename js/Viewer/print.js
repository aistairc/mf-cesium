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
var printMenuState;

function backButton(){
  var printArea = document.getElementById('featureLayers');
  if(printMenuState == "layer"){}
  else if(printMenuState == "features"){
    printMenuState = 'layer';
    printArea.innerHTML = "";
    printArea.appendChild(his_featurelayer);
  }
  else if(printMenuState == "feature"){
    printMenuState = 'features';
    printArea.innerHTML = "";
    printArea.appendChild(his_features);
  }
  else{
    console.log("nothing to do");
  }
}


function changeMode() {
    if (default_set == false) {

    } else {
        mfoc.reset();
        drawFeature();
        if (isMoving == true) {
            drawMoving();
        }
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
        cesiumContainer.style.height = "80%";
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
        li.class = "list-group-item";
        ul.class = "list-group";
        li.appendChild(a);
        li.appendChild(ul);

        upper_ul.appendChild(li);
    }
    return upper_ul;
}


function printFeatures(layerID, features_list, id) { //피쳐레이어아이디,
    var target = document.createElement('ul');
    for (var i = 0; i < features_list.length; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        var ul = document.createElement("ul");
        var chk = document.createElement("input");

        li.class = "list-group-item";
        ul.class = "list-group";

        a.innerText = features_list[i];
        /*
        a.onclick = (function(layerid, featureid) {
            return function() {
                getFeature(layerid, featureid);
            };
        })(layerID, features_list[i]);
        */

        ul.id = features_list[i];
        chk.type = "checkbox";
        chk.checked = "true";
        chk.name = 'chkf[]';
        chk.id = features_list[i] + "_" + layerID;
        chk.onclick = (function() {
            return function() {
                drawFeature();
            }
        })();

        li.appendChild(a);
        li.appendChild(chk);
        li.appendChild(ul);
        target.appendChild(li);
        getFeature(layerID, features_list[i]);
    }
    /*
    var but = document.createElement("button");
    but.onclick = (function() {
        return function() {
            drawMoving();
        }
    })();
    */
    return target;
    //drawFeature();

}

function printFeature(featureID, data, id) {

    //var target = document.getElementById(featureID);
    var target = document.createElement('ul');
    if (!features.contains(data)) {
        features.push(data);
        var name = data.features[0].properties.name;
        var temporalProperties = data.features[0].temporalProperties;
        var li = document.createElement("li");
        var a = document.createElement("a");
        var ul = document.createElement("ul");

        li.class = "list-group-item";
        ul.class = "list-group";
        ul.id = name;
        a.innerText = name;

        for (var i = 0; i < temporalProperties.length; i++) {
            var li_temp = document.createElement("li");
            var a_temp = document.createElement("a");
            var ul_temp = document.createElement("ul");
            var div_temp = document.createElement("div");
            var chk_temp = document.createElement("input");

            a_temp.innerText = temporalProperties[i].name;
            a_temp.onclick = (function(feature, temporalProperty) {
                return function() {
                    mfoc.highlight(feature, temporalProperty);
                }
            })(name, temporalProperties[i].name);
            chk_temp.id = name + "_" + temporalProperties[i].name;
            chk_temp.name = temporalProperties[i].name;
            chk_temp.type = "checkbox";
            chk_temp.onclick = (function(f_name, tp_name) {
                var getid = id.split("_");
                return function() {
                    updateProperties(f_name, tp_name);
                };
            })(name, chk_temp.name);

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
    return target;

}

function getCheckedFeatures() {

    var checked = document.getElementsByName("chkf[]");
    for (var i = 0; i < checked.length; i++) {
        var temp = checked[i].id;
        temp = temp.split("_");
        var feature_layer = temp[1];
        var feature_name = temp[0];

        if (checked[i].checked == true) {
            var data = getBuffer([feature_layer, feature_name]);
            console.log(data);
            mfoc.add(data.features[0]);

        } else {
            mfoc.remove(getBuffer([feature_layer, feature_name]));

        }
    }
}

function drawFeature() { //아이디로 찾을까
    getCheckedFeatures();
    mfoc.drawPaths();
    //<canvas id="canvas" width="300" height="300" style="background-color: transparent; border: 1px solid black;">


}

function drawMoving() {
    if (isMoving == false) {
        isMoving = true;
        getCheckedFeatures();
        mfoc.animate();
    } else {
        isMoving = false;
    }

}
