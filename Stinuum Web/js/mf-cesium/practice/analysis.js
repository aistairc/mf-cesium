var removeOnTickCallback = null;
var imageInterpolation = "Discrete"
var checkCodeMirror = false;
var temp_i = 0
var cm
const colors = [
    'rgb(255,0,0)',
    'rgb(0,255,0)',
    'rgb(0,0,255)',
    'rgb(255,255,0)',
    'rgb(0,255,255)',
    'rgb(255,0,255)',
    'rgb(128,128,0)',
    'rgb(0,128,128)',
    'rgb(128,0,128)',
    'rgb(128,0,0)',
    'rgb(0,128,0)',
    'rgb(0,0,128)'
]
var detection_colors = {}
var clearAnalysis = function () {
    var graph_id = div_id.graph;
    var radar_id = div_id.radar;
    var image_id = div_id.image;
    var option_id = div_id.option;
    var upper_toolbar_id = div_id.upper_toolbar;

    cleanGraphDIV();
    close_img();

    document.getElementById(option_id).innerHTML = '';
    document.getElementById(option_id).style.display = "none";
    document.getElementById(upper_toolbar_id).style.display = "flex";

    // if (stinuum.occurrenceMap.primitive != null) {
    //     stinuum.occurrenceMap.remove();
    // }
    if (document.getElementById('radar') != undefined) {
        stinuum.directionRadar.remove('radar');
        $('#radar').remove();
        $('#radar_stat').remove();
        document.getElementById(div_id.radar_comment).style.visibility = 'hidden';
    }

    //if (document.getElementById('image') != undefined) {
    //    stinuum.imageMarking.remove('image');
    //    if (removeOnTickCallback) {
    //        removeOnTickCallback();
    //        removeOnTickCallback = null;
    //    }
    //    $('#image').remove();
    //    $('#image_stat').remove();
    //    //    document.getElementById(div_id.image_comment).style.visibility = 'hidden';
    //}
    stinuum.s_query_on = false;
    turnon_toolbar();
}

var turnOnOptionDIV = function () {
    $("#upper_toolbar").hide();
    document.getElementById(div_id.option).innerHTML = "";
    document.getElementById(div_id.option).style.display = "flex";
}

// var selectDegree = function () {
//     turnoff_toolbar();
//     turnOnOptionDIV();
//     if (stinuum.mfCollection.getLength() == 0) {
//         //console.log("no features");
//         clearAnalysis();
//         return;
//     }

//     if (stinuum.occurrenceMap.primitive != null) {
//         stinuum.occurrenceMap.remove();
//         clearAnalysis();
//         return;
//     }

//     var option_div = document.getElementById(div_id.option);

//     var div = document.createElement('div');
//     div.innerHTML = '<Set Degree>';
//     div.style.textAlign = 'center';
//     div.style.display = 'block';
//     div.style.marginRight = '10px';
//     div.style.height = '100%';
//     div.onclick = null;
//     option_div.appendChild(div);

//     var table = document.createElement('table');
//     var row = table.insertRow(table.rows.length);
//     var degree_string = ['long(°) : ', 'lat(°) : ', 'time(days) : '];
//     var length = 3;
//     if (viewer.scene.mode != Cesium.SceneMode.COLUMBUS_VIEW) length = 2;
//     for (var i = 0; i < length; i++) {
//         var celll = row.insertCell(i * 2);
//         celll.innerHTML = degree_string[i];
//         var cell2 = row.insertCell(i * 2 + 1);
//         var input = document.createElement('input');
//         input.id = 'degree_' + i;
//         input.value = 5;
//         input.style.color = 'black';
//         input.style.width = '30px';
//         input.style.height = '100%';
//         input.style.marginRight = '10px';
//         cell2.appendChild(input);
//     }
//     option_div.appendChild(table);

//     var submit_btn = document.createElement('input');
//     submit_btn.type = 'button'
//     submit_btn.className = 'btn btn-default';
//     submit_btn.style.color = 'black';
//     submit_btn.value = 'SUBMIT'
//     submit_btn.style.marginRight = '10px';
//     submit_btn.onclick = (function () {
//         return function () {
//             var x = document.getElementById('degree_0').value,
//                 y = document.getElementById('degree_1').value;
//             var time = document.getElementById('degree_2');
//             if (time != undefined) time = time.value;
//             if (time == 0) time = undefined;
//             document.getElementById(div_id.option).innerHTML = 'Analysing...';
//             stinuum.occurrenceMap.show({
//                 x: x,
//                 y: y,
//                 time: time
//             });

//             document.getElementById(div_id.option).innerHTML = 'Done';
//             option_div.appendChild(makeAnalysisCloseBtn());
//         };
//     })();
//     option_div.appendChild(submit_btn);
//     option_div.appendChild(makeAnalysisCloseBtn());
// }

var close_mfjson = function() {
    
    turnon_toolbar();
    turnoff_mfjson();
}
var upload_mfjson = function() {
    
    console.log(JSON.parse(cm.getValue()));
    var new_data = JSON.parse(cm.getValue());
    var temp_fileName = "tempName_"+temp_i;
    temp_i += 1;
    close_mfjson()
    handleEditorData(temp_fileName, new_data)
}
var reset_mfjson = function() {

    cm.setValue('{\n    "type": "FeatureCollection",\n    "features": []\n}',);
    cm.clearHistory();
}

var showCodeMirror = function() {
    
    turnoff_toolbar();
    turnon_mfjson();
    // var cm;
    
    if (!checkCodeMirror){
        cm = new_CodeMirror()
        checkCodeMirror = true
    }
}

function showGraphItems(graph_id, pro_type_arr) {

}

