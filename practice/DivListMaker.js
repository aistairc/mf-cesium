function DivListMaker(p_buffer){
	this.buffer = p_buffer;

}

DivListMaker.prototype.getLayerDivList = function(){
  var upper_ul = document.createElement('ul');
  upper_ul.style.height = "10%";
  var layer_name_list = getLayerNameList();
  for (var i = 0; i < layer_name_list.length; i++) {
    var li = document.createElement('li');
    var a = document.createElement('a');

    li.id = layer_name_list[i];
    a.innerText = layer_name_list[i];
    a.onclick = (function(id) {
      return function() {
        //getFeatures_local(id,feature);
        printFeaturesList(id);
        printCheckAllandUnCheck();
      };
    })(layer_name_list[i]);

    //getFeatures_local(layer_name_list[i],feature_list);
    li.style = "width:inherit";
    a.style = "width:inherit";
    li.className = "list-group-item";
    li.appendChild(a);
    upper_ul.appendChild(li);
  }
  return upper_ul;
}

DivListMaker.prototype.getFeaturesDivList = function(){
	
}