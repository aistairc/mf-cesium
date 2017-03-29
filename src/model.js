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

var SampledProperty = function(){
  this.array = [];
  this.addSample = function(x, y){
    this.array.push({
      'x':x,
      'y':y});
    this.array.sort(function(a, b){
      var keyA = a.x,
      keyB = b.x;
      // Compare the 2 dates
      if(keyA < keyB) return -1;
      if(keyA > keyB) return 1;
      return 0;
    });
  };

  this.getValue =  function(x){
    if (x < this.array[0].x){
      return undefined;
    }
    for (var i = 0 ; i < this.array.length -1 ; i++){
      if (x >= this.array[i].x && x <= this.array[i+1].x){
        var b = this.array[i+1].y - this.array[i+1].x * (this.array[i+1].y - this.array[i].y)/(this.array[i+1].x - this.array[i].x);
        return (this.array[i+1].y - this.array[i].y)/(this.array[i+1].x - this.array[i].x) * x + b;
      }
    }
    return undefined;
  };
}