function showSelectItemsDialog(graph_id, pro_type_arr) {
    

    // Create and set Overlay
    let dialogOverlay = document.createElement("div");
    dialogOverlay.classList.add("dialog-overlay");

    // Create and set Dialog
    // Dialog:[Dialog Header,Dialog Body]
    let dialog = document.createElement("div");
    dialog.classList.add("dialog");

    // Create and set Dialog Header
    let dialogHeader = document.createElement("div");
    dialogHeader.classList.add("dialog-header");
    dialogHeader.textContent = "Select show properties.";

    // Create and set Dialog Boday
    // Dialog Body:[Dialog Message,Dialog Values, Dialog Buttons]
    let dialogBody = document.createElement("div");
    dialogBody.classList.add("dialog-body");

    // Create and set Dialog Message
    let dialogMessage = document.createElement("div");
    dialogMessage.classList.add("dialog-message");
    dialogMessage.textContent = "Max select 10 properties."

    // Create and set Dialog Buttons
    // Dialog Buttons:[ok, cancel]
    let dialogButtons = document.createElement("div");
    dialogButtons.classList.add("dialog-buttons");

    // Create and set Dialog OK Button
    let buttonOk = document.createElement("button");
    buttonOk.textContent = "SHOW";
    buttonOk.classList.add("left");
    buttonOk.classList.add("btn");
    buttonOk.classList.add("btn-default");
    buttonOk.addEventListener("click", () => {
        let show_pro_type_arr = [];
        Array.from(document.getElementsByClassName("checkbox-property")).forEach((v) => {
            if (v.checked) {
                show_pro_type_arr.push(v.getAttribute("value"));
            }
        });
        if (graph_id == 'graph'){
            console.log(graph_id, show_pro_type_arr)
            showSelectProperties(graph_id, show_pro_type_arr);
            document.body.removeChild(dialogOverlay);
        }else if(graph_id == 'image'){
            console.log(graph_id, show_pro_type_arr)
            showSelectImgProperties(graph_id, show_pro_type_arr);
            document.body.removeChild(dialogOverlay);
            // document.body.removeChild(dialogOverlay);
        }else if(graph_id == 'server'){
            console.log(graph_id, show_pro_type_arr)
            connector.getServerDataList(show_pro_type_arr);
            document.body.removeChild(dialogOverlay);
            
            // document.body.removeChild(dialogOverlay);
        }
      
    });
    // Create and set Dialog Cancel Button
    let buttonCancel = document.createElement("button");
    buttonCancel.textContent = "CANCEL";
    buttonCancel.classList.add("right");
    buttonCancel.classList.add("btn");
    buttonCancel.classList.add("btn-default");
    buttonCancel.addEventListener("click", () => {
        document.body.removeChild(dialogOverlay);
    });

    // Append Childern to Dialog Buttons
    dialogButtons.appendChild(buttonOk);
    dialogButtons.appendChild(buttonCancel);

    // Create and set Dialog Values
    let dialogValues = document.createElement("div");
    dialogValues.classList.add("dialog-values");
    pro_type_arr.sort();
    
    pro_type_arr.forEach(v => {
        //console.log(v)
        let dialogCheckBox = document.createElement("div");
        dialogCheckBox.classList.add("dialog-checkbox");
        let checkbox = document.createElement("input");
        checkbox.classList.add("checkbox-property");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("value", v);
        checkbox.addEventListener("change", () => {
            let count = 0;
            Array.from(document.getElementsByClassName("checkbox-property")).forEach((v) => {
                if (v.checked) {
                    count++;
                }
            });
            if (count > 10) {
                buttonOk.setAttribute("Disabled", "Disabled");
            } else {
                buttonOk.removeAttribute("Disabled");
            }
        });
        let text = document.createElement("div");
        text.classList.add("checkbox-text");
        text.textContent = v;
        dialogCheckBox.appendChild(checkbox);
        dialogCheckBox.appendChild(text);
        dialogValues.appendChild(dialogCheckBox);
    });

    // Append children to Dialog Body
    dialogBody.appendChild(dialogMessage);
    dialogBody.appendChild(dialogValues);
    dialogBody.appendChild(dialogButtons);

    // Append children to Dialog
    dialog.appendChild(dialogHeader);
    dialog.appendChild(dialogBody);

    // Append Dialog to body
    dialogOverlay.appendChild(dialog);
    document.body.appendChild(dialogOverlay);
}

