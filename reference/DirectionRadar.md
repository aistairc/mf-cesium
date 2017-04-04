# Stinuum.DirectionRadar

```js
var stinuum = new Stinuum(viewer);
console.log(stinuum.directionRadar);
```

## Members


## Methods

* `static` ___drawBackRadar(canvasID)___

Before drawing radar calculated, method draws background radar made by green dashed line.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   canvasID  |  String   |        |  Id of `canvas` tag.     |

Example :

```js
<canvas id="radar"></canvas>
...
Stinuum.DirectionRadar.drawBackRadar('radar');
```


&nbsp;

* __show(canvasID)__

Calculate direction information of features in [Stinuum.mfCollection](https://github.com/aistairc/mf-cesium/blob/master/reference/MFCollection.md) and show radar to canvas. Browser should support canvas in order to draw DirectionRadar.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   canvasID  |  String   |        |  Id of `canvas` tag.     |


Example :

```js
<canvas id="radar"></canvas>
...
stinuum.directionRadar.show('radar');
```


&nbsp;

* __remove(canvasID)__

Hidden Radar.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   canvasID  |  String   |        |  Id of `canvas` tag.     |
