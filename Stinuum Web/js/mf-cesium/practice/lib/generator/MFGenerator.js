function MFGenerator(){
  
}

MFGenerator.prototype.makeMovingPoint = function (name, startDatetime, endDatetime, coordinates){

    var dateTimes = this.timeSlicing(startDatetime, endDatetime, coordinates.length)
    var feature = {
        "type": "Feature",
        "properties" : {
          "name" : name
        },
        "temporalGeometry" : {
            "type" : "MovingPoint",
            "datetimes" : dateTimes,
            "coordinates" : coordinates,
            "interpolation" : "Linear"
        },
        "temporalProperties":[]
    }
    return feature
}

MFGenerator.prototype.timeGenerator = function (dateTime){
    var dateTime1 = new Date(dateTime)
    // var result = `${dateTime1.getFullYear().toString().padStart(4, '0')}-${
    //     (dateTime1.getMonth()+1).toString().padStart(2, '0')}-${
    //     dateTime1.getDate().toString().padStart(2, '0')}T${
    //     dateTime1.getHours().toString().padStart(2, '0')}:${
    //     dateTime1.getMinutes().toString().padStart(2, '0')}:${
    //     dateTime1.getSeconds().toString().padStart(2, '0')}.${
    //     dateTime1.getMilliseconds().toString().padStart(3,'0')}Z`      
    return dateTime1.toISOString()
}

MFGenerator.prototype.timeSlicing = function (startDatetime, endDatetime, count){
    var ST = new Date(startDatetime).getTime();
    var ET = new Date(endDatetime).getTime();

    var timeRange = (ET - ST) / (count - 1)
    var dateTimeList = []
    dateTimeList.push(startDatetime)
    for (var i = 1; i < count - 1; i++){
        var eachTime = this.timeGenerator(ST + (timeRange * i))
        dateTimeList.push(eachTime)
    }
    dateTimeList.push(endDatetime)
    return dateTimeList
}

MFGenerator.prototype.moveMovingPoint = function (options) {
  
    var geometry = options.temporalGeometry;
    var number = options.number;
    var geometry_interpolation = geometry.interpolation
    var feature_id = options.id
    var multiplier = 10000;
    var length = geometry.datetimes.length;
    var start, stop;
    console.log(start)
    start = new Date(geometry.datetimes[0]).toISOString();
    stop = new Date(geometry.datetimes[length - 1]).toISOString();

    var czml = [{
        "id": "document",
        "name": "animationOfMovingFeature",
        "version": "1.0"
    }];

    czml[0].clock = {
        "interval": start + "/" + stop,
        "currentTime": start,
        "multiplier": 10,
        "range": "LOOP_STOP"

    }
    var check = true
    if (geometry.datetimes.length == 1 && geometry.datetimes.length == 1) {
        check = false
        geometry_interpolation = "Discrete"
    }

    if (geometry_interpolation == "Linear" || geometry_interpolation == "Quadratic" || geometry_interpolation == "Cubic") {
        var interpolation;
        var interpolationD;
        if (geometry_interpolation == "Linear") {
            interpolation = "LINEAR";
            interpolationD = 1;
        } else if (geometry_interpolation == "Quadratic") {
            interpolation = "LAGRANGE";
            interpolationD = 2;
        } else {
            interpolation = "HERMITE";
            interpolationD = 3;
        }

        var v = {};
        v.id = 'movingPoint_' + feature_id + '_' + number;

        
        var scale = 1;
    
        var carto = [];
        var point = geometry.coordinates;
        for (var i = 0; i < geometry.coordinates.length; i++) {


            carto.push(new Date(geometry.datetimes[i]).toISOString());
            carto.push(point[i][0]);
            carto.push(point[i][1]);
            
            
            if (point[i][2] != undefined) {
                carto.push(point[i][2]);
            } else {
                carto.push(0);
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
  
        console.log(v)
        czml =czml.concat(v);
    }
    return czml;
}