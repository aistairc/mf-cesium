var requestFeatureLayersAndShow = function(){
  var url = getParameterByName('url');

  return $.ajax({
     url: url +'/$ref',
     type: 'GET',
     success: function(data) {
       console.log('성공 - ', data);

       var table = document.getElementById('name_list');
       for (var i = 0 ; i < data.url.length ; i++){
         var data_url = data.url[i];
         var name = data_url.split('\'')[1];

         var row = table.insertRow(table.rows.length);
         var cell1 = row.insertCell(0);
         cell1.innerHTML = name;


         cell1.onclick = (function(p_id){
           return function(){
             document.getElementById('name_list').innerHTML = '';
             requestFeatures(p_id);
           }
         })(data_url);

       }
     },
     error: function(xhr) {
       console.log('실패 - ', xhr);
     }
   });


 }

var requestFeatures = function(name){
  var url = getParameterByName('url');

  return $.getJSON(url +"/" + name +"/$ref", function(data){

    var table = document.getElementById('name_list');
    for (var i = 0 ; i < data.url.length ; i++){
      var data_url = data.url[i];
      var data_name = data_url.split('\'')[1];

      var row = table.insertRow(table.rows.length);
      var cell1 = row.insertCell(0);
      cell1.innerHTML = data_name;
      cell1.class = 'FeaturesList';
      cell1.onclick = (function(p_id, p_name){
        return function(){
          document.getElementById('name_list').innerHTML = '';

          var new_list = new MovingFeatureList();
          new_list.id = p_name;

          if (mfl[p_name] == undefined){
            mfl[p_name] = new_list;
            active_mfl = new_list;
            new_list.requestFeatureList(p_id);
          }
          else{
            active_mfl = mfl[p_name];
            showListTable();
          }
        }
      })(name +"/" + data_url, data_name);

    }
  });

}
