MFOC.drawBackRadar = function(radar_id) {
    var radar_canvas = document.getElementById(radar_id);

    //  radar_canvas.style.top = document.getElementById(div_id).offsetTop + document.getElementById(div_id).offsetHeight + 10 + 'px';
    radar_canvas.style.position = 'absolute';
    radar_canvas.style.zIndex = '21';
    radar_canvas.style.right = '5px';


    //  radar_canvas.width = $('#'+div_id).width() + 'px';
    //  radar_canvas.height = $('#'+div_id).width()  + 'px';


    if (radar_canvas.getContext) {

        var h_width = radar_canvas.width / 2;
        var h_height = radar_canvas.height / 2;
        var ctx = radar_canvas.getContext('2d');

        //var h_width = ctx.canvas.clientWidth / 2;
        //var h_height = ctx.canvas.clientHeight / 2;
        var color = 'rgb(0,255,0)';

        for (var id = 0; id < 2; id++) {

            for (var j = 0; j < 2; j += 0.05) {
                ctx.beginPath();
                ctx.arc(h_width, h_height, h_width * (id + 1) / 2, j * Math.PI, (j + 0.025) * Math.PI);
                ctx.strokeStyle = color;
                ctx.stroke();
            }
        }

    } else {
        alert('canvas를 지원하지 않는 브라우저');
    }
}

MFOC.selectDegree = function(mfoc, div, parent, graph_id) {

    if (mfoc.features.length == 0) {
        console.log("no features");
        mfoc.setAnalysisDIV(parent, graph_id);
        return;
    }
    if (mfoc.cube_primitives != null) {
        mfoc.removeHeatMap();
        mfoc.setAnalysisDIV(parent, graph_id);
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

            mfoc.setAnalysisDIV(parent, graph_id);
        };
    })(mfoc, parent, graph_id);

    back_btn.onclick = (function(mfoc, parent, graph_id) {
        return function() {
            mfoc.setAnalysisDIV(parent, graph_id);
        };
    })(mfoc, parent, graph_id);

    btn_div.appendChild(back_btn);
    btn_div.appendChild(submit_btn);

    div.appendChild(btn_div);

    if (mfoc.mode != '3D') {
        document.getElementById('degree_row_2').style.visibility = 'hidden';
    }
}

MFOC.selectProperty = function(mfoc, graph_id) {
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

    //  document.getElementById(graph_id).style.width = '85%';
    //  document.getElementById(graph_id).style.left = '15%';

    var pro_menu = document.createElement('div');
    //  pro_menu.style.width='85%';
    //  pro_menu.style.position ='absolute';
    //  pro_menu.style.right='0';
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
        div.style.width = 100 / (pro_type_arr.length + 1) - 3 + '%';
        div.innerHTML = pro_type_arr[i];
        div.id = 'btn' + pro_type_arr[i];
        div.onclick = (function(mfoc, name_arr, index, graph) {
            return function() {
                document.getElementById('pro_menu').style.bottom = '20%';
                document.getElementById('btn' + name_arr[index]).style.backgroundColor = 'rgba(100,100,100,0.8)';
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
    close_div.style.width = 100 / (pro_type_arr.length + 1) - 3 + '%';
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
