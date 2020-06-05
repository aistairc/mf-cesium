# STINUUM (Spatio-Temporal continua on Cesium)

STINUUM is a JavaScript library to visualize and analyze moving objects on [Cesium](https://cesiumjs.org).
STINUUM imports OGC Moving Features JSON data and supports animated maps as well as static maps and a space-time cube for navigating the trajectory of moving objects over space and time. The main characteristics of STINUUM are as follows:
- Diverse geometry types to represent movements
- Multiscale data analysis in space and time
- Highly accessibility and lightweight deployment

## OGC Moving Features Encoding Extension - JSON
The current version of STINUUM allows only the OGC Moving Features JSON format. About the data format, please refer to:
https://docs.opengeospatial.org/is/19-045r3/19-045r3.html

- - -

## Getting Started by Example

1. Clone this project.

```
$ git clone http://github.com/aistairc/mf-cesium
```

2. Install Node.js and run the following command to install the dependencies at the previous folder :

  ```
  $ cd Stinuum Web
  $ npm install
  ```
3. If you have BingMapsApi Key, add it to __/Stinuum Web/views/demo.ejs__ file. 
  ```js
  /* line 183 */
  defaultKey = "your_BingMapsApi Key"
  ```
4. Start Cesium server

  ```
  $ node app.js
  ```
5. Enter http://localhost:8080 on your browser (Recommend [Chrome](https://www.google.com/intl/ko/chrome/)).

6. Usage of [Stinuum Web](https://github.com/aistairc/geograsp/wiki/Stinuum-Web-Manual)

- - -

## Development Your Program

Download stinuum.js and add ``` <script src="stinuum.js"></script>``` to your a html file.

- - -

## License

STINUUM licensed under the [MIT](https://opensource.org/licenses/MIT)

## Reference

### STINUUM

```js
var viewer = new Cesium.Viewer;
var stinuum = new Stinuum(viewer)
```
| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   viewer  |  Cesium.Viewer   |        |  Cesium.Viewer of a Cesium Application.     |
#### Members

* __viewer__ : [Cesium.Viewer](https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html)

The reference of a base widget of Cesium.Viewer.


* __mode__ : String

To Get the stinuum mode of the current viewer.

There are three modes: '__STATICMAP__', '__SPACETIME__', and '__ANIMATEDMAP__'.

Default Value :`"STATICMAP"`


* __geometryViewer__ : [Stinuum.GeometryViewer](https://github.com/aistairc/geograsp/tree/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/GeometryViewer.md)

To Get the GeometryViewer. It used to visualize MovingFeatures.


* __mfCollection__ : [Stinuum.MFCollection](https://github.com/aistairc/geograsp/tree/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/MFCollection.md)

To Get the mfCollection. It store MovingFeatures data and manage.


* __directionRadar__ : [Stinuum.DirectionRadar](https://github.com/aistairc/geograsp/tree/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/DirectionRadar.md)

To Get the DirectionRadar. It used to determine Whether radar turns on or not.

If you want to see direction radar, make `<div>` tag for radar visualization then access this memeber.


* __temporalMap__ : [Stinuum.TemporalMap](https://github.com/aistairc/geograsp/tree/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/TemporalMap.md)

To Get the TemporalMap. It can draw temporal thematic map.


* __propertyGraph__ : [Stinuum.PropertyGraph](https://github.com/aistairc/geograsp/tree/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/PropertyGraph.md)

To Get the PropertyGraph.

If you want to see graph about property, make `<div>` tag for graph visualization then access this memeber.

* __imageMarking__ : [Stinuum.Imagemarking](https://github.com/aistairc/geograsp/tree/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/Imagemarking.md)

To Get the Imagemarking.

If you want to see image about property, make `<div>` tag for image visualization then access this memeber.

* __pathDrawing__ : [Stinuum.PathDrawing](https://github.com/aistairc/geograsp/tree/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/PathDrawing.md)

To Get the path of MovingFeatures. It is made using the temporalGeometry and czml format.


* __movementDrawing__ : [Stinuum.MovementDrawing](https://github.com/aistairc/geograsp/tree/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/MovementDrawing.md)

To Get the movement data from the MovingFeature. It is made using the temporalGeometry and [czml](https://github.com/AnalyticalGraphicsInc/czml-writer) format.



#### Methods

* __changeMode(mode)__

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   mode  |  String   |        |  (optional) It SHOULD be one of 'STATICMAP', 'SPACETIME', and 'ANIMATEDMAP'.  |


## Building

    Don't need to build

- - -
