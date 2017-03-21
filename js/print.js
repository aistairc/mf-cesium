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
var bool_printedLayerList = [];
var check_button;
var time_min_max;
var zoom_time = [];




function backButton() {
    var printArea = document.getElementById('featureLayer');
    var printProperty = document.getElementById('property');
    var printGraph = document.getElementById('graph');
    var printState = document.getElementById('printMenuState');
    var printedLayer = document.getElementById('layer_list');
    var property_panel = document.getElementById("property_panel");
    var menu = document.getElementById('menu_list');
    var slinder = document.getElementById('zoom');
    var uploadButton = document.getElementById("uploadButton");
    if (printMenuState == "layer") {}
    else if (printMenuState == "features") {

        if(isServer == false){
            uploadButton.style.visibility = "visible";
            uploadButton.style.height = "7%";
            uploadButton.style.padding = "10px";
        }

        var chk_btn = document.getElementById('check_all_buttons');
        chk_btn.parentNode.removeChild(chk_btn);
        printMenuState = 'layer';
        printState.innerText = printMenuState;
        printArea.innerHTML = "";
        printArea.appendChild(his_featurelayer);

    } else if (printMenuState == "feature") {
        printMenuState = 'features';
        menu.insertBefore(check_button, document.getElementById('featureLayer'));
        printState.innerText = printMenuState;
        printedLayer.style.visibility = "visible";
        property_panel.style.visibility = "hidden";
        printArea.innerHTML = "";
        printProperty.innerHTML = "";
        printGraph.innerHTML = "";
        printGraph.style.height = "0%";
        printArea.appendChild(his_features);

        drawFeature();


    } else {
        console.log("nothing to do");
    }
    console.log(printMenuState);
}


