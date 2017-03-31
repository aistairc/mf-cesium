



# Stinuum

Stinuum is open API for JavaScript. You can visualize and analyze Moving Features JSON Data . Stinuum Description...

- - -

## Getting Started by Example

1. Download Cesium. (http://cesiumjs.org/downloads.html)

2. Clone this Project and paste project to Cesium Folder.

3. Install Node.js

4. Run the following command to install the dependencies:

  ```
  $ npm install
  ```
5. Start Cesium server

  ```
  $ node server.js
  ```
6. Enter http://localhost:8080/Apps/stinuum_example.html by browser(Chrome).

7. If you have url and token, please append "url=data_server_url?token=your_token"
Otherwise, drag and drop json file.


- - -

## Development Your Program

Download stinuum.js and add ``` <script src="stinuum.js"></script>``` your html file.

## OGC Moving Features Encoding Extension - JSON
https://ksookim.github.io/mf-json/

- - -

## License

Stinuum licensed under the [MIT](https://opensource.org/licenses/MIT)

## Reference

### Stinuum

```js
new Stinuum(viewer)
```
| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   viewer  |  Cesium.Viewer   |        |  Cesium.Viewer of Cesium Application.     |
#### Members

* __mode__ : String
Gets a present drawing and stinuum viewer mode. It will be 'STATICMAP' or 'SPACETIME' or 'ANIMATEDMAP'.
Default Value :`"STATICMAP"`


* __maxHeight__ : Number
Set maximum height in 'SPACETIME' mode.
Default Value : `30000000`


* __viewer__ : [Cesium.Viewer](https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html)
Point to Cesium.Viewer in foreward program.


* __geometryViewer__ : [Stinuum.GeometryViewer](https://github.com/aistairc/mf-cesium/blob/master/reference/GeometryViewer.md)
Gets the GeometryViewer. It used to visualize MovingFeatures.


* __mfCollection__ : [Stinuum.MFCollection](https://github.com/aistairc/mf-cesium/blob/master/reference/MFCollection.md)
Gets the mfCollection. It store MovingFeatures data and manage.



* __directionRadar__ : [Stinuum.DirectionRadar](https://github.com/aistairc/mf-cesium/blob/master/reference/DirectionRadar.md)
Gets the DirectionRadar. It used to determine Whether radar turns on or not.


* __temporalMap__ : [Stinuum.TemporalMap](https://github.com/aistairc/mf-cesium/blob/master/reference/TemporalMap.md)
Gets the TemporalMap.




* __occurrenceMap__ : [Stinuum.OccurrenceMap](https://github.com/aistairc/mf-cesium/blob/master/reference/OccurrenceMap.md)
Gets the OccurrenceMap.



* __propertyGraph__ : [Stinuum.PropertyGraph](https://github.com/aistairc/mf-cesium/blob/master/reference/PropertyGraph.md)
Gets the PropertyGraph.


#### Methods

* changeMode(mode)

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   mode  |  String   |        |  (optional) It should be 'STATICMAP' or 'SPACETIME' or 'ANIMATEDMAP'.     |




## Building

    Don't need to build



- - -
