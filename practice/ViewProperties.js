//print one Feature's TemporalProperties List and property.
function printFeatureProperties(layer_id, feature_id){
  var feature = buffer.getFeature(layer_id, feature_id);
}

function getHighlight(feature, temporalProperty) {
  var pro_arr = [];
  var pair = stinuum.mfCollection.getMFPairByIdInFeatures(feature);
  if (pair == -1) return;
  var property = Stinuum.getPropertyByName(pair.feature, temporalProperty, pair.id);
  pro_arr.push(property);

  cleanGraphDIV();
  showGraphDIV("graph");

  stinuum.propertyGraph.showPropertyArray(temporalProperty, pro_arr, "graph");
  stinuum.temporalMap.show(feature, temporalProperty);
    //stinuum.geometryViewer.adjustCameraView();
}


function getHighlightInContext(feature, temporalProperty) {
  var context = document.getElementById("context");
  context.innerHTML = "";
  var pro_arr = [];
  var pair = stinuum.mfCollection.getMFPairByIdInFeatures(feature);
  if (pair == -1) return;
  var property = Stinuum.getPropertyByName(pair.feature, temporalProperty, pair.id);
  pro_arr.push(property);

  cleanGraphDIV();
  showGraphDIV("graph");

  stinuum.propertyGraph.showPropertyArray(temporalProperty, pro_arr, "graph");
}


function showContextMenu(id, pos){
  var context = document.getElementById("context");
  context.innerHTML = "";
  context.style = "z-index : 50;"
  context.style.position = "absolute";
  context.style.backgroundColor = "rgba(100,100,100, 0.7)"
  context.style.width = "7%";
  context.style.top = pos.y + "px";
  context.style.left = pos.x + "px";

  var feature = stinuum.mfCollection.getMFPairByIdInFeatures(id);
  for (var i = 0 ; i < feature.feature.temporalProperties.length ; i++){
      var keys = Object.keys(feature.feature.temporalProperties[i]);
      for (var k = 0 ; k < keys.length ; k++){
        if (keys[k] == 'datetimes') continue;
        var div = document.createElement("div");
        div.className = "context-menu";
        div.innerHTML = keys[k];
        div.id = 'context_' + keys[k];
        div.onclick = (function(id, key) {
            return function() {
                getHighlightInContext(id, key)
            };
        })(id, keys[k]);
        context.appendChild(div);
      }
  }
}




function putProperties(id, name) {
    var obj = searchPropertyInfo(id, name);
    if (obj !== null) {
        var isExistPro = false;
        if (properties.length != 0) {
            if (properties[0].name == obj.name) {
                isExistPro = true;
                if (!properties.contains(obj)) {
                    properties.push(obj);
                }
            }
            if (isExistPro == false) {
                properties = [];
                properties.push(obj);
            }
        } else {
            properties.push(obj);
        }
    }
}

function delProperties(id, name) {
    var obj = searchPropertyInfo(id, name);
    if (properties.contains(obj)) {
        var index = properties.indexOf(obj);
        properties.splice(index, 1);
    }
}


function printProperty(data) {
    var feature_property = [];
    var feature_list = data;
    var upper_ul = document.createElement("ul");

    var temp_feature_property = [];
    for (var key in feature_list.properties) {
        temp_feature_property.push([key, feature_list.properties[key]]);
    }
    feature_property.push(temp_feature_property);


    //upper_ul.className = "list-group";
    upper_ul.style.paddingTop = '10px';
    upper_ul.style.paddingLeft = '5px';
    for (var i = 0; i < feature_property.length; i++) {
        var feature_li = document.createElement("li");
        //feature_li.className = "list-group-item";
        var feature_property_ul = document.createElement('ul');
        for (var j = 0; j < feature_property[i].length; j++) {
            var t_property = document.createElement('li');
            t_property.className = "property-list";
            t_property.innerText = feature_property[i][j][0] + " : " + feature_property[i][j][1];
            feature_property_ul.appendChild(t_property);
        }
        feature_li.appendChild(feature_property_ul);
        upper_ul.appendChild(feature_li);
    }
    return upper_ul;

}

function updateProperties(id, name) {
    var chk = document.getElementById(id + "_" + name);
    var graph = document.getElementById('graph').style;
    var cesiumContainer = document.getElementById("cesiumContainer");
    console.log(id, name, chk);
    if (chk.checked == true) {
        if (property_name !== name) {
            temp_property = property_name;
            property_name = name;
            if (temp_property !== "") {
                $('input:checkbox[name="' + temp_property + '"]').each(function() {
                    if (this.checked) {
                        this.checked = false;
                    }
                });
            }

        }
        $('input:checkbox[name="' + name + '"]').each(function() {
            if (this.checked == false) {
                this.checked = true;
            }
        });

        graph.height = "20%";

        //graph.opacity = "0.5";
        document.getElementById("graph").style.height = '20%';
        document.getElementById("graph").style.backgroundColor = 'rgba(5, 5, 5, 0.8)';

        stinuum.propertyGraph.show(name, "graph");
        console.log("finish");
    } else {
        $('input:checkbox[name="' + name + '"]').each(function() {
            if (this.checked) {
                this.checked = false;
            }
        });
        property_name = "";
        graph.height = "0%";
        cesiumContainer.style.height = "100%";
    }

}


function searchPropertyInfo(id, name) { //
    for (var i = 0; i < features.length; i++) {
        if (features[i].properties.name == id) {
            var temporalProperties = features[i].temporalProperties;
            for (var j = 0; j < temporalProperties.length; j++) {
                if (temporalProperties[j][name] == name) {
                    return temporalProperties[j][name];
                }
            }
        }
    }
    return NULL;
}