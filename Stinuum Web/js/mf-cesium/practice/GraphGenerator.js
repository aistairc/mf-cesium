function GraphGenerator(viewer){
    this.viewer = viewer
    this.maxCellcount;
    this.testMakeMovingFeature()
}

GraphGenerator.prototype.readMapFile = function (){

    var StartPoint = [139.77744515681255, 35.61793664193283]
    var utmCode = "EPSG:6677"
    var StartUTMCoordi;
    if (SRSTranslator.crsCheck2(utmCode)){
        StartUTMCoordi = SRSTranslator.forward2(StartPoint, "WGS84", utmCode)
    }
    var maxCellcount
    var cellSize = 1 //m
    var testGraph = {}
    var gridMapGeoJson = {
            "type": "FeatureCollection",
            "features": []
        }
    var centerPointGeoJson = {    
            "type": "FeatureCollection",
            "features": []
        }
    var centerPointList = {}
    //read graph result
    $.ajax({
        // url: '/data/testData/OUTPUT_version_1m/map.csv',
        url: '/data/testData/map.csv',
        async: false,
        dataType: 'text',
        success: function successFunction(data) {

            // var allRows = data.split("\n")split(/\r?\n|\r/)
            var allRows = data.split(/\r?\n|\r/)
            
            var cellInfo = allRows[0].replace(/[^\d,]/g,'').split(',')
            if (parseInt(cellInfo[0]) >= parseInt(cellInfo[1])){
                maxCellcount = parseInt(cellInfo[0])
                
            }else{
                maxCellcount = parseInt(cellInfo[1])
            }
            // var allRows = data.replace("\n",'a')

            for (var i = 0; i < allRows.length; i++){
                
                var eachRow = allRows[i].replace(/[^\d,]/g,'').split(',')
                if (eachRow.length >= 4){
                    
                    var x = parseInt(eachRow[0])
                    var y = parseInt(eachRow[1])
                    // var NodeID = x * maxCellcount + x + y
                    var NodeID = x * maxCellcount + y

                    var centerX = StartUTMCoordi[0] + x * cellSize + cellSize / 2
                    var centerY = StartUTMCoordi[1] + y * cellSize + cellSize / 2
                    var centerPoint = SRSTranslator.forward2([centerX, centerY], utmCode, "WGS84")
                    centerPointList[NodeID.toString()] = centerPoint
                    
                    var eachFeature = {
                        "type": "Feature",
                        "properties": {
                            "name": NodeID.toString()
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": centerPoint
                        }
                    }
                    centerPointGeoJson.features.push(eachFeature)
                    
                    testGraph[NodeID.toString()] = {}
                    for (var j = 2; j < eachRow.length; j+=2){
                        
                        var x1 = parseInt(eachRow[j])
                        var y1 = parseInt(eachRow[j+1])
                        // var connectID = x1 * maxCellcount + x1 + y1
                        var connectID = x1 * maxCellcount + y1

                        testGraph[NodeID.toString()][connectID.toString()] = 1
                    }
                }                 
            }
        }
    });
    var pointinfo = Cesium.GeoJsonDataSource.load(centerPointGeoJson);
    pointinfo.then(function(dataSource){
        viewer.dataSources.add(dataSource)          
        var entities = dataSource.entities.values;
    
        var colorHash = {};
        for (var i = 0; i < entities.length; i++) {
        //For each entity, create a random color based on the state name.
        //Some states have multiple entities, so we store the color in a
        //hash so that we use the same color for the entire state.
            var entity = entities[i];
            var name = entity.name;
            entity.label = {
                text: name
            };
            
        }
    // this.viewer.dataSources.add(pointinfo)
    }).otherwise(function(error){
        //Display any errrors encountered while loading.
        window.alert(error);
    });
    var graph = new Graph(testGraph);
    return {graph, centerPointList, centerPointGeoJson, maxCellcount, StartUTMCoordi}
}

