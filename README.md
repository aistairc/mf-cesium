



# Stinuum

Stinuum is a JavaScript library to visualize and analyze moving objects on [Cesium](https://cesiumjs.org).
Stinuum imports OGC Moving Features JSON data and supports animated maps as well as static maps and a space-time cube for navigating the trajectory of moving objects over space and time. The main characteristics of Stinuum are as follows:
- Diverse geometry types to represent movements
- Multiscale data analysis in space and time
- Highly accessibility and lightweight deployment

## OGC Moving Features Encoding Extension - JSON
https://ksookim.github.io/mf-json/

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
6. Enter http://localhost:8080/Apps/stinuum_example.html on your browser (Chrome).

7. If you have the information of url and token to access a data server that provides RESTful API as descrbied in [OGC Moving Features Encoding Extension - JSON](https://ksookim.github.io/mf-json/), please append "?url=data_server_url&token=your_token"
Otherwise, you can drag and drop json files to explore the data.


- - -

## Development Your Program

Download stinuum.js and add ``` <script src="stinuum.js"></script>``` to your a html file.

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
|   viewer  |  Cesium.Viewer   |        |  Cesium.Viewer of a Cesium Application.     |
#### Members

* __viewer__ : [Cesium.Viewer](https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html)
The reference of a base widget of Cesium.Viewer.


* __mode__ : String
To Get the stinuum mode of the current viewer. There are three modes: 'STATICMAP', 'SPACETIME', and 'ANIMATEDMAP'.
Default Value :`"STATICMAP"`


* __maxHeight__ : Number
To Set the maximum height in 'SPACETIME' mode.
Default Value : `30000000`


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
|   mode  |  String   |        |  (optional) It SHOULD be one of 'STATICMAP', 'SPACETIME', and 'ANIMATEDMAP'.  |




## Building

    Don't need to build



- - -
