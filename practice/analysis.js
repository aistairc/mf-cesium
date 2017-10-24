var radar_on = false;

var clearAnalysis = function(){
    var graph_id = div_id.graph;
    var radar_id = div_id.radar;
    var option_id = div_id.option;
    var upper_toolbar_id = div_id.upper_toolbar;

    cleanGraphDIV();

    document.getElementById(option_id).innerHTML = '';
    document.getElementById(option_id).style.display = "none";
    document.getElementById(upper_toolbar_id).style.display = "flex";

    if (stinuum.occurrenceMap.primitive != null) {
        stinuum.occurrenceMap.remove();
    }
    if (document.getElementById('radar') != undefined){
        stinuum.directionRadar.remove('radar');
        $('#radar').remove();
    }
    stinuum.s_query_on = false;
    turnon_toolbar();
}

var turnOnOptionDIV = function(){
    $("#upper_toolbar").hide();
    document.getElementById(div_id.option).innerHTML = "";
    document.getElementById(div_id.option).style.display = "flex";
}

var selectDegree = function() {
    turnoff_toolbar();
    turnOnOptionDIV();
    if (stinuum.mfCollection.getLength() == 0) {
        console.log("no features");
        clearAnalysis();
        return;
    }

    if (stinuum.occurrenceMap.primitive != null) {
        stinuum.occurrenceMap.remove();
        clearAnalysis();
        return;
    }

    var option_div = document.getElementById(div_id.option);

    var div = document.createElement('div');
    div.innerHTML = '<Set Degree>';
    div.style.textAlign = 'center';
    div.style.display = 'block';
    div.style.marginRight = '10px';
    div.style.height = '100%';
    div.onclick = null;
    option_div.appendChild(div);

    var table = document.createElement('table');
    var row = table.insertRow(table.rows.length);
    var degree_string = ['long(°) : ', 'lat(°) : ', 'time(days) : '];
    var length = 3;
    if (viewer.scene.mode != Cesium.SceneMode.COLUMBUS_VIEW) length = 2;
    for (var i = 0; i < length; i++) {
        var celll = row.insertCell(i * 2);
        celll.innerHTML = degree_string[i];
        var cell2 = row.insertCell(i * 2 + 1);
        var input = document.createElement('input');
        input.id = 'degree_' + i;
        input.value = 5;
        input.style.color = 'black';
        input.style.width = '30px';
        input.style.height = '100%';
        input.style.marginRight = '10px';
        cell2.appendChild(input);
    }
    option_div.appendChild(table);

    var submit_btn = document.createElement('input');
    submit_btn.type = 'button'
    submit_btn.className = 'btn btn-default';
    submit_btn.style.color = 'black';
    submit_btn.value = 'SUBMIT'
    submit_btn.style.marginRight = '10px';
    submit_btn.onclick = (function() {
        return function() {
            var x = document.getElementById('degree_0').value,
                y = document.getElementById('degree_1').value;
            var time = document.getElementById('degree_2');
            if (time != undefined) time = time.value;
            if (time == 0) time = undefined;
            document.getElementById(div_id.option).innerHTML = 'Analysing...';
            stinuum.occurrenceMap.show({
                x: x,
                y: y,
                time: time
            });

            document.getElementById(div_id.option).innerHTML = 'Done';
            option_div.appendChild(makeAnalysisCloseBtn());
        };
    })();
    option_div.appendChild(submit_btn);
    option_div.appendChild(makeAnalysisCloseBtn());

}

var selectProperty = function(graph_id) {

    if (stinuum.mfCollection.getLength() == 0) {
        alert("no features");
        return;
    }
    if (document.getElementById('pro_menu')) {
        document.getElementById('pro_menu').remove();
    }

    document.getElementById(graph_id).innerHTML = '';
    document.getElementById(graph_id).style.height = '0%';
    document.getElementById(graph_id).style.cursor = 'pointer';

    var pro_menu = document.createElement('div');
    pro_menu.style.bottom = '0';
    pro_menu.style.backgroundColor = 'rgba(105, 105, 105, 0.8)';
    pro_menu.style.height = "5%";
    pro_menu.style.zIndex = "25";
    pro_menu.id = 'pro_menu';
    pro_menu.style.cursor = 'pointer';
    pro_menu.className = 'graph';

    var pro_type_arr = stinuum.mfCollection.getAllPropertyType();

    for (var i = 0; i < pro_type_arr.length; i++) {
        var div = document.createElement('div');
        div.style.padding = "10px";
        div.style.color = 'white';
        div.style.float = 'left';
        div.style.textAlign = 'center';
        div.style.fontSize = '100%';
        div.style.height = "100%";
        div.style.lineHeight = "100%";
        div.style.width = 100 / (pro_type_arr.length + 1) + '%';
        div.innerHTML = pro_type_arr[i];
        div.id = 'btn' + pro_type_arr[i];
        div.onclick = (function(stinuum, name_arr, index, graph) {
            return function() {
                document.getElementById('pro_menu').style.bottom = '20%';
                document.getElementById('btn' + name_arr[index]).style.backgroundColor = 'rgba(200,100,100,0.8)';
                document.getElementById("graph").style.height = '20%';
                document.getElementById("graph").style.backgroundColor = 'rgba(5, 5, 5, 0.8)';

                for (var i = 0; i < name_arr.length; i++) {
                    if (i == index) continue;
                    document.getElementById('btn' + name_arr[i]).style.backgroundColor = 'transparent';
                }
                stinuum.propertyGraph.show(name_arr[index], graph);
            };
        })(stinuum, pro_type_arr, i, graph_id);
        pro_menu.appendChild(div);
    }

    var close_div = document.createElement('div');
    close_div.style.padding = "10px";
    close_div.style.color = 'white';
    close_div.style.float = 'right';
    close_div.style.textAlign = 'center';
    close_div.style.fontSize = 'small';
    close_div.style.verticalAlign = 'middle';
    close_div.style.width = 100 / (pro_type_arr.length + 1) + '%';
    close_div.innerHTML = 'CLOSE';
    pro_menu.appendChild(close_div);

    close_div.onclick = (function(graph_id) {
        return function() {
            document.getElementById('pro_menu').remove();
            document.getElementById(graph_id).style.height = "0%";
        }
    })(graph_id);

    document.body.appendChild(pro_menu);

}