function showSelectProperties(graph_id, pro_type_arr) {
    console.log(graph_id, pro_type_arr)
    if (document.getElementById('pro_menu')) {
        document.getElementById('pro_menu').remove();
    }
    document.getElementById(graph_id).innerHTML = '';
    document.getElementById(graph_id).style.height = '0%';
    document.getElementById(graph_id).style.cursor = 'pointer';

    let pro_menu = document.createElement('div');
    pro_menu.style.bottom = '0';
    pro_menu.style.backgroundColor = 'rgba(105, 105, 105, 0.8)';
    pro_menu.style.height = "5%";
    pro_menu.style.zIndex = "25";
    pro_menu.id = 'pro_menu';
    pro_menu.style.cursor = 'pointer';
    pro_menu.className = 'graph';
    for (let i = 0; i < pro_type_arr.length; i++) {
        let div = document.createElement('div');
        div.style.padding = "0px 10px 0px 10px";
        div.style.color = 'white';
        div.style.float = 'left';
        //div.style.textAlign = 'center';
        div.style.fontSize = '100%';
        div.style.height = "100%";
        div.style.lineHeight = "100%";
        div.style.width = 100 / (pro_type_arr.length + 1) + '%';
        //div.innerHTML = pro_type_arr[i];
        div.id = 'btn' + pro_type_arr[i];
        // Add ktianishi 2018.02.01 -->
        div.style.display = 'flex';
        div.style.justifyContent = 'center';
        div.style.flexDirection = 'row';
        div.style.alignItems = 'center';
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginTop = '0';
        checkbox.style.height = '100%';
        checkbox.id = 'chk' + pro_type_arr[i];
        checkbox.dataset.name = pro_type_arr[i];
        checkbox.classList.add('chk-graph-item');
        checkbox.addEventListener('click', (e) => {
            let elements = document.getElementsByClassName('chk-graph-item');
            let current = e.currentTarget;
            Array.from(elements).forEach((element) => {
                if (current.checked && element.id != current.id) {
                    element.setAttribute('disabled', 'disabled');
                } else {
                    element.removeAttribute('disabled');
                }
            });
        });
        let label = document.createElement('label');
        label.for = checkbox.id;
        label.style.margin = "0px";
        label.style.fontWeight = '100';
        label.style.fontSize = "small";
        label.textContent = pro_type_arr[i];
        div.appendChild(checkbox);
        div.appendChild(label);
        // <---
        div.onclick = (function (stinuum, name_arr, index, graph) {
            return function () {
                console.log(name_arr)
                document.getElementById('pro_menu').style.bottom = '20%';
                document.getElementById('btn' + name_arr[index]).style.backgroundColor = 'rgba(200,100,100,0.8)';
                document.getElementById("graph").style.height = '20%';
                document.getElementById("graph").style.backgroundColor = 'rgba(5, 5, 5, 0.8)';

                for (var i = 0; i < name_arr.length; i++) {
                    if (i == index) continue;
                    document.getElementById('btn' + name_arr[i]).style.backgroundColor = 'transparent';
                }

                let elements = document.getElementsByClassName('chk-graph-item');
                let main_name = null;
                Array.from(elements).forEach((element) => {
                    if (element.checked) {
                        main_name = element.dataset.name;
                    }
                });
                console.log("compare grpah need : ", main_name, name_arr[index])
                if (main_name && main_name != name_arr[index]) {
                    console.log("compare grpah need : ", main_name, name_arr[index])
                    stinuum.propertyGraph.compare(main_name, name_arr[index], graph);
                } else {
                    stinuum.propertyGraph.show(name_arr[index], graph);
                }
            };
        })(stinuum, pro_type_arr, i, graph_id);
        pro_menu.appendChild(div);
    }

    var close_div = document.createElement('div');
    close_div.setAttribute("id", "btnclose");
    // close_div.addEventListener('click', function (event) {

    //     document.getElementById('pro_menu').remove();
    //     document.getElementById(graph_id).style.height = "0%";
    //     clearAnalysis();
    //     refresh();
    
    //   });
    //close_div.style.padding = "10px";
    close_div.style.color = 'white';
    close_div.style.float = 'right';
    close_div.style.justifyContent = 'center';
    close_div.style.fontSize = 'small';
    close_div.style.alignItems = 'center';
    close_div.style.display = 'flex';
    close_div.style.height = '100%'
    close_div.style.width = 100 / (pro_type_arr.length + 1) + '%';
    close_div.innerHTML = 'CLOSE';
    pro_menu.appendChild(close_div);
    
    
    close_div.onclick = (function (graph_id) {
        return function () {
           
            //console.log(document.getElementById('pro_menu'))
            document.getElementById('pro_menu').remove();
            document.getElementById(graph_id).style.height = "0%";
            clearAnalysis();
            refresh();
            // drawFeatures();

        }
    })(graph_id);

    document.body.appendChild(pro_menu);
    changeOptionToolbarToCloseDIV();
}
var selectPropertyImage = function (image_id) {

    let hide_items = ['IMAGE'];

    if (stinuum.mfCollection.getLength() == 0) {
        alert("no features");
        return;
    }

    let pro_type_arr = stinuum.mfCollection.getAllPropertyType();
    let show_list = [];
    for (let i = 0; i < pro_type_arr.length; i++) {
      
        if (hide_items.indexOf((pro_type_arr[i].type).toUpperCase()) != -1) {
            show_list.push(pro_type_arr[i].key);
        }
        // if (hide_items.indexOf((pro_type_arr[i]).toUpperCase()) != -1) {
        //     show_list.push(pro_type_arr[i]);
        // }
    }
    showSelectItemsDialog(image_id, show_list);
}
var selectProperty = function (graph_id) {

    let hide_items = ['IMAGE', 'DETECTION'];

    if (stinuum.mfCollection.getLength() == 0) {
        alert("no features");
        return;
    }

    let pro_type_arr = stinuum.mfCollection.getAllPropertyType();

    let show_list = [];
    for (let i = 0; i < pro_type_arr.length; i++) {
        console.log(hide_items.indexOf((pro_type_arr[i].type).toUpperCase()))
        if (hide_items.indexOf((pro_type_arr[i].type).toUpperCase()) == -1) {
       
            if(show_list.indexOf(pro_type_arr[i].key) == -1){
                show_list.push(pro_type_arr[i].key);
            }
            
        }
        // console.log(hide_items.indexOf((pro_type_arr[i]).toUpperCase()))
        // if (hide_items.indexOf((pro_type_arr[i]).toUpperCase()) == -1) {
        //     LOG("here selectProperty : ",pro_type_arr[i])
        //     // show_list.push(pro_type_arr[i].key);
        //     show_list.push(pro_type_arr[i]);
        // }
       
    }
    showSelectItemsDialog(graph_id, show_list);
    //return;

    /*if (document.getElementById('pro_menu')) {
        document.getElementById('pro_menu').remove();
    }
    document.getElementById(graph_id).innerHTML = '';
    document.getElementById(graph_id).style.height = '0%';
    document.getElementById(graph_id).style.cursor = 'pointer';

    let pro_menu = document.createElement('div');
    pro_menu.style.bottom = '0';
    pro_menu.style.backgroundColor = 'rgba(105, 105, 105, 0.8)';
    pro_menu.style.height = "5%";
    pro_menu.style.zIndex = "25";
    pro_menu.id = 'pro_menu';
    pro_menu.style.cursor = 'pointer';
    pro_menu.className = 'graph';

    // Remove hide items
    let show_list = [];
    for (let i = 0; i < pro_type_arr.length; i++) {
        if (hide_items.indexOf(pro_type_arr[i].toUpperCase()) >= 0) {
            continue;
        }
        show_list.push(pro_type_arr[i]);
    }
    pro_type_arr = show_list;

    for (let i = 0; i < pro_type_arr.length; i++) {
        let div = document.createElement('div');
        div.style.padding = "0px 10px 0px 10px";
        div.style.color = 'white';
        div.style.float = 'left';
        //div.style.textAlign = 'center';
        div.style.fontSize = '100%';
        div.style.height = "100%";
        div.style.lineHeight = "100%";
        div.style.width = 100 / (pro_type_arr.length + 1) + '%';
        //div.innerHTML = pro_type_arr[i];
        div.id = 'btn' + pro_type_arr[i];
        // Add ktianishi 2018.02.01 -->
        div.style.display = 'flex';
        div.style.justifyContent = 'center';
        div.style.flexDirection = 'row';
        div.style.alignItems = 'center';
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginTop = '0';
        checkbox.style.height = '100%';
        checkbox.id = 'chk' + pro_type_arr[i];
        checkbox.dataset.name = pro_type_arr[i];
        checkbox.classList.add('chk-graph-item');
        checkbox.addEventListener('click', (e) => {
            let elements = document.getElementsByClassName('chk-graph-item');
            let current = e.currentTarget;
            Array.from(elements).forEach((element) => {
                if (current.checked && element.id != current.id) {
                    element.setAttribute('disabled', 'disabled');
                } else {
                    element.removeAttribute('disabled');
                }
            });
        });
        let label = document.createElement('label');
        label.for = checkbox.id;
        label.style.margin = "0px";
        label.style.fontWeight = '100';
        label.style.fontSize = "small";
        label.textContent = pro_type_arr[i];
        div.appendChild(checkbox);
        div.appendChild(label);
        // <---
        div.onclick = (function (stinuum, name_arr, index, graph) {
            return function () {
                document.getElementById('pro_menu').style.bottom = '20%';
                document.getElementById('btn' + name_arr[index]).style.backgroundColor = 'rgba(200,100,100,0.8)';
                document.getElementById("graph").style.height = '20%';
                document.getElementById("graph").style.backgroundColor = 'rgba(5, 5, 5, 0.8)';

                for (var i = 0; i < name_arr.length; i++) {
                    if (i == index) continue;
                    document.getElementById('btn' + name_arr[i]).style.backgroundColor = 'transparent';
                }

                let elements = document.getElementsByClassName('chk-graph-item');
                let main_name = null;
                Array.from(elements).forEach((element) => {
                    if (element.checked) {
                        main_name = element.dataset.name;
                    }
                });
                if (main_name && main_name != name_arr[index]) {
                    stinuum.propertyGraph.compare(main_name, name_arr[index], graph);
                } else {
                    stinuum.propertyGraph.show(name_arr[index], graph);
                }
            };
        })(stinuum, pro_type_arr, i, graph_id);
        pro_menu.appendChild(div);
    }

    var close_div = document.createElement('div');
    //close_div.style.padding = "10px";
    close_div.style.color = 'white';
    close_div.style.float = 'right';
    close_div.style.justifyContent = 'center';
    close_div.style.fontSize = 'small';
    close_div.style.alignItems = 'center';
    close_div.style.display = 'flex';
    close_div.style.height = '100%'
    close_div.style.width = 100 / (pro_type_arr.length + 1) + '%';
    close_div.innerHTML = 'CLOSE';
    pro_menu.appendChild(close_div);

    close_div.onclick = (function (graph_id) {
        return function () {
            document.getElementById('pro_menu').remove();
            document.getElementById(graph_id).style.height = "0%";
            clearAnalysis();
            refresh();
            drawFeatures();

        }
    })(graph_id);

    document.body.appendChild(pro_menu);
    changeOptionToolbarToCloseDIV();*/
}

