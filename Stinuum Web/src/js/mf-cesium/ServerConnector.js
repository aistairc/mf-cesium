/**
- [url]/$ref : get featurelayers
- [url]/[layer]/$ref : get features list, (e.g. [layer] : FeatureLayers('Typhoon2016'))
- [url]/[layer]/[feature]?token = [token] : get moving feature json (e.g. [feature] : features('Typhoon2016000023'))
*/
 /**
    *      1. token 발급
    *          curl -v -c ./cookie-dir/cookie-file-csrf https://dps.aaic.hpcc.jp/pntml/csrf
    *      2. login
    *          curl -v -L -b ./cookie-dir/cookie-file-csrf -c ./cookie-dir/cookie-file2 --data @./auth.query -H "X-XSRF-TOKEN: `cat ./cookie-dir/cookie-file-csrf | grep XSRF-TOKEN | awk '{print $NF}'`" https://dps.aaic.hpcc.jp/pntml/login
    *      3. GET Data
    *          curl -v -b ./cookie-dir/cookie-file2 -H "X-XSRF-TOKEN: `cat ./cookie-dir/cookie-file2 | grep XSRF-TOKEN | awk '{print $NF}'`" -H "Content-Type: application/json" -H "Accept: application/json" -X POST --data-binary @./collection_test.json https://dps.aaic.hpcc.jp/mf/collections
    *      4. logout
    *          curl -v -b ./cookie-dir/cookie-file2 -H "X-XSRF-TOKEN: `cat ./cookie-dir/cookie-file2 | grep XSRF-TOKEN | awk '{print $NF}'`" -X POST https://dps.aaic.hpcc.jp/pntml/logout
    * */

function ServerConnector() {
    this.on = false; //is Server connected?
}
ServerConnector.prototype.getCookie = function (name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
};

