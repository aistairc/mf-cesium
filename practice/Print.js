

/**
 * @author Dongmin Kim <dongmin.kim@pnu.edu>
 * @author Hyemi Jeong <hyemi.jeong@pnu.edu>
 */
function backButton() {
    var printArea = document.getElementById(div_id.left_upper_list);
    var printProperty = document.getElementById('property');
    var property_panel = document.getElementById("property_panel");
    var menu = document.getElementById(div_id.menu_list);
    if (printMenuState == MENU_STATE.layers) {
        //nothing
    }
    else if (printMenuState == MENU_STATE.features) { //go to LAYER
        removeCheckAllandUnCheckBtn();
        changeMenuMode(MENU_STATE.layers);
        printArea.innerHTML = "";
        printArea.appendChild(list_maker.getLayerDivList());
    } 
    else if (printMenuState == MENU_STATE.one_feature) {
        printCheckAllandUnCheck();
        changeMenuMode(MENU_STATE.features);
        turnOffProperties();
        printProperty.innerHTML = "";

        printArea.innerHTML = "";
        printArea.appendChild(list_maker.getFeaturesDivList(current_layer));
        
        afterChangingCheck();
        refresh();
        drawFeatures();
    }else {
        throw "BACK BUTTON, STATE ERROR"
    }
    clearAnalysis();
}

function toggle_toolbar(){
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
    stinuum.mfCollection.add(ft);
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
    stinuum.geometryViewer.update();
}

function connectHomeButton(){
    $('.cesium-button.cesium-toolbar-button.cesium-home-button').each(function(){
        $this = $(this);
        LOG($this);
        $this.unbind(); 
        $this.click(function(){
            stinuum.geometryViewer.adjustCameraView();
        });
    });
}

      
function drawBoundingBox(layer_id){
    LOG("drawBoundingBox");
    var boundedBy = buffer.getBoundedBy(layer_id);
    if (boundedBy == undefined) {
        return;
    }
    stinuum.geometryViewer.drawBoundingBox(boundedBy, layer_id);
}

function printBoundingTime(layer_id, event){
    var boundedBy = buffer.getBoundedBy(layer_id);
    if (boundedBy == undefined) return;
    var layerBound = document.getElementById('layerBound');

    layerBound.style.top = event.pageY + "px";
    layerBound.style.visibility = 'visible';

    document.getElementById('layerBound_start').innerText = new Date(boundedBy.period.begin).toDateString();
    document.getElementById('layerBound_end').innerText = new Date(boundedBy.period.end).toDateString();
}

function removeBoundingBox(layer_id){
    var boundedBy = buffer.getBoundedBy(layer_id);
    if (boundedBy == undefined) return;
    stinuum.geometryViewer.removeBoundingBox(layer_id);

}

function removeBoundingTime(layer_id){
    var boundedBy = buffer.getBoundedBy(layer_id);
    if (boundedBy == undefined) return;
    var layerBound = document.getElementById('layerBound');
    layerBound.style.visibility = 'hidden';
}