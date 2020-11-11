var LOG = console.log;
var ERR = Stinuum.Exception;
var debug_mode = true;
var debug_var = undefined;

function Stinuum(viewer) {
    this.cesiumViewer = viewer;
    this.mode = 'STATICMAP'; //'STATICMAP' : 2d, 'SPACETIME' : perspective view, and 'ANIMATEDMAP' : 3d globe
    this.maxHeight = 30000000;
    this.s_query_on = false;

    this.geometryViewer = new Stinuum.GeometryViewer(this);
    this.mfCollection = new Stinuum.MFCollection(this);
    this.directionRadar = new Stinuum.DirectionRadar(this);
    this.temporalMap = new Stinuum.TemporalMap(this);
    this.propertyGraph = new Stinuum.PropertyGraph(this);
    this.queryProcessor = new Stinuum.QueryProcessor(this);
    this.imageMarking = new Stinuum.Imagemarking(this);
}

Stinuum.Exception = function (message, data) {
    this.name = "StinuumException";
    this.message = message;
    this.data = data;
}

Stinuum.Exception.prototype.toString = function () {
    if (!debug_mode || this.data == undefined)
        return this.name + ' : "' + this.message + '"';
    else {
        return [this.name + ' : "' + this.message + '"', this.data];
    }
}

Stinuum.MFPair = function (id, feature) {
    this.id = id;
    this.feature = feature;
}



Stinuum.QueryProcessor = function (stinuum) {
    this.super = stinuum;
    this.result_pairs = [];
}

Stinuum.MFCollection = function (stinuum) {
    this.super = stinuum;
    this.features = [];
    this.wholeFeatures = [];
    this.colorCollection = {};
    this.min_max = {};
    this.whole_min_max = {};
}


Stinuum.PathDrawing = function (g_viewer) {
    this.g_viewer = g_viewer;
    this.supersuper = g_viewer.super;
}

Stinuum.MovementDrawing = function (g_viewer) {
    this.g_viewer = g_viewer;
    this.supersuper = g_viewer.super;
}

Stinuum.GeometryViewer = function (stinuum) {
    this.super = stinuum;
    this.primitives = {};
    this.drawing = new Stinuum.PathDrawing(this);
    this.moving = new Stinuum.MovementDrawing(this);
    this.projection = null;
    this.time_label = [];
    this.label_timeout = undefined;
}

Stinuum.TemporalMap = function (stinuum) {
    this.super = stinuum;
    this.temp_primitive = {};
}


Stinuum.DirectionRadar = function (stinuum) {
    this.super = stinuum;
}

Stinuum.Imagemarking = function (stinuum) {
    this.super = stinuum;
}


Stinuum.PropertyGraph = function (stinuum) {
    this.super = stinuum;
    this.graph_id;
}



Stinuum.BoxCoord = function () {
    this.minimum = {};
    this.maximum = {};
};

Stinuum.SpatialInfo = function () {
    this.west = new Stinuum.DirectionInfo();
    this.east = new Stinuum.DirectionInfo();
    this.north = new Stinuum.DirectionInfo();
    this.south = new Stinuum.DirectionInfo();
}

Stinuum.DirectionInfo = function (life = 0, leng = 0) {
    this.total_life = life;
    this.total_length = leng;
    this.velocity = [];
    this.avg_velocity = 0;
}

Stinuum.DirectionRadar.prototype.remove = function (canvasID) {
    var radar_canvas = document.getElementById(canvasID);
    radar_canvas.innerHTML = '';
    radar_canvas.getContext('2d').clearRect(0, 0, radar_canvas.width, radar_canvas.height);

    this.super.mfCollection.colorCollection = {};
}

/**
@color : [west : yellow, east : green, north : cyan, south : red]
*/
Stinuum.DirectionRadar.prototype.show = function (canvasID) {
 
    var drawWest = function (ctx, h_width, h_height, length, max_len, velocity, max_velo, color) {
        ctx.beginPath();
        ctx.moveTo(h_width, h_height);
        ctx.lineTo(h_width - length / max_len * 0.5 * 0.9 * h_width, h_height - 0.25 * 1 * h_height * velocity / max_velo);
        ctx.lineTo(h_width - length / max_len * 0.5 * 0.9 * h_width, h_height - 0.5 * 1 * h_height * velocity / max_velo);
        ctx.lineTo(h_width - length / max_len * 1.0 * 0.9 * h_width, h_height);
        ctx.lineTo(h_width - length / max_len * 0.5 * 0.9 * h_width, h_height + 0.5 * 1 * h_height * velocity / max_velo);
        ctx.lineTo(h_width - length / max_len * 0.5 * 0.9 * h_width, h_height + 0.25 * 1 * h_height * velocity / max_velo);
        ctx.fillStyle = color;
        ctx.fill();
    }

    var drawEast = function (ctx, h_width, h_height, length, max_len, velocity, max_velo, color) {
        ctx.beginPath();
        ctx.moveTo(h_width, h_height);
        ctx.lineTo(h_width + length / max_len * 0.5 * 0.9 * h_width, h_height - 0.25 * 1 * h_height * velocity / max_velo);
        ctx.lineTo(h_width + length / max_len * 0.5 * 0.9 * h_width, h_height - 0.5 * 1 * h_height * velocity / max_velo);
        ctx.lineTo(h_width + length / max_len * 1.0 * 0.9 * h_width, h_height);
        ctx.lineTo(h_width + length / max_len * 0.5 * 0.9 * h_width, h_height + 0.5 * 1 * h_height * velocity / max_velo);
        ctx.lineTo(h_width + length / max_len * 0.5 * 0.9 * h_width, h_height + 0.25 * 1 * h_height * velocity / max_velo);
        ctx.fillStyle = color;
        ctx.fill();
    }

    var drawNorth = function (ctx, h_width, h_height, length, max_len, velocity, max_velo, color) {
        ctx.beginPath();
        ctx.moveTo(h_width, h_height);
        ctx.lineTo(h_width - velocity / max_velo * 0.25 * 1 * h_width, h_height - 0.5 * 0.9 * h_height * length / max_len);
        ctx.lineTo(h_width - velocity / max_velo * 0.5 * 1 * h_width, h_height - 0.5 * 0.9 * h_height * length / max_len);
        ctx.lineTo(h_width, h_height - 1.0 * 0.9 * h_height * length / max_len);
        ctx.lineTo(h_width + velocity / max_velo * 0.5 * 1 * h_width, h_height - 0.5 * 0.9 * h_height * length / max_len);
        ctx.lineTo(h_width + velocity / max_velo * 0.25 * 1 * h_width, h_height - 0.5 * 0.9 * h_height * length / max_len);
        ctx.fillStyle = color;
        ctx.fill();
    }

    var drawSouth = function (ctx, h_width, h_height, length, max_len, velocity, max_velo, color) {
        ctx.beginPath();
        ctx.moveTo(h_width, h_height);
        ctx.lineTo(h_width - velocity / max_velo * 0.25 * 1 * h_width, h_height + 0.5 * 0.9 * h_height * length / max_len);
        ctx.lineTo(h_width - velocity / max_velo * 0.5 * 1 * h_width, h_height + 0.5 * 0.9 * h_height * length / max_len);
        ctx.lineTo(h_width, h_height + 1.0 * 0.9 * h_height * length / max_len);
        ctx.lineTo(h_width + velocity / max_velo * 0.5 * 1 * h_width, h_height + 0.5 * 0.9 * h_height * length / max_len);
        ctx.lineTo(h_width + velocity / max_velo * 0.25 * 1 * h_width, h_height + 0.5 * 0.9 * h_height * length / max_len);
        ctx.fillStyle = color;
        ctx.fill();
    }

    var cnvs = document.getElementById(canvasID);
    var cumulativeList = new Array()
    var cumulative = new Stinuum.SpatialInfo();  
    for (var index = 0; index < this.super.mfCollection.features.length; index++) {
        // var cumulative = new Stinuum.SpatialInfo();  
        var mf = this.super.mfCollection.features[index];
        LOG("here", mf)
        if(mf.feature.temporalGeometry.type == "MovingGeometryCollection"){
            for(var prism_i = 0; prism_i < mf.feature.temporalGeometry.prisms.length; prism_i++){
                var cl = Stinuum.addDirectionInfo(cumulative, mf.feature.temporalGeometry.prisms[prism_i]);
                if (cl != -1){

                    this.super.mfCollection.setColor(mf.id, cl);
                    cumulativeList.push(cumulative)
                }
            }

        }
        else{
            var cl = Stinuum.addDirectionInfo(cumulative, mf.feature.temporalGeometry);
        }
        if (cl != -1){

            this.super.mfCollection.setColor(mf.id, cl);
            cumulativeList.push(cumulative)
        }
            
    }
    LOG(cumulativeList.length)
    LOG(cumulative)
    var total_life = 0;
    var total_length = 0;
    var total_velocity = 0;
    for (var WENS in cumulative) {
        if (cumulative.hasOwnProperty(WENS)) {
            total_life += cumulative[WENS].total_life;
            total_length += cumulative[WENS].total_length;
            total_velocity += cumulative[WENS].avg_velocity;
        }
    }
    
    if (cnvs.getContext) {
        var h_width = cnvs.width / 2;
        var h_height = cnvs.height / 2;
        var ctx = cnvs.getContext('2d');

        var scale = 1 / (max_length / total_length) * 0.8;

        var length = [cumulative.west.total_length, cumulative.east.total_length, cumulative.north.total_length, cumulative.south.total_length];
        // north와 east는 반대
        // var length_for_drawing = [cumulative.west.total_length, -cumulative.east.total_length, cumulative.north.total_length, -cumulative.south.total_length];
        var life = [cumulative.west.total_life, cumulative.east.total_life, cumulative.north.total_life, cumulative.south.total_life];
        var velocity = [cumulative.west.avg_velocity, cumulative.east.avg_velocity, cumulative.north.avg_velocity, cumulative.south.avg_velocity];

        var max_life = Math.max.apply(null, life);
        var max_length = Math.max.apply(null, length);

        var color = ['rgb(255, 255, 0)', 'rgb(0, 255, 0)', 'Cyan', 'red'];

        for (var i = 0; i < life.length; i++) {
            for (var j = 0; j < 2; j += 0.1) {
                ctx.beginPath();
                ctx.arc(h_width, h_height, h_width * life[i] / max_life, j * Math.PI, (j + 0.05) * Math.PI);
                ctx.strokeStyle = color[i];
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

    } else {
        alert('Not support canvas');
    }

}

Stinuum.DirectionRadar.drawBackRadar = function (radar_id) {
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
        alert('Not support canvas');
    }
}

Stinuum.addDirectionInfo = function (cumulative, geometry) {


    LOG(geometry)
    if (geometry.interpolation == 'Discrete') return -1;
    var life = Stinuum.calculateLife(geometry) / (1000 * 60 * 60); // hours, ms * sec * min)
    var length = Stinuum.calculateLength(geometry) / 1000; // kilo-meter
    var velocity = Stinuum.calculateVelocity(geometry); // km/h;
    //LOG(life, length, velocity);

    var start_point = geometry.coordinates[0][0];
    var end_point = geometry.coordinates[geometry.coordinates.length - 1][0];

    if (geometry.type != "MovingPoint") { // Polygon, LineString
        start_point = Stinuum.getCenter(start_point, geometry.type);
        end_point = Stinuum.getCenter(end_point, geometry.type);
    }

    var dist_x, dist_y;

    dist_x = end_point[0] - start_point[0];
    dist_y = end_point[1] - start_point[1];

    if (isNaN(life) || isNaN(length) || isNaN(dist_x) || isNaN(dist_y)) {
        LOG(geometry);
        LOG(life, length, dist_x, dist_y);
        throw new Stinuum.Exception("Nan in Direction");
    }
    var r_color;
    if (dist_x == 0) {
        if (dist_y > 0) {
            cumulative.north.total_life += life;
            cumulative.north.total_length += length;
            cumulative.north.velocity.push(velocity);
            cumulative.north.updateAvgVelocity();

            r_color = Cesium.Color.fromRandom({
                maximumRed: 0.2,
                minimumBlue: 0.7,
                minimumGreen: 0.6,
                alpha: 1.0
            });
        } else if (dist_y < 0) {
            cumulative.south.total_life += life;
            cumulative.south.total_length += length;
            cumulative.south.velocity.push(velocity);
            cumulative.south.updateAvgVelocity();

            r_color = Cesium.Color.fromRandom({
                minimumRed: 0.7,
                maximumBlue: 0.2,
                maximumGreen: 0.2,
                alpha: 1.0
            });
        } else {

        }
    } else {
        var slope = dist_y / dist_x;
        if (slope < 1 && slope > -1) {
            if (dist_x > 0) {
                cumulative.east.total_life += life;
                cumulative.east.total_length += length;
                cumulative.east.velocity.push(velocity);
                cumulative.east.updateAvgVelocity();
                r_color = Cesium.Color.fromRandom({
                    maximumRed: 0.2,
                    maximumBlue: 0.2,
                    minimumGreen: 0.7,
                    alpha: 1.0
                });
            } else {
                cumulative.west.total_life += life;
                cumulative.west.total_length += length;
                cumulative.west.velocity.push(velocity);
                cumulative.west.updateAvgVelocity();
                r_color = Cesium.Color.fromRandom({
                    minimumRed: 0.7,
                    maximumBlue: 0.2,
                    minimumGreen: 0.7,
                    alpha: 1.0
                });
            }
        } else {
            if (dist_y > 0) {
                cumulative.north.total_life += life;
                cumulative.north.total_length += length;
                cumulative.north.velocity.push(velocity);
                cumulative.north.updateAvgVelocity();
                r_color = Cesium.Color.fromRandom({
                    maximumRed: 0.2,
                    minimumBlue: 0.7,
                    minimumGreen: 0.6,
                    alpha: 1.0
                });
            } else {
                cumulative.south.total_life += life;
                cumulative.south.total_length += length;
                cumulative.south.velocity.push(velocity);
                cumulative.south.updateAvgVelocity();
                r_color = Cesium.Color.fromRandom({
                    minimumRed: 0.7,
                    maximumBlue: 0.2,
                    maximumGreen: 0.2,
                    alpha: 1.0
                });
            }
        }
    }


    return r_color;

}

/**
metric : ms
*/
Stinuum.calculateLife = function (geometry) {
    
    
    var last = new Date(geometry.datetimes[geometry.datetimes.length - 1]).getTime();
    var start = new Date(geometry.datetimes[0]).getTime();
    if (isNaN(last) || isNaN(start)) {
        LOG(geometry.datetimes[geometry.datetimes.length - 1], new Date(geometry.datetimes[geometry.datetimes.length - 1]));
        LOG("it sholud be ISO String, YYYY-MM-DDTHH:MM:SSZ");
        throw new Error("is NaN in", 'direction_radar', 230);
    }
    return last - start;

};

/**
metric : meter
*/
Stinuum.calculateLength = function (geometry) {
    var total = 0;

   
    for (var i = 0; i < geometry.coordinates.length - 1; i++) {
        var point1;
        var point2;
        if (geometry.type == "MovingPoint") {
            point1 = geometry.coordinates[i];
            point2 = geometry.coordinates[i + 1];
        } else {
            point1 = Stinuum.getCenter(geometry.coordinates[i][0], geometry.type);
            point2 = Stinuum.getCenter(geometry.coordinates[i + 1][0], geometry.type);
        }
        total += Stinuum.calculateCarteDist(point1, point2);
    }

   
    return total;
};

Stinuum.calculateVelocity = function (geometry) {
    var total = 0;

    for (var i = 0; i < geometry.coordinates.length - 1; i++) {
        var point1;
        var point2;

        var date1 = geometry.datetimes[i];
        var date2 = geometry.datetimes[i + 1];

        if (geometry.type == "MovingPoint") {
            point1 = geometry.coordinates[i];
            point2 = geometry.coordinates[i + 1];
        } else {
            point1 = Stinuum.getCenter(geometry.coordinates[i][0], geometry.type);
            point2 = Stinuum.getCenter(geometry.coordinates[i + 1][0], geometry.type);
        }
        total += (Stinuum.calculateCarteDist(point1, point2) / 1000) / ((new Date(date2).getTime() - new Date(date1).getTime()) / (1000 * 60 * 60));
    }
    var avg = total / (geometry.coordinates.length - 1);
    return avg;

};


Stinuum.DirectionInfo.prototype.updateAvgVelocity = function () {
    this.avg_velocity = 0.0;
    var total = 0;
    for (var i = 0; i < this.velocity.length; i++) {
        total += this.velocity[i];
    }
    this.avg_velocity = total / this.velocity.length;
}

Stinuum.GeometryViewer.prototype.update = function (options) {
    this.clear();
    this.super.mfCollection.findMinMaxGeometry();
    this.draw();
    this.animate(options);
}

Stinuum.GeometryViewer.prototype.clear = function () {
    this.super.cesiumViewer.clock.multiplier = 10;
    this.super.cesiumViewer.dataSources.removeAll();
    var temp = this.super.cesiumViewer.scene.primitives.get(0);
    this.super.cesiumViewer.entities.removeAll();
    this.super.cesiumViewer.scene.primitives.removeAll();
    this.super.cesiumViewer.scene.primitives.add(temp);

    this.primitives = {};
}

Stinuum.GeometryViewer.prototype.draw = function () {
    
    var mf_arr = this.super.mfCollection.features;

    if (mf_arr.length == 0) {
        //console.log("mf_arr is 0. something wrong");
        return -1;
    }

    var minmax = this.super.mfCollection.min_max;

    if (this.super.mode == 'SPACETIME') {
        this.bounding_sphere = Stinuum.getBoundingSphere(minmax, [0, this.super.maxHeight]);
        this.super.cesiumViewer.scene.primitives.add(this.drawZaxis());
        var entities = this.drawZaxisLabel();
        // this.super.cesiumViewer.entities.add(entities.values[0]);
        for(var i in entities.values){
            this.super.cesiumViewer.entities.add(entities.values[i])
        }
    } 
    // else if (this.super.mode == 'ANIMATEDMAP') {
    //     // add to path 3d map
    //     this.bounding_sphere = Stinuum.getBoundingSphere(minmax, [0, 0]);
    //     // return -1;
    // } 
    else {
        this.bounding_sphere = Stinuum.getBoundingSphere(minmax, [0, 0]);

    }
    for (var index = 0; index < mf_arr.length; index++) {
        var mf = mf_arr[index];
        var path_prim, primitive;
        if (mf.feature.temporalGeometry.type == "MovingGeometryCollection"){
          
            for (var prism_i = 0; prism_i < mf.feature.temporalGeometry.prisms.length; prism_i++){
                var eachFeature = mf.feature.temporalGeometry.prisms[prism_i];
                if (eachFeature.type == "MovingPoint") {
                    if (this.super.mode != 'SPACETIME' && this.super.s_query_on) continue;
                    primitive = this.drawing.drawPathMovingPoint({
                        temporalGeometry: eachFeature,
                        id: mf.id,
                        prism_i: prism_i
                    });
                }else if (eachFeature.type == "MovingPointCloud") {
                   
                        primitive = this.drawing.drawPathMovingPointCloud({
                        temporalGeometry: eachFeature,
                        id: mf.id,
                        prism_i: prism_i
                    });
                } else if (eachFeature.type == "MovingPolygon") {
                    primitive = this.drawing.drawPathMovingPolygon({
                        temporalGeometry: eachFeature,
                        id: mf.id,
                        prism_i: prism_i
                    });
                } else if (eachFeature.type == "MovingLineString") {
                    primitive = this.drawing.drawPathMovingLineString({
                        temporalGeometry: eachFeature,
                        id: mf.id,
                        prism_i: prism_i
                    });
                } else {
                    //console.log("this type cannot be drawn", eachFeature);
                }
                if (primitive != -1) {
                   
                    path_prim = this.super.cesiumViewer.scene.primitives.add(primitive);
                    
                    LOG(typeof(path_prim), path_prim)
                    this.primitives[mf.id] = path_prim;
                    // LOG(this.primitives)
                }
            }

        }else{
            LOG("id: ", mf.id)
            if (mf.feature.temporalGeometry.type == "MovingPoint") {
                if (this.super.mode != 'SPACETIME' && this.super.s_query_on) continue;
                primitive = this.drawing.drawPathMovingPoint({
                    temporalGeometry: mf.feature.temporalGeometry,
                    id: mf.id
                });
            }else if (mf.feature.temporalGeometry.type == "MovingPointCloud") {
                
                primitive = this.drawing.drawPathMovingPointCloud({
                    temporalGeometry: mf.feature.temporalGeometry,
                    id: mf.id
                });
            } else if (mf.feature.temporalGeometry.type == "MovingPolygon") {
                primitive = this.drawing.drawPathMovingPolygon({
                    temporalGeometry: mf.feature.temporalGeometry,
                    id: mf.id
                });
            } else if (mf.feature.temporalGeometry.type == "MovingLineString") {
                primitive = this.drawing.drawPathMovingLineString({
                    temporalGeometry: mf.feature.temporalGeometry,
                    id: mf.id
                });
            } else {
                //console.log("this type cannot be drawn", feature);
            }
            if (primitive != -1) {
                path_prim = this.super.cesiumViewer.scene.primitives.add(primitive);
                this.primitives[mf.id] = path_prim;
            }
        }

    }

}

Stinuum.GeometryViewer.prototype.animate = function (options) {
    var mf_arr;
    var current_time;
    LOG(options)
    var min_max = this.super.mfCollection.min_max;
    if (options != undefined) {
        if (options.id == undefined) {
            mf_arr = this.super.mfCollection.features;
        } else {
            mf_arr = [];
            var id_arr = [];
            if (!Array.isArray(options.id)) {
                id_arr.push(options.id);
            } else {
                id_arr = options.id;
            }

            for (var i = 0; i < id_arr.length; i++) {
                mf_arr.push(this.super.mfCollection.getMFPairById(id_arr[i]));
            }
            min_max = this.super.mfCollection.findMinMaxGeometry(mf_arr);
        }
    } else {
    
        mf_arr = this.super.mfCollection.features;
    }


    if (mf_arr.length == 0) {
        return -1;
    }


    if (options != undefined) {
        if (options.change != undefined && options.change) { //dont change current animation time.
            
            current_time = Cesium.JulianDate.toIso8601(this.super.cesiumViewer.clock.currentTime);
        } else {
            current_time = min_max.date[0].toISOString();
        }
    } else {
        current_time = min_max.date[0].toISOString();
    }

    if (min_max.date[0].getTime() == min_max.date[1].getTime()){
        var multiplier = 0;
        var range = "CLAMPED"
    }else{
        var multiplier = 10;
        var range = "LOOP_STOP"
    }
    
    var czml = [{
        "id": "document",
        "name": "animationOfMovingFeature",
        "version": "1.0"
    }];
   
    czml[0].clock = {
        "interval": min_max.date[0].toISOString() + "/" + min_max.date[1].toISOString(),
        "currentTime": current_time,
        "multiplier": multiplier,
        "range": range
  
    }
    var countNumber = 0;
    for (var index = 0; index < mf_arr.length; index++) {
        LOG("Check")
        LOG(index)
        var feature = mf_arr[index].feature;
        if (feature.temporalGeometry.type == "MovingGeometryCollection"){
            for (var prism_i = 0; prism_i < feature.temporalGeometry.prisms.length; prism_i++){
                var eachFeatures = feature.temporalGeometry.prisms[prism_i];
                if (eachFeatures.type == "MovingPoint") {
                    countNumber+=1
                    czml = czml.concat(this.moving.moveMovingPoint({
                        temporalGeometry: eachFeatures,
                        number: countNumber,
                        id: index
                    }));
                } else if (eachFeatures.type == "MovingPolygon") {
                    countNumber+=1
                    czml = czml.concat(this.moving.moveMovingPolygon({
                        temporalGeometry: eachFeatures,
                        number: countNumber,
                        id: index
                    }));
                } else if (eachFeatures.type == "MovingLineString") {
                    countNumber+=1
                    czml = czml.concat(this.moving.moveMovingLineString({
                        temporalGeometry: eachFeatures,
                        number: countNumber,
                        id: index
                    }));
                }  else if (eachFeatures.type == "MovingPointCloud") {
                    countNumber+=1
                    czml = czml.concat(this.moving.moveMovingPointCloud({
                        temporalGeometry: eachFeatures,
                        number: countNumber,
                        id: index
                    }));
                }else {
                    //console.log("this type cannot be animated", feature);
                }
               
            }
        }else{

            if (feature.temporalGeometry.type == "MovingPoint") {
                countNumber+=1
                czml = czml.concat(this.moving.moveMovingPoint({
                    temporalGeometry: feature.temporalGeometry,
                    number: countNumber,
                    id: index
                }));
            } else if (feature.temporalGeometry.type == "MovingPolygon") {
                countNumber+=1
                czml = czml.concat(this.moving.moveMovingPolygon({
                    temporalGeometry: feature.temporalGeometry,
                    number: countNumber,
                    id: index
                }));
            } else if (feature.temporalGeometry.type == "MovingLineString") {
                countNumber+=1
                czml = czml.concat(this.moving.moveMovingLineString({
                    temporalGeometry: feature.temporalGeometry,
                    number: countNumber,
                    id: index
                }));
            }  else if (feature.temporalGeometry.type == "MovingPointCloud") {
                countNumber+=1
                czml = czml.concat(this.moving.moveMovingPointCloud({
                    temporalGeometry: feature.temporalGeometry,
                    number: countNumber,
                    id: index
                }));
            }else {
                //console.log("this type cannot be animated", feature);
            }
        
        }
    }

    obj = JSON.stringify(czml)

    LOG(obj)
    // // LOG(czml)
   
    var load_czml = Cesium.CzmlDataSource.load(czml);
    var promise = this.super.cesiumViewer.dataSources.add(load_czml);
    
    return min_max;
}

Stinuum.GeometryViewer.prototype.drawZaxis = function () {
    var polylineCollection = new Cesium.PolylineCollection();
    var maxHeight = this.super.maxHeight
    if ( maxHeight < 5000000){
        maxHeight = 5000000
    }
    
    var positions = [179, 89, 0, 179, 89, maxHeight];
    polylineCollection.add(Stinuum.drawOneLine(positions, Cesium.Color.WHITE, 5));
    polylineCollection.add(Stinuum.drawOneLine([178, 88, maxHeight * 0.95, 179, 89, maxHeight , 179.9, 89, maxHeight * 0.95], Cesium.Color.WHITE, 5));

    for (var height = 10; height < 100; height += 20) {
        for (var long = -179; long < 179; long += 10) {
            polylineCollection.add(Stinuum.drawOneLine([long, 89, maxHeight * height / 100, long + 5, 89, maxHeight / 100 * height], Cesium.Color.WHITE, 2));
        }
        for (var lat = -89; lat < 89; lat += 10) {
            polylineCollection.add(Stinuum.drawOneLine([179, lat, maxHeight * height / 100, 179, lat + 5, maxHeight / 100 * height], Cesium.Color.WHITE, 2));
        }
    }


    return polylineCollection;
}

Stinuum.GeometryViewer.prototype.drawZaxisLabel = function () {
    
    
    var min_max = this.super.mfCollection.min_max; 
    var entities = new Cesium.EntityCollection();
    var maxHeight = this.super.maxHeight
    if ( maxHeight < 5000000){
        maxHeight = 5000000
    }
    
    var label = {
        position: Cesium.Cartesian3.fromDegrees(180, 90, maxHeight + 50000),
        label: {
            text: 'TIME',
            font: '18pt sans-serif',
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e7, 0.1)
        }
    };
    entities.add(label);
    console.log(min_max.date[1].getTime() - min_max.date[0].getTime())
    var min_max_value = min_max.date[1].getTime() - min_max.date[0].getTime()
    if (min_max_value == 0){
        min_max_value = 5000000
    }
    for (var height = 10; height < 100; height += 20) {
       
        console.log(new Date(min_max.date[0].getTime() + min_max_value * height / 100).toISOString())
        var time_label = new Date(min_max.date[0].getTime() + min_max_value * height / 100).toISOString();
        // if (min_max.date[1].getTime() - min_max.date[0].getTime() <= 50000){
        //     console.log("<= 50000")
        //     time_label = new Date(min_max.date[0].getTime() + (min_max.date[1].getTime() - min_max.date[0].getTime()) * height / 100).toISOString();
        // }else{
        //     console.log("> 50000")
        //     time_label = new Date(min_max.date[0].getTime() + (min_max.date[1].getTime() - min_max.date[0].getTime()) * height / 100).toISOString();
        //     // time_label = new Date(min_max.date[0].getTime() + (min_max.date[1].getTime() - min_max.date[0].getTime()) * height / heightRate).toISOString().split('T')[0];
        // }
        
        var label = {
            position: Cesium.Cartesian3.fromDegrees(180, 88, maxHeight * height / 100),
            label: {
                text: time_label,
                font: '18pt sans-serif',
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e7, 0.1)
            }
        };
        entities.add(label);
    }

    return entities;

}

