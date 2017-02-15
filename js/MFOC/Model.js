function MFOC(viewer){
  this.viewer = viewer;
  this.primitives = viewer.scene.primitives;
  this.features = [];
  this.mode = '2D';
  this.max_height = 15000000;
  this.path_prim_memory = {};
  this.feature_prim_memory = {};
  this.cube_primitives = null;
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
