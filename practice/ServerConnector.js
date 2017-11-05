/**
- [url]/$ref : get featurelayers
- [url]/[layer]/$ref : get features list, (e.g. [layer] : FeatureLayers('Typhoon2016'))
- [url]/[layer]/[feature]?token = [token] : get moving feature json (e.g. [feature] : features('Typhoon2016000023'))
*/
function ServerConnector(){
    this.on = false; //is Server connected?
    this.server_url;
    this.token;
    this.nameArray = ['name', 'taxiId'];
}

ServerConnector.prototype.start = function(){
    var url = this.urlParam('url');
    var token = this.urlParam('token');

    if (url == '' || url == undefined){
        this.on = false;
        return -1;
    }
    this.on = true;
    this.server_url = url;
    this.token = token;
    document.getElementById('drop_zone').style.visibility = 'hidden';
    document.getElementById('drop_zone_bg').style.visibility = 'hidden';

    if (token == "local_server" ) url += "/index.json";
    else url += "/$ref";
    var promise = this.requestData(url);
    this.turnOnLoading();
    var connector = this;
    promise.then(function(text){
        var json_object = JSON.parse(text);
        for (var j = 0 ; j < json_object.url.length ; j++){
            var layer_id = json_object.url[j].split("\'")[1];
            buffer.createLayer(layer_id, true);
        }
        buffer.stBoundedBy = json_object.stBoundedBy;

        var list = list_maker.getLayerDivList();//printFeatureLayerList_local(layer_list_local);
        var list_div = div_id.left_upper_list;
        var printArea = document.getElementById(list_div);
        printArea.innerHTML = "";
        printArea.appendChild(list);
        LOG("layer load done");
        connector.turnOffLoading();
        changeMenuMode(MENU_STATE.layers);
    })
    .catch(function(err) {
        console.log(err);
    });
}

ServerConnector.prototype.urlParam = function(name, w) {
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

ServerConnector.prototype.promiseTimeout = function(feature_id, ms, promise){
  // Create a promise that rejects in <ms> milliseconds
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject(feature_id);
    }, ms)
  })

  // Returns a race between our timeout and the passed in promise
  return Promise.race([
    promise,
    timeout
  ]);
}

//Using Promise Pattern
ServerConnector.prototype.requestFeatureObject = function(url) {
    return new Promise(function(resolved, rejected) {
        var xhr = createCORSRequest('GET', url);
        if (!xhr) {
            alert('CORS not supported');
            return;
        }
        xhr.onload = function() {
            try{
                var text = xhr.responseText;                
                var json_object = JSON.parse(text);
                resolved(json_object);
            }
            catch (e) {
                LOG(e);
                rejected('parseError');
            }
        };
        xhr.onerror = function() {
            alert('Woops, there was an error making the request.');
        };
        xhr.send();
    });
};

ServerConnector.prototype.requestData = function(url) {
    return new Promise(function(resolved, rejected) {
        var xhr = createCORSRequest('GET', url);
        if (!xhr) {
            alert('CORS not supported');
            return;
        }
        xhr.onload = function() {
            var text = xhr.responseText;
            resolved(text);
        };
        xhr.onerror = function() {
            alert('Woops, there was an error making the request.');
        };
        xhr.send();

    });
};

ServerConnector.prototype.turnOnLoading = function(layer_id = 'layers'){
    document.getElementById(div_id.server_state).style.visibility = 'visible';

    var middle = document.createElement('div');
    middle.style = "display: table-cell;    vertical-align: middle;";

    var text = document.createElement('div');
    text.innerText = 'Loading ' + layer_id.toString() +  ' ...';
    text.style = "width: 100%; font-size:50px; margin-bottom : 10px;";

    middle.appendChild(text);

    var icon = document.createElement('i');
    icon.className = "fa fa-spinner fa-spin";
    icon.style = "margin-left: auto; margin-right: auto; font-size:50px";
    middle.appendChild(icon);

    document.getElementById(div_id.server_state).appendChild(middle);
}

ServerConnector.prototype.turnOffLoading = function(){
    document.getElementById(div_id.server_state).style.visibility = 'hidden';
    document.getElementById(div_id.server_state).innerHTML = '';
}

