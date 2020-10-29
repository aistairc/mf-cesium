function GraphGenerator(viewer){
    this.viewer = viewer
    this.graph;
    this.maxCellcount;
    this.cellSize = 0.5
    this.boxSize = 100
    this.workingStopTime = 2000
    this.utmCode = "EPSG:6677"
    this.workerName = "Worker"
    this.MapFileName = '/data/testData/partsCenter_153721.csv'
    this.ShelfFileName = '/data/testData/partsCenter_s_info_153721.csv'
    this.HistoryFileName = '/data/testData/PickingHistory_SampleData.csv'
    this.ModelPath = '/data/testData/1027_output_memmap.csv'
    
    // this.GridMap = new GridMap([102,77], 50)
    // this.testMakeMovingFeature()
    this.call()
    
}
GraphGenerator.prototype.call = function (){
    var ProgramStartTime = new Date().toISOString()
    var a = readGeoJSON("/data/testData/sample.geojson", 500)

    this.graphMap = a.printIndoorGraph()
    this.graphShelf = a.printShelfOpenTo()
    this.Shelf3DModel = a.printGridMap()
    console.log(a.shelfInfo)
    // var mapinfo = this.readMapFile2()
    // this.createShelf3DModel2(mapinfo.maxCellcount)
    // this.readShelfFile2(mapinfo.maxCellcount)
    
    // var historyInfo = this.readHistoryFile()
    

    // var historyKeys = Object.keys(historyInfo)
    
    // var FeatureCollectionList = {
    //     name: "20201027_GraphResult",
    //     properties: {
    //         name: "20201027_GraphResult"
    //     },
    //     type: "FeatureCollection",
    //     features: []
    // }
    // for (var i = 0; i < historyKeys.length; i++){
    //     // var eachMovingFeatureCollection = {
    //     //     name: historyKeys[i],
    //     //     type: "FeatureCollection",
    //     //     features: []
    //     // }
    //     var workerName = historyKeys[i]
    //     var eachMovingFeatureCollection = {
    //         properties:{
    //             name:workerName,
    //         },
    //         name: this.workerName + "-" + workerName,
    //         type: "Feature",
    //         temporalGeometry: {
    //             type: "MovingGeometryCollection",
    //             prisms: []
    //         }
    //     }
        
    //     var eachFeatureCollection = historyInfo[workerName]
    //     var eachKeyValues = Object.keys(historyInfo[workerName])
        
        
    //     console.log(workerName)
        
    //     if (eachKeyValues.length !== 0){
    //         for (var j = 0; j < eachKeyValues.length - 1; j++){
    //             var eachFeature = eachFeatureCollection[eachKeyValues[j]]
                
    //             if(eachFeature.location.length > 1){                    
    //                 // console.log(eachFeature)
                    
    //                 var MovingFeatureInfo = this.getMovingFeature(eachFeature)    
    //                 MovingFeatureInfo["name"] = this.workerName + "-" + workerName+"_"+eachKeyValues[j]
    //                 var eachMovingFeature = this.createMovingPoint(MovingFeatureInfo)
    //                 if (eachMovingFeature !== false){
    //                     eachMovingFeatureCollection.temporalGeometry.prisms.push(eachMovingFeature)
    //                 }
                    
    //             }else{
    //                 if (eachFeature.location.length == 1){
    //                     var MovingFeatureInfo = this.makeOneLocationInfo(eachFeature)
    //                     if (MovingFeatureInfo !== false){
    //                         MovingFeatureInfo["name"] = this.workerName + "-" + workerName+"_"+eachKeyValues[j]
    //                         var eachMovingFeature = this.createMovingPoint(MovingFeatureInfo)
    //                         eachMovingFeatureCollection.temporalGeometry.prisms.push(eachMovingFeature)
    //                     }
                        
    //                 }
                    
    //             }
    //             break
                
    //         }
    //         if (eachMovingFeatureCollection.temporalGeometry.prisms.length > 0){
    //             FeatureCollectionList.features.push(eachMovingFeatureCollection)
    //         }
    //         break
            
            
        
    //     }    
        
    //     // FeatureCollectionList.push(eachMovingFeatureCollection)
        
    // }
    // if (FeatureCollectionList.features.length > 0){
    //     this.saveMFJSON(FeatureCollectionList)
    // }
    
    // // handleEditorData("20201027_GraphResult", FeatureCollectionList)  
    // var ProgramEndTime = new Date().toISOString()
    // console.log(ProgramStartTime, ProgramEndTime)    
}

