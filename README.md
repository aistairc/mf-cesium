


<!-- toc orderedList:0 depthFrom:1 depthTo:6 -->

* [Stinuum](#stinuum)
  * [Getting Started by Example](#getting-started-by-example)
  * [Development Your Program](#development-your-program)
  * [License](#license)
  * [Reference](#reference)
    * [Stinuum](#stinuum-1)
      * [Members](#members)
      * [Methods](#methods)
  * [Building](#building)

<!-- tocstop -->

# Stinuum

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

Download stinuum.js and add ``` <script reference="stinuum.js"></script>``` your html file.

- - -

## License

Stinuum licensed under the [MIT](https://opensource.org/licenses/MIT)

## Reference

### Stinuum

```js
new Stinuum(viewer)
```

#### Members

* mode : String

&nbsp;&nbsp;&nbsp;&nbsp;Gets a present drawing and stinuum viewer mode. It will be 'STATICMAP' or 'SPACETIME' or 'ANIMATEDMAP'.
&nbsp;&nbsp;&nbsp;&nbsp;Default Value : ```"STATICMAP"```

* maxHeight : Number
&nbsp;&nbsp;&nbsp;&nbsp;Set maximum height in 'SPACETIME' mode.
&nbsp;&nbsp;&nbsp;&nbsp;Default Value : ```30000000```

* viewer : [Cesium.Viewer](https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html)

&nbsp;&nbsp;&nbsp;&nbsp;Point to Cesium.Viewer in foreward program.

* geometryViewer : [Stinuum.GeometryViewer](https://github.com/aistairc/mf-cesium/reference/blob/master/GeometryViewer.md)


&nbsp;&nbsp;&nbsp;&nbsp;

* mfCollection : [Stinuum.MFCollection](https://github.com/aistairc/mf-cesium/reference/blob/master/MFCollection.md)

&nbsp;&nbsp;&nbsp;&nbsp;

* directionRadar : [Stinuum.DirectionRadar](https://github.com/aistairc/mf-cesium/reference/blob/master/DirectionRadar.md)

&nbsp;&nbsp;&nbsp;&nbsp;

* temporalMap : [Stinuum.TemporalMap](https://github.com/aistairc/mf-cesium/reference/blob/master/TemporalMap.md)

&nbsp;&nbsp;&nbsp;&nbsp;



* occurrenceMap : [Stinuum.OccurrenceMap](https://github.com/aistairc/mf-cesium/reference/blob/master/OccurrenceMap.md)

&nbsp;&nbsp;&nbsp;&nbsp;


* propertyGraph : [Stinuum.PropertyGraph](https://github.com/aistairc/mf-cesium/reference/blob/master/PropertyGraph.md)

&nbsp;&nbsp;&nbsp;&nbsp;

#### Methods

* changeMode(mode)

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   mode  |  String   |        |  (optional) It should be 'STATICMAP' or 'SPACETIME' or 'ANIMATEDMAP'.     |




## Building

    Don't need to build



- - -
