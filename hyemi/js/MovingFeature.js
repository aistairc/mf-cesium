/*var MovingFeature = function() {
    this.poslist = []; 
    this.infomation;
    this.time = [];

    //this.targetPosition = 3;
    //this.timeList = [];
    //this.delta = [];
    //this.mid =[];
    this.object;
 }
 MovingFeature.prototype.init = function(mf) {
  var mfIdRef = mf.attr("mfIdRef");
  //this.infomation = find(mfIdRef);
  this.infomation = mfIdRef;
  this.time[0] = mf.attr("start") * 1;
  this.time[1] = mf.attr("end") * 1;
  var pointsplit = mf.find("posList").text().split(" ");

  for(var i = 0;i < pointsplit.length;i += MovingFeatureMetaData.dimension) {
    this.poslist.push(pointsplit[i] * 1);
    this.poslist.push(pointsplit[i + 1] * 1);
    this.poslist.push(0);
    if(MovingFeatureMetaData.dimension == 3) {
      this.poslist[this.poslist.length - 1] = pointsplit[i + 2] * 1;
    }

}  */
  /*var x = 0, y = 0, z = 0;
  var total = [0];
  var time = this.end - this.start;
  for(var i = 0; i < this.poslist.length - 3; i += 3) {
    x = this.poslist[i + 3] - this.poslist[i];
    y = this.poslist[i + 4] - this.poslist[i + 1];
    z = this.poslist[i + 5] - this.poslist[i + 2];
    total.push(Math.sqrt(Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2)));
    total[0] += total[total.length - 1];
  }
  for(var i = 0; i < this.poslist.length - 3; i += 3) {
    var curtime = (total[(i / 3) + 1] / total[0]) * time;
    this.timeList.push(curtime + this.start);
    x = this.poslist[i + 3] - this.poslist[i];
    y = this.poslist[i + 4] - this.poslist[i + 1];
    z = this.poslist[i + 5] - this.poslist[i + 2];
    this.delta.push((x / curtime) * timeunit);
    this.delta.push((y / curtime) * timeunit);
    this.delta.push((z / curtime) * timeunit);
  }

  //this.poslist = pointsplit;
  
  this.mid[0] = this.poslist[0];
  this.mid[1] = this.poslist[1];
  this.mid[2] = this.poslist[2];*/
 //console.log(this.poslist);
//};

/*var Member = function() {
    this.id;
    this.name;
 }
Member.prototype.init = function(member) {
  this.id = member.attr("gml:id");
  this.name = member.find("name").text();
};

var MovingFeatureMetaData = function() {
    this.lowerCorner = [];
    this.upperCorner = [];
    this.beginPosition;
    this.endPosition;
    this.offset;
 }
MovingFeatureMetaData.prototype.init = function(sTBoundedBy) {
  this.offset= sTBoundedBy.attr("offset");
  var pointsplit = sTBoundedBy.find("lowerCorner").text().split(" ");
  MovingFeatureMetaData.dimension = pointsplit.length;

  this.lowerCorner.push(pointsplit[0] * 1);
  this.lowerCorner.push(pointsplit[1] * 1);
  this.lowerCorner.push(0);
  if(MovingFeatureMetaData.dimension == 3) {
    this.lowerCorner[this.lowerCorner.length - 1] = pointsplit[2] * 1;
  }
  pointsplit = sTBoundedBy.find("upperCorner").text().split(" ");

  this.upperCorner.push(pointsplit[0] * 1);
  this.upperCorner.push(pointsplit[1] * 1);
  this.upperCorner.push(0);
  if(MovingFeatureMetaData.dimension == 3) {
    this.upperCorner[this.upperCorner.length - 1] = pointsplit[2] * 1;
  }
  
};*/
/*var UserType = function() {
    this.name;
    this.restriction;
 }
UserType.prototype.init = function(jsoncontent) {

};*/
/*function read() {

  $.ajax({
      type: "GET"
      ,dataType: "xml"
      ,url: "test.xml"
      ,success: makeFeature
      ,error:function(request,status,error){
          alert("code:"+request.status+"\n"+"error:"+error);
      }
    });
 
  //makeFeature(xml);
}*/

