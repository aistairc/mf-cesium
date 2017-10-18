var LOG = console.log;
var ERR = Stinuum.Exception;
var debug_mode = true;

function Stinuum(viewer){
    this.cesiumViewer = viewer;
    this.mode = 'STATICMAP';
    this.maxHeight = 30000000;

    this.geometryViewer = new Stinuum.GeometryViewer(this);
    this.mfCollection = new Stinuum.MFCollection(this);
    this.directionRadar = new Stinuum.DirectionRadar(this);
    this.temporalMap = new Stinuum.TemporalMap(this);
    this.occurrenceMap = new Stinuum.OccurrenceMap(this);
    this.propertyGraph = new Stinuum.PropertyGraph(this);
}

Stinuum.Exception = function(message, data){
  this.name = "StinuumException";
  this.message = message;
  this.data = data;
}

Stinuum.Exception.prototype.toString = function(){
  if (!debug_mode || this.data == undefined)
    return this.name + ' : "' + this.message + '"';
  else {
    return [this.name + ' : "' + this.message + '"', this.data];
  }
}

Stinuum.MFPair = function(id, feature){
  this.id = id;
  this.feature = feature;
}

Stinuum.OccurrenceMap = function(stinuum){
  this.super = stinuum;
  this.max_num = 0;
  this.primitive = null;
}

Stinuum.QueryProcessor = function(mfc){
    this.super = mfc;
}

Stinuum.MFCollection = function(stinuum){
    this.super = stinuum;
    this.features = [];
    this.hiddenFeatures = [];
    this.colorCollection = {};
    this.min_max = {};
    this.whole_min_max = {};

    this.queryProcessor = new Stinuum.QueryProcessor(this);
}


Stinuum.PathDrawing = function(g_viewer){
  this.g_viewer = g_viewer;
  this.supersuper = g_viewer.super;
}

Stinuum.MovementDrawing = function(g_viewer){
  this.g_viewer = g_viewer;
  this.supersuper = g_viewer.super;
}

Stinuum.GeometryViewer = function(stinuum){
  this.super = stinuum;
  this.primitives = {};
  this.drawing = new Stinuum.PathDrawing(this);
  this.moving = new Stinuum.MovementDrawing(this);
  this.projection = null;
  this.time_label = [];
  this.label_timeout = undefined;
}

Stinuum.TemporalMap = function(stinuum){
    this.super = stinuum;
    this.temp_primitive = {};
}


Stinuum.DirectionRadar = function(stinuum){
    this.super = stinuum;
}


Stinuum.PropertyGraph = function(stinuum){
    this.super = stinuum;
    this.graph_id;
}



Stinuum.BoxCoord = function(){
  this.minimum = {};
  this.maximum = {};
};

Stinuum.SpatialInfo = function(){
  this.west = new Stinuum.DirectionInfo();
  this.east = new Stinuum.DirectionInfo();
  this.north = new Stinuum.DirectionInfo();
  this.south = new Stinuum.DirectionInfo();
}

Stinuum.DirectionInfo =function(life=0, leng=0){
  this.total_life = life;
  this.total_length = leng;
}
