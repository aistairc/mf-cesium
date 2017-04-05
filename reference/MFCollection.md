# Stinuum.MFCollection

To Contain Moving Feature Data in Stinuum Object and determine which features will be visualized.

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

Push new [MFPair(id, mf)](https://github.com/aistairc/mf-cesium/blob/master/reference/MFPair.md) into __features__.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   mf  |  MovingFeature JSON Object   |        |       |
| id | String | | (optional) Identifier of features. If undefined, mf.properties.name will be id.  |

&nbsp;

* __remove(mf)__

If mf is in __features__ or __hiddenFeatures__, then remove its [MFPair](https://github.com/aistairc/mf-cesium/blob/master/reference/MFPair.md) from that array.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   mf  |  MovingFeature JSON Object   |        |       |

&nbsp;

* __removeById(id)__

Remove  [__MFPair__](https://github.com/aistairc/mf-cesium/blob/master/reference/MFPair.md) that has passed id.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  String   |        |   Identifier of feature    |

&nbsp;

* __refresh()__

Move all __MFPair__ in hiddenFeatures to __features__.

&nbsp;

* __getWholeMinMax()__

Get Minimum and Maximum of feature of each __MFPair__ in __features__ and __hiddenFeatures__.

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

Set __Cesium.Color__ corresponding to the Moving Feature if you want certain color. But, Stinuum automatically determine colors of features, so we recommend that you do not invoke this method except special cases.


| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  String   |        |   Identifier of feature    |
| color | Cesium.Color | | color value |


&nbsp;

* __spliceByTime(start, end)__

Move __MFPair__ whose feature have datetimes from start to end to __features__. Otherwise, move to __hiddenFeatures__.


| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   start  |  `Date`   |        |   start time   |
|   end  |  `Date`   |        |   end time    |

&nbsp;

* __getAllPropertyType()__

Gets all type of Moving Features.

Return : `Array of String`

Example :

```js
var arr = stinuum.mfCollection.getAllPropertyType();
arr.toString(); //['speed','temperature',...]
```

&nbsp;

* __reset()__

Remove all pairs in __features__ and __hiddenFeatures__.

&nbsp;

* __hide(id)__

Move __MFPair__ to __hiddenFeatures__. The feature of that pair will not be drawn and removed during next __Stinuum.geometryViewer.update()__.


| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  String   |        |   Identifier of feature    |

&nbsp;

* __hideAll(id)__

Move All __MFPair__ in __features__ to __hiddenFeatures__ except one pair corresponding to passed id.


| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  String   |        |   Identifier of feature    |

&nbsp;