function processSpatioQuery(id1, id2){
    stinuum.queryProcessor.queryBySpatioTime(id1, id2);
}

function spatio_query(){
    turnOnOptionDIV();
    //TODO : select
    if (stinuum.s_query_on){
        stinuum.s_query_on = false;
        refresh();
        drawFeatures();
    }
    else{
        if (stinuum.mfCollection.features.length >= 2){
            turnoff_toolbar();
            setOptionDIVforSQuery();
        }
        else{
            clearAnalysis();
        }
    }
    
}

function setOptionDIVforSQuery(){
    var option_div = document.getElementById(div_id.option);
    option_div.innerHTML = '';

    var div1 = list_maker.getDropdownDIVofFeaturesWithType("MovingPolygon");
    var div2 = list_maker.getDropdownDIVofFeaturesWithType("MovingPoint");

    option_div.appendChild(div1);
    option_div.appendChild(div2);    

    var submit_btn = document.createElement('input');
    submit_btn.type = 'button';
    submit_btn.value = "SUBMIT";
    submit_btn.className = "btn btn-default";
    submit_btn.style.height = "50%";
    submit_btn.onclick = (function(){
        return function(){
            if (div1.value != undefined && div2.value != undefined){
                processSpatioQuery(div1.value, div2.value);
                time_query();
                drawFeatures();               
            }
        }
    })();

    option_div.appendChild(submit_btn);

    var close_btn = makeAnalysisCloseBtn();
    option_div.appendChild(close_btn);
}

function makeAnalysisBigCloseDiv(){
    var close_btn = document.createElement('div');
    close_btn.className = 'upper_toolbar_btn';
    close_btn.onclick = (function(){
        return function(){
            clearAnalysis();
            refresh();
            drawFeatures();
        }
    })();
    close_btn.innerText = "CLOSE";
    close_btn.style.width = "90%";
    //close_btn.id = 'big_close_btn';
    return close_btn;
}


function makeAnalysisCloseBtn(){
    var btn = document.createElement('input');
    //btn.id = 'close_btn';
    btn.type = 'button';
    btn.className = 'btn btn-default';
    btn.value = 'CLOSE';
    btn.style.height = '30%';
    btn.style.position = 'absoulte';
    btn.style.right = '5px';
    //btn.style.width = '10%';
    btn.style.float = 'right';
    btn.style.margin = '2px';
    btn.style.marginLeft = '10px';
    btn.onclick = (function(){
        return function(){
            clearAnalysis();
            refresh();
            drawFeatures();
        }
    })();
    return btn;
}

function setOptionDIVforSlider(){
    var time_min_max;
    if (stinuum.s_query_on){
      time_min_max = stinuum.mfCollection.findMinMaxGeometry().date;  
    } 
    else {
        time_min_max = stinuum.mfCollection.getWholeMinMax().date;
    }
    var fastest = new Date(time_min_max[0]);
    var latest = new Date(time_min_max[1]);

    var min_date_div = document.createElement('div');
    min_date_div.className = 'time-query-date';
    min_date_div.id = "min-date";

    var max_date_div = document.createElement('div');
    max_date_div.className = 'time-query-date';
    max_date_div.id = "max-date";

    var slider_bar_div = document.getElementById("slider_bar");
    slider_bar_div.style.width = '70%';
    slider_bar_div.style.float = "left";
    slider_bar_div.style.margin = '10px';
    
    min_date_div.innerText = fastest.getFullYear() + " / " + (fastest.getMonth() + 1) + " / " + (fastest.getDate());
    max_date_div.innerText = latest.getFullYear() + " / " + (latest.getMonth() + 1) + " / " + (latest.getDate());

    var close_btn = makeAnalysisCloseBtn();

    document.getElementById(div_id.option).appendChild(min_date_div);
    document.getElementById(div_id.option).appendChild(slider_bar_div);
    document.getElementById(div_id.option).appendChild(max_date_div);
    document.getElementById(div_id.option).appendChild(close_btn);

}