// Stinuum.GeometryViewer.prototype.showProjection = function (id) {
//     LOG("__showProjection")
//     var mf = this.super.mfCollection.getMFPairById(id).feature;
//     var color = this.super.mfCollection.getColor(id);

//     var geometry = mf.temporalGeometry;
//     var instances = [];
//     var time_label = [];
//     //upper
//     var upper_pos = [];
//     var right_pos = [];

//     var heights = this.super.getListOfHeight(geometry.datetimes);

//     for (var index = 0; index < geometry.coordinates.length; index++) {
//         var xy;
//         if (geometry.type != 'MovingPoint') {
//             xy = Stinuum.getCenter(geometry.coordinates[index], geometry.type);
//         } else {
//             xy = geometry.coordinates[index];
//         }
//         upper_pos = upper_pos.concat([xy[0], 89, heights[index]]);
//         right_pos = right_pos.concat([179, xy[1], heights[index]]);
//     }

//     instances.push(Stinuum.drawInstanceOneLine(upper_pos, color.withAlpha(1.0)));
//     instances.push(Stinuum.drawInstanceOneLine(right_pos, color.withAlpha(1.0)));

//     for (var index = 0; index < 2; index++) {
//         var i = index * (geometry.coordinates.length - 1);
//         var xy;
//         if (geometry.type != 'MovingPoint') {
//             xy = Stinuum.getCenter(geometry.coordinates[i], geometry.type);
//         } else {
//             xy = geometry.coordinates[i];
//         }
//         var h = heights[i];
//         for (var j = xy[1]; j < 87.4; j += 2.5) {
//             instances.push(Stinuum.drawInstanceOneLine([xy[0], j, h, xy[0], j + 1.25, h], Cesium.Color.WHITE.withAlpha(0.5)));
//         }
//         for (var j = xy[0]; j < 177.4; j += 2.5) {
//             instances.push(Stinuum.drawInstanceOneLine([j, xy[1], h, j + 1.25, xy[1], h], Cesium.Color.WHITE.withAlpha(0.5)));
//         }

//     }
//     //right

//     var prim = new Cesium.Primitive({
//         geometryInstances: instances,
//         appearance: new Cesium.PolylineColorAppearance(),
//         allowPicking: false
//     });
//     return prim;
// }

// Stinuum.GeometryViewer.prototype.showHeightBar = function (id) {
//     var mf = this.super.mfCollection.getMFPairById(id).feature;
//     var color = this.super.mfCollection.getColor(id);

//     var geometry = mf.temporalGeometry;
//     var instances = [];
//     var time_label = [];
//     //upper
//     var pole = [];
//     var upper_pos = [];
//     var right_pos = [];

//     var heights = this.super.getListOfHeight(geometry.datetimes);
//     pole = [179, 89, heights[0], 179, 89, heights[geometry.datetimes.length - 1]];
//     instances.push(Stinuum.drawInstanceOneLine(pole, Cesium.Color.RED.withAlpha(1.0), 10));

//     time_label.push({
//         position: Cesium.Cartesian3.fromDegrees(160, 78, heights[0]),
//         label: {
//             text: geometry.datetimes[0],
//             font: '12pt sans-serif',
//             verticalOrigin: Cesium.VerticalOrigin.TOP
//         }
//     });
//     time_label.push({
//         position: Cesium.Cartesian3.fromDegrees(178, 60, heights[geometry.datetimes.length - 1]),
//         label: {
//             text: geometry.datetimes[geometry.datetimes.length - 1],
//             font: '12pt sans-serif',
//             verticalOrigin: Cesium.VerticalOrigin.TOP
//         }
//     });


//     var prim = new Cesium.Primitive({
//         geometryInstances: instances,
//         appearance: new Cesium.PolylineColorAppearance(),
//         allowPicking: false
//     });

//     return [prim, time_label];
// }

Stinuum.GeometryViewer.prototype.adjustCameraView = function () {
    //TODO
    LOG("adjustCameraView");
    console.log(this)
    var bounding = this.bounding_sphere;
    var viewer = this.viewer;
    var geomview = this;
    console.log(bounding)
    console.log(viewer)
    console.log(geomview.super.mode)
    
    if (bounding == undefined || bounding == -1) {
        return;
    }
    if (geomview.super.mode == "SPACETIME" ) {
        geomview.super.cesiumViewer.camera.flyTo({
            duration: 0.5,
            destination: Cesium.Cartesian3.fromDegrees(-50, -89, 28000000),
            orientation: {
                direction: new Cesium.Cartesian3(0.6886542487458516, 0.6475816335752261, -0.32617994043216153),
                up: new Cesium.Cartesian3(0.23760297490246338, 0.22346852237869355, 0.9453076990183581)
            }
        });
    } else {
        geomview.super.cesiumViewer.camera.flyToBoundingSphere(bounding, {
            duration: 0.5
        });
    }

    // setTimeout(function(){
    //   if (geomview.super.mode == "SPACETIME"){
    //   geomview.super.cesiumViewer.camera.flyTo({
    //     duration : 0.5,
    //     destination : Cesium.Cartesian3.fromDegrees(-50,-89,28000000),
    //     orientation : {
    //       direction : new Cesium.Cartesian3( 0.6886542487458516, 0.6475816335752261, -0.32617994043216153),
    //       up : new Cesium.Cartesian3(0.23760297490246338, 0.22346852237869355, 0.9453076990183581)
    //     }});
    //   }
    //   else{
    //     geomview.super.cesiumViewer.camera.flyToBoundingSphere(bounding, {
    //       duration : 0.5
    //     });
    //   }
    // }, 300);

}

Stinuum.GeometryViewer.prototype.clickMovingFeature = function (id) {
    
    var geo_viewer = this;

    if (id == undefined) {
        return;
    }

    if (geo_viewer.projection != null) {
        if (!geo_viewer.projection.isDestroyed()) {
            geo_viewer.super.cesiumViewer.scene.primitives.remove(this.projection);
        }
        geo_viewer.projection = null;
    }
    if (geo_viewer.time_label.length != 0) {
        for (var i = 0; i < geo_viewer.time_label.length; i++) {
            if (geo_viewer.time_label[i] != null && geo_viewer.time_label[i] != undefined)
                geo_viewer.super.cesiumViewer.entities.remove(geo_viewer.time_label[i]);
        }
    }
    if (geo_viewer.label_timeout != undefined) {
        window.clearTimeout(geo_viewer.label_timeout);
    }

    geo_viewer.time_label = [];

    if (geo_viewer.super.mode == 'SPACETIME') {
        var ret = this.showHeightBar(id);
        geo_viewer.projection = geo_viewer.super.cesiumViewer.scene.primitives.add(ret[0]);

        var time_label = ret[1];
        for (var i = 0; i < time_label.length; i++) {
            geo_viewer.time_label.push(geo_viewer.super.cesiumViewer.entities.add(time_label[i]));
        }
    }

    //TODO click highlight => blinking

    geo_viewer.label_timeout = setTimeout(function () {
        if (geo_viewer.projection != null) {
            if (!geo_viewer.projection.isDestroyed()) {
                geo_viewer.super.cesiumViewer.scene.primitives.remove(geo_viewer.projection);
            }
            geo_viewer.projection = null;
        }
        if (geo_viewer.time_label.length != 0) {
            for (var i = 0; i < geo_viewer.time_label.length; i++) {
                if (geo_viewer.time_label[i] != null && geo_viewer.time_label[i] != undefined)
                    geo_viewer.super.cesiumViewer.entities.remove(geo_viewer.time_label[i]);
            }
        }

    }, 10000);


    return 1;

}

// Stinuum.GeometryViewer.prototype.drawBoundingBox = function (bounding_box, layer_id) {
//     // if (bounding_box.bbox[1] < -90 || bounding_box.bbox[3] > 90 || bounding_box.bbox[0] < -180 || bounding_box.bbox[1] > 180){
//     //   return;
//     // }
//     var coords = Cesium.Rectangle.fromDegrees(bounding_box.bbox[0], bounding_box.bbox[1], bounding_box.bbox[2], bounding_box.bbox[3]);
//     var box_entity = this.super.cesiumViewer.entities.add({
//         id: layer_id,
//         rectangle: {
//             coordinates: coords,
//             height: 0,
//             material: Cesium.Color.YELLOW.withAlpha(0.1),
//             outline: true,
//             outlineColor: Cesium.Color.RED,
//             outlineWidth: 5.0
//         }
//     });
//     LOG("drawBoundingBox : ", this.super.mode)
//     if (this.super.mode == 'STATICMAP' || this.super.mode == 'ANIMATEDMAP') {
//         this.super.cesiumViewer.zoomTo(box_entity, new Cesium.HeadingPitchRange(0, 0, 20000000));
//     }
//     else this.super.cesiumViewer.zoomTo(box_entity);
// }

// Stinuum.GeometryViewer.prototype.removeBoundingBox = function (layer_id) {
//     var ret = this.super.cesiumViewer.entities.removeById(layer_id);
// }

Stinuum.MFCollection.prototype.add = function (mf, id) {
    LOG(mf)
    LOG(id)
    if (Array.isArray(mf.features)) {
        for (var i = 0; i < mf.length; i++) {
            this.add(mf.features[i]);
        }
    } else {
        if (mf.type != 'Feature' && mf.type != 'FeatureCollection') {
            //console.log("it is not MovingFeature!!");
            return -1;
        }
        if (this.inFeaturesIndexOf(mf) != -1 || this.inWholeIndexOf(mf) != -1) {
            //console.log("this mf already exist.");
            return -2;
        }
        if (id != undefined && (this.inFeaturesIndexOfById(id) != -1 || this.inWholeIndexOfById(id) != -1)) {
            //console.log("this id already exist.");
            return -2;
        }

        if (mf.name == undefined && id == undefined && mf.properties.name == undefined) {
            alert("feature has no name!");
            return -1;
        }
        if (id != undefined) {
            this.features.push(new Stinuum.MFPair(id, mf));
            this.wholeFeatures.push(new Stinuum.MFPair(id, mf));
        } else {
            this.features.push(new Stinuum.MFPair(mf.properties.name, mf));
            this.wholeFeatures.push(new Stinuum.MFPair(mf.properties.name, mf));
        }
    }
}

Stinuum.MFCollection.prototype.remove = function (mf) {
    LOG(mf)
    var index = this.inFeaturesIndexOfById(mf.properties.name);
    if (index != -1) this.removeByIndexInFeatures(index);
    index = this.inWholeIndexOfById(mf.properties.name);

    var ret;
    if (index != -1) ret = this.removeByIndexInWhole(index);

    if (this.inFeaturesIndexOfById(mf.properties.name) != -1 || this.inWholeIndexOfById(mf.properties.name) != -1) {
        throw new Stinuum.Excetion("after removing but exist", [this, mf]);
    }
    if (ret != undefined) return ret;
    //console.log("this mf is not exist in array", mf);
    return 0;
}

Stinuum.MFCollection.prototype.removeById = function (id) {
    var index = this.inFeaturesIndexOfById(id);
    if (index != -1) this.removeByIndexInFeatures(index);
    index = this.inWholeIndexOfById(id);
    if (index != -1) return this.removeByIndexInWhole(index);
    //console.log("this mf is not exist in array", mf);
    return 0;
}

Stinuum.MFCollection.prototype.removeByIndexInFeatures = function (index) {
    var remove_pair = this.features.splice(index, 1)[0];
    return remove_pair;
}

Stinuum.MFCollection.prototype.removeByIndexInWhole = function (index) {
    var remove_pair = this.wholeFeatures.splice(index, 1)[0];
    return remove_pair;
}

Stinuum.MFCollection.prototype.inFeaturesIndexOfById = function (id) {
    for (var i = 0; i < this.features.length; i++) {
        if (this.features[i].id == id) {
            return i;
        }
    }
    return -1;
}

Stinuum.MFCollection.prototype.inWholeIndexOfById = function (id) {
    for (var i = 0; i < this.wholeFeatures.length; i++) {
        if (this.wholeFeatures[i].id == id) {
            return i;
        }
    }
    return -1;
}

Stinuum.MFCollection.prototype.inFeaturesIndexOf = function (mf) {

    for (var i = 0; i < this.features.length; i++) {
        LOG(this.features[i])
        LOG(this.features[i].feature)
        if (this.features[i].feature == mf) {
            return i;
        }
    }
    return -1;
}

Stinuum.MFCollection.prototype.inWholeIndexOf = function (mf) {
    for (var i = 0; i < this.wholeFeatures.length; i++) {
        if (this.wholeFeatures[i].feature == mf) {
            return i;
        }
    }
    return -1;
}

//move whole features to features
Stinuum.MFCollection.prototype.refresh = function () {
    this.super.s_query_on = false;
    this.features = [];
    for (var i = 0; i < this.wholeFeatures.length; i++) {
        this.features.push(this.wholeFeatures[i]);
    }
}

Stinuum.MFCollection.prototype.findMinMaxGeometry = function (p_mf_arr, use_default_time = false) {
    
  
    var mf_arr;
    if (p_mf_arr == undefined) {
        mf_arr = this.features;
    } else {
        mf_arr = p_mf_arr;
    }

    if (mf_arr.length == 0) {
        return -1;
    }

    var min_max = {};
    min_max.x = [];
    min_max.y = [];
    min_max.z = [];

    min_max.date = [];
    var first_date;
    
    if (mf_arr[0].feature.temporalGeometry.type == "MovingGeometryCollection"){
        first_date = new Date(mf_arr[0].feature.temporalGeometry.prisms[0].datetimes[0]);
    }
    else{
        first_date = new Date(mf_arr[0].feature.temporalGeometry.datetimes[0]);
    }
    min_max.date = [first_date, first_date];

    for (var i = 0; i < mf_arr.length; i++) {
        var mf_min_max_coord = {};
        console.log("check point")
        console.log(mf_arr[i].feature.temporalGeometry)
        console.log(mf_arr[i].feature.temporalGeometry.type)
        if (mf_arr[i].feature.temporalGeometry.type == "MovingGeometryCollection"){
            for (var prism_i = 0; prism_i < mf_arr[i].feature.temporalGeometry.prisms.length; prism_i++){
                var eachFeature =  mf_arr[i].feature.temporalGeometry.prisms[prism_i];
                if (eachFeature.type == "MovingPoint") {
                    mf_min_max_coord = Stinuum.findMinMaxCoord(eachFeature.coordinates);
                }else{
                    var coord_arr = eachFeature.coordinates;
                    mf_min_max_coord = Stinuum.findMinMaxCoord(coord_arr[0][0]);
                    for (var j = 1; j < coord_arr.length; j++) {
                        mf_min_max_coord = Stinuum.findBiggerCoord(mf_min_max_coord, Stinuum.findMinMaxCoord(coord_arr[j][0]));
                    }
                }
                if (min_max.x.length == 0) {
                    min_max.x = mf_min_max_coord.x;
                    min_max.y = mf_min_max_coord.y;
                    min_max.z = mf_min_max_coord.z;
                } else {
                    var xyz = Stinuum.findBiggerCoord(min_max, mf_min_max_coord);
                    min_max.x = xyz.x;
                    min_max.y = xyz.y;
                    min_max.z = xyz.z;
                }

                var temp_max_min = Stinuum.findMinMaxTime(eachFeature.datetimes);

                if (temp_max_min[0].getTime() < min_max.date[0].getTime()) {
                    min_max.date[0] = temp_max_min[0];
                }
                if (temp_max_min[1].getTime() > min_max.date[1].getTime()) {
                    min_max.date[1] = temp_max_min[1];
                }
                if (use_default_time) {
                    if (mf_arr[i].feature.mindatetime &&
                        mf_arr[i].feature.mindatetime.getTime() < min_max.date[0].getTime()) {
                        min_max.date[0] = mf_arr[i].feature.mindatetime;
                    }
                    if (mf_arr[i].feature.maxdatetime &&
                        mf_arr[i].feature.maxdatetime.getTime() > min_max.date[1].getTime()) {
                        min_max.date[1] = mf_arr[i].feature.maxdatetime;
                    }
                }   
            }
            
        }else {
            if (mf_arr[i].feature.temporalGeometry.type == "MovingPoint") {
                mf_min_max_coord = Stinuum.findMinMaxCoord(mf_arr[i].feature.temporalGeometry.coordinates);
    
            }else{
                var coord_arr = mf_arr[i].feature.temporalGeometry.coordinates;
                mf_min_max_coord = Stinuum.findMinMaxCoord(coord_arr[0][0]);
                for (var j = 1; j < coord_arr.length; j++) {
                    mf_min_max_coord = Stinuum.findBiggerCoord(mf_min_max_coord, Stinuum.findMinMaxCoord(coord_arr[j][0]));
                }
            }
            if (min_max.x.length == 0) {
                min_max.x = mf_min_max_coord.x;
                min_max.y = mf_min_max_coord.y;
                min_max.z = mf_min_max_coord.z;
            } else {
                var xyz = Stinuum.findBiggerCoord(min_max, mf_min_max_coord);
                min_max.x = xyz.x;
                min_max.y = xyz.y;
                min_max.z = xyz.z;
            }
            var temp_max_min = Stinuum.findMinMaxTime(mf_arr[i].feature.temporalGeometry.datetimes);

            if (temp_max_min[0].getTime() < min_max.date[0].getTime()) {
                min_max.date[0] = temp_max_min[0];
            }
            if (temp_max_min[1].getTime() > min_max.date[1].getTime()) {
                min_max.date[1] = temp_max_min[1];
            }
             // kitanishi add, for getting JSON from Dataplatform
            if (use_default_time) {
                if (mf_arr[i].feature.mindatetime &&
                    mf_arr[i].feature.mindatetime.getTime() < min_max.date[0].getTime()) {
                    min_max.date[0] = mf_arr[i].feature.mindatetime;
                }
                if (mf_arr[i].feature.maxdatetime &&
                    mf_arr[i].feature.maxdatetime.getTime() > min_max.date[1].getTime()) {
                    min_max.date[1] = mf_arr[i].feature.maxdatetime;
                }
            }
        }       
    }
    
    if (p_mf_arr == undefined) {
        this.min_max = min_max;
    }
    
    this.super.maxHeight = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(min_max.x[0], min_max.y[0]), Cesium.Cartesian3.fromDegrees(min_max.x[1], min_max.y[1])) * 4;
    var test = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(10, 2.0), Cesium.Cartesian3.fromDegrees(12, 3.0))
    
    // if ( this.super.maxHeight < 5000000){
    //     this.super.maxHeight = 5000000
    // }
    return min_max;
}

Stinuum.MFCollection.prototype.getWholeMinMax = function (use_default_time = false) {
    this.whole_min_max = this.findMinMaxGeometry(this.wholeFeatures, use_default_time);
    return this.whole_min_max;
}

Stinuum.MFCollection.prototype.getColor = function (id) {
    if (this.colorCollection[id] != undefined) {
        return this.colorCollection[id];
    }
    var color = Cesium.Color.fromRandom({
        minimumRed: 0.2,
        minimumBlue: 0.2,
        minimumGreen: 0.2,
        alpha: 1.0
    });
    this.colorCollection[id] = color;
    return color;
}
Stinuum.MFCollection.prototype.getRandomColor = function () {
 
    var color = Cesium.Color.fromRandom({
        minimumRed: 0.2,
        minimumBlue: 0.2,
        minimumGreen: 0.2,
        alpha: 1.0
    });
    
    return color;
}

Stinuum.MFCollection.prototype.setColor = function (id, color) {
    this.colorCollection[id] = color;
}

Stinuum.MFCollection.prototype.getAllPropertyType = function () {
    console.log("getAllPropertyType")
    var array = [];
    for (var i = 0; i < this.features.length; i++) {
        if (this.features[i].feature.temporalProperties == undefined) continue;

        if (Array.isArray(this.features[i].feature.temporalProperties)) {
            for (var j = 0; j < this.features[i].feature.temporalProperties.length; j++) {
                console.log(this.features[i].feature.temporalProperties[j])
                Stinuum.pushPropertyNamesToArrayExceptTime(array, this.features[i].feature.temporalProperties[j]);
            }
        } else {
            // Stinuum.pushPropertyNamesToArrayExceptTime(array, this.features[i].feature.temporalProperties);
       
            throw new Error("temporalProperties should be array");
        }

    }
    return array;
}


