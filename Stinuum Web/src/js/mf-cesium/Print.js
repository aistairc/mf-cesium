// import { connect } from "http2";


/**
 * @author Dongmin Kim <dongmin.kim@pnu.edu>
 * @author Hyemi Jeong <hyemi.jeong@pnu.edu>
 */
function backButton() {
    var printArea = document.getElementById(div_id.left_upper_list);
    var printProperty = document.getElementById('property');
    var property_panel = document.getElementById("property_panel");
    var list_div = document.getElementById(div_id.printed_features);

    var menu = document.getElementById(div_id.menu_list);
    if (printMenuState == MENU_STATE.layers) {
        //nothing

    }
    else if (printMenuState == MENU_STATE.features) { //go to LAYER
    // if(isServer == false){
    //     uploadButton.style.visibility = "visible";
    //     uploadButton.style.padding = "10px";
    // }
        removeCheckAllandUnCheckBtn();
        changeMenuMode(MENU_STATE.layers);
        printArea.innerHTML = "";
        printArea.appendChild(list_maker.getLayerDivList());
        list_div.innerHTML = "";
        // afterChangingCheck();
    } 
    else if (printMenuState == MENU_STATE.one_feature) {
        printCheckAllandUnCheck();
        changeMenuMode(MENU_STATE.features);
        turnOffProperties();
        printProperty.innerHTML = "";

        printArea.innerHTML = "";
        printArea.appendChild(list_maker.getFeaturesDivList(current_layer));
        // clearAnalysis();
        // afterChangingCheck();
    }else {
        throw "BACK BUTTON, STATE ERROR"
    }
    clearAnalysis();
    // console.log(printMenuState);
}

function toggle_toolbar(){
  if (toolbar_show){
    turnoff_toolbar();
  }
  else{
    turnon_toolbar();
  }
}
function toggle_mfjson(){
    if (toolbar_show){
      turnoff_toolbar();
    }
    else{
      turnon_toolbar();
    }
}
function turnon_toolbar(){
    toolbar_show = true;
    document.getElementById('left_toolbar').style.width = '15%';
    document.getElementById('left_toolbar').style.visibility = 'visible';
    $("#left_toolbar").children().show();
    document.getElementById('left_toolbar_btn').style.left = '14.5%';
    document.getElementById('left_toolbar_btn').innerHTML = '<';
    cleanGraphDIV();
}

