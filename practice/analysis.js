var radar_on = false;

var clearAnalysis = function(){
    var graph_id = div_id.graph;
    var radar_id = div_id.radar;
    var option_id = div_id.option;
    var upper_toolbar_id = div_id.upper_toolbar;

  document.getElementById(graph_id).style.height = '0%';
  if (document.getElementById('pro_menu')) {
    document.getElementById('pro_menu').remove();
  }
  
  document.getElementById(option_id).innerHTML = '';
  document.getElementById(option_id).style.display = "none";
  document.getElementById(upper_toolbar_id).style.display = "flex";

  if (stinuum.s_query_on) {
    stinuum.s_query_on = false;
    toggle_toolbar();
  }
}

var toggle_analysis = function(){
    $("#upper_toolbar").hide();
    document.getElementById("option").style.display = "flex";
   //document.getElementById('option').style.lineHeight = document.getElementById('option').clientHeight;

}

var selectDegree = function(div, parent, graph_id) {

    if (stinuum.mfCollection.getLength() == 0) {
        console.log("no features");
        clearAnalysis();
        return;
    }

    if (stinuum.occurrenceMap.primitive != null) {//TODO
        stinuum.occurrenceMap.remove();
        clearAnalysis();
        return;
    }

    div.innerHTML = 'Set Degree' + '<br><br>';
    div.style.verticalAlign = 'initial';
    div.style.display = 'block';
    div.style.alignItems = 'initial';
    div.style.height = div.offsetHeight * 1 + 'px';
    div.onclick = null;

    var table = document.createElement('table');
    table.style.paddingTop = '10px';

    var degree_string = ['long(°) : ', 'lat(°) : ', 'time(days) : '];
    for (var i = 0; i < 3; i++) {
        var row = table.insertRow(table.rows.length);
        row.id = 'degree_row_' + i;
        var celll = row.insertCell(0);
        celll.innerHTML = degree_string[i];

        var cell2 = row.insertCell(1);
        var input = document.createElement('input');
        input.id = 'degree_' + i;
        input.value = 5;
        input.style.color = 'black';
        input.style.width = '30px';
        cell2.appendChild(input);

    }
    div.appendChild(table);

    var btn_div = document.createElement('div');
    var back_btn = document.createElement('input'),
        submit_btn = document.createElement('input');

    back_btn.type = 'button';
    submit_btn.type = 'button'
    back_btn.style.float = 'right';
    submit_btn.style.float = 'left';
    back_btn.style.color = 'black';
    submit_btn.style.color = 'black';
    back_btn.value = 'back';
    submit_btn.value = 'submit'

    submit_btn.onclick = (function(stinuum, parent, graph_id) {
        return function() {
            var x = document.getElementById('degree_0').value,
                y = document.getElementById('degree_1').value,
                time = document.getElementById('degree_2').value;
            document.getElementById(parent).innerHTML = 'Analysing...';
            stinuum.occurrenceMap.show({
                x: x,
                y: y,
                time: time
            });

            clearAnalysis();
        };
    })(stinuum, parent, graph_id);

    back_btn.onclick = (function(stinuum, parent, graph_id) {
        return function() {
            clearAnalysis();
        };
    })(stinuum, parent, graph_id);

    btn_div.appendChild(back_btn);
    btn_div.appendChild(submit_btn);

    div.appendChild(btn_div);

    if (viewer.scene.mode != Cesium.SceneMode.COLUMBUS_VIEW) {
        document.getElementById('degree_row_2').style.visibility = 'hidden';
    }
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

function spatio_query(){
    //toggle_analysis();
    //TODO : select
    if (stinuum.s_query_on){
        stinuum.s_query_on = false;
        refresh();
        drawFeature();
    }
    else{
        if (stinuum.mfCollection.features.length == 2){
            var pair1 = stinuum.mfCollection.features[0];
            var pair2 = stinuum.mfCollection.features[1];
            if (pair1.feature.temporalGeometry.type == "MovingPoint"){
                stinuum.queryProcessor.queryBySpatioTime(pair2.id, pair1.id);
            }
            else{
                stinuum.queryProcessor.queryBySpatioTime(pair1.id, pair2.id);
            }
            time_query();
            turnoff_toolbar();
            drawFeature();
        }    
    }
    
}

function showSliderTooltip(){

}

function makeAnalysisCloseBtn(){
    var btn = document.createElement('input');
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
            drawFeature();
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

    var close_btn = makeAnalysisCloseBtn();
    

    min_date_div.innerText = fastest.getFullYear() + " / " + (fastest.getMonth() + 1) + " / " + (fastest.getDate());
    max_date_div.innerText = latest.getFullYear() + " / " + (latest.getMonth() + 1) + " / " + (latest.getDate());

    document.getElementById(div_id.option).appendChild(min_date_div);
    document.getElementById(div_id.option).appendChild(slider_bar_div);
    document.getElementById(div_id.option).appendChild(max_date_div);
    document.getElementById(div_id.option).appendChild(close_btn);

}

function time_query(){
    toggle_analysis();
    var slider_div = document.createElement('input');
    slider_div.type = 'text';
    slider_div.id = 'slider';
    document.getElementById(div_id.option).appendChild(slider_div);

    slider = new Slider("#slider", {
        id: "slider_bar",
        range : true,
        step:1,
        //tooltip_position:'bottom',
        min : 0,
        max : 100,
        value : [0,100]
    });

    slider.on("slide", function(sliderValue) {
        showSliderTooltip();
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
