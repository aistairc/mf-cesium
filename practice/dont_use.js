
/*
function getFeatures_local(layerID, features_list) {
  LOG("getFeatures_local")
  var features = [];
  var printFeatures_list = [];
  var getdata;

  if(!printedLayerList.contains(layerID)){
    printedLayerList.push(layerID);
    var index = printedLayerList.indexOf(layerID);
    bool_printedLayerList[index] = 1;
  }

  var layerlist = document.getElementById(div_id.printed_features);
  layerlist.innerHTML = "";
  layerlist.appendChild(printPrintedLayersList());
  var list = printFeatures_local(layerID, features_list, "features");
  var printArea = document.getElementById('featureLayer');
  his_features = list;
  printArea.innerHTML = "";
  printArea.appendChild(list);
  printMenuState = MENU_STATE.features;
  drawFeatures();
}

function printFeatures_local(layerID, features_list, id) { //피쳐레이어아이디,
  LOG("printFeatures_local")
  var printedLayer = document.getElementById('layer_list');
  var property_panel = document.getElementById("property_panel");
  var target = document.createElement('ul');

  var printState = document.getElementById('printMenuState');
  var menu = document.getElementById('menu_list');
  var uploadButton = document.getElementById('uploadButton');

  printedLayer.style.visibility = "visible";
  property_panel.style.visibility = "hidden";

  //check_button = check_all;
  target.className = "list-group-item";
  printMenuState = MENU_STATE.features;

  printState.innerText = printMenuState;
  for (var i = 0; i < features_list.length; i++) {

    var data = buffer.getBuffer([layerID, features_list[i]]);
    var li = document.createElement("li");
    var a = document.createElement("a");
    var ul = document.createElement("ul");
    var chk = document.createElement("input");
    var span = document.createElement("span");
    var div = document.createElement("div");

    //span.className = "input-group-addon";
    div.className = "input-group";
    //li.className = "list-group-item";
    ul.className = "list-group";
    li.role = "presentation";


    a.innerText =features_list[i].properties.name;
    a.onclick = (function(layer, feature) {
      return function() {
        removeCheckAllandUnCheckBtn();
        getFeature(layer, feature);
      }
    })(layerID, features_list[i].properties.name);

    chk.type = "checkbox";
    chk.checked = "true";
    chk.name = 'chkf[]';

    chk.id = features_list[i].properties.name + "##" + layerID;
    chk.onclick = (function() {
      return function() {
        drawFeatures();
      }
    })();

    div.appendChild(chk);
    div.appendChild(a);

    li.appendChild(div);
    target.appendChild(li);

  }

  his_features = target;

  return target;
}



function printFeatureLayerList_local(arr) {
  LOG("printFeatureLayerList_local");
  printMenuState = "LAYER";
  var printState = document.getElementById('printMenuState');
  printState.innerText = printMenuState;
  var target = document.getElementsByClassName("vertical");
  var upper_ul = document.createElement('ul');
  //upper_ul.className = "list-group-item";
  console.log(arr);
  for (var i = 0; i < arr.length; i++) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    var ul = document.createElement('ul');

    ul.id = arr[i];
    a.innerText = arr[i];

    var data = getBuffer([arr[i]]);//the single layer data. coontains several feature
    var feature_list = [];
    for(var j in data){
      feature_list.push(data[j]);
    }
    a.onclick = (function(id, feature) {
      return function() {
        getFeatures_local(id,feature);
        printCheckAllandUnCheck();
      };
    })(arr[i], feature_list);
    getFeatures_local(arr[i],feature_list);
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
*/


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


/*
var request1 = function(url) {
    return new Promise(function(resolved, rejected) {
        var xhr = createCORSRequest('GET', url);
        if (!xhr) {
            alert('CORS not supported');
            return;
        }
        xhr.onload = function() {
            var text = xhr.responseText;
            var arr = JSON.parse("[" + text + "]");
            arr = $.map(arr[0], function(el) {
                return el
            });
            resolved(arr);
        };
        xhr.onerror = function() {
            alert('Woops, there was an error making the request.');
        };
        xhr.send();
    });
};

var request2 = function(url) {
    return new Promise(function(resolved, rejected) {
        var xhr = createCORSRequest('GET', url);
        if (!xhr) {
            alert('CORS not supported');
            return;
        }

        xhr.onprogress = function() {
            console.log('LOADING', xhr.readyState); // readyState will be 3
        };


        xhr.onload = function() {
            //console.log('DONE', xhr.readyState);
            var text = xhr.responseText;
            var arr = JSON.parse("[" + text + "]");

            arr = $.map(arr[0], function(el) {
                return el
            });
            resolved(arr);
        };

        xhr.onerror = function() {
            alert('Woops, there was an error making the request.');
        };
        xhr.send();

        xhr.addEvent
    });
};
*/

