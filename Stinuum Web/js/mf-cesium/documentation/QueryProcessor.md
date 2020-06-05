# Stinuum.QueryProcessor

Make the new data of MovingFeatures using the data that is made by user

```js
var stinuum = new Stinuum(viewer);
console.log(stinuum.queryPorcessor);
```
## Members

There is no member that user can access.

## Methods


* __queryByTime(start, end)__

Find features that is included in start and end times

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| start |   Date   |        | start times or minimum time |
| end |   Date   |        | end times or maximum time  |

&nbsp;

* __sliceFeatureByTime(feature, start, end)__

Make the new data of features that is included in start and end times

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| feature |   Array   |        | Array of features that is included in the start and end  |
| start |   Date   |        | start times or minimum time |
| end |   Date   |        | end times or maximum time |

&nbsp;