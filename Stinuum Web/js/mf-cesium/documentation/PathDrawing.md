
# Stinuum.PathDrawing

Draw the path of MovingFeatures using the temporalGeometry data

```js
var drawing = new Stinuum.PathDrawing(stinuum)
```
## Members

There is no member that user can access.

## Methods

```js
var options = {
    "temporalGeometry": feature.temporalGeometry,
    "id": feature.name
}
```
* __drawPathMovingPoint(options)__

Draw the path of MovingPoint using temporalGeometry data
If interpolation is Discrete or Step, using __drawMovingPoint(options)__.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| options |   Object   |        |  temporalGeometry data and feature name  |

&nbsp;

* __drawPathMovingPointCloud(options)__

Draw the path of MovingPointCloud using temporalGeometry data
If interpolation is Discrete or Step, using __drawMovingPointCloud(options)__.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| options |   Object   |        |  temporalGeometry data and feature name |

&nbsp;

* __drawPathMovingLineString(options)__

Draw the path of MovingLineString using temporalGeometry data
If interpolation is Discrete or Step, using __drawMovingLineString(options)__.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| options |   Object   |        |  temporalGeometry data and feature name  |

&nbsp;

* __drawPathMovingPolygon(options)__

Draw the path of MovingPolygon temporalGeometry data
If interpolation is Discrete or Step, using __drawMovingPolygon(options)__.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| options |   Object   |        |  temporalGeometry data and feature name  |

&nbsp;

* __drawMovingPoint(options)__

If the MovingFeatures type is MovingPoint and intrepolation is Discrete or Step, draw the each point using temporalGeometry data

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| options |   Object   |        |  temporalGeometry data and feature name  |

&nbsp;

* __drawMovingPointCloud(options)__

If the MovingFeatures type is MovingPointCloud and intrepolation is Discrete or Step, draw the each point using temporalGeometry

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| options |   Object   |        |  temporalGeometry data and feature name  |

&nbsp;

* __drawMovingLineString(options)__

If the MovingFeatures type is MovingLineString and intrepolation is Discrete or Step, draw the each line using temporalGeometry data

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| options |   Object   |        |  temporalGeometry data and feature name  |

&nbsp;

* __drawMovingPolygon(options)__

If the MovingFeatures type is MovingPolygon and intrepolation is Discrete or Step, draw the each polygon using temporalGeometry data

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| options |   Object   |        |  temporalGeometry data and feature name  |
