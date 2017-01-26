
function showProperty(object){
  document.getElementById("graph").innerHTML = '';
  //var object = poly_tp_obj.data.features[id].temporalProperties[0];

  document.getElementById("cesiumContainer").style.height = '80%';
  document.getElementById("graph").style.height = '20%';

  var data = [];

  var dateparse = d3.timeParse("%Y-%m-%d %H:%M:%S");

  for (var i = 0 ; i < object.datetimes.length ; i++){
    var comp = {};
    comp.date = dateparse(object.datetimes[i]);
    comp.value = object.values[i];
    data.push(comp);
  }

  var svg = d3.select("#graph"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = $(window).width() - margin.left - margin.right,
    height = $(window).height() * 0.2 - margin.top - margin.bottom;

  LOG(data);
  var g = svg.append("g").attr("transform", "translate("+ margin.left +"," + margin.top + " )");

  var x = d3.scaleTime()
    .rangeRound([0, width]);

  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  var line = d3.line()
    .x(function(d) { return x(d.date)})
    .y(function(d) { return y(d.value)});

  if (object.interpolations == 'Spline'){
    line.curve(d3.curveCardinal);
  }
  else if (object.interpolations == 'Stepwise'){
    line.curve(d3.curveStepAfter)
  }

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.value; }));


  g.append("g")
      .attr("transform" , "translate(0,"+height+")")
        .call(d3.axisBottom(x))
      .select(".domain")
        .remove();

  g.append("g")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text(object.name+"("+object.uom+")");

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
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);
  }


}