/*
function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }

    url = url.split("?" + name + "=");

    return url[1];
}

function getFeatures(url, layerID) {
    var features;

    var _list = [];
    var promise = request2(url);
    var promise_list = [];
    var get_data;
    var serverState = document.getElementById('serverState');
    serverState.style.visibility = "visible";
    serverState.innerText = "loading";
    var parse_name = parse_layer_name(layerID);

    if(!printedLayerList.contains(layerID)){

      printedLayerList.push(layerID);
      var index = printedLayerList.indexOf(layerID);
      bool_printedLayerList[index] = 1;
    }
    promise.then(function(arr) {

            features = arr;
            for (var i = 0; i < features.length; i++) {
                if (getBuffer([layerID, features[i]]) == null) {

                    _list.push(features[i]);
                    var new_url = url.replace("$ref", "");
                    new_url += features[i] + "?token=" + readCookie('token');
                    promise_list.push(request3(new_url));
                }

            }

            if (promise_list.length == 0) { //이미 불러온 적이 있다
              var layerlist = document.getElementById(div_id.printed_features);
              layerlist.innerHTML = "";
              layerlist.appendChild(printPrintedLayersList());
              var serverState = document.getElementById('serverState');
              serverState.style.visibility = "hidden";
              serverState.innerText = "finish";
                var new_url = url.replace("$ref", "");
                var list = printFeatures(layerID, features, "features");
                var printArea = document.getElementById('featureLayer');
                his_features = list;
                printArea.innerHTML = "";
                printArea.appendChild(list);
                printMenuState = MENU_STATE.features;
                drawFeatures();
            } else {
                Promise.all(promise_list).then(function(values) {

                  var serverState = document.getElementById('serverState');
                  serverState.style.visibility = "visible";
                  serverState.innerText = "finish";
                    get_data = values;
                    for (var i = 0; i < get_data.length; i++) {
                        updateBuffer([layerID, features[i]], get_data[i]);
                    }

                    var new_url = url.replace("$ref", "");
                    var list = printFeatures(layerID, features, "features");

                    var printArea = document.getElementById('featureLayer');
                    his_features = list;
                    printArea.innerHTML = "";
                    printArea.appendChild(list);
                    var layerlist = document.getElementById(div_id.printed_features);
                    layerlist.innerHTML = "";
                    layerlist.appendChild(printPrintedLayersList());

                    printMenuState = MENU_STATE.features;
                    drawFeatures();
                    setTimeout(function(){serverState.style.visibility = "hidden";},2000);

                });
            }

        })
        .catch(function(err) {
            console.log(err);
        });

}

function getFeature(layerID, featureID) {
    default_set = true;
    var data = getBuffer([layerID, featureID]);
    var list = printFeature(featureID, data, "feature");
    his_feature = list;
    var printArea = document.getElementById('featureLayer');
    var printProper = document.getElementById('property');
    printProper.innerHTML = "";
    var pro = printProperty(data)
    printProper.appendChild(pro);
    printArea.innerHTML = "";
    printArea.appendChild(list);
    printMenuState = "feature";
}





function writeCookie(name, value, days) {
    var date, expires;
    if (days) {
        date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var i, c, ca, nameEQ = name + "=";
    ca = document.cookie.split(';');
    for (i = 0; i < ca.length; i++) {
        c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return '';
}

function getToken(url) {
    var token_result;
    if (readCookie('token') !== '') {
        token_result = "?token=" + readCookie('token');
    } else {
        console.log("not have");
        var token = prompt("token", "");
        token_result = "?token=" + token;
        writeCookie('token', token, 1);
    }
    return token_result;
}

function printFeatureLayerList(arr, url, id) { //출력할피쳐리스트, 베이스주소, 출력할화면요소아이디
    printMenuState = "LAYER";
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

function printFeatures(layerID, features_list, id) { //피쳐레이어아이디,
    LOG("printFeatures");
    var printedLayer = document.getElementById('layer_list');
    var property_panel = document.getElementById("property_panel");
    var target = document.createElement('ul');
    var check_all = document.createElement('li');
    var chk_all = document.createElement('input');
    var unchk_all = document.createElement('input');
    var printState = document.getElementById('printMenuState');
    var menu = document.getElementById('menu_list');

    //printedLayer.style.visibility = "visible";
    printedLayer.style.visibility = "hidden";

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

    //menu.insertBefore(check_all, document.getElementById('featureLayer'));
    //check_button = check_all;
    target.className = "list-group-item";
    printMenuState = MENU_STATE.features;
    console.log(layerID);


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
                drawFeatures();
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
    //drawFeatures();

}

function printFeature(featureID, data, id) {
    //var chk_btn = document.getElementById('check_all_buttons');
    var printState = document.getElementById('printMenuState');
    var property_panel = document.getElementById('property_panel');
    var printedLayers = document.getElementById('layer_list');
    var target = document.createElement('ul');

    //printMenuState = 'feature';
    //chk_btn.parentNode.removeChild(chk_btn);
    printState.innerText = featureID;

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

    //li.className = "list-group-item";
    li.role = "presentation";
    li.style.marginLeft = "5%";
    li.style.display ="block";
    ul.id = name;
    //a.innerText = name;
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
      li_temp.style.display = "inline-block";
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



function getLayers() {
    var dropzone = document.getElementById("drop_zone");
    dropzone.style.visibility = "hidden";
    
    writeCookie('token', token);
    var featureLayers;
    var printFeatureLayer_list = [];

    promise.then(function(arr) {
            featureLayers = arr;
            for (var i = 0; i < featureLayers.length; i++) {
                //if (getBuffer([featureLayers[i]]) == null) {
                if (buffer.getFeatruesByLayerID(featureLayers[i]) == undefined) {
                    //updateBuffer([featureLayers[i]], null);
                    buffer.createLayer(featureLayers[i]);
                    printFeatureLayer_list.push(featureLayers[i]);
                }
            }
            url = url.replace("/$ref", "");
            var list = printFeatureLayerList(printFeatureLayer_list, url, "featureLayer");
            var printArea = document.getElementById('featureLayer');
            his_featurelayer = list;
            printArea.innerHTML = "";
            printArea.appendChild(list);
            printMenuState = "layer";

        })
        .catch(function(err) {
            console.log(err);
        });

}
function sendRequest() { //later we need to put url as parameter
    var url = "http://ec2-52-198-116-39.ap-northeast-1.compute.amazonaws.com:9876/";
    var featureLayers = new Array();
    var feature = new Array();
    var featureProperty;
    url += "$ref";
    var promise = request1(url);
    promise.then(function(arr) {
            //featureLayers = arr.splice(0,1);
            featureLayers = arr;
            var new_url = url.replace("$ref", "") + arr[0] + "/$ref";
            printFeatureLayerList(featureLayers, "featureLayers");
            return request2(new_url);
        })
        .catch(function() {
            console.log("error");
        })
        .then(function(arr) {
            feature = arr[1].splice(0, 1);
            var new_url = arr[0].replace("$ref", "") + feature[0];
            var token = prompt("token", "");
            new_url += "?token=" + token;
            return (request3(new_url));
        })
        .catch(function() {
            console.log("error");
        })
        .then(function(arr) {
            featureProperty = arr;
            console.log(arr);
        })
        .catch(function() {
            console.log("you do not get full properties without token");
        });

}



function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}



function getLayerOnlyForOneFeature(){
  var dropzone = document.getElementById("drop_zone");
  dropzone.style.visibility = "hidden";
  var url = urlParam('url');
  var token = urlParam('token');
  //var token = url_arr[1];
  console.log(url);
  console.log(token);
  if (url == '' || url == undefined){
    isServer = false;
    dropzone.style.visibility = "visible";
    printFileUploadButton();
    getLocalFile();
    return;
  }
  writeCookie('token', token);
  url += "/$ref";
  var featureLayers;
  var printFeatureLayer_list = [];
  var promise = request1(url);

  clearAnalysis('analysis', 'graph', 'radar');
  promise.then(function(arr) {
          featureLayers = arr;
          for (var i = 0; i < featureLayers.length; i++) {
              if (getBuffer([featureLayers[i]]) == null) {
                  updateBuffer([featureLayers[i]], null);
                  printFeatureLayer_list.push(featureLayers[i]);
              }
          }
          url = url.replace("/$ref", "");
          var list = printFeatureLayerList(printFeatureLayer_list, url, "featureLayer");
          var printArea = document.getElementById('featureLayer');
          his_featurelayer = list;
          printArea.innerHTML = "";
          printArea.appendChild(list);
          printMenuState = "layer";

      })
      .catch(function(err) {
          console.log(err);
      });
}
*/



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
