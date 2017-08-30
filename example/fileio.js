function printFileUploadButton(){

  var button = document.getElementById("uploadButton");
  button.style.padding = "10px";
  button.style.display = "inline-block";
  button.style.visibility = "visible";

  var input = document.createElement('button');
  var graph_bt = document.createElement('input');
  //var input = document.createElement('input');
  input.style.color = "BLACK";
  input.style.width = "46%";
  input.style.height = "85%";
  input.id = "files";
  input.className = "btn btn-default";
  input.multiple = "multiple";
  input.style.margin = "2%";
  input.name = "files[]";

  var t = document.createTextNode("UPLOAD");
  input.appendChild(t);

  graph_bt.type = 'button';
  graph_bt.style.color = "BLACK";
  graph_bt.className = "btn btn-default";
  graph_bt.style.float = "right";
  graph_bt.style.height = '85%';
  graph_bt.style.width = "46%";
  graph_bt.className = "btn btn-default";
  graph_bt.style.position = "relative";
  graph_bt.style.margin = "2%";
  graph_bt.value = "GRAPH";

  graph_bt.onclick = (function() {
    return function() {
      selectProperty('graph');
    };
  })();

  button.appendChild(input);
  button.appendChild(graph_bt);

  document.getElementById('files').addEventListener('click', getLocalFile, false);
}

function getLocalFile(){
  var dropZone = document.getElementById('drop_zone');
  dropZone.style.visibility = 'visible';
  document.getElementById('drop_zone_bg').style.visibility = 'visible';
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);

  cleanGraphDIV();
}
