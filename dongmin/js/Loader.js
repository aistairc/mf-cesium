var requestJson = function(url, func){
  return $.getJSON(url, function(data){
    console.log("first" + new Date().getTime() );
  }).then(function(data){
    func(data);
  } );
}
