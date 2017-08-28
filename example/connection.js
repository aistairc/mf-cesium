var buffer = {};
var get_features_progress = 0;
var get_total_progress = 0;
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

function getBuffer(id) {
    if (id.length == 1) {
        if (buffer.hasOwnProperty(id[0])) {
            return buffer[id[0]];
        }
    } else if (id.length == 2) {

      if (buffer.hasOwnProperty(id[0])) {
          var temp = buffer[id[0]];
          if (temp.hasOwnProperty(id[1])) {
              return temp[id[1]];
          }

      }


    }
    return null;
}

function updateBuffer(id, feature, bool) {
    if (bool == true) {
        if (id.length == 1) {
            if (!buffer.hasOwnProperty(id[0])) {
                buffer[id[0]] = {};
            }
        } else if (id.length == 2) {
            if (!buffer.hasOwnProperty(id[0])) {
                buffer[id[0]] = {};
                buffer[id[0]][id[1]] = {};
                try{
                  JSON.parse(feature);
                  buffer[id[0]][id[1]] = JSON.parse(feature);
                  console.log(buffer[id[0]][id[1]]);
                }
                catch(e) {
                  buffer[id[0]][id[1]] =feature;
               }


                //buffer[id[0]][id[1]] = feature;
            } else {
                if (!buffer[id[0]].hasOwnProperty(id[1])) {
                    buffer[id[0]][id[1]] = {};
                    try{
                      buffer[id[0]][id[1]] = JSON.parse(feature);
                    }
                    catch(e){
                      buffer[id[0]][id[1]] = feature;
                    }


                }
            }
        }
    } else {
        if (id.length == 1) {
            if (getBuffer(id) !== null) {
                delete buffer[id[0]];
            }
        } else if (id.length == 2) {
            if (getBuffer(id) !== null) {
                delete buffer[id[0]][id[1]];
            }
        }
    }

}
var urlParam = function(name, w) {
    w = w || window;
    var rx, val;
    if (name == "url") {
        rx = new RegExp('[\&|\?]' + 'url=' + '([^\&\#]+)[\&|/]');
        val = w.location.search.match(rx);

    } else if (name == 'token') {
        rx = new RegExp('[\&|\?]' + 'token=' + '([^\&\#]+)');
        val = w.location.search.match(rx);
    }

    return !val ? '' : val[1];
}
var isServer =true;

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

  setAnalysisDIV('analysis', 'graph', 'radar');
  promise.then(function(arr) {
          featureLayers = arr;
          for (var i = 0; i < featureLayers.length; i++) {
              if (getBuffer([featureLayers[i]]) == null) {
                  updateBuffer([featureLayers[i]], null, true);
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
function getLayers() {
    //var url = window.location.href;
    //var url_arr = url.split('?token=');

    //url = "http://ec2-52-198-116-39.ap-northeast-1.compute.amazonaws.com:9876/";

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

    setAnalysisDIV('analysis', 'graph', 'radar');
    promise.then(function(arr) {
            featureLayers = arr;
            for (var i = 0; i < featureLayers.length; i++) {
                if (getBuffer([featureLayers[i]]) == null) {
                    updateBuffer([featureLayers[i]], null, true);
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
              var layerlist = document.getElementById('list');
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
                printMenuState = "features";
                drawFeature();
            } else {
                Promise.all(promise_list).then(function(values) {

                  var serverState = document.getElementById('serverState');
                  serverState.style.visibility = "visible";
                  serverState.innerText = "finish";
                    get_data = values;
                    for (var i = 0; i < get_data.length; i++) {

                        updateBuffer([layerID, features[i]], get_data[i], true);

                    }

                    var new_url = url.replace("$ref", "");
                    var list = printFeatures(layerID, features, "features");

                    var printArea = document.getElementById('featureLayer');
                    his_features = list;
                    printArea.innerHTML = "";
                    printArea.appendChild(list);
                    var layerlist = document.getElementById('list');
                    layerlist.innerHTML = "";
                    layerlist.appendChild(printPrintedLayersList());

                    printMenuState = "features";
                    drawFeature();
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
        var date = new Date();
        var xhr = createCORSRequest('GET', url);
        if (!xhr) {
            alert('CORS not supported');
            return;
        }

        xhr.onprogress = function() {
            console.log('LOADING', xhr.readyState); // readyState will be 3
        };


        xhr.onload = function() {
            console.log('DONE', xhr.readyState);
            var temp = new Date();
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
var request3 = function(url) {
    return new Promise(function(resolved, rejected) {

        var xhr = createCORSRequest('GET', url);
        if (!xhr) {
            alert('CORS not supported');
            return;
        }
        xhr.onload = function() {
            //get_features_progress = get_features_progress + 1;
            var serverState = document.getElementById('serverState');
            serverState.style.visibility = "visible";
            serverState.innerText = "loading";
            var text = xhr.responseText;
            resolved(text);
        };
        xhr.onerror = function() {
            alert('Woops, there was an error making the request.');
        };
        xhr.send();

    });
};

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
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
