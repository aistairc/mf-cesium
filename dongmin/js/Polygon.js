
function PolygonJSON(data_path, viewer){
  this.data_path = data_path;
  this.data = null;
  this.viewer = viewer;
  this.primitives_3d = [];
  this.is_exist_3d = false;
  this.primitives_2d = [];
  this.is_exist_2d = false;

  this.pre_czml = null;
}

//passing two polygon position with height whose the number of sides in same, return side rectangles
PolygonJSON.makeVolumePolygonPair = function(poly_1, poly_2, color){
  var instances = [];
  for (var k = 0 ; k < poly_1.length-1 ; k++){
    var position = [];

    var long_lat = poly_2[k];
    var pre_long_lat = poly_1[k];

    var next_long_lat = poly_2[k+1];
    var next_pre_long_lat= poly_1[k+1];

    position.push(long_lat[0]);
    position.push(long_lat[1]);
    position.push(long_lat[2]);

    position.push(next_long_lat[0]);
    position.push(next_long_lat[1]);
    position.push(next_long_lat[2]);

    position.push(next_pre_long_lat[0]);
    position.push(next_pre_long_lat[1]);
    position.push(next_pre_long_lat[2]);

    position.push(pre_long_lat[0]);
    position.push(pre_long_lat[1]);
    position.push(pre_long_lat[2]);

    instances.push(makePolygonWithHeight(position, color));

  }

  return instances;
}

PolygonJSON.makePolygon = function (position, r_color){
  var vertexF = new Cesium.VertexFormat({
    position : true,
    st : false,
    normal : true,
    color : true
  });
  var polygon = new Cesium.PolygonGeometry({
    polygonHierarchy : new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.fromDegreesArray(position)
    ),
    vertexFormat : vertexF
  });

  var p_geometry = Cesium.PolygonGeometry.createGeometry(polygon);

  return (new Cesium.GeometryInstance({
    geometry : p_geometry,
    attributes : {
      color : Cesium.ColorGeometryInstanceAttribute.fromColor(r_color)
    }

  } ));
};


PolygonJSON.prototype.makePrimitive2d = function(){

  //clearViewer();
  var this_object = this;
  if (this.is_exist_2d){
    console.log("Add Primiives that already is made");
  }
  else   {
    var feature = this_object.data.features;

    for (var i = 0 ; i < feature.length ; i++){
      var instances = [];
      var r_color = Cesium.Color.fromRandom({
        red : 0.0,
        minimumBlue : 0.2,
        minimumGreen : 0.2,
        alpha : 0.3
      });

      var geometry = feature[i].temporalGeometry;

      for (var j = 0 ; j < geometry.coordinates.length ; j ++){

        var position = [];

        for (var k = 0 ; k < geometry.coordinates[j].length ; k++){
          var long_lat = geometry.coordinates[j][k];
          position.push(long_lat[0]);
          position.push(long_lat[1]);
        }

        instances.push(PolygonJSON.makePolygon(position,r_color));

      }


      var temp = new Cesium.Primitive({
        geometryInstances : instances,
        //    releaseGeometryInstances : false,
        appearance : new Cesium.PerInstanceColorAppearance({
          //translucent : false
        }),
        show : true
      });

      this_object.primitives_2d.push(temp);

    }

    this_object.is_exist_2d = true;

  }
};

