function MFOC(viewer){
  this.viewer = viewer;
  this.primitives = viewer.scene.primitives;
  this.features = [];
  this.mode = '2D';
  this.max_height = 30000000;
  this.path_prim_memory = {};
  this.feature_prim_memory = {};
  this.cube_primitives = null;
  this.bounding_sphere = null;
  this.color_arr = {};
  this.radar_on = false;
  this.zoomoutfeatures = [];
  this.graph_id =null;
  this.analysis_id = null;
  this.radar_id = null;

  this.projection = null;
  this.time_label = [];

  if (isNaN( new Date("2015-07-30 09:00:00").getTime() )){
    alert("this browser maybe something error to draw MovingFeatures.. i recommend chrome.");
  };

  var mfoc = this;

}


function BoxCoord(){
  this.minimum = {};
  this.maximum = {};
};

function DirectionInfo(life=0, leng=0){
  this.total_life = life;
  this.total_length = leng;
}

function SpatialInfo(){
  this.west = new DirectionInfo();
  this.east = new DirectionInfo();
  this.north = new DirectionInfo();
  this.south = new DirectionInfo();
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