function time_query(){
    turnOnOptionDIV();
    var option_div = document.getElementById(div_id.option);
    option_div.innerHTML = '';

    var slider_div = document.createElement('input');
    slider_div.type = 'text';
    slider_div.id = 'slider';
    document.getElementById(div_id.option).appendChild(slider_div);

    slider = new Slider("#slider", {
        id: "slider_bar",
        range : true,
        step:1,
        tooltip_position:'bottom',
        min : 0,
        max : 100,
        value : [0,100],
        formatter: function(value){
            var time_min_max;
            if (stinuum.s_query_on) time_min_max = stinuum.mfCollection.min_max.date;
            else time_min_max = stinuum.mfCollection.whole_min_max.date;
            if (time_min_max == undefined) return;
            var fastest = new Date(time_min_max[0]);
            var latest = new Date(time_min_max[1]);

            var diff = (latest.getTime() - fastest.getTime()) / 100;
            fastest.setTime(fastest.getTime() + diff * value[0]);
            latest.setTime(fastest.getTime() + diff * value[1]);
            

            var start = fastest.getFullYear() + " / " + (fastest.getMonth() + 1) + " / " + (fastest.getDate());
            var end = latest.getFullYear() + " / " + (latest.getMonth() + 1) + " / " + (latest.getDate());
            return start + " - " + end;
        }
    });

    slider.on("slideStop", function(sliderValue) {
        zoom();
    })

    setOptionDIVforSlider();
}


function zoom() {
    var zoom_time = slider.getValue();
    LOG("zoom time : " , zoom_time);

    var time_min_max;
    if (stinuum.s_query_on){
      time_min_max = stinuum.mfCollection.findMinMaxGeometry().date;  
    } 
    else {
        time_min_max = stinuum.mfCollection.getWholeMinMax().date;
    }
    var fastest = new Date(time_min_max[0]);
    var latest = new Date(time_min_max[1]);

    var diff = (latest.getTime() - fastest.getTime()) / 100;
    latest.setTime(fastest.getTime() + diff * zoom_time[1]);
    fastest.setTime(fastest.getTime() + diff * zoom_time[0]);

    //clearAnalysis();
    stinuum.queryProcessor.queryByTime(fastest, latest);
    stinuum.geometryViewer.update();
    stinuum.geometryViewer.adjustCameraView();
}


function showRadar(){
    var radar_canvas = document.createElement('canvas');
    radar_canvas.id = 'radar';
    radar_canvas.style.width = document.body.offsetHeight / 3 + 'px';
    radar_canvas.style.height = document.body.offsetHeight / 3 + 'px';
    radar_canvas.width = document.body.offsetHeight / 3;
    radar_canvas.height = document.body.offsetHeight / 3;
    radar_canvas.style.top = (document.body.offsetHeight / 4) + 'px';
    radar_canvas.style.right = (document.body.offsetWidth / 4) + 'px';
    
    document.body.appendChild(radar_canvas);
    stinuum.directionRadar.show('radar');
    
    changeOptionToolbarToCloseDIV();
}

function changeOptionToolbarToCloseDIV(){
    turnOnOptionDIV();
    var close_btn = makeAnalysisBigCloseDiv();
    document.getElementById(div_id.option).appendChild(close_btn);
}


function cleanGraphDIV() {
    if (document.getElementById('pro_menu')) {
        document.getElementById('pro_menu').remove();
    }
    document.getElementById("graph").innerHTML = '';
    document.getElementById("graph").style.height = '0%';
}

function showGraphDIV(graph_id){
  var pro_menu_div = document.createElement('div');
  pro_menu_div.style.bottom = '0';
  pro_menu_div.style.backgroundColor = 'rgba(55, 55, 55, 0.8)';
  pro_menu_div.style.height = "5%";
  pro_menu_div.style.zIndex = "25";
  pro_menu_div.id = 'pro_menu';
  pro_menu_div.style.cursor = 'pointer';
  pro_menu_div.className = 'graph';

  var close_div = document.createElement('div');
  close_div.style.padding = "10px";
  close_div.style.color = 'white';
  close_div.style.textAlign = 'center';
  close_div.style.fontSize = 'small';
  close_div.style.verticalAlign = 'middle';
  close_div.innerHTML = 'CLOSE';
  pro_menu_div.appendChild(close_div);

  close_div.onclick = (function(graph_id) {
      return function() {
          document.getElementById('pro_menu').remove();
          document.getElementById(graph_id).style.height = "0%";
      }
  })(graph_id);

  document.body.appendChild(pro_menu_div);
  document.getElementById('pro_menu').style.bottom = '20%';
  document.getElementById(graph_id).style.height = '20%';
  if (toolbar_show) {
    document.getElementById(graph_id).style.width = '85%';
    document.getElementById('pro_menu').style.width = '85%';
  }
  else{
    document.getElementById(graph_id).style.width = '100%';
    document.getElementById('pro_menu').style.width = '100%';
  }
  document.getElementById(graph_id).style.backgroundColor = 'rgba(5, 5, 5, 0.8)';
}