GraphGenerator.prototype.readMapFile2 = function (){

    var StartPoint = [139.77744515681255, 35.61793664193283]
    var utmCode = this.utmCode
    var StartUTMCoordi;
    if (SRSTranslator.crsCheck2(utmCode)){
        StartUTMCoordi = SRSTranslator.forward2(StartPoint, "WGS84", utmCode)
        this.setStartUTMCoordi(StartUTMCoordi)
    }
    var maxCellcount
    var cellSize = this.cellSize //m
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
    var centerPointList2 = {}
    var allRows = this.graphMap.split(/\r?\n|\r/)
    var cellInfo = allRows[0].replace(/[^\d,]/g,'').split(',')
    if (parseInt(cellInfo[0]) >= parseInt(cellInfo[1])){
        maxCellcount = parseInt(cellInfo[0])
        
    }else{
        maxCellcount = parseInt(cellInfo[1])
    }
    

    for (var i = 0; i < allRows.length; i++){
        
        var eachRow = allRows[i].replace(/[^\d,]/g,'').split(',')
        if (eachRow.length >= 4){
            
            var x = parseInt(eachRow[0])
            var y = parseInt(eachRow[1])
            
            var NodeID = x * maxCellcount + y

            var centerX = StartUTMCoordi[0] + x * cellSize + cellSize / 2
            var centerY = StartUTMCoordi[1] + y * cellSize + cellSize / 2
            

            var centerPoint = SRSTranslator.forward2([centerX, centerY], utmCode, "WGS84")
            centerPointList[NodeID.toString()] = centerPoint
            centerPointList2[NodeID.toString()] = [x, y]

            
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
            entity.billboard.show = false
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
    this.setGraphInfo(testGraph)
    this.setGraph(graph)
    this.setCenterPointList(centerPointList)
    this.setCenterPointList2(centerPointList2)

    return {maxCellcount, StartUTMCoordi}
    
}
GraphGenerator.prototype.createShelf3DModel2 = function(maxCellcount){
    var shelfList = []
    var cellLength = this.cellSize
    
        
    var allRows = this.Shelf3DModel.split(/\r?\n|\r/);
    
    for (var i = 0; i < allRows.length; i++){
        
        var indexID = allRows[i].split(',');
        for (var j = 0; j < indexID.length; j++){
            if (indexID[j] === "9" || indexID[j] == "11"){
                console.log(j, i)
                shelfList.push([j, i])
            }
        }
    
    }
   console.log(shelfList)
    var PolygonGeoJson = {    
        "type": "FeatureCollection",
        "features": []
    }
    var startX = this.StartUTMCoordi[0]
    var startY = this.StartUTMCoordi[1]

    for (var i = 0; i < shelfList.length; i++){
        var x = shelfList[i][0]
        var y = shelfList[i][1]
        var a = [startX + (cellLength * x), startY + (cellLength * y)]
        var b = [startX + (cellLength * (x+1)), startY + (cellLength * y)]
        var c = [startX + (cellLength * (x+1)), startY + (cellLength * (y + 1))]
        var d = [startX + (cellLength * (x)), startY + (cellLength * (y + 1))]
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
    this.set3DModelInfo(PolygonGeoJson)
    var promise = Cesium.GeoJsonDataSource.load(PolygonGeoJson);
    
    promise.then(function(dataSource){
        this.viewer.dataSources.add(dataSource)          
        var entities = dataSource.entities.values;
        for (var i = 0; i < entities.length; i++) {
       
            var entity = entities[i];
            var name = entity.name;
            
            entity.polygon.material = Cesium.Color.RED;
            entity.polygon.outline = false;  
            
          
          
        }
    }).otherwise(function(error){
        //Display any errrors encountered while loading.
        window.alert(error);
    });
        
}
GraphGenerator.prototype.readShelfFile2 = function (maxCellcount){

    var shelf = {}
  
    // var allRows = data.split("\n")split(/\r?\n|\r/)
    var allRows = this.graphShelf.split(/\r?\n|\r/)

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
    
    this.setShelfInfo(shelf)
    return shelf
}
GraphGenerator.prototype.readMapFile = function (){

    var StartPoint = [139.77744515681255, 35.61793664193283]
    var utmCode = this.utmCode
    var StartUTMCoordi;
    if (SRSTranslator.crsCheck2(utmCode)){
        StartUTMCoordi = SRSTranslator.forward2(StartPoint, "WGS84", utmCode)
        this.setStartUTMCoordi(StartUTMCoordi)
    }
    var maxCellcount
    var cellSize = this.cellSize //m
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
    var centerPointList2 = {}
    
    //read graph result
    $.ajax({
        // url: '/data/testData/OUTPUT_version_1m/map.csv',
        url: this.MapFileName,
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

                    // var centerX = StartUTMCoordi[0] + x * cellSize + cellSize / 2
                    // var centerY = StartUTMCoordi[1] + y * cellSize + cellSize / 2
                    

                    // var centerPoint = SRSTranslator.forward2([centerX, centerY], utmCode, "WGS84")
                    // centerPointList[NodeID.toString()] = centerPoint
                    centerPointList2[NodeID.toString()] = [x, y]

                    
                    // var eachFeature = {
                    //     "type": "Feature",
                    //     "properties": {
                    //         "name": NodeID.toString()
                    //     },
                    //     "geometry": {
                    //         "type": "Point",
                    //         "coordinates": centerPoint
                    //     }
                    // }
                    // centerPointGeoJson.features.push(eachFeature)
                    
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
    // var pointinfo = Cesium.GeoJsonDataSource.load(centerPointGeoJson);
    // pointinfo.then(function(dataSource){
    //     viewer.dataSources.add(dataSource)          
    //     var entities = dataSource.entities.values;
    
    //     var colorHash = {};
        
    //     for (var i = 0; i < entities.length; i++) {
    //     //For each entity, create a random color based on the state name.
    //     //Some states have multiple entities, so we store the color in a
    //     //hash so that we use the same color for the entire state.
    //         var entity = entities[i];
    //         var name = entity.name;
    //         entity.billboard.show = false
    //         entity.label = {
    //             text: name
    //         };
            
    //     }
    // // this.viewer.dataSources.add(pointinfo)
    // }).otherwise(function(error){
    //     //Display any errrors encountered while loading.
    //     window.alert(error);
    // });
    var graph = new Graph(testGraph);
    this.setGraphInfo(testGraph)
    this.setGraph(graph)
    this.setCenterPointList(centerPointList)
    this.setCenterPointList2(centerPointList2)

    return {maxCellcount, StartUTMCoordi}
}


GraphGenerator.prototype.readShelfFile = function (maxCellcount){

    var shelf = {}
    $.ajax({
        // url: '/data/TestShelfIndexCollection.csv',
        url: this.ShelfFileName,
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
    this.setShelfInfo(shelf)
    return shelf
}

GraphGenerator.prototype.readHistoryFile = function (){
    var FeatureCollections = {}
    
    
    $.ajax({
        url: this.HistoryFileName,
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
                    var datetime = GraphGenerator.changeDateTime(WorkerInfo[1], false)
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
GraphGenerator.prototype.createMovingPoint = function(options){
    // var Feature = {
    //     name: option.name,
    //     type: "Feature",
    //     properties: {
    //         name: option.name
    //     },
    //     temporalGeometry: {
    //         type: "MovingPoint",
    //         datetimes: option.datetimes,
    //         coordinates: option.coordinates,
    //         interpolation: "Linear"
    //     },
    //     temporalProperties:[{}]
    // }
    
    if (options.datetimes.length > 1 && options.coordinates.length > 1){
        var Feature = {
            name: options.name,
            properties: {
                name: options.name
            },
            type:"MovingPoint",
            datetimes: options.datetimes,
            coordinates: options.coordinates,
            interpolation: "Linear"        
        }
        return Feature
    }else{
        return false
    }
}
GraphGenerator.prototype.testMakeMovingFeature = function(){
    var ProgramStartTime = new Date().toISOString()
    
    var mapinfo = this.readMapFile()
    
    this.createShelf3DModel(mapinfo.maxCellcount, mapinfo.StartUTMCoordi)
    this.readShelfFile(mapinfo.maxCellcount)
    var historyInfo = this.readHistoryFile()
    

    var historyKeys = Object.keys(historyInfo)
    
    var FeatureCollectionList = {
        name: "20201027_GraphResult",
        properties: {
            name: "20201027_GraphResult"
        },
        type: "FeatureCollection",
        features: []
    }
    for (var i = 0; i < historyKeys.length; i++){
        // var eachMovingFeatureCollection = {
        //     name: historyKeys[i],
        //     type: "FeatureCollection",
        //     features: []
        // }
        var workerName = historyKeys[i]
        var eachMovingFeatureCollection = {
            properties:{
                name:workerName,
            },
            name: this.workerName + "-" + workerName,
            type: "Feature",
            temporalGeometry: {
                type: "MovingGeometryCollection",
                prisms: []
            }
        }
        
        var eachFeatureCollection = historyInfo[workerName]
        var eachKeyValues = Object.keys(historyInfo[workerName])
        
        
        console.log(workerName)
        
        if (eachKeyValues.length !== 0){
            for (var j = 0; j < eachKeyValues.length - 1; j++){
                var eachFeature = eachFeatureCollection[eachKeyValues[j]]
                
                if(eachFeature.location.length > 1){                    
                    // console.log(eachFeature)
                    
                    var MovingFeatureInfo = this.getMovingFeature(eachFeature)    
                    MovingFeatureInfo["name"] = this.workerName + "-" + workerName+"_"+eachKeyValues[j]
                    var eachMovingFeature = this.createMovingPoint(MovingFeatureInfo)
                    if (eachMovingFeature !== false){
                        eachMovingFeatureCollection.temporalGeometry.prisms.push(eachMovingFeature)
                    }
                    
                }else{
                    if (eachFeature.location.length == 1){
                        var MovingFeatureInfo = this.makeOneLocationInfo(eachFeature)
                        if (MovingFeatureInfo !== false){
                            MovingFeatureInfo["name"] = this.workerName + "-" + workerName+"_"+eachKeyValues[j]
                            var eachMovingFeature = this.createMovingPoint(MovingFeatureInfo)
                            console.log(eachMovingFeature)
                            eachMovingFeatureCollection.temporalGeometry.prisms.push(eachMovingFeature)
                        }
                        
                    }
                    
                }
                
            }
            if (eachMovingFeatureCollection.temporalGeometry.prisms.length > 0){
                FeatureCollectionList.features.push(eachMovingFeatureCollection)
            }
            
            
        //     // handleEditorData(historyKeys[i], eachMovingFeatureCollection)          
        }    
        
        // FeatureCollectionList.push(eachMovingFeatureCollection)
        
    }
    if (FeatureCollectionList.features.length > 0){
        this.saveMFJSON(FeatureCollectionList)
    }
    
    // handleEditorData("20201027_GraphResult", FeatureCollectionList)  
    var ProgramEndTime = new Date().toISOString()
    console.log(ProgramStartTime, ProgramEndTime)    
}

GraphGenerator.checkingDupleValue = function(startNodeList, endNodeList){

    if (startNodeList.length == endNodeList.length){
        var checkCount = 0
        for (var i = 0; i < startNodeList.length; i++){
            if (endNodeList.indexOf(startNodeList[i])){
                checkCount++
            }
        }
        if (checkCount == endNodeList.length){
            
            return true
        }
    }
    return false
}

GraphGenerator.changeDateTime = function (workingTime, checkMode){
    var datetime
    if (checkMode){
        datetime = new Date(workingTime)
        return datetime.toISOString()

    }else{
        datetime = new Date(workingTime.substring(1, workingTime.length-1))
    }
    
    var changedTime = `${datetime.getFullYear().toString().padStart(4, '0')}-${
                        (datetime.getMonth()+1).toString().padStart(2, '0')}-${
                        datetime.getDate().toString().padStart(2, '0')}T${
                        datetime.getHours().toString().padStart(2, '0')}:${
                        datetime.getMinutes().toString().padStart(2, '0')}:${
                        datetime.getSeconds().toString().padStart(2, '0')}.${
                        datetime.getMilliseconds().toString().padStart(3,'0')}Z`  
    
    return changedTime
}
// GraphGenerator.prototype.getStartNode = function(startNodeList){

//     for(var i = 0; i < startNodeList.length; i++){
//         while (true){

//         }
//     }
// }   
GraphGenerator.prototype.getPath = function(startNodeList, endNodeList, sameCheck, endNode){
    var result;
    var checkInfMax = Infinity
    var checkInfMin = -Infinity
    
    if (endNode === undefined){
        // var startNode = this.getStartNode(startNodeList)
        for (var start_i = 0; start_i < startNodeList.length; start_i++){
            for (var end_i = 0; end_i < endNodeList.length; end_i++){
                var resultT = this.graph.findShortestPath(startNodeList[start_i], endNodeList[end_i])
                if (resultT !== null){
                    if (sameCheck){
                        if (checkInfMin < resultT.length){
                            checkInfMin = resultT.length
                            result = resultT
                        }
                    }else{
                        if (checkInfMax > resultT.length){
                            checkInfMax = resultT.length
                            result = resultT
                        }
                    }
                }
            }
        }
    }else{
        if (startNodeList.indexOf(endNode) !== -1){
            for (var end_i = 0; end_i < endNodeList.length; end_i++){
                var resultT = this.graph.findShortestPath(endNode, endNodeList[end_i])
                if (resultT !== null){
                    if (sameCheck){
                        if (checkInfMin < resultT.length){
                            checkInfMin = resultT.length
                            result = resultT
                        }
                    }else{
                        if (checkInfMax > resultT.length){
                            checkInfMax = resultT.length
                            result = resultT
                        }
                    }
                }
            }
        }
    }
    
    return result
}

GraphGenerator.prototype.makeDatetimes = function(startTime, endTime, pathInfo, checkFirst){
    
    var dateTimeList = []
    var totalSUM = pathInfo.totalSUM
    var eachNodeLengthRate = pathInfo.eachNodeLengthRate
    var ST = new Date(startTime).getTime() + 2000;
    var ET = new Date(endTime).getTime() - 2000;
    var timeRange = (ET - ST)
    
    var startTime2 = GraphGenerator.changeDateTime(ST, true)
    
    dateTimeList.push(startTime2)
    if(eachNodeLengthRate.length > 1){
        for (var i = 0; i < eachNodeLengthRate.length-1; i++){
            var eachTime = GraphGenerator.changeDateTime(ST + (timeRange * eachNodeLengthRate[i] / totalSUM), true)
            ST += (timeRange * eachNodeLengthRate[i] / totalSUM)
            dateTimeList.push(eachTime)
        }
    }
    var endTime2 = GraphGenerator.changeDateTime(ET, true)
    dateTimeList.push(endTime2)
    
    return dateTimeList
}

GraphGenerator.prototype.setGraph = function(graph){
    this.graph = graph
}
GraphGenerator.prototype.setGraphInfo = function(testGraph){
    this.graphInfo = testGraph
}
GraphGenerator.prototype.setShelfInfo = function(shelfInfo){
    this.shelfInfo = shelfInfo
}
GraphGenerator.prototype.setCenterPointList = function(centerPointList){
    this.centerPointList = centerPointList
}
GraphGenerator.prototype.setCenterPointList2 = function(centerPointList2){
    this.centerPointList2 = centerPointList2
}
GraphGenerator.prototype.makeOneLocationInfo = function(eachFeature){
    var startTime = eachFeature.datetimes[0]
    var startName = eachFeature.location[0]
    var endNode;
    var tempNodeList = this.getStartEndNodes(startName, startName, endNode)
    if (tempNodeList === undefined){
        return false
    }else{
        
        var datetimes = []
        var ST = new Date(startTime).getTime()
        // console.log(ST, ST+this.workingStopTime)
        var endTime = GraphGenerator.changeDateTime(ST+this.workingStopTime, true)
        datetimes.push(startTime)
        datetimes.push(endTime)
        var coordi = [this.centerPointList2[tempNodeList[0]]]
        var coordinates = this.convertCoordiToWGS84(coordi)
        return {coordinates, datetimes}
    }
}
GraphGenerator.prototype.getMovingFeature = function(eachFeature){
    var endNode;
    var pathNodeList = []
    var tempDatetimes = []

 
    for (var k = 0; k < eachFeature.location.length-1; k++){
        var startName = eachFeature.location[k]
        var startTime = eachFeature.datetimes[k]
        var endName = eachFeature.location[k+1]
        var endTime = eachFeature.datetimes[k+1]
        
        var tempNodeList = this.getStartEndNodes(startName, endName, endNode)
        var testSimplify = []
                
        if (tempNodeList !== undefined){     
            for (var i = 0; i < tempNodeList.length; i++){
                var coordi = this.centerPointList2[tempNodeList[i]]
                testSimplify.push(coordi)
            }    
            var resultSimplify = simplify(testSimplify, 0.1, true)
            if (resultSimplify.length == 1){
                resultSimplify.push(resultSimplify[0])
            }
            
            endNode = tempNodeList[tempNodeList.length - 1]  
            
            var resultLengthRate = this.getLengthRate(resultSimplify)
            tempDatetimes.push(...this.makeDatetimes(startTime, endTime, resultLengthRate, false))
            
            pathNodeList.push(...resultSimplify)
                
            // }else{
            //     if (resultSimplify.length == 1){
            //         resultSimplify.push(resultSimplify[0])
            //     }
            //     tempDatetimes.push(...this.makeDatetimes(startTime, endTime, resultSimplify.length, false))
                
            //     pathNodeList.push(...resultSimplify)
            // }
                        
        }
    }
    var coordinates = this.convertCoordiToWGS84(pathNodeList) 
    var addStartTime = this.addTimeValue(tempDatetimes[0], false) 
    var addEndTime = this.addTimeValue(tempDatetimes[tempDatetimes.length - 1], true) 
    var datetimes = [addStartTime].concat(tempDatetimes)

    datetimes.push(addEndTime)
    
    return {coordinates, datetimes}
    
   
}
GraphGenerator.prototype.getLengthRate = function(resultSimplify){
    var eachNodeLengthRate = []
    var totalSUM = 0
    for (var i = 0; i < resultSimplify.length - 1; i++){
        var currInfo = resultSimplify[i]
        var nextInfo = resultSimplify[i + 1]
        var nodeLength = Math.abs((currInfo[0] - nextInfo[0]) + (currInfo[1] - nextInfo[1]))
        totalSUM += nodeLength
        eachNodeLengthRate.push(nodeLength)
    }

    return {totalSUM, eachNodeLengthRate}
}
GraphGenerator.prototype.convertCoordiToWGS84 = function(localCoordiList){
    var coordinates = []
    for (var i = 0; i < localCoordiList.length; i++){
        var centerX = this.StartUTMCoordi[0] + localCoordiList[i][0] * this.cellSize + this.cellSize / 2
        var centerY = this.StartUTMCoordi[1] + localCoordiList[i][1] * this.cellSize + this.cellSize / 2
        var coordinate = SRSTranslator.forward2([centerX, centerY], this.utmCode, "WGS84")
        if (i == 0 || i == localCoordiList.length - 1){
            coordinates.push(coordinate)
        }
        coordinates.push(coordinate)
    }
    return coordinates
}

GraphGenerator.prototype.getStartEndNodes = function(startName, endName, endNode){
    var startNodeList, endNodeList;
    var shelfKeys = Object.keys(this.shelfInfo)
    var startNodeValue, endNodeValue
    var pathResult;
    for (var shelf_i = 0; shelf_i < shelfKeys.length; shelf_i++){
        var checkKeyValue = shelfKeys[shelf_i]
        if (startNodeList === undefined && startName.indexOf(checkKeyValue) !== -1){
            startNodeList = this.shelfInfo[checkKeyValue]
            startNodeValue = checkKeyValue
        }
        if (endNodeList === undefined && endName.indexOf(checkKeyValue) !== -1){
            endNodeList = this.shelfInfo[checkKeyValue]
            endNodeValue = checkKeyValue
        }
        if (startNodeList !== undefined && endNodeList !== undefined){
            
            
            if (endNode !== undefined){
                
                if (startNodeValue === endNodeValue){
                    
                    pathResult = (this.getPath(startNodeList, endNodeList, false, endNode))
                }else if (startNodeList.length === endNodeList.length){
                    
                    if (GraphGenerator.checkingDupleValue(startNodeList, endNodeList)){
                        
                        pathResult = (this.getPath(startNodeList, endNodeList, false, endNode))
                    }else{    
                        
                        pathResult = (this.getPath(startNodeList, endNodeList, false, endNode))
                    }
                }else{
                    pathResult = (this.getPath(startNodeList, endNodeList, false, endNode))
                }
            }else{            
                
                if (startNodeValue === endNodeValue){
                    
                    pathResult = this.getPath(startNodeList, endNodeList, false)
                
                }else if (startNodeList.length === endNodeList.length){
                    
                    if (GraphGenerator.checkingDupleValue(startNodeList, endNodeList)){
                        pathResult = this.getPath(startNodeList, endNodeList, false)
                    }else{    
                        pathResult = this.getPath(startNodeList, endNodeList, false)
                    }
                }else{
                    pathResult = this.getPath(startNodeList, endNodeList, false)
                }   
            }
            break
        } 
    }    
    
    
    
    
    return pathResult
}


GraphGenerator.prototype.createShelf3DModel = function(maxCellcount, StartUTMCoordi){
    var shelfList = []
    var cellLength = this.cellSize
    $.ajax({
        url: this.ModelPath,
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
        var a = [startX + (cellLength * x), startY + (cellLength * y)]
        var b = [startX + (cellLength * (x+1)), startY + (cellLength * y)]
        var c = [startX + (cellLength * (x+1)), startY + (cellLength * (y + 1))]
        var d = [startX + (cellLength * (x)), startY + (cellLength * (y + 1))]
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
    this.set3DModelInfo(PolygonGeoJson)
    // var promise = Cesium.GeoJsonDataSource.load(PolygonGeoJson);
    
    // promise.then(function(dataSource){
    //     this.viewer.dataSources.add(dataSource)          
    //     var entities = dataSource.entities.values;
    //     for (var i = 0; i < entities.length; i++) {
       
    //         var entity = entities[i];
    //         var name = entity.name;
            
    //         entity.polygon.material = Cesium.Color.RED;
    //         entity.polygon.outline = false;  
            
          
          
    //     }
    // }).otherwise(function(error){
    //     //Display any errrors encountered while loading.
    //     window.alert(error);
    // });
        
}
GraphGenerator.prototype.set3DModelInfo = function(PolygonGeoJson){
    this.PolygonGeoJson = PolygonGeoJson
}
GraphGenerator.prototype.get3DModelInfo = function(){
    return this.PolygonGeoJson
}
GraphGenerator.prototype.setStartUTMCoordi = function(StartUTMCoordi){
    this.StartUTMCoordi = StartUTMCoordi
}
GraphGenerator.prototype.loading3DModel = function(){
    var promise = Cesium.GeoJsonDataSource.load(this.PolygonGeoJson);

    promise.then(function(dataSource){
        this.viewer.dataSources.add(dataSource)          
        var entities = dataSource.entities.values;
        for (var i = 0; i < entities.length; i++) {
       
            var entity = entities[i];
            var name = entity.name;
            // entity.label = {
            //     text: name
            // };
            // entity.polygon.material = Cesium.Color.RED;
            entity.polygon.material = Cesium.Color.RED;
            entity.polygon.outline = false;  
            
            entity.polygon.extrudedHeight = 1;
            
            
          
        }
    }).otherwise(function(error){
        //Display any errrors encountered while loading.
        window.alert(error);
    });
}

GraphGenerator.prototype.addTimeValue = function(timeValue, checkValue){
    var addedTime;
    
    if (checkValue){
        
        addedTime = new Date(timeValue).getTime() + this.workingStopTime
        
    }else{
        addedTime = new Date(timeValue).getTime() - this.workingStopTime
    }
    
    return new Date(addedTime).toISOString()
}
GraphGenerator.prototype.saveMFJSON = function(FeatureCollectionList){
    $.ajax({
        type: "POST",
        url: "/saveJSON",
        async: true,
        contentType: "application/json",
        data: JSON.stringify(FeatureCollectionList),
        dataType: "json",
        success: function(json, status){
            if (status != "success") {
                
                return;
            }
            
        },
        error: function(result, status, err) {
            
            return;
        }
    });
}