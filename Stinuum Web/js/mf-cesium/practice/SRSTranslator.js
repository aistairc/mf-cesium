function SRSTranslator(projectionDefinitions){

    this.projections = {}
    this.transformations = {}
    projectionDefinitions = Object.assign(
        this.getDefaultDefinitions(), 
        projectionDefinitions || {}
    )
    for(let name in projectionDefinitions){
        this.addProjection(name, projectionDefinitions[name])
    }
}

SRSTranslator.prototype.addProjection = function (name, projection){
    this.projections[name] = projection
}

SRSTranslator.prototype.forward = function (coords, projectionFrom, projectionTo){
    console.log(coords)
    let height = undefined
    if (coords.length === 3){
        height = coords.pop()
    }
    console.log(height)
    let transformation = this.getTransformation(projectionFrom, projectionTo)
    coords = transformation.forward(coords)
    
    if (typeof(height) !== 'undefined') {
      coords[2] = height
    }

    return coords
}

SRSTranslator.prototype.getTransformation = function (projectionFrom, projectionTo) {
    if(projectionFrom[0] == "NAME"){
        let cacheKey = `${projectionFrom}:::${projectionTo}`
        if (!this.transformations[cacheKey]) {
            let from = this.getProjection(projectionFrom[1])
            let to = this.getProjection(projectionTo)
            
            this.transformations[cacheKey] = proj4(from, to)
        }
        return this.transformations[cacheKey]

    }else if (projectionFrom[0] == "LINK"){
        let to = this.getProjection(projectionTo)
        var transformations = proj4(projectionFrom[1], to)
        return transformations
    }
    
}

SRSTranslator.prototype.getProjection = function (name) {
    if (!this.projections[name]) {
    //   throw new Error(`Unknown projection name: "${name}".\nSearch the CRS in http://epsg.io/ and add`)
        throw new Error(`Unknown projection name: "${name}".\nSearch the CRS in http://epsg.io/ and add`)
    }
    return this.projections[name]
}
SRSTranslator.prototype.searchProjecion = function(name){
    console.log(this.projections[name])
    if (this.projections[name] == undefined){
        return false
    }else{
        return true
    }
}
SRSTranslator.prototype.crsCheck = function(crs){

    if (crs.type == "Name"){
       
        if (!this.searchProjecion(crs.properties.name)){
            var lastValue = (crs.properties.name).split(':').pop();
            var crsValue
            $.ajax({
                url: 'http://epsg.io/'+lastValue+".proj4",
                async: false,
                type: 'GET',
                
                success: function(data){
                    console.log(typeof(data))
                    
                    crsValue = data
                },
                error: function(err){
                    alert("failed send data" + err);
                }
            });
            if (crsValue != undefined){
                this.addProjection(crs.properties.name, crsValue)
                return ["NAME", crs.properties.name]
            }
        }else{
            return ["NAME", crs.properties.name]
        }
        
    }else if(crs.type == "Link"){
        var address = crs.properties.href;
        var crsValue
        
        $.ajax({
            url: address,
            async: false,
            type: 'GET',
            
            success: function(data){
                console.log(typeof(data))
                
                crsValue = data
            },
            error: function(err){
                alert("failed send data" + err);
            }
        });
        if (crsValue != undefined){
         
            return ["LINK", crsValue]
        }
    }
}
SRSTranslator.prototype.getDefaultDefinitions = function() {
    return {
      'WGS84': '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees',
      'OGC:CRS84': '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees',
      'urn:ogc:def:crs:OGC:1.3:CRS84': '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees',
      'CH1903+': '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
      'EPSG:2056': '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
      'CH1903': '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
      'urn:ogc:def:crs:EPSG::7415': '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +vunits=m +no_defs',
      'EPSG:25833': '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
      'urn:adv:crs:ETRS89_UTM32*DE_DHHN92_NH': '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
      'urn:adv:crs:ETRS89_UTM32*DE_DHHN2016_NH': '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ',
      'urn:ogc:def:crs,crs:EPSG::3414,crs:EPSG::6916': '+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs',
      'EPSG:4269': '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs',
      'NAD83': 'PROJCS["NAD83 / Massachusetts Mainland",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",42.68333333333333],PARAMETER["standard_parallel_2",41.71666666666667],PARAMETER["latitude_of_origin",41],PARAMETER["central_meridian",-71.5],PARAMETER["false_easting",200000],PARAMETER["false_northing",750000],AUTHORITY["EPSG","26986"],AXIS["X",EAST],AXIS["Y",NORTH]]',

    }
}

// $.ajax({
//     url: '/js/mf-cesium/practice/data_symbol.csv',
//     async: false,
//     dataType: 'text',
//     success: function successFunction(data) {
//         var allRows = data.split(/\r?\n|\r/);

//         for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
//             var rowCells = allRows[singleRow].split(',');

//             for (var rowCell = 0; rowCell < rowCells.length - 1; rowCell++) {

//                 if (rowCells[rowCell] == object_arr[0].form) {
//                     tempSet = {};
//                     tempSet.code = rowCells[rowCell];
//                     tempSet.symbol = rowCells[rowCell + 1];
//                     dataSet.push(tempSet)
//                     break;
//                 }
//             }
//         }
//     }
// });