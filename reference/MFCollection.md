# Stinuum.MFCollection

```js
var stinuum = new Stinuum(viewer);
console.log(stinuum.geometryViewer);
```

## Members

* `readonly` ___features___

Array of pairs who consist of Moving Feature object visualized present and id.

* `readonly` ___hiddenFeatures___

Array of pairs who consist of Moving Feature object hidden present and id.

## Methods

* __add(mf, id)__

Push new [Stinuum.MFPair(id, mf)](https://github.com/aistairc/mf-cesium/blob/master/reference/Stinuum.MFPair.md) into features.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   mf  |  MovingFeature JSON Object   |        |       |
| id | String | | (optional) Identifier of features. If undefined, mf.properties.name will be id.  |

&nbsp;

* __remove(mf)__

If mf is in features or hiddenFeatures, then remove its [Stinuum.MFPair](https://github.com/aistairc/mf-cesium/blob/master/reference/Stinuum.MFPair.md) from that array.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   mf  |  MovingFeature JSON Object   |        |       |

&nbsp;

* __removeById(id)__

Remove  [Stinuum.MFPair](https://github.com/aistairc/mf-cesium/blob/master/reference/Stinuum.MFPair.md) that has passed id.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  String   |        |   Identifier of feature    |

&nbsp;

* __refresh()__

Move all Stinuum.MFPair in hiddenFeatures to features.

&nbsp;

* __getWholeMinMax()__

Gets Minimum and Maximum of features in features(Array) and hiddenFeatures(Array).

&nbsp;

Return : `Object`
```js
{
      date : [Date, Date],
      x : [Number, Number],
      y : [Number, Number],
      z : [Number, Number]
}
```

&nbsp;

* __setColor(id, color)__

Set Cesium.Color corresponding to Moving Feature.


| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  String   |        |   Identifier of feature    |
| color | Cesium.Color | | color value|


&nbsp;

* __spliceByTime(start, end)__

Move Stinuum.MFPair whose feature have datetimes from start to end to features. Otherwise, move to hiddenFeatures.


| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   start  |  `Date`   |        |   start time   |
|   end  |  `Date`   |        |   end time    |

&nbsp;

* __getAllPropertyType()__

Gets all type of movingfeatures.
&nbsp;
Return : `Array` of property name

&nbsp;

* __reset()__

Remove all pairs in features and hiddenFeatures.

&nbsp;

* __hide(id)__

Move Stinuum.MFPair to hiddenFeatures


| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  String   |        |   Identifier of feature    |

&nbsp;

* __hideAll(id)__

Move All Stinuum.MFPair in features to hiddenFeatures except one pair.


| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  String   |        |   Identifier of feature    |

&nbsp;
