
function init(){

  mfl = new MovingFeatureList();


  //requestFeatureLayersAndShow();
  $('.test').click( function() {
    mfl.loadFeaturesInLocalJSONFile($(this).attr('id')).then(
      testInLocal
    );
  })

  viewer.scene.morphComplete.addEventListener(function (){
    if (viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW){
      //drawZaxis();
    }
    document.getElementById('property_list').innerHTML = '';
    document.getElementById('property_list').style.visibility = 'hidden';
    document.getElementById('property_list').style.cursor = '';

    document.getElementById("cesiumContainer").style.height = '100%';
    document.getElementById("graph").style.height = '0%';

    viewer.clear();
    viewer.scene.completeMorph();
  });

}

  init();
function showFirstList(){
  var url = getParameterByName('url');
  LOG(url);
  $.getJSON(url+'/$ref', function(data){

  });
}

function testInLocal(){
  $('#name_list').empty();
  showListTable('name_list');
  $('#btn_div').css('visibility','visible');
}

function showListTable(table_id='name_list'){

  var table = document.getElementById(table_id);
  var list = mfl.getAllNameList();

  for (var i = 0 ; i < list.length ; i++){
    var id = list[i].id;
    var row = table.insertRow(table.rows.length);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = list[i].name;
    cell1.id = id;

    cell1.onclick = (function(p_id){
       return function(){
         selectProperty(p_id);
       }
    })(id);

    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.id = "check"+id;

    var cell2 = row.insertCell(1);
    cell2.appendChild(checkbox);
  }
}

function selectProperty(id, table_id='property_list'){

  var table = document.getElementById(table_id);

  table.innerHTML = '';
  table.style.visibility = 'visible';
  table.style.cursor = 'pointer';

  var obj = mfl.getById(id);

  var property_list = obj.temporalProperties;

  for (var i = 0 ; i < property_list.length ; i++){
    var property_object = property_list[i];
    var row = table.insertRow(table.rows.length);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = property_object.name;

    cell1.onclick = (function(p_obj){
      return function(){
        table.innerHTML = '';
        table.style.visibility = 'hidden';
        table.style.cursor = '';
        obj.animateWithArray([obj.id], viewer.scene.mode == Cesium.SceneMode.COLUMBUS_VIEW);
        showProperty(p_obj);
      }
    })(property_object);

  }

}




Cesium.Viewer.prototype.clear = function(){
  this.clock.multiplier = 10;
  this.dataSources.removeAll();
  var temp = this.scene.primitives.get(0);
  this.entities.removeAll();
  this.scene.primitives.removeAll();
  this.scene.primitives.add(temp);
}


function viewMain(){
  viewer.clear();
  document.getElementById('name_list').innerHTML = '';
  document.getElementById('btn_div').style.visibility = 'hidden';

  document.getElementById('property_list').innerHTML = '';
  document.getElementById('property_list').style.visibility = 'hidden';
  document.getElementById('property_list').style.cursor = '';

  document.getElementById("cesiumContainer").style.height = '100%';
  document.getElementById("graph").style.height = '0%';

  init();
}


function showProperty(object){
  document.getElementById("graph").innerHTML = '';
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

  svg.on("click", function () {
    var coords = d3.mouse(this);
    var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");

    var isodate = formatDate(x.invert(coords[0]));
    viewer.clock.currentTime=Cesium.JulianDate.fromDate(new Date(isodate));
    viewer.clock.shouldAnimate = false;
  })
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