Stinuum.MFCollection.prototype.getMFPairById = function (id) {
    var inWhole = this.getMFPairByIdinWhole(id);
    if (inWhole != -1) {
        return inWhole;
    }
    return -1;
}

Stinuum.MFCollection.prototype.getMFPairByIdInFeatures = function (id) {
    var index = this.inFeaturesIndexOfById(id);
    if (index != -1) return this.features[index];

    return -1;
}

Stinuum.MFCollection.prototype.getMFPairByIdinWhole = function (id) {
    var index = this.inWholeIndexOfById(id);
    if (index != -1) return this.wholeFeatures[index];

    return -1;
}

Stinuum.MFCollection.prototype.getLength = function () {
    return this.features.length;
}

Stinuum.MFCollection.prototype.reset = function () {
    this.features = [];
    this.wholeFeatures = [];
    this.colorCollection = [];

}

Stinuum.MFCollection.prototype.hide = function (mf_id) {
    if (this.inFeaturesIndexOfById(mf_id) != -1) {
        var index = this.inFeaturesIndexOfById(mf_id);
        var hidden_pair = this.features.splice(index, 1)[0];
    }
}

Stinuum.MFCollection.prototype.hideAll = function (mf_id) { //hide All except one mf
    this.features = [];
    if (mf_id != undefined) {
        var index = this.inWholeIndexOfById(mf_id);
        var pair = this.wholeFeatures[index];
        this.features.push(pair);
    }


}

Stinuum.MovementDrawing.prototype.moveMovingPoint = function (options) {
    var czml = [];

    var geometry = options.temporalGeometry;    
    var number = options.number;
    var geometry_interpolation = geometry.interpolation
    var feature_id = options.id
    var multiplier = 10000;
    var length = geometry.datetimes.length;
    var start, stop;
    start = new Date(geometry.datetimes[0]).toISOString();
    stop = new Date(geometry.datetimes[length - 1]).toISOString();


    this.supersuper.mfCollection.findMinMaxGeometry();
    
    LOG(geometry.datetimes.length)
    LOG(geometry.coordinates.length)
    var check = true
    if (geometry.datetimes.length == 1 && geometry.datetimes.length == 1){
        check = false
        geometry_interpolation = "Discrete"
    }
    
    if (geometry_interpolation == "Linear" || geometry_interpolation == "Quadratic" || geometry_interpolation == "Cubic") {
        var interpolation;
        var interpolationD;
        if (geometry_interpolation == "Linear") {
            interpolation = "LINEAR";
            interpolationD = 2;
        } else if (geometry_interpolation == "Quadratic") {
            interpolation = "LAGRANGE";
            interpolationD = 2;
        } else {
            interpolation = "HERMITE";
            interpolationD = 3;
        }
    
        var v = {};
        v.id = 'movingPoint_' +feature_id+'_'+ number;

        if(this.supersuper.mode == 'SPACETIME'){
            var scale = 100;
        }else{
            var scale = 1;
        }
        var carto = [];
        var point = geometry.coordinates;
        for (var i = 0; i < geometry.coordinates.length; i++) {
            // console.log(new Date(geometry.datetimes[i]))
            // console.log(new Date(geometry.datetimes[i]).toISOString())
            carto.push(new Date(geometry.datetimes[i]).toISOString());
            carto.push(point[i][0]);
            carto.push(point[i][1]);
            var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[i]), this.supersuper.mfCollection.min_max.date, this.supersuper.maxHeight);
            if (this.supersuper.mode == 'STATICMAP') {
                carto.push(0);
            }else if(this.supersuper.mode == 'ANIMATEDMAP'){
                if (point[i][2] != undefined) {
                    carto.push(point[i][2]);
                } else {
                    carto.push(0);
                }
            } else {
                carto.push(normalize);
            }

        }
        var availability = start + "/" + stop;
        v.availability = availability;
        v.position = {
            "interpolationAlgorithm": interpolation,
            "interpolationDegree": interpolationD,
            "interval": availability,
            "epoch": start,
            "cartographicDegrees": carto
        }; 
        var unitQ = [];
    
        if (geometry.base != undefined){
            if (this.supersuper.mode == 'SPACETIME'){
                v.point = {
                    "color": {
                        "rgba": [0, 0, 0, 255]
                    },
                    "outlineColor": {
                        "rgba": [255, 255, 255, 255]
                    },
                    "outlineWidth": 4,
                    "pixelSize": 20
                };
            }else{
                // var baseModel;
                // $.ajax({
                //     url: geometry.base.href,
                //     async: false,
                //     // dataType: 'json',
                //     success: function successFunction(data) {
                //         console.log(data)
                //     }
                // })
                v.model = {
                    gltf: geometry.base.href,
                    scale : scale,
                    show: [{
                        interval: availability,
                        boolean: true
                    }]
                }
            }
        }else{
                v.point = {
                "color": {
                    "rgba": [0, 0, 0, 255]
                },
                "outlineColor": {
                    "rgba": [255, 255, 255, 255]
                },
                "outlineWidth": 4,
                "pixelSize": 20
            };
        }
        
        if (geometry.orientations != undefined && geometry.orientations.length != 0){
            var datetimes_i = 0
            for (var o = geometry.orientations.length - geometry.datetimes.length; o < geometry.orientations.length; o++){
                // var tempQuaternion = Cesium.Quaternion.fromRotationMatrix(geometry.orientations[o]);
                //roll = x, pitch = y, heading = z
                if(geometry.orientations[o].length == 16){
                    var tempQuaternion = Cesium.Quaternion.fromRotationMatrix(geometry.orientations[o]);
                }else{
                    var eachAngles =  geometry.orientations[o].angles
                    // var newHPR = Cesium.HeadingPitchRoll.fromDegrees(eachAngles[0], eachAngles[1], eachAngles[2])
                    var newHPR = Cesium.HeadingPitchRoll.fromDegrees(eachAngles[2], eachAngles[1], eachAngles[0])
                    var tempQuaternion = Cesium.Quaternion.fromHeadingPitchRoll(newHPR)
                }
           
                unitQ.push(new Date(geometry.datetimes[datetimes_i]).toISOString());
                unitQ.push(tempQuaternion.x)
                unitQ.push(tempQuaternion.y)
                unitQ.push(tempQuaternion.z)
                unitQ.push(tempQuaternion.w)
                datetimes_i+=1
            }
    
            // 0,0,0,1, //(assuming x,y,z,w) wings level, heading due north
            // 0,0.7071,0,0.7071, //rotate 90 about y axis
            // 0,1,0,0, //rotate 180 about y axis
            // 0,0,0,1, //back to start position
            // 0.7071,0,0,0.7071, //heading north, nose vertical up
            // [0,0,0,1, 
            // 0,0.7071,0,0.7071,
            // 0,1,0,0,
            // 0,0,0,1,
            // 0.7071,0,0,0.7071]

            // var test = ["2011-07-14T22:01:01.000Z",0,0,0,1,
            //     "2011-07-14T22:01:02.000Z",0,0.7071,0,0.7071,
            //     "2011-07-14T22:01:03.000Z",0,1,0,0,
            //     "2011-07-14T22:01:04.000Z",0,0,0,1,
            //     "2011-07-14T22:01:05.000Z",0.7071,0,0,0.7071]
            v.orientation = {
                "velocityReference": "#position",
                "interpolationAlgorithm": interpolation,
                "interpolationDegree": interpolationD,
                "interval": availability,
                "epoch": start,
                "unitQuaternion": unitQ
            };
        }else{
            if (geometry.base != undefined){
                v.orientation = {
                    "velocityReference": "#position",
                    "interpolationAlgorithm": interpolation,
                    "interpolationDegree": interpolationD,
                    "interval": availability,
                    "epoch": start,
                };
            }
        }
        czml.push(v);
        console.log(czml)
    }   
    else {
        var v = {};
        v.id = 'movingPoint_'+feature_id+"_" + number;
        v.point = {
            "color": {
                "rgba": [0, 0, 0, 255]
            },
            "outlineColor" : {
            "rgba" : [255, 255, 255, 255]
            },
            "outlineWidth" : 4,
            "pixelSize": 20
        };
        
        var carto = [];
        var point = geometry.coordinates;
        for (var i = 0; i < geometry.coordinates.length; i++) {
            var obj = {};
            if (geometry_interpolation == "Step") {
                if (i == geometry.coordinates.length - 1){
                    var start_interval = new Date(geometry.datetimes[i]).toISOString();
                    var finish_interval = new Date(geometry.datetimes[i]).toISOString();
                    obj.interval = start_interval + "/" + finish_interval;
                }else{
                    var start_interval = new Date(geometry.datetimes[i]).toISOString();
                    var finish_interval = new Date(geometry.datetimes[i + 1]).toISOString();
                    obj.interval = start_interval + "/" + finish_interval;
                }
              
            } else {
                if(check){
                    if (i == geometry.coordinates.length - 1){
                        var span = (new Date(geometry.datetimes[i]).getTime() - new Date(geometry.datetimes[i-1]).getTime()) / 100
                        var finish_interval = new Date(geometry.datetimes[i]).toISOString();
                        var start_interval = new Date(new Date(geometry.datetimes[i]).getTime() - span).toISOString();
                        obj.interval = start_interval + "/" + finish_interval;
                    }
                    else{
                
                        var span = (new Date(geometry.datetimes[i + 1]).getTime() - new Date(geometry.datetimes[i]).getTime()) / 100
                        var start_interval = new Date(geometry.datetimes[i]).toISOString();
                        var finish_interval = new Date(new Date(geometry.datetimes[i]).getTime() + span).toISOString();
                        obj.interval = start_interval + "/" + finish_interval;
                    }
                }else{
                    if (i == geometry.coordinates.length - 1){
                        var start_interval = new Date(geometry.datetimes[i]).toISOString();
                        var finish_interval = new Date(geometry.datetimes[i]).toISOString();
                        obj.interval = start_interval + "/" + finish_interval;
                    }
                }
            }
            obj.cartographicDegrees = [];
            obj.cartographicDegrees.push(point[i][0]);
            obj.cartographicDegrees.push(point[i][1]);

            var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[i]), this.supersuper.mfCollection.min_max.date, this.supersuper.maxHeight);
            
            if (this.supersuper.mode == 'STATICMAP') {
                obj.cartographicDegrees.push(0);
            }else if(this.supersuper.mode == 'ANIMATEDMAP'){
                if (point[i][2] != undefined) {
                    obj.cartographicDegrees.push(point[i][2]);
                } else {
                    obj.cartographicDegrees.push(0);
                }
            } else {
                obj.cartographicDegrees.push(normalize);
            }
            carto.push(obj);
        }

        var availability = start + "/" + stop;
        v.availability = availability;
        v.position = carto;
        v.position.interval = start + "/" + stop;
        v.position.epoch = start
        czml.push(v);
    }

    return czml;
}
Stinuum.MovementDrawing.prototype.moveMovingPointCloud = function(options){
    var czml = [];
    LOG("moveMovingPointCloud")
    var geometry = options.temporalGeometry;    
    var geometry_interpolation = geometry.interpolation
  
    var feature_id = options.id
    var number = options.number;
    var multiplier = 10000;
    var length = geometry.datetimes.length;
    var check = true
    if (geometry.datetimes.length == 1 && geometry.coordinates.length == 1){
        check = false
        geometry_interpolation = "Discrete"
    }
    
    var start, stop;
    start = new Date(geometry.datetimes[0]).toISOString();
    stop = new Date(geometry.datetimes[length - 1]).toISOString();

    this.supersuper.mfCollection.findMinMaxGeometry();
    
    var carto = [];
    var point = geometry.coordinates;
    
    if(geometry_interpolation == "Step"){
        for (var i = 0; i < geometry.datetimes.length; i++){
           
            var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[i]), this.supersuper.mfCollection.min_max.date, this.supersuper.maxHeight);
            for (var j = 0; j < geometry.coordinates[i][0].length; j++){
                var point = geometry.coordinates[i][0][j]
                LOG(geometry.coordinates[i][0][j])
                var v = {}
                v.id = 'PointCloud_'+ feature_id+"_"+number+"_"+ i+"_"+j;
                if (i != geometry.datetimes.length-1){
                    v.point = {
                        "color": {
                            "rgba": [0, 255, 255, 255]
                        },
                        "pixelSize": 10,
                        "availability": geometry.datetimes[i]+"/"+geometry.datetimes[i+1]
                    };
                    v.position = {
                        "epoch": geometry.datetimes[i],
                        "interval":geometry.datetimes[i]+"/"+geometry.datetimes[i+1],
                        "cartographicDegrees": []
                    };
                }else{
                    v.point = {
                        "color": {
                            "rgba": [0, 255, 255, 255]
                        },
                        "pixelSize": 10,
                        "availability": geometry.datetimes[i]+"/"+geometry.datetimes[i]
                    };
                    v.position = {
                        "epoch": geometry.datetimes[i],
                        "interval":geometry.datetimes[i]+"/"+geometry.datetimes[i],
                        "cartographicDegrees": []
                    };    
                }
                var carto = []
                if (this.supersuper.mode == 'STATICMAP'){
                    carto.push(point[0])
                    carto.push(point[1])
                    carto.push(0)
                }else if (this.supersuper.mode == 'ANIMATEDMAP'){
                    if (point[2] == undefined){
                        carto.push(point[0])
                        carto.push(point[1])
                        carto.push(0)
                    }else{
                        carto.push(point[0])
                        carto.push(point[1])
                        carto.push(point[2])
                    }
                }else{
                    carto.push(point[0])
                    carto.push(point[1])
                    carto.push(normalize)
                }
                v.position.cartographicDegrees = carto;            
                czml.push(v)
            }
        }
        
    }else if(geometry_interpolation == "Discrete"){
        if(check){
            for (var i = 0; i < geometry.datetimes.length; i++){
            
                var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[i]), this.supersuper.mfCollection.min_max.date, this.supersuper.maxHeight);
                for (var j = 0; j < geometry.coordinates[i][0].length; j++){
                    var point = geometry.coordinates[i][0][j]
                    LOG(geometry.coordinates[i][0][j])
                    var v = {}
                    v.id = 'PointCloud_'+feature_id+"_"+number+ "_"+ i+"_"+j;
                    if (i != geometry.datetimes.length-1){
                        var end_time = new Date(geometry.datetimes[i+1])
                        var start_time = new Date(geometry.datetimes[i])
                        var span = (end_time.getTime() - start_time.getTime()) / 10

                    
                        var new_span_time = (new Date(start_time.getTime() + span)).toISOString()
                        v.point = {
                            "color": {
                                "rgba": [0, 255, 255, 255]
                            },
                            "pixelSize": 10,
                            "availability": geometry.datetimes[i]+"/"+new_span_time
                        };
                        v.position = {
                            "epoch": geometry.datetimes[i],
                            "interval":geometry.datetimes[i]+"/"+new_span_time,
                            "cartographicDegrees": []
                        };
                    }else{
                        var end_time = new Date(geometry.datetimes[i])
                        var start_time = new Date(geometry.datetimes[i-1])
                        var span = (end_time.getTime() - start_time.getTime()) / 10
                        var new_span_time = (new Date(end_time.getTime() - span)).toISOString()
                        v.point = {
                            "color": {
                                "rgba": [0, 255, 255, 255]
                            },
                            "pixelSize": 10,
                            "availability": new_span_time+"/"+geometry.datetimes[i]
                        };
                        v.position = {
                            "epoch": new_span_time,
                            "interval":new_span_time+"/"+geometry.datetimes[i],
                            "cartographicDegrees": []
                        };    
                    }
                    var carto = []
                    if (this.supersuper.mode == 'STATICMAP'){
                        carto.push(point[0])
                        carto.push(point[1])
                        carto.push(0)
                    }else if (this.supersuper.mode == 'ANIMATEDMAP'){
                        if (point[2] == undefined){
                            carto.push(point[0])
                            carto.push(point[1])
                            carto.push(0)
                        }else{
                            carto.push(point[0])
                            carto.push(point[1])
                            carto.push(point[2])
                        }
                    }else{
                        carto.push(point[0])
                        carto.push(point[1])
                        carto.push(normalize)
                    }
                    v.position.cartographicDegrees = carto;            
                    czml.push(v)
                }
            }
        }else{
            for (var i = 0; i < geometry.datetimes.length; i++){
                var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[i]), this.supersuper.mfCollection.min_max.date, this.supersuper.maxHeight);
                var end_time = new Date(geometry.datetimes[i]).toISOString()
                var start_time = new Date(geometry.datetimes[i]).toISOString()
                for (var j = 0; j < geometry.coordinates[i][0].length; j++){
                    var point = geometry.coordinates[i][0][j]
                    var v = {}
                    v.id = 'PointCloud_'+feature_id+"_"+number+ "_"+i+"_"+j;
                    v.point = {
                        "color": {
                            "rgba": [0, 255, 255, 255]
                        },
                        "pixelSize": 10,
                        "availability": start_time+"/"+end_time
                    };
                    v.position = {
                        "epoch": start_time,
                        "interval":start_time+"/"+end_time,
                        "cartographicDegrees": []
                    };
                    
                    var carto = []
                    if (this.supersuper.mode == 'STATICMAP'){
                        carto.push(point[0])
                        carto.push(point[1])
                        carto.push(0)
                    }else if (this.supersuper.mode == 'ANIMATEDMAP'){
                        if (point[2] == undefined){
                            carto.push(point[0])
                            carto.push(point[1])
                            carto.push(0)
                        }else{
                            carto.push(point[0])
                            carto.push(point[1])
                            carto.push(point[2])
                        }
                    }else{
                        carto.push(point[0])
                        carto.push(point[1])
                        carto.push(normalize)
                    }
                    v.position.cartographicDegrees = carto;            
                    czml.push(v)
                }
            }
        }
    }

    return czml;
}
Stinuum.MovementDrawing.prototype.moveMovingPolygon = function (options) {
    var geometry = options.temporalGeometry
    var number = options.number;
    var feature_id = options.id
    var multiplier = 10000;
    var czml = [];
    var ref_id_arr = [];
    var ref_obj = {
        "id": "dynamicPolygon_"+feature_id+"_" + number,
        "polygon": {
            "positions": {
                "references": ref_id_arr
            },
            "perPositionHeight": true,
            "material": {
                "solidColor": {
                    "color": {
                        "rgbaf": [1, 0, 0, 1]
                    }
                }
            }
        }
    };

    if (this.supersuper.s_query_on) ref_obj.polygon.material.solidColor.color.rgbaf = [1, 0.2, 0.2, 0.4];
    var geometry_interpolation = geometry.interpolation
    
    var length = geometry.datetimes.length;
    var check = true
    if(length == 1){
        check = false
        geometry_interpolation = "Discrete"
    }
    var start, stop;
    start = new Date(geometry.datetimes[0]).toISOString();
    stop = new Date(geometry.datetimes[length - 1]).toISOString();
    var availability = start + "/" + stop;
    ref_obj.availability = availability;

    if (geometry_interpolation == "Linear" || geometry_interpolation == "Quadratic" || geometry_interpolation == "Cubic") {
        czml.push(ref_obj);
        var interpolation;
        var interpolationD;
        if (geometry_interpolation == "Linear") {
            interpolation = "LINEAR";
            interpolationD = 2;
        } else if (geometry_interpolation == "Quadratic") {
            interpolation = "LAGRANGE";
            interpolationD = 2;
        } else {
            interpolation = "HERMITE";
            interpolationD = 3;
        }
        //check close polygon geometry.coordinates[0][0].length - 1
        for (var i = 0; i < geometry.coordinates[0][0].length; i++) {
            var v = {};
            v.id = 'v_'+feature_id+"_" + number + "_" + (i + 1);
            each_id = 'v_'+feature_id+"_" + number + "_" + (i + 1) + "#position";
            ref_id_arr.push(each_id);
            v.position = {
                "interpolationAlgorithm": interpolation,
                "interpolationDegree": interpolationD,
                "interval": availability,
                "epoch": start,
                "cartographicDegrees": []
            };
            czml.push(v);

            var start_second = new Date(geometry.datetimes[0]).getTime();
            var carto = [];
            for (var j = 0; j < geometry.datetimes.length; j++) {
                var seconds = new Date(geometry.datetimes[j]).getTime() - start_second;
                var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[j]), this.supersuper.mfCollection.min_max.date, this.supersuper.maxHeight);
                var polygon = geometry.coordinates[j][0];

                carto.push(seconds / 1000);
                carto.push(polygon[i][0]);
                carto.push(polygon[i][1]);
                if (this.supersuper.mode == 'STATICMAP') {
                    carto.push(0);
                }else if(this.supersuper.mode == 'ANIMATEDMAP'){
                    if (polygon[i][2] != undefined) {
                        carto.push(polygon[i][2]);
                    } else {
                        carto.push(0);
                    }
                } else {
                    carto.push(normalize);
                }
            }
            v.position.cartographicDegrees = carto;
        }
    } else {
        if (geometry_interpolation == "Step"){
            for (var i = 0; i < geometry.datetimes.length; i++) {
                var start_date = new Date(geometry.datetimes[i]);
                var start_iso = start_date.toISOString();
                var finish_date;
                var finish_iso;
                if (i == geometry.datetimes.length - 1){
                    finish_date = new Date(geometry.datetimes[i - 1]).getTime()
                    var finish_time = (start_date.getTime() - finish_date) / 100;
                    finish_iso = start_iso
                    start_iso = new Date(start_date.getTime() - finish_time).toISOString();
                 
                }else if(i == geometry.datetimes.length - 2){
                    finish_date = new Date(geometry.datetimes[i + 1])
                    var finish_time = (finish_date.getTime() - start_date.getTime()) / 100;            
                    finish_iso = new Date(finish_date.getTime() - finish_time).toISOString();    
                }
                else{
                    finish_iso = new Date(geometry.datetimes[i + 1]).toISOString();
                }
              
                var v = {};
                v.id = "polygon_"+feature_id+"_" + number + "_" + i;
                v.availability = start_iso + "/" + finish_iso;
                var carto = [];
                var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[i]), this.supersuper.mfCollection.min_max.date, this.supersuper.maxHeight);
                var polygon = geometry.coordinates[i][0];
                for (var j = 0; j < polygon.length; j++) {
                    carto.push(polygon[j][0]);
                    carto.push(polygon[j][1]);
                    if (this.supersuper.mode == 'SPACETIME')
                        carto.push(normalize);
                    else {
                        if (polygon[j][2] != undefined){
                            carto.push(polygon[j][2]);
                        }else{
                            carto.push(0);
                        }
                        
                    }
                }
            
                v.polygon = {
                    "positions": {
                        "cartographicDegrees": carto
                    },
                    "perPositionHeight": true,
                    "meterial": {
                        "solidColor": {
                            "color": {
                                "rgbaf": [1, 0, 0, 1]
                            }
                        }
                    },
                   
                };
                v.polygon.positions.interval = start_iso + "/" + finish_iso;
                v.polygon.positions.epoch = start_iso
                czml.push(v);       
            }
        }
        else if (geometry_interpolation == "Discrete"){
            if(check){
                for (var i = 0; i < geometry.datetimes.length; i++) {
                    var start_date = new Date(geometry.datetimes[i]);
                    var start_iso = start_date.toISOString();
                    var finish_date;
                    var finish_iso;
                    
                    if (i != geometry.datetimes.length -1 ) {
                        finish_date = new Date(geometry.datetimes[i + 1]).getTime()
                        var finish_time = (finish_date - start_date.getTime()) / 100;
                        // var finish_time = start_date.getTime() + 1000;
                        // LOG(finish_time)
                        // finish_iso = new Date(start_date.getTime() + 1000).toISOString();
                        finish_iso = new Date(start_date.getTime() + finish_time).toISOString();
                       
                    }else{
                        finish_date = new Date(geometry.datetimes[i - 1]).getTime()
                        var finish_time = (start_date.getTime() - finish_date) / 100;
                        finish_iso = start_iso
                        start_iso = new Date(start_date.getTime() - finish_time).toISOString();
                       
                        // var finish_time = new Date(geometry.datetimes[i]).getTime() + 1000;
                        // finish_iso = new Date(finish_time).toISOString();
                    }
                    var v = {};
                    v.id = "polygon_"+feature_id+"_" + number + "_" + i;
                    v.availability = start_iso + "/" + finish_iso;
                  
                    var carto = [];
                    var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[i]), this.supersuper.mfCollection.min_max.date, this.supersuper.maxHeight);
                    var polygon = geometry.coordinates[i][0];
                    for (var j = 0; j < polygon.length; j++) {
                        carto.push(polygon[j][0]);
                        carto.push(polygon[j][1]);
                        if (this.supersuper.mode == 'STATICMAP') {
                            carto.push(0);
                        }else if(this.supersuper.mode == 'ANIMATEDMAP'){
                            if (polygon.length == 3) {
                                LOG(polygon[i][2])
                                carto.push(polygon[i][2]);
                            } else {
                                carto.push(0);
                            }
                        } else {
                            carto.push(normalize);
                        }
                    }
                
                    v.polygon = {
                        "positions": {
                            "cartographicDegrees": carto
                        },
                        "perPositionHeight": true,
                        "meterial": {
                            "solidColor": {
                                "color": {
                                    "rgbaf": [1, 0, 0, 1]
                                }
                            }
                        },
                        
                    };
                    v.polygon.positions.interval = start_iso + "/" + finish_iso;
                    v.polygon.positions.epoch = start_iso
                    czml.push(v);       
                }
            }
            else{
                for (var i = 0; i < geometry.datetimes.length; i++) {
                    var start_iso = new Date(geometry.datetimes[i]).toISOString();
                    var finish_iso = new Date(geometry.datetimes[i]).toISOString();
                    var v = {};
                    v.id = "polygon_"+feature_id+"_" + number + "_" + i;
                    v.availability = start_iso + "/" + finish_iso;
                    var polygon = geometry.coordinates[i][0];
                    var carto = [];
                    var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[i]), this.supersuper.mfCollection.min_max.date, this.supersuper.maxHeight);
                    for (var j = 0; j < polygon.length; j++) {
                        carto.push(polygon[j][0]);
                        carto.push(polygon[j][1]);
                        if (this.supersuper.mode == 'STATICMAP') {
                            carto.push(0);
                        }else if(this.supersuper.mode == 'ANIMATEDMAP'){
                            if (polygon.length == 3) {
                                LOG(polygon[i][2])
                                carto.push(polygon[i][2]);
                            } else {
                                carto.push(0);
                            }
                        } else {
                            carto.push(normalize);
                        }
                    }
                
                    v.polygon = {
                        "positions": {
                            "cartographicDegrees": carto
                        },
                        "perPositionHeight": true,
                        "meterial": {
                            "solidColor": {
                                "color": {
                                    "rgbaf": [1, 0, 0, 1]
                                }
                            }
                        },
                        
                    };
                    v.polygon.positions.interval = start_iso + "/" + finish_iso;
                    v.polygon.positions.epoch = start_iso
                    czml.push(v);       
                }
            }
           
        }
          
    }
    return czml;
}
   