ServerConnector.prototype.start= function () {
    // alert(getCookie("LoginChecker"))
    // alert("start")
    // document.getElementById('drop_zone').style.visibility = 'hidden';
    // document.getElementById('drop_zone_bg').style.visibility = 'hidden';
    // this.turnOnLoading();
   

    // $.ajax({
    //     url: 'https://dpsdev.aaic.hpcc.jp/mf/collections/20191206/mfeatures/featureKeys',
    //     async: true,
    //     type: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'X-XSRF-TOKEN': getCookie("XSRF-TOKEN"),
    //         'Accept': '*/*',
    //         'Cookie': "SESSION="+getCookie("SESSION")+";"+" XSRF-TOKEN="+getCookie("XSRF-TOKEN")
    //     },
    //     success: function(data){
    //         console.log(data)
    //         alert(data);
    //         alert("보내기 성공");
    //     },
    //     error: function(err){
    //         alert("보내기 실패" + err);
    //     }
    // });
    // var LoginChecker = getCookie("LoginChecker")
    // // 1 connect server / 2 not connect server
    // if (LoginChecker == 1){
    //     console.log(JSON.parse(sessionStorage.foo))
    // }
    // else{
    //     console.log("not connect server")
    //     this.turnOffLoading()
    //     return -1
    // }
    // $.ajax({
    //     url: '/postTest',
    //     async: true,
    //     type: 'POST',
    //     data: {
    //         test: "hi"
    //     },
    //     dataType: 'json',
    //     success: function(data){
    //         console.log(data)
    //         alert(data);
    //         alert("보내기 성공");
    //     },
    //     error: function(err){
    //         alert("보내기 실패" + err);
    //     }
    // });
    // var url = this.urlParam('url');
    // var token = this.urlParam('token');

    // if (url == '' || url == undefined) {
    //     this.on = false;
    //     return -1;
    // }
    // this.on = true;
    // this.server_url = url;
    // this.token = token;
    // document.getElementById('drop_zone').style.visibility = 'hidden';
    // document.getElementById('drop_zone_bg').style.visibility = 'hidden';

    // url += "/$ref";
    // var promise = this.requestData(url);
    // this.turnOnLoading();
    // var connector = this;
    // promise.then(function (text) {
    //     var json_object = JSON.parse(text);
    //     for (var j = 0; j < json_object.url.length; j++) {
    //         var layer_id = json_object.url[j].split("\'")[1];
    //         buffer.createLayer(layer_id, true);
    //     }

    //     var list = list_maker.getLayerDivList();//printFeatureLayerList_local(layer_list_local);
    //     var list_div = div_id.left_upper_list;
    //     var printArea = document.getElementById(list_div);
    //     printArea.innerHTML = "";
    //     printArea.appendChild(list);
    //     LOG("layer load done");
    //     connector.turnOffLoading();
    //     changeMenuMode(MENU_STATE.layers);
    // })
    //     .catch(function (err) {
    //         console.log(err);
    //     });
}
// ServerConnector.prototype.starttest = function () {
//
//     document.getElementById('drop_zone').style.visibility = 'hidden';
//
//     document.getElementById('drop_zone_bg').style.visibility = 'hidden';
//
//     this.turnOnLoading();
//
//     var json_object = {
//         "type": "FeatureCollection",
//         "features": [{
//             "id": "20191206",
//             "type": "Feature",
//             "geometry": {
//                 "type": "LineString",
//                 "coordinates": [
//                     [139.77667514, 35.6191432051, 0.0505016371608],
//                     [139.776976061, 35.6194443003, 1.78208994865]
//                 ]
//             },
//             "properties": {
//                 "spatial": [
//                     [139.77667514, 35.6191432051, 0.0505016371608],
//                     [139.776976061, 35.6194443003, 1.78208994865]
//                 ],
//                 "datetimes": ["2019-12-06T01:51:05.420+0000", "2019-12-06T06:18:15.510+0000"]
//             }
//         }, {
//             "id": "20200106",
//             "type": "Feature",
//             "geometry": {
//                 "type": "LineString",
//                 "coordinates": [
//                     [139.776635053, 35.6189622379, 8.762548305e-07],
//                     [139.777252059, 35.6194663726, 1.97042274475]
//                 ]
//             },
//             "properties": {
//                 "spatial": [
//                     [139.776635053, 35.6189622379, 8.762548305e-07],
//                     [139.777252059, 35.6194663726, 1.97042274475]
//                 ],
//                 "datetimes": ["2019-12-06T00:00:00.000+0000", "2019-12-06T05:03:35.828+0000"]
//             }
//         }, {
//             "id": "20191125",
//             "type": "Feature",
//             "geometry": {
//                 "type": "LineString",
//                 "coordinates": [
//                     [140.036323522, 35.6454456165, 0.954877018929],
//                     [140.036327723, 35.6454479944, 1.35063505173]
//                 ]
//             },
//             "properties": {
//                 "spatial": [
//                     [140.036323522, 35.6454456165, 0.954877018929],
//                     [140.036327723, 35.6454479944, 1.35063505173]
//                 ],
//                 "datetimes": ["2019-12-06T01:26:28.530+0000", "2019-12-06T01:52:18.410+0000"]
//             }
//         }, {
//             "id": "2019120401_polygon",
//             "type": "Feature",
//             "geometry": {
//                 "type": "LineString",
//                 "coordinates": [
//                     [139.776386151, 35.6191770094, 0.0],
//                     [139.776850458, 35.6197744253, 0.030235638842]
//                 ]
//             },
//             "properties": {
//                 "spatial": [
//                     [139.776386151, 35.6191770094, 0.0],
//                     [139.776850458, 35.6197744253, 0.030235638842]
//                 ],
//                 "datetimes": ["2019-12-06T01:14:18.394+0000", "2019-12-06T01:57:37.070+0000"]
//             }
//         }, {
//             "id": "2019120402",
//             "type": "Feature",
//             "geometry": {
//                 "type": "LineString",
//                 "coordinates": [
//                     [139.776492742, 35.6191165898, 1.0],
//                     [139.777003662, 35.6196862661, 2.10232996941]
//                 ]
//             },
//             "properties": {
//                 "spatial": [
//                     [139.776492742, 35.6191165898, 1.0],
//                     [139.777003662, 35.6196862661, 2.10232996941]
//                 ],
//                 "datetimes": ["2019-12-06T01:14:18.798+0000", "2019-12-06T01:34:07.500+0000"]
//             }
//         }, {
//             "id": "20191211",
//             "type": "Feature",
//             "geometry": {
//                 "type": "LineString",
//                 "coordinates": [
//                     [139.77667491, 35.6191427554, 0.0515614561737],
//                     [139.776975474, 35.6194402626, 1.76304256916]
//                 ]
//             },
//             "properties": {
//                 "spatial": [
//                     [139.77667491, 35.6191427554, 0.0515614561737],
//                     [139.776975474, 35.6194402626, 1.76304256916]
//                 ],
//                 "datetimes": ["2019-12-06T03:08:48.997+0000", "2019-12-06T03:08:49.495+0000"]
//             }
//         }, {
//             "id": "2019120401",
//             "type": "Feature",
//             "geometry": {
//                 "type": "LineString",
//                 "coordinates": [
//                     [139.776483309, 35.6190849063, 0.66839402914],
//                     [139.776873659, 35.619756226, 1.99815499783]
//                 ]
//             },
//             "properties": {
//                 "spatial": [
//                     [139.776483309, 35.6190849063, 0.66839402914],
//                     [139.776873659, 35.619756226, 1.99815499783]
//                 ],
//                 "datetimes": ["2019-12-06T01:14:19.000+0000", "2019-12-06T01:57:27.650+0000"]
//             }
//         }, {
//             "id": "20191211_polygon",
//             "type": "Feature",
//             "geometry": {
//                 "type": "LineString",
//                 "coordinates": [
//                     [139.776666395, 35.6192278997, -0.582079529762],
//                     [139.77693277, 35.6194812229, 0.0]
//                 ]
//             },
//             "properties": {
//                 "spatial": [
//                     [139.776666395, 35.6192278997, -0.582079529762],
//                     [139.77693277, 35.6194812229, 0.0]
//                 ],
//                 "datetimes": ["2019-12-06T15:00:02.020+0000", "2019-12-06T08:00:10.100+0000"]
//             }
//         }, {
//             "id": "2019061403",
//             "type": "Feature",
//             "geometry": {
//                 "type": "LineString",
//                 "coordinates": [
//                     [140.035738325, 35.6451599701, 0.720601797104],
//                     [140.036347496, 35.6455789404, 2.16029310226]
//                 ]
//             },
//             "properties": {
//                 "spatial": [
//                     [140.035738325, 35.6451599701, 0.720601797104],
//                     [140.036347496, 35.6455789404, 2.16029310226]
//                 ],
//                 "datetimes": ["2019-12-06T02:44:21.331+0000", "2019-12-06T02:53:11.340+0000"]
//             }
//         }]
//     }
//     // var json_object = JSON.parse(text);
//     // for (var j = 0; j < json_object.url.length; j++) {
//     //     var layer_id = json_object.url[j].split("\'")[1];
//     //     buffer.createLayer(layer_id, true);
//     // }
//     updateBuffer_local("1", json_object)
//
//     var list = list_maker.getLayerDivList();//printFeatureLayerList_local(layer_list_local);
//     var list_div = div_id.left_upper_list;
//     var printArea = document.getElementById(list_div);
//     printArea.innerHTML = "";
//     printArea.appendChild(list);
//     LOG("layer load done");
//     connector.turnOffLoading();
//     changeMenuMode(MENU_STATE.layers);
//
// }
ServerConnector.prototype.urlParam = function (name, w) {
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
};

