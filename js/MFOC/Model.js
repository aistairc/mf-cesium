function MFOC(viewer){
  this.viewer = viewer;
  this.primitives = viewer.scene.primitives;
  this.features = [];
  this.mode = '3D';
  this.max_height = 15000000;
  this.path_prim_memory = {};
  this.feature_prim_memory = {};
}


function BoxCoord(){
  this.minimum = {};
  this.maximum = {};
};