Stinuum.MovementDrawing.prototype.moveMovingLineString = function (options) {
    var czml = [];
    var geometry = options.temporalGeometry;
    var feature_id = options.id
    var number = options.number
    var datetime = geometry.datetimes;
    var length = datetime.length;
    var multiplier = 10000;
    var ref_id_arr = [];
    //  var next_mapping_point_arr = Stinuum.calculatePathForEachPoint(geometry);
    var ref_obj = {
        "id": "dynamicPolyline_"+feature_id+"_" + number,
        "polyline": {
            "positions": {
                "references": ref_id_arr
            },
            "perPositionHeight": true,
            "material": {
                "solidColor": {
                    "color": {
                        "rgbaf": [1, 0, 0, 1]
                    }
                }
            },
            "width" : 5
        }
    };

    if (this.supersuper.s_query_on) ref_obj.polyline.material.solidColor.color.rgbaf = [1, 0.2, 0.2, 0.4];

    var length = geometry.datetimes.length;
    var geometry_interpolation = geometry.interpolation
    var check = true
    if(length == 1){
        check = false
        geometry_interpolation = "Discrete"
    }
    var start, stop;
    start = new Date(geometry.datetimes[0]).toISOString();
    stop = new Date(geometry.datetimes[length - 1]).toISOString();
    var availability = start + "/" + stop;
    ref_obj.availability = availability;

    if (geometry_interpolation == "Linear" || geometry_interpolation == "Quadratic" || geometry_interpolation == "Cubic") {
        czml.push(ref_obj);
        var interpolation;
        var interpolationD;
        if (geometry_interpolation == "Linear") {
            interpolation = "LINEAR";
            interpolationD = 2;
        } else if (geometry_interpolation == "Quadratic") {
            interpolation = "LAGRANGE";
            interpolationD = 2;
        } else {
            interpolation = "HERMITE";
            interpolationD = 3;
        }

        for (var i = 0; i < geometry.coordinates[0][0].length; i++) {

            var v = {};
            v.id = 'v_'+feature_id+"_" + number + "_" + (i + 1);
            each_id = 'v_'+feature_id+"_" + number + "_" + (i + 1) + "#position";
            ref_id_arr.push(each_id);
            v.position = {
                "interpolationAlgorithm": interpolation,
                "interpolationDegree": interpolationD,
                "interval": availability,
                "epoch": start,
                "cartographicDegrees": []
            };
            czml.push(v);

            var start_second = new Date(geometry.datetimes[0]).getTime();
            var carto = [];
            var default_value;
            for (var j = 0; j < geometry.datetimes.length; j++) {
                var seconds = new Date(geometry.datetimes[j]).getTime() - start_second;
                var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[j]), this.supersuper.mfCollection.min_max.date, this.supersuper.maxHeight);
                var polyline = geometry.coordinates[j][0];

                carto.push(seconds / 1000);
                carto.push(polyline[i][0]);
                carto.push(polyline[i][1]);

                if (this.supersuper.mode == 'STATICMAP') {
                    carto.push(0);
                }else if(this.supersuper.mode == 'ANIMATEDMAP'){
                    if (polyline[i][2] != undefined) {
                        carto.push(polyline[i][2]);
                    } else {
                        carto.push(0);
                    }
                } else {
                    carto.push(normalize);
                }
            }
            v.position.cartographicDegrees = carto;
        }
    } else {
        if (geometry_interpolation == "Step"){
            for (var i = 0; i < geometry.datetimes.length; i++) {
                var start_date = new Date(geometry.datetimes[i]);
                var start_iso = start_date.toISOString();
                var finish_iso;
                var finish_date;
                var v = {};
                // if (i == geometry.datetimes.length - 1){
                //     start_iso = new Date(start_date.getTime() -  10000).toISOString();
                //     finish_iso = new Date(start_date.getTime()).toISOString();
                // }else if(i == geometry.datetimes.length - 2){
                //     finish_iso = new Date(geometry.datetimes[i + 1].getTime() - 10000).toISOString();
                // }
                // else{
                //     finish_iso = new Date(geometry.datetimes[i + 1]).toISOString();
                // }
                if (i == geometry.datetimes.length - 1){
                    finish_date = new Date(geometry.datetimes[i - 1]).getTime()
                    var finish_time = (start_date.getTime() - finish_date) / 100;
                    finish_iso = start_iso
                    start_iso = new Date(start_date.getTime() - finish_time).toISOString();
                }else if(i == geometry.datetimes.length - 2){
                    finish_date = new Date(geometry.datetimes[i + 1])
                    var finish_time = (finish_date.getTime() - start_date.getTime()) / 100;            
                    finish_iso = new Date(finish_date.getTime() - finish_time).toISOString();    
                }
                else{
                    finish_iso = new Date(geometry.datetimes[i + 1]).toISOString();
                }
             
                v.id = "polyline_"+feature_id+"_" + number + "_" + i;
                v.availability = start_iso + "/" + finish_iso;
               
                // v.interval = start_iso
                var carto = [];
                var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[i]), this.supersuper.mfCollection.min_max.date, this.supersuper.maxHeight);
                var polyline_ = geometry.coordinates[i][0];
                for (var j = 0; j < polyline_.length; j++) {
                    carto.push(polyline_[j][0]);
                    carto.push(polyline_[j][1]);
                    if (this.supersuper.mode == 'STATICMAP') {
                        carto.push(0);
                    }else if(this.supersuper.mode == 'ANIMATEDMAP'){
                        if (polyline_[i][2] != undefined) {
                            carto.push(polyline_[i][2]);
                        } else {
                            carto.push(0);
                        }
                    } else {
                        carto.push(normalize);
                    }
                }
                v.polyline = {
                    "positions": {
                        "cartographicDegrees": carto
                    },
                    "perPositionHeight": true,
                    "meterial": {
                        "solidColor": {
                            "color": {
                                "rgbaf": [1, 0, 0, 1]
                            }
                        }
                    },
                    "width" : 5,
                    
                };
                v.polyline.positions.interval = start_iso + "/" + finish_iso;
                v.polyline.positions.epoch = start_iso
                czml.push(v);       
            }
        } else if (geometry_interpolation == "Discrete"){
            if(check){
                for (var i = 0; i < geometry.datetimes.length; i++) {
                    var start_date = new Date(geometry.datetimes[i]);
                    var start_iso = start_date.toISOString();
                    var finish_date;
                    var finish_iso;
                    if (i != geometry.datetimes.length -1 ) {
                        finish_date = new Date(geometry.datetimes[i + 1]).getTime()
                        var finish_time = (finish_date - start_date.getTime()) / 100;
                        // var finish_time = start_date.getTime() + 1000;
                        // LOG(finish_time)
                        // finish_iso = new Date(start_date.getTime() + 1000).toISOString();
                        finish_iso = new Date(start_date.getTime() + finish_time).toISOString();
                       
                 
                    }else{
                        finish_date = new Date(geometry.datetimes[i - 1]).getTime()
                        var finish_time = (start_date.getTime() - finish_date) / 100;
                        finish_iso = start_iso
                        start_iso = new Date(start_date.getTime() - finish_time).toISOString();
                       
                        // var finish_time = new Date(geometry.datetimes[i]).getTime() + 1000;
                        // finish_iso = new Date(finish_time).toISOString();
                    }
                              
                    var v = {};
                    v.id = "polyline_" +feature_id+"_"+ number + "_" + i;
                    v.availability = start_iso + "/" + finish_iso;
                    // v.interval = start_iso
                    var carto = [];
                    var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[i]), this.supersuper.mfCollection.min_max.date, this.supersuper.maxHeight);
                    var polyline_ = geometry.coordinates[i][0];
                    for (var j = 0; j < polyline_.length; j++) {
                        carto.push(polyline_[j][0]);
                        carto.push(polyline_[j][1]);
                        if (this.supersuper.mode == 'STATICMAP') {
                            carto.push(0);
                        }else if(this.supersuper.mode == 'ANIMATEDMAP'){
                            if (polyline_[i][2] != undefined) {
                                carto.push(polyline_[i][2]);
                            } else {
                                carto.push(0);
                            }
                        } else {
                            carto.push(normalize);
                        }
                    }
                    v.polyline = {
                        "positions": {
                            "cartographicDegrees": carto
                        },
                        "perPositionHeight": true,
                        "meterial": {
                            "solidColor": {
                                "color": {
                                    "rgbaf": [1, 0, 0, 1]
                                }
                            }
                        },
                        "width" : 5,
                    };
                    v.polyline.positions.interval = start_iso + "/" + finish_iso;
                    v.polyline.positions.epoch = start_iso
                    czml.push(v);       
                }
            }else{
                for (var i = 0; i < geometry.datetimes.length; i++) {
                    var start_iso = new Date(geometry.datetimes[i]).toISOString();
                    var finish_iso = new Date(geometry.datetimes[i]).toISOString();
                    var v = {};
                    v.id = "polyline_" +feature_id+"_"+ number + "_" + i;
                    v.availability = start_iso + "/" + finish_iso;
                    var carto = [];
                    var normalize = Stinuum.normalizeTime(new Date(geometry.datetimes[i]), this.supersuper.mfCollection.min_max.date, this.supersuper.maxHeight);
                    var polyline_ = geometry.coordinates[i][0];
                    for (var j = 0; j < polyline_.length; j++) {
                        carto.push(polyline_[j][0]);
                        carto.push(polyline_[j][1]);
                        if (this.supersuper.mode == 'STATICMAP') {
                            carto.push(0);
                        }else if(this.supersuper.mode == 'ANIMATEDMAP'){
                            if (polyline_[i][2] != undefined) {
                                carto.push(polyline_[i][2]);
                            } else {
                                carto.push(0);
                            }
                        } else {
                            carto.push(normalize);
                        }
                    }
                    v.polyline = {
                        "positions": {
                            "cartographicDegrees": carto
                        },
                        "perPositionHeight": true,
                        "meterial": {
                            "solidColor": {
                                "color": {
                                    "rgbaf": [1, 0, 0, 1]
                                }
                            }
                        },
                        "width" : 5,
                    };
                    v.polyline.positions.interval = start_iso + "/" + finish_iso;
                    v.polyline.positions.epoch = start_iso
                    czml.push(v);    
                }
            }
           
        }       
    }

    return czml;
}
Stinuum.calculatePathForEachPoint = function (mls) {

    var pre_polyline;
    var coord_arr = mls.coordinates;

    var next_mapping_point_arr = [];
    for (var i = 0; i < coord_arr.length; i++) {
        if (i == 0) {
            pre_polyline = coord_arr[0];
            continue;
        }

        next_mapping_point_arr[i - 1] = Stinuum.findMapping(pre_polyline, coord_arr[i]);

        pre_polyline = coord_arr[i];
    }

    return next_mapping_point_arr;
}

Stinuum.findMapping = function (line_1, line_2) {
    var i = 0,
        j = 0;
    var array = [];
    array.push([line_1[0], line_2[0]]);
    while (i < line_1.length - 1 && j < line_2.length - 1) {
        var point_1 = line_1[i];
        var point_2 = line_2[j];

        var next_point_1 = line_1[i + 1];
        var next_point_2 = line_2[j + 1];

        var dist1 = Stinuum.calculateCarteDist(point_1, next_point_2);
        var dist2 = Stinuum.calculateCarteDist(point_2, next_point_1);

        var triangle = [];
        if (dist1 > dist2) {
            array.push([next_point_1, point_2]);
            i++;
        } else {
            array.push([point_1, next_point_2]);
            j++;
        }
    }

    while (i < line_1.length - 1 || j < line_2.length - 1) {
        var point_1 = line_1[i];
        var point_2 = line_2[j];

        if (i == line_1.length - 1) {
            var next_point = line_2[j + 1];
            array.push([point_1, next_point]);
            j++;
        } else if (j == line_2.length - 1) {
            var next_point = line_1[i + 1];
            array.push([next_point, point_2]);
            i++;
        } else {
            alert("error");
        }
    }
    return array;
}


Stinuum.getCubeIndexFromSample = function (value, deg, min) {
    return Math.floor((value - min) / deg);
}


var SampledProperty = function () {
    this.array = [];
    this.addSample = function (x, y) {
        this.array.push({
            'x': x,
            'y': y
        });
        this.array.sort(function (a, b) {
            var keyA = a.x,
                keyB = b.x;
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });
    };

    this.getValue = function (x) {
        if (x < this.array[0].x) {
            return undefined;
        }
        for (var i = 0; i < this.array.length - 1; i++) {
            if (x >= this.array[i].x && x <= this.array[i + 1].x) {
                var b = this.array[i + 1].y - this.array[i + 1].x * (this.array[i + 1].y - this.array[i].y) / (this.array[i + 1].x - this.array[i].x);
                return (this.array[i + 1].y - this.array[i].y) / (this.array[i + 1].x - this.array[i].x) * x + b;
            }
        }
        return undefined;
    };
}

Stinuum.PathDrawing.prototype.drawMovingPoint = function (options) {
    LOG("drawMovingPoint")
    var geometry = options.temporalGeometry;
    var property = options.temporalProperty;
    var id = options.id;

    var pointCollection = new Cesium.PointPrimitiveCollection();

    var r_color = this.supersuper.mfCollection.getColor(id);

    var data = geometry.coordinates;
    
    var heights = this.supersuper.getListOfHeight(geometry.datetimes);
    var pro_min_max;

    if (property != undefined) pro_min_max = Stinuum.findMinMaxProperties(property);
    for (var i = 0; i < data.length; i++) {
        if (property != undefined) {
            var value = property.values[i];

            var blue_rate = (value - pro_min_max.value[0]) / (pro_min_max.value[1] - pro_min_max.value[0]);
            if (blue_rate < 0.2) {
                blue_rate = 0.2;
            }
            if (blue_rate > 0.9) {
                blue_rate = 0.9;
            }
            r_color = new Cesium.Color(1.0, 1.0 - blue_rate, 0, blue_rate);
        }
        var height = 0;
        if (this.supersuper.mode == 'SPACETIME') {
            height = heights[i];
        } else {
            height = 0;
        }
        pointCollection.add(Stinuum.drawOnePoint(data[i], height, this.supersuper.mode, r_color));
    }
    // if (options.prism_i != undefined){
    //     pointCollection.id= options.prism_i;
    // }else{
    //     pointCollection.id = options.id;
    // }
    pointCollection.id = options.id;
    return pointCollection;
}

Stinuum.PathDrawing.prototype.drawMovingPointCloud = function (options) {
    LOG("drawMovingPointCloud")
    var geometry = options.temporalGeometry;
    var property = options.temporalProperty;
    var id = options.id;

    var pointCollection = new Cesium.PointPrimitiveCollection();

    var r_color = this.supersuper.mfCollection.getColor(id);

    var data = geometry.coordinates;
    
    var heights = this.supersuper.getListOfHeight(geometry.datetimes);
    var pro_min_max;

    if (property != undefined) pro_min_max = Stinuum.findMinMaxProperties(property);
    for (var i = 0; i < data.length; i++){
        var points = data[i][0]
    
        if (property != undefined) {
            var value = property.values[i];

            var blue_rate = (value - pro_min_max.value[0]) / (pro_min_max.value[1] - pro_min_max.value[0]);
            if (blue_rate < 0.2) {
                blue_rate = 0.2;
            }
            if (blue_rate > 0.9) {
                blue_rate = 0.9;
            }
            r_color = new Cesium.Color(1.0, 1.0 - blue_rate, 0, blue_rate);
        }
        for (var j = 0; j < points.length; j++){
            console.log(points[j])
            var height = 0;
            if (this.supersuper.mode == 'SPACETIME') {
                height = heights[i];
            } else {
                height = -1;
            }
            pointCollection.add(Stinuum.drawOnePoint(points[j], height, this.supersuper.mode, r_color));
        }
    }
    // for (var i = 0; i < data.length; i++) {
    //     if (property != undefined) {
    //         var value = property.values[i];

    //         var blue_rate = (value - pro_min_max.value[0]) / (pro_min_max.value[1] - pro_min_max.value[0]);
    //         if (blue_rate < 0.2) {
    //             blue_rate = 0.2;
    //         }
    //         if (blue_rate > 0.9) {
    //             blue_rate = 0.9;
    //         }
    //         r_color = new Cesium.Color(1.0, 1.0 - blue_rate, 0, blue_rate);
    //     }
    //     var height = 0;
    //     if (this.supersuper.mode == 'SPACETIME') {
    //         height = heights[i];
    //     } else {
    //         height = 0;
    //     }
    //     pointCollection.add(Stinuum.drawOnePoint(data[i], height, r_color));
    // }
    
    
    // if (options.prism_i != undefined){
    //     pointCollection.id= options.prism_i;
    // }else{
    //     pointCollection.id = options.id;
    // }
    pointCollection.id = options.id;
    return pointCollection;
}

Stinuum.PathDrawing.prototype.drawMovingLineString = function (options) {
    var geometry = options.temporalGeometry;
    
    var id = options.id;

    var polylineCollection = new Cesium.PolylineCollection();

    var r_color = this.supersuper.mfCollection.getColor(id).withAlpha(0.3);
    var with_height = false;
    var data = geometry;
    var datetimes = geometry.datetimes;
    if (this.supersuper.mode == 'SPACETIME') {
        with_height = true;
        heights = this.supersuper.getListOfHeight(datetimes);
    }
    console.log(this.supersuper.mode)
    for (var i = 0; i < data.coordinates.length; i++) {
        var polyline_list = new Array();
        var points = data.coordinates[i][0];
        for (var j = 0; j < points.length; j++){
            if (with_height){
                polyline_list.push(points[j][0]);
                polyline_list.push(points[j][1]);
                polyline_list.push(heights[i]);
                
            }else{
                if(this.supersuper.mode == 'STATICMAP'){
                    polyline_list.push(points[j][0]);
                    polyline_list.push(points[j][1]);
                    polyline_list.push(0);
                }else{
                    polyline_list.push(points[j][0]);
                    polyline_list.push(points[j][1]);
                    if (points[j][2] != undefined){
                        polyline_list.push(points[j][2]);
                    }else{
                        polyline_list.push(0);
                    }
                    
                }
            }
           
        }
        LOG(polyline_list[0][0])
        polylineCollection.add(Stinuum.drawOneLine(polyline_list, r_color));
      
    }
    //     if (this.supersuper.mode == 'STATICMAP' || this.supersuper.mode == 'ANIMATEDMAP') {
    //         heights[j] = 0;
    //     }
    //     var positions = Stinuum.makeDegreesArray(data.coordinates[j], heights[j]);
    //     polylineCollection.add(Stinuum.drawOneLine(positions, r_color));
    // }
    // if (options.prism_i != undefined){
    //     polylineCollection.id= options.prism_i;
    // }else{
    //     polylineCollection.id = options.id;
    // }
    polylineCollection.id = options.id;
    return polylineCollection;
}

Stinuum.PathDrawing.prototype.drawMovingPolygon = function (options) {
    LOG("drawMovingPolygon")

    var geometry = options.temporalGeometry;

    var property = options.temporalProperty;
    var id = options.id;
    var r_color = this.supersuper.mfCollection.getColor(id).withAlpha(0.3);

    var min_max_date = this.supersuper.mfCollection.min_max.date;
    var coordinates = geometry.coordinates;
    var datetimes = geometry.datetimes;

    var prim;
    // var poly_list = new Array();
    var poly_list = new Array();
    var heights = null;

    var pro_min_max;
    if (property != undefined) pro_min_max = Stinuum.findMinMaxProperties(property);

    var with_height = false;
    if (this.supersuper.mode == 'SPACETIME') {
        with_height = true;
        heights = this.supersuper.getListOfHeight(datetimes);
    }

    for (var i = 0; i < coordinates.length; i++) {
        temp_poly = new Array();
        var io = 0;
        if (property != undefined) {
            // var value = property.values[i];
            var middle_value = (property.values[i] + property.values[i + 1]) / 2;
            var blue_rate = (middle_value - pro_min_max.value[0]) / (pro_min_max.value[1] - pro_min_max.value[0]);
            if (blue_rate < 0.2) {
                blue_rate = 0.2;
            }
            if (blue_rate > 0.9) {
                blue_rate = 0.9;
            }
            r_color = new Cesium.Color(1.0, 1.0 - blue_rate, 0, blue_rate);
        }
        if (!with_height) {
            height = 0;
        } else {
            height = heights[i];
        }
        // poly_list.push(Stinuum.drawOnePolygon(coordinates[i], height, with_height, r_color));
       
     
        for (var j = 0; j < coordinates[i][io].length; j++) {
            // LOG(coordinates[i][io]);
            LOG(coordinates[i][io][j][0], coordinates[i][io][j][1], coordinates[i][io][j][2]);
            // LOG("check")
            if (coordinates[i][io][j][2] != undefined) {
                
                temp_poly.push(coordinates[i][io][j]);

            } else {
                temp_poly.push([coordinates[i][io][j][0], coordinates[i][io][j][1], 0]);
            }

        }
     
        if (with_height){
            geoInstance = Stinuum.drawOnePolygon(temp_poly, heights[i], this.supersuper.mode, r_color);
        }
        else{
            geoInstance = Stinuum.drawOnePolygon(temp_poly, null, this.supersuper.mode, r_color);
        }

        poly_list.push(geoInstance);
    }


    prim = new Cesium.Primitive({
        geometryInstances: poly_list,
        appearance: new Cesium.PerInstanceColorAppearance({})
    });
    // if (options.prism_i != undefined){
    //     prim.id= options.prism_i;
    // }else{
    //     prim.id = options.id;
    // }
    prim.id = options.id;
    return prim;
}