ServerConnector.prototype.requestFeatureObject = function (moving_feature_id, url) {
    return new Promise(function (resolved, rejected) {
        var xhr = createCORSRequest('GET', url);
        if (!xhr) {
            alert('CORS not supported');
            return;
        }
        xhr.onload = function () {
            //get_features_progress = get_features_progress + 1;
            var text = xhr.responseText;
            var json_object = JSON.parse(text);
            resolved({ "id": moving_feature_id, "response": json_object });
        };
        xhr.onerror = function () {
            alert('Woops, there was an error making the request.');
        };
        xhr.send();

    });
};

ServerConnector.prototype.requestData = function (url) {
    LOG("Connect url[" + url + "]");
    return new Promise(function (resolved, rejected) {
        var xhr = createCORSRequest('GET', url);
        if (!xhr) {
            alert('CORS not supported');
            return;
        }
        xhr.onload = function () {
            //get_features_progress = get_features_progress + 1;
            var text = xhr.responseText;
            resolved(text);
        };
        xhr.onerror = function (ev) {
            LOG(ev);
            alert('Woops, there was an error making the request.');
        };
        xhr.send();
    });
};

ServerConnector.prototype.turnOnLoading = function (layer_id = 'layers') {
    document.getElementById(div_id.server_state).style.visibility = 'visible';

    var middle = document.createElement('div');
    middle.style = "display: table-cell;    vertical-align: middle;";

    var text = document.createElement('div');
    text.innerText = 'Loading ' + layer_id.toString() + ' ...';
    text.style = "width: 100%; font-size:50px; margin-bottom : 10px;";

    middle.appendChild(text);

    var icon = document.createElement('i');
    icon.className = "fa fa-spinner fa-spin";
    icon.style = "margin-left: auto; margin-right: auto; font-size:50px";
    middle.appendChild(icon);
    document.getElementById(div_id.server_state).appendChild(middle);
}


ServerConnector.prototype.turnOffLoading = function () {
    document.getElementById(div_id.server_state).style.visibility = 'hidden';
    document.getElementById(div_id.server_state).innerHTML = '';
}

