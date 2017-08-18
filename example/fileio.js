function printFileUploadButton(){

  var button = document.getElementById("uploadButton");
  button.style.padding = "10px";
  button.style.height = "7%";
  button.style.visibility = "visible";

  var input = document.createElement('button');
  //var input = document.createElement('input');
  var t = document.createTextNode("UPLOAD");
  input.style.color = "BLACK";
  input.id = "files";

  // input.type = "file";
  // input.id = "files";
  // input.multiple = "multiple";
  // input.name = "files[]";

  input.appendChild(t);
  button.appendChild(input);

  document.getElementById('files').addEventListener('click', getLocalFile, false);
  //document.getElementById('files').addEventListener('change', handleFileSelect_upload, false);
}

function getLocalFile(){
  var dropZone = document.getElementById('drop_zone');
  dropZone.style.visibility = 'visible';
  dropZone.style.textAlign = 'center';
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);
}