Stinuum.PathDrawing.prototype.drawPathMovingPoint = function (options) {
    LOG("drawPathMovingPoint")
    
    var instances = [];
    var color = this.supersuper.mfCollection.getColor(options.id);

    var data = options.temporalGeometry;
    
    var property = options.temporalProperty;
    var heights = 0;
    if (this.supersuper.mode == 'SPACETIME') {
        heights = this.supersuper.getListOfHeight(data.datetimes, this.supersuper.mfCollection.min_max.date);
    }
    var pro_min_max = null;
    if (property != undefined) {
        pro_min_max = Stinuum.findMinMaxProperties(property);
    }
   
    if (data.interpolation == 'Discrete' || data.datetimes.length == 1) {
   
        return this.drawMovingPoint(options);
    }

    // if (data.interpolation == 'Step' && this.supersuper.mode == 'STATICMAP') {
    //     return this.drawMovingPoint(options);
    // }   
    if (data.interpolation == 'Step') {
        return this.drawMovingPoint(options);
    }
    LOG(heights)
    if (data.coordinates.length == 1) {
        //console.log("one");
    } else {
        if (property == undefined) {
            var positions = Stinuum.makeDegreesArray(data.coordinates, heights, this.supersuper.modes);
            instances.push(Stinuum.drawInstanceOneLine(positions, color));
        } else {
            LOG(property)
            LOG(data.coordinates)
            for (var index = 0; index < data.coordinates.length - 1; index++) {
                var middle_value = (property.values[index] + property.values[index + 1]) / 2;
                LOG(middle_value)
                var blue_rate = (middle_value - pro_min_max.value[0]) / (pro_min_max.value[1] - pro_min_max.value[0]);
                if (blue_rate < 0.2) {
                    blue_rate = 0.2;
                }
                if (blue_rate > 0.9) {
                    blue_rate = 0.9;
                }
                color = new Cesium.Color(1.0, 1.0 - blue_rate, 0, 0.8);

                var positions;
                LOG(data.coordinates)
                if (this.supersuper.mode == 'STATICMAP') {
                   
                    positions = [data.coordinates[index][0], data.coordinates[index][1], 0]
                        .concat([data.coordinates[index+1][0], data.coordinates[index+1][1], 0]);
             
                }else if (this.supersuper.mode == 'ANIMATEDMAP'){
                    if (data.coordinates[index].length == 3){
                        positions = [data.coordinates[index][0], data.coordinates[index][1], data.coordinates[index][2]]
                        .concat([data.coordinates[index+1][0], data.coordinates[index+1][1], data.coordinates[index+1][2]]);
                    }else{
                        positions = [data.coordinates[index][0], data.coordinates[index][1], 0]
                        .concat([data.coordinates[index+1][0], data.coordinates[index+1][1], 0]);
                    }
                  
                }else{
                    positions = [data.coordinates[index][0], data.coordinates[index][1], heights[index]]
                    .concat([data.coordinates[index+1][0], data.coordinates[index+1][1], heights[index+1]]);
                }
                // else {
                //     if (geometry.interpolation == 'Step') {
                //         positions = (data.coordinates[index].concat(heights[index]))
                //             .concat(data.coordinates[index].concat(heights[index + 1]));
                //     } else {
                //         positions =
                //             (data.coordinates[index].concat(heights[index]))
                //             .concat(data.coordinates[index + 1].concat(heights[index + 1]));
                //     }

                // }

                instances.push(Stinuum.drawInstanceOneLine(positions, color));
            }

        }
    }

    

    var prim = new Cesium.Primitive({
        geometryInstances: instances,
        appearance: new Cesium.PolylineColorAppearance(),
        allowPicking: true
    });
    LOG(options.id)
    LOG(prim)
    // prim.id = options.id;
    // if (options.prism_i != undefined){
    //     prim.id= options.prism_i;
    // }else{
    //     prim.id = options.id;
    // }
    prim.id = options.id;
    return prim;

    
}
Stinuum.PathDrawing.prototype.drawPathMovingPointCloud = function (options) {
    var instances = [];
    var color = this.supersuper.mfCollection.getColor(options.id);

    var data = options.temporalGeometry;
    var property = options.temporalProperty;
    var heights = 0;
    if (this.supersuper.mode == 'SPACETIME') {
        heights = this.supersuper.getListOfHeight(data.datetimes, this.supersuper.mfCollection.min_max.date);
    }
    var pro_min_max = null;
    if (property != undefined) {
        pro_min_max = Stinuum.findMinMaxProperties(property);
    }

    return this.drawMovingPointCloud(options);

}

Stinuum.PathDrawing.prototype.drawPathMovingPolygon = function (options) {
    LOG("drawPathMovingPolygon")
    
    var geometry = options.temporalGeometry;
    var property = options.temporalProperty;
    
    var coordinates = geometry.coordinates;
    var datetimes = geometry.datetimes;

    var pro_min_max = null;
    if (property != undefined) {
        pro_min_max = Stinuum.findMinMaxProperties(property);
    }


    var geoInstance;
    var surface = [];
    var typhoon;

    var heights = this.supersuper.getListOfHeight(datetimes);

    var color = this.supersuper.mfCollection.getColor(options.id).withAlpha(0.5);

    if (geometry.interpolation == 'Discrete' || datetimes.length == 1) {
  
        return this.drawMovingPolygon(options);
    }

    // if (geometry.interpolation[0] == 'Step' && this.supersuper.mode == 'STATICMAP') {
    //     return this.drawMovingPolygon(options);
    // }
    if (geometry.interpolation == 'Step'|| datetimes.length == 1){
        return this.drawMovingPolygon(options);
    }
    if (this.supersuper.mode == 'STATICMAP') {
        color = this.supersuper.mfCollection.getColor(options.id).withAlpha(0.2);
    }

    for (var i = 0; i < coordinates.length - 1; i++) {
        var io = 0;
        for (var j = 0; j < coordinates[i][io].length - 1; j++) {
            var temp_poly = new Array();
            var temp_point = new Array();
            var first = coordinates[i][io][j];
            var sec = coordinates[i + 1][io][j];
            var third = coordinates[i + 1][io][j + 1];
            var forth = coordinates[i][io][j + 1];

            if (property != undefined) {
                var middle_value = (property.values[i] + property.values[i + 1]) / 2;
                var blue_rate = (middle_value - pro_min_max.value[0]) / (pro_min_max.value[1] - pro_min_max.value[0]);
                if (blue_rate < 0.2) {
                    blue_rate = 0.2;
                }
                if (blue_rate > 0.9) {
                    blue_rate = 0.9;
                }

                color = new Cesium.Color(1.0, 1.0 - blue_rate, 0, blue_rate);
            }

            if (this.supersuper.mode == 'SPACETIME') {
                if (geometry.interpolation == 'Step') {
                    temp_poly.push([first[0], first[1], heights[i]], [first[0], first[1], heights[i + 1]], [forth[0], forth[1], heights[i + 1]], [forth[0], forth[1], heights[i]]);
                } else {
                    temp_poly.push([first[0], first[1], heights[i]], [sec[0], sec[1], heights[i + 1]], [third[0], third[1], heights[i + 1]], [forth[0], forth[1], heights[i]]);
                }

            } else {
      
                if (first[2] != undefined) {
                    temp_poly.push([first[0], first[1], first[2]], [sec[0], sec[1], sec[2]], [third[0], third[1], third[2]], [forth[0], forth[1], forth[2]]);

                } else {
                    temp_poly.push([first[0], first[1], 0], [sec[0], sec[1], 0], [third[0], third[1], 0], [forth[0], forth[1], 0]);
                }

            }
            
            geoInstance = Stinuum.drawOnePolygon(temp_poly, null, this.supersuper.mode, color);

            surface.push(geoInstance);
        }

    }

    var typhoon = new Cesium.Primitive({
        geometryInstances: surface,
        appearance: new Cesium.PerInstanceColorAppearance()
    });
    // if (options.prism_i != undefined){
    //     typhoon.id= options.prism_i;
    // }else{
    //     typhoon.id = options.id;
    // }
    typhoon.id = options.id;
    return typhoon;

}

Stinuum.PathDrawing.prototype.drawPathMovingLineString = function (options) {
    LOG("drawPathMovingLineString")
    
    var geometry = options.temporalGeometry;
    var property = options.temporalProperty;

    var coordinates = geometry.coordinates;
    var datetimes = geometry.datetimes;

    var pro_min_max = null;
    if (property != undefined) {
        pro_min_max = Stinuum.findMinMaxProperties(property);
    }

    var geoInstance;
    var surface = [];
    var surface_primitive;

    var heights = this.supersuper.getListOfHeight(datetimes);

    var color = this.supersuper.mfCollection.getColor(options.id).withAlpha(0.6);

    if (geometry.interpolation == 'Discrete' || datetimes.length == 1) {
        return this.drawMovingLineString(options);
    }
    if (geometry.interpolation == 'Step') {
        LOG("drawPathMovingLineString : ")
        return this.drawMovingLineString(options);
    }
    //|| this.supersuper.mode == 'ANIMATEDMAP'
    // if (geometry.interpolation == 'Step' && this.supersuper.mode == 'STATICMAP') {
    //     return this.drawMovingLineString(options);
    // }

    if (this.supersuper.mode == 'STATICMAP') {
        color = this.supersuper.mfCollection.getColor(options.id).withAlpha(0.2);
    }

    for (var i = 0; i < coordinates.length - 1; i++) {
        var io = 0;
        for (var j = 0; j < coordinates[i][io].length - 1; j++) {
            var temp_poly = new Array();
            var temp_point = new Array();
            var first = coordinates[i][io][j];
            var sec = coordinates[i + 1][io][j];
            var third = coordinates[i + 1][io][j + 1];
            var forth = coordinates[i][io][j + 1];

            if (property != undefined) {
                var middle_value = (property.values[i] + property.values[i + 1]) / 2;
                var blue_rate = (middle_value - pro_min_max.value[0]) / (pro_min_max.value[1] - pro_min_max.value[0]);
                if (blue_rate < 0.2) {
                    blue_rate = 0.2;
                }
                if (blue_rate > 0.9) {
                    blue_rate = 0.9;
                }

                color = new Cesium.Color(1.0, 1.0 - blue_rate, 0, blue_rate);
            }

            if (this.supersuper.mode == 'SPACETIME') {
                if (geometry.interpolation == 'Step') {
                    temp_poly.push([first[0], first[1], heights[i]], [first[0], first[1], heights[i + 1]], [forth[0], forth[1], heights[i + 1]], [forth[0], forth[1], heights[i]]);
                } else {
                    temp_poly.push([first[0], first[1], heights[i]], [sec[0], sec[1], heights[i + 1]], [third[0], third[1], heights[i + 1]], [forth[0], forth[1], heights[i]]);
                }

            } else {
                if (first[2] != undefined) {
                    temp_poly.push([first[0], first[1], first[2]], [sec[0], sec[1], sec[2]], [third[0], third[1], third[2]], [forth[0], forth[1], forth[2]]);
                } else {
                    temp_poly.push([first[0], first[1], 0], [sec[0], sec[1], 0], [third[0], third[1], 0], [forth[0], forth[1], 0]);
                }

            }

            geoInstance = Stinuum.drawOnePolygon(temp_poly, null, this.supersuper.mode, color);

            surface.push(geoInstance);
        }

    }

    var surface_primitive = new Cesium.Primitive({
        geometryInstances: surface,
        appearance: new Cesium.PerInstanceColorAppearance()
    });
    // if (options.prism_i != undefined){
    //     surface_primitive.id = options.prism_i;
    // }else{
    //     surface_primitive.id = options.id;
    // }
    surface_primitive.id = options.id;
    return surface_primitive;

}

Stinuum.makeDegreesArray = function (pos_2d, height, super_mode) {
    var points = [];
    console.log(pos_2d, height)
    for (var i = 0; i < pos_2d.length; i++) {
        if (Array.isArray(height)) {
            points.push(pos_2d[i][0], pos_2d[i][1], height[i]);
        } else {
            if(super_mode == "STATICMAP") {
                points.push(pos_2d[i][0], pos_2d[i][1], 0);
            }else{
                
                if(pos_2d[i][2] != undefined){
                    points.push(pos_2d[i][0], pos_2d[i][1], pos_2d[i][2]);
                }else{
                    points.push(pos_2d[i][0], pos_2d[i][1], 0);
                }
            }
        }
    }
    return points;
}

Stinuum.drawInstanceOneLine = function (positions, r_color, width = 5) {
    console.log(positions)
    var carte = Cesium.Cartesian3.fromDegreesArrayHeights(positions);
    var polyline = new Cesium.PolylineGeometry({
        positions: carte,
        width: width
    });

    var geoInstance = new Cesium.GeometryInstance({
        geometry: Cesium.PolylineGeometry.createGeometry(polyline),
        attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(r_color)
        }
    });

    return geoInstance;
}

Stinuum.drawOneLine = function (positions, r_color, width = 5) {
    var material = new Cesium.Material.fromType('Color');
    material.uniforms.color = r_color;

    var line = {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
        width: width,
        material: material
    };

    return line;
}

Stinuum.drawOnePoint = function (onePoint, height, mode, r_color) { //it gets one point
    LOG("drawOnePoint")
    
    var pointInstance = new Cesium.PointPrimitive();
    if (height != -1){
        var position = Cesium.Cartesian3.fromDegrees(onePoint[0], onePoint[1], height);
    }else{
        if(mode == "STATICMAP"){
            var position = Cesium.Cartesian3.fromDegrees(onePoint[0], onePoint[1], 0);
        }else{
            if (onePoint[2] != undefined){
                var position = Cesium.Cartesian3.fromDegrees(onePoint[0], onePoint[1], onePoint[2]);
            }else{
                var position = Cesium.Cartesian3.fromDegrees(onePoint[0], onePoint[1], 0);
            }
            
        }
    }
 
    pointInstance.position = position;
    pointInstance.color = r_color;
    pointInstance.pixelSize = 6.0;
    return pointInstance;
}

Stinuum.drawOnePolygon = function (onePolygon, height, super_mode, r_color) { //it gets one polygon
    var coordinates = onePolygon;
    var points = [];
    var position;
    LOG(coordinates.length)
    LOG(coordinates[0][0])
    if (super_mode == "SPACETIME") {
   
        for (var i = 0; i < coordinates.length; i++) {
            
            points.push(coordinates[i][0]);
            points.push(coordinates[i][1]);
            if(height == null){
                points.push(coordinates[i][2]);
            }else{
                points.push(height)
            }
        }
    } else {
        if(super_mode == "STATICMAP"){
            for (var i = 0; i < coordinates.length; i++) {
                
                points.push(coordinates[i][0]);
                points.push(coordinates[i][1]);
                points.push(0);
            }
        }else{
            for (var i = 0; i < coordinates.length; i++) {
                points.push(coordinates[i][0]);
                points.push(coordinates[i][1]);
                if (coordinates[i][2] != undefined){
                    points.push(coordinates[i][2]);
                }else{
                    points.push(0);
                }
            }
        }
       
    }
    LOG(points)
    position = Cesium.Cartesian3.fromDegreesArrayHeights(points);

    var polygonHierarchy = new Cesium.PolygonHierarchy(position);

    var vertexF = new Cesium.VertexFormat({
        position: true,
        st: false,
        normal: true,
        color: true
    });

    var geometry = new Cesium.PolygonGeometry({
        polygonHierarchy: polygonHierarchy,
        vertexFormat: vertexF,
        perPositionHeight: true
    });

    var geoInstance = new Cesium.GeometryInstance({
        geometry: geometry,
        attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(r_color)
        }
    });
    return geoInstance;
}

Stinuum.euclidianDistance2D = function (a, b) {
    var pow1 = Math.pow(a[0] - b[0], 2);
    var pow2 = Math.pow(a[1] - b[1], 2);
    return Math.sqrt(pow1 + pow2);
}

Stinuum.euclidianDistance3D = function (a, b) {
    var pow1 = Math.pow(a[0] - b[0], 2);
    var pow2 = Math.pow(a[1] - b[1], 2);
    var pow3 = Math.pow(a[2] - b[2], 2);
    return Math.sqrt(pow1 + pow2 + pow3);
}

Stinuum.drawOneCube = function (positions, rating = 1.0) {
    var red_rate = 1.0,
        green_rate = 1.9 - rating * 1.9;
    var blue_rate = 0.0;

    if (green_rate > 1.0) {
        green_rate = 1.0;
    }
    var alpha = rating + 0.1;
    if (alpha > 1.0) alpha = 1.0;
    var rating_color = new Cesium.Color(
        red_rate,
        green_rate,
        blue_rate,
        alpha
    );

    var size = Stinuum.calcSidesBoxCoord(positions);

    var geometry = Cesium.BoxGeometry.fromDimensions({
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        dimensions: new Cesium.Cartesian3(size[0], size[1], size[2])
    });

    var position = Cesium.Cartesian3.fromDegrees((positions.minimum.x + positions.maximum.x) / 2, (positions.maximum.y + positions.minimum.y) / 2, (positions.minimum.z + positions.maximum.z) / 2);

    var point3d = new Cesium.Cartesian3(0.0, 0.0, 0.0);
    var translation = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    var matrix = Cesium.Matrix4.multiplyByTranslation(translation, point3d, new Cesium.Matrix4());

    var geo_instance = new Cesium.GeometryInstance({
        geometry: geometry,
        modelMatrix: matrix,
        attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(rating_color)
        }

    });

    return new Cesium.Primitive({
        geometryInstances: geo_instance,
        appearance: new Cesium.PerInstanceColorAppearance({
            translucent: true
        }),
        show: true
    });

}

Stinuum.calcSidesBoxCoord = function (box_coord) {
    var x_dist = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.minimum.z), Cesium.Cartesian3.fromDegrees(box_coord.maximum.x, box_coord.minimum.y, box_coord.minimum.z));
    var y_dist = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.minimum.z), Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.maximum.y, box_coord.minimum.z));
    var z_dist = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.minimum.z), Cesium.Cartesian3.fromDegrees(box_coord.minimum.x, box_coord.minimum.y, box_coord.maximum.z));

    return [x_dist, y_dist, z_dist];
}

/*
// Stinuum.PathDrawing.prototype.drawPathMovingLineString = function(options){
//
//   var trianlgeCollection = new Cesium.PrimitiveCollection();
//
//   var data = options.temporalGeometry;
//   var property = options.temporalProperty;
//
//   var pro_min_max = null;
//   if (property != undefined){
//     pro_min_max = Stinuum.findMinMaxProperties(property);
//   }
//
//   var color = this.supersuper.mfCollection.getColor(options.id).withAlpha(0.7);
//
//   var heights = this.supersuper.getListOfHeight(data.datetimes);
//
//   var coord_arr = data.coordinates;
//   for (var i = 0; i < coord_arr.length ; i++){
//
//     if (i == 0){
//       pre_polyline = coord_arr[0];
//       continue;
//     }
//
//     if (property != undefined){
//       var middle_value = (property.values[i] + property.values[i+1]) / 2;
//       var blue_rate = (middle_value - pro_min_max.value[0]) / (pro_min_max.value[1] - pro_min_max.value[0]);
//       if (blue_rate < 0.2){
//         blue_rate = 0.2;
//       }
//       if (blue_rate > 0.9){
//         blue_rate = 0.9;
//       }
//
//       color = new Cesium.Color(1.0 , 1.0 - blue_rate , 0 , blue_rate);
//     }
//
//     trianlgeCollection.add(this.drawTrinaglesWithNextPos(pre_polyline, coord_arr[i], heights[i-1], heights[i], color));
//
//     pre_polyline = coord_arr[i];
//   }
//
//   return trianlgeCollection;
// }
// Stinuum.PathDrawing.prototype.drawTrinaglesWithNextPos = function(line_1, line_2, height1, height2, color){
//   var instances = [];
//   var i=0,
//   j=0;
//
//   var with_height = (this.supersuper.mode == 'SPACETIME');
//
//   while ( i < line_1.length - 1 && j < line_2.length - 1){
//     var new_color;
//     if (color == undefined){
//       new_color = Cesium.Color.fromRandom({
//         minimumRed : 0.8,
//         minimumBlue : 0.8,
//         minimumGreen : 0.8,
//         alpha : 0.4
//       });
//     }
//     else{
//       new_color = color;
//     }
//
//     var positions = [];
//     var point_1 = line_1[i];
//     var point_2 = line_2[j];
//
//     var next_point_1 = line_1[i+1];
//     var next_point_2 = line_2[j+1];
//
//     point_1.push(height1);
//     positions.push(point_1);
//     point_2.push(height2);
//     positions.push(point_2);
//
//     var dist1 = Stinuum.euclidianDistance2D(point_1, next_point_2);
//     var dist2 = Stinuum.euclidianDistance2D(point_2, next_point_1);
//
//     if (dist1 > dist2){
//       next_point_1.push(height1);
//       positions.push(next_point_1);
//       i++;
//     }
//     else{
//       next_point_2.push(height2);
//       positions.push(next_point_2);
//       j++;
//     }
//     instances.push(Stinuum.drawOnePolygon(positions,null,with_height,new_color));
//   }
//
//   while (i < line_1.length - 1 || j < line_2.length - 1){
//     var new_color;
//     if (color == undefined){
//       new_color = Cesium.Color.fromRandom({
//         minimumRed : 0.6,
//         minimumBlue : 0.0,
//         minimumGreen : 0.0,
//         alpha : 0.4
//       });
//     }
//     else{
//       new_color = color;
//     }
//
//     var positions = [];
//     var point_1 = line_1[i];
//     var point_2 = line_2[j];
//
//     point_1.push(height1);
//     positions.push(point_1);
//     point_2.push(height2);
//     positions.push(point_2);
//
//
//     if (i == line_1.length - 1){
//       var next_point = line_2[j+1];
//       next_point.push(height2);
//       positions.push(next_point);
//       j++;
//     }
//     else if (j == line_2.length - 1){
//       var next_point = line_1[i+1];
//       next_point.push(height1);
//       positions.push(next_point);
//       i++;
//     }
//     else {
//       alert("error");
//     }
//     instances.push(Stinuum.drawOnePolygon(positions,null,with_height,new_color));
//   }
//
//   var temp = new Cesium.Primitive({
//     geometryInstances : instances,
//     appearance : new Cesium.PerInstanceColorAppearance({   }),
//     show : true
//   });
//
//
//   return temp;
//
// }
*/

Stinuum.PropertyGraph.prototype.show = function (propertyName, divID) {
    LOG("show")
    var pro_arr = [];
    for (var i = 0; i < this.super.mfCollection.features.length; i++) {
        var pair = this.super.mfCollection.features[i];
        
        var property;
        // if (pair.type == "MovingGeometryCollection"){
        //     for (var prism_i = 0; prism_i < pair.prisms.length; prism_i++){
        //         property = Stinuum.getPropertyByName(pair.prisms[prism_i], propertyName, pair.id);
        //     }
        // }else{}
        property = Stinuum.getPropertyByName(pair.feature, propertyName, pair.id);
        if(pair.feature.temporalGeometry.type == "MovingGeometryCollection"){
            if (property != -1) {
                for(var i = 0; i < property.length; i++){
                    pro_arr.push(property[i]);
                }
              
            }
        }else{
            if (property != -1) {
               
                pro_arr.push(property);
                
              
            }
        }

    }
    // if (pro_arr.length == 0){
    //   return -1;
    // }
    console.log(propertyName, pro_arr, divID)
    if (divID == 'graph'){
        this.showPropertyArray(propertyName, pro_arr, divID);
    }else if(divID == 'image'){
        console.log(propertyName, pro_arr, divID)
    }

    
}

Stinuum.PropertyGraph.prototype.compare = function (left, right, div_id) {
    let arr = [{
            'name': left,
            'values': []
        },
        {
            'name': right,
            'values': []
        },
    ];
    for (let i = 0; i < this.super.mfCollection.features.length; i++) {
       
        for (let j = 0; j < arr.length; j++) {
            let property = Stinuum.getPropertyByName(pair.feature, arr[j]['name'], pair.id);
            if (property != -1) {
                arr[j]['values'].push(property);
            }
        }
    }
    this.showComapreArray(arr, div_id);
}

