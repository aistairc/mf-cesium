/**
- [url]/$ref : get featurelayers
- [url]/[layer]/$ref : get features list, (e.g. [layer] : FeatureLayers('Typhoon2016'))
- [url]/[layer]/[feature]?token = [token] : get moving feature json (e.g. [feature] : features('Typhoon2016000023'))
*/
function ServerConnector(){
    this.on = false; //is Server connected?
    this.server_url;
    this.token;
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

    url += "/$ref";
    var promise = this.requestData(url);
    this.turnOnLoading();
    var connector = this;
    promise.then(function(text){
        var json_object = JSON.parse(text);
        for (var j = 0 ; j < json_object.url.length ; j++){
            var layer_id = json_object.url[j].split("\'")[1];
            buffer.createLayer(layer_id, true);
        }

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

ServerConnector.prototype.requestFeatureObject = function(url) {
    return new Promise(function(resolved, rejected) {
        var xhr = createCORSRequest('GET', url);
        if (!xhr) {
            alert('CORS not supported');
            return;
        }
        xhr.onload = function() {
            //get_features_progress = get_features_progress + 1;
            var text = xhr.responseText;
            var json_object = JSON.parse(text);
            resolved(json_object);
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
            //get_features_progress = get_features_progress + 1;
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

ServerConnector.prototype.getFeaturesByLayerID = function(layer_id, layer_buffer, callback){
    var features_url = this.server_url + "/FeatureLayers(\'" + layer_id + "\')" + "/$ref" ;
    var promise = this.requestData(features_url);
    var connector = this;
    this.turnOnLoading(layer_id);
    promise.then(function(text){
        var json_object = JSON.parse(text);
        var promises = [];
        for(var i = 0 ; i < json_object.url.length ; i++){
            var feature_url = connector.server_url + "/FeatureLayers(\'" + layer_id + "\')/" + json_object.url[i] + "?token=" + connector.token;
            LOG("request feature : ", feature_url);
            var feature_promise = connector.requestFeatureObject(feature_url);
            promises.push(feature_promise);
            feature_promise.then(function(feature_object){
                layer_buffer[feature_object.properties.name] = feature_object;
                callback();
            })
            .catch(function(err) {
                console.log(err);
            });
        }

        Promise.all(promises).then(function (value){
            LOG(value);
            connector.turnOffLoading();
            LOG("layer_buffer in promise",layer_buffer);
        });
    })
    .catch(function(err) {
        console.log(err);
    });
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



