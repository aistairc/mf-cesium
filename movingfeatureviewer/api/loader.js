
var requestFeatureLayers = function(result){
  var url = getParameterByName('url');
  return $.ajax({
    url: url +'/$ref',
    type: 'GET',
    success: function(data) {
      console.log('성공 - ', data);
      result = data.url;

    },
    error: function(xhr) {
      console.log('실패 - ', xhr);
    }
  });
}

var requestFeatureList = function(name, result){
  var url = getParameterByName('url');

  return $.getJSON(url +"/" + name +"/$ref", function(data){
    result = data.url;
  });

}


var requestFeature = function(feature_url, result){
  var url = getParameterByName('url');
  return $.getJSON(url +'/'+feature_url , function(data){
      result = data;
  });
}
