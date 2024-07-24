## Stinuum Web
- [Install Stinuum Web](Getting-Started-by-Example)
- After installing Stinuum Web, run app.js in the root folder with as below command
```sh
$ cd Stinuum Web
$ npm install
$ node app.js
```
- The initial address is localhost:8080/


## Contents

1. [Stinuum Main](#1-Stinuum-Main)  
   1.1\. [Upload](#11-Upload)  
   1.2\. [Layers](#12-Layers)  
   1.3\. [Animation widget](#13-Animation-widget)  
   1.4\. [SceneModePicker](#14-SceneModePicker)  
   1.5\. [Graph](#15-Graph)  
   1.6\. [Slice](#16-Slice)  
   1.7\. [Rader](#17-Rader)  
   1.8\. [Image](#18-Image)  
   1.9\. [Text](#19-Text)
2. [Stinuum with OGC API - MovingFeatures Server(MF-API Server)](#2-stinuum-with-ogc-api---movingfeatures-servermf-api-server)  
   2.1\. [Get the MovingFeatureCollection](#21-get-the-movingfeaturecollection)  
   2.2\. [Send the MovingFeatureCollection data to main page](#22-send-the-movingfeaturecollection-data-to-the-main-page)  
   2.3\. [Get MovingFeature list](#23-get-movingfeature-list)  
   2.4\. [Get additional MovingFeatures](#24-get-additional-movingfeatures)
***

## 1. Stinuum Main

- Stinuum main can visualize based on CesiumJS with the MovingFeature-JSON document

- Stinuum main can use without connecting to the MF-API Server

- The features of Stinuum main are shown below figure

![Main](https://github.com/aistairc/mf-cesium/assets/17999237/4d5b30b4-5677-4bf9-8b30-4dfffd8a58c0)

***

## 1.1. Upload

- The Upload function uploads the MovingFeature-JSON file to using in Stinuum

- Users can use it as below steps:

    + Click the _**"UPLOAD"**_ button
    + Drag and drop your MovingFeature-JSON file on the dropbox area

![Upload](https://github.com/aistairc/mf-cesium/assets/17999237/683f53c5-03c0-4a89-823d-49a7c20b065b)

***

## 1.2. Layers

- All moving features in Stinuum is managed by Layers.

    + Collection Layer and Feature Layer.

### Collection Layer

- When uploading a file, the MovingFeature-JSON's _**"name"**_ property value is added to the Collection Layer.

    + If the _**"name"**_ property does not exist, it is displayed as the file name

- When users click on an item (MovingFeatureCollection) in the Collection Layer, it adds a list of MovingFeatures in the Feature Layer.

    + In this case, if MovingFeature’s _**"name"**_ property does not exist, Stinuum temporary makes a name by add number to the item name in the Collection Layer.
    + ex) Item name in Collection Layer: **example_data** / Item name in Feature Layer: **example_data_1**

![Layers1](https://github.com/aistairc/mf-cesium/assets/17999237/a8618954-0014-4190-aee0-85b47bdfd5da)

### Feature Layer

- When users click on an item (MovingFeature) in the Feature Layer

    + The temporalGeometry of selected MovingFeature visualized on the map.
    + The temporalProperties of selected MovingFeature can view via clicking the _**"GRAPH"**_ and _**"IMAGE"**_ button.

![Layers2](https://github.com/aistairc/mf-cesium/assets/17999237/25589ef0-caa4-4a3e-ba39-bf9e519d94fd)

***

## 1.3. Animation widget

- The Animation widget provides buttons for play, pause, and reverse, along with the current time and date for the movement of the selected MovingFeature, surrounded by a "shuttle ring" for controlling the speed of the animation.

- The shuttle ring is capable of both fast and very slow playback.

    + Click and drag the shuttle ring pointer itself (shown above in green).
    + Or click in the rest of the ring area to nudge the pointer to the next preset speed in that direction.

![AnimationWidget2](https://github.com/aistairc/mf-cesium/assets/17999237/41fe49ee-ba3a-463a-8f4f-b0530a39d255)

***

## 1.4. SceneModePicker

- The SceneModePicker is a single button widget for switching between scene modes of CesiumJS.

- Currently, it supports three scene modes as below table.

![SceneModePicker1](https://github.com/aistairc/mf-cesium/assets/17999237/dfe8c001-ae1a-4eac-8fd0-0539ce2564d3)
![SceneModePicker2](https://github.com/aistairc/mf-cesium/assets/17999237/f792f848-89b7-426d-a99f-6786aa8c900e)

***

## 1.5. Graph

- The Graph function provides a button for showing graphs according to the ParametricValues ​​data in temporalProperties of MovingFeature-JSON.

    + Click the _**"GRAPH"**_ button to display a list of ​​whose type is _**"Measure"**_ and _**"Text"**_ ParametricValues

        + If type is _**"Measure"**_, all values ​​of interpolation described in the MovingFeature-JSON standard can be used. e.g., _**"Discrete"**_, _**"Step"**_, _**"Linear"**_ and _**"Regression"**_
        + If type is _**"Text"**_, only _**"Discrete"**_ and _**"Step"**_ values ​​of interpolation can be used.
        + If type is _**"Image"**_, it can be supported by the Image function.

![Graph1](https://github.com/aistairc/mf-cesium/assets/17999237/813efc3b-5db3-428a-95d4-985cd10d1c44)

- If users have selected more than one ParametricValues, users can choose one of them ​at the top of the graph window.

![Graph2](https://github.com/aistairc/mf-cesium/assets/17999237/76ea9b3c-1081-4d17-8cbd-d399dc5a1a93)

- If users select a specific region in the graph window, it creates a new time boundary based on the value of the corresponding x-axis (time). It then shows only a MovingFeature data corresponding to the new time boundary.

![Graph3](https://github.com/aistairc/mf-cesium/assets/17999237/fad17243-619c-478e-a71d-2047097b1d8b)


***

## 1.6. Slice

- The Slice function provides a button for restricting a temporalGeometry by a specific period.

    + It creates a time bar using the maximum and minimum times of the corresponding MovingFeature.
    + When changing the period of the time bar, the temporalGeometry changed according to a new time boundary.

![Slice](https://github.com/aistairc/mf-cesium/assets/17999237/afd70bbf-b790-42d0-9ba2-fe2fb2436d7d)

***

## 1.7. Rader

- The Rader function provides a button for showing the overall information of MovingFeature.

    + It used the datetimes and coordinates values ​​of temporalGeometry.
    + An arrow indicates the overall moving direction of MovingFeature.
    + The total moving distance, time, and average speed of MovingFeature are displayed.

![Rader](https://github.com/aistairc/mf-cesium/assets/17999237/9ae8cbe3-5d19-42e8-a285-bd1cc557c501)

***

## 1.8. Image

- The Image function provides a button for showing images according to the ParametricValues ​​data in temporalProperties of MovingFeature-JSON.

    + It displays image data defined in ParametricValues ​​with an image viewer.
    + Click the _**"IMAGE"**_ button to display the ParametricValues ​​item whose type is _**"Image"**_.
    + Only _**"Discrete"**_ and _**"Step"**_ can be used among interpolation values.

- If users select one or more ParametricValues, users can choose them ​​at the top of the image window.

![Image](https://github.com/aistairc/mf-cesium/assets/17999237/7738b6ba-8298-4552-8ff3-198968512568)

***

## 1.9. Text

### Text mode

- The Text function provides a button for the MovingFeature-JSON document, not the MovingFeature-JSON file.

    + When clicking the _**"TEXT"**_ button, users can create or upload MovingFeature-JSON via text viewer.
    + If you click the _**"Upload"**_ button after writing a valid MovingFeature-JSON document, it added to the Collection Layer.
    + If you click the _**"Reset"**_ button, all data which users wrote in the text viewer is deleted.

![Text](https://github.com/aistairc/mf-cesium/assets/17999237/091df9cb-bd8d-4593-8669-7542ec941e52)

***



***

## 2. Stinuum with OGC API - MovingFeatures Server(MF-API Server)

- If users can connect to the MF-API Server, Stinuum can get to MovingFeatureCollection data from MF-API Server using [MF-API](https://opengeospatial.github.io/ogcapi-movingfeatures/openapi/openapi-movingfeatures-1.html)
- The Server function provides a button for getting the MovingFeatureCollection data list from MF-API Server.

    + If clicking the _**"SERVER"**_ button, the browser moves to the data selection page (localhost:8080/dataSelect), where users can select MovingFeatureCollection data from the MF server.

![Server-1](https://github.com/aistairc/mf-cesium/assets/17999237/5e95bcc4-a3ea-4041-9ce9-642723ad6636)

***

## 2.1. Get the MovingFeatureCollection

- In the data selection page (localhost:8080/dataSelect), users can communicate with the server to get the MovingFeatureCollection

    + Click the _**"GET MovingFeatureCollection"**_ button.

        + Receive the whole data of MovingFeatureCollection from MF-API Server

    + If it succeeds, the result is added to the bottom table.

![Server-2](https://github.com/aistairc/mf-cesium/assets/17999237/a0661477-e08b-4dec-89f7-b5d70619c79f)

***

## 2.2. Send the MovingFeatureCollection data to the main page

- Select one or more rows that users need to get the MovingFeature data.
- And then click the _**"Send MovingFeatureCollection"**_ button to sends the selected column values ​​to the main page (localhost:8080/main)

![Server-3](https://github.com/aistairc/mf-cesium/assets/17999237/e1717783-f714-4111-8d45-487dc1c20b17)

***

## 2.3. Get MovingFeature list

- Based on MovingFeatureCollection data getting from MF-API Server, the main page displays a list of MovingFeatureCollection title.

    + Select one or more the titles and then click the _**"SHOW"**_ button to get the MovingFeature data list.

- Add the MovingFeatureCollection data to the Collection Layer (detail describe in [1.2 Layers](#12-layers)).

- When users click on an item in the Collection Layer, it adds a list of MovingFeatures in the Feature Layer.

- When users click on an item (MovingFeature) in the Feature Layer,

    + The temporalGeometry of selected MovingFeature visualized on the map.
    + The temporalProperties of selected MovingFeature can view via clicking the Graph and Image button.

![Server-4](https://github.com/aistairc/mf-cesium/assets/17999237/86c66f59-4cbd-4607-a3db-69145bac7196)

***


## 2.4. Get additional MovingFeatures

- When the _**"ADD"**_ button is clicked, it will fetch the next five pieces of MovingFeature data and add them to the corresponding layer (via the process described in [Get MovingFeature list](#23-get-movingfeature-list)).

![Server-5](https://github.com/aistairc/mf-cesium/assets/17999237/49e58a75-40f4-441d-b1a4-970a7ec18b72)