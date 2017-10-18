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

    for (var i = 0 ; i < this.hiddenFeatures.length ; i++){
      var min_max_date = Stinuum.findMinMaxTime(this.hiddenFeatures[i].feature.temporalGeometry.datetimes);
      if (min_max_date[0] >= start && min_max_date[1] <= end){
        new_mf_arr.push(this.hiddenFeatures[i]);
      }
      else{
        del_mf_arr.push(this.hiddenFeatures[i]);
      }

    }

    this.super.features = new_mf_arr;
    this.super.hiddenFeatures = del_mf_arr;
}