ServerConnector.prototype.getOneFeature = function(layer_id, feature_id, layer_buffer, callback){
    this.turnOnLoading(feature_id);
    var connector = this;
    var feature_url = connector.server_url + "/FeatureLayers(\'" + layer_id + "\')/" + feature_id + "?token=" + connector.token;
    let promise = this.requestFeatureObject(feature_url);
    promise.then(function(json_object){
        for (var name_i = 0 ; name_i < connector.nameArray.length ; name_i++){
            var id_value = connector.nameArray[name_i];
            if (json_object.properties[id_value] != undefined){
                json_object.properties.name = json_object.properties[id_value];
                layer_buffer[json_object.properties.name] = json_object; 
                
                connector.turnOffLoading();
                callback();
                break;
            }
        }
        if (json_object.properties.name == undefined){
            // Cannot come here
            LOG(json_object.properties);
            throw new Error("no name in feature");
        }
    })
    .catch(function(err){
        LOG(err);
        return -1;
    })
}

ServerConnector.prototype.getFeaturesByLayerID = function(layer_id, layer_buffer, callback){
    var features_url = this.server_url + "/FeatureLayers(\'" + layer_id + "\')";
    
    if (this.token == "local_server") features_url += "/index.json";
    else features_url += "/$ref" ;

    let promise = this.requestData(features_url);
    var connector = this;
    this.turnOnLoading(layer_id + " List");
    promise.then(function(text){
        var json_object = JSON.parse(text);
        let promises = [];
        for(var i = 0 ; i < json_object.url.length ; i++){
            let feature_url;
            if (connector.token == "local_server"){
                feature_url = connector.server_url + "/FeatureLayers(\'" + layer_id + "\')/" + json_object.url[i] + ".json";
            }
            else
                feature_url = connector.server_url + "/FeatureLayers(\'" + layer_id + "\')/" + json_object.url[i] + "?token=" + connector.token;
            LOG("request feature : ", feature_url);
            var feature_promise = connector.promiseTimeout(json_object.url[i], 5000, connector.requestFeatureObject(feature_url));//connector.requestFeatureObject(feature_url);
            promises.push(feature_promise);
            
            /*
            feature_promise.then(function(feature_object){
                for (var name_i = 0 ; name_i < connector.nameArray.length ; name_i++){
                    var id_value = connector.nameArray[name_i];
                    if (feature_object.properties[id_value] != undefined){
                        feature_object.properties.name = feature_object.properties[id_value];
                        layer_buffer[feature_object.properties.name] = feature_object;    
                        //callback();
                        break;    
                    }
                }
                if (feature_object.properties.name == undefined){
                    // Cannot come here
                    LOG(feature_object.properties);
                    throw new Error("no name in feature");
                }
            })
            feature_promise.catch(function(err) {
                console.log(err);
                if (err == 'timeOut'){

                }
                else if (err == 'parseError'){

                }
            });
            */
        }

        Promise.all(promises.map(reflect)).then(function (value){
            let success = value.filter(x => x.status === "resolved");
            for (let i = 0 ; i < success.length ; i++){
                var feature_object = success[i].v;
                for (var name_i = 0 ; name_i < connector.nameArray.length ; name_i++){
                    var id_value = connector.nameArray[name_i];
                    if (feature_object.properties[id_value] != undefined){
                        feature_object.properties.name = feature_object.properties[id_value];
                        layer_buffer[feature_object.properties.name] = feature_object;
                        //callback();
                        break;    
                    }
                } 
            }

            let failure = value.filter(x => x.status === "rejected");
            for (let i = 0 ; i < failure.length ; i++){
                if (failure[i].e == "parseError") {

                }
                else{
                    layer_buffer[failure[i].e] = {
                        empty : true
                    };    
                }
                
            }
            
            LOG("Promise.all : ",value);
            connector.turnOffLoading();
            callback();
            LOG("layer_buffer in promise",layer_buffer);
            connector.promises = [];
        });
    })
    .catch(function(err) {
        LOG("Load features in Layer Reject", err);
    });
}

function reflect(promise){
    return promise.then(function(v){ return {v:v, status: "resolved" }},
                        function(e){ return {e:e, status: "rejected" }});
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
function download(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}
*/