/*function find(id) {
  for(var i = 0;i < mfMember.length;i++) {
    if(id == mfMember[i].id) return mfMember[i];
  }
}*/
/*function makeFeature(xml) {
  var meta = new MovingFeatureMetaData();
  var mfmetaData = $(xml).find("sTBoundedBy");  
  meta.init(mfmetaData);

  var mfinfo = $(xml).find("member");  
  mfMember = [];
  var membernum = mfinfo.length;
  if (membernum) {                       
      $(mfinfo).each(function(){ 
        var mfmem = $(this).find("MovingFeature");
        var mfmemnum = mfmem.length;
        if(mfmemnum) {
          var member = new Member();
          member.init(mfmem);
          mfMember.push(member);
        }
        
      }); 
  }       
  MovingFeatureMetaData.dimension = 3;
  mfArray = [];
  var xmlData = $(xml).find("LinearTrajectory");  
  
  var listLength = xmlData.length;
  if (listLength) {                       
      $(xmlData).each(function(){ 
        var mf = new MovingFeature();
        mf.init($(this));
        mfArray.push(mf);
      }); 
  }                             
  play();
}*/
var startMF = 0;
var time = 1000;
function makeMF(list) {
  var metaData = list.data[0];//.split(',');//console.log(metaData[5]);
  //start = new Cesium.JulianDate.fromDate(new Date(Date.now()));
  start = new Cesium.JulianDate.fromIso8601(metaData[5]);
  startMF = 1;
  end = new Cesium.JulianDate.fromIso8601(metaData[6]);
  timeunit = metaData[7];

  if(timeunit.substr(0,3) == "sec") {
    timeunit = 1;
  }else {timeunit = 0.001;}

console.log("metadate setting finish");
  console.log(new Date(Date.now()));
  //start = Cesium.JulianDate.addSeconds(start, 10, new Cesium.JulianDate());
 // console.log(start);
  //mfArray = [];
  //timeunit = 1;
  /*var pre = "";
  var mfid;
  var mfp;
  var color;
  console.log("metadate setting finish");
  console.log(new Date(Date.now()));
  for(var j = 2;j < list.length - 1;j ++) {
    if(list[j] != "" && list[j] !== undefined) {
        var elements = list[j].split(',');
        mfid = elements[0];

      if(pre !== mfid){
        if(pre !== "") {
        
           viewer.entities.add({
              name : pre,
              position : mfp,
              point : {
                pixelSize : 5,
                color : Cesium.Color.fromBytes(color * 60, color * 60, color * 60, 255),
                outlineColor : Cesium.Color.fromBytes(color * 60, color * 60, color * 60, 255),
                outlineWidth : 1
              }
              //box : {
              //    dimensions : new Cesium.Cartesian3(radii, radii, radii),
              //    material : Cesium.Color.fromBytes(color * 60, color * 60, color * 60, 128)
              //}
          });
        }
       
        pre = mfid;
        mfp =  new Cesium.SampledPositionProperty();
        
      }
      mfp = init(elements, mfp, timeunit);
      color = elements[4]; 
    }
  }
  viewer.entities.add({
      name : pre,
      position : mfp,
      point : {
                pixelSize : 5,
              color : Cesium.Color.fromBytes(color * 60, color * 60, color * 60, 128),
              outlineColor : Cesium.Color.WHITE,
              outlineWidth : 2
              }
      //box : {
      //    dimensions : new Cesium.Cartesian3(radii, radii, radii),
      //    material : Cesium.Color.fromBytes(color * 60, color * 60, color * 60, 128)
      //}
  });
 // var finish = Cesium.JulianDate.fromDate(new Date(Date.now()));
  console.log("mf finish");
  console.log(new Date(Date.now()));*/
  //play();
}
  var pre = "";
  var mfid;
  var mfp;
  var color;
  var realcolor;
