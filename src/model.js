var LOG = console.log;


function MFPair(id, feature){
  this.id = id;
  this.feature = feature;
}

function Stinuum(viewer){
    this.cesiumViewer = viewer;
    this.mode = 'STATICMAP';
    this.maxHeight = 30000000;

    this.geometryViewer = new GeometryViewer(this);
    this.mfCollection = new MFCollection(this);
    this.directionRadar = new DirectionRadar(this);
    this.temporalMap = new TemporalMap(this);
    this.occurrenceMap = new OccurrenceMap(this);
    this.propertyGraph = new PropertyGraph(this);
}

function PathDrawing(g_viewer){
  this.g_viewer = g_viewer;
  this.supersuper = g_viewer.super;
}

function MovementDrawing(g_viewer){
  this.g_viewer = g_viewer;
  this.supersuper = g_viewer.super;
}

function GeometryViewer(stinuum){
  this.super = stinuum;
  this.primitives = {};
  this.drawing = new PathDrawing(this);
  this.moving = new MovementDrawing(this);
  this.projection = null;
  this.time_label = [];
  this.label_timeout = undefined;
}

function TemporalMap(stinuum){
    this.super = stinuum;
    this.temp_primitive = {};
}

function OccurrenceMap(stinuum){
    this.super = stinuum;
    this.max_num = 0;
    this.primitive = null;
}

function DirectionRadar(stinuum){
    this.super = stinuum;
}

function MFCollection(stinuum){
    this.super = stinuum;
    this.features = [];
    this.hiddenFeatures = [];
    this.colorCollection = {};
    this.min_max = {};
    this.whole_min_max = {};
}

function PropertyGraph(stinuum){
    this.super = stinuum;
    this.graph_id;
}


function BoxCoord(){
  this.minimum = {};
  this.maximum = {};
};

function SpatialInfo(){
  this.west = new DirectionInfo();
  this.east = new DirectionInfo();
  this.north = new DirectionInfo();
  this.south = new DirectionInfo();
}

function DirectionInfo(life=0, leng=0){
  this.total_life = life;
  this.total_length = leng;
}
