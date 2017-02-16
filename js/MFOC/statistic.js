MFOC.addDirectionInfo = function(cumulative, geometry){
  var life = MFOC.calculateLife(geometry) /1000000;
  var length = MFOC.calculateLength(geometry);

  var start_point = geometry.coordinates[0];
  var end_point = geometry.coordinates[geometry.coordinates.length-1];

  if (geometry.type != "MovingPoint" ){ // Polygon, LineString
    start_point = MFOC.getCenter(start_point, geometry.type);
    end_point = MFOC.getCenter(end_point, geometry.type);
  }

  var dist_x, dist_y;

  dist_x = end_point[0] - start_point[0];
  dist_y = end_point[1] - start_point[1];

  if (dist_x == 0){
    if (dist_y > 0){
      cumulative.north.total_life += life;
      cumulative.north.total_length += length;
    }
    else if (dist_y < 0){
      cumulative.south.total_life += life;
      cumulative.south.total_length += length;
    }
    else{

    }
  }
  else{
    var slope = dist_y / dist_x ;
    if (slope < 1 && slope > -1){
      if (dist_x > 0 ){
        cumulative.east.total_life += life;
        cumulative.east.total_length += length;
      }
      else{
        cumulative.west.total_life += life;
        cumulative.west.total_length += length;
      }
    }
    else {
      if (dist_y >0){
        cumulative.north.total_life += life;
        cumulative.north.total_length += length;
      }
      else{
        cumulative.south.total_life += life;
        cumulative.south.total_length += length;
      }
    }
  }


}


MFOC.calculateLife = function(geometry){
  return - new Date(geometry.datetimes[0]).getTime() + new Date(geometry.datetimes[geometry.datetimes.length-1]).getTime();
};

MFOC.calculateLength = function(geometry){
  var total = 0;
  for (var i = 0 ; i < geometry.coordinates.length - 1 ; i++){
    var point1;
    var point2;
    if (geometry.type == "MovingPoint"){
      point1 = geometry.coordinates[i];
      point2 = geometry.coordinates[i+1];
    }
    else{
      point1 =MFOC.getCenter(geometry.coordinates[i], geometry.type);
      point2=MFOC.getCenter(geometry.coordinates[i+1], geometry.type);
    }
    total += MFOC.calculateDist(point1, point2);
  }
  return total;
};


MFOC.getCenter = function(coordinates, type){
  var x,y;
  var length = coordinates.length;
  if (type = 'MovingPolygon'){
    length -= 1;
  }
  for (var i = 0 ; i < length ; i++){
    x += coordinates[i][0];
    y += coordinates[i][1];
  }
  x /= length;
  y /= length;
  return [x,y];
}






MFOC.prototype.showPropertyArray = function(object_arr, div_id){

  document.getElementById(div_id).innerHTML = '';

  //if put empty array.
  if (object_arr == undefined || object_arr.length == 0){
    return;
  }
  var min_max = MFOC.findMinMaxProperties(object_arr);

  var svg = d3.select("#"+div_id).append("svg");
  svg.attr("width",$(window).width());
  svg.attr("height",$(window).height() / 5);
  var margin = {top: 10, right: 20, bottom: 10, left: 50},
  width = $(window).width() - margin.left - margin.right,
  height = $(window).height() /5 - margin.top - margin.bottom;

  var g = svg.append("g")
        .attr("transform", "translate("+ margin.left +"," + 0 + " )");

  var x = d3.scaleTime()
  .rangeRound([0, width]);
  LOG(height);
  var y = d3.scaleLinear()
  .rangeRound([height, 0]);

  var line = d3.line()
  .x(function(d) { return x(d.date)})
  .y(function(d) { return y(d.value)});


  x.domain(min_max.date);
  y.domain(min_max.value);

  g.append("g")
  .attr("transform" , "translate(0,"+height+")")
  .attr("class","axis")
  .call(d3.axisBottom(x))
  .select(".domain")
  .remove();

  g.append("g")
  .attr("class","axis")
  .call(d3.axisLeft(y))
  .append("text")
  .attr("fill", '#000')
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text(object_arr[0].name+"("+object_arr[0].uom+")")  ;


  var graph_data = [];
  for (var id = 0 ; id < object_arr.length ; id++){
    var data = [];
    var object = object_arr[id];
    for (var i = 0 ; i < object.datetimes.length ; i++){
      var comp = {};
      var da = new Date(object.datetimes[i]).toISOString();

      comp.date = new Date(object.datetimes[i]);//dateparse(da);
      comp.value = object.values[i];

      data.push(comp);
    }

    if (object.interpolations == 'Spline'){
      line.curve(d3.curveCardinal);
    }
    else if (object.interpolations == 'Stepwise'){
      line.curve(d3.curveStepAfter)
    }

    var r_color = d3.rgb(Math.random() *255,Math.random() *255,0);

    graph_data.push(data);
    if(object.interpolations == 'Discrete'){
      for (var i = 0 ; i < data.length ; i++){
        g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d,i) { return x(d.date); } )
        .attr("cy", function(d,i) { return y(d.value); } )
        .attr("r", 5);
      }
    }
    else{
      g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", r_color)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);
    }

  }
  svg.on("click", function () {
    var coords = d3.mouse(this);
    var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");

    var isodate = formatDate(x.invert(coords[0]));
    viewer.clock.currentTime=Cesium.JulianDate.fromDate(new Date(isodate));
    viewer.clock.shouldAnimate = false;
  });

}