ServerConnector.prototype.getFeaturesByLayerWithin = function (layer_id, layer_buffer, start, end, callback) {
    LOG("getFeaturesByLayerWithin")
    let connector = this;
    connector.turnOnLoading();
    let promises = [];
    let keys = Object.keys(layer_buffer);
    for (let i = 0; i < keys.length; i++) {
        let feature_url =
            connector.server_url +
            "/FeatureLayers(\'" + layer_id + "\')" +
            "/features(\'" + keys[i] + "\')" +
            "/?token=" + connector.token +
            "&$select=subTrajectory(" + encodeURIComponent(start.toISOString() + "," + end.toISOString()) + ")";
        LOG(feature_url);
        LOG(start.toISOString());
        LOG(end.toISOString());
        //connector.requestFeatureObject(keys[i], feature_url)
        let feature_promise = connector.requestFeatureObject(keys[i], feature_url);
        promises.push(feature_promise);
        feature_promise.then(function (v) {
            setMovingFeatureResponse(layer_buffer, v);
        }).catch(function (err) {
            console.log(err);
        });
    }
    Promise.all(promises).then(function (value) {
        connector.turnOffLoading();
        LOG("layer_buffer in promise", layer_buffer);
        callback();
    });
}

ServerConnector.prototype.getFeaturesByLayerID = function (layer_id, layer_buffer, callback) {
    var features_url = this.server_url + "/FeatureLayers(\'" + layer_id + "\')" + "/$ref";
    var promise = this.requestData(features_url);
    // var connector = this;
    // this.turnOnLoading(layer_id);
    // promise.then(function (text) {
    //     if (text) {
    //         var json_object = JSON.parse(text);
    //         var promises = [];
    //         for (var i = 0; i < json_object.url.length; i++) {
    //             // kitanishi change the way to get data
    //             //var feature_url = connector.server_url + "/FeatureLayers(\'" + layer_id + "\')/" + json_object.url[i] + "?token=" + connector.token;
    //             let feature_url =
    //                 connector.server_url +
    //                 "/FeatureLayers(\'" + layer_id + "\')/" +
    //                 json_object.url[i] +
    //                 "/temporalGeometry?token=" + connector.token + "&$select=";
    //             let feature_url_boundedby = feature_url + "boundedBy()";
    //             let feature_url_boundary = feature_url + "boundary()";
    //             let matches = json_object.url[i].match(/\('([^']+)'\)/);
    //             let moving_feature_id = "";
    //             if (matches) {
    //                 moving_feature_id = matches[1];
    //             }
    //             let feature_promise_boundedby = connector.requestFeatureObject(moving_feature_id, feature_url_boundedby);
    //             promises.push(feature_promise_boundedby);
    //             let feature_promise_boundary = connector.requestFeatureObject(moving_feature_id, feature_url_boundary);
    //             promises.push(feature_promise_boundary);
    //             feature_promise_boundedby.then(function (v) {
    //                 setMovingFeatureResponse(layer_buffer, v);
    //             })
    //                 .catch(function (err) {
    //                     console.log(err);
    //                 });
    //             feature_promise_boundary.then(function (v) {
    //                 setMovingFeatureResponse(layer_buffer, v);
    //             })
    //                 .catch(function (err) {
    //                     console.log(err);
    //                 });
    //         }
    //         Promise.all(promises).then(function (value) {
    //             LOG(value);
    //             LOG("layer_buffer in promise", layer_buffer);
    //             connector.turnOffLoading();
    //             callback();
    //         });
    //     } else {
    //         connector.turnOffLoading();
    //     }
    // })
    //     .catch(function (err) {
    //         console.log(err);
    //     });
}

function setMovingFeatureResponse(layer_buffer, v) {
    LOG(v);
    let mfjson = null;
    if (layer_buffer[v["id"]]) {
        mfjson = layer_buffer[v["id"]];
    } else {
        mfjson = { "type": "Feature" };
        mfjson["properties"] = { "name": v["id"] };
        mfjson["temporalGeometry"] = {};
        mfjson["temporalGeometry"]["interpolations"] = ["Linear"];
        mfjson["temporalGeometry"]["type"] = "MovingPoint";
    }
    if (v["response"]) {
        response = v["response"];
        if (response["boundary"] && response["boundary"]["coordinates"]) {
            let boundary = response["boundary"];
            mfjson["temporalGeometry"]["coordinates"] = boundary["coordinates"];
        } else if (response["boundedBy"]) {
            let boundedby = response["boundedBy"];
            mfjson["temporalGeometry"]["datetimes"] = [boundedby["begin"], boundedby["end"]];
            mfjson["mindatetime"] = new Date(boundedby["begin"]);
            mfjson["maxdatetime"] = new Date(boundedby["end"]);
        } else if (response["subTrajectory"]) {
            let subTrajectory = response["subTrajectory"];
            mfjson["temporalGeometry"] = subTrajectory["temporalGeometry"];
            mfjson["temporalProperties"] = subTrajectory["temporalProperties"];
            // kitanishi temporary
            if (mfjson["temporalGeometry"]["interpolation"]) {
                mfjson["temporalGeometry"]["interpolations"] = mfjson["temporalGeometry"]["interpolation"];
            }
        }
    }
    LOG(mfjson);
    layer_buffer[v["id"]] = mfjson;
}

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