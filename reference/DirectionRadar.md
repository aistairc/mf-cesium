# Stinuum.DirectionRadar

```js
var stinuum = new Stinuum(viewer);
console.log(stinuum.directionRadar);
```

## Members


## Methods

* `static` drawBackRadar(canvasID)
Before drawing radar calculated, method draws background radar made by green dashed line.
&nbsp;
  Example :

```js
<canvas id="radar"></canvas>
...
Stinuum.DirectionRadar.drawBackRadar('radar');
```

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   canvasID  |  String   |        |  Id of `canvas` tag.     |


&nbsp;

* show(canvasID)
Calculate direction information of features in [Stinuum.mfCollection](https://github.com/aistairc/mf-cesium/blob/master/reference/MFCollection.md) and show radar to canvas. Browser should support canvas in order to draw DirectionRadar.
&nbsp;
Example :

```js
<canvas id="radar"></canvas>
...
stinuum.directionRadar.show('radar');
```

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   canvasID  |  String   |        |  Id of `canvas` tag.     |


&nbsp;

* remove(canvasID)
Hidden Radar.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   canvasID  |  String   |        |  Id of `canvas` tag.     |
