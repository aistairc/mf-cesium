DirectionRadar.prototype.remove = function(canvasID){
  var radar_canvas = document.getElementById(canvasID);
  radar_canvas.innerHTML = '';
  radar_canvas.getContext('2d').clearRect(0, 0, radar_canvas.width, radar_canvas.height);

  this.super.mfCollection.colorCollection = {};
}

DirectionRadar.prototype.show = function(canvasID){
  var radar_canvas = document.getElementById(canvasID);

  radar_canvas.innerHTML = '';
  radar_canvas.getContext('2d').clearRect(0, 0, radar_canvas.width, radar_canvas.height);

  var cumulative = new SpatialInfo();

  for (var index = 0 ; index < this.super.mfCollection.features.length ; index++){
    var mf = this.super.mfCollection.features[index];
    this.super.mfCollection.setColor(mf.id, Stinuum.addDirectionInfo(cumulative, mf.feature.temporalGeometry));
  }

  var total_life = cumulative.west.total_life + cumulative.east.total_life + cumulative.north.total_life + cumulative.south.total_life;
  var total_length = cumulative.west.total_length + cumulative.east.total_length + cumulative.north.total_length + cumulative.south.total_length;
  var cnvs = document.getElementById(canvasID);
  if (cnvs.getContext){
    var h_width = cnvs.width / 2;
    var h_height = cnvs.height / 2;
    var ctx = cnvs.getContext('2d');
    var max_life = Math.max.apply(null, [cumulative.west.total_life , cumulative.east.total_life , cumulative.north.total_life, cumulative.south.total_life]);

    var max_length = Math.max.apply(null, [cumulative.west.total_length , cumulative.east.total_length , cumulative.north.total_length, cumulative.south.total_length]);
    var scale = 1 / (max_length/total_length) * 0.8;


    var length = [cumulative.west.total_length, cumulative.east.total_length, cumulative.north.total_length, cumulative.south.total_length];
    var length2 = [cumulative.west.total_length,- cumulative.east.total_length, cumulative.north.total_length, -cumulative.south.total_length];
    var life = [cumulative.west.total_life, cumulative.east.total_life, cumulative.north.total_life, cumulative.south.total_life];
    var velocity = [];
    var total_velocity = 0.0;
    for (var i = 0 ; i < length.length ; i++){
      if (life[i] == 0){
        velocity[i] = 0;
        continue;
      }
      velocity[i] = length[i]/life[i];

      total_velocity += velocity[i];
    }

    var color = ['rgb(255, 255, 0)','rgb(0, 255, 0)','Cyan','red'];

    for (var i = 0 ; i < life.length ; i++){

      for (var j = 0 ; j < 2 ; j += 0.1){
        ctx.beginPath();
        ctx.arc(h_width,h_height,h_width * life[i] / max_life, j * Math.PI,(j+0.05)*Math.PI);
        ctx.strokeStyle= color[i];
        ctx.stroke();
      }
    }

    for (var i = 0 ; i < 2 ; i++){
      ctx.beginPath();
      ctx.moveTo(h_width,h_height);
      ctx.lineTo(h_width - length2[i]/max_length * 0.375 * 0.9 * h_width, h_height - 0.25 * 1 * h_height * velocity[i]/total_velocity);
      ctx.lineTo(h_width - length2[i]/max_length * 0.5 * 0.9 *  h_width, h_height - 0.5 * 1 * h_height * velocity[i]/total_velocity);
      ctx.lineTo(h_width - length2[i]/max_length * 1.0 * 0.9 *  h_width, h_height);
      ctx.lineTo(h_width - length2[i]/max_length * 0.5 * 0.9 *  h_width, h_height + 0.5 * 1 * h_height * velocity[i]/total_velocity);
      ctx.lineTo(h_width - length2[i]/max_length * 0.375 * 0.9 *  h_width, h_height + 0.25 * 1 * h_height * velocity[i]/total_velocity);
      ctx.fillStyle= color[i];
      ctx.fill();
    }

    for (var i = 2 ; i < 4 ; i++){
      ctx.beginPath();
      ctx.moveTo(h_width,h_height);
      ctx.lineTo(h_width - velocity[i]/total_velocity * 0.25 * 1 * h_width, h_height - 0.375 * 0.9* h_height * length2[i]/max_length);
      ctx.lineTo(h_width - velocity[i]/total_velocity* 0.5 * 1 * h_width, h_height - 0.5 * 0.9  * h_height * length2[i]/max_length);
      ctx.lineTo(h_width, h_height - 1.0 * 0.9 *  h_height * length2[i]/max_length);
      ctx.lineTo(h_width +  velocity[i]/total_velocity * 0.5 * 1 * h_width, h_height - 0.5 * 0.9 * h_height * length2[i]/max_length);
      ctx.lineTo(h_width +  velocity[i]/total_velocity * 0.25 * 1 * h_width, h_height - 0.375 * 0.9 * h_height * length2[i]/max_length);
      ctx.fillStyle = color[i];
      ctx.fill();
    }


  }
  else{
    alert('canvas를 지원하지 않는 브라우저');
  }
}

DirectionRadar.drawBackRadar = function(radar_id) {
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
  var life = Stinuum.calculateLife(geometry) / 1000000;
  var length = Stinuum.calculateLength(geometry);

  var start_point = geometry.coordinates[0][0];
  var end_point = geometry.coordinates[geometry.coordinates.length-1][0];

  if (geometry.type != "MovingPoint" ){ // Polygon, LineString
    start_point = Stinuum.getCenter(start_point, geometry.type);
    end_point = Stinuum.getCenter(end_point, geometry.type);
  }

  var dist_x, dist_y;

  dist_x = end_point[0] - start_point[0];
  dist_y = end_point[1] - start_point[1];

  var r_color ;
  if (dist_x == 0){
    if (dist_y > 0){
      cumulative.north.total_life += life;
      cumulative.north.total_length += length;
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

Stinuum.calculateLife = function(geometry){
  return - new Date(geometry.datetimes[0]).getTime() + new Date(geometry.datetimes[geometry.datetimes.length-1]).getTime();
};

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
    //total += Stinuum.calculateDist(point1, point2);
    total += Stinuum.calculateCarteDist(point1, point2);

  }

  return total;
};
