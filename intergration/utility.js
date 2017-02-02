function printNames(filename, label_id) {
    var label_list = "";
    window.name_list = [];
    $.getJSON(filename, function(data) {
        for (var i = 0; i < data.features.length; i++) {
            window.name_list.push(data.features[i].properties.name);
        }
        for (var k = 0; k < window.name_list.length; k++) {
            label_list += "<label style = 'color:white' onclick = 'changeColor_poly(";
            label_list += k;
            label_list += ",";
            label_list += "\"";
            label_list += filename;
            label_list += "\"";
            label_list += ")'>";
            label_list += name_list[k];
            label_list += "</label>";
            label_list += "<input type = 'checkbox' onclick = 'getMovingPolygon(";
            label_list += k;
            label_list += ",";
            label_list += "\"";
            label_list += filename;
            label_list += "\"";
            label_list += ")'></input>";
            label_list += "<input type = 'checkbox' onclick = 'getInformation(";
            label_list += k;
            label_list += ",";
            label_list += "\"";
            label_list += filename;
            label_list += "\"";
            label_list += ")'";
            label_list += " id = 'checkbox_";
            label_list += k;
            label_list += "_";
            label_list += filename;
            label_list += "'>";
            label_list += "</input>";
            label_list += "<div id = '";
            label_list += k.toString();
            label_list += filename.toString();
            label_list += "'></div>";

        }

        document.getElementById(label_id.toString()).innerHTML = label_list;
    });

}

function getInformation(radioItem, filename) {
    var check_box_id = "checkbox_";
    check_box_id += radioItem.toString();
    check_box_id += "_";
    check_box_id += filename.toString();

    var is_checked = document.getElementById(check_box_id);
    if ($(is_checked).prop("checked")) {
        $.getJSON(filename, function(data) {
            var get_data = data.features[radioItem];
            var properties_name = [];
            for (var i = 0; i < get_data.temporalProperties.length; i++) {
                properties_name.push(get_data.temporalProperties[i].name);
            }
            var label_id = radioItem.toString() + filename.toString();
            var label_list = "";
            label_list += "<div>"
            label_list += "<div style = 'width : 50%; display: inline-block;'>";
            label_list += "<h4>";
            label_list += "properties</h4>";
            label_list += get_data.type;
            label_list += "</div>"
            label_list += "<div style = 'width : 50%; display: inline-block;'>";
            label_list += "<h4>";
            label_list += "temporalProperties</h4>"
            for (var i = 0; i < properties_name.length; i++) {
                var new_label_id = radioItem.toString() + "_" + i.toString() + "_" + filename.toString();
                label_list += "<div id = '"
                label_list += new_label_id;
                label_list += "'";
                label_list += ">";
                label_list += properties_name[i];
                label_list += "<input type = 'checkbox' ";
                label_list += "onclick = 'printInfo(\"";
                label_list += new_label_id;
                label_list += "\")' ";
                label_list += "id = '"
                label_list += new_label_id + "_check";
                label_list += "'";
                label_list += ">";
                label_list += "</input>";
                label_list += "</div>";
            }
            label_list += "</div>"
            label_list += "</div>"
            //console.log(label_list);
            document.getElementById(label_id.toString()).innerHTML = label_list;

        });
    } else {
        var print_target = document.getElementById("footer");
        Plotly.purge(print_target);
        var label_id = radioItem.toString() + filename.toString();
        document.getElementById(label_id.toString()).innerHTML = "";
    }
}

function printInfo(callValue) {
    console.log(callValue);
    var info_index = callValue;
    var new_label_id = callValue;
    var typhoon_index;
    var filename;
    var interpolations;
    var checkbox_id = callValue.toString() + "_check";
    checkbox_id = document.getElementById(checkbox_id);
    if ($(checkbox_id).prop("checked")) {
        info_index = info_index.split("_");
        filename = info_index[2] + "_" + info_index[3];
        typhoon_index = info_index[0];
        info_index = info_index[1];
        $.getJSON(filename, function(data) {

            var get_data = data.features[typhoon_index].temporalProperties[info_index];


            if (get_data.interpolations == "Linear") {
                interpolations = "linear";
            } else if (get_data.interpolations == "Spline") {
                interpolations = "spline";
            }


            var print_target = document.getElementById("footer");
            var data = [{
              x : get_data.datetimes,
              y : get_data.values,
              mode : 'lines',
              line : {
                shape : interpolations
              }
            }];
            var layout = {
              hovermode : 'closest'
            };

            Plotly.purge(print_target);
            Plotly.plot(print_target, data, layout);
            var infotext;
            print_target.on('plotly_hover',function(data){
               infotext = data.points.map(function(d){
                var temp_data = [];
                temp_data.push(d.x,d.y);
                return temp_data;
              });
              drawOnePolygon(infotext[0][0],typhoon_index,filename);
            })
            .on('plotly_unhover',function(data){
              var p_id = infotext[0][0];
              p_id += "_";
              p_id += typhoon_index;
              viewer.entities.remove(viewer.entities.getById(p_id));
            });
              //*/
        });
    } else {
        var print_target = document.getElementById("footer");
        Plotly.purge(print_target);
    }

}

