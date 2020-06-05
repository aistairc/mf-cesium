# SRSTranslator

Converts the coordinates value of MovingFeature to WGS84 format according to each coordinate system conversion formula defined in [EPSG.io](https://epsg.io/)

## Members

* __projections__ 

An object with coordinate system name and transformation expression as key and value respectively


* __transformations__ 

An object that stores the current coordinate system and coordinate system values ​​to convert

&nbsp;

## Methods

* __addProjection(name, projection)__

Add the coordinate system and transformation formula to __projections__

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| name |   String   |        |  Name of CRS |
| projection |   String   |        |  Projection value of CRS |

&nbsp;

* __forward(coords, projectionFrom, projectionTo)__

Convert the coordinate values ​​of the existing coordinate system to the WGS84 coordinate system.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| coords |   String   |        | Coordinate value to be converted |
| projectionFrom |   String   |        |  Conventional coordinate system |
| projectionTo |   String   |        |  Transformed coordinate system |


&nbsp;
* __getTransformation(projectionFrom, projectionTo)__

Get the coordinate system transformation formula.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| projectionFrom |   String   |        |  Conventional coordinate system |
| projectionTo |   String   |        |  Transformed coordinate system |

&nbsp;
* __getProjection(name)__

Get the projection value by the coordinate system name.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| name |   String   |        |  Name of CRS |

&nbsp;

* __searchProjecion(name)__
  
Search the Projection value using CRS value from the __projections__.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| name |   String   |        |  Name of CRS |

&nbsp;

* __crsCheck(crs)__

Search the Projection value using CRS value defined in MF-JSON.

| Name | Type | Default | Description |
| ---------- | :--------- | :---------- | :---------- |
| crs |   Object   |        | Value of CRS in MF-JSON|

* __getDefaultDefinitions()__

Define the name and projection of the coordinate system to be used by default.