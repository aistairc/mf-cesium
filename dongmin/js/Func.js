function mergeObject(obj1, obj2){
  for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
}

function getNewFeature(geometry){
  var obj;
  if (geometry.type == 'MovingPolygon'){
    obj = new MovingPolygon();
  }
  else if (geometry.type == 'MovingPoint'){
    obj = new MovingPoint();
  }
  else if (geometry.type == 'MovingLineString'){
    obj = new MovingLineString();
  }
  else{
    alert("undefined type");
    return;
  }
  return obj;
}

var calculateDist = function(point_1, point_2){
  return Math.sqrt(Math.pow(point_1[0] - point_2[0],2) + Math.pow(point_1[1] - point_2[1],2));
}


var normalizeTime = function(date, min_max_date, value = 15000000){
  if (!(date instanceof Date)){
    LOG('normalizeTime function must have Date type');
    return;
  }
  var separation = min_max_date[1] - min_max_date[0];
  return (date.getTime() - min_max_date[0])/separation * value;
};


var findMinMaxTime = function(datetimes){
  var min_max_date = [];
  min_max_date[0] = new Date(datetimes[0]).getTime();
  min_max_date[1] = new Date(datetimes[0]).getTime();

  for (var j = 1 ; j < datetimes.length ; j++){

    var time = new Date(datetimes[j]).getTime();

    if (min_max_date[0] > time){
      min_max_date[0] = time;
    }
    if (min_max_date[1] < time){
      min_max_date[1] = time;
    }
  }
  return min_max_date;
};

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
