# Stinuum.OccurrenceMap

```js
var stinuum = new Stinuum(viewer);
console.log(stinuum.occurrenceMap);
```

## Members

There is no member that user can access.

## Methods

* __show(degree)__

Analyze data in features and visualize.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
|   degree  |  Object   |  ```{ x : 5, y : 5, time : 5 }```      |  (optional) degree to show occurrence cube.      |

degree :

| Name | Type | Description |
| ---------- | :---------- | :---------- |
|   x  |  Number   |  degree of x(longitude) to show occurrence cube.      |
|   y  |  Number   |  degree of y(latitude) to show occurrence cube.      |
|   time  |  Number   |  degree of days to show occurrence cube.      |

&nbsp;

* __remove()__

Remove OccurrenceMap.