// function processSpatioQuery(id1, id2) {
//     stinuum.queryProcessor.queryBySpatioTime(id1, id2);
// }

function spatio_query() {
    turnOnOptionDIV();
    //TODO : select
    if (stinuum.s_query_on) {
        stinuum.s_query_on = false;
        refresh();
        drawFeatures();
    }
    else {
        if (stinuum.mfCollection.features.length >= 2) {
            turnoff_toolbar();
            setOptionDIVforSQuery();
        }
        else {
            clearAnalysis();
        }
    }

}

// function setOptionDIVforSQuery() {
//     var option_div = document.getElementById(div_id.option);
//     option_div.innerHTML = '';

//     var div1 = list_maker.getDropdownDIVofFeaturesWithType("MovingPolygon", true);
//     var div2 = list_maker.getDropdownDIVofFeaturesWithType("MovingPoint");

//     option_div.appendChild(div1);
//     option_div.appendChild(div2);

//     var submit_btn = document.createElement('input');
//     submit_btn.type = 'button';
//     submit_btn.value = "SUBMIT";
//     submit_btn.className = "btn btn-default";
//     submit_btn.style.height = "50%";
//     submit_btn.onclick = (function () {
//         return function () {
//             if (div1.value != undefined && div2.value != undefined) {
//                 processSpatioQuery(div1.value, div2.value);
//                 time_query();
//                 drawFeatures();
//             }
//         }
//     })();

//     option_div.appendChild(submit_btn);

//     var close_btn = makeAnalysisCloseBtn();
//     option_div.appendChild(close_btn);
// }

