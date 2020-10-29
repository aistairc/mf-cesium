const GRID_SHELF    = 1;
const GRID_EAST     = 2;
const GRID_WEST     = 4;
const GRID_SOUTH    = 8;
const GRID_NORTH    = 16;

class GridMap {

    constructor(boundBox, gridResolution) {
        let grid_width_max;
        let grid_height_max;

        if (gridResolution !== 0) {
            grid_width_max  = Math.ceil(boundBox[0] / gridResolution);
            grid_height_max = Math.ceil(boundBox[1] / gridResolution);
        }

        this.resolution = gridResolution;
        this.boundary = {grid_width_max, grid_height_max};
        this.mapInfo = new Array(grid_width_max);
        for (let i = 0 ; i < grid_width_max; i++) {
            this.mapInfo[i] = new Array(grid_height_max);
        }
        this.shelfInfo = [];
    }

    addShelfInfo(name, flag, bbox) {
        this.shelfInfo.push({
            name: name,
            flag: flag,
            bbox: bbox
        });
    }

    updateMapInfo(dirLength, flag, bbox) {
        for (let height = bbox.min_y; height < bbox.max_y + 1; height++) {
            for (let width = bbox.min_x; width < bbox.max_x + 1; width++) {
                if (width === this.boundary.grid_width_max || height === this.boundary.grid_height_max) {
                    break;
                }

                if (dirLength === 1) {
                    if ((flag & GRID_EAST) === GRID_EAST || (flag & GRID_WEST) === GRID_WEST) {
                        if (height === bbox.min_y) {
                            this.mapInfo[width][height] = flag | GRID_NORTH;
                        } else if (height === bbox.max_y) {
                            this.mapInfo[width][height] = flag | GRID_SOUTH;
                        } else {
                            this.mapInfo[width][height] = flag | GRID_NORTH | GRID_SOUTH;
                        }
                    }
                    else if ((flag & GRID_NORTH) === GRID_NORTH || (flag & GRID_SOUTH) === GRID_SOUTH) {
                        if (width === bbox.min_x) {
                            this.mapInfo[width][height] = flag | GRID_EAST;
                        } else if (width === bbox.max_x) {
                            this.mapInfo[width][height] = flag | GRID_WEST;
                        } else {
                            this.mapInfo[width][height] = flag | GRID_EAST | GRID_WEST;
                        }
                    }
                }
                else {
                    this.mapInfo[width][height] = flag;
                }
            }
        }
    }

    printIndoorGraph() { //map.csv
        let resultCSVBlob = this.boundary.grid_width_max + "," + this.boundary.grid_height_max + "\r\n";

        for (let x = 0; x < this.boundary.grid_width_max; x++) {
            for (let y = 0; y < this.boundary.grid_height_max; y++) {
                let flagValue = this.mapInfo[x][y];
                if ((flagValue !== undefined) && (flagValue & GRID_SHELF) !== GRID_SHELF) {
                    resultCSVBlob += x + "," + y;

                    let nextFlagValue = 0;
                    if ((x !== 0) && (flagValue & GRID_EAST) === GRID_EAST) {
                        nextFlagValue = this.mapInfo[x - 1][y];
                        if ((nextFlagValue !== undefined) && (nextFlagValue & GRID_SHELF) !== GRID_SHELF) {
                            resultCSVBlob += "," + (x - 1) + "," + y;
                        }
                    }
                    if ((x !== (this.boundary.grid_width_max - 1)) && (flagValue & GRID_WEST) === GRID_WEST) {
                        nextFlagValue = this.mapInfo[x + 1][y];
                        if ((nextFlagValue !== undefined) && (nextFlagValue & GRID_SHELF) !== GRID_SHELF) {
                            resultCSVBlob += "," + (x + 1) + "," + y;
                        }
                    }
                    if ((y !== 0) && (flagValue & GRID_SOUTH) === GRID_SOUTH) {
                        nextFlagValue = this.mapInfo[x][y - 1];
                        if ((nextFlagValue !== undefined) && (nextFlagValue & GRID_SHELF) !== GRID_SHELF) {
                            resultCSVBlob += "," + x + "," + (y - 1);
                        }
                    }
                    if ((y !== (this.boundary.grid_height_max - 1)) && (flagValue & GRID_NORTH) === GRID_NORTH) {
                        nextFlagValue = this.mapInfo[x][y + 1];
                        if ((nextFlagValue !== undefined) && (nextFlagValue & GRID_SHELF) !== GRID_SHELF) {
                            resultCSVBlob += "," + x + "," + (y + 1);
                        }
                    }

                    resultCSVBlob += "\r\n";
                }
            }
        }

        return resultCSVBlob;
    }

    printGridMap() { //shelfmodel
        let resultCSVBlob = "";

        for (let y = 0; y < this.boundary.grid_height_max; y++) {
            for (let x = 0; x < this.boundary.grid_width_max; x++) {
                if (this.mapInfo[x][y] !== undefined)
                    resultCSVBlob += (this.mapInfo[x][y]).toString(16) + ",";
                else
                    resultCSVBlob += 0 + ",";
            }
            resultCSVBlob += "\r\n";
        }

        return resultCSVBlob;
    }

