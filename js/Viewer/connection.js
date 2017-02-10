function getLayers() {
    var url = "http://ec2-52-198-116-39.ap-northeast-1.compute.amazonaws.com:9876/";
    url += "$ref";
    var featureLayers;
    var promise = request1(url);

    promise.then(function(arr) {
            featureLayers = arr;
            url = url.replace("/$ref", "");
            printFeatureLayerList(featureLayers, url, "featureLayers");
        })
        .catch(function() {
            console.log("error");
        });

}

function getFeatures(url, feature, layerID) {
    var features;
    console.log(url);
    var promise = request2(url);
    promise.then(function(arr) {
            features = arr[1];
            var new_url = url.replace("$ref", "");
            printFeatures(layerID, features, new_url, "features");
        })
        .catch(function() {
            console.log("error");
        });

}

function getFeature(url) {
    //var url = "http://ec2-52-198-116-39.ap-northeast-1.compute.amazonaws.com:9876/";
    var feature;
    if (readCookie('token') !== '') {
        url += "?token=" + readCookie('token');
    } else {
        console.log("not have");
        var token = prompt("token", "");
        url += "?token=" + token;
        writeCookie('token', token, 1);
    }
    console.log(url);
    var promise = request3(url);
    promise.then(function(arr) {
            feature = arr;
            printFeature(feature, "feature");
            return arr;
        })
        .catch(function() {
            console.log("error");
        });
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
            //var title = getTitle(text);

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
        xhr.onload = function() {
            var text = xhr.responseText;
            var arr = JSON.parse("[" + text + "]");

            arr = $.map(arr[0], function(el) {
                return el
            });
            var info = new Array();
            info.push(url);
            info.push(arr);
            resolved(info);
        };

        xhr.onerror = function() {
            alert('Woops, there was an error making the request.');
        };
        xhr.send();

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
            console.log(feature);
            var new_url = arr[0].replace("$ref", "") + feature[0];
            var token = prompt("token", "");
            new_url += "?token=" + token;
            console.log(new_url);
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
