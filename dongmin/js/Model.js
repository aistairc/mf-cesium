var viewer;
var scene;

var active_mfl;
var mfl = {}; // array of featurelist
var LOG = console.log;

function MovingFeatureList(){
  this.id = null;
  this.name = null;
  this.list = {};
  this.name_list = [];
}


function MovingFeature(){
  this.height_arr = [];
  this.viewer;
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
  this.line_prim_3d = null;
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