    printShelfOpenTo() { //shelf
        let resultCSVBlob = "";
        const mapInfo = this.mapInfo;
        this.shelfInfo.forEach(function (e) {
            const name = e.name;
            const flag = e.flag;
            const bbox = e.bbox;

            resultCSVBlob += name;
            if ((flag & GRID_SHELF) === GRID_SHELF) {
                let y_index = 0;
                if ((flag & GRID_NORTH) === GRID_NORTH) {
                    y_index = bbox.max_y + 1;
                }
                else if ((flag & GRID_SOUTH) === GRID_SOUTH) {
                    y_index = bbox.min_y - 1;
                }

                for (let x_index = bbox.min_x; x_index < bbox.max_x + 1; x_index++) {
                    if (mapInfo[x_index][y_index] !== undefined) {
                        resultCSVBlob += "," + x_index + "," + y_index;
                    }
                }
            }

            resultCSVBlob += "\r\n";
        })

        return resultCSVBlob;
    }
}

// function readGeoJSON(file, gridResolution) {
//     let gridMap;

//     const reader = new FileReader();
//     reader.addEventListener('load', (event) => {
//         const contents = event.target.result;
//         const jobj = JSON.parse(contents);
//         for (const [key, value] of Object.entries(jobj)) {
//             switch (key) {
//                 case 'properties':
//                     const unit = value.unit; // TODO
//                     const boundBox = value.area;
//                     gridMap = new GridMap(boundBox, gridResolution);
//                     break;
//                 case 'features':
//                     for (let i = 0; i < value.length; i++) {
//                         const feature = value[i];
//                         parseFeatures(feature, gridMap);
//                     }
//                     break;
//             }
//         }

//         return gridMap;
//     });
//     reader.readAsText(file);
// }

function readGeoJSON(file, gridResolution) {
    let gridMap;

    $.ajax({
        url: file,
        async: false,
        dataType: 'json',
        success: function successFunction(data) {
            for (const [key, value] of Object.entries(data)) {
                switch (key) {
                    case 'properties':
                        const unit = value.unit; // TODO
                        const boundBox = value.area;
                        gridMap = new GridMap(boundBox, gridResolution);
                        break;
                    case 'features':
                        for (let i = 0; i < value.length; i++) {
                            const feature = value[i];
                            parseFeatures(feature, gridMap);
                        }
                        break;
                }
            }            
        }

    });
    return gridMap;
}

function parseFeatures(featureObj, gridMap) {
    for (const [key, value] of Object.entries(featureObj)) {
        switch (key) {
            case 'properties':
                switch (value.type) {
                    case 'shelf':
                        parseShelfFeature(featureObj, gridMap);
                        break;
                    case 'aisle':
                        parseAisleFeature(featureObj, gridMap);
                        break;
                }
                break;
        }
    }
}

function parseShelfFeature(featureObj, gridMap) {
    let openToLength = 0;
    let name;
    let flag = GRID_SHELF;
    let bbox;

    for (const [key, value] of Object.entries(featureObj)) {
        switch (key) {
            case 'properties':
                name = value.name;
                const openToArray = value.openTo;
                openToLength = openToArray.length;
                flag = flag | setFlag(openToArray);
                break;
            case 'geometry':
                bbox = getBoundingBox(value, gridMap.resolution);
                break;
        }
    }

    gridMap.addShelfInfo(name, flag, bbox);
    gridMap.updateMapInfo(openToLength + 1, flag, bbox);
}

function parseAisleFeature(featureObj, gridMap) {
    let dirLength = 0;
    let flag = 0;
    let bbox;

    for (const [key, value] of Object.entries(featureObj)) {
        switch (key) {
            case 'properties':
                const directionArray = value.direction;
                dirLength = directionArray.length;
                flag = setFlag(directionArray);
                break;
            case 'geometry':
                bbox = getBoundingBox(value, gridMap.resolution);
                break;
        }
    }

    gridMap.updateMapInfo(dirLength, flag, bbox);
}

function setFlag(directionArray) {
    let flag = 0;
    let direction;
    for (let i = 0; i < directionArray.length; i++) {
        direction = directionArray[i];
        switch (direction) {
            case 'north':
                flag = flag | GRID_NORTH;
                break;
            case 'south':
                flag = flag | GRID_SOUTH;
                break;
            case 'west':
                flag = flag | GRID_WEST;
                break;
            case 'east':
                flag = flag | GRID_EAST;
                break;
        }
    }
    return flag;
}

function getBoundingBox(geometryCoordinates, gridResolution) {
    let min_x = Number.MAX_VALUE;
    let min_y = Number.MAX_VALUE;
    let max_x = Number.MIN_VALUE;
    let max_y = Number.MIN_VALUE;
    let surfaces;
    let coordinateList;
    let coordinates;
    if (geometryCoordinates.type === 'Polygon') {
        surfaces = geometryCoordinates.coordinates;
        for (let i = 0; i < surfaces.length; i++) {
            coordinateList = surfaces[i];
            for (let j = 0; j < coordinateList.length; j++) {
                coordinates = coordinateList[j];
                const grid_x = coordinates[0] / gridResolution;
                const grid_y = coordinates[1] / gridResolution;

                if (min_x > grid_x) {
                    min_x = Math.ceil(grid_x);
                }
                if (min_y > grid_y) {
                    min_y = Math.ceil(grid_y);
                }
                if (max_x < grid_x) {
                    max_x = Math.floor(grid_x);
                }
                if (max_y < grid_y) {
                    max_y = Math.floor(grid_y);
                }
            }
        }
    } else {  // TODO
        console.log("Not supported")
    }
    return {min_x, min_y, max_x, max_y};
}