function findFastestTime(filename) {
    var start_time;
    var data;
    $.ajax({
        url: filename,
        async: false,
        dataType: 'json',
        success: function(json) {
            data = json;
        }
    });
    start_time = getTime2(data.features[0].temporalGeometry.datetimes[0]);
    for (var i = 0; i < data.features.length; i++) {
        for (var j = 0; j < data.features[i].temporalGeometry.datetimes.length; j++) {
            var compare_time = getTime2(data.features[i].temporalGeometry.datetimes[j]);
            if (start_time > compare_time) {
                start_time = compare_time;
            }
        }
    }


    return start_time;
}

function findLatestTime(filename) {
    var start_time;
    var data;
    $.ajax({
        url: filename,
        async: false,
        dataType: 'json',
        success: function(json) {
            data = json;
        }
    });

    start_time = getTime2(data.features[0].temporalGeometry.datetimes[0]);
    for (var i = 0; i < data.features.length; i++) {
        for (var j = 0; j < data.features[i].temporalGeometry.datetimes.length; j++) {
            var compare_time = getTime2(data.features[i].temporalGeometry.datetimes[j]);
            if (start_time < compare_time) {
                start_time = compare_time;
            }
        }
    }

    return start_time;

}

function contains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function changeISO2Date(time) {

    time = time.replace(/\D/g, " ");
    var dtcomps = time.split(" ");

    // modify month between 1 based ISO 8601 and zero based Date
    dtcomps[1]--;

    var convdt = new Date(Date.UTC(dtcomps[0], dtcomps[1], dtcomps[2], dtcomps[3], dtcomps[4], dtcomps[5]));
    return convdt;

}

function getTime(timeValue) {
    var time = timeValue; //the basetime we will use for nomalization of datetimes
    var time_split = time.split('T'); //get date
    time_split[1] = time_split[1].replace('Z', ""); //get time
    var date_arr = time_split[0].split('-');
    var time_arr = time_split[1].split(':');
    var timestamp = new Date(date_arr[0], date_arr[1] - 1, date_arr[2], time_arr[0], time_arr[1], time_arr[2]);
    return timestamp;
}

function getTime2(timevalue) {
    var time = timevalue; //the basetime we will use for nomalization of datetimes
    var time_split = time.split(' '); //get date
    var date_arr = time_split[0].split('-');
    var time_arr = time_split[1].split(':');
    var timestamp = new Date(date_arr[0], date_arr[1] - 1, date_arr[2], time_arr[0], time_arr[1], time_arr[2]);
    return timestamp;
}

function setClock(start, stop, multi) {
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.multiplier = multi;
    viewer.timeline.zoomTo(start, stop);
}

function setDefaultClock() {
    var start = Cesium.JulianDate.fromDate(new Date());
    var end = Cesium.JulianDate.addDays(start, 1, new Cesium.JulianDate());
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = end.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.multiplier = 1;
    viewer.timeline.zoomTo(start, end);
}

var normalizeTime = function(date, min_max_date, value = 15000000){
  var separation = min_max_date[1].getTime() - min_max_date[0].getTime()
  return (date.getTime() - min_max_date[0].getTime())/separation * value;
};


var findMinMaxTime = function(datetimes){
  var min_max_date = [];
  min_max_date[0] = new Date(datetimes[0]);
  min_max_date[1] = new Date(datetimes[0]);

for (var j = 1 ; j < datetimes.length ; j++){

  var time = new Date(datetimes[j]);

  if (min_max_date[0].getTime() > time.getTime()){
      min_max_date[0] = time;
    }
    if (min_max_date[1].getTime() < time.getTime()){
      min_max_date[1] = time;
    }
  }
  return min_max_date;
};

var getListOfHeight(datetimes){
  for(var i = 0 ; i < datetimes.length ; i++){
    datetimes[i] = getTime2(datetimes[i]);
  }
  var min_max = findMinMaxTime(datetimes);
  var heights = [];
  for(var i = 0 ; i < datetimes.length ; i++){
    heights.push(normalizeTime(datetimes[i],min_max, value = 15000000));
  }
  return heights;
}
