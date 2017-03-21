var setAnalysisDIV = function(div_id, graph_id, radar_id = 'radar'){

  var div = document.getElementById(div_id);
  div.innerHTML ='';
  div.style.top = '120px'
  div.style.color = 'white';
  div.style.backgroundColor = 'rgba(0,0,0,0.4)';
  div.style.right = '5px';
  div.style.border = '1px solid black';
  div.style.padding = '0px';
  div.className = "list-group-item active";

  var title = document.createElement("div");
  title.appendChild(document.createTextNode("  ANALYSIS"));
  title.style.paddingTop = '4px';
  title.style.height = '10%';
  title.style.width = '100%';
  title.style.textAlign = 'center';
  title.style.verticalAlign = 'middle';
  title.style.display = 'flex';
  title.style.alignItems = 'center';
  title.style.backgroundColor = '#787878';
  title.style.borderBottom = '3px double white';

  var div_arr = [];
  for (var i= 0 ; i < 3 ; i++){
    div_arr[i] = document.createElement("div");
    div_arr[i].style.height = '30%';
    div_arr[i].style.width = '100%';
    div_arr[i].style.cursor = "pointer";
    div_arr[i].style.verticalAlign = 'middle';
    div_arr[i].style.padding = '2%';
    div_arr[i].style.textAlign = 'center';
    div_arr[i].style.borderBottom = '1px solid white';
    div_arr[i].style.display = 'flex';
    div_arr[i].style.alignItems = 'center';
    div_arr[i].style.border = '1px solid white';
    //div_arr[i].style.borderRadius = '15px';
  }

  var properties_graph = div_arr[0],
  show_space_cube = div_arr[1],
  show_direction_radar = div_arr[2];

  properties_graph.appendChild(document.createTextNode("PROPERTY GRAPH"));
  show_space_cube.appendChild(document.createTextNode("TOGGLE HEATCUBE"));
  show_direction_radar.appendChild(document.createTextNode("DIRECTION RADAR"));

  properties_graph.onclick = (function(glo_mfoc, graph){
    return function(){
      selectProperty(graph);
    };
  })(mfoc, graph_id);

  show_space_cube.onclick = (function(glo_mfoc, div, graph){
    return function(){
      this.style.cursor = 'auto';
      selectDegree(this, div, graph);
    }
  })(mfoc, div_id, graph_id);


  show_direction_radar.onclick = (function(glo_mfoc, canvas){
    return function(){
      glo_mfoc.showDirectionalRadar(canvas);
      glo_mfoc.update();
      if (document.getElementById('pro_menu'))
        document.getElementById('pro_menu').remove();
      document.getElementById(glo_mfoc.graph_id).style.height="0%";
    }
  })(mfoc, radar_id);

  div.appendChild(title);
  div.appendChild(properties_graph);
  div.appendChild(show_space_cube);
  div.appendChild(show_direction_radar);


  var radar_canvas = document.getElementById('radar');
  radar_canvas.style.position = 'absolute';
  radar_canvas.style.zIndex = '21';
  radar_canvas.style.right = '5px';

  MFOC.drawBackRadar('radar');
}

var selectDegree = function(div, parent, graph_id) {

    if (mfoc.features.length == 0) {
        console.log("no features");
        setAnalysisDIV(parent, graph_id, 'radar');
        return;
    }
    if (mfoc.cube_primitives != null) {
        mfoc.removeHeatMap();
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

    submit_btn.onclick = (function(mfoc, parent, graph_id) {
        return function() {
            var x = document.getElementById('degree_0').value,
                y = document.getElementById('degree_1').value,
                time = document.getElementById('degree_2').value;
            document.getElementById(parent).innerHTML = 'Analysing...';
            mfoc.showHeatMap({
                x: x,
                y: y,
                time: time
            });

            setAnalysisDIV(parent, graph_id);
        };
    })(mfoc, parent, graph_id);

    back_btn.onclick = (function(mfoc, parent, graph_id) {
        return function() {
            setAnalysisDIV(parent, graph_id);
        };
    })(mfoc, parent, graph_id);

    btn_div.appendChild(back_btn);
    btn_div.appendChild(submit_btn);

    div.appendChild(btn_div);

    if (mfoc.mode != 'SPACETIME') {
        document.getElementById('degree_row_2').style.visibility = 'hidden';
    }
}

var selectProperty = function(graph_id) {

    if (mfoc.features.length == 0) {
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
    pro_menu.style.backgroundColor = 'rgba(5, 5, 5, 0.8)';
    pro_menu.style.height = "5%";
    pro_menu.style.zIndex = "25";
    pro_menu.id = 'pro_menu';
    pro_menu.style.cursor = 'pointer';
    pro_menu.className = 'graph';

    var pro_type_arr = mfoc.getAllTypeFromProperties();

    for (var i = 0; i < pro_type_arr.length; i++) {
        var div = document.createElement('div');
        div.style.padding = "10px";
        div.style.color = 'white';
        div.style.float = 'left';
        div.style.textAlign = 'center';
        div.style.fontSize = 'x-large';
        div.style.verticalAlign = 'middle';
        div.style.width = 100 / (pro_type_arr.length + 1) + '%';
        div.innerHTML = pro_type_arr[i];
        div.id = 'btn' + pro_type_arr[i];
        div.onclick = (function(mfoc, name_arr, index, graph) {
            return function() {
                document.getElementById('pro_menu').style.bottom = '20%';
                document.getElementById('btn' + name_arr[index]).style.backgroundColor = 'rgba(100,100,100,0.8)';
                document.getElementById("graph").style.height = '20%';
                document.getElementById("graph").style.backgroundColor = 'rgba(5, 5, 5, 0.8)';

                for (var i = 0; i < name_arr.length; i++) {
                    if (i == index) continue;
                    document.getElementById('btn' + name_arr[i]).style.backgroundColor = 'transparent';
                }
                mfoc.showProperty(name_arr[index], graph);
            };
        })(mfoc, pro_type_arr, i, graph_id);
        pro_menu.appendChild(div);
    }

    var close_div = document.createElement('div');
    close_div.style.padding = "10px";
    close_div.style.color = 'white';
    close_div.style.float = 'right';
    close_div.style.textAlign = 'center';
    close_div.style.fontSize = 'x-large';
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
