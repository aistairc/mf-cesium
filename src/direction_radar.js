
Stinuum.DirectionRadar.prototype.remove = function(canvasID){
  var radar_canvas = document.getElementById(canvasID);
  radar_canvas.innerHTML = '';
  radar_canvas.getContext('2d').clearRect(0, 0, radar_canvas.width, radar_canvas.height);

  this.super.mfCollection.colorCollection = {};
}

/**
@color : [west : yellow, east : green, north : cyan, south : red]
*/
Stinuum.DirectionRadar.prototype.show = function(canvasID){


  var drawWest = function(ctx, h_width, h_height, length, max_len, velocity, max_velo, color){
    ctx.beginPath();
    ctx.moveTo(h_width,h_height);
    ctx.lineTo(h_width - length/max_len * 0.5 * 0.9 * h_width, h_height - 0.25 * 1 * h_height * velocity/max_velo);
    ctx.lineTo(h_width - length/max_len * 0.5 * 0.9 *  h_width, h_height - 0.5 * 1 * h_height * velocity/max_velo);
    ctx.lineTo(h_width - length/max_len * 1.0 * 0.9 *  h_width, h_height);
    ctx.lineTo(h_width - length/max_len * 0.5 * 0.9 *  h_width, h_height + 0.5 * 1 * h_height * velocity/max_velo);
    ctx.lineTo(h_width - length/max_len * 0.5 * 0.9 *  h_width, h_height + 0.25 * 1 * h_height * velocity/max_velo);
    ctx.fillStyle= color;
    ctx.fill();
  }

  var drawEast = function(ctx, h_width, h_height, length, max_len, velocity, max_velo, color){
    ctx.beginPath();
    ctx.moveTo(h_width,h_height);
    ctx.lineTo(h_width + length/max_len * 0.5 * 0.9 * h_width, h_height - 0.25 * 1 * h_height * velocity/max_velo);
    ctx.lineTo(h_width + length/max_len * 0.5 * 0.9 * h_width, h_height - 0.5 * 1 * h_height * velocity/max_velo);
    ctx.lineTo(h_width + length/max_len * 1.0 * 0.9 * h_width, h_height);
    ctx.lineTo(h_width + length/max_len * 0.5 * 0.9 * h_width, h_height + 0.5 * 1 * h_height * velocity/max_velo);
    ctx.lineTo(h_width + length/max_len * 0.5 * 0.9 * h_width, h_height + 0.25 * 1 * h_height * velocity/max_velo);
    ctx.fillStyle= color;
    ctx.fill();
  }

  var drawNorth = function(ctx, h_width, h_height, length, max_len, velocity, max_velo, color){
    ctx.beginPath();
    ctx.moveTo(h_width,h_height);
    ctx.lineTo(h_width - velocity/max_velo * 0.25 * 1 * h_width, h_height - 0.5 * 0.9* h_height * length/max_len);
    ctx.lineTo(h_width - velocity/max_velo* 0.5 * 1 * h_width, h_height - 0.5 * 0.9  * h_height * length/max_len);
    ctx.lineTo(h_width, h_height - 1.0 * 0.9 *  h_height * length/max_len);
    ctx.lineTo(h_width +  velocity/max_velo * 0.5 * 1 * h_width, h_height - 0.5 * 0.9 * h_height * length/max_len);
    ctx.lineTo(h_width +  velocity/max_velo * 0.25 * 1 * h_width, h_height - 0.5 * 0.9 * h_height * length/max_len);
    ctx.fillStyle = color;
    ctx.fill();
  }

  var drawSouth = function(ctx, h_width, h_height, length, max_len, velocity, max_velo, color){
    ctx.beginPath();
    ctx.moveTo(h_width,h_height);
    ctx.lineTo(h_width - velocity/max_velo * 0.25 * 1 * h_width, h_height + 0.5 * 0.9* h_height * length/max_len);
    ctx.lineTo(h_width - velocity/max_velo* 0.5 * 1 * h_width, h_height + 0.5 * 0.9  * h_height * length/max_len);
    ctx.lineTo(h_width, h_height + 1.0 * 0.9 *  h_height * length/max_len);
    ctx.lineTo(h_width +  velocity/max_velo * 0.5 * 1 * h_width, h_height + 0.5 * 0.9 * h_height * length/max_len);
    ctx.lineTo(h_width +  velocity/max_velo * 0.25 * 1 * h_width, h_height + 0.5 * 0.9 * h_height * length/max_len);
    ctx.fillStyle = color;
    ctx.fill();
  }
  
  var cnvs = document.getElementById(canvasID);
  var cumulative = new Stinuum.SpatialInfo();

  for (var index = 0 ; index < this.super.mfCollection.features.length ; index++){
    var mf = this.super.mfCollection.features[index];
    var cl = Stinuum.addDirectionInfo(cumulative, mf.feature.temporalGeometry);
    LOG(cl);
    if (cl != -1)
      this.super.mfCollection.setColor(mf.id, cl);
  }

  var total_life = 0;
  var total_length = 0;
  var total_velocity = 0;
  for (var WENS in cumulative){
    if (cumulative.hasOwnProperty(WENS)){
      total_life += cumulative[WENS].total_life;
      total_length += cumulative[WENS].total_length;
      total_velocity += cumulative[WENS].avg_velocity;
    }
  }

  if (cnvs.getContext){
    var h_width = cnvs.width / 2;
    var h_height = cnvs.height / 2;
    var ctx = cnvs.getContext('2d');

    var scale = 1 / (max_length/total_length) * 0.8;

    var length = [cumulative.west.total_length, cumulative.east.total_length, cumulative.north.total_length, cumulative.south.total_length];
    // north와 east는 반대
    // var length_for_drawing = [cumulative.west.total_length, -cumulative.east.total_length, cumulative.north.total_length, -cumulative.south.total_length];
    var life = [cumulative.west.total_life, cumulative.east.total_life, cumulative.north.total_life, cumulative.south.total_life];
    var velocity = [cumulative.west.avg_velocity, cumulative.east.avg_velocity, cumulative.north.avg_velocity, cumulative.south.avg_velocity];

    var max_life = Math.max.apply(null, life);
    var max_length = Math.max.apply(null, length);

    var color = ['rgb(255, 255, 0)','rgb(0, 255, 0)','Cyan','red'];

    for (var i = 0 ; i < life.length ; i++){
      for (var j = 0 ; j < 2 ; j += 0.1){
        ctx.beginPath();
        ctx.arc(h_width,h_height,h_width * life[i] / max_life, j * Math.PI,(j+0.05)*Math.PI);
        ctx.strokeStyle= color[i];
        ctx.stroke();
      }
    }

    drawWest(ctx, h_width, h_height, length[0], max_length, velocity[0], total_velocity, color[0]);
    drawEast(ctx, h_width, h_height, length[1], max_length, velocity[1], total_velocity, color[1]);
    drawNorth(ctx, h_width, h_height, length[2], max_length, velocity[2], total_velocity, color[2]);
    drawSouth(ctx, h_width, h_height, length[3], max_length, velocity[3], total_velocity, color[3]);

/*
    for (var i = 0 ; i < 2 ; i++){
      ctx.beginPath();
      ctx.moveTo(h_width,h_height);
      ctx.lineTo(h_width - length_for_drawing[i]/max_length * 0.375 * 0.9 * h_width, h_height - 0.25 * 1 * h_height * velocity[i]/total_velocity);
      ctx.lineTo(h_width - length_for_drawing[i]/max_length * 0.5 * 0.9 *  h_width, h_height - 0.5 * 1 * h_height * velocity[i]/total_velocity);
      ctx.lineTo(h_width - length_for_drawing[i]/max_length * 1.0 * 0.9 *  h_width, h_height);
      ctx.lineTo(h_width - length_for_drawing[i]/max_length * 0.5 * 0.9 *  h_width, h_height + 0.5 * 1 * h_height * velocity[i]/total_velocity);
      ctx.lineTo(h_width - length_for_drawing[i]/max_length * 0.375 * 0.9 *  h_width, h_height + 0.25 * 1 * h_height * velocity[i]/total_velocity);
      ctx.fillStyle= color[i];
      ctx.fill();
    }

    for (var i = 2 ; i < 4 ; i++){
      ctx.beginPath();
      ctx.moveTo(h_width,h_height);
      ctx.lineTo(h_width - velocity[i]/total_velocity * 0.25 * 1 * h_width, h_height - 0.375 * 0.9* h_height * length_for_drawing[i]/max_length);
      ctx.lineTo(h_width - velocity[i]/total_velocity* 0.5 * 1 * h_width, h_height - 0.5 * 0.9  * h_height * length_for_drawing[i]/max_length);
      ctx.lineTo(h_width, h_height - 1.0 * 0.9 *  h_height * length_for_drawing[i]/max_length);
      ctx.lineTo(h_width +  velocity[i]/total_velocity * 0.5 * 1 * h_width, h_height - 0.5 * 0.9 * h_height * length_for_drawing[i]/max_length);
      ctx.lineTo(h_width +  velocity[i]/total_velocity * 0.25 * 1 * h_width, h_height - 0.375 * 0.9 * h_height * length_for_drawing[i]/max_length);
      ctx.fillStyle = color[i];
      ctx.fill();
    }
*/
    return cumulative;

  }
  else{
    alert('canvas를 지원하지 않는 브라우저, not support canvas');
  }

}

