## Stinuum Web
- [Install Stinuum Web](Getting-Started-by-Example)
- After installing Stinuum Web, run app.js in the root folder with as below command  
```sh
$ cd Stinuum Web
$ npm install
$ node app.js
```
- The initial address is localhost:8080/  
  
    + To use MF-JSON file, click the _**"Move to main page"**_ button  
    + To connect the MF server, fill login form then click the _**"Login"**_ button  
  
![StinuumWeb](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/StinuumWeb.png)

## Contents

1. [Stinuum Main](#1-Stinuum-Main)  
   1.1\. [Upload](#11-Upload)  
   1.2\. [Layers](#12-Layers)  
   1.3\. [Animation widget](#13-Animation-widget)  
   1.4\. [SceneModePicker](#14-SceneModePicker)  
   1.5\. [Graph](#15-Graph)  
   1.6\. [T_query](#16-T_query)  
   1.7\. [Rader](#17-ader)  
   1.8\. [Image](#18-Image)  
   1.9\. [Text](#19-Text)  
   1.10\. [Server](#110-Server)  
2. [Stinuum Server](#2-Stinuum-Serve)  
   2.1\. [Login](#21-Login)  
   2.2\. [Get the MF-Collection](#22-Get-the-MF-Collection)  
   2.3\. [Send the MF-Collection data to main page](#23-Send-the-MF-Collection-data-to-main-page)  
   2.4\. [Get MovingFeature list](#24-Get-MovingFeature-list)  
   2.5\. [Get additional MovingFeatures](#25-Get-additional-MovingFeatures)  
***

## 1. Stinuum Main

- Stinuum main can visualize based on CesiumJS with the MF-JSON document  
  
- Stinuum main can use without connecting to the MF-Server  
  
- The features of Stinuum main are shown below figure  
  
![Main](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/Main.png)

***

## 1.1. Upload

- The Upload function uploads the MF-JSON file to using in Stinuum  
  
- Users can use it as below steps:  
  
    + Click the _**"UPLOAD"**_ button  
    + Drag and drop your MF-JSON file on the dropbox area  

  ![Upload](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/Upload.png)
  
***

## 1.2. Layers

- All moving features in Stinuum is managed by Layers.  
  
  + Collection Layer and Feature Layer.  
  
### Collection Layer
  
- When uploading a file, the MF-JSON's _**"name"**_ property value is added to the Collection Layer.  
  
  + If the _**"name"**_ property does not exist, it is displayed as the file name  
  
- When users click on an item (MovingFeatureCollection) in the Collection Layer, it adds a list of MovingFeatures in the Feature Layer.  
  
  + In this case, if MovingFeature’s _**"name"**_ property does not exist, Stinuum temporary makes a name by add number to the item name in the Collection Layer.  
  + ex) Item name in Collection Layer: **example_data** / Item name in Feature Layer: **example_data_1**
  
![Layer1](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/Layers1.png)  

### Feature Layer   
  
- When users click on an item (MovingFeature) in the Feature Layer  
  
    + The temporalGeometry of selected MovingFeature visualized on the map.
    + The temporalProperties of selected MovingFeature can view via clicking the _**"GRAPH"**_ and _**"IMAGE"**_ button.
  
![Layer2](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/Layers2.png)

***

## 1.3. Animation widget
  
- The Animation widget provides buttons for play, pause, and reverse, along with the current time and date for the movement of the selected MovingFeature, surrounded by a "shuttle ring" for controlling the speed of the animation.  
  
- The shuttle ring is capable of both fast and very slow playback.  
  
    + Click and drag the shuttle ring pointer itself (shown above in green).
    + Or click in the rest of the ring area to nudge the pointer to the next preset speed in that direction.
  
![AnimationWidget2](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/AnimationWidget2.gif)

***

## 1.4. SceneModePicker
  
- The SceneModePicker is a single button widget for switching between scene modes of CesiumJS.  
  
- Currently, it supports three scene modes as below table.  
  
![SceneModePicker1](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/SceneModePicker1.png)
  
![SceneModePicker2](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/SceneModePicker2.png)

***

## 1.5. Graph
  
- The Graph function provides a button for showing graphs according to the ParametricValues ​​data in temporalProperties of MF-JSON.  
  
    + Click the _**"GRAPH"**_ button to display a list of ​​whose type is _**"Measure"**_ and _**"Text"**_ ParametricValues  
  
        + If type is _**"Measure"**_, all values ​​of interpolation described in the MF-JSON standard can be used. e.g., _**"Discrete"**_, _**"Step"**_, _**"Linear"**_ and _**"Regression"**_
        + If type is _**"Text"**_, only _**"Discrete"**_ and _**"Step"**_ values ​​of interpolation can be used.
        + If type is _**"Image"**_, it can be supported by the Image function.

![Graph1](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/Graph1.png)
  
- If users have selected more than one ParametricValues, users can choose one of them ​at the top of the graph window.  
  
![Graph2](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/Graph2.png)
  
- If users select a specific region in the graph window, it creates a new time boundary based on the value of the corresponding x-axis (time). It then shows only a MovingFeature data corresponding to the new time boundary.  
  
![Graph3](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/Graph3.png)

***

## 1.6. T_query
  
- The T_Query function provides a button for restricting a temporalGeometry by a specific period.
  
    + It creates a time bar using the maximum and minimum times of the corresponding MovingFeature.
    + When changing the period of the time bar, the temporalGeometry changed according to a new time boundary.

![T_query](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/T_query.png)

***

## 1.7. Rader
  
- The Rader function provides a button for showing the overall information of MovingFeature.
   
    + It used the datetimes and coordinates values ​​of temporalGeometry. 
    + An arrow indicates the overall moving direction of MovingFeature.
    + The total moving distance, time, and average speed of MovingFeature are displayed.
  
![Rader](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/Rader.png)

***

## 1.8. Image

- The Image function provides a button for showing images according to the ParametricValues ​​data in temporalProperties of MF-JSON. 
  
    + It displays image data defined in ParametricValues ​​with an image viewer.
    + Click the _**"IMAGE"**_ button to display the ParametricValues ​​item whose type is _**"Image"**_.
    + Only _**"Discrete"**_ and _**"Step"**_ can be used among interpolation values.
  
- If users select one or more ParametricValues, users can choose them ​​at the top of the image window.
  
![Image](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/Image.png)

***

## 1.9. Text
  
### Text mode

- The Text function provides a button for the MF-JSON document, not the MF-JSON file. 
  
    + When clicking the _**"TEXT"**_ button, users can create or upload MF-JSON via text viewer.
    + If you click the _**"Upload"**_ button after writing a valid MF-JSON document, it added to the Collection Layer.
    + If you click the _**"Reset"**_ button, all data which users wrote in the text viewer is deleted.
  
![Text](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/Text.png)

***

## 1.10. Server
  
- The Server function provides a button for getting the MovingFeatureCollection (MF-Collection) data list from MF Server.
  
    + If clicking the _**"SERVER"**_ button, the browser moves to the data selection page (localhost:8080/dataSelect), where users can select MF-Collection data from the MF server.
    + If users didn't log in before, the browser moves to log in page (localhost:8080/).
  
![Server](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/Server.png)

***

## 2. Stinuum Server

- If users can connect to the MF-Server, Stinuum can get to MF data from MF-Server by [MF-API](https://dprtairc.github.io/pntml/mf-api.html )

***

## 2.1. Login
### Login to the server

- Users can log in to the server with login information on the start page (localhost:8080/)
  
- If users success to log in, the browser moves to the data selection page (localhost:8080/dataSelect)
  
![ServerLogin](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/ServerLogin.png)

***

## 2.2. Get the MF-Collection
  
- In the data selection page (localhost:8080/dataSelect), users can communicate with the server to get the MF-Collection
  
    + Firstly, enter a getting value of MF-Collection to import and click the _**"GET Server Data"**_ button.
  
        + The minimum of the getting value is 1.
        + The maximum of the getting value is 1000.
  
    + If it succeeds, the result is added to the bottom table.
  
![get](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/get.png)

***

## 2.3. Send the MF-Collection data to the main page

- Select one or more columns that users need to get the MovingFeature data and then enter the number of MovingFeatures.
  
    + The order of the MovingFeature list is ascending order depends on the _**"Number"**_ value.
  
- The sampling count shall be number between **1** to **1000**.
  
    + The sampling count means that the number of MovingFeature getting from a selected MF-Collection.
    + If the count of MoingFeature is over then the sampling count, it gets from the front of the MovingFeature list.
  
- Click the _**"Send Data"**_ button to sends the selected column values ​​to the main page (localhost:8080/main)
  
  
![get2](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/get2.png)

***

## 2.4. Get MovingFeature list
  
- Baed on MF-Collection data getting from MF-Server, the main page displays a list of MF-Collection title.
  
    + Select one or more the titles and then click the _**"SHOW"**_ button to get the MovingFeature data list.
  
- Add the MF-Collection data to the Collection Layer (detail describe in 1.2 Layers).
  
- When users click on an item in the Collection Layer, it adds a list of MovingFeatures in the Feature Layer.
  
- When users click on an item (MovingFeature) in the Feature Layer, 
  
    + The temporalGeometry of selected MovingFeature visualized on the map.
    + The temporalProperties of selected MovingFeature can view via clicking the Graph and Image button.
  
  ![get3](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/get3.png)

***

## 2.5. Get additional MovingFeatures
  
- When the _**"ADD"**_ button is clicked, an additional 10 MovingFeatures data are added to the corresponding layer (via the process described in [Get MovingFeature list](#24-Get-MovingFeature-list)).
  
  ![get5](https://github.com/aistairc/geograsp/blob/stinuum-web/Stinuum%20Web/js/mf-cesium/documentation/image/get5.png)
