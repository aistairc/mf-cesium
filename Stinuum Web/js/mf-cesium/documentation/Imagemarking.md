# Stinuum.Imagemarking

Showing images according to the ParametricValues ​​data in temporalProperties of MF-JSON. 

```js
var stinuum = new Stinuum(viewer);
console.log(stinuum.Imagemarking);
```

## Members

There is no member that user can access.

## Methods

* __remove(canvasID)__

Remove the image viewer using __canvasID__

Example :
```js
stinuum.Imagemarking.remove(canvasID);
```

&nbsp;

* __show_img(pro_type_arr, image)__

Get the temporalProperties value using the pro_type_arr

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| pro_type_arr  |  Array   |        |  Array of ParameticValues that is selected by user |
| image | String || Id of `canvas` tag|

&nbsp;

* __checkType(imageValue)__

Check whether image value is address or Base64

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   imageValue  |  String   |        |  Data of Image  |

&nbsp;

* __onTick(current_time)__

Obtain the image upload time by comparing Cesium browser time and canvas time

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   current_time  |  Date   |        |   Current time of Cesium browser |

&nbsp;

* __showImage(image_div)__

The image exposure time is determined according to the interpolation value of the ParameticValue  
( Only __"Discrete"__ and __"Step"__ can be used among Interpolation values )

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   image_div  |  String   |        |  Data of `canvas` tag     |

&nbsp;

* __draw_image(ctx, src, width, height)__

Upload the image to fit the size of the canvas

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   ctx  |  String   |        |  Data of getContext('2d') from `canvas` tag   |
|   src  |  String   |        |  Value of Image |
|   width  |  Number   |        |  Width size of canvas     |
|   height  |  Number   |        |   Height size of canvas       |

&nbsp;