Stinuum.DirectionRadar.drawBackRadar = function(radar_id) {
    var radar_canvas = document.getElementById(radar_id);

    if (radar_canvas.getContext) {
        var h_width = radar_canvas.width / 2;
        var h_height = radar_canvas.height / 2;
        var ctx = radar_canvas.getContext('2d');

        var color = 'rgb(0,255,0)';
        for (var id = 0; id < 2; id++) {
            for (var j = 0; j < 2; j += 0.05) {
                ctx.beginPath();
                ctx.arc(h_width, h_height, h_width * (id + 1) / 2, j * Math.PI, (j + 0.025) * Math.PI);
                ctx.strokeStyle = color;
                ctx.stroke();
            }
        }

    } else {
        alert('canvas를 지원하지 않는 브라우저');
    }
}



Stinuum.addDirectionInfo = function(cumulative, geometry){
  if (geometry.interpolations[0] == 'Discrete') return -1;
  var life = Stinuum.calculateLife(geometry) / (1000 * 60 * 60); // hours, ms * sec * min)
  var length = Stinuum.calculateLength(geometry) / 1000; // kilo-meter
  var velocity = Stinuum.calculateVelocity(geometry); // km/h;
  //LOG(life, length, velocity);

  var start_point = geometry.coordinates[0][0];
  var end_point = geometry.coordinates[geometry.coordinates.length-1][0];

  if (geometry.type != "MovingPoint" ){ // Polygon, LineString
    start_point = Stinuum.getCenter(start_point, geometry.type);
    end_point = Stinuum.getCenter(end_point, geometry.type);
  }

  var dist_x, dist_y;

  dist_x = end_point[0] - start_point[0];
  dist_y = end_point[1] - start_point[1];

  if (isNaN(life) || isNaN(length) || isNaN(dist_x) || isNaN(dist_y)){
    LOG(geometry);
    LOG(life, length, dist_x, dist_y);
    throw new Stinuum.Exception("Nan in Direction");
  }

  var r_color ;
  if (dist_x == 0){
    if (dist_y > 0){
      cumulative.north.total_life += life;
      cumulative.north.total_length += length;
      cumulative.north.velocity.push(velocity);
      cumulative.north.updateAvgVelocity();

      r_color = Cesium.Color.fromRandom({
        maximumRed : 0.2,
        minimumBlue : 0.7,
        minimumGreen : 0.6,
        alpha : 1.0
      });
    }
    else if (dist_y < 0){
      cumulative.south.total_life += life;
      cumulative.south.total_length += length;
      cumulative.south.velocity.push(velocity);
      cumulative.south.updateAvgVelocity();

      r_color = Cesium.Color.fromRandom({
        minimumRed : 0.7,
        maximumBlue : 0.2,
        maximumGreen : 0.2,
        alpha : 1.0
      });
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
        cumulative.east.velocity.push(velocity);
        cumulative.east.updateAvgVelocity();
        r_color = Cesium.Color.fromRandom({
          maximumRed : 0.2,
          maximumBlue : 0.2,
          minimumGreen : 0.7,
          alpha : 1.0
        });
      }
      else{
        cumulative.west.total_life += life;
        cumulative.west.total_length += length;
        cumulative.west.velocity.push(velocity);
        cumulative.west.updateAvgVelocity();
        r_color = Cesium.Color.fromRandom({
          minimumRed : 0.7,
          maximumBlue : 0.2,
          minimumGreen : 0.7,
          alpha : 1.0
        });
      }
    }
    else {
      if (dist_y >0){
        cumulative.north.total_life += life;
        cumulative.north.total_length += length;
        cumulative.north.velocity.push(velocity);
        cumulative.north.updateAvgVelocity();
        r_color = Cesium.Color.fromRandom({
          maximumRed : 0.2,
          minimumBlue : 0.7,
          minimumGreen : 0.6,
          alpha : 1.0
        });
      }
      else{
        cumulative.south.total_life += life;
        cumulative.south.total_length += length;
        cumulative.south.velocity.push(velocity);
        cumulative.south.updateAvgVelocity();
        r_color = Cesium.Color.fromRandom({
          minimumRed : 0.7,
          maximumBlue : 0.2,
          maximumGreen : 0.2,
          alpha : 1.0
        });
      }
    }
  }


  return r_color;
}