PolygonJSON.prototype.loadJsonAndMakePrimitive = function(){

  var this_object = this; //refeence
  if (this.is_exist_3d){
    console.log(this.primitives_3d);
    console.log("Add Primiives that already is made")
  }
  else{
    return Cesium.loadJson(this.data_path).then(function(data){

      this_object.data = data; //reference
      var feature = data.features;

      for (var i = 0 ; i < feature.length ; i++){
        var instances = [];
        var r_color = Cesium.Color.fromRandom({
          red : 0.0,
          minimumBlue : 0.2,
          minimumGreen : 0.2,
          alpha : 0.5
        });

        var geometry = feature[i].temporalGeometry;


        addRowtoTable(feature[i].properties.name, Cesium.Color.WHITE, i);


        //find min time, max time
        var min_max_date = [];
        min_max_date = findMinMaxTime(geometry.datetimes);

        var pre_polygon,
        pre_dates;

        for (var j = 0 ; j < geometry.coordinates.length ; j ++){
          if (j == 0){
            pre_polygon = geometry.coordinates[0];
            pre_dates = geometry.datetimes[0];
            continue;
          }

          var normalize = normalizeTime(new Date(geometry.datetimes[j]), min_max_date);
          var pre_normalize = normalizeTime(new Date(pre_dates), min_max_date);

          var polygon_cor = geometry.coordinates[j];

          for (var k = 0 ; k < geometry.coordinates[j].length ; k++){
            pre_polygon[k][2] = pre_normalize;
            polygon_cor[k][2] = normalize;
          }

          instances = instances.concat(PolygonJSON.makeVolumePolygonPair(pre_polygon,polygon_cor,r_color));

          pre_polygon = geometry.coordinates[j];
          pre_dates = geometry.datetimes[j];

        }

        var prim = new Cesium.Primitive({
          geometryInstances : instances,
          appearance : new Cesium.PerInstanceColorAppearance({
            translucent : true
          }),
          show : true
        });

        this_object.primitives_3d.push(prim);
        //console.log(this_object);
      }

      this_object.is_exist_3d = true;
      this_object.makePrimitive2d();

    }).otherwise(function(error){
      console.log(error);
    });
  }

};


PolygonJSON.prototype.animation_czml = function(id, with_height = 1){

  var czml = [{
    "id" : "document",
    "name" : "polygon_highlight",
    "version" : "1.0"
  }, {
    "id" : "dynamicPolygon",
    //  "availability":"2012-08-04T16:00:00Z/2012-08-04T17:00:00Z",
    "polygon": {
      "positions": {
        "references": [
          "v1#position",
          "v2#position",
          "v3#position",
          "v4#position",
          "v5#position",
          "v6#position",
          "v7#position",
          "v8#position"

        ]
      },
      "perPositionHeight" : true,
      "material": {
        "solidColor": {
          "color": {
            "rgbaf" : [1, 0, 0, 1]
          }
        }
      }
    }
  }];

  var viewer = this.viewer;

    if (this.pre_czml != null)
      viewer.dataSources.removeAll();
    var feature = this.data.features[id];
    var geometry = feature.temporalGeometry;
    var length = geometry.datetimes.length;

    var min_max_date = [];
    min_max_date = findMinMaxTime(geometry.datetimes);

    var start, stop;
    start = new Date(geometry.datetimes[0]).toISOString();
    stop = new Date(geometry.datetimes[length-1]).toISOString();
    var availability = start + "/" + stop;
    czml[1].availability = availability;

    czml[0].clock = {
      "interval" : availability,
      "currentTime" : start,
      "multiplier" : 10000
    }

    for (var i = 0 ; i < geometry.coordinates[0].length-1 ; i++){
      var v = {};
      v.id = 'v'+(i+1);
      v.position = {
        "interpolationAlgorithm": "LINEAR",
        "interpolationDegree": 1,
        "interval" : availability,
        "epoch" : start,
        "cartographicDegrees" : []
      };
      czml.push(v);
    }



    var start_second = new Date(geometry.datetimes[0]).getTime();
    for (var i = 0 ; i < geometry.datetimes.length ; i++){
      var seconds = new Date(geometry.datetimes[i]).getTime() - start_second;
      var normalize = normalizeTime(new Date(geometry.datetimes[i]), min_max_date);

      var polygon = geometry.coordinates[i];


      for (var j = 0 ; j < polygon.length-1 ; j++){
        var carto = [];

        carto.push(seconds / 1000);
        carto.push(polygon[j][0]);
        carto.push(polygon[j][1]);
        carto.push(normalize * with_height);

        czml[j + 2].position.cartographicDegrees = czml[j + 2].position.cartographicDegrees.concat(carto);
      }
    }

    this.pre_czml = Cesium.CzmlDataSource.load(czml)
    this.viewer.dataSources.add(this.pre_czml);
    console.log(czml);

}
