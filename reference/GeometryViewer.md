# Stinuum.GeometryViewer

```js
var stinuum = new Stinuum(viewer);
console.log(stinuum.geometryViewer);
```

## Members

There is no member that user can access.

## Methods

* __update()__

If there is any feature in Stinuum.MFCollection.features, then visualize them.

&nbsp;

* __clear()__

Clear Cesium.Viewer, but MfCollection is not changed.

&nbsp;

* __clickMovingFeature(id)__

Make highlight of certain feature such as mouse click.

Example :
```js
var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
handler.setInputAction(function(movement) {
  var pick = scene.pick(movement.position);
  if (Cesium.defined(pick)) {
    if(pick.primitive.id !== undefined){
      stinuum.geometryViewer.clickMovingFeature(pick.primitive.id);
    }
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
```
