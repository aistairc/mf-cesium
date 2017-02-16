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


#### How to Use API

> #### Create new MFOC Object

* new MFOC(viewer)

먼저 Cesium.Viewer 객체를 생성하고 MFOC 객체의 생성자에 만든 Viewer를 넘겨준다.  
| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| viewer    | Cesium.Viewer     |        |        |


Example

```js
var viewer = new Cesium.Viewer('cesiumContainer', { });
var mfoc = new MFOC(viewer);
```


  <br />  <br />


> #### Add Moving Features

* add(movingFeature)

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   movingFeature  |  JSON Object   |        |        |

Returns:
현재 가지고 있는 feature 개수

Example
```js
$.getJSON('json_data/polygon2015.json').then(
      function(data){

        for (var i = 0 ; i < data.features.length ; i++){
          mfoc.add(data.features[i]);
        }
      }
    );
```

  <br />  <br />

> #### Moving Feature Visualization


* drawFeatures(options)

인자가 없다면 가지고 있는 모든 Moving Feature의 각 time의 Geometry를 그립니다.

    MovingPoint -> Point
    MovingPolygon -> Polygon
    MovingLineString -> Polyline

의 집합으로 그려집니다.

그린 뒤에 Camera를 이동합니다.
```
options = {
  name : String
}
```
| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   name  |  String   |        |   (properties.name) 만약 이 이름을 가진 movingfeature를 MFOC객체가 가지고 있다면 ( add 한 상태) 그 feature만 그립니다.     |

Returns:
Null

Example

```js
mfoc.drawFeatures();
```
or
```js
mfoc.drawFeatures('台風201513号 (LINEAR) ');
```

  </br>

* drawPaths(options)

인자가 없다면 가지고 있는 모든 movingfeature들의 path를 그립니다.

      MovingPoint -> Line
      MovingPolygon -> Volume
      MovingLineString -> Triangle Set

로 그려집니다.


그린 뒤에 Camera를 이동합니다.
```
options = {
  name : String
}
```
| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   name  |  String   |        |   (properties.name) 만약 이 이름을 가진 movingfeature를 MFOC객체가 가지고 있다면 ( add 한 상태) 그 feature의 path만 그립니다.     |

Example
```js
mfoc.drawPaths();
```
or
```js
mfoc.drawPaths('台風201513号 (LINEAR) ');
```
  </br>

* highlight(movingFeatureName, propertyName)

movingfeature의 색상을 선택된 Property 의 value를 반영하도록 변경합니다.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   movingFeatureName  |  String   |        |  (properties.name) 무빙 피처의 이름   |
|   propertyName  |  String   |        |   (temporalProperties[i].name) temporalProperties 요소의 이름     |

Example
```js
mfoc.highlight('台風201513号 (LINEAR) ','central pressure');
```

  </br>

* clearViewer()

화면에 출력된 primitives를 전부 지웁니다.
진행중인 애니메이션을 제거 합니다.
MFOC가 가지고 있는 movingfeature 데이터는 지워지지 않습니다.

Example
```js
mfoc.clearViewer();

mfoc.drawPaths(); //mfoc에 들어있는 mf들이 다시 그려집니다.
```

</br>

* animate(options)

가지고 있는 모든 무빙 피처를 animation합니다.


```
options = {
  name : String
}
```
| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   name  |  String   |        |   (properties.name) 만약 이 이름을 가진 movingfeature를 MFOC객체가 가지고 있다면 ( add 한 상태) 그 feature의 animation만을 그립니다.     |

Example
```js
mfoc.animate();
```
or
```js
mfoc.animate('台風201513号 (LINEAR) ');
```
  </br>

* clearAnimation()

진행중인 애니메이션을 제거합니다.
primitive는 제거되지 않습니다.

  </br>

* changeMode(mode)

그리는 mode('2D','3D') 를 변경합니다. 인자가 없다면 현재 모드와 다른 모드로 변경됩니다.

mode 변경후에 primitives를 지우고 다시 그려주어야 모드가 적용된 그림을 볼 수 있습니다.

    '2D' : movingfeature visualization doesn't have height.
    '3D' : movingfeature visualization has height.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   mode  |  String   |        |   '2D' or '3D'     |

Example
```js
mfoc.changeMode();
mfoc.clearViewer();
mfoc.drawPaths();
```
or

```js
mfoc.changeMode('2D');
mfoc.clearViewer();
mfoc.drawPaths();
```


</br>  </br> </br>  </br>
> #### Control Feature Data

* remove(movingFeature)

해당 movingfeature 의 정보를 MFOC객체에서 모두 제거하고 화면에 그려진 primitives를 지웁니다.

animation은 제거되지 않습니다. 진행중인 animation을 제거하고 다시 animation을 만들어야 합니다.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   movingFeature  |  JSON Object   |        |  지워질 무빙 피처   |

Example
```js
mfoc.remove(mf);
```
</br>
* removeByName(name)

해당 movingfeature 의 정보를 MFOC객체에서 모두 제거하고 화면에 그려진 primitives를 지웁니다.

animation은 제거되지 않습니다. 진행중인 animation을 제거하고 다시 animation을 만들어야 합니다.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   movingFeatureName  |  String   |        |  지워질 무빙 피처의 name   |

Example
```js
mfoc.removeByName('MF name');
```

  </br>

* reset()

MFOC 객체를 초기화 합니다.


 </br>  </br> </br>  </br>
> #### Moving Feature Statistic

* showHOTSPOT(degree)

가지고 있는 movingFeature들의 temporalGeometry를 분석하여 HotSpot을 출력합니다.

```
degree = {
  x : Number,
  y : Number,
  time : Number
}
```
| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   x  |  Number   |        |  degree of x   |
|   y  |  Number   |        |  degree of y   |
|   time  |  Number   |        |  degree of time(seconds)  |

Example
```js
mfoc.showHOTSPOT({
  x : 10,
  y : 10,
  time : 1500000
})
```

  </br>

* removeHOTSPOT()

핫스팟 큐브들을 지웁니다.

Example
```js
mfoc.removeHOTSPOT()
```

  </br>


* showProperty(propertyName, divID)

가지고 있는 movingFeature들의 temporalProperties를 분석하여 그래프를 출력한다.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   propertyName  |  String   |        |  분석할 property name   |
|   divID  |  String   |        |  그래프를 그릴 html div태그의 id   |

Example
```js
<div id="graph" class="graph" >
...
mfoc.showProperty('central pressure', 'graph');
```

만약 axis의 색상을 바꾸고 싶으면 다음과 같은 css코드를 추가한다.

```css
  .axis text{
    fill : red;
  }

  .axis line{
    stroke : red;
  }

  .axis path{
    stroke : red;
  }
```

  </br>

* analyzeSpatialInfo(canvasID)

canvas tag의 id를 받아 분석한 movement,velocity,life 정보를 화살표로 그립니다.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   canvasID  |  String   |        |  canvas tag id   |

Example

```js
<canvas id="canvas" width="300" height="300" style="background-color: transparent; border: 1px solid black;">
...
mfoc.analyzeSpatialInfo('canvas');
```


- - -

## Building

    Don't need to build



- - -

## Getting Started

> 1. Download Cesium.

> 2. Clone this Project and paste Cesium Folder.

> 3. Start Cesium Server - type "node server.js" in Cesium foler with console

> 4. localhost:8080/Apps/mfoc_test.html
