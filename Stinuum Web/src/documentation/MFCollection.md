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

Push new [Stinuum.MFPair(id, mf)](https://github.com/aistairc/mf-cesium/blob/master/reference/Stinuum.MFPair.md) into __features__.


| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   mf  |  Object   |        |    MovingFeature JSON    |
| id | String | | (optional) Identifier of features. If undefined, mf.properties.name will be id.  |

&nbsp;

* __remove(mf)__

If mf is in __features__ or __hiddenFeatures__, then remove its [Stinuum.MFPair](https://github.com/aistairc/mf-cesium/blob/master/reference/Stinuum.MFPair.md) from that array.


| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   mf  |  Object   |        |    MovingFeature JSON   |

&nbsp;

* __removeById(id)__

Remove  [Stinuum.MFPair](https://github.com/aistairc/mf-cesium/blob/master/reference/Stinuum.MFPair.md) that has passed id.


| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  String   |        |   Identifier of feature    |

&nbsp;

*__removeByIndexInFeatures(index)__

Remove that has passed index in __features__.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  Number   |        |   Identifier of feature    |

&nbsp;


* __removeByIndexInWhole(index)__

Remove that has passed index in __wholeFeatures__.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  Number   |        |   Identifier of wholeFeatures    |


&nbsp;


* __inFeaturesIndexOfById(id)__

Find index that has passed id in __feature__.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  String   |        |   Identifier of feature    |

&nbsp;

* __inWholeIndexOfById(id)__

Find index that has passed id in __wholeFeature__.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  String   |        |   Identifier of wholeFeatures    |

&nbsp;

* __inFeaturesIndexOf(mf)__

Find index that has passed mf in __feature__.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   mf  |  Object   |        |    MovingFeature JSON    |

&nbsp;

* __inWholeIndexOf(mf)__

Find index that has passed mf in __wholeFeature__.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   mf  |  Object   |        |  MovingFeature JSON      |

&nbsp;

* __refresh()__

Move all __Stinuum.MFPair__ in hiddenFeatures to __features__.

&nbsp;

* __findMinMaxGeometry(p_mf_arr, use_default_time)__

Find Minimum and Maximim value from the temporalGeometry datetimes and coordinates

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   p_mf_arr  |  Array   |        |  Array of MovingFeatrues  |
|   use_default_time  |  Date   |        | Minimum value of datetimes |
&nbsp;

* __getWholeMinMax()__

Get Minimum and Maximum of feature of each __MFPair__ in __features__ and __hiddenFeatures__.

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

* __getColor(id)__

get the feature color 

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  String   |        |   Identifier of feature    |



&nbsp;

* __getRandomColor()__

get the random color

&nbsp;

* __setColor(id, color)__

Set __Cesium.Color__ corresponding to the Moving Feature if you want certain color. But, Stinuum automatically determine colors of features, so we recommend that you do not invoke this method except special cases.


| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  String   |        |   Identifier of feature    |
| color | Cesium.Color | | color value |


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

* __getMFPairByIdInFeatures(id)__

Get the __MFPair__ in __features__ using id

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  String   |        |   Identifier of feature    |

&nbsp;

* __getMFPairByIdinWhole(id)__

Get the __MFPair__ in __wholeFeatures__ using id

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  String   |        |   Identifier of feature    |

&nbsp;
* __getLength(id)__

Gets a count of all features

&nbsp;

* __reset()__

Remove all pairs in __features__ and __hiddenFeatures__.

&nbsp;

* __hide(id)__

Move __Stinuum.MFPair__ to __hiddenFeatures__. The feature of that pair will not be drawn and removed during next __Stinuum.geometryViewer.update()__.



| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  String   |        |   Identifier of feature    |

&nbsp;

* __hideAll(id)__

Move All __Stinuum.MFPair__ in __features__ to __hiddenFeatures__ except one pair corresponding to passed id.


| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   id  |  String   |        |   Identifier of feature    |

&nbsp;
