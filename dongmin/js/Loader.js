var requestFeatureLayersAndShow = function(){
  var url = getParameterByName('url');
  LOG(url);


  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          myFunction(this.responseText);
      }
  };
  xmlhttp.open("GET", url+"/$ref", true);
  //xmlhttp.setRequestHeader("Access-Control-Allow-Origin",'*');
  xmlhttp.send();

/*
  $.ajax({
   url: url +'/$ref',
   dataType: 'jsonp',
   jsonpCallback: "myCallback",
   success: function(data) {
     console.log('성공 - ', data);
   },
   error: function(xhr) {
     console.log('실패 - ', xhr);
   }
 });

*/
/*
$.ajax({
   url: url +'/$ref',
   dataType: 'JSONP',
   jsonpCallback:'callback',
   type: 'GET',
   success: function(data) {
     console.log('성공 - ', data);
   },
   error: function(xhr) {
     console.log('실패 - ', xhr);
   }
 });
 */
  /*
  for (var i = 0 ; i < data.url.length ; i++){
  var fl_url = data.url[i];
  var fl_name = data.url[i].split(" '")[1];
  var row = table.insertRow(table.rows.length);
  var cell1 = row.insertCell(0);
  cell1.innerHTML = fl_name;
  cell1.onclick = (function(name){
  return function(){
  //selectProperty(name);
}
})(fl_name);
}
*/

}