function makeonemft(list) {

  

    //if(list != "" && list !== undefined) {
        var elements = list.data[0];//list.split(',');
        mfid = elements[0];

      if(pre !== mfid){
        if(pre !== "") {
        
           viewer.entities.add({
              name : pre,
              position : mfp,
              point : {
                pixelSize : 5,
                color : realcolor,
                outlineColor : realcolor,
                outlineWidth : 1
              }
              //box : {
              //    dimensions : new Cesium.Cartesian3(radii, radii, radii),
              //    material : Cesium.Color.fromBytes(color * 60, color * 60, color * 60, 128)
              //}
          });
        }
       
        pre = mfid;
        mfp =  new Cesium.SampledPositionProperty();
        
      }
      mfp = init(elements, mfp, timeunit);
      color = elements[4] * 1; 
      if(color == 1) {
        realcolor = Cesium.Color.WHITE;
      }
      else if(color == 2) {
        realcolor = Cesium.Color.RED;
      }
      else if(color == 3) {
        realcolor = Cesium.Color.BLUE;
      }
      else if(color == 4) {
        realcolor = Cesium.Color.GREEN;
      }

    //}
  
  
}
function complete() {
  viewer.entities.add({
      name : pre,
      position : mfp,
      point : {
                pixelSize : 5,
              color : realcolor,
              outlineColor : realcolor,
              outlineWidth : 2
              }
      //box : {
      //    dimensions : new Cesium.Cartesian3(radii, radii, radii),
      //    material : Cesium.Color.fromBytes(color * 60, color * 60, color * 60, 128)
      //}
  });
 // var finish = Cesium.JulianDate.fromDate(new Date(Date.now()));
  console.log("mf finish");
  console.log(new Date(Date.now()));
}
function init(mf,mfp,timeunit) {

  var poslist = mf[3].split(' ');
 
  for(var i = 0;i < 6;i++) {
    poslist[i] *= 1;
  }
  transformCoordinates(poslist);
  //console.log(poslist);
  var finalPos = toCartesian3(poslist);
  for(var j = 0;j < 6;j += 3) {
    /*var offset = new Cesium.Cartesian3(poslist[j]*0.1, poslist[j + 1]*0.1, poslist[j + 2]*0.1);
    var pos = Cesium.Matrix4.multiplyByPoint(ENU, offset, new Cesium.Cartesian3());
    
    var finalPos = Cesium.Ellipsoid.WGS84.cartographicToCartesian(Cesium.Cartographic.fromCartesian(pos, ellipsoid));
    Cesium.Transforms.eastNorthUpToFixedFrame(finalPos, ellipsoid);*/
    

    var time = Cesium.JulianDate.addSeconds(start, mf[(j / 3) + 1]*timeunit, new Cesium.JulianDate());
    //console.log(time);
    mfp.addSample(time, finalPos[(j / 3)]);
  }

return mfp;
  
}  
/*var objectArray = [];
var time = 0;
function play() {
  var start = Cesium.JulianDate.fromDate(new Date(Date.now()));
  for(var i = 0;i < mfArray.length;i++) {
        
          mfArray[i].object = viewer.entities.add({
              name : mfArray[i].infomation.name,
              ellipsoid : {
                  radii : new Cesium.Cartesian3(radii, radii, radii),
                  material : Cesium.Color.RED.withAlpha(0.3)
              }
          });
          var mf =  new Cesium.SampledPositionProperty();
          for(var j = 0;j < 6;j += 3) {
            var offset = new Cesium.Cartesian3(mfArray[i].poslist[j], mfArray[i].poslist[j + 1], mfArray[i].poslist[j + 2]);
            var pos = Cesium.Matrix4.multiplyByPoint(ENU, offset, new Cesium.Cartesian3());
            
            var finalPos = Cesium.Ellipsoid.WGS84.cartographicToCartesian(Cesium.Cartographic.fromCartesian(pos, ellipsoid));
            Cesium.Transforms.eastNorthUpToFixedFrame(finalPos, ellipsoid);

            var time = Cesium.JulianDate.addSeconds(start, mfArray[i].time[j / 3], new Cesium.JulianDate());
            mf.addSample(time, finalPos);
          }
          mfArray[i].object.position = mf;
    }
  //setInterval(function() {
    
  //  update();
  //  time += timeunit;
  //},timeunit * 1000);
}*/

/*var timeunit = 1;
var iszoom = false;
var e = 0.001;
function update(){
     
      for(var i = 0;i < mfArray.length;i++) {
        if(mfArray[i].start > time - timeunit && mfArray[i].start <= time) {
          mfArray[i].object = viewer.entities.add({
              name : mfArray[i].infomation.name,
              ellipsoid : {
                  radii : new Cesium.Cartesian3(2.0, 2.0, 2.0),
                  material : Cesium.Color.RED.withAlpha(0.3)
              }
          });
          iszoom = true;       
        }       
        else if(mfArray[i].end <= time) {
          mfArray[i].object.show = false;
          mfArray.splice(i,1);
          continue;
        } 
        
        if(mfArray[i].start <= time && mfArray[i].end > time){
          var offset = new Cesium.Cartesian3(mfArray[i].mid[0], mfArray[i].mid[1], mfArray[i].mid[2]);
          var finalPos = Cesium.Matrix4.multiplyByPoint(ENU, offset, new Cesium.Cartesian3());
          
          mfArray[i].object.position = Cesium.Ellipsoid.WGS84.cartographicToCartesian(Cesium.Cartographic.fromCartesian(finalPos, ellipsoid));
          Cesium.Transforms.eastNorthUpToFixedFrame(mfArray[i].object.position,ellipsoid);
          mfArray[i].mid[0] += mfArray[i].delta[mfArray[i].targetPosition - 3];
          mfArray[i].mid[1] += mfArray[i].delta[mfArray[i].targetPosition - 2];
          mfArray[i].mid[2] += mfArray[i].delta[mfArray[i].targetPosition - 1];
        }
        if(mfArray[i].timeList[mfArray[i].targetPosition / 3 - 1] <= time + timeunit) {
          mfArray[i].targetPosition += 3; 
        }
    }
    if(iszoom) {
      viewer.zoomTo(viewer.entities);
      iszoom = false;
    }

}*/
     