function makeAnalysisBigCloseDiv() {
    var close_btn = document.createElement('div');
    close_btn.className = 'upper_toolbar_btn';
    close_btn.onclick = (function () {
        return function () {
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

// Add kitanishi
function makeSubmitBtn(callback){
    var btn = document.createElement('input');
    btn.type = 'button';
    btn.className = 'btn btn-default';
    btn.value = 'SUBMIT';
    btn.style.height = '30%';
    btn.style.position = 'absoulte';
    btn.style.right = '5px';
    //btn.style.width = '10%';
    btn.style.float = 'right';
    btn.style.margin = '2px';
    btn.style.marginLeft = '10px';
    btn.onclick = (callback);
    return btn;
}
function makeAnalysisCloseBtn() {
   
    //console.log("makeAnalysisCloseBtn")
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
    btn.onclick = (function () {
        return function () {
            var option_div = document.getElementById('option')
            option_div.style.removeProperty("height");
            console.log(option_div, $(option_div.style))
            clearAnalysis();
            refresh();
            drawFeatures();
        }
    })();
    return btn;
}

function setOptionDIVforSlider() {
    var time_min_max = stinuum.mfCollection.getWholeMinMax(true).date;

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
    // if (buffer["connector"]["on"]){ 
    //     let set_btn = makeSubmitBtn(()=>{zoom();});
    //     document.getElementById(div_id.option).appendChild(set_btn);
    // }
    document.getElementById(div_id.option).appendChild(close_btn);

}

function time_query() {
    if (stinuum.mfCollection.getLength() == 0) {
        alert("no features");
        return;
    }
    turnOnOptionDIV();
    var option_div = document.getElementById(div_id.option);
    option_div.innerHTML = '';

    var slider_div = document.createElement('input');
    slider_div.type = 'text';
    slider_div.id = 'slider';
    document.getElementById(div_id.option).appendChild(slider_div);

    slider = new Slider("#slider", {
        id: "slider_bar",
        range: true,
        step: 1,
        tooltip_position: 'bottom',
        min: 0,
        max: 100,
        value: [0, 100],
        formatter: function (value) {
            if (!Array.isArray(value)) return;
            var time_min_max = stinuum.mfCollection.whole_min_max.date;
            if (time_min_max == undefined) return;
            var fastest = new Date(time_min_max[0]);
            var latest = new Date(time_min_max[1]);
            var diff = (latest.getTime() - fastest.getTime()) / 100;
            var new_fastest = new Date();
            var new_latest = new Date();
            new_fastest.setTime(fastest.getTime() + diff * value[0]);
            if (value[1] == 100) new_latest = latest;
            else new_latest.setTime(fastest.getTime() + diff * value[1]);

            var start = new_fastest.getFullYear() + " / " + (new_fastest.getMonth() + 1) + " / " + (new_fastest.getDate())
                + " " + (new_fastest.getHours()) + ":00";
            var end = new_latest.getFullYear() + " / " + (new_latest.getMonth() + 1) + " / " + (new_latest.getDate())
                + " " + (new_fastest.getHours()) + ":00";
            return start + " - " + end;
        }
    });

    slider.on("slideStop", function (sliderValue) {
        // if (!buffer["connector"]["on"]){ 
        //     zoom();
        // }
        zoom();
    })
    setOptionDIVforSlider();
}

function zoom() {
    var zoom_time = slider.getValue();
    var time_min_max = stinuum.mfCollection.getWholeMinMax(true).date;

    var fastest = new Date(time_min_max[0]);
    var latest = new Date(time_min_max[1]);

    var diff = (latest.getTime() - fastest.getTime()) / 100;
    fastest.setTime(fastest.getTime() + diff * zoom_time[0]);
    latest.setTime(fastest.getTime() + diff * zoom_time[1]);
    // 2018.03.15 refresh buffer
    // if (buffer["connector"]["on"]){
    //     // 2018.03.15 refresh buffer
    //     // Check Display Feature Layers
    //     if(buffer["data"]){
    //         let displayFeatureLayers = null;
    //         let keys = Object.keys(buffer["data"]);
    //         // let keys = Object.keys(buffer["data"]);
    //         console.log(keys)
    //         for( let i=0; i < keys.length ; i++){
    //             if(Object.keys(buffer["data"][keys[i]]).length > 0){
    //                 displayFeatureLayers = keys[i];
    //                 break;
    //             }
    //         }
    //         if(displayFeatureLayers){
    //             console.log(keys)
    //             buffer["connector"].getFeaturesByLayerWithin(
    //                 displayFeatureLayers,
    //                 buffer["data"][displayFeatureLayers],
    //                 fastest,
    //                 latest,
    //                 ()=>{
    //                     stinuum.queryProcessor.queryByTime(fastest, latest);
    //                     stinuum.geometryViewer.update();
    //                     close_img();
    //                 }
    //             );
    //         }
    //     }
    // } else {
    //     stinuum.queryProcessor.queryByTime(fastest, latest);
    //     stinuum.geometryViewer.update();
    // }
    console.log(fastest, latest)
    stinuum.queryProcessor.queryByTime(fastest, latest);
    stinuum.geometryViewer.update();
}
function close_img(){
    if (document.getElementById('image')) {
        if (removeOnTickCallback) {
            removeOnTickCallback();
            removeOnTickCallback = null;
        }
        stinuum.imageMarking.remove('image');
        $('#image').remove();
        $('#imageDialog').remove();
    }   
};
 
function showSelectImgProperties(image_id, pro_type_arr) {
    //console.log("show_img");
    if (document.getElementById('image')) {
        return;
    };
    // Set Dialog
    let dialog = document.createElement("div");
    dialog.id = "imageDialog";
    dialog.style.background = 'rgba(105, 105, 105, 0.8)';
    dialog.style.width = document.body.offsetHeight / 2 + 'px';
    dialog.style.height = document.body.offsetHeight / 3 + 'px';
    dialog.width = document.body.offsetHeight / 2;
    dialog.height = document.body.offsetHeight / 3;
    let img_menu = document.createElement('div');
    img_menu.style.bottom = '0';
    img_menu.style.backgroundColor = 'rgba(105, 105, 105, 0.8)';
    img_menu.style.height = "10%";
    img_menu.style.zIndex = "25";
    img_menu.id = 'img_menu';
    img_menu.style.cursor = 'pointer';
    img_menu.style.className = 'imageClass';
    let img_view = document.createElement('div');
    
    img_view.style.height = '100%'
    img_view.style.zIndex = "25";
    console.log(dialog.height)
    img_view.style.top = ''+dialog.height * 0.1+'px';
    img_view.width = document.body.offsetHeight / 3;
    img_view.height = document.body.offsetHeight / 3; 

    for (let i = 0; i < pro_type_arr.length; i++) {
        let div = document.createElement('div');
        div.style.padding = "0px 10px 0px 10px";
        div.style.color = 'white';
        div.style.float = 'left';
        //div.style.textAlign = 'center';
        div.style.fontSize = '100%';
        div.style.height = "100%";
        div.style.lineHeight = "100%";
        div.style.width = 100 / (pro_type_arr.length + 1) + '%';
        //div.innerHTML = pro_type_arr[i];
        div.id = 'btn_img_' + pro_type_arr[i];
        // Add ktianishi 2018.02.01 -->
        div.style.display = 'flex';
        div.style.justifyContent = 'center';
        div.style.flexDirection = 'row';
        div.style.alignItems = 'center';
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginTop = '0';
        checkbox.style.height = '100%';
        checkbox.id = 'chk_img_' + pro_type_arr[i];
        checkbox.dataset.name = pro_type_arr[i];
        checkbox.classList.add('chk-image-item');
        checkbox.addEventListener('click', (e) => {
            let elements = document.getElementsByClassName('chk-image-item');
            let current = e.currentTarget;
            console.log(current.id)
            Array.from(elements).forEach((element) => {
                if (current.checked && element.id != current.id) {
                    element.setAttribute('disabled', 'disabled');
                } else {
                    element.removeAttribute('disabled');
                }
            });
        });
        let label = document.createElement('label');
        label.for = checkbox.id;
        label.style.margin = "0px";
        label.style.fontWeight = '100';
        label.style.fontSize = "small";
        label.textContent = pro_type_arr[i];
        div.appendChild(checkbox);
        div.appendChild(label);

        div.onclick = (function(name_arr, index, image){
            return function(){
                document.getElementById('btn_img_' + name_arr[index]).style.backgroundColor = 'rgba(200,100,100,0.8)';
                for (var i = 0; i < name_arr.length; i++) {
                    if (i == index) continue;
                    document.getElementById('btn_img_' + name_arr[i]).style.backgroundColor = 'transparent';
                }
                let elements = document.getElementsByClassName('chk-image-item');
                let main_name = null;
                Array.from(elements).forEach((element) => {
                    if (element.checked) {
                        main_name = element.dataset.name;
                    }
                });
                if (main_name && main_name != name_arr[index]) {
                    // stinuum.propertyGraph.compare(main_name, name_arr[index], graph);
                } else {
                    // stinuum.propertyGraph.show(name_arr[index], graph);
                    stinuum.imageMarking.show_img(name_arr[index], image)
                }
            }
        })(pro_type_arr, i, image_id)

        img_menu.appendChild(div);
    }
    dialog.appendChild(img_menu);
    dialog.appendChild(img_view)

    var close_div = document.createElement('div');
    close_div.setAttribute("id", "btn_imgClose");
   
    close_div.style.color = 'white';
    close_div.style.float = 'right';
    close_div.style.justifyContent = 'center';
    close_div.style.fontSize = 'small';
    close_div.style.alignItems = 'center';
    close_div.style.display = 'flex';
    close_div.style.height = '100%'
    close_div.style.width = 100 / (pro_type_arr.length + 1) + '%';
    close_div.innerHTML = 'CLOSE';
    img_menu.appendChild(close_div);
    
    
    close_div.onclick = (function () {
        return function () {
            
            console.log("close")
            document.getElementById('img_menu').remove();
            $('img_view').remove();
            close_img()
            clearAnalysis();
            refresh();
            drawFeatures();

        }
    })();
    let img_canvas = document.createElement('canvas');
    img_canvas.id = 'image';
    img_canvas.style.width = '100%'
    img_canvas.style.height = '100%'
    img_canvas.width = img_view.width
    img_canvas.height = img_view.height
    img_view.appendChild(img_canvas);
   
    document.body.appendChild(dialog);
    changeOptionToolbarToCloseDIV();
}
// function show_img(pro_type_arr, image) {
//     let cnvs = document.getElementById('image');
//     let ctx = cnvs.getContext('2d');
//     console.log(Array.isArray(pro_type_arr), image)

//     var image_pro_arr = []
//     for (let i = 0; i < stinuum.mfCollection.features.length; i++) {
//         let pair = stinuum.mfCollection.features[i];
//         if (Array.isArray(pro_type_arr)){
//             for (let j = 0; j < pro_type_arr.length; j++) {
//                 let property = Stinuum.getPropertyByName(pair.feature, pro_type_arr[j], pair.id);
//                     // Stinuum.getPropertyByName(pair.feature, image_pro_type_arr[j], pair.id);
//                 console.log(property)
        
//                 if (property != -1) {
//                     image_pro_arr.push(property);
//                 }
//             }
//         }else{
//             let property = Stinuum.getPropertyByName(pair.feature, pro_type_arr, pair.id);
        
//             if (property != -1) {
//                 image_pro_arr.push(property);
//             }
//         }
//         // for (let j = 0; j < detection_pro_type_arr.length; j++) {
//         //     let property =
//         //         Stinuum.getPropertyByName(pair.feature, detection_pro_type_arr[j], pair.id);
//         //     if (property != -1) {
//         //         detection_pro_arr.push(property);
//         //     }
//         // }
//     }
//     console.log(image_pro_arr)
//     // //console.log(image_pro_arr[0][0].interpolation)
//     if (image_pro_arr[0][0].interpolation != undefined){
//         imageInterpolation = image_pro_arr[0][0].interpolation
//     }
//     let image_name_arr = [];
//     let image_object_arr = [];
//     let image_data = [];
//     for (let i = 0; i < image_pro_arr.length; i++) {
//         image_object_arr.push(image_pro_arr[i][0]);
//         image_name_arr.push(image_pro_arr[i][1]);
//     }
    
//     let timeline_detections = {};
//     for (let id = 0; id < image_object_arr.length; id++) {
//         let object = image_object_arr[id];
//         for (let i = 0; i < object.datetimes.length; i++) {
//             if (object.values[i] == null) {
//                 break;
//             }
//             let detection_time = new Date(object.datetimes[i]).getTime();
//             // convert form string to json
//             console.log(object.values[i])
//             console.log(object.values[i].hasOwnProperty('contains'))
//             if(object.values[i].hasOwnProperty('contains')){
//                 delete object.values[i].contains
//             }
//             console.log(object.values[i])
//             console.log(object.values[i].hasOwnProperty('contains'))
//             // timeline_detections[detection_time] = JSON.parse(object.values[i]);
//             timeline_detections[detection_time] = object.values[i];
//         }
//     }

//     timeline_images = [];
//     for (let id = 0; id < image_object_arr.length; id++) {
//         let object = image_object_arr[id];
//         for (let i = 0; i < object.datetimes.length; i++) {
//             let timeline_image = {}
//             //console.log(object.datetimes[i])
//             //console.log(new Date(object.datetimes[i]))
//             // 1504835873000
//             //console.log(new Date(object.datetimes[i]).getTime())
//             timeline_image.time = new Date(object.datetimes[i]).getTime();
//             if (object.values[i] == null)
//                 break;
//             timeline_image.value = object.values[i];
//             if (timeline_image.time in timeline_detections) {
//                 timeline_image.detection = timeline_detections[timeline_image.time];
//             }

//             timeline_images.push(timeline_image);
//         }
//     }
    
//     timeline_detections = {}
//     console.log("check point")
//     console.log(timeline_images)
//     if (timeline_images.length > 0) {
//         // let newValue = checkType(timeline_images[0].value)
//         // draw_image(ctx, newValue, cnvs.width, cnvs.height, timeline_images[0].detection);

//         let eventHelper = new Cesium.EventHelper();
//         removeOnTickCallback = eventHelper.add(
//             this.viewer.clock.onTick, function () {
//                 onTick(Cesium.JulianDate.toDate(this.viewer.clock.currentTime).getTime());
//             });
//     } else {
//         document.getElementById('img_menu').remove();
//         $('img_view').remove();
//         close_img();
//     }

    
//     drawFeatures();
// }
// function checkType(imageValue){
//     //need to check the image whether image is http or base64
//     var imageValue2;
//     if (typeof(imageValue) === "object"){
//         imageValue2 = imageValue[0]
//     }
//     else{
//         imageValue2 = imageValue
//     }
//     var NewImageValue;
//     var imageCheckValue = [ "http", "https",".png", ".bmp", ".gif", ".jpeg", ".jpg"]
//     var checker = false
//     for (var value in imageCheckValue){
        
//       if (imageValue2.indexOf(imageCheckValue[value]) != -1){
//         checker = true
//         NewImageValue = imageValue2
        
  
//         break;
//       }
//     }
//     if (!checker){
//         NewImageValue = 'data:image/jpeg;base64,'+imageValue2
        
//     }

//     return NewImageValue
// }
// function onTick(current_time) {
  
//     let image_div = document.getElementById("image");
//     if (image_div) {
//         let second_time = current_time;
//         let div_time = image_div.dataset.time;
//         if (second_time != div_time) {
//             image_div.dataset.time = second_time;
//             showImage(image_div);
//         }
//     }
// }

// function showImage(image_div) {
//     if (timeline_images.length > 0) {
//         var  span = 1500; // milliseconds
       
        
//         let div_time = image_div.dataset.time;
     
//         let lastIndex = timeline_images.length - 1;
//         // let src = 'data:image/jpeg;base64,';
//         let src;
//         let detections = [];
        
//         if ((timeline_images[0].time - span) > div_time ||
//             (timeline_images[lastIndex].time + span) < div_time) {
           
//             src = null;
//         }
//         else if (lastIndex == 0 || timeline_images[lastIndex].time < div_time) {
          
//             src = timeline_images[lastIndex].value;
//             detections = timeline_images[lastIndex].detection;
//         } else {
//             for (let i = 0; i <= lastIndex; i++) {
//                 if(imageInterpolation == "Discrete"){
//                     if (Math.abs(timeline_images[i].time - div_time) > span) {
                        
//                         src = null;
                        
//                     } else {
                       
//                         src = timeline_images[i].value;
//                         detections = timeline_images[i].detection;
//                         break;
//                     }
//                 }else{
//                     //step, Linear
//                     if (i < lastIndex-1){
//                         if ( timeline_images[i].time <= div_time && div_time < timeline_images[i+1].time) {
//                             src = timeline_images[i].value;
//                             detections = timeline_images[i].detection;
//                             break;                            
//                         } else {
//                             src = null;
                                                        
//                         }
//                     }else if(i == lastIndex-1) {
//                         var tempspan = (timeline_images[i+1].time - timeline_images[i].time) / 10
//                         console.log(tempspan, tempspan / 10)
//                         if (timeline_images[i].time <= div_time && div_time < (timeline_images[i+1].time - tempspan)) {
//                             src = timeline_images[i].value;
//                             detections = timeline_images[i].detection;
//                             break;                            
//                         } else {
//                             src = null;
                                                        
//                         }
//                     }else{
//                         var tempspan = (timeline_images[i-1].time - timeline_images[i].time) / 10
//                         if (div_time - timeline_images[i].time  >= tempspan) {
//                             src = timeline_images[i].value;
//                             detections = timeline_images[i].detection;
//                             break;                            
//                         } else {
//                             src = null;
                                                        
//                         }
//                     }
                  
//                 }
               
//                 // if (timeline_images[i].time == div_time) {
//                 //     src = timeline_images[i].value;
//                 //     detections = timeline_images[i].detection;
//                 //     break;
                    
//                 // }else{
//                 //     if (Math.abs(timeline_images[i].time - div_time) > span) {
                        
//                 //         src = null;
                        
//                 //     } else {
//                 //         src = timeline_images[i].value;
//                 //         detections = timeline_images[i].detection;
//                 //         break;
//                 //         //console.log("here 2")
//                 //         //console.log( timeline_images[i].value)
                        
//                 //     }
//                 // }
//             }
//         }   
        
//         let ctx = image_div.getContext('2d');
//         if (src) {
//             let newValue = checkType(src)
//             draw_image(ctx, newValue, image_div.width, image_div.height, detections);
//         } else {
//             ctx.fillStyle = 'rgb(224, 224, 224)';
//             ctx.fillRect(0, 0, image_div.width, image_div.height)
//         }
//     }
// }

// function draw_image(ctx, src, width, height, detections) {
//     // console.log("draw_image")
//     // console.log(ctx, width, height)
 
//     let image = new Image();
//     image.onload = function () {
//         ctx.drawImage(image, 0, 0, width, height);
//         // let h_ratio = height * 1.0 / image.height;
//         // let w_ratio = width * 1.0 / image.width;
//         // ctx.strokeStyle = 'rgb(255, 0 , 0)';
//         // if (detections) {
            
//         //     detections.forEach(function (v1) {
//         //         if (!(v1["class"] in detection_colors)) {
//         //             let next_color_index = Object.keys(detection_colors).length;
//         //             if (next_color_index >= colors.length) {
//         //                 next_color_index = colors.length - 1;
//         //             }
//         //             detection_colors[v1["class"]] = next_color_index;
//         //         }
//         //         ctx.strokeStyle = colors[detection_colors[v1["class"]]]
//         //         let rect = {};
//         //         console.log(v1.coordinates)
//         //         rect.x = Math.round(v1.coordinates[0][0] * w_ratio);
//         //         rect.y = Math.round(v1.coordinates[0][1] * h_ratio);
//         //         rect.width = Math.round((v1.coordinates[2][0] - v1.coordinates[0][0]) * w_ratio);
//         //         rect.height = Math.round((v1.coordinates[2][1] - v1.coordinates[0][1]) * h_ratio);
//         //         ctx.strokeRect(
//         //             rect.x,
//         //             rect.y,
//         //             rect.width,
//         //             rect.height
//         //         );
//         //     });
//         // }
//     }
  
//     image.src = src;
//     // //console.log("image")
//     // //console.log(src)
//     // //console.log(image.src)
// }

function showRadar() {
    if (stinuum.mfCollection.getLength() == 0) {
        alert("no features");
        return;
    }
    var attr_arr = ['Total Distance', 'Whole Lifetime', 'Average Speed'];
    var color_object = {
        'west': 'yellow',
        'east': 'green',
        'north': 'cyan',
        'south': 'red'
    }
    //radar_parent.style = ""

    var radar_canvas = document.createElement('canvas');
    radar_canvas.id = 'radar';
    radar_canvas.style.width = document.body.offsetHeight / 3 + 'px';
    radar_canvas.style.height = document.body.offsetHeight / 3 + 'px';
    radar_canvas.width = document.body.offsetHeight / 3;
    radar_canvas.height = document.body.offsetHeight / 3;


    document.body.appendChild(radar_canvas);
    var result = stinuum.directionRadar.show('radar');

    var offset = $('#radar').offset();
    $('#radar').mousemove(function (event) {
        //LOG(event);
        var bearing_type = findBearing(event.pageX - offset.left, event.pageY - offset.top);
        document.getElementById('radar_stat').style.color = color_object[bearing_type];
        document.getElementById('radar_stat_bearing').innerText = bearing_type;

        document.getElementById(attr_arr[0]).innerText = result[bearing_type].total_length.toFixed(3) + ' km';
        document.getElementById(attr_arr[1]).innerText = result[bearing_type].total_life + ' hours';
        document.getElementById(attr_arr[2]).innerText = result[bearing_type].avg_velocity.toFixed(3) + ' km/h';
        document.getElementById('radar_stat').style.top = event.pageY + 'px';
        document.getElementById('radar_stat').style.left = (event.pageX - document.getElementById('radar_stat').offsetWidth) + 'px';
        document.getElementById('radar_stat').style.visibility = "visible";
    });

    $('#radar').mouseout(function () {
        document.getElementById('radar_stat').style.visibility = "hidden";

    });

    var radar_stat = document.createElement('div');
    radar_stat.id = "radar_stat";
    //radar_stat.style.height = document.body.offsetHeight / 3 + 'px';

    var bearing_row = document.createElement('div');
    bearing_row.className = "row title";
    var bearing_col = document.createElement('h4');
    bearing_col.className = "col-md-12";
    bearing_col.setAttribute("style", "margin : 0;");
    bearing_col.id = "radar_stat_bearing";
    bearing_row.appendChild(bearing_col);
    radar_stat.appendChild(bearing_row);

    for (var i = 0; i < attr_arr.length; i++) {
        var item = attr_arr[i];
        var row = document.createElement('div');
        row.className = "row";
        var attr_col = document.createElement('div');
        attr_col.className = "col-md-5";
        attr_col.innerText = item;
        var value_col = document.createElement('div');
        value_col.className = "col-md-7";
        value_col.id = item;
        row.appendChild(attr_col);
        row.appendChild(value_col);
        radar_stat.appendChild(row);
    }

    document.body.appendChild(radar_stat);

    var radar_exp = document.getElementById(div_id.radar_comment);
    radar_exp.style.visibility = 'visible';
    radar_exp.style.width = document.body.offsetHeight / 3 + 'px';
    radar_exp.style.right = (document.body.offsetHeight / 3 + 10) + 'px'
    radar_exp.style.height = document.body.offsetHeight / 3 + 'px';

    changeOptionToolbarToCloseDIV();
    drawFeatures();
}

function findBearing(x, y) {
    var dist = document.body.offsetHeight / 3;
    var center = [dist / 2, dist / 2];
    if (x > y) { // north, east
        if (y > -x + dist) { // east
            return 'east';
        }
        else { // north
            return 'north';
        }
    }
    else { // south, west
        if (y > -x + dist) { // south
            return 'south';
        }
        else { //west
            return 'west';
        }
    }
}

function changeOptionToolbarToCloseDIV() {
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
function cleanImageDIV(){
    if (document.getElementById('img_menu')) {
        document.getElementById('img_menu').remove();
    }
    document.getElementById("image").innerHTML = '';
    document.getElementById("image").style.height = '0%';
}
function showGraphDIV(graph_id) {
    //console.log("showGraphDIV")
    let pro_menu_div = document.createElement('div');
    pro_menu_div.style.bottom = '0';
    pro_menu_div.style.backgroundColor = 'rgba(55, 55, 55, 0.8)';
    pro_menu_div.style.height = "5%";
    pro_menu_div.style.zIndex = "25";
    pro_menu_div.id = 'pro_menu';
    pro_menu_div.style.cursor = 'pointer';
    pro_menu_div.className = 'graph';

    let close_div = document.createElement('div');
    close_div.style.padding = "10px";
    close_div.style.color = 'white';
    close_div.style.textAlign = 'center';
    close_div.style.fontSize = 'small';
    close_div.style.verticalAlign = 'middle';
    close_div.innerHTML = 'CLOSE';
    pro_menu_div.appendChild(close_div);

    close_div.onclick = (function (graph_id) {
        return function () {
            document.getElementById('pro_menu').remove();
            document.getElementById(graph_id).style.height = "0%";
            clearAnalysis();
            refresh();
            drawFeatures();
        }
    })(graph_id);

    document.body.appendChild(pro_menu_div);
    document.getElementById('pro_menu').style.bottom = '20%';
    document.getElementById(graph_id).style.height = '20%';
    if (toolbar_show) {
        document.getElementById(graph_id).style.width = '85%';
        document.getElementById('pro_menu').style.width = '85%';
    }
    else {
        document.getElementById(graph_id).style.width = '100%';
        document.getElementById('pro_menu').style.width = '100%';
    }
    document.getElementById(graph_id).style.backgroundColor = 'rgba(5, 5, 5, 0.8)';
    changeOptionToolbarToCloseDIV();
}