function putProperties(id, name) {
    var obj = searchPropertyInfo(id, name);
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
function printFileUploadButton(){

  var button = document.getElementById("uploadButton");
  button.style.padding = "10px";
  button.style.height = "7%";
  button.style.visibility = "visible";

  var input = document.createElement('input');


  input.type = "file";
  input.id = "files";
  input.multiple = "multiple";
  input.name = "files[]";


  button.appendChild(input);


  document.getElementById('files').addEventListener('change', handleFileSelect_upload, false);
}


function printProperty(data) {
    var feature_property = [];
    var feature_list = data;
    var upper_ul = document.createElement("ul");
    console.log(feature_list);

    var temp_feature_property = [];
    for (var key in feature_list.properties) {
        temp_feature_property.push([key, feature_list.properties[key]]);
    }
    feature_property.push(temp_feature_property);


    console.log(feature_property);


    upper_ul.className = "list-group";
    for (var i = 0; i < feature_property.length; i++) {
        var feature_li = document.createElement("li");
        feature_li.className = "list-group-item";
        var feature_property_ul = document.createElement('ul');
        for (var j = 0; j < feature_property[i].length; j++) {
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

    var chk = document.getElementById(id + "_" + name);
    var graph = document.getElementById('graph').style;
    var cesiumContainer = document.getElementById("cesiumContainer");
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

        graph.height = "20%";

        //graph.opacity = "0.5";
        document.getElementById("graph").style.height = '20%';
        document.getElementById("graph").style.backgroundColor = 'rgba(5, 5, 5, 0.8)';

        mfoc.showProperty(name, "graph");
        console.log("finish");
    } else {
        $('input:checkbox[name="' + name + '"]').each(function() {
            if (this.checked) {
                this.checked = false;
            }
        });
        property_name = "";
        graph.height = "0%";
        cesiumContainer.style.height = "100%";
    }

}


function searchPropertyInfo(id, name) { //
    for (var i = 0; i < features.length; i++) {
        if (features[i].properties.name == id) {
            var temporalProperties = features[i].temporalProperties;
            for (var j = 0; j < temporalProperties.length; j++) {
                if (temporalProperties[j][name] == name) {
                    return temporalProperties[j][name];
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
    var upper_ul = document.createElement('ul');

    for (var i = 0; i < arr.length; i++) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        var ul = document.createElement('ul');




        //ul.style = "overflow-y : scroll;";

        a.innerText = parse_layer_name(arr[i]);


          var new_url = url + "/" + arr[i] + "/$ref";

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

function printPrintedLayersList() {
    var list = document.createElement('ul');
    list.innerHTML = '';
    for (var i = 0; i < printedLayerList.length; i++) {
        var input_group = document.createElement('div');
        var temp_list = document.createElement('li');
        var chk = document.createElement("input");
        var a = document.createElement('a');


        input_group.className = "input-group";
        chk.type = "checkbox";

        temp_list.className = "list-group-item";
        chk.id = printedLayerList[i];



        if(bool_printedLayerList[i] == 0){
            chk.checked = false;
        }
        else{
            chk.checked = true;

        }
        chk.onclick = (function(layerID) {
            return function() {
                printWhole(layerID);
            }
        })(printedLayerList[i]);
        if(!printedLayerList[i].includes("\'")){
          a.innerText = printedLayerList[i];
        }
        else {
            a.innerText = parse_layer_name(printedLayerList[i]);
        }
        input_group.appendChild(chk);
        input_group.appendChild(a);

        temp_list.appendChild(input_group);
        list.appendChild(temp_list);
    }
    return list;
}

function printWhole(layerID) {
    var feature_list = getBuffer([layerID]);
    var chk = document.getElementById(layerID);
    if (feature_list.length !== 0) {
        console.log(chk.checked);
        if (chk.checked == true) {
            console.log('check');
            console.log(layerID);
            for (var key in feature_list) {
                var data = getBuffer([layerID, key]);
                mfoc.add(data);
            }
            layer_checkAll(layerID, 'chkf[]');
        } else {
            console.log('uncheck');

            for (var key in feature_list) {
                var data = getBuffer([layerID, key]);
                console.log(data);
                mfoc.remove(data);
            }
            layer_uncheckAll(layerID, 'chkf[]');
            if (document.getElementById('pro_menu'))
                document.getElementById('pro_menu').remove();
            document.getElementById('graph').style.height = "0%";
        }
        mfoc.update();
        mfoc.adjustCameraView();
    }

}

function checkAll(name) {
    var layerID;
    var checked = document.getElementsByName(name);
    for (var i = 0; i < checked.length; i++) {
        var temp = checked[i].id;
        temp = temp.split("##");
        var feature_layer = temp[1];
        layerID = feature_layer;
        var feature_name = temp[0];
        console.log(feature_layer, feature_name);
        var data = getBuffer([feature_layer, feature_name]);
        if (checked[i].checked == true) {
            mfoc.add(data);
        } else {
            checked[i].checked = true;
            mfoc.add(data);
        }
    }

    if (printedLayerList.contains(layerID)) {

        var layer_checked = document.getElementById(layerID);
        var index = printedLayerList.indexOf(layerID);
        bool_printedLayerList[index] = 1;
        layer_checked.checked = true;

    }

    updatePropertyGraph();

    drawFeature();
}

function updatePropertyGraph() {
    if (document.getElementById('pro_menu')) {
        document.getElementById('pro_menu').remove();
    }
    document.getElementById("graph").innerHTML = '';
    document.getElementById("graph").style.height = '0%';
}

function layer_checkAll(featureLayerID, name) {
    var layerID;

    if (printMenuState == "features") {
        var checked = document.getElementsByName(name);
        var temp = checked[0].id;
        temp = temp.split("##");
        if (temp[1] == featureLayerID) {
            for (var i = 0; i < checked.length; i++) {
                var temp = checked[i].id;
                temp = temp.split("##");
                var feature_layer = temp[1];
                layerID = feature_layer;
                var feature_name = temp[0];
                var data = getBuffer([feature_layer, feature_name]);
                if (checked[i].checked == true) {
                    mfoc.add(data);
                } else {
                    checked[i].checked = true;
                    mfoc.add(data);
                }
            }


        }
    }
    drawFeature();
    var index = printedLayerList.indexOf(featureLayerID);
    bool_printedLayerList[index] = 1;

}

function layer_uncheckAll(featureLayerID, name) {
    var layerID;
    if (printMenuState == "features") {
        var checked = document.getElementsByName(name);
        var temp = checked[0].id;
        temp = temp.split("##");
        if (temp[1] == featureLayerID) {

            for (var i = 0; i < checked.length; i++) {
                temp = checked[i].id;
                temp = temp.split("##");
                var feature_layer = temp[1];
                layerID = feature_layer;
                var feature_name = temp[0];
                var data = getBuffer([feature_layer, feature_name]);
                if (checked[i].checked == true) {
                    checked[i].checked = false;
                    mfoc.remove(data);
                } else {
                    mfoc.remove(data);
                }
            }
        }




    }

        drawFeature();
        var index = printedLayerList.indexOf(featureLayerID);
        bool_printedLayerList[index] = 0;


}

function parse_layer_name(layerID) {
    var parse_name = layerID;
    parse_name = parse_name.split('\'');
    parse_name = parse_name[1];
    return parse_name;
}

function uncheckAll(name) {
    var layerID;
    var checked = document.getElementsByName(name);
    for (var i = 0; i < checked.length; i++) {
        var temp = checked[i].id;
        temp = temp.split("##");
        var feature_layer = temp[1];
        layerID = feature_layer;
        var feature_name = temp[0];
        console.log(feature_layer, feature_name);
        var data = getBuffer([feature_layer, feature_name]);
        if (checked[i].checked == true) {
            checked[i].checked = false;
            mfoc.remove(data);
        } else {
            mfoc.remove(data);
        }
    }

    if (printedLayerList.contains(layerID)) {
        var layer_checked = document.getElementById(layerID);
        console.log(layer_checked);
        layer_checked.checked = false;
        var index = printedLayerList.indexOf(layerID);
        bool_printedLayerList[index] = 0;
    }
    updatePropertyGraph();
    drawFeature();
}

function printFeatures(layerID, features_list, id) { //피쳐레이어아이디,
    var printedLayer = document.getElementById('layer_list');
    var property_panel = document.getElementById("property_panel");
    var target = document.createElement('ul');
    var check_all = document.createElement('li');
    var chk_all = document.createElement('input');
    var unchk_all = document.createElement('input');
    var printState = document.getElementById('printMenuState');
    var menu = document.getElementById('menu_list');

    printedLayer.style.visibility = "visible";
    property_panel.style.visibility = "hidden";
    check_all.style.display = "flex";
    check_all.style.position = "absolute";
    check_all.className = "list-group-item";

    chk_all.type = 'button';
    chk_all.style = "min-height : 100%;min-width : 50%";

    chk_all.className = "btn btn-default";
    chk_all.value = 'check all';
    //chk_all.style.display = "flex";
    chk_all.style.flex = '0';
    chk_all.style.position = 'relative';
    chk_all.onclick = (function(name) {
        return function() {
            checkAll(name);
        };
    })("chkf[]");
    check_all.appendChild(chk_all);
    check_all.id = "check_all_buttons";
    check_all.style = "flex-grow : 0;align-items: center;justify-content: center;";

    //unchk_all.style.display = "flex";
    unchk_all.type = 'button';
    unchk_all.className = "btn btn-default";
    unchk_all.style = "min-height : 100% ; min-width : 50%";
    unchk_all.style.position = "relative";
    unchk_all.value = 'uncheck all';
    unchk_all.style.flex = '0';

    unchk_all.onclick = (function(name) {
        return function() {
            uncheckAll(name);
        };
    })("chkf[]");

    check_all.appendChild(unchk_all);

    menu.insertBefore(check_all, document.getElementById('featureLayer'));
    check_button = check_all;
    target.className = "list-group-item";
    printMenuState = "features";
console.log(layerID);
    if(!layerID.includes("\'")){

        printState.innerText = printMenuState + " :" + layerID;
    }
    else{
      printState.innerText = printMenuState + " :" + parse_layer_name(layerID);
    }


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
        parse_name = parse_name.split('\'');
        parse_name = parse_name[1];
        a.innerText = parse_name;
        a.onclick = (function(layer, feature) {
            return function() {
                getFeature(layer, feature);
            }
        })(layerID, features_list[i]);

        chk.type = "checkbox";
        chk.checked = "true";
        chk.name = 'chkf[]';

        chk.id = features_list[i] + "##" + layerID;
        chk.onclick = (function() {
            return function() {
                drawFeature();
            }
        })();

        div.appendChild(chk);
        div.appendChild(a);

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
    var chk_btn = document.getElementById('check_all_buttons');
    var printState = document.getElementById('printMenuState');
    var property_panel = document.getElementById('property_panel');
    var printedLayers = document.getElementById('layer_list');
    var target = document.createElement('ul');

    printMenuState = 'feature';
    chk_btn.parentNode.removeChild(chk_btn);
    printState.innerText = printMenuState + " : " + featureID;

    printedLayers.style.visibility = "hidden";
    property_panel.style.visibility = "visible";

    //var target = document.getElementById(featureID);

    if (!features.contains(data)) {
        features.push(data);
    }
    var name = data.properties.name;
    var temporalProperties = data.temporalProperties;
    var li = document.createElement("li");
    var a = document.createElement("a");
    var ul = document.createElement("ul");

    li.className = "list-group-item";
    li.role = "presentation";
    //ul.className = "list-group";
    ul.id = name;
    a.innerText = name;
    var temporalProperties_name = Object.keys(temporalProperties[0]);
    console.log(temporalProperties_name);
    for (var i = 0; i < temporalProperties_name.length; i++) {
      if (temporalProperties_name[i] == 'datetimes') continue;
      var li_temp = document.createElement("li");
      var a_temp = document.createElement("a");
      var ul_temp = document.createElement("ul");
      var div_temp = document.createElement("div");
      var chk_temp = document.createElement("input");

      li_temp.className = "list-group-item";
      li_temp.role = "presentation";
      ul_temp.className = "list-group";

      a_temp.innerText = temporalProperties_name[i];
      a_temp.onclick = (function(feature, temporalProperty) {
        return function() {
          getHighlight(feature, temporalProperty);
        }
      })(name, temporalProperties_name[i]);
      div_temp.appendChild(a_temp);
      li_temp.appendChild(div_temp);
      ul.appendChild(li_temp);
    }
    li.appendChild(a);
    li.appendChild(ul);
    his_feature = target;
    return li;




}

function getHighlight(feature, temporalProperty) {
    mfoc.highlight(feature, temporalProperty);
    mfoc.adjustCameraView();
}

function getCheckedFeatures() {
    var checked = document.getElementsByName("chkf[]");
    for (var i = 0; i < checked.length; i++) {
        var temp = checked[i].id;
        temp = temp.split("##");
        var feature_layer = temp[1];
        var feature_name = temp[0];

        var data = getBuffer([feature_layer, feature_name]);
        if (checked[i].checked == true) {
            if (!printedLayerList.contains(feature_layer)) {
                printedLayerList.push(feature_layer);
            }
            mfoc.add(data);
        } else {
            mfoc.remove(data);
        }
    }




}

function refresh() {
    mfoc.spliceByTime(time_min_max[0], time_min_max[1]);
    mfoc.update();
    mfoc.adjustCameraView();
}

function zoom() {
    var fastest = new Date(time_min_max[0]);
    var latest = new Date(time_min_max[1]);
    ///console.log(min,max);
    var diff = (latest.getTime() - fastest.getTime()) / 100;
    //console.log(diff);
    console.log(zoom_time);
    latest.setTime(fastest.getTime() + diff * zoom_time[1]);
    fastest.setTime(fastest.getTime() + diff * zoom_time[0]);

    //console.log(min,max);
    mfoc.spliceByTime(fastest, latest);
    mfoc.update();
    setAnalysisDIV('analysis', 'graph', 'radar');
    mfoc.adjustCameraView();
}

function printSlinder() {
    var fastest = time_min_max[1];
    var latest = time_min_max[0];

    var f_label = document.getElementById('min-date');
    var l_label = document.getElementById('max-date');

    f_label.innerText = fastest.getFullYear() + " / " + (fastest.getMonth() + 1) + " / " + (fastest.getDate());
    l_label.innerText = latest.getFullYear() + " / " + (latest.getMonth() + 1) + " / " + (latest.getDate());

    ///slinder.refresh();

}

function drawFeatureWithoutModi() {
    time_min_max = mfoc.update();
    time_min_max = time_min_max.date;
    printSlinder();
    console.log(time_min_max);
    mfoc.adjustCameraView();
}

function drawFeature() { //아이디로 찾을까
    var slinder = document.getElementById('zoom');
    getCheckedFeatures();
    time_min_max = mfoc.update();
    time_min_max = time_min_max.date;
    if (printMenuState == "features" || printMenuState == "layer") {
        slinder.style.visibility = "visible";
        printSlinder();
    } else {
        slinder.style.visibility = "hidden";
    }
    mfoc.adjustCameraView();
}
