function printFileUploadButton(){

  var button = document.getElementById("uploadButton");
  button.style.padding = "10px";
  button.style.display = "inline-block";
  button.style.visibility = "visible";

  var input = document.createElement('button');
  var analysis_bt = document.createElement('input');
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

  analysis_bt.type = 'button';
  analysis_bt.style.color = "BLACK";
  analysis_bt.className = "btn btn-default";
  analysis_bt.style.float = "right";
  analysis_bt.style.height = '85%';
  analysis_bt.style.width = "46%";
  analysis_bt.className = "btn btn-default";
  analysis_bt.style.position = "relative";
  analysis_bt.style.margin = "2%";
  analysis_bt.value = "ANALYSIS";

  analysis_bt.onclick = (function() {
    return function() {
      selectProperty('graph');
    };
  })();

  button.appendChild(input);
  button.appendChild(analysis_bt);

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

function closeDrop(){
    var dropZone = document.getElementById('drop_zone');
    dropZone.style.visibility = 'hidden';
    document.getElementById('drop_zone_bg').style.visibility = 'hidden';

}