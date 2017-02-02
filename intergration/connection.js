function sendRequest(){ //later we need to put url as parameter
  var url = "http://ec2-52-198-116-39.ap-northeast-1.compute.amazonaws.com:9876/";
  var data_list1 = new Array();
  var data_list2 = new Array();
  url += "$ref";
  var promise = request1(url);
  promise.then(function(arr){
    data_list1 = arr;
    var new_url = url.replace("$ref","") +arr[0] +"/$ref";
    console.log(data_list1);
    return request2(new_url);
  })
  .catch(function(){
    console.log("error");
  })
  .then(function(arr){
    data_list2 = arr;
    console.log(data_list2);
  })
  .catch(function(){
    console.log("error");
  });
  /*
  this part will be for request2
  .then(function(arr){

    console.log(arr);
    var new_url = url.replace("$ref","") +arr[0];
    return(request3(new_url));
  })
  .catch(function(){
    console.log("error");
  });*/

}

var request1 = function(url){
    return new Promise(function(resolved, rejected){
        var xhr = createCORSRequest('GET', url);
        if (!xhr) {
          alert('CORS not supported');
          return;
        }
        xhr.onload = function() {
          var text = xhr.responseText;
          //var title = getTitle(text);
          var arr = JSON.parse("[" + text + "]");
          arr = $.map(arr[0], function(el){return el});
          resolved(arr);
        };
        xhr.onerror = function() {
          alert('Woops, there was an error making the request.');
        };
        xhr.send();
    });
  }
  var request2 = function(url){
    return new Promise(function(resolved, rejected){
        var xhr = createCORSRequest('GET', url);
        if (!xhr) {
          alert('CORS not supported');
          return;
        }
        xhr.onload = function() {
          var text = xhr.responseText;
          //var title = getTitle(text);
          var arr = JSON.parse("[" + text + "]");
          arr = $.map(arr[0], function(el){return el});
          resolved(arr);
        };

        xhr.onerror = function() {
          alert('Woops, there was an error making the request.');
        };
        xhr.send();

    });
  }
  var request3 = function(url){
    return new Promise(function(resolved,rejected){

        var xhr = createCORSRequest('GET', url);
        if (!xhr) {
          alert('CORS not supported');
          return;
        }
        xhr.onload = function() {
          var text = xhr.responseText;
          console.log(text);
          resolved(text);
        };
        xhr.onerror = function() {
          alert('Woops, there was an error making the request.');
        };
        xhr.send();

    });
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