Stinuum.PropertyGraph.prototype.showPropertyArray = function (propertyName, array, div_id) {

    LOG("showPropertyArray")
    document.getElementById(div_id).innerHTML = '';
    console.log(propertyName)
    //if put empty array.
    if (array == undefined || array.length == 0) {
        return;
    }


    var name_arr = [];
    var object_arr = [];
    var propertyGraph = this;

    for (var i = 0; i < array.length; i++) {
        object_arr.push(array[i][0]);
        name_arr.push(array[i][1]);
    }
    LOG("here start")
    LOG(array, object_arr, name_arr)
  
    var min_max = Stinuum.findMinMaxProperties(object_arr);

    var svg = d3.select("#" + div_id).append("svg");
    svg.attr("width", $("#" + div_id).width());
    svg.attr("height", $("#" + div_id).height());

    var margin = {
            top: 10,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = $("#" + div_id).width() - margin.left - margin.right,
        height = $("#" + div_id).height() - margin.top - margin.bottom;
    var maxDivheight = $("#" + div_id).height()
    LOG(width, height)

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + " )")
        .attr("width", width)
        .attr("height", height);
    //        .style("font-size","small");
    
    
    var x = d3.scaleTime()
    .rangeRound([0, width]);
    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

        
    x.domain(min_max.date);
    var y_axis;
  
 
    var dataSet = []
    if (object_arr[0].form != undefined) {
        $.ajax({
            url: '/js/mf-cesium/practice/data_symbol.csv',
            async: false,
            dataType: 'text',
            success: function successFunction(data) {
                console.log(data)
                var allRows = data.split(/\r?\n|\r/);

                for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
                    var rowCells = allRows[singleRow].split(',');

                    for (var rowCell = 0; rowCell < rowCells.length - 1; rowCell++) {

                        if (rowCells[rowCell] == object_arr[0].form) {
                            tempSet = {};
                            tempSet.code = rowCells[rowCell];
                            tempSet.symbol = rowCells[rowCell + 1];
                            dataSet.push(tempSet)
                            break;
                        }
                    }
                }
            }
        });
    }
    console.log(dataSet)
    if (dataSet.length != 0) {
        symbolValue= "(" + dataSet[0].symbol + ")"
    
    }else{
        symbolValue = ""
    }
    if (typeof(min_max.value[0]) == "string"){
        y.domain([0, min_max.value.length - 1]);
        // var colorBox = d3.scaleOrdinal().domain(min_max.value).range(d3.schemeSet2);
        // console.log(colorBox)
        var colorBox = new Array()
        for(var i in min_max.value){
            var color_1 = this.super.mfCollection.getRandomColor();
            var r_color_1 = d3.rgb(color_1.red * 255, color_1.green * 255, color_1.blue * 255);
            colorBox.push(r_color_1)
        }
        console.log(height, maxDivheight)
        y_axis = g.append("g");
        y_axis
            .attr("class", "axis")
            // .call(d3.axisLeft(y))
            // .append("text")
            .attr("fill", '#000')
            .attr("transform", "rotate(-90)")
            //    .style("font-size","small")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            svg.selectAll("mydots")
                .data(min_max.value)
                .enter()
                .append("circle")
                .attr("cx", 10)
                .attr("cy", function(d,i){ return 10 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 7)
                .style("fill", function(d){ return colorBox[min_max.value.indexOf(d)]})
            svg.selectAll("mylabels")
                .data(min_max.value)
                .enter()
                .append("text")
                .attr("x", 20)
                .attr("y", function(d,i){ return 10 + i*25})              
                .attr("fill", function(d){ return colorBox[min_max.value.indexOf(d)]})
                .text(function(d){ return d})

    }else{
        y.domain(min_max.value);
        y_axis = g.append("g");
        y_axis
            .attr("class", "axis")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", '#000')
            .attr("transform", "rotate(-90)")
            //    .style("font-size","small")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text(propertyName + symbolValue);
    }
       
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axis")
    
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();

    var line = d3.line()
        .x(function (d) {
            return x(d.date)
        })
        .y(function (d) {
            return y(d.value)
        });
    var check_interpolation = true
    LOG(min_max.date,min_max.date[0].getTime(), min_max.date[1].getTime(),min_max.date[0].getTime() == min_max.date[1].getTime() )
    if (min_max.date[0].getTime() == min_max.date[1].getTime()){
        check_interpolation = false
    }
    for (var id = 0; id < object_arr.length; id++) {
        var data = [];

        var object = object_arr[id];
        var object_interpolation = (check_interpolation ? object.interpolation : 'Discrete')
        
        LOG(id, object, object_interpolation)
        

        for (var i = 0; i < object.datetimes.length; i++) {
            var comp = {};
            var da = new Date(object.datetimes[i]).toISOString();
            if (object_interpolation == 'Regression') {
                comp.date_i = i + 1
            }
            if (object.type == 'Text') {
                // comp.date_i = i + 1
                comp.value_i = (min_max.value).indexOf(object.values[i])
            }
            comp.date = new Date(object.datetimes[i]); //dateparse(da);
            comp.value = object.values[i];

            data.push(comp);
        }
        var color = this.super.mfCollection.getColor(name_arr[id]);
        var r_color = d3.rgb(color.red * 255, color.green * 255, color.blue * 255);
     
        if (object_interpolation == 'Linear') {
            line.curve(d3.curveLinear);
        } else if (object_interpolation == 'Step') {
            if (object.type == "Text") {
                for (var i = 0; i < data.length; i++) {
                    g.selectAll("circle" + id)
                        .data(data)
                        .enter()
                        .append("circle")
                        .attr("cx", function (d, i) {

                            return x(d.date);
                        })
                        .attr("cy", function (d, i) {
                          
                            return y(d.value_i);
                        })
                        .attr("r", 5)
                        .style("fill", function (d, i) {
                            return colorBox[d.value_i];
                        });
                }
                var line = d3.line()
                .x(function (d) {
                    return x(d.date)
                })
                .y(function (d) {
                    return y(d.value_i)
                });
                line.curve(d3.curveStepAfter);
            }else{
                line.curve(d3.curveStepAfter);
            }
            
        }

        if (object_interpolation == 'Discrete') {
            //HERE Discrete
            if (object.type == "Text") {
                for (var i = 0; i < data.length; i++) {
                    g.selectAll("circle" + id)
                        .data(data)
                        .enter()
                        .append("circle")
                        .attr("cx", function (d, i) {

                            return x(d.date);
                        })
                        .attr("cy", function (d, i) {
                          
                            return y(d.value_i);
                        })
                        .attr("r", 5)
                        .style("fill", function (d, i) {
                            return colorBox[d.value_i];
                        });
                }
            } else {
                for (var i = 0; i < data.length; i++) {
                    g.selectAll("circle" + id)
                        .data(data)
                        .enter()
                        .append("circle")
                        .attr("cx", function (d, i) {

                            return x(d.date);
                        })
                        .attr("cy", function (d, i) {
                            return y(d.value);
                        })
                        .attr("r", 5)
                        .style("fill", r_color);
                }
            }
        } else if (object_interpolation == 'Regression') {


            var lg = calcLinear(data, "x", "y", d3.max(data, function (d) {
                return d.date_i
            }), d3.min(data, function (d) {
                return d.date_i
            }), d3.min(data, function (d) {
                return d.value
            }));
            LOG(data[lg.ptA.x - 1].date)

            g.append("line")
                .attr("stroke", r_color)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 3)
                .attr("x1", x(data[lg.ptA.x - 1].date))
                .attr("y1", y(lg.ptA.y))
                .attr("x2", x(data[lg.ptB.x - 1].date))
                .attr("y2", y(lg.ptB.y));
            for (var i = 0; i < data.length; i++) {
                g.selectAll(".point")
                    .data(data)
                    .enter().append("circle")
                    .attr("r", 3)
                    .attr("cy", function (d, i) {
                        return y(d.value);
                    })
                    .attr("cx", function (d, i) {
                        return x(d.date);
                    })
                    .style("fill", r_color);
            }
        } else {
            LOG(line)
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
    var rect;

    function types(d) {
        LOG("hi")
        d.x = +d.x;
        d.y = +d.y;

        return d;
    }

    function calcLinear(data, x, y, maxX, minX, minY) {

        var n = data.length;
        LOG(data)
        var pts = [];
        for (var i = 0; i < data.length; i++) {
            var obj = {};

            obj.x = data[i].date_i;
            obj.y = data[i].value;
            obj.mult = obj.x * obj.y;
            pts.push(obj);
        }

        var sum = 0;
        var xSum = 0;
        var ySum = 0;
        var sumSq = 0;
        pts.forEach(function (pt) {
            sum = sum + pt.mult;
            xSum = xSum + pt.x;
            ySum = ySum + pt.y;
            sumSq = sumSq + (pt.x * pt.x);
        });
        var a = sum * n;
        var b = xSum * ySum;
        var c = sumSq * n;
        var d = xSum * xSum;

        var m = (a - b) / (c - d);
        var e = ySum;

        var f = m * xSum;
        var b = (e - f) / n;
        var tempY = m * maxX + b
        LOG(tempY)
        return {
            ptA: {
                x: minX,
                y: m * minX + b
            },
            ptB: {
                y: tempY,
                x: maxX
            }
        }
    }

    function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        start_coord = d3.mouse(this);

        rect = svg.append("rect")
            .attr("fill", d3.rgb(0, 0, 0, 0.5));

        if (start_coord[0] - margin.right <= 0) {
            return;
        }
        
        var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");
        /**
         * d3.js time format
         * we need to change UTC time to ISO
         */
        // LOG("START", start_coord[0] )
        // LOG(start_coord[0] - 51.09, x.invert(start_coord[0] - 51.09))
        // viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date(formatDate(x.invert(start_coord[0] - 51.09))));
        viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date(formatDate(x.invert(start_coord[0] - 51.09))));
        LOG(Cesium.JulianDate.fromDate(new Date(formatDate(x.invert(start_coord[0] - 51.09)))));
        // viewer.clock.currentTime = x.invert(start_coord[0] - 51.09);
        // LOG(x.invert(start_coord[0] - 102.18))
        viewer.clock.shouldAnimate = false;
        //    //console.log(rect);
        //  //console.log(start_coord);
        // d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
        d3.select(this).classed("dragging", true);
    }

    function dragged(d) {
        var coord = d3.mouse(this);

        if (coord[0] > start_coord[0]) {
            rect.attr("width", Math.abs(coord[0] - start_coord[0]));
            rect.attr("height", height + margin.bottom);
            rect.attr("x", start_coord[0]);
        } else {
            rect.attr("width", Math.abs(coord[0] - start_coord[0]));
            rect.attr("height", height + margin.bottom);
            rect.attr("x", coord[0]);
        }


    }

    function dragended(d) {
        // //console.log(d)
        d3.select(this).classed("dragging", false);
        var end_coord = d3.mouse(this);
        var formatDate = d3.timeFormat("%Y-%m-%dT%H:%M:%S");
        // //console.log(start_coord, end_coord);
        var start_date, end_date;
        // LOG("END")
        // LOG(end_coord[0] - 51.09, x.invert(end_coord[0] - 51.09))
        // LOG(start_coord[0] - 51.09, x.invert(start_coord[0] - 51.09))
        if (end_coord[0] > start_coord[0]) {
            start_date = formatDate(x.invert(start_coord[0] - 51.09));
            end_date = formatDate(x.invert(end_coord[0] - 51.09));
            start_date1 = formatDate(x.invert(start_coord[0] - 51.09));
            end_date1 = formatDate(x.invert(end_coord[0] - 51.09));
            if (end_coord[0] - start_coord[0] < 100) {
                rect.remove();
                return;
            }
        } else {
            if (start_coord[0] - end_coord[0] < 100) {
                rect.remove();
                return;
            }
            start_date = formatDate(x.invert(end_coord[0] - 51.09));
            end_date = formatDate(x.invert(start_coord[0] - 51.09));
            start_date1 = formatDate(x.invert(end_coord[0] - 51.09));
            end_date1 = formatDate(x.invert(start_coord[0] - 51.09));
        }
        LOG("show date value")

        LOG(start_coord[0],end_coord[0]);
        LOG(start_date,end_date);
        LOG(start_date1,end_date1);
        
        LOG(new Date(start_date).toISOString(), new Date(end_date).toISOString());
        propertyGraph.super.queryProcessor.queryByTime(new Date(start_date), new Date(end_date));
        propertyGraph.super.geometryViewer.update();
        propertyGraph.show(propertyName, div_id);
        rect.remove();
    }
}

Stinuum.PropertyGraph.prototype.showComapreArray = function (arr, div_id) {
    LOG("showComapreArray")
    document.getElementById(div_id).innerHTML = '';

    //if put empty array.
    if (arr == undefined || arr[0]['values'] == 0) {
        return;
    }

    var name_arr = [];
    var object_arr = [];
    var propertyGraph = this;


    for (var i = 0; i < arr[0]['values'].length; i++) {
        object_arr.push(arr[0]['values'][i][0]);
        name_arr.push(arr[0]['values'][i][1]);
    }

    // RIGHT
    let name_arr_right = [];
    let object_arr_right = [];
    for (let i = 0; i < arr[1]['values'].length; i++) {
        object_arr_right.push(arr[1]['values'][i][0]);
        name_arr_right.push(arr[1]['values'][i][1]);
    }

    var min_max = Stinuum.findMinMaxProperties(object_arr);
    // RIGHT
    let min_max_right = Stinuum.findMinMaxProperties(object_arr_right);

    var svg = d3.select("#" + div_id).append("svg");
    svg.attr("width", $("#" + div_id).width());
    svg.attr("height", $("#" + div_id).height());

    var margin = {
            top: 10,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = $("#" + div_id).width() - margin.left - margin.right - 20, // RIGHT Y AXIS
        height = $("#" + div_id).height() - margin.top - margin.bottom;

    LOG(object_arr)
    LOG(object_arr_right)
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + " )")
        .attr("width", width)
        .attr("height", height);
    //        .style("font-size","small");

    var x = d3.scaleTime().rangeRound([0, width]);
    var y = d3.scaleLinear().rangeRound([height, 0]);
    // RIGHT
    let y_right = d3.scaleLinear().rangeRound([height, 0]);


    var line = d3.line()
        .x(function (d) {
            return x(d.date)
        })
        .y(function (d) {
            return y(d.value)
        });

    var line_right = d3.line()
        .x(function (d) {
            return x(d.date)
        })
        .y(function (d) {
            return y_right(d.value)
        });

    x.domain(min_max.date);
    y.domain(min_max.value);
    // RIGHT
    y_right.domain(min_max_right.value);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "axis")
        //  .style("font-size","small")
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();

    var dataSet_1 = []
    var dataSet_2 = []
    if (object_arr[0].form == undefined) {
        $.ajax({
            url: 'data_symbol.csv',
            async: false,
            dataType: 'text',
            success: function successFunction(data) {
                var allRows = data.split(/\r?\n|\r/);

                for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
                    var rowCells = allRows[singleRow].split(',');

                    for (var rowCell = 0; rowCell < rowCells.length - 1; rowCell++) {

                        if (rowCells[rowCell] == object_arr[0].form) {
                            tempSet = {};
                            tempSet.code = rowCells[rowCell];
                            tempSet.symbol = rowCells[rowCell + 1];
                            dataSet_1.push(tempSet)
                            break;
                        }
                    }
                }
            }
        });
        if (dataSet_1.length >= 1) {
            object_arr[0].form = dataSet_1[0].symbol
        }
        var y_axis = g.append("g");
        y_axis
            .attr("class", "axis")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", '#000')
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
    } else {
        var y_axis = g.append("g");
        y_axis
            .attr("class", "axis")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", '#000')
            .attr("transform", "rotate(-90)")
            //    .style("font-size","small")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text(arr[0]['name'] + "(" + object_arr[0].form + ")");
    }
    // //console.log(object_arr);

    // RIGHT
    if (object_arr_right[0].form == undefined) {
        $.ajax({
            url: 'data_symbol.csv',
            async: false,
            dataType: 'text',
            success: function successFunction(data) {
                var allRows = data.split(/\r?\n|\r/);

                for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
                    var rowCells = allRows[singleRow].split(',');

                    for (var rowCell = 0; rowCell < rowCells.length - 1; rowCell++) {

                        if (rowCells[rowCell] == object_arr_right[0].form) {
                            tempSet = {};
                            tempSet.code = rowCells[rowCell];
                            tempSet.symbol = rowCells[rowCell + 1];
                            dataSet_2.push(tempSet)
                            break;
                        }
                    }
                }
            }
        });
        if (dataSet_2.length >= 1) {
            object_arr[0].form = dataSet_2[0].symbol
        }
        let y_axis = g.append("g");
        y_axis
            .attr("class", "y axis")
            .call(d3.axisRight(y_right))
            .attr("transform", "translate(" + width + ",0)")
            .append("text")
            .attr("fill", '#000')
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
    } else {
        let y_axis = g.append("g");
        y_axis
            .attr("class", "y axis")
            .attr("transform", "translate(" + width + ",0)")
            .call(d3.axisRight(y_right))
            .append("text")
            .attr("fill", '#000')
            .attr("transform", "rotate(-90)")
            //    .style("font-size","small")
            .attr("y", -12)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text(arr[1]['name'] + "(" + object_arr_right[0].form + ")");
    }
    //console.log(object_arr_right);

    // var graph_data = [];
    for (var id = 0; id < object_arr.length; id++) {
        var data = [];
        var object = object_arr[id];
        for (var i = 0; i < object.datetimes.length; i++) {
            var comp = {};
            var da = new Date(object.datetimes[i]).toISOString();
            if (object.interpolation == 'Regression') {
                comp.date_i = i + 1
            }
            comp.date = new Date(object.datetimes[i]); //dateparse(da);
            comp.value = object.values[i];
            data.push(comp);
        }
        if (object.interpolation == 'Linear') {
            line.curve(d3.curveLinear);
        } else if (object.interpolation == 'Step') {
            line.curve(d3.curveStepAfter);
        }

        var color = this.super.mfCollection.getColor(name_arr[id]);
        var r_color = d3.rgb(color.red * 255, color.green * 255, color.blue * 255);
        //let r_color = d3.rgb(200, 200, 200);
        // graph_data.push(data);
        if (object.interpolation == 'Discrete') {
            for (var i = 0; i < data.length; i++) {
                g.selectAll("circle")
                // g.append("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d, i) {
                        LOG(d)
                        return x(d.date);
                    })
                    .attr("cy", function (d, i) {
                        return y(d.value);
                    })
                    .attr("r", 10)
                    .style("fill", r_color);
            }
        } else if (object.interpolation == 'Regression') {

            var lg = calcLinear(data, "x", "y", d3.max(data, function (d) {
                return d.date_i
            }), d3.min(data, function (d) {
                return d.date_i
            }), d3.min(data, function (d) {
                return d.value
            }));
            LOG(data[lg.ptA.x - 1].date)

            g.append("line")
                .attr("stroke", r_color)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 3)
                .attr("x1", x(data[lg.ptA.x - 1].date))
                .attr("y1", y(lg.ptA.y))
                .attr("x2", x(data[lg.ptB.x - 1].date))
                .attr("y2", y(lg.ptB.y));
            for (var i = 0; i < data.length; i++) {
                g.selectAll(".point")
                    .data(data)
                    .enter().append("circle")
                    .attr("r", 3)
                    .attr("cy", function (d, i) {
                        return y(d.value);
                    })
                    .attr("cx", function (d, i) {
                        return x(d.date);
                    })
                    .style("fill", r_color);
            }
        } else {
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

    // RIGTH
    for (let id = 0; id < object_arr_right.length; id++) {
        let data = [];
        let object = object_arr_right[id];
        for (let i = 0; i < object.datetimes.length; i++) {
            let comp = {};
            let da = new Date(object.datetimes[i]).toISOString();
            if (object.interpolation == 'Regression') {
                comp.date_i = i + 1
            }
            comp.date = new Date(object.datetimes[i]); //dateparse(da);
            comp.value = object.values[i];
            data.push(comp);
        }
        if (object.interpolation == 'Linear') {
            line.curve(d3.curveLinear);
        } else if (object.interpolation == 'Step') {
            line.curve(d3.curveStepAfter);
        }


        //var color = this.super.mfCollection.getColor(name_arr_right[id]);
        //var r_color = d3.rgb(color.red * 255, color.green * 255, color.blue * 255, 0.9);
        let r_color = d3.rgb(200, 200, 200);
        //graph_data.push(data);
        if (object.interpolation == 'Discrete') {
            for (var i = 0; i < data.length; i++) {
                g.selectAll("circle")
                // g.append("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d, i) {
                        return x(d.date);
                    })
                    .attr("cy", function (d, i) {
                        return y_right(d.value);
                    })
                    .attr("r", 10)
                    .style("fill", r_color);
            }
        } else if (object.interpolation == 'Regression') {


            //        y.domain(d3.extent(data, function(d){ return d.value}));
            //	      x.domain(d3.extent(data, function(d){ return d.date_i}));
            //	      x.domain(d3.extent(data, function(d){ return d.date}));
            var lg = calcLinear(data, "x", "y", d3.max(data, function (d) {
                return d.date_i
            }), d3.min(data, function (d) {
                return d.date_i
            }), d3.min(data, function (d) {
                return d.value
            }));
            LOG(data[lg.ptA.x - 1].date)

            g.append("line")
                .attr("stroke", r_color)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 3)
                .attr("x1", x(data[lg.ptA.x - 1].date))
                .attr("y1", y(lg.ptA.y))
                .attr("x2", x(data[lg.ptB.x - 1].date))
                .attr("y2", y(lg.ptB.y));
            for (var i = 0; i < data.length; i++) {
                g.selectAll(".point")
                    .data(data)
                    .enter().append("circle")
                    .attr("r", 3)
                    .attr("cy", function (d, i) {
                        return y(d.value);
                    })
                    .attr("cx", function (d, i) {
                        return x(d.date);
                    })
                    .style("fill", r_color);
            }
        } else {
            g.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", r_color)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 3)
                .attr("d", line_right);
        }
    }

    var drag = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    svg.call(drag);

    var start_coord;
    var rect;

    function types(d) {
        LOG("hi")
        d.x = +d.x;
        d.y = +d.y;

        return d;
    }

    function calcLinear(data, x, y, maxX, minX, minY) {

        var n = data.length;
        LOG(data)
        var pts = [];
        for (var i = 0; i < data.length; i++) {
            var obj = {};

            obj.x = data[i].date_i;
            obj.y = data[i].value;
            obj.mult = obj.x * obj.y;
            pts.push(obj);
        }

        var sum = 0;
        var xSum = 0;
        var ySum = 0;
        var sumSq = 0;
        pts.forEach(function (pt) {
            sum = sum + pt.mult;
            xSum = xSum + pt.x;
            ySum = ySum + pt.y;
            sumSq = sumSq + (pt.x * pt.x);
        });
        var a = sum * n;
        var b = xSum * ySum;
        var c = sumSq * n;
        var d = xSum * xSum;

        var m = (a - b) / (c - d);
        var e = ySum;

        var f = m * xSum;
        var b = (e - f) / n;
        var tempY = m * maxX + b
        LOG(tempY)
        return {
            ptA: {
                x: minX,
                y: m * minX + b
            },
            ptB: {
                y: tempY,
                x: maxX
            }
        }
    }

    function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        start_coord = d3.mouse(this);
        rect = svg.append("rect")
            .attr("fill", d3.rgb(0, 0, 0, 0.5));

        if (start_coord[0] - margin.right <= 0) {
            return;
        }
        // var formatDate = d3.timeFormat("%Y-%m-%d %H:%M:%S");
          /**
         * d3.js time format
         * we need to change UTC time to ISO
         */
        // viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date(formatDate(x.invert(start_coord[0] - 51.09))));
        viewer.clock.currentTime = x.invert(start_coord[0] - 51.09);
        viewer.clock.shouldAnimate = false;
        //    //console.log(rect);
        //  //console.log(start_coord);
        //d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
        d3.select(this).classed("dragging", true);
    }

    function dragged(d) {
        var coord = d3.mouse(this);

        if (coord[0] > start_coord[0]) {
            rect.attr("width", Math.abs(coord[0] - start_coord[0]));
            rect.attr("height", height + margin.bottom);
            rect.attr("x", start_coord[0]);
        } else {
            rect.attr("width", Math.abs(coord[0] - start_coord[0]));
            rect.attr("height", height + margin.bottom);
            rect.attr("x", coord[0]);
        }

    }

    function dragended(d) {
        d3.select(this).classed("dragging", false);
        var end_coord = d3.mouse(this);
        var formatDate = d3.timeFormat("%Y-%m-%dT%H:%M:%SZ");
        //console.log(start_coord, end_coord);
        var start_date, end_date;
        if (end_coord[0] > start_coord[0]) {
            start_date = formatDate(x.invert(start_coord[0] - 51.09));
            end_date = formatDate(x.invert(end_coord[0] - 51.09));
            if (end_coord[0] - start_coord[0] < 100) {
              rect.remove();
              return;
            }
        }
        else {
            if (start_coord[0] - end_coord[0] < 100) {
                rect.remove();
                return;
            }
    
            start_date = formatDate(x.invert(end_coord[0] - 51.09));
            end_date = formatDate(x.invert(start_coord[0] - 51.09));
        }
        LOG(start_date,end_date);
        LOG(new Date(start_date), new Date(end_date));
        propertyGraph.super.queryProcessor.queryByTime(start_date, end_date);
        propertyGraph.super.geometryViewer.update();
        propertyGraph.show(propertyName, div_id);
        rect.remove();
        // if (end_coord[0] > start_coord[0]) {
        //     // start_date = formatDate(x.invert(start_coord[0] - 51.09));
        //     // end_date = formatDate(x.invert(end_coord[0] - 51.09));
        //     start_date = x.invert(start_coord[0] - 51.09);
        //     end_date = x.invert(end_coord[0] - 51.09);
        //     if (end_coord[0] - start_coord[0] < 100) {
        //         rect.remove();
        //         return;
        //     }
        // } else {
        
        //     if (start_coord[0] - end_coord[0] < 100) {
        //         rect.remove();
        //         return;
        //     }

        //     start_date = x.invert(end_coord[0] - 51.09);
        //     end_date = x.invert(start_coord[0] - 51.09);
        // }
        // LOG("date value")
        // LOG(formatDate(start_date), formatDate(end_date));
        // LOG(new Date(start_date), new Date(end_date));
        // propertyGraph.super.queryProcessor.queryByTime(new Date(start_date), new Date(end_date));
        // propertyGraph.super.geometryViewer.update();
        // propertyGraph.show(propertyName, div_id);
        // rect.remove();
    }
}


