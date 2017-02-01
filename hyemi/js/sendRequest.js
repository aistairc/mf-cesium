function sendRequest(){
 sendFirstRequest();


}

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}
function sendFirstRequest() {
  // This is a sample server that supports CORS.
  var url = "http://ec2-52-198-116-39.ap-northeast-1.compute.amazonaws.com:9876/$ref";

  var xhr = createCORSRequest('GET', url);
  //xhr.setRequestHeader("Access-Control-Allow-Credentials" , "true");
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    //var title = getTitle(text);
    var arr = JSON.parse("[" + text + "]");
    arr = $.map(arr[0], function(el){return el});
    var label_list = "";
    for(var i = 0 ; i < arr.length ; i++){
      label_list += "<div id = \""
      label_list += arr[i].toString();
      label_list += "\"";
      label_list += "onclick = \'sendSecondRequest(this, \"";
      label_list += url + "\")\'";
      label_list += "value = \"";
      label_list += arr[i].toString();
      label_list += "\">";
      label_list += arr[i];
      label_list += "</div>";
    }
console.log(label_list);
    document.getElementById("get_server_info").innerHTML = label_list;
    //alert('Response from CORS request to ' + url + ': ' + title);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}
function sendSecondRequest(callValue, url_before){

  var feature = callValue.id;
  var url = url_before.replace("$ref","");
  url += feature+"/$ref";

  var xhr = createCORSRequest('GET', url);
  //xhr.setRequestHeader("Access-Control-Allow-Credentials" , "true");
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    //var title = getTitle(text);
    var arr = JSON.parse("[" + text + "]");
    url = url.replace("/$ref","");
    arr = $.map(arr[0], function(el){return el});
    console.log(arr);
    var label_list = "";
    for(var i = 0 ; i < arr.length ; i++){
      label_list += "<div id = \""
      label_list += arr[i].toString();
      label_list += "\"";
      label_list += "onclick = \'sendSecondRequest(this, \"";
      label_list += url + "\" )\'";
      label_list += " value = \"";
      label_list += arr[i].toString();
      label_list += "\">";
      label_list += arr[i];
      label_list += "</div>";
    }
    console.log(label_list);
    document.getElementById("get_server_info").innerHTML = "";
    document.getElementById("get_server_info").innerHTML = label_list;
    //alert('Response from CORS request to ' + url + ': ' + title);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}
function sendThirdRequest(callValue, url_before){
    var feature = callValue.id;
    console.log(callValue.id);

    url += "/"+feature;

    var xhr = createCORSRequest('GET', url);
    //xhr.setRequestHeader("Access-Control-Allow-Credentials" , "true");
    if (!xhr) {
      alert('CORS not supported');
      return;
    }

    // Response handlers.
    xhr.onload = function() {
      var text = xhr.responseText;
      //var title = getTitle(text);
      console.log(text);
      document.getElementById("get_server_info").innerHTML = "";
      //document.getElementById("get_server_info").innerHTML = label_list;
      //alert('Response from CORS request to ' + url + ': ' + title);
    };

    xhr.onerror = function() {
      alert('Woops, there was an error making the request.');
    };

    xhr.send();

}
