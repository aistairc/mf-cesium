####visualize Movement of MovingFeature -- Moving

* movePolygonArray([movingfeature_array], with_height);

'with_height' means path of animation with own height. 1 is default.( 1 or 0 )
return czml.

```js
var mov = new Moving();
var mf_arr = [ mf1, mf2 ]; //mf is movingfeature object.
var czml = mov.movePolygonArray(mf_arr);
```

* movePointArray([mf_arr], with_height);

* moveLineStringArray([mf_arr], with_height);


