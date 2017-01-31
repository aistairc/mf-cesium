

function animateCheckedFeatures(){
  viewer.clear();
  document.getElementById('property_list').innerHTML = '';
  document.getElementById('property_list').style.visibility = 'hidden';
  document.getElementById('property_list').style.cursor = '';

  var list = active_mfl.getAllNameList();
  var id_arr = [];

  for (var i = 0 ; i < list.length ; i++){
    var id = list[i].id;

    if (document.getElementById('check'+id).checked){
      id_arr.push(id);
      if (viewer.scene.mode==Cesium.SceneMode.COLUMBUS_VIEW){
        var prim = active_mfl.list[id].get3D();

        if (Array.isArray(prim)){
          for (var i = 0 ; i < prim.length ; i++){
            viewer.scene.primitives.add(prim[i]);
          }
        }
        else{
          viewer.scene.primitives.add(prim);
        }

      }
      else if ( viewer.scene.mode==Cesium.SceneMode.SCENE2D ){
        viewer.scene.primitives.add(active_mfl.list[id].get2D())
      }

    }

  }

  active_mfl.animateMoving(id_arr, viewer.scene.mode==Cesium.SceneMode.COLUMBUS_VIEW);


}
