# Stinuum.PropertyGraph

Showing graphs according to the ParametricValues ​​data in temporalProperties of MF-JSON.

```js
var stinuum = new Stinuum(viewer);
console.log(stinuum.propertyGraph);
```

## Members

There is no member that user can access.

## Methods

* __show(propertyName, divID)__

Find the ParametricValues using propertyName in the temporalProperties and make the graph using __showPropertyArray(propertyName, array, div_id)__

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| propertyName |   Array   |        |  Name of ParametricValues  |
| div_id | String |        |    Id of `div` tag.    |

Example :
```js
stinuum.propertyGraph.show(name, "graph");
```

&nbsp;

* __showPropertyArray(propertyName, array, div_id)__

Make the graph using data of each ParametricValues of temporalProperties data

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| propertyName |   Array   |        |  Name of ParametricValues  |
| array |   Array   |        |  Object of ParametricValues  |
| div_id | String |        |    Id of `div` tag.    |

Example:
```js
stinuum.propertyGraph.showPropertyArray(propertyName, array, 'graph');
```