function printFeaturesList(layer){
	var list = list_maker.getFeaturesDivList(layer);
	var list_div = div_id.left_upper_list;
    var printArea = document.getElementById(list_div);
    printArea.innerHTML = "";
    printArea.appendChild(list);
}

function changeMenuMode(mode){
    printMenuState = mode;
    var printState = document.getElementById(div_id.menu_mode);
    printState.innerText = printMenuState;
}