/**
metric : ms
*/
Stinuum.calculateLife = function(geometry){
  var last = new Date(geometry.datetimes[geometry.datetimes.length-1]).getTime();
  var start = new Date(geometry.datetimes[0]).getTime();
  if (isNaN(last) || isNaN(start)){
    LOG(geometry.datetimes[geometry.datetimes.length-1], new Date(geometry.datetimes[geometry.datetimes.length-1]));
    LOG("it sholud be ISO String, YYYY-MM-DDTHH:MM:SSZ");
    throw new Error("is NaN in", 'direction_radar', 230);
  }
  return last - start ;
};

/**
metric : meter
*/
Stinuum.calculateLength = function(geometry){
  var total = 0;
  for (var i = 0 ; i < geometry.coordinates.length - 1 ; i++){
    var point1;
    var point2;
    if (geometry.type == "MovingPoint"){
      point1 = geometry.coordinates[i];
      point2 = geometry.coordinates[i+1];
    }
    else{
      point1 = Stinuum.getCenter(geometry.coordinates[i][0], geometry.type);
      point2 = Stinuum.getCenter(geometry.coordinates[i+1][0], geometry.type);
    }
    total += Stinuum.calculateCarteDist(point1, point2);
  }

  return total;
};

Stinuum.calculateVelocity = function(geometry){
  var total = 0;
  for (var i = 0 ; i < geometry.coordinates.length - 1 ; i++){
    var point1;
    var point2;

    var date1 = geometry.datetimes[i];
    var date2 = geometry.datetimes[i+1];

    if (geometry.type == "MovingPoint"){
      point1 = geometry.coordinates[i];
      point2 = geometry.coordinates[i+1];
    }
    else{
      point1 = Stinuum.getCenter(geometry.coordinates[i][0], geometry.type);
      point2 = Stinuum.getCenter(geometry.coordinates[i+1][0], geometry.type);
    }
    total += (Stinuum.calculateCarteDist(point1, point2) / 1000) / ((new Date(date2).getTime() - new Date(date1).getTime()) / (1000 * 60 * 60) );
  }
  var avg = total / (geometry.coordinates.length - 1);
  return avg;
};


Stinuum.DirectionInfo.prototype.updateAvgVelocity = function(){
  this.avg_velocity = 0.0;
  var total = 0;
  for (var i = 0 ; i < this.velocity.length; i++){
    total += this.velocity[i];
  }
  this.avg_velocity = total / this.velocity.length;
}
