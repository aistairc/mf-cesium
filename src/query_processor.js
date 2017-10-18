
Stinuum.QueryProcessor.prototype.queryByTime = function(start, end){
  var mf_arr = this.super.features;
  var new_mf_arr = [];
  var del_mf_arr = [];
  for (var i = 0 ; i < mf_arr.length ; i++){
    var min_max_date = Stinuum.findMinMaxTime(mf_arr[i].feature.temporalGeometry.datetimes);
    if (min_max_date[0] >= start && min_max_date[1] <= end){
      new_mf_arr.push(mf_arr[i]);
    }
    else{
      del_mf_arr.push(mf_arr[i]);
    }
  }

  for (var i = 0 ; i < this.super.hiddenFeatures.length ; i++){
    var min_max_date = Stinuum.findMinMaxTime(this.super.hiddenFeatures[i].feature.temporalGeometry.datetimes);
    if (min_max_date[0] >= start && min_max_date[1] <= end){
      new_mf_arr.push(this.super.hiddenFeatures[i]);
    }
    else{
      del_mf_arr.push(this.super.hiddenFeatures[i]);
    }

  }

  this.super.features = new_mf_arr;
  this.super.hiddenFeatures = del_mf_arr;
}

Stinuum.QueryProcessor.prototype.queryBySpatioTime = function(source, target){
  var mf_arr = this.super.features;
  // target 다 hidden..
  if (Array.isArray(source) && Array.isArray(target) ){
    for (var s_i = 0 ; s_i < source.length ; s_i++){
      for (var i = 0 ; i < target.length ; i++){
        this.queryBySpatioTime(source[s_i], target[i]);
      }  
    }
  }
  else if(Array.isArray(source)){
    for (var s_i = 0 ; s_i < source.length ; s_i++){
        this.queryBySpatioTime(source[s_i], target);
      
    }
  }
  else if(Array.isArray(target)){
      for (var i = 0 ; i < target.length ; i++){
        this.queryBySpatioTime(source, target[i]);
      }  
    
  }
  else{
    if (this.super.inHiddenIndexOf(source) == -1){
      this.super.hiddenFeatures.push(new Stinuum.MFPair(source.properties.name, source));
    }
    if (this.super.inHiddenIndexOf(target) == -1){
      this.super.hiddenFeatures.push(new Stinuum.MFPair(target.properties.name, target));
    }
    // query로 새로운 mf 만들어서 mf_arr에 추가. (practice에서 쿼리모드 탈출할때 feature 다 지우기..?)
    
  }

  

}