GraphGenerator.prototype.readShelfFile = function (maxCellcount){

    var shelf = {}
    $.ajax({
        // url: '/data/TestShelfIndexCollection.csv',
        url: '/data/testData/OUTPUT_version_1m/shelfinfo.csv',
        async: false,
        dataType: 'text',
        success: function successFunction(data) {

            // var allRows = data.split("\n")split(/\r?\n|\r/)
            var allRows = data.split(/\r?\n|\r/)
        
            // var allRows = data.replace("\n",'a')

            for (var i = 0; i < allRows.length; i++){
                
                var eachRow = allRows[i].replace(/[^\w,]/g,'').split(',')
                if (eachRow.length >= 3){
                    var shelfID = eachRow[0]
                    shelf[shelfID] = []
                    for (var j = 1; j < eachRow.length; j+=2){
                        var x1 = parseInt(eachRow[j])
                        var y1 = parseInt(eachRow[j+1])
                        
                        // var connectID = x1 * maxCellcount + x1 + y1
                        var connectID = x1 * maxCellcount + y1

                        shelf[shelfID].push(connectID.toString())
                    }                
                }                    
            }
        }
    });
    return shelf
}

GraphGenerator.prototype.readHistoryFile = function (){
    var FeatureCollections = {}
    
    
    $.ajax({
        url: '/data/testData/PickingHistory_SampleData.csv',
        async: false,
        dataType: 'text',
        success: function successFunction(data) {
            
            var allRows = data.split(/\r?\n|\r/);
            var workerName;
            var checkGroupName;
            var featureCollection = {}
            for (var singleRow = 1; singleRow < allRows.length; singleRow++) {
                if (allRows[singleRow].length !== 0){
                    var WorkerInfo = allRows[singleRow].split(',');
                    var worker = WorkerInfo[0]
                    var datetime = GraphGenerator.changeDateTime(WorkerInfo[1])
                    var groupName = WorkerInfo[2].substring(1, WorkerInfo[2].length-1)
                    var location = WorkerInfo[4].substring(1, WorkerInfo[4].length-1)
                    if (workerName === undefined){
                        workerName = worker
                        FeatureCollections[workerName] = {}
                        FeatureCollections[workerName][groupName] = {
                            "datetimes": [],
                            "location": []
                        }
                        FeatureCollections[workerName][groupName].datetimes.push(datetime)
                        FeatureCollections[workerName][groupName].location.push(location)

                    }else{
                        if (workerName === worker){
                            var GroupKeys = Object.keys(FeatureCollections[workerName])
                            if (GroupKeys.indexOf(groupName) !== -1){
                                FeatureCollections[workerName][groupName].datetimes.push(datetime)
                                FeatureCollections[workerName][groupName].location.push(location)
                            }else{
                                FeatureCollections[workerName][groupName] = {
                                    "datetimes": [],
                                    "location": []
                                }
                                FeatureCollections[workerName][groupName].datetimes.push(datetime)
                                FeatureCollections[workerName][groupName].location.push(location)
                            }
                        }else{
                            workerName = worker
                            var FCKeys = Object.keys(FeatureCollections);
                            if (FCKeys.indexOf(workerName) !== -1){
                                FeatureCollections[workerName][groupName] = {
                                    "datetimes": [],
                                    "location": []
                                }
                                FeatureCollections[workerName][groupName].datetimes.push(datetime)
                                FeatureCollections[workerName][groupName].location.push(location)
                              
                            }else{
                                FeatureCollections[workerName] = {}
                                FeatureCollections[workerName][groupName] = {
                                    "datetimes": [],
                                    "location": []
                                }
                                FeatureCollections[workerName][groupName].datetimes.push(datetime)
                                FeatureCollections[workerName][groupName].location.push(location)
                            }
                        }
                    }
                }
            }
        }
    });
    return FeatureCollections
}
GraphGenerator.prototype.a = function(){

}


