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

  if (isNaN( new Date("2015-07-30 09:00:00").getTime() )){
    alert("this browser maybe something error to draw MovingFeatures.. i recommend chrome.");
  }
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
