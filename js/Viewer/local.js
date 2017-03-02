/*
function printFeatureLayerList_local(arr, url, id) {
    printMenuState = "layer";
    var printState = document.getElementById('printMenuState');
    printState.innerText = printMenuState;
    var target = document.getElementsByClassName("vertical");
    var upper_ul = document.createElement('ul');
    upper_ul.className = "list-group-item";

    for (var i = 0; i < arr.length; i++) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        var ul = document.createElement('ul');

        var new_url = url + "/" + arr[i] + ".json";

        ul.id = arr[i];
        a.innerText = arr[i];
        a.onclick = (function(url, id) {
            return function() {
                getFeatures_local(url, id);
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


function getLayer_local() {

    var baseURL = "../miniserver";
    readTextFile("../miniserver/featureLayer.json", function(text) {
        var data = JSON.parse(text);
        var printFeatureLayer_list = [];
        console.log(data['url']);
        for (var i = 0; i < data['url'].length; i++) {
            printFeatureLayer_list.push(data['url'][i]);
            updateBuffer([data['url'][i]], null, true);
        }
        var list = printFeatureLayerList_local(printFeatureLayer_list, baseURL, 'featureLayer');
        console.log(list);
        var print = document.getElementById('featureLayer');
        print.innerHTML = "";
        printMenuState = 'layer';
        print.appendChild(list);
        console.log(buffer);
    });
}

var read_local = function(url) {
    return new Promise(function(resolve, reject) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", url, true);
        rawFile.onload  = function(){
            resolve(rawFile.responseText);
        };
        rawFile.send(null);
    });
}

function getFeatures_local(url, layerID) {
    var features;
    var promise_list = [];
    var printFeatures_list = [];
    var promise = read_local(url);
    var getdata;
    console.log(url);
    promise.then(function(arr) {
        features = JSON.parse(arr);
        for (var i = 0; i < features['features'].length; i++) {
            if (getBuffer([layerID, features['features'][i]]) == null) {
                printFeatures_list.push(features['features'][i]);
                var new_url = url.replace(".json", "");
                new_url += "/" + features['features'][i] + ".json";
                console.log(new_url);
                promise_list.push(read_local(new_url));
            }

        }
        if (promise_list.length == 0) { //이미 불러온 적이 있다
            var list = printFeatures(layerID, features['features'], "features");
            var printArea = document.getElementById('featureLayer');
            his_features = list;
            printArea.innerHTML = "";
            printArea.appendChild(list);
            printMenuState = "features";
            drawFeature();
        } else {
            get_features_progress = 0;
            get_total_progress = promise_list.length;
            console.log(get_features_progress,get_total_progress);
            Promise.all(promise_list).then(function(values) {
              get_features_progress = 0;
              get_total_progress = 0;
                getdata = values;
                for (var i = 0; i < getdata.length; i++) {
                    updateBuffer([layerID, printFeatures_list[i]], getdata[i], true);
                }
                var list = printFeatures(layerID, features['features'], "features");
                var printArea = document.getElementById('featureLayer');
                his_features = list;
                printArea.innerHTML = "";
                printArea.appendChild(list);
                printMenuState = "features";
                drawFeature();
            }).catch(function(err) {
                console.log(err);
            });
        }

    });
}

*/




function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.

  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    var reader = new FileReader();

     // Closure to capture the file information.
     reader.onload = (function(theFile) {
       return function(e) {
         var dropZone = document.getElementById('drop_zone');
         dropZone.style.visibility = 'hidden';
         var json_object = JSON.parse(e.target.result);
         console.log(json_object);
       };
     })(f);

     // Read in the image file as a data URL.
     reader.readAsText(f);
  }

}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}


function getLocalFile(){
  var dropZone = document.getElementById('drop_zone');
  dropZone.style.visibility = 'visible';
  dropZone.style.textAlign = 'center';
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);

}
