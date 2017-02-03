# Cesium Examples

## License

Cesium Examples licensed under the [MIT](https://opensource.org/licenses/MIT)

## API

MovingFeatureOnCesium

### API references

#### Moving Feature On Cesium (MFOC)

---------------------------------

##### Visualize Movement

  * movePolygonArray([movingfeature_array], with_height);

movingfeature is moving feature json object array.

'with_height' means path of animation with own height.(boolean)

return czml.

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
      "datetimes" : [ "2015-07-30 03:00:00",.., "2015-08-11 03:00:00", "2015-08-11 09:00:00", "2015-08-11 15:00:00", "2015-08-11 21:00:00", "2015-08-12 03:00:00", "2015-08-12 09:00:00" ],
      "interpolations" : "Linear"
    } ]
  }
var mf_arr = [ mf1, mf2 ]; //mf is movingfeature object.
var czml = movePolygonArray(mf_arr);
```

  * movePointArray([mf_arr], with_height);

  * moveLineStringArray([mf_arr], with_height);

---------------------------------

##### Draw Primitive

  * drawPolygons([mf_arr], with_height)

draw multiple Polygon.

return Cesium.primitiveCollection

  * drawTyphoons([mf_arr], with_height)

draw multiple Polygon With Volume.

  * drawPoints([mf_arr], with_height)

draw multiple Point.

  * drawLines([mf_arr], with_height)

draw multiple LineString.

---------------------------------

##### view Properties graph

  * showProperty([obj_arr], div_id)

showProperties by d3 graph. (https://github.com/d3/d3/blob/master/API.md)

```js
<div id="graph" class="graph" > </svg>
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


## Building

    Don't need to build

## Getting Started

> 1. Download Cesium.

> 2. Clone this Project and paste Cesium Folder.

> 3. Start Cesium Server.("node server.js" in Cesium foler with console)

> 4. localhost:8080/Apps/viewer.html?url='json path'
