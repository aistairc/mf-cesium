/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param scene containing children to import
 * @constructor
 */

var SetIndoorGMLCommand = function () {

	this.type = 'SetIndoorGMLCommand';
	this.name = 'Set IndoorGML';

	this.scale = 0;
	this.translate = [];
};
 
SetIndoorGMLCommand.prototype = {

  calCenter : function(maxmin_xyz) {
      var boundingBoxLength = [maxmin_xyz[0] - maxmin_xyz[3], maxmin_xyz[1] - maxmin_xyz[4], maxmin_xyz[2] - maxmin_xyz[5]];
      var maxLength = Math.max(boundingBoxLength[0], boundingBoxLength[1], boundingBoxLength[2]);
      this.scale = 20 / maxLength;
      this.translate = [-(boundingBoxLength[0] / 2) - maxmin_xyz[3], -(boundingBoxLength[1] / 2) - maxmin_xyz[4], -maxmin_xyz[5]];
 
  },

	makeGeometry : function(indoor, maxmin_xyz) {

		var cells = indoor.primalSpaceFeature;
    
    this.calCenter(maxmin_xyz);
    for(var i = 0; i < cells.length; i++) {
        var cell = [];
        var surfaces = cells[i].geometry;
        for(var j = 0; j < surfaces.length; j++) {

						this.transformCoordinates(surfaces[j].exterior);
						this.transformCoordinates(surfaces[j].interior);

            var surface = this.triangulate(surfaces[j].exterior, surfaces[j].interior);
            //cell.push(surface);
            cell = cell.concat(surface);
        }
        CellDictionary[ cells[i].cellid ] = cell;
    }

    var cellboundary = indoor.cellSpaceBoundaryMember;
    
      for(var j = 0; j < cellboundary.length; j++) {
        if(cellboundary[0].geometry[0] instanceof Polygon) {
          this.transformCoordinates(cellboundary[j].geometry[0].exterior);
          var surface = this.triangulate(cellboundary[j].geometry[0].exterior, []);
        }
        else {
          this.transformCoordinates(cellboundary[j].geometry[0].points);
          var surface = cellboundary[j].geometry[0].points;
        }
        BoundaryDictionary[ cellboundary[j].cellBoundaryid ] = surface;
        BoundaryInformation[ cellboundary[j].cellBoundaryid ] = cellboundary[j];
      }
    

   
    
    
    var graphs = indoor.multiLayeredGraph;

    for(var i = 0; i < graphs.length; i++){
        var graph = [];
        var nodes = {};
        var states = graphs[i].stateMember;
        for(var j = 0; j < states.length; j++){
            this.transformCoordinates(states[j].position);
            var state = states[j].position;
            nodes[states[j].stateid] = state;
            StateInformation[states[j].stateid] = states[j];
        }
        graph.push(nodes);

        var edges = {};
        var trasitions = graphs[i].transitionMember;
        for(var j = 0; j < trasitions.length; j++){
            this.transformCoordinates(trasitions[j].line);
            var trasition = trasitions[j].line;
            edges[trasitions[j].transitionid] = trasition;
            TransitionInformation[trasitions[j].transitionid] = trasitions[j];
        }
        graph.push(edges);

        NetworkDictionary[graphs[i].graphid] = graph;

    }
    //console.log(CellDictionary);
	},

	transformCoordinates : function(myvertices) {
        for (var i = 0; i < myvertices.length / 3; i++) {
          myvertices[i * 3] = (myvertices[i * 3] +this.translate[0]) * this.scale;
          myvertices[i * 3 + 1] = (myvertices[i * 3 + 1] +this.translate[1]) * this.scale;
          myvertices[i * 3 + 2] = (myvertices[i * 3 + 2] +this.translate[2]) * this.scale;
      }

      for (var i = 0; i < myvertices.length / 3; i++) {
          myvertices[i * 3] = Math.floor( myvertices[i * 3] * 1000000000) / 1000000000
          myvertices[i * 3 + 1] = Math.floor( myvertices[i * 3 + 1] * 1000000000) / 1000000000
          myvertices[i * 3 + 2] = Math.floor( myvertices[i * 3 + 2] * 1000000000) / 1000000000
      }
  },

	calVector : function (myvertices) {
      var vecx = [myvertices[3] - myvertices[0] , myvertices[6] - myvertices[0]];
      var vecy = [myvertices[4] - myvertices[1] , myvertices[7] - myvertices[1]];
      var vecz = [myvertices[5] - myvertices[2] , myvertices[8] - myvertices[2]];

			var nx = Math.abs(vecy[0] * vecz[1] - vecz[0] * vecy[1]);
      var ny = Math.abs(-(vecx[0] * vecz[1] - vecz[0] * vecx[1]));
      var nz = Math.abs(vecx[0] * vecy[1] - vecy[0] * vecx[1]);

			return [nx, ny, nz];
  },

	triangulate :  function (myvertices, interior) {
			var partition = [];
      var newmyvertices = [];
      var newinterior = [];

			var vector = this.calVector(myvertices);

			var nx = vector[0];
			var ny = vector[1];
			var nz = vector[2];

			var max = Math.max(nx, ny, nz);

			if(nz == max){
          for(var i = 0; i < myvertices.length / 3; i++) {
              newmyvertices.push(myvertices[i * 3]);
              newmyvertices.push(myvertices[i * 3 + 1]);
          }

          for(var i = 0; i < interior.length / 3; i++) {
              newinterior.push(interior[i * 3]);
              newinterior.push(interior[i * 3 + 1]);
          }
      }
      else if(nx == max){
          for(var i = 0; i < myvertices.length / 3; i++) {
              newmyvertices.push(myvertices[i * 3 + 1]);
              newmyvertices.push(myvertices[i * 3 + 2]);
          }
          for(var i = 0; i < interior.length / 3; i++) {
              newinterior.push(interior[i * 3 + 1]);
              newinterior.push(interior[i * 3 + 2]);
          }
      }
      else {
          for(var i = 0; i < myvertices.length / 3; i++) {
              newmyvertices.push(myvertices[i * 3]);
              newmyvertices.push(myvertices[i * 3 + 2]);
          }
          for(var i = 0; i < interior.length / 3; i++) {
              newinterior.push(interior[i * 3]);
              newinterior.push(interior[i * 3 + 2]);
          }
      }

			var interiorStartIndex = (newmyvertices.length / 2) - 1;
      var polygonwithhole = newmyvertices.concat(newinterior);

			var triangle = earcut(polygonwithhole, [interiorStartIndex]);

			var concatVertices = myvertices.concat(interior);


      for(var i = 0; i < triangle.length; i++) {
          partition.push(concatVertices[triangle[i] * 3]);
          partition.push(concatVertices[triangle[i] * 3 + 1]);
          partition.push(concatVertices[triangle[i] * 3 + 2]);
      }
			
			return partition;
	}

};