//TODO : support multiple query. 
// Stinuum.QueryProcessor.prototype.queryBySpatioTime = function (source_id_arr, target_id) {
//     LOG("queryBySpatioTime")
//     if (!this.super.s_query_on) {
//         this.super.s_query_on = true;
//         this.super.mfCollection.hideAll();
//         this.result_pairs = [];
//     } else {
//         LOG("its already query mode");
//         return;
//     }

//     if (!Array.isArray(source_id_arr)) source_id_arr = [source_id_arr];
//     var result = [];
//     for (var i = 0; i < source_id_arr.length; i++) {
//         var source = this.super.mfCollection.getMFPairByIdinWhole(source_id_arr[i]);
//         var target = this.super.mfCollection.getMFPairByIdinWhole(target_id);
//         if (source == -1 || target == -1) {
//             continue;
//         }
//         source = source.feature;
//         target = target.feature;

//         var new_target = this.makeQueryResultBySpatioTime(source, target);
//         if (new_target != -1) { //Not Intersect (different time stamp)
//             result.push(new_target);
//             result.push(source);
//         }
//     }

//     for (var i = 0; i < result.length; i++) {
//         var pair = new Stinuum.MFPair(result[i].properties.name, result[i]);
//         if (result[i].temporalGeometry.datetimes.length == 0) continue;
//         this.result_pairs.push(pair);
//         this.super.mfCollection.features.push(pair);
//     }
// }

Stinuum.QueryProcessor.prototype.makeQueryResultBySpatioTime = function (source, p_target) {
    target = Stinuum.copyObj(p_target);
    LOG(source, p_target);
    if (source.temporalGeometry == undefined || target.temporalGeometry == undefined) {
        LOG(source, target);
        throw new Error("temporalGeometry is undefined, query_processor, makeQueryResultBySpatioTime");
    }
    if (source.temporalGeometry.type == "MovingPolygon" && target.temporalGeometry.type == "MovingPoint") { //Polygon Point 

    }
    //Polygon Polygon
    else if (source.temporalGeometry.type == "MovingPolygon" && target.temporalGeometry.type == "MovingPolygon") {
        throw new Stinuum.Exception("TODO polygon polygon", source);
    }
    //Point Polygon
    else if (source.temporalGeometry.type == "MovingPoint" && target.temporalGeometry.type == "MovingPolygon") {
        throw new Stinuum.Exception("TODO point polygon", source);
    } else {
        throw new Stinuum.Exception("point and point OR the others cannot be quried");
    }

    var sample_arr = Stinuum.getSampleProperties_Polygon(source.temporalGeometry);
    var t_geometry = target.temporalGeometry;
    var source_time_minmax = Stinuum.findMinMaxTime(source.temporalGeometry.datetimes);
    var target_time_minmax = Stinuum.findMinMaxTime(target.temporalGeometry.datetimes);
    if (source_time_minmax[0].getTime() > target_time_minmax[1].getTime() ||
        source_time_minmax[1].getTime() < target_time_minmax[0].getTime()) {
        return -1;
    }
    var removed_indexes = [];
    for (var i = 0; i < t_geometry.datetimes.length; i++) {
        var coord = t_geometry.coordinates[i];
        var polygon_coords = [];
        for (var node = 0; node < sample_arr.length; node++) {
            var time = Cesium.JulianDate.fromDate(new Date(t_geometry.datetimes[i]));
            var sample_coord = sample_arr[node].getValue(time);
            if (sample_coord == undefined) {
                break;
            }
            polygon_coords.push([Cesium.Math.DEGREES_PER_RADIAN * (Cesium.Cartographic.fromCartesian(sample_coord).longitude),
                Cesium.Math.DEGREES_PER_RADIAN * (Cesium.Cartographic.fromCartesian(sample_coord).latitude)
            ]);
        }
        Stinuum.QueryProcessor.moveToRelativeCoords(coord, polygon_coords);
        if (polygon_coords.length != sample_arr.length) {
            removed_indexes.push(i);
        } else if (!Stinuum.QueryProcessor.isPointInPolygon(coord, polygon_coords)) {
            removed_indexes.push(i);
        } else { //intersect..
        }

    }

    if (removed_indexes.length == t_geometry.datetimes.length) return -1;

    for (var i = removed_indexes.length - 1; i >= 0; i--) {
        Stinuum.spliceElementInMovingPointByIndex(target, removed_indexes[i]);
    }
    LOG(target);

    return target;
}

Stinuum.QueryProcessor.moveToRelativeCoords = function (point, polygon) {
    var isChanged = false;
    for (var i = 0; i < polygon.length - 1; i++) {
        if (Math.abs(polygon[i][0] - polygon[i + 1][0]) > 180) {
            isChanged = true;
        }
    }
    if (isChanged) {
        for (var i = 0; i < polygon.length; i++) {
            if (polygon[i][0] < 0) {
                polygon[i][0] = 180 + (180 + polygon[i][0]);
            }
        }
        if (point[0] < 0) {
            var new_point = [point[0] + 360, point[1]];
            point = new_point;
        }
    }
}

Stinuum.QueryProcessor.isPointInPolygon = function (point, polygon) {

    var virtual_line = [point, [180, 0]];
    var intersect_num = 0;
    for (var i = 0; i < polygon.length - 1; i++) {
        var line = [polygon[i], polygon[i + 1]];
        var intersect = Stinuum.QueryProcessor.do_intersect_lines(virtual_line, line);
        if (intersect == 1) {
            intersect_num++;
        } else if (intersect == 0) {
            virtual_line[1][0] -= 1;
            intersect_num = 0;
            i = -1;
        }
    }
    if (intersect % 2 == 1) return true;
    else return false;
}

Stinuum.QueryProcessor.do_intersect_lines = function (line_1, line_2) {
    var a = line_1[0];
    var b = line_1[1];
    var c = line_2[0];
    var d = line_2[1];
    var fn = Stinuum.QueryProcessor.ccw;
    var abc = fn(a, b, c);
    var abd = fn(a, b, d);
    var cda = fn(c, d, a);
    var cdb = fn(c, d, b);

    var ab = abc * abd;
    var cd = cda * cdb;
    if (ab < 0 && cd < 0) return 1;
    else if (ab == 0 || cd == 0) return 0;
    else return -1;
}

Stinuum.QueryProcessor.ccw = function (a, b, c) { //counter-clock wise
    var ret = (a[0] * b[1] - a[1] * b[0]) + (b[0] * c[1] - c[0] * b[1]) + (c[0] * a[1] - a[0] * c[1]);
    if (ret > 0) return 1;
    else if (ret == 0) return 0;
    else return -1;
}

Stinuum.QueryProcessor.prototype.queryByTime = function (start, end) {
    this.super.mfCollection.hideAll();
    var pair_arr;
    var new_mf_arr = [];
    if (this.super.s_query_on) {
        pair_arr = this.result_pairs;
    } else {
        pair_arr = this.super.mfCollection.wholeFeatures
    }
  
    
    for (var i = 0; i < pair_arr.length; i++) {
        
        var min_max_date;
        if(pair_arr[i].feature.temporalGeometry.type == "MovingGeometryCollection"){
            var allDatetimes = [];
            for (var prism_i = 0; prism_i < pair_arr[i].feature.temporalGeometry.prisms.length; prism_i++){
                var eachFeature = pair_arr[i].feature.temporalGeometry.prisms[prism_i];
                
                for (date_i = 0; date_i < eachFeature.datetimes.length; date_i++){
                    
                    allDatetimes.push(eachFeature.datetimes[date_i])
                }
            }
            // min_max_date = Stinuum.findMinMaxTime(pair_arr[i].feature.temporalGeometry.datetimes);
            min_max_date = Stinuum.findMinMaxTime(allDatetimes);
        }else{
            min_max_date = Stinuum.findMinMaxTime(pair_arr[i].feature.temporalGeometry.datetimes);
        } 
        LOG(min_max_date[0],min_max_date[1]) 
        LOG(start, end)
        // LOG("-------------------------------")
        // LOG(min_max_date[1], end)
        // LOG(min_max_date[0], start)
        // LOG("-------------------------------")
        if (min_max_date[1] <= end && min_max_date[0] >= start) {
            new_mf_arr.push(pair_arr[i]);
            
        } else {
           
            if (min_max_date[1] >= start && min_max_date[0] <= end) {
               
                var sliced_feature = this.sliceFeatureByTime(pair_arr[i].feature, start, end);
                console.log(sliced_feature)
                
                if (sliced_feature.temporalGeometry.type == "MovingGeometryCollection"){
                    var check_index = []
                    for (var sliced_i = 0; sliced_i < sliced_feature.temporalGeometry.prisms.length; sliced_i++){
                        var eachSlicedFeature = sliced_feature.temporalGeometry.prisms[sliced_i];
                        if (eachSlicedFeature.datetimes.length != 0){
                            check_index.push(sliced_i);
                        }
                    }
                    var prisms = [];
                    for (var checked_i = 0; checked_i < check_index.length; checked_i++){
                        prisms.push(sliced_feature.temporalGeometry.prisms[check_index[checked_i]])
                    }
                    
                    sliced_feature.temporalGeometry.prisms = prisms
                    new_mf_arr.push(new Stinuum.MFPair(pair_arr[i].id, sliced_feature));
                    
                }else{
                    if (sliced_feature.temporalGeometry.datetimes.length != 0){
                        new_mf_arr.push(new Stinuum.MFPair(pair_arr[i].id, sliced_feature));    
                    }
                }
                
            }
        }
    }
    this.super.mfCollection.features = new_mf_arr;
}

Stinuum.QueryProcessor.prototype.sliceFeatureByTime = function (feature, start, end) {
    //console.log("sliceFeatureByTime")
    LOG(feature)
    var new_feature = Stinuum.copyObj(feature);
    // var new_feature = feature;
    
    var geometry;
    var properties;
   
    if (new_feature.temporalGeometry.type == "MovingGeometryCollection"){
        properties = new_feature.temporalProperties;
        var front_list = [],
        start_list = [],
        end_list = [];
        for (var prism_i = 0; prism_i < new_feature.temporalGeometry.prisms.length; prism_i++){
            var eachFeature = new_feature.temporalGeometry.prisms[prism_i];
           
            geometry = eachFeature;
          
            var front_splice = 0,
            start_i = -1,
            end_i = -1;
            for (var i = 0; i < geometry.datetimes.length; i++){
                var date = new Date(geometry.datetimes[i])
                LOG(date, start)
                if (date > start) {
                    start_i = i;
                    break;
                } else {
                    front_splice += 1;
                }
            }
            for (var i = start_i; i < geometry.datetimes.length; i++) {
                var date = new Date(geometry.datetimes[i])
                LOG(date, end)
                if (date > end) {
                    end_i = i;
                    break;
                }
            }
            
            if (end_i != -1) {
                geometry.datetimes.splice(end_i, Number.MAX_VALUE);
                geometry.coordinates.splice(end_i, Number.MAX_VALUE);
            }
         
            if (front_splice != 0) {
                geometry.datetimes.splice(0, front_splice);
                geometry.coordinates.splice(0, front_splice);
            }
            if (start_i == end_i) {
                if (geometry.datetimes.length != 0) throw new Stinuum.Exception("Something wrong in Slice Feature by time");
            }
            if (geometry.datetimes.length == 0 || geometry.coordinates.length == 0){
           
            }else{
                front_list.push(front_splice);
                end_list.push(end_i)
            }
            
        }
        if (front_list.length == 0 && end_list.length == 0){

        }
        var front_splice = Math.max.apply(null, front_list);
        var end_i = Math.min.apply(null, end_list);
       
        for (var pro_i = 0; pro_i < properties.length; pro_i++) {
            var property = properties[pro_i];
            for (var key in property) {
                LOG(key)
                if (!property.hasOwnProperty(key)) continue;
                var array;
                if (Array.isArray(property[key])) {
                    array = property[key];
                } else {
                    array = property[key].values;
                }
                if (end_i != -1) array.splice(end_i, Number.MAX_VALUE);
                if (front_splice != 0) array.splice(0, front_splice);
            }
        }
    

     

    }else{
        var front_splice = 0,
        start_i = -1,
        end_i = -1;
        geometry = new_feature.temporalGeometry;
        properties = new_feature.temporalProperties;
        for (var i = 0; i < geometry.datetimes.length; i++) {
            var date = new Date(geometry.datetimes[i])
            LOG(date, start, date>start)
            if (date > start) {
                
                start_i = i;
                break;
            } else {
                front_splice += 1;
            }
        }
        for (var i = start_i; i < geometry.datetimes.length; i++) {
            var date = new Date(geometry.datetimes[i])
            LOG(date, end, date>=end)
            if (date > end) {
                end_i = i;
                break;
            }
        }
    
        // if (geometry.datetimes.length != properties[0].datetimes.length){
        //   LOG(feature, geometry.datetimes, properties[0].datetimes);
        //   throw new Error("TODO");
        // }
      
        if (end_i != -1) {
            geometry.datetimes.splice(end_i, Number.MAX_VALUE);
            geometry.coordinates.splice(end_i, Number.MAX_VALUE);
        }
        LOG(geometry.datetimes)
        LOG(geometry.coordinates)
        if (front_splice != 0) {
            geometry.datetimes.splice(0, front_splice);
            geometry.coordinates.splice(0, front_splice);
        }
        LOG(front_splice, end_i, Number.MAX_VALUE)
        LOG(start_i, end_i, front_splice)
        LOG(geometry.datetimes)
        LOG(geometry.coordinates)
    
        for (var pro_i = 0; pro_i < properties.length; pro_i++) {
            var property = properties[pro_i];
            for (var key in property) {
                if (!property.hasOwnProperty(key)) continue;
                var array;
                if (Array.isArray(property[key])) {
                    array = property[key];
                } else {
                    array = property[key].values;
                }
                if (end_i != -1) array.splice(end_i, Number.MAX_VALUE);
                if (front_splice != 0) array.splice(0, front_splice);
            }
        }
    
        if (start_i == end_i) {
            if (geometry.datetimes.length != 0) throw new Stinuum.Exception("Something wrong in Slice Feature by time");
        }
        //TODO
        //make Sample and append start and end
    
        
    }
    return new_feature;
}
/**
 * change mode of stinuum. It is one-to-one correspondence with cesium mode.
 * @param {string} [mode]
 * ` ``js
 * stinuum.changmeMode("SPACETIME");
 * ` ``
 */

Stinuum.prototype.changeMode = function (mode) {
    if (mode == undefined) {
        if (this.mode == 'STATICMAP' || this.mode == 'ANIMATEDMAP') {
            this.mode = 'SPACETIME';
        } else {
            this.mode = 'STATICMAP';
        }
    } else {
        this.mode = mode;
    }

    this.geometryViewer.update({
        change: true
    });

}

Stinuum.prototype.getListOfHeight = function (datetimes, min_max_date) {
    if (min_max_date == undefined) {
        min_max_date = this.mfCollection.min_max.date;
    }
    var heights = [];
    for (var i = 0; i < datetimes.length; i++) {
        heights.push(Stinuum.normalizeTime(new Date(datetimes[i]), min_max_date, this.maxHeight));
    }
    return heights;
}


Stinuum.getCenter = function (coordinates, type) {
    var x = 0,
        y = 0;
    var length = coordinates.length;
    if (type == 'MovingPolygon') {
        length -= 1;
    }
    for (var i = 0; i < length; i++) {
        x += coordinates[i][0];
        y += coordinates[i][1];

    }
    x /= length;
    y /= length;

    return [x, y];
}

Stinuum.TemporalMap.prototype.show = function (mf_id, propertyName) {
    var pro_name = propertyName;
    LOG("TemporalMap show")

    var mf = this.super.mfCollection.getMFPairById(mf_id);
    if (mf == -1) {
        //console.log("please add mf first.");
        return;
    }

    //Only this feature is viewed in graph.
    this.super.mfCollection.hideAll(mf_id);

    var property = Stinuum.getPropertyByName(mf.feature, pro_name, mf_id);
    if (property == -1) {
        //console.log("that property is not in this moving feature");
        return;
    }

    if (this.super.geometryViewer.primitives[mf_id] != undefined) {
        this.super.cesiumViewer.scene.primitives.remove(this.super.geometryViewer.primitives[mf_id]);
        this.super.geometryViewer.primitives[mf_id] = undefined;
    }

    this.super.mfCollection.min_max = this.super.mfCollection.findMinMaxGeometry([mf]);
    var type = mf.feature.temporalGeometry.type;
    this.super.geometryViewer.clear();

    if (this.super.mode == 'SPACETIME') {
        //this.bounding_sphere = Stinuum.getBoundingSphere(this.min_max, [0, this.max_height]  );
        this.super.cesiumViewer.scene.primitives.add(this.super.geometryViewer.drawZaxis());
        var entities = this.super.geometryViewer.drawZaxisLabel();
        for (var i = 0; i < entities.values.length; i++) {
            this.super.cesiumViewer.entities.add(entities.values[i]);
        }
    } else {
        //  this.bounding_sphere = Stinuum.getBoundingSphere(this.min_max, [0,0] );
    }
    LOG("TemporalMap.prototype.", property)
    var highlight_prim;
    if (type == "MovingGeometryCollection"){
        for(var property_i = 0; property_i < property.length;property_i++){
            for(var prism_i = 0; prism_i < mf.feature.temporalGeometry.prisms.length; prism_i++){
                var eachFeature =  mf.feature.temporalGeometry.prisms[prism_i]
                var check_start = false
                var check_end = false
                LOG(property[property_i])
                LOG(property[property_i][0].datetimes)
                if(eachFeature.datetimes.length == property[property_i][0].datetimes.length){
                    var length_f = eachFeature.datetimes.length
                    var length_p = property[property_i][0].datetimes.length
                    check_start = new Date(eachFeature.datetimes[0]).getTime() == new Date(property[property_i][0].datetimes[0]).getTime()
                    check_end = new Date(eachFeature.datetimes[length_f - 1]).getTime() == new Date(property[property_i][0].datetimes[length_p-1]).getTime()
                }
                if (check_start == true && check_end == true){
                    LOG(eachFeature.type)
                    if (eachFeature.type == 'MovingPolygon') {
                        highlight_prim = this.super.cesiumViewer.scene.primitives.add(this.super.geometryViewer.drawing.drawPathMovingPolygon({
                            temporalGeometry: eachFeature,
                            temporalProperty: property[property_i][0],
                            id: mf_id
                        }));
                    } else if (eachFeature.type == 'MovingPoint') {
                        highlight_prim = this.super.cesiumViewer.scene.primitives.add(this.super.geometryViewer.drawing.drawPathMovingPoint({
                            temporalGeometry: eachFeature,
                            temporalProperty: property[property_i][0],
                            id: mf_id
                        }));
                    } else if (eachFeature.type == 'MovingLineString') {
                        highlight_prim = this.super.cesiumViewer.scene.primitives.add(this.super.geometryViewer.drawing.drawPathMovingLineString({
                            temporalGeometry: eachFeature,
                            temporalProperty: property[property_i][0],
                            id: mf_id
                        }));
                    }  else if (eachFeature.type == 'MovingPointCloud') {
                        highlight_prim = this.super.cesiumViewer.scene.primitives.add(this.super.geometryViewer.drawing.drawPathMovingPointCloud({
                            temporalGeometry: eachFeature,
                            temporalProperty: property[property_i][0],
                            id: mf_id
                        }));
                    }else {
                        LOG('this type is not implemented.');
                    }
                }
            }
        }
       
    }else{
        
        if (type == 'MovingPolygon') {
            highlight_prim = this.super.cesiumViewer.scene.primitives.add(this.super.geometryViewer.drawing.drawPathMovingPolygon({
                temporalGeometry: mf.feature.temporalGeometry,
                temporalProperty: property[0],
                id: mf_id
            }));
        } else if (type == 'MovingPoint') {
            
            highlight_prim = this.super.cesiumViewer.scene.primitives.add(this.super.geometryViewer.drawing.drawPathMovingPoint({
                temporalGeometry: mf.feature.temporalGeometry,
                temporalProperty: property[0],
                id: mf_id
            }));
        } else if (type == 'MovingLineString') {
            highlight_prim = this.super.cesiumViewer.scene.primitives.add(this.super.geometryViewer.drawing.drawPathMovingLineString({
                temporalGeometry: mf.feature.temporalGeometry,
                temporalProperty: property[0],
                id: mf_id
            }));
        }  else if (type == 'MovingPointCloud') {
            highlight_prim = this.super.cesiumViewer.scene.primitives.add(this.super.geometryViewer.drawing.drawPathMovingPointCloud({
                temporalGeometry: mf.feature.temporalGeometry,
                temporalProperty: property[0],
                id: mf_id
            }));
        }else {
            LOG('this type is not implemented.');
        }
    }
    
    
    this.super.geometryViewer.primitives[mf_id] = highlight_prim;
    
    LOG("Here : ",mf_id)
    LOG(this.super.geometryViewer.primitives[mf_id])
    this.super.geometryViewer.animate({
        id: mf_id
    });

    return 0;
}

Stinuum.findMinMaxTime = function (datetimes) {
    // LOG(datetimes)
    var min_max_date = [];
    min_max_date[0] = new Date(datetimes[0]);
    min_max_date[1] = new Date(datetimes[0]);
    if (isNaN(min_max_date[0].getTime())) throw new Error("cannot be date type, utility.js, findMinMaxTime");
    for (var j = 1; j < datetimes.length; j++) {
        var time = new Date(datetimes[j]);

        if (min_max_date[0].getTime() > time.getTime()) {
            min_max_date[0] = time;
        }
        if (min_max_date[1].getTime() < time.getTime()) {
            min_max_date[1] = time;
        }
    }
    return min_max_date;
}

Stinuum.findMinMaxCoordArray = function (coordinates_arr) {
    var mf_min_max_coord = Stinuum.findMinMaxCoord(coordinates_arr[0]);
    for (var j = 1; j < coordinates_arr.length; j++) {
        mf_min_max_coord = Stinuum.findBiggerCoord(mf_min_max_coord, Stinuum.findMinMaxCoord(coordinates_arr[j]));
    }
    return mf_min_max_coord;
}

Stinuum.findMinMaxCoord = function (coordinates) {
    var min_max = {};
    min_max.x = [];
    min_max.y = [];
    min_max.z = [];

    var start = coordinates[0];
    min_max.x[0] = start[0];
    min_max.x[1] = start[0];
    min_max.y[0] = start[1];
    min_max.y[1] = start[1];
    min_max.z = [];
    if (coordinates[0][2] != undefined) {
        min_max.z[0] = start[2];
        min_max.z[1] = start[2];
    }

    for (var i = 0; i < coordinates.length; i++) {
        var coord = coordinates[i];
        if (min_max.x[0] > coord[0]) {
            min_max.x[0] = coord[0];
        }
        if (min_max.x[1] < coord[0]) {
            min_max.x[1] = coord[0];
        }
        if (min_max.y[0] > coord[1]) {
            min_max.y[0] = coord[1];
        }
        if (min_max.y[1] < coord[1]) {
            min_max.y[1] = coord[1];
        }
        if (coord[2] != undefined) {
            if (min_max.z[0] > coord[2]) {
                min_max.z[0] = coord[2];
            }
            if (min_max.z[1] < coord[2]) {
                min_max.z[1] = coord[2];
            }
        }
    }

    //maybe pass international Date line
    if (Math.abs(min_max.x[0] - min_max.x[1]) > 180) {
        LOG("it pass IDL");
        var temp = min_max.x[0];
        min_max.x[0] = min_max.x[1];
        min_max.x[1] = temp;
    }

    return min_max;

}


