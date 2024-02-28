function printFeaturesList(layer){
  current_layer = layer;

  var list = list_maker.getFeaturesDivList(layer);
  var printArea = document.getElementById(div_id.left_upper_list);
  printArea.innerHTML = "";
  printArea.appendChild(list);
}

function changeMenuMode(mode, feature_id){
    printMenuState = mode;
    var printState = document.getElementById(div_id.menu_mode);
    if (mode != MENU_STATE.one_feature){
      printState.innerText = printMenuState;
    }
    else{
      console.log(mode, printState);
      // printState.getElementById("f_btn_area").remove();
      if (feature_id !== undefined){
        addButton(printState,feature_id);
      }
    }
}

function addButton(printState, feature_id){
  printState.innerText = "";
  let temp_div = document.createElement("div");
  temp_div.id = "f_btn_area";


  let btn_list = ["velocity", "distance", "acc"];
  for (let btn_name of btn_list){
    var default_btn = document.createElement("button");
    if (btn_name === "acc"){
      btn_name = "acceleration";
    }
    default_btn.className = 'btn btn-default';
    default_btn.type = 'button';
    default_btn.id = btn_name;
    default_btn.innerText = btn_name;
    default_btn.onclick = function(){
      let layer_id = buffer.getLayerID(feature_id);
      console.log(feature_id, layer_id);
      if (layer_id !== false){
        let tgeometry_id = buffer.getTgeometryID(layer_id, feature_id);
        getProperty(layer_id, feature_id, tgeometry_id, btn_name);
      }
    };


    temp_div.appendChild(default_btn);
  }
  document.getElementById('printMenuState').appendChild(temp_div);

}
function getProperty(collection_id, mfeature_id, tgeometry_id, q_type){
  let defaultURL = `http://localhost:8085/collections/${collection_id}/items/${mfeature_id}/tgsequence/${tgeometry_id}/${q_type}`;
  fetch(defaultURL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(userData => {

        let t_properties = {
          datetimes: userData.valueSequence[0].datetimes
        }
        t_properties[userData.name] = {
          type: "Measure",
          form: userData.form,
          values: userData.valueSequence[0].values,
          interpolation: userData.valueSequence[0].interpolation
        }
        buffer.addTproperty(collection_id, mfeature_id, tgeometry_id, t_properties, userData.name);
        showSelectProperties("graph", [q_type]);
        console.log('User Data:', t_properties);
      })
      .catch(error => {
        console.error('Error:', error);
      });
}
function showSelectPropertiesTemp2(graph_id, pro_type_arr) {
  console.log(graph_id, pro_type_arr)
  if (document.getElementById('pro_menu')) {
    document.getElementById('pro_menu').remove();
  }
  document.getElementById(graph_id).innerHTML = '';
  document.getElementById(graph_id).style.height = '0%';
  document.getElementById(graph_id).style.cursor = 'pointer';

  let pro_menu = document.createElement('div');
  pro_menu.style.bottom = '0';
  pro_menu.style.backgroundColor = 'rgba(105, 105, 105, 0.8)';
  pro_menu.style.height = "5%";
  pro_menu.style.zIndex = "25";
  pro_menu.id = 'pro_menu';
  pro_menu.style.cursor = 'pointer';
  pro_menu.className = 'graph';
  for (let i = 0; i < pro_type_arr.length; i++) {
    let div = document.createElement('div');
    div.style.padding = "0px 10px 0px 10px";
    div.style.color = 'white';
    div.style.float = 'left';
    //div.style.textAlign = 'center';
    div.style.fontSize = '100%';
    div.style.height = "100%";
    div.style.lineHeight = "100%";
    div.style.width = 100 / (pro_type_arr.length + 1) + '%';
    //div.innerHTML = pro_type_arr[i];
    div.id = 'btn' + pro_type_arr[i];
    // Add ktianishi 2018.02.01 -->
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.flexDirection = 'row';
    div.style.alignItems = 'center';
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.marginTop = '0';
    checkbox.style.height = '100%';
    checkbox.id = 'chk' + pro_type_arr[i];
    checkbox.dataset.name = pro_type_arr[i];
    checkbox.classList.add('chk-graph-item');
    checkbox.addEventListener('click', (e) => {
      let elements = document.getElementsByClassName('chk-graph-item');
      let current = e.currentTarget;
      Array.from(elements).forEach((element) => {
        if (current.checked && element.id != current.id) {
          element.setAttribute('disabled', 'disabled');
        } else {
          element.removeAttribute('disabled');
        }
      });
    });
    let label = document.createElement('label');
    label.for = checkbox.id;
    label.style.margin = "0px";
    label.style.fontWeight = '100';
    label.style.fontSize = "small";
    label.textContent = pro_type_arr[i];
    div.appendChild(checkbox);
    div.appendChild(label);
    // <---
    div.onclick = (function (stinuum, name_arr, index, graph) {
      return function () {
        // console.log(name_arr)
        document.getElementById('pro_menu').style.bottom = '20%';
        document.getElementById('btn' + name_arr[index]).style.backgroundColor = 'rgba(200,100,100,0.8)';
        document.getElementById("graph").style.height = '20%';
        document.getElementById("graph").style.backgroundColor = 'rgba(5, 5, 5, 0.8)';

        for (var i = 0; i < name_arr.length; i++) {
          if (i == index) continue;
          document.getElementById('btn' + name_arr[i]).style.backgroundColor = 'transparent';
        }

        let elements = document.getElementsByClassName('chk-graph-item');
        let main_name = null;
        Array.from(elements).forEach((element) => {
          if (element.checked) {
            main_name = element.dataset.name;
          }
        });
        // console.log("compare grpah need : ", main_name, name_arr[index])
        if (main_name && main_name != name_arr[index]) {
          // console.log("compare grpah need : ", main_name, name_arr[index])
          stinuum.propertyGraph.compare(main_name, name_arr[index], graph);
        } else {
          stinuum.propertyGraph.show(name_arr[index], graph);
        }
      };
    })(stinuum, pro_type_arr, i, graph_id);
    pro_menu.appendChild(div);
  }

  var close_div = document.createElement('div');
  close_div.setAttribute("id", "btnclose");
  // close_div.addEventListener('click', function (event) {

  //     document.getElementById('pro_menu').remove();
  //     document.getElementById(graph_id).style.height = "0%";
  //     clearAnalysis();
  //     refresh();

  //   });
  //close_div.style.padding = "10px";
  close_div.style.color = 'white';
  close_div.style.float = 'right';
  close_div.style.justifyContent = 'center';
  close_div.style.fontSize = 'small';
  close_div.style.alignItems = 'center';
  close_div.style.display = 'flex';
  close_div.style.height = '100%'
  close_div.style.width = 100 / (pro_type_arr.length + 1) + '%';
  close_div.innerHTML = 'CLOSE';
  pro_menu.appendChild(close_div);


  close_div.onclick = (function (graph_id) {
    return function () {

      //console.log(document.getElementById('pro_menu'))
      document.getElementById('pro_menu').remove();
      document.getElementById(graph_id).style.height = "0%";
      clearAnalysis();
      refresh();
      // drawFeatures();

    }
  })(graph_id);

  document.body.appendChild(pro_menu);
  changeOptionToolbarToCloseDIV();
}
function removeCheckAllandUnCheckBtn(){
  // LOG("removeCheckAllandUnCheckBtn");
  if (document.getElementById(div_id.chk_unchk_li)) {
    document.getElementById(div_id.chk_unchk_li).remove();
  }
}

function printCheckAllandUnCheck(layer_id){
  // LOG("printCheckAllandUnCheck", layer_id);
  removeCheckAllandUnCheckBtn();

  var menu = document.getElementById('menu_list');
  var chk_unchk_li = document.createElement('li');
  var chk_all = document.createElement('input');
  var unchk_all = document.createElement('input');

  chk_unchk_li.style = "flex-grow : 0;align-items: center;justify-content: center;";
  chk_unchk_li.id = div_id.chk_unchk_li;
  chk_unchk_li.style.display = "inline-block";
  chk_unchk_li.style.padding = "10px";
  chk_unchk_li.style.paddingBottom = "1px";
  
  if (buffer.checkIfServerData(layer_id)){
    chk_all.type = 'button';
    chk_all.className = "chk_unchk_btn btn btn-default";
    chk_all.value = 'ADD';
    chk_all.onclick = (function(layerID) {
      return function() {
        getServerEachData(layer_id)
      };
    })(layer_id);
  }else{
    chk_all.type = 'button';
    chk_all.className = "chk_unchk_btn btn btn-default";
    chk_all.value = 'ALL';
    chk_all.onclick = (function(layerID) {
      return function() {

        checkAllandUpdate(layerID);
      };
    })(layer_id);
  }
  chk_unchk_li.appendChild(chk_all);

  unchk_all.type = 'button';
  unchk_all.className = "chk_unchk_btn btn btn-default";
  unchk_all.style.float = "right";
  unchk_all.value = 'RESET';

  unchk_all.onclick = (function(layerID) {
    return function() {
      uncheckAllandUpdate(layerID);
    };
  })(layer_id);

  chk_unchk_li.appendChild(unchk_all);

  menu.insertBefore(chk_unchk_li, document.getElementById(div_id.left_upper_list));
}

function afterChangingCheck(){
  // LOG("afterChangingCheck");
  update_printed_features();
  clearAnalysis();
  // refresh(); //All whole -> features And remove Anlaysis mf.
  drawFeatures();
}

function checkAllandUpdate(layer_id) {
  // LOG("checkAllandUpdate", layer_id);
  var features = buffer.getFeatureIDsByLayerID(layer_id);
  for (var feature_id in features){
    list_maker.turnOnFeature(layer_id, feature_id);
    var ft = buffer.getFeature(layer_id, feature_id);
    stinuum.mfCollection.add(ft);
  }

  printFeaturesList(layer_id);
  afterChangingCheck();
}

function uncheckAllandUpdate(layer_id) {
  // LOG("uncheckAllandUpdate", layer_id);
  var features = buffer.getFeatureIDsByLayerID(layer_id);
  for (var feature_id in features){
    list_maker.turnOffFeature(layer_id, feature_id);
    var ft = buffer.getFeature(layer_id, feature_id);
    stinuum.mfCollection.remove(ft);
  }

  printFeaturesList(layer_id);
  afterChangingCheck();
}

function update_printed_features(){
  var layer_features = list_maker.getDivAllFeaturesAreTurnedOn();
  var list_div = document.getElementById(div_id.printed_features);
  list_div.innerHTML = "";
  
  if (layer_features) list_div.appendChild(layer_features);
}

function getServerEachData(layer_id){
  connector.uploadServerData2(layer_id);
  // var serverDataCount = buffer.getServerDataCount(layer_id)
  // // var href_list = connector.selectData[layer_id].slice(serverDataCount+1, 11+10)
  // // console.log(href_list.length)
  // if (connector.selectData[layer_id].length - serverDataCount >= 10){
  //   // var href_list = connector.selectData[layer_id].slice(serverDataCount+1, serverDataCount+1+10)
  //   var href_list = connector.selectData[layer_id].
  //   console.log(href_list, connector.selectData[layer_id], serverDataCount)
  //   connector.uploadServerData2(layer_id, href_list);
  // }else{
  //   var href_list = connector.selectData[layer_id].slice(serverDataCount)
  //   console.log(href_list, connector.selectData[layer_id], serverDataCount)
  //   connector.uploadServerData2(layer_id, href_list);
  //
  // }
  // console.log( buffer.getServerDataCount(layer_id), connector.selectData[layer_id].length)
}
/*
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
            stinuum.mfCollection.add(data);
        } else {
            checked[i].checked = true;
            stinuum.mfCollection.add(data);
        }
    }

    if (printedLayerList.contains(layerID)) {

        var layer_checked = document.getElementById(layerID);
        var index = printedLayerList.indexOf(layerID);
        bool_printedLayerList[index] = 1;
        layer_checked.checked = true;

    }

    cleanGraphDIV();

    drawFeatures();
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
        var data = getBuffer([feature_layer, feature_name]);
        if (checked[i].checked == true) {
            checked[i].checked = false;
            stinuum.mfCollection.remove(data);
        } else {
            stinuum.mfCollection.remove(data);
        }
    }
    if (printedLayerList.contains(layerID)) {
        var layer_checked = document.getElementById(layerID);
        layer_checked.checked = false;
        var index = printedLayerList.indexOf(layerID);
        bool_printedLayerList[index] = 0;
    }
    cleanGraphDIV();
    drawFeatures();
}
*/