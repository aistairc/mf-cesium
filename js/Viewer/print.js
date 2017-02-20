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

var printedLayerList = [];

function backButton(){
  var printArea = document.getElementById('featureLayer');
  var printProperty = document.getElementById('property');
  var printGraph = document.getElementById('graph');
  var printState = document.getElementById('printMenuState');
  if(printMenuState == "layer"){}
  else if(printMenuState == "features"){

    printMenuState = 'layer';
    printState.innerText = printMenuState;
    printArea.innerHTML = "";
    printArea.appendChild(his_featurelayer);

  }
  else if(printMenuState == "feature"){
   printMenuState = 'features';
   printState.innerText = printMenuState;
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

  //console.log(x,y,z);
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
    //console.log(obj);
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
            //console.log(obj);
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

  var feature_property = [];
  var feature_list = data.features;
  console.log(feature_list);
  for(var i = 0 ; i < feature_list.length ; i++){
    //var type = feature_list[i].type;
    var temp_feature_property = [];
    for (var key in feature_list[i].properties){
        temp_feature_property.push([key,feature_list[i].properties[key]]);
        // use val

    }
    feature_property.push(temp_feature_property);
  }

  console.log(feature_property);

  //console.log(feature_list);
  //console.log(feature_property);
  //var property_panel = document.getElementById('property');
  var upper_ul = document.createElement("ul");
  upper_ul.className = "list-group";
  for(var i = 0 ; i < feature_property.length ; i++){
  var feature_li = document.createElement("li");
  feature_li.className = "list-group-item";
  var feature_property_ul = document.createElement('ul');
    for(var j = 0 ; j < feature_property[i].length ; j++){
      var t_property = document.createElement('li');
      t_property.className = "list-group-item";
      t_property.innerText = feature_property[i][j][0] + " : " + feature_property[i][j][1];
      feature_property_ul.appendChild(t_property);
    }
    feature_li.appendChild(feature_property_ul);
    upper_ul.appendChild(feature_li);
  }
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
    var printState = document.getElementById('printMenuState');
    printState.innerText = printMenuState;
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

        a.innerText = parse_layer_name(arr[i]);
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
  var printState = document.getElementById('printMenuState');
  printState.innerText = printMenuState;
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


function printPrintedLayersList(){
  var list = document.createElement('ul');

  list.innerHTML = '';
  for(var i = 0 ; i < printedLayerList.length ; i++){
    var temp_list = document.createElement('li');
    temp_list.className = "list-group-item";
    temp_list.value = printedLayerList[i];
    temp_list.innerText = printedLayerList[i];

    list.appendChild(temp_list);
  }
  return list;
}

function checkAll(name){

  var layerID;
  var checked = document.getElementsByName(name);
  for (var i = 0; i < checked.length; i++) {
      var temp = checked[i].id;
      temp = temp.split("_");
      var feature_layer = temp[1];
      layerID = feature_layer;
      var feature_name = temp[0];
      var data = getBuffer([feature_layer, feature_name]);
      if (checked[i].checked == true) {
          //console.log(data);
          mfoc.add(data.features[0]);
      } else {
        checked[i].checked = true;
          mfoc.add(data.features[0]);
      }
  }
  if(!printedLayerList.contains(parse_layer_name(layerID))){
    printedLayerList.push(parse_layer_name(layerID));
  }
  var layerlist = document.getElementById('list');
  layerlist.innerHTML = "";
  layerlist.appendChild(printPrintedLayersList());
  drawFeature();
}

function parse_layer_name(layerID){
  var parse_name = layerID;
  parse_name = parse_name.replace('FeatureLayers',"");
  parse_name = parse_name.replace('(','');
  parse_name = parse_name.replace(")","");
  parse_name = parse_name.replaceAll("\'","");
  return parse_name;
}
function uncheckAll(name){
  var layerID;
  var checked = document.getElementsByName(name);
  for (var i = 0; i < checked.length; i++) {
      var temp = checked[i].id;
      temp = temp.split("_");
      var feature_layer = temp[1];
      layerID = feature_layer;
      var feature_name = temp[0];
      var data = getBuffer([feature_layer, feature_name]);
      if (checked[i].checked == true) {
          checked[i].checked = false;
          mfoc.remove(data.features[0]);
      } else {
        mfoc.remove(data.features[0]);
      }
  }

  if(printedLayerList.contains(parse_layer_name(layerID))){
    printedLayerList.splice(printedLayerList.indexOf(layerID),1);
  }
  var layerlist = document.getElementById('list');
  layerlist.innerHTML = "";
  layerlist.appendChild(printPrintedLayersList());
  drawFeature();
}
function printFeatures(layerID, features_list, id) { //피쳐레이어아이디,

    var target = document.createElement('ul');
    var check_all = document.createElement('li');
    //check_all.innerText = "check all";
    var chk_all = document.createElement('input');
    chk_all.type = 'button';
    chk_all.className = "btn btn-default";
    chk_all.value = 'check all';
    chk_all.onclick = (function(name){
      return function(){checkAll(name);};
    })("chkf[]");
    check_all.appendChild(chk_all);
    target.appendChild(check_all);

    var uncheck_all = document.createElement('li');
    //uncheck_all.innerText = "uncheck all";
    var unchk_all = document.createElement('input');
    unchk_all.type = 'button';
    unchk_all.className = "btn btn-default";
    unchk_all.value = 'uncheck all';
    unchk_all.onclick = (function(name){
      return function(){uncheckAll(name);};
    })("chkf[]");
    uncheck_all.appendChild(unchk_all);
    target.appendChild(uncheck_all);


    target.className = "list-group-item";
    var printState = document.getElementById('printMenuState');
    printState.innerText = printMenuState;
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
        var parse_name = features_list[i];
        parse_name = parse_name.replaceAll("features","");
        parse_name = parse_name.replace("(","");
        parse_name = parse_name.replace(")","");
        parse_name = parse_name.replaceAll("\'","");
        a.innerText = parse_name;
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
    var printState = document.getElementById('printMenuState');
    printState.innerText = printMenuState;
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

        //console.log(target);
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
            //console.log(data);
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