Stinuum.findBiggerCoord = function (min_max_1, min_max_2) {
    var ret = {};
    ret.x = [];
    ret.y = [];
    ret.z = [];
    ret.x[0] = Math.min(min_max_1.x[0], min_max_2.x[0]);
    ret.y[0] = Math.min(min_max_1.y[0], min_max_2.y[0]);
    ret.x[1] = Math.max(min_max_1.x[1], min_max_2.x[1]);
    ret.y[1] = Math.max(min_max_1.y[1], min_max_2.y[1]);

    if (min_max_1.z.length != 0 && min_max_2.z.length != 0) {
        ret.z[0] = Math.min(min_max_1.z[0], min_max_2.z[0]);
        ret.z[1] = Math.max(min_max_1.z[1], min_max_2.z[1]);
    }
    return ret;
}

Stinuum.normalizeTime = function (date, min_max_date, value = 15000000) {
    /**
     * now here
     */
    var separation = min_max_date[1].getTime() - min_max_date[0].getTime()
    if(separation == 0){
        separation = 1
    }
    if (value < 5000000){
        LOG(value)
        value = 5000000
    }
    // console.log((date.getTime() - min_max_date[0].getTime()) / separation * value)
    //console.log((date.getTime() - min_max_date[0].getTime()) / separation * value)
    
    return (date.getTime() - min_max_date[0].getTime()) / separation * value;
}

Stinuum.findMinMaxProperties = function (properties) {
    if (!Array.isArray(properties)) {
        properties = [properties];
    }
    console.log(properties)
    // console.log(typeof(first_value) == "string")
    var first_date = new Date(properties[0].datetimes[0]);
    var first_value = properties[0].values[0];
    var min_max = {};
    if (typeof(first_value) != "string"){
        min_max.date = [first_date, first_date];
        min_max.value = [first_value, first_value];
        for (var i = 0; i < properties.length; i++) {
            var temp_max_min = Stinuum.findMinMaxTime(properties[i].datetimes);
            if (temp_max_min[0].getTime() < min_max.date[0].getTime()) {
                min_max.date[0] = temp_max_min[0];
            }
            if (temp_max_min[1].getTime() > min_max.date[1].getTime()) {
                min_max.date[1] = temp_max_min[1];
            }
            for (var j = 0; j < properties[i].values.length; j++) {
                if (min_max.value[0] > properties[i].values[j]) {
                    min_max.value[0] = properties[i].values[j];
                }
                if (min_max.value[1] < properties[i].values[j]) {
                    min_max.value[1] = properties[i].values[j];
                }
            }

        }
    }else{
        min_max.date = [first_date, first_date];
        var first_value_array = new Array();
        for (var i = 0; i < properties.length; i++) {
            var temp_max_min = Stinuum.findMinMaxTime(properties[i].datetimes);
            if (temp_max_min[0].getTime() < min_max.date[0].getTime()) {
                min_max.date[0] = temp_max_min[0];
            }
            if (temp_max_min[1].getTime() > min_max.date[1].getTime()) {
                min_max.date[1] = temp_max_min[1];
            }
            first_value_array = first_value_array.concat(Array.from(new Set(properties[i].values))) 
        }
        min_max.value = Array.from(new Set(first_value_array));
    }
    return min_max;

    // if (!Array.isArray(properties)) {
    //     properties = [properties];
    // }

    // var first_date = new Date(properties[0].datetimes[0]);
    // var first_value = properties[0].values[0];
    // var min_max = {};
    
    // min_max.date = [first_date, first_date];
    // min_max.value = [first_value, first_value];
    // for (var i = 0; i < properties.length; i++) {
    //     var temp_max_min = Stinuum.findMinMaxTime(properties[i].datetimes);
    //     if (temp_max_min[0].getTime() < min_max.date[0].getTime()) {
    //         min_max.date[0] = temp_max_min[0];
    //     }
    //     if (temp_max_min[1].getTime() > min_max.date[1].getTime()) {
    //         min_max.date[1] = temp_max_min[1];
    //     }
    //     for (var j = 0; j < properties[i].values.length; j++) {
    //         if (min_max.value[0] > properties[i].values[j]) {
    //             min_max.value[0] = properties[i].values[j];
    //         }
    //         if (min_max.value[1] < properties[i].values[j]) {
    //             min_max.value[1] = properties[i].values[j];
    //         }
    //     }

    // }
    // return min_max;
}

Stinuum.getMBRFromPolygon = function (coordinates) {
    var mbr = Stinuum.findMinMaxCoord(coordinates);
    return mbr;
}
Stinuum.getPropertyByType = function (mf, type, id){
    if (mf.temporalProperties == undefined) return -1;
    if (Array.isArray(mf.temporalProperties)) {
        let generate_property = null;
        for (let i = 0; i < mf.temporalProperties.length; i++) {
            // console.log(typeof(mf.temporalProperties[i]))
            // console.log(mf.temporalProperties[i])
            for(let j in Object.keys(mf.temporalProperties[i])){
                let propertyName = Object.keys(mf.temporalProperties[i])[j]
                let propertyValue = mf.temporalProperties[i][propertyName]
                // console.log(propertyValue.type)
                if (propertyName != "datetimes" && propertyValue != undefined){
                    
                    // console.log(propertyValue, propertyValue.type, type, propertyValue.type == type)
                    if(propertyValue.type == type){
                        if (generate_property) {
                            generate_property.values.push(...propertyValue);
                            generate_property.datetimes.push(...mf.temporalProperties[i].datetimes);
                        } else {
                            // First, deep copy
                            generate_property = jQuery.extend(true, {}, mf.temporalProperties[i][propertyName]);
                            generate_property.datetimes = jQuery.extend(true, [], mf.temporalProperties[i].datetimes);
                        }
                    }
                }
            }
        }
        if (generate_property) {
            return [generate_property, id];
        }
    } else {
        for(let i in Object.keys(mf.temporalProperties)){
            let propertyName = Object.keys(mf.temporalProperties)[i]
            let propertyValue = mf.temporalProperties[i][propertyName]
            if(propertyValue.type != undefined && propertyValue.type == type){
                var property = mf.temporalProperties[propertyName];
            }
        }
        if (property != undefined) {
            property.datetimes = mf.temporalProperties[i].datetimes;
            return [property, id];
        }       
    }
    return -1;
}
Stinuum.getPropertyByName = function (mf, name, id) {
    if (mf.temporalProperties == undefined) return -1;
    if(mf.temporalGeometry.type == "MovingGeometryCollection"){
        if (Array.isArray(mf.temporalProperties)) {
            
            let generate_property_arr = new Array()
            for (let i = 0; i < mf.temporalProperties.length; i++) {
                LOG(mf.temporalProperties[i], name)
                let generate_property = null;
                if (mf.temporalProperties[i][name]) {
    
                
                    generate_property = jQuery.extend(true, {}, mf.temporalProperties[i][name]);
                    generate_property.datetimes = jQuery.extend(true, [], mf.temporalProperties[i].datetimes);
                    
                    
                }
                
                if (generate_property) {
                    generate_property_arr.push([generate_property, id])
                }
                //var property = mf.temporalProperties[i][name];
                //if (property != undefined) {
                //  property.datetimes = mf.temporalProperties[i].datetimes;
                //  return [property, id];
                //}
            }
            return generate_property_arr
            
        } else {
            var property = mf.temporalProperties[name];
            if (property != undefined) {
                property.datetimes = mf.temporalProperties[i].datetimes;
                return [property, id];
            }
        }
        return -1;
    }else{
        if (Array.isArray(mf.temporalProperties)) {
            let generate_property = null;
         
            for (let i = 0; i < mf.temporalProperties.length; i++) {
                LOG(mf.temporalProperties[i], name)
                if (mf.temporalProperties[i][name]) {
                    
                    if (generate_property) {
                        generate_property.values.push(...mf.temporalProperties[i][name].values);
                        generate_property.datetimes.push(...mf.temporalProperties[i].datetimes);
                    } else {
                        // First, deep copy
                        generate_property = jQuery.extend(true, {}, mf.temporalProperties[i][name]);
                        generate_property.datetimes = jQuery.extend(true, [], mf.temporalProperties[i].datetimes);
                    }
                    LOG(generate_property.values)
                }
                //var property = mf.temporalProperties[i][name];
                //if (property != undefined) {
                //  property.datetimes = mf.temporalProperties[i].datetimes;
                //  return [property, id];
                //}
            }
            console.log(generate_property)
            if (generate_property) {
                return [generate_property, id];
            }
        } else {
            var property = mf.temporalProperties[name];
            if (property != undefined) {
                property.datetimes = mf.temporalProperties[i].datetimes;
                return [property, id];
            }
        }
        return -1;
    }
  
}

Stinuum.pushPropertyNamesToArrayExceptTime = function (array, properties) {
    var keys = Object.keys(properties);
    var values = Object.values(properties);
    console.log(values)
    console.log(keys)
    for (var k = 0; k < keys.length; k++) {
        if (keys[k] == 'datetimes') continue;
        // if (values[k].type == 'Image') continue;
        var isExist = false;
        for (var arr_i = 0; arr_i < array.length; arr_i++) {
            if (array[arr_i] == keys[k]) {
                isExist = true;
                break;
            }
        }
        if (!isExist) array.push({key:keys[k], type:values[k].type});
        // if (!isExist) array.push(keys[k]);
    }
}

Stinuum.calculateDist = function (point_1, point_2) {
    return Math.sqrt(Math.pow(point_1[0] - point_2[0], 2) + Math.pow(point_1[1] - point_2[1], 2));
}

Stinuum.calculateCarteDist = function (point1, point2) {
    if (point1.length == 2 && point1.length == point2.length) {
        var carte3_1 = Cesium.Cartesian3.fromDegrees(point1[0], point1[1]),
            carte3_2 = Cesium.Cartesian3.fromDegrees(point2[0], point2[1]);
    } else if (point1.length == 3 && point1.length == point2.length) {
        var carte3_1 = Cesium.Cartesian3.fromDegrees(point1[0], point1[1], point1[2]),
            carte3_2 = Cesium.Cartesian3.fromDegrees(point2[0], point2[1], point2[2]);
    } else {
        alert("dist error");
        return;
    }
    return Cesium.Cartesian3.distance(carte3_1, carte3_2);
}

Stinuum.getBoundingSphere = function (min_max, height) {
    var middle_x = (min_max.x[0] + min_max.x[1]) / 2;
    var middle_y = (min_max.y[0] + min_max.y[1]) / 2;
    var middle_height = (height[0] + height[1]) / 2;

    var radius = Stinuum.calculateCarteDist([middle_x, middle_y, middle_height], [min_max.x[0], min_max.y[0], height[0]]);
    return new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(middle_x, middle_y, middle_height), radius * 3);
}

Stinuum.findMaxCoordinatesLine = function (geometry) {
    var max_length = 0;
    for (var i = 0; i < geometry.coordinates.length; i++) {
        if (max_length < geometry.coordinates[i].length) {
            max_length = geometry.coordinates[i].length;
        }
    }
    return max_length;
}

Stinuum.addPolygonSample = function (geometry, index, property) {
    var datetimes = geometry.datetimes;
    for (var time = 0; time < geometry.coordinates.length; time++) {
        var coords = geometry.coordinates[time][0];
        var juldate = Cesium.JulianDate.fromDate(new Date(datetimes[time]));
        property.addSample(juldate, Cesium.Cartesian3.fromDegrees(coords[index][0], coords[index][1]));
    }
}

Stinuum.getSampleProperties_Polygon = function (polygon) {
    if (polygon.type != "MovingPolygon") throw new Stinuum.Exception("It should be MovingPolygon temporalGeometry", polygon);
    var polygon_size = polygon.coordinates[0][0].length;
    if (polygon_size < 4) new ERR("polygon_size is less than 3", polygon_size);
    var isSpline = polygon.interpolation == "Spline";
    var sample_list = [];

    for (var i = 0; i < polygon_size; i++) {
        var property = new Cesium.SampledProperty(Cesium.Cartesian3);
        // if (isSpline){
        //   property.setInterpolationOptions({
        //   interpolationDegree : 2,
        //   interpolationAlgorithm : Cesium.HermitePolynomialApproximation
        // });
        // }
        Stinuum.addPolygonSample(polygon, i, property);
        sample_list.push(property);
    }
    return sample_list;
}

Stinuum.getSampleProperty_Point = function (geometry) {
    if (geometry.type != "MovingPoint") throw new Stinuum.Exception("It should be MovingPoint", geometry);
    var isSpline = geometry.interpolation == "Spline";
    var datetimes = geometry.datetimes;
    var property = new Cesium.SampledProperty(Cesium.Cartesian3);
    if (isSpline) {
        property.setInterpolationOptions({
            interpolationDegree: 2,
            interpolationAlgorithm: Cesium.HermitePolynomialApproximation
        });
    }
    for (var i = 0; i < geometry.coordinates.length; i++) {
        var juldate = Cesium.JulianDate.fromDate(new Date(datetimes[i]));
        property.addSample(juldate, Cesium.Cartesian3.fromDegrees(eometry.coordinates[i][0], eometry.coordinates[i][1]));
    }
    return property;
}

Stinuum.copyObj = function (obj) {

    var copy = jQuery.extend(true, {}, obj);
    // // var copy = JSON.parse(JSON.stringify(obj));
 
    // // var copy = {};
    // // for(var i in obj) {
    // //     if(typeof(obj[i])=="object" && obj[i] != null){
    // //         copy[i] = Stinuum.copyObj(obj[i]);
    // //     }else{
    // //         copy[i] = obj[i];
    // //     }
    // // }
    // if (obj === null || typeof (obj) !== 'object'){
    //     return obj;
    // }
    // var copy = obj.constructor();

    // for (var attr in obj) {
    //     if (obj.hasOwnProperty(attr)) {
    //         copy[attr] = Stinuum.copyObj(obj[attr]);
    //     }
    // }

    return copy;
}

Stinuum.spliceElementInMovingPointByIndex = function (point_feature, remove_index) {
    var geometry = point_feature.temporalGeometry;
    var properties = point_feature.temporalProperties;

    geometry.coordinates.splice(remove_index, 1);
    geometry.datetimes.splice(remove_index, 1);
    Stinuum.spliceElementInPropertiesByIndex(properties, remove_index);
}

Stinuum.spliceElementInPropertiesByIndex = function (properties, remove_index) {
    for (var pro_i = 0; pro_i < properties.length; pro_i++) {
        var property = properties[pro_i];
        for (var key in property) {
            if (!property.hasOwnProperty(key)) continue;
            var array;
            if (Array.isArray(property[key])) {
                array = property[key];
            } else {
                array = property[key].values;
            }
            array.splice(remove_index, 1);
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////


Stinuum.Imagemarking.prototype.remove = function (canvasID) {
    var image_canvas = document.getElementById(canvasID);
    image_canvas.innerHTML = '';
    image_canvas.getContext('2d').clearRect(0, 0, image_canvas.width, image_canvas.height);



    this.super.mfCollection.colorCollection = {};
}

/**
@color : [west : yellow, east : green, north : cyan, south : red]
*/
Stinuum.Imagemarking.prototype.show = function (canvasID, roadView, width, height) {

    var cnvs = document.getElementById(canvasID);
    var ctx = cnvs.getContext('2d');
    ctx.drawImage(roadView, 0, 0, width, height);

}



var drawVideo = function (ctx, videoElement, width, height) {
    //   if(videoElement.paused || videoElement.ended) return false;
    //   alert(width);


    //    setTimeout(drawVideo, 1, ctx, videoElement, width, height);
}

Stinuum.Imagemarking.prototype.show_img = function(pro_type_arr, image) {
    let cnvs = document.getElementById('image');
    let ctx = cnvs.getContext('2d');
    console.log("Imagemarking")
    console.log(Array.isArray(pro_type_arr), image)
    var image_pro_arr = []
    for (let i = 0; i < stinuum.mfCollection.features.length; i++) {
        let pair = stinuum.mfCollection.features[i];
        if (Array.isArray(pro_type_arr)){
            for (let j = 0; j < pro_type_arr.length; j++) {
                let property = Stinuum.getPropertyByName(pair.feature, pro_type_arr[j], pair.id);
                    // Stinuum.getPropertyByName(pair.feature, image_pro_type_arr[j], pair.id);
                console.log(property)
                if (property != -1) {
                    image_pro_arr.push(property);
                }
            }
        }else{
            let property = Stinuum.getPropertyByName(pair.feature, pro_type_arr, pair.id);
            if (property != -1) {
                image_pro_arr.push(property);
            }
        }
        // for (let j = 0; j < detection_pro_type_arr.length; j++) {
        //     let property =
        //         Stinuum.getPropertyByName(pair.feature, detection_pro_type_arr[j], pair.id);
        //     if (property != -1) {
        //         detection_pro_arr.push(property);
        //     }
        // }
    }
    console.log(image_pro_arr)
    // //console.log(image_pro_arr[0][0].interpolation)
    if (image_pro_arr[0][0].interpolation != undefined){
        imageInterpolation = image_pro_arr[0][0].interpolation
    }
    let image_name_arr = [];
    let image_object_arr = [];
    let image_data = [];
    for (let i = 0; i < image_pro_arr.length; i++) {
        image_object_arr.push(image_pro_arr[i][0]);
        image_name_arr.push(image_pro_arr[i][1]);
    }
    let timeline_detections = {};
    for (let id = 0; id < image_object_arr.length; id++) {
        let object = image_object_arr[id];
        for (let i = 0; i < object.datetimes.length; i++) {
            if (object.values[i] == null) {
                break;
            }
            let detection_time = new Date(object.datetimes[i]).getTime();
            // convert form string to json
            console.log(object.values[i])
            console.log(object.values[i].hasOwnProperty('contains'))
            if(object.values[i].hasOwnProperty('contains')){
                delete object.values[i].contains
            }
            console.log(object.values[i])
            console.log(object.values[i].hasOwnProperty('contains'))
            // timeline_detections[detection_time] = JSON.parse(object.values[i]);
            timeline_detections[detection_time] = object.values[i];
        }
    }
    timeline_images = [];
    for (let id = 0; id < image_object_arr.length; id++) {
        let object = image_object_arr[id];
        for (let i = 0; i < object.datetimes.length; i++) {
            let timeline_image = {}
            //console.log(object.datetimes[i])
            //console.log(new Date(object.datetimes[i]))
            // 1504835873000
            //console.log(new Date(object.datetimes[i]).getTime())
            timeline_image.time = new Date(object.datetimes[i]).getTime();
            if (object.values[i] == null)
                break;
            timeline_image.value = object.values[i];
            if (timeline_image.time in timeline_detections) {
                timeline_image.detection = timeline_detections[timeline_image.time];
            }
            timeline_images.push(timeline_image);
        }
    }
    timeline_detections = {}
    console.log("check point")
    console.log(timeline_images)
    if (timeline_images.length > 0) {
        // let newValue = checkType(timeline_images[0].value)
        // draw_image(ctx, newValue, cnvs.width, cnvs.height, timeline_images[0].detection);
        let eventHelper = new Cesium.EventHelper();
        LOG(this.viewer, this.super.cesiumViewer.clock)
        removeOnTickCallback = eventHelper.add(
            this.super.cesiumViewer.clock.onTick, function () {
               stinuum.imageMarking.onTick(Cesium.JulianDate.toDate(this.viewer.clock.currentTime).getTime());
            });
    } else {
        document.getElementById('img_menu').remove();
        $('img_view').remove();
        close_img();
    }
    drawFeatures();
}
Stinuum.Imagemarking.prototype.checkType = function(imageValue){
    console.log("Imagemarking checkType")
    //need to check the image whether image is http or base64
    var imageValue2;
    if (typeof(imageValue) === "object"){
        imageValue2 = imageValue[0]
    }
    else{
        imageValue2 = imageValue
    }
    var NewImageValue;
    var imageCheckValue = [ "http", "https",".png", ".bmp", ".gif", ".jpeg", ".jpg"]
    var checker = false
    for (var value in imageCheckValue){
      if (imageValue2.indexOf(imageCheckValue[value]) != -1){
        checker = true
        NewImageValue = imageValue2
        break;
      }
    }
    if (!checker){
        NewImageValue = 'data:image/jpeg;base64,'+imageValue2
    }
    return NewImageValue
}
Stinuum.Imagemarking.prototype.onTick = function(current_time) {
    console.log("Imagemarking onTick")
    let image_div = document.getElementById("image");
    if (image_div) {
        let second_time = current_time;
        let div_time = image_div.dataset.time;
        if (second_time != div_time) {
            image_div.dataset.time = second_time;
            stinuum.imageMarking.showImage(image_div);
        }
    }
}
Stinuum.Imagemarking.prototype.showImage = function(image_div) {
    console.log("Imagemarking showImage")
    LOG(image_div)
    if (timeline_images.length > 0) {
        var  span = 1500; // milliseconds
        let div_time = image_div.dataset.time;
        let lastIndex = timeline_images.length - 1;
        // let src = 'data:image/jpeg;base64,';
        let src;
        let detections = [];
        if ((timeline_images[0].time - span) > div_time ||
            (timeline_images[lastIndex].time + span) < div_time) {
            src = null;
        }
        else if (lastIndex == 0 || timeline_images[lastIndex].time < div_time) {
            src = timeline_images[lastIndex].value;
            detections = timeline_images[lastIndex].detection;
        } else {
            for (let i = 0; i <= lastIndex; i++) {
                if(imageInterpolation == "Discrete"){
                    if (Math.abs(timeline_images[i].time - div_time) > span) {
                        src = null;
                    } else {
                        src = timeline_images[i].value;
                        detections = timeline_images[i].detection;
                        break;
                    }
                }else{
                    //step, Linear
                    if (i < lastIndex-1){
                        if ( timeline_images[i].time <= div_time && div_time < timeline_images[i+1].time) {
                            src = timeline_images[i].value;
                            detections = timeline_images[i].detection;
                            break;
                        } else {
                            src = null;
                        }
                    }else if(i == lastIndex-1) {
                        var tempspan = (timeline_images[i+1].time - timeline_images[i].time) / 10
                        console.log(tempspan, tempspan / 10)
                        if (timeline_images[i].time <= div_time && div_time < (timeline_images[i+1].time - tempspan)) {
                            src = timeline_images[i].value;
                            detections = timeline_images[i].detection;
                            break;
                        } else {
                            src = null;
                        }
                    }else{
                        var tempspan = (timeline_images[i-1].time - timeline_images[i].time) / 10
                        if (div_time - timeline_images[i].time  >= tempspan) {
                            src = timeline_images[i].value;
                            detections = timeline_images[i].detection;
                            break;
                        } else {
                            src = null;
                        }
                    }
                }
            }
        }
        let ctx = image_div.getContext('2d');
        if (src) {
            let newValue = stinuum.imageMarking.checkType(src)
            stinuum.imageMarking.draw_image(ctx, newValue, image_div.width, image_div.height, detections);
        } else {
            ctx.fillStyle = 'rgb(224, 224, 224)';
            ctx.fillRect(0, 0, image_div.width, image_div.height)
        }
    }
}
Stinuum.Imagemarking.prototype.draw_image = function(ctx, src, width, height) {
    // console.log("draw_image")
    // console.log(ctx, width, height)
    console.log("Imagemarking draw_image")
    let image = new Image();
    image.onload = function () {
        ctx.drawImage(image, 0, 0, width, height);
        // let h_ratio = height * 1.0 / image.height;
        // let w_ratio = width * 1.0 / image.width;
        // ctx.strokeStyle = 'rgb(255, 0 , 0)';
        // if (detections) {
        //     detections.forEach(function (v1) {
        //         if (!(v1["class"] in detection_colors)) {
        //             let next_color_index = Object.keys(detection_colors).length;
        //             if (next_color_index >= colors.length) {
        //                 next_color_index = colors.length - 1;
        //             }
        //             detection_colors[v1["class"]] = next_color_index;
        //         }
        //         ctx.strokeStyle = colors[detection_colors[v1["class"]]]
        //         let rect = {};
        //         console.log(v1.coordinates)
        //         rect.x = Math.round(v1.coordinates[0][0] * w_ratio);
        //         rect.y = Math.round(v1.coordinates[0][1] * h_ratio);
        //         rect.width = Math.round((v1.coordinates[2][0] - v1.coordinates[0][0]) * w_ratio);
        //         rect.height = Math.round((v1.coordinates[2][1] - v1.coordinates[0][1]) * h_ratio);
        //         ctx.strokeRect(
        //             rect.x,
        //             rect.y,
        //             rect.width,
        //             rect.height
        //         );
        //     });
        // }
    }
    image.src = src;
    // //console.log("image")
    // //console.log(src)
    // //console.log(image.src)
}

