
# Stinuum.MovementDrawing

Make the MovingObject using the czml format and temporalGeometry data of MovingFeature.

```js
var moving = new Stinuum.MovementDrawing(stinuum)
```
## Members

There is no member that user can access.

## Methods

```js
var options = {
    "temporalGeometry": feature.temporalGeometry,
    "number": countNumber,
    "id": feaure.name
}
```

* __moveMovingPoint(options)__

Make the czml format using temporalGeometry data of MovingFeature that type is MovingPoint

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| options |   Object   |        |  temporalGeometry data and id of MovingFeature |


&nbsp;

* __moveMovingPointCloud(options)__

Make the czml format using temporalGeometry data of MovingFeature that type is MovingPointCloud

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| options |   Object   |        | temporalGeometry data and id of MovingFeature |


&nbsp;

* __moveMovingLineString(options)__

Make the czml format using temporalGeometry data of MovingFeature that type is MovingLineString

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| options |   Object   |        |  temporalGeometry data and id of MovingFeature |


&nbsp;

* __moveMovingPolygon(options)__

Make the czml format using temporalGeometry data of MovingFeature that type is MovingPolygon

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| options |   Object   |        | temporalGeometry data and id of MovingFeature |


&nbsp;