GraphGenerator.prototype.testMakeMovingFeature = function(){
    var mapinfo = this.readMapFile()
    
    this.createShelf3DModel(mapinfo.maxCellcount, mapinfo.StartUTMCoordi)
    // var shelfInfo = this.readShelfFile(mapinfo.maxCellcount)
    // var historyInfo = this.readHistoryFile()


    // var historyKeys = Object.keys(historyInfo)
    // var graph = mapinfo.graph
    // for (var i = 0; i < historyKeys.length; i++){
    //     var eachFeatureCollection = historyInfo[historyKeys[i]]
    //     var eachKeyValues = Object.keys(historyInfo[historyKeys[i]])
        
    //     for (var j = 0; j < eachKeyValues.length - 1; j++){
    //         var eachFeature = eachFeatureCollection[eachKeyValues[j]]
    //         for (var k = 0; k < eachFeature.location.length-1; k++){
    //             var startName = eachFeature.location[k]
    //             var endName = eachFeature.location[k+1]
    //             var a = GraphGenerator.getStartEndNodes(startName, endName, shelfInfo, graph)
    //             console.log(a)
    //         }

    //         // var a = GraphGenerator.getStartEndNodes(startName, endName, shelfInfo)
    //         // console.log(a)
    //     }
    //     break
    // }
}


GraphGenerator.changeDateTime = function (workingTime){
    var datetime = new Date(workingTime.substring(1, workingTime.length-1))
    
    var changedTime = `${datetime.getFullYear().toString().padStart(4, '0')}-${
                        (datetime.getMonth()+1).toString().padStart(2, '0')}-${
                        datetime.getDate().toString().padStart(2, '0')}T${
                        datetime.getHours().toString().padStart(2, '0')}:${
                        datetime.getMinutes().toString().padStart(2, '0')}:${
                        datetime.getSeconds().toString().padStart(2, '0')}.${
                        datetime.getMilliseconds().toString().padStart(3,'0')}Z`  
    
    return changedTime
}

GraphGenerator.getStartEndNodes = function(startName, endName, shelfInfo, graph){
    var startNodeList, endNodeList;
    console.log(startName, endName)
    var shelfKeys = Object.keys(shelfInfo)
    for (var shelf_i = 0; shelf_i < shelfKeys.length; shelf_i++){
        var checkKeyValue = shelfKeys[shelf_i]
        
        if (startNodeList === undefined && startName.indexOf(checkKeyValue) !== -1){
            startNodeList = shelfInfo[checkKeyValue]
        }
        if (endNodeList === undefined && endName.indexOf(checkKeyValue) !== -1){
            endNodeList = shelfInfo[checkKeyValue]
        }
        if (startNodeList !== undefined && endNodeList !== undefined){
            console.log(startNodeList, endNodeList)
            var result;
            var checkZero = Infinity
            for (var start_i = 0; start_i < startNodeList.length; start_i++){
                for (var end_i = 0; end_i < endNodeList.length; end_i++){
                    var resultT = graph.findShortestPath(startNodeList[start_i], endNodeList[end_i])
                    console.log(resultT)
                    // if (checkZero > resultT.length){
                    // checkZero = resultT.length
                    // result = resultT
                    // }
                }
            }
            console.log(result)
            return result
        }
    }
}


