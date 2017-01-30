var viewer;
var scene;

var mfl; // moving feature list
var LOG = console.log;

function MovingFeatureList(){
  this.list = {};
  this.name_list = [];
}


function MovingFeature(){
  this.height_arr = [];

}


function MovingPolygon(){
  MovingFeature.apply(this, arguments);
  this.polygon_prim_2d = [];
  this.triangles_prim_3d;
}

MovingPolygon.prototype = new MovingFeature();
MovingPolygon.prototype.constructor = MovingPolygon;

function MovingPoint(){
  MovingFeature.apply(this, arguments);
}

MovingPoint.prototype = new MovingFeature();
MovingPoint.prototype.constructor = MovingPoint;

function MovingLineString(){
  MovingFeature.apply(this, arguments);
  this.next_mapping_point_arr = [];
  this.triangles_prim_3d = [];

}

MovingLineString.prototype = new MovingFeature();
MovingLineString.prototype.constructor = MovingLineString;
