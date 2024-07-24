

Stinuum.MFCollection.prototype.add = function (mf, id) {
  if (Array.isArray(mf)) {
    for (var i = 0; i < mf.length; i++) {
      this.add(mf[i]);
    }
  }
  else {
    if (mf.type != 'MovingFeature') {
      console.log("it is not MovingFeature!!@!@!");
      return -1;
    }
    if (this.inFeaturesIndexOf(mf) != -1 || this.inWholeIndexOf(mf) != -1) {
      console.log("this mf already exist.");
      return -2;
    }
    if (id != undefined && (this.inFeaturesIndexOfById(id) != -1 || this.inWholeIndexOfById(id) != -1)) {
      console.log("this id already exist.");
      return -2;
    }

    if (id == undefined && mf.properties.name == undefined) {
      alert("feature has no name!");
      return -1;
    }
    if (id != undefined) {
      this.features.push(new Stinuum.MFPair(id, mf));
      this.wholeFeatures.push(new Stinuum.MFPair(id, mf));
    }
    else {
      this.features.push(new Stinuum.MFPair(mf.properties.name, mf));
      this.wholeFeatures.push(new Stinuum.MFPair(mf.properties.name, mf));
    }
  }
}


Stinuum.MFCollection.prototype.remove = function (mf) {
  var index = this.inFeaturesIndexOfById(mf.properties.name);
  if (index != -1) this.removeByIndexInFeatures(index);
  index = this.inWholeIndexOfById(mf.properties.name);

  var ret;
  if (index != -1) ret = this.removeByIndexInWhole(index);

  if (this.inFeaturesIndexOfById(mf.properties.name) != -1 || this.inWholeIndexOfById(mf.properties.name) != -1) {
    throw new Stinuum.Excetion("after removing but exist", [this, mf]);
  }
  if (ret != undefined) return ret;
  console.log("this mf is not exist in array", mf);
  return 0;
}

Stinuum.MFCollection.prototype.removeById = function (id) {
  var index = this.inFeaturesIndexOfById(id);
  if (index != -1) this.removeByIndexInFeatures(index);
  index = this.inWholeIndexOfById(id);
  if (index != -1) return this.removeByIndexInWhole(index);
  console.log("this mf is not exist in array", mf);
  return 0;
}

Stinuum.MFCollection.prototype.removeByIndexInFeatures = function (index) {
  var remove_pair = this.features.splice(index, 1)[0];
  return remove_pair;
}

Stinuum.MFCollection.prototype.removeByIndexInWhole = function (index) {
  var remove_pair = this.wholeFeatures.splice(index, 1)[0];
  return remove_pair;
}


Stinuum.MFCollection.prototype.inFeaturesIndexOfById = function (id) {
  for (var i = 0; i < this.features.length; i++) {
    if (this.features[i].id == id) {
      return i;
    }
  }
  return -1;
}

Stinuum.MFCollection.prototype.inWholeIndexOfById = function (id) {
  for (var i = 0; i < this.wholeFeatures.length; i++) {
    if (this.wholeFeatures[i].id == id) {
      return i;
    }
  }
  return -1;
}

Stinuum.MFCollection.prototype.inFeaturesIndexOf = function (mf) {
  for (var i = 0; i < this.features.length; i++) {
    if (this.features[i].feature == mf) {
      return i;
    }
  }
  return -1;
}

Stinuum.MFCollection.prototype.inWholeIndexOf = function (mf) {
  for (var i = 0; i < this.wholeFeatures.length; i++) {
    if (this.wholeFeatures[i].feature == mf) {
      return i;
    }
  }
  return -1;
}

//move whole features to features
Stinuum.MFCollection.prototype.refresh = function () {
  this.super.s_query_on = false;
  this.features = [];
  for (var i = 0; i < this.wholeFeatures.length; i++) {
    this.features.push(this.wholeFeatures[i]);
  }
}

Stinuum.MFCollection.prototype.findMinMaxGeometry = function (p_mf_arr) {
  var mf_arr;
  if (p_mf_arr == undefined) {
    mf_arr = this.features;
  }
  else {
    mf_arr = p_mf_arr;
  }

  if (mf_arr.length == 0) {
    return -1;
  }

  var min_max = {};
  min_max.x = [];
  min_max.y = [];
  min_max.z = [];

  min_max.date = [];

  var first_date = new Date(mf_arr[0].feature.temporalGeometry.datetimes[0]);
  min_max.date = [first_date, first_date];

  for (var i = 0; i < mf_arr.length; i++) {
    var mf_min_max_coord = {};
    if (mf_arr[i].feature.temporalGeometry.type == "MovingPoint") {
      mf_min_max_coord = Stinuum.findMinMaxCoord(mf_arr[i].feature.temporalGeometry.coordinates);
    }
    else {
      var coord_arr = mf_arr[i].feature.temporalGeometry.coordinates;
      mf_min_max_coord = Stinuum.findMinMaxCoord(coord_arr[0][0]);
      for (var j = 1; j < coord_arr.length; j++) {
        mf_min_max_coord = Stinuum.findBiggerCoord(mf_min_max_coord, Stinuum.findMinMaxCoord(coord_arr[j][0]));
      }
    }

    if (min_max.x.length == 0) {
      min_max.x = mf_min_max_coord.x;
      min_max.y = mf_min_max_coord.y;
      min_max.z = mf_min_max_coord.z;
    }
    else {
      var xyz = Stinuum.findBiggerCoord(min_max, mf_min_max_coord);
      min_max.x = xyz.x;
      min_max.y = xyz.y;
      min_max.z = xyz.z;
    }
    var temp_max_min = Stinuum.findMinMaxTime(mf_arr[i].feature.temporalGeometry.datetimes);
    if (temp_max_min[0].getTime() < min_max.date[0].getTime()) {
      min_max.date[0] = temp_max_min[0];
    }
    if (temp_max_min[1].getTime() > min_max.date[1].getTime()) {
      min_max.date[1] = temp_max_min[1];
    }
    // kitanishi add, for getting JSON from Dataplatform
    if (mf_arr[i].feature.mindatetime && 
        mf_arr[i].feature.mindatetime.getTime() < min_max.date[0].getTime()) {
      min_max.date[0] = mf_arr[i].feature.mindatetime;
    }
    if (mf_arr[i].feature.maxdatetime &&
        mf_arr[i].feature.maxdatetime.getTime()  > min_max.date[1].getTime()) {
      min_max.date[1] = mf_arr[i].feature.maxdatetime;
    }
  }

  if (p_mf_arr == undefined) {
    this.min_max = min_max;
  }

  return min_max;
}

Stinuum.MFCollection.prototype.getWholeMinMax = function () {
  this.whole_min_max = this.findMinMaxGeometry(this.wholeFeatures);
  return this.whole_min_max;
}

Stinuum.MFCollection.prototype.getColor = function (id) {
  if (this.colorCollection[id] != undefined) {
    return this.colorCollection[id];
  }
  var color = Cesium.Color.fromRandom({
    minimumRed: 0.2,
    minimumBlue: 0.2,
    minimumGreen: 0.2,
    alpha: 1.0
  });
  this.colorCollection[id] = color;
  return color;
}

Stinuum.MFCollection.prototype.setColor = function (id, color) {
  this.colorCollection[id] = color;
}

Stinuum.MFCollection.prototype.getAllPropertyType = function () {
  var array = [];
  for (var i = 0; i < this.features.length; i++) {
    if (this.features[i].feature.temporalProperties == undefined) continue;

    if (Array.isArray(this.features[i].feature.temporalProperties)) {
      for (var j = 0; j < this.features[i].feature.temporalProperties.length; j++) {
        Stinuum.pushPropertyNamesToArrayExceptTime(array, this.features[i].feature.temporalProperties[j]);
      }
    }
    else {
      //Stinuum.pushPropertyNamesToArrayExceptTime(array, this.features[i].feature.temporalProperties);
      LOG(this.features[i].feature.temporalProperties);
      throw new Error("temporalProperties should be array");
    }

  }
  return array;
}


Stinuum.MFCollection.prototype.getMFPairById = function (id) {
  var inWhole = this.getMFPairByIdinWhole(id);
  if (inWhole != -1) {
    return inWhole;
  }
  return -1;
}

Stinuum.MFCollection.prototype.getMFPairByIdInFeatures = function (id) {
  var index = this.inFeaturesIndexOfById(id);
  if (index != -1) return this.features[index];

  return -1;
}

Stinuum.MFCollection.prototype.getMFPairByIdinWhole = function (id) {
  var index = this.inWholeIndexOfById(id);
  if (index != -1) return this.wholeFeatures[index];

  return -1;
}

Stinuum.MFCollection.prototype.getLength = function () {
  return this.features.length;
}

Stinuum.MFCollection.prototype.reset = function () {
  this.features = [];
  this.wholeFeatures = [];
  this.colorCollection = [];

}

Stinuum.MFCollection.prototype.hide = function (mf_id) {
  if (this.inFeaturesIndexOfById(mf_id) != -1) {
    var index = this.inFeaturesIndexOfById(mf_id);
    var hidden_pair = this.features.splice(index, 1)[0];
  }
}

Stinuum.MFCollection.prototype.hideAll = function (mf_id) { //hide All except one mf
  this.features = [];
  if (mf_id != undefined) {
    var index = this.inWholeIndexOfById(mf_id);
    var pair = this.wholeFeatures[index];
    this.features.push(pair);
  }


}