GraphGenerator.prototype.createShelf3DModel = function(maxCellcount, StartUTMCoordi){
    var shelfList = []
    $.ajax({
        url: '/data/testData/output_memmap.csv',
        async: false,
        dataType: 'text',
        success: function successFunction(data) {
            
            var allRows = data.split(/\r?\n|\r/);
            for (var i = 1; i < allRows.length; i++){
                if (allRows.length > 1){
                    var indexID = allRows[i].split(',');
                    for (var j = 1; j < indexID.length; j++){
                        if (indexID[j] === "9" || indexID[j] == "11"){
                            
                            shelfList.push([j-1, i-1])
                        }
                    }
                }
            }
        }
    });
    var PolygonGeoJson = {    
        "type": "FeatureCollection",
        "features": []
    }
    var startX = StartUTMCoordi[0]
    var startY = StartUTMCoordi[1]

    for (var i = 0; i < shelfList.length; i++){
        var x = shelfList[i][0]
        var y = shelfList[i][1]
        var a = [startX + (1 * x), startY + (1 * y)]
        a
        var b = [startX + (1 * (x+1)), startY + (1 * y)]
        var c = [startX + (1 * (x+1)), startY + (1 * (y + 1))]
        var d = [startX + (1 * (x)), startY + (1 * (y + 1))]
        var polygon = []
        var NodeID = x * maxCellcount + y
        polygon.push(SRSTranslator.forward2(a, "EPSG:6677", "WGS84"))
        polygon.push(SRSTranslator.forward2(b, "EPSG:6677", "WGS84"))
        polygon.push(SRSTranslator.forward2(c, "EPSG:6677", "WGS84"))
        polygon.push(SRSTranslator.forward2(d, "EPSG:6677", "WGS84"))
        polygon.push(SRSTranslator.forward2(a, "EPSG:6677", "WGS84"))
        var eachFeature = {
            "type": "Feature",
            "properties": {
                "name": NodeID
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [polygon]
            }
        }
        PolygonGeoJson.features.push(eachFeature)
    }
    var promise = Cesium.GeoJsonDataSource.load(PolygonGeoJson);

    promise.then(function(dataSource){
        this.viewer.dataSources.add(dataSource)          
        var entities = dataSource.entities.values;
        for (var i = 0; i < entities.length; i++) {
       
            var entity = entities[i];
            var name = entity.name;
            entity.label = {
                text: name
            };
            entity.polygon.material = Cesium.Color.RED;
            entity.polygon.outline = false;  
            entity.polygon.extrudedHeight = 5;
          
        }
    });
        
}
// //read shelf result


// var graph = new Graph(testGraph);


// // Making MovingFeature

// var MFCollectionList = []
// var czml;
// $.ajax({
//     url: '/data/HistorySampleData.csv',
//     async: false,
//     dataType: 'text',
//     success: function successFunction(data) {

//         var allRows = data.split(/\r?\n|\r/);
//         var firstCheck = true
//         var checkName;
//         var eachMFC = {
//             "type": "FeatureCollection",
//             "features": []
//         }
//         var shelfKeys = Object.keys(shelf)
        
//         for (var singleRow = 1; singleRow < allRows.length; singleRow+=2) {
            
//             var startInfo = allRows[singleRow].split(',');
//             var endInfo = allRows[singleRow+1].split(',');                
//             if (firstCheck){
//                 firstCheck = false;
//                 checkName = allRows[0]
//                 eachMFC["name"] = checkName
//             }
//             if (checkName !== allRows[0]){
//                 checkName = allRows[0]
//                 eachMFC = {
//                     "type": "FeatureCollection",
//                     "name": checkName,
//                     "features": []
//                 }
//             }
                
//             if (startInfo[2] === endInfo[2]){
//                 var startT = new Date(startInfo[1].substring(1, startInfo[1].length-1))
//                 var endT = new Date(endInfo[1].substring(1, startInfo[1].length-1))
//                 var featureName = startInfo[2]
//                 var StartID = startInfo[4]
//                 var EndID = endInfo[4]
//                 var StartDatetime = `${startT.getFullYear().toString().padStart(4, '0')}-${
//                     (startT.getMonth()+1).toString().padStart(2, '0')}-${
//                     startT.getDate().toString().padStart(2, '0')}T${
//                     startT.getHours().toString().padStart(2, '0')}:${
//                     startT.getMinutes().toString().padStart(2, '0')}:${
//                     startT.getSeconds().toString().padStart(2, '0')}.${
//                     startT.getMilliseconds().toString().padStart(3,'0')}Z`                 
//                 var EndDatetime = `${endT.getFullYear().toString().padStart(4, '0')}-${
//                     (endT.getMonth()+1).toString().padStart(2, '0')}-${
//                     endT.getDate().toString().padStart(2, '0')}T${
//                     endT.getHours().toString().padStart(2, '0')}:${
//                     endT.getMinutes().toString().padStart(2, '0')}:${
//                     endT.getSeconds().toString().padStart(2, '0')}.${
//                     endT.getMilliseconds().toString().padStart(3,'0')}Z`      

//                 var startNodeList;
//                 var endNodeList;
//                 var coordinates = []
//                 for (var shelf_i = 0; shelf_i < shelfKeys.length; shelf_i++){
//                     var checkKeyValue = shelfKeys[shelf_i]
                    
