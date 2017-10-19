
Stinuum.PropertyGraph.prototype.show = function(propertyName, divID){
  var pro_arr = [];
  for (var i = 0 ; i < this.super.mfCollection.features.length ; i ++){
    var pair = this.super.mfCollection.features[i];
    var property = Stinuum.getPropertyByName(pair.feature, propertyName, pair.id);
    if (property != -1){
      pro_arr.push(property);
    }
  }
  // if (pro_arr.length == 0){
  //   return -1;
  // }

  this.showPropertyArray(propertyName, pro_arr, divID);
}

Stinuum.PropertyGraph.prototype.showPropertyArray = function(propertyName, array, div_id){


  document.getElementById(div_id).innerHTML = '';

  //if put empty array.
  if (array == undefined || array.length == 0){
    return;
  }


  var name_arr = [];
  var object_arr = [];
  var propertyGraph = this;

  for (var i = 0 ; i < array.length ; i++){
    object_arr.push(array[i][0]);
    name_arr.push(array[i][1]);
  }

  var min_max = Stinuum.findMinMaxProperties(object_arr);

  var svg = d3.select("#"+div_id).append("svg");
  svg.attr("width",$("#"+div_id).width());
  svg.attr("height",$("#"+div_id).height());

  var margin = {top: 10, right: 20, bottom: 30, left: 50},
  width = $("#"+div_id).width() - margin.left - margin.right,
  height = $("#"+div_id).height() - margin.top - margin.bottom;


  var g = svg.append("g")
        .attr("transform", "translate("+ margin.left +"," + margin.top + " )")
        .attr("width", width)
        .attr("height", height);
//        .style("font-size","small");

  var x = d3.scaleTime()
  .rangeRound([0, width]);
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
//  .style("font-size","small")
  .call(d3.axisBottom(x))
  .select(".domain")
  .remove();


  if (object_arr[0].uom == "null"){
    var y_axis = g.append("g");
    y_axis
    .attr("class","axis")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", '#000')
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    //.text(object_arr[0].uom)  ;
  }
//   else if(object_arr[0].name == undefined){
//     var y_axis = g.append("g");
//     y_axis
//     .attr("class","axis")
//     .call(d3.axisLeft(y))
//     .append("text")
//     .attr("fill", '#000')
//     .attr("transform", "rotate(-90)")
// //    .style("font-size","small")
//     .attr("y", 6)
//     .attr("dy", "0.71em")
//     .attr("text-anchor", "end")
//     .text(object_arr[0].uom)  ;
//   }
  else{
    var y_axis = g.append("g");
    y_axis
    .attr("class","axis")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", '#000')
    .attr("transform", "rotate(-90)")
//    .style("font-size","small")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text(propertyName+"("+object_arr[0].uom+")")  ;
  }
  console.log(object_arr);


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

    var color = this.super.mfCollection.getColor(name_arr[id]);
    var r_color = d3.rgb(color.red * 255, color.green * 255, color.blue * 255);

    graph_data.push(data);
    if(object.interpolations == 'Discrete'){
      for (var i = 0 ; i < data.length ; i++){
        g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d,i) { return x(d.date); } )
        .attr("cy", function(d,i) { return y(d.value); } )
        .attr("r", 1)
        .style("fill", r_color);
      }
    }
    else{
      g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", r_color)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 3)
      .attr("d", line);
    }

  }

  var drag = d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
  svg.call(drag);

  var start_coord;
  var rect ;

  function dragstarted(d){
    d3.event.sourceEvent.stopPropagation();
    start_coord = d3.mouse(this);
    rect = svg.append("rect")
      .attr("fill", d3.rgb(0,0,0,0.5));

    if (start_coord[0]-margin.right <= 0){
      return;
    }
    var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");

    viewer.clock.currentTime=Cesium.JulianDate.fromDate(new Date(formatDate(x.invert(start_coord[0]-51.09))));
    viewer.clock.shouldAnimate = false;
    //    console.log(rect);
    //  console.log(start_coord);
    //d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    d3.select(this).classed("dragging", true);
  }

  function dragged(d){
    var coord = d3.mouse(this);

    if (coord[0] > start_coord[0]){
      rect.attr("width", Math.abs(coord[0] - start_coord[0]) );
      rect.attr("height", height + margin.bottom);
      rect.attr("x", start_coord[0]);
    }
    else{
      rect.attr("width", Math.abs(coord[0] - start_coord[0]) );
      rect.attr("height", height + margin.bottom);
      rect.attr("x", coord[0]);
    }


  }

  function dragended(d){
    d3.select(this).classed("dragging", false);
    var end_coord = d3.mouse(this);
    var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");
  //  console.log(end_coord);
    var start_date, end_date;

    if (end_coord[0] > start_coord[0]){
      start_date = formatDate(x.invert(start_coord[0]-51.09));
      end_date =  formatDate(x.invert(end_coord[0]-51.09));
      if (end_coord[0] - start_coord[0] < 100){
        rect.remove();
        return;
      }
    }
    else{
      if (start_coord[0] - end_coord[0] < 100){
        rect.remove();
        return;
      }

      start_date = formatDate(x.invert(end_coord[0]-51.09));
      end_date =  formatDate(x.invert(start_coord[0]-51.09));
    }

    propertyGraph.super.mfCollection.queryByTime(new Date(start_date), new Date(end_date));
    propertyGraph.super.geometryViewer.update();
    propertyGraph.show(propertyName, div_id);
    rect.remove();
  }



}
