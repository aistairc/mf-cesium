var radar_on = false;

var setAnalysisDIV = function(graph_id){
  document.getElementById(graph_id).style.height = '0%';
  if (document.getElementById('pro_menu')) {
      document.getElementById('pro_menu').remove();
  }
}

var selectDegree = function(div, parent, graph_id) {

    if (stinuum.mfCollection.getLength() == 0) {
        console.log("no features");
        setAnalysisDIV(parent, graph_id, 'radar');
        return;
    }

    if (stinuum.occurrenceMap.primitive != null) {//TODO
        stinuum.occurrenceMap.remove();
        setAnalysisDIV(parent, graph_id, 'radar');
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

            setAnalysisDIV(parent, graph_id);
        };
    })(stinuum, parent, graph_id);

    back_btn.onclick = (function(stinuum, parent, graph_id) {
        return function() {
            setAnalysisDIV(parent, graph_id);
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
