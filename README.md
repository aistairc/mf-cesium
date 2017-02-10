# Cesium Examples

## License

Cesium Examples licensed under the [MIT](https://opensource.org/licenses/MIT)

## API

### List of API be used in this project.

1. Cesium

2. MovingFeatureOnCesium

3. d3

and so on...


### Cesium

[Ceisum](https://cesiumjs.org/) - An open-source JavaScript library for world-class 3D globes and maps


### Moving Feature On Cesium (MFOC)

We are developing API for this project.

[OGC Moving Features Encoding Extension - JSON](https://ksookim.github.io/mf-json/)


#### Visualize Movement

* movePolygonArray([movingfeature_array], with_height);

movingfeature is moving feature json object array.

It should be have 'temporalGeometry' key.

'with_height' means path of animation with own height.(boolean)

Returns [czml](https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/CZML-Guide) object.

```js
var mf1 = {
    "type" : "MovingFeature",
    "properties" : {
      "name" : "台風201513号 (LINEAR) "
    },
    "temporalGeometry" : {
      "type" : "MovingPolygon",
      "datetimes" : [ "2015-07-30 03:00:00",..., "2015-08-12 09:00:00" ],
      "coordinates" : [ [ [ 163.2, 13.3 ], [ 162.90710678118654, 12.592893218813453 ], ..., [ 123.7, 33.3 ], [ 124.57867965644036, 35.42132034355964 ], [ 126.7, 36.3 ], [ 128.82132034355965, 35.42132034355964 ], [ 129.7, 33.3 ] ] ],
      "interpolations" : "Linear"
    },
    "temporalProperties" : [ {
      "name" : "central pressure",
      "uom" : "hPa",
      "values" : [ 1006.0, 1004.0, 1004.0,..., 1000.0, 1000.0, 1000.0 ],
      "datetimes" : [ "2015-07-30 03:00:00", ..., "2015-08-12 09:00:00" ],
      "interpolations" : "Linear"
    }, {
      "name" : "Max wind speed",
      "uom" : "kt",
      "values" : [ 0.0, 0.0,..., 0.0, 0.0 ],
      "datetimes" : [ "2015-07-30 03:00:00",.., "2015-08-12 09:00:00" ],
      "interpolations" : "Linear"
    } ]
  }
var mf_arr = [ mf1, mf2 ]; //mf is movingfeature object.
var czml = movePolygonArray(mf_arr);
var load_czml = Cesium.CzmlDataSource.load(czml)
viewer.dataSources.add(load_czml);
```

* movePointArray([mf_arr], with_height)

Returns czml object.

* moveLineStringArray([mf_arr], with_height)

Returns czml object.


#### Draw Primitive

* drawMovingPolygonArray([mf_arr], with_height)

Draw multiple Polygon.

Return Cesium.primitiveCollection.

* drawVolumeMovingPolygonArray([mf_arr], with_height)

draw multiple Polygon With Volume.

* drawMovingPointArray([mf_arr], with_height)

draw multiple Point.

* drawMovingLineStringArray([mf_arr], with_height)

draw multiple LineString.

* drawMovingPointPath([mf_arr], with_height)

Returns Cesium.PolylineCollection. Draw path for MovingPoint.

* drawMovingLinePath([mf_arr], with_height)

Returns Cesium.PrimitiveCollection. Draw triangles using each linestring points.


#### Draw IndoorGML Data (With Z-value)

* drawPointsWithZvalue([mf_arr], with_height, max_height);

draw MovingPoint with Z-value.

'max_height' is meters that assume how much maximum height. it can be omitted.(default 1000)

Returns Cesium.PointPrimitiveCollection. z-value appears in color.

```js
$.getJSON('json_data/indoor.json').then(
  function(data){
    var mf_arr = [];
    for (var i = 0 ; i < data.features.length ; i++){
      mf_arr.push(data.features[i]);
    }
    scene.primitives.add(drawPointsWithZvalue(mf_arr, true));
  }
);
```

#### View Properties graph

* showProperty([obj_arr], div_id)

Show Property graph by [d3](https://github.com/d3/d3/blob/master/API.md).

It is recommended that propery objects have same attributes.

```js
<div id="graph" class="graph" > </div>
var property1 = {
  "name" : "central pressure",
  "uom" : "hPa",
  "values" : [ 1006.0, ..., 1000.0 ],
  "datetimes" : [ "2015-07-30 03:00:00",..., "2015-08-12 09:00:00" ],
  "interpolations" : "Linear"
}
var property2 = { ...}
showProperty([property1, property2,..], 'graph');
```

#### View hotspot cube

* show3DHotSpotMovingPoint([mf_arr], x_deg, y_deg, time_deg, max_height)

Show Hotspot cube for MovingPoint Array.

'x_deg' is how much divide longitude.

'y_deg' is latitude.

'time_deg' is seconds.

'max_height' is meters that assume how much maximum height. it can be omitted.(default 15000000)

```js
scene.primitives.add(show3DHotSpotMovingPoint(mf_arr, 1, 1, 3600));
```

e.g.

![hotspotPoint](http://i.imgur.com/AkUJEyX.png)

![hotspotPoint](http://i.imgur.com/tY0VT0R.jpg)

<IndoorGML and 3D HotSpot>

* show3DHotSpotMovingPolygon([mf_arr], x_deg, y_deg, time_deg, max_height)

Show Hotspot cube for MovingPoint Array.

The other descriptions are same as MovingPoint's.

```js
scene.primitives.add(show3DHotSpotMovingPolygon(mf_arr, 1, 1, 3600));
```


e.g.

![hotspotPolygon](http://i.imgur.com/3d8N5xE.png)




- - -

## Building

    Don't need to build



- - -

## Getting Started

> 1. Download Cesium.

> 2. Clone this Project and paste Cesium Folder.

> 3. Start Cesium Server - type "node server.js" in Cesium foler with console

> 4. localhost:8080/Apps/viewer.html?url='json path'
