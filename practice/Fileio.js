function printFileUploadButton(){
  var button = document.getElementById("uploadButton");
  var input = document.createElement('button');
  input.id = "files";
  input.className = "btn btn-default upload";
  input.multiple = "multiple";
  input.name = "files[]";

  var t = document.createTextNode("UPLOAD");
  input.appendChild(t);

  button.appendChild(input);

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