function turnoff_toolbar(){
    toolbar_show = false;
    document.getElementById('left_toolbar').style.width = 0;
    document.getElementById('left_toolbar').style.visibility = 'hidden';
    $("#left_toolbar").children().hide();
    document.getElementById('left_toolbar_btn').style.left = 0;
    document.getElementById('left_toolbar_btn').innerHTML = '>';
    cleanGraphDIV();
}
function turnon_mfjson(){
    mfjson_show = true;
    var mfjson_div = document.getElementById(div_id.mfjson);
    mfjson_div.style.display = "inline-block"
}
function turnoff_mfjson(){
    mfjson_show = false;
    var mfjson_div = document.getElementById(div_id.mfjson);
    mfjson_div.style.display = "none"
}
function new_CodeMirror(){
    var newEditor = CodeMirror(document.getElementById("editor"), {
        value: '{\n    "type": "FeatureCollection",\n    "features": []\n}',
        matchBrackets: true,
        autoCloseBrackets: true,
        mode: "application/json",
        indentUnit: 4,
        lineNumbers: true,
        
    });
    return newEditor
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

function eraseFeature(layer_id, feature_id){
    list_maker.turnOffFeature(layer_id,feature_id);
    var ft = buffer.getFeature(layer_id, feature_id);
    stinuum.mfCollection.remove(ft);
}

function showFeature(layer_id, feature_id){
    
    list_maker.turnOnFeature(layer_id,feature_id);
    var ft = buffer.getFeature(layer_id, feature_id);
    console.log("check", ft)
    if (!buffer.checkServerData(layer_id)){
        // console.log(connector.getTemporalProperties(layer_id, feature_id))
        // console.log(buffer.fromServer[layer_id][feature_id])
        if(!buffer.fromServer[layer_id][feature_id].hasOwnProperty('temporalGeometry')){
            var tempObj = connector.makeOneFeature(layer_id, feature_id, ft.time)
            for(let i in Object.keys(tempObj)){

                let eachKey = Object.keys(tempObj)[i];
                let eachValue = tempObj[Object.keys(tempObj)[i]];
                // console.log(eachKey, eachValue)
                buffer.fromServer[layer_id][feature_id][eachKey] = eachValue;
                
            }

        }
        checkTemporalGeometry(layer_id, feature_id)
        // buffer.translateValue(copyData)        
        stinuum.mfCollection.add(buffer.fromServer[layer_id][feature_id]);
    }else{
        // var copyData = copyObj(ft)
        // buffer.translateValue(copyData)
        stinuum.mfCollection.add(ft);
    }   
}

//press checkbox of feature
function toggleFeature(layer_id, feature_id){
    var isOn = list_maker.isFeatureChecked[layer_id][feature_id];
    if (isOn == undefined){
        throw "toggleFeature ERROR";
    }
    else if(isOn){
        eraseFeature(layer_id, feature_id);
    }
    else{
        showFeature(layer_id, feature_id);
        
    }

    if (printMenuState == MENU_STATE.features) printFeaturesList(layer_id);
    afterChangingCheck();
}

function refresh() {
    stinuum.mfCollection.refresh(); //all hidden -> feature
    if (slider != undefined) slider.refresh();
}

function drawFeatures() { //아이디로 찾을까
    // LOG("drawFeatures");
    stinuum.geometryViewer.update();

}

function connectHomeButton(){
    $('.cesium-button.cesium-toolbar-button.cesium-home-button').each(function(){
        $this = $(this);
        // LOG($this);
        $this.unbind(); 
        $this.click(function(){
            stinuum.geometryViewer.adjustCameraView();
        });
    });
}


function copyObj(obj) {

    var copy = jQuery.extend(true, {}, obj);
   
    return copy;
  }

function checkTemporalGeometry(layer_id, feature_id)  {
    var feature_data = buffer.fromServer[layer_id][feature_id]
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
    
    feature_data = buffer.translateValue(feature_data)
    feature_data = buffer.translateTime(feature_data)
    
    buffer.fromServer[layer_id][feature_id] = JSON.parse(feature_data);
    } catch (e) {
    //throw new Stinuum.Exception("it is not json format", feature_data);
    buffer.fromServer[layer_id][feature_id] = feature_data;
    }

}
/*
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
var printMenuState = "LAYER";

var printedLayerList = [];
var bool_printedLayerList = [];
var check_button;
*/

/*


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

        temp_list.className = "layer-list-item";
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
    if (feature_list.length !== 0 || feature_list !== undefined) {
        if (chk.checked == true) {
            for (var key in feature_list) {
                var data = getBuffer([layerID, key]);
                stinuum.mfCollection.add(data);
            }
            layer_checkAll(layerID, 'chkf[]');
        } else {
            for (var key in feature_list) {
                var data = getBuffer([layerID, key]);
                stinuum.mfCollection.remove(data);
            }
            layer_uncheckAll(layerID, 'chkf[]');
            if (document.getElementById('pro_menu'))
                document.getElementById('pro_menu').remove();
            document.getElementById('graph').style.height = "0%";
        }
        stinuum.geometryViewer.update();
    }
    //selectProperty("graph");
    drawFeatures();

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
                    stinuum.mfCollection.add(data);
                } else {
                    checked[i].checked = true;
                    stinuum.mfCollection.add(data);
                }
            }


        }
    }

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
          stinuum.mfCollection.remove(data);
        } else {
          stinuum.mfCollection.remove(data);
        }
      }
    }




  }


  var index = printedLayerList.indexOf(featureLayerID);
  bool_printedLayerList[index] = 0;


}

function parse_layer_name(layerID) {
    var parse_name = layerID;
    parse_name = parse_name.split('\'');
    parse_name = parse_name[1];
    return parse_name;
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
            stinuum.mfCollection.add(data);
        } else {
            stinuum.mfCollection.remove(data);
        }
    }
}
*/