//                     if (startNodeList === undefined && StartID.indexOf(checkKeyValue) !== -1){
//                         startNodeList = shelf[checkKeyValue]
//                     }
//                     if (endNodeList === undefined && EndID.indexOf(checkKeyValue) !== -1){
//                         endNodeList = shelf[checkKeyValue]
//                     }
//                     if (startNodeList !== undefined && endNodeList !== undefined){

//                         var result;
//                         var checkZero = Infinity
//                         for (var start_i = 0; start_i < startNodeList.length; start_i++){
//                             for (var end_i = 0; end_i < endNodeList.length; end_i++){
//                                 var resultT = graph.findShortestPath(startNodeList[start_i], endNodeList[end_i])
                                
//                                 if (checkZero > resultT.length){
//                                 checkZero = resultT.length
//                                 result = resultT
//                                 }
//                             }
//                         }
//                         for (var k = 0; k < result.length; k++) {


//                             coordinates.push(centerPointList[result[k]])
//                         }
                        
//                         break    
//                     }

//                 }
                
//                 var eachFeature = MFGenerator.makeMovingPoint(featureName, StartDatetime, EndDatetime, coordinates) 

//                 czml = MFGenerator.moveMovingPoint({
//                     temporalGeometry: eachFeature.temporalGeometry,
//                     number: 1,
//                     id: 1
//                 })

                
//             }
                  
//         }
//     }
// });
// var load_czml = Cesium.CzmlDataSource.load(czml);
// viewer.dataSources.add(load_czml);
// var pointinfo = Cesium.GeoJsonDataSource.load(centerPointGeoJson);
// viewer.dataSources.add(pointinfo)
// var promise = Cesium.GeoJsonDataSource.load("gridmapTest01.json");
// var positionList = []
// promise.then(function(dataSource){
//     viewer.dataSources.add(dataSource)          
//     var entities = dataSource.entities.values;

    
//     var colorHash = {};
//     for (var i = 0; i < entities.length; i++) {
//     //For each entity, create a random color based on the state name.
//     //Some states have multiple entities, so we store the color in a
//     //hash so that we use the same color for the entire state.
//         var entity = entities[i];
//         var name = entity.name;
    
//         // var color = colorHash[name];
//         // if (!color) {
//         //   color = Cesium.Color.fromRandom({
//         //     alpha: 1.0,
//         //   });
//         //   colorHash[name] = color;
//         // }
//         if (entity.polygon !== undefined){
//             //Set the polygon material to our random color.
            
//             if (entity.name !== undefined){ 
//             var findingString1 = "shelf"
                
//                 if (name.indexOf(findingString1)!== -1){
//                     var findingString2 = "Enter"
//                     if (name.indexOf(findingString2)!== -1){
//                         entity.polygon.material = Cesium.Color.AQUAMARINE;
//                         entity.polygon.outline = false;  
//                         entity.polygon.extrudedHeight = 0;
//                     }else{
//                         entity.polygon.material = Cesium.Color.RED;
//                         entity.polygon.outline = false;  
//                         entity.polygon.extrudedHeight = 0;
//                     }
//                 }
//             }
//             else{
                                  
//                 entity.polygon.material = Cesium.Color.BLACK.withAlpha(0);
//                 entity.polygon.outline = true;
//                 // if (result2.indexOf(i)!== -1){
//                 //     entity.polygon.material = Cesium.Color.RED.withAlpha(0.5);
//                 // //Remove the outlines.
//                 //     entity.polygon.outline = true;
//                 // }else{
//                 //     entity.polygon.material = Cesium.Color.BLACK.withAlpha(0);
//                 // //Remove the outlines.
//                 //     entity.polygon.outline = true;
//                 // }
//             }
//         // if (entity.polygon.hierarchy.getValue().positions.length > 5){
            
//         // }
      
//         }else{
            
//             entity.polyline.width = 5
//             entity.polyline.material = Cesium.Color.BLUE.withAlpha(0.5);
//         }

//     }