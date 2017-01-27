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
  xhr.setRequestHeader("Origin", "*");
  console.log(xhr);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    var title = getTitle(text);
    alert('Response from CORS request to ' + url + ': ' + title);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}
