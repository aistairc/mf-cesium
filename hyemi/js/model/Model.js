this.floorflag = 0;
function parsePosOrPointPropertyOrPointRep(points,target,maxmin_xyz) {
	for(var i = 0; i < points.length; i++) {
		var point = [points[i].value.value[0], points[i].value.value[1], points[i].value.value[2]];
		target.push(point[0],point[1],point[2]);
		if(floorflag == 0) {
			floorflag = 1;
			maxmin_xyz = [point[0], point[1], point[2], point[0], point[1], point[2]];
		}
		else {

			maxmin_xyz[0] = Math.max(maxmin_xyz[0], point[0]);
			maxmin_xyz[1] = Math.max(maxmin_xyz[1], point[1]);
			maxmin_xyz[2] = Math.max(maxmin_xyz[2], point[2]);
			maxmin_xyz[3] = Math.min(maxmin_xyz[3], point[0]);
			maxmin_xyz[4] = Math.min(maxmin_xyz[4], point[1]);
			maxmin_xyz[5] = Math.min(maxmin_xyz[5], point[2]);

		}
	}
	return maxmin_xyz;
}
var Polygon = function() {
	this.polyonid;
	this.exterior = []; //float array[1,2,3,4,5,6]
	this.interior = [];
}
Polygon.prototype.init = function(jsoncontent, maxmin_xyz) {
	this.polyonid = jsoncontent.id;
	var epoints = jsoncontent.exterior.abstractRing.value.posOrPointPropertyOrPointRep;
	maxmin_xyz = parsePosOrPointPropertyOrPointRep(epoints,this.exterior,maxmin_xyz);

	var ipoints = jsoncontent.interior;
	if(typeof ipoints !== 'undefined') {
		ipoints = ipoints[0].abstractRing.value.posOrPointPropertyOrPointRep;
		maxmin_xyz = parsePosOrPointPropertyOrPointRep(ipoints,this.interior,maxmin_xyz);
	}
	for(var key in PlaceHolder) {
		if(key == this.polyonid) {
			var temp = new Polygon();
			temp.polyonid = this.polyonid + "_1";
			for(var i = this.exterior.length - 3; i >= 0; i-=3) {
				temp.exterior.push(this.exterior[i]);
				temp.exterior.push(this.exterior[i + 1]);
				temp.exterior.push(this.exterior[i + 2]);
			}
			for(var i = this.interior.length - 3; i >= 0; i-=3) {
				temp.interior.push(this.interior[i]);
				temp.interior.push(this.interior[i + 1]);
				temp.interior.push(this.interior[i + 2]);
			}
			PlaceHolder[key].push(temp);
			break;
		}
	}
	GmlIdMap[this.polyonid] = this;
	return maxmin_xyz;
}
var LineString = function() {
	this.linestringid;
	this.points = []; //float array[1,2,3,4,5,6]
}
LineString.prototype.init = function(jsoncontent, maxmin_xyz) {
	this.linestringid = jsoncontent.id;
	var geometry = jsoncontent.posOrPointPropertyOrPointRep;
	if(typeof geometry !== 'undefined') {
		maxmin_xyz = parsePosOrPointPropertyOrPointRep(geometry, this.points, maxmin_xyz);
		for(var key in PlaceHolder) {
			if(key == this.linestringid) {
				var temp = new LineString();
				temp.linestringid = this.linestringid + "_1";
				for(var i = this.points.length - 3; i >= 0; i-=3) {
					temp.points.push(this.points[i]);
					temp.points.push(this.points[i + 1]);
					temp.points.push(this.points[i + 2]);
				}
				PlaceHolder[key].push(temp);
				break;
			}
		}
		GmlIdMap[this.linestringid] = this;
	}
	else {
		var xlink = jsoncontent.baseCurve.href;
		xlink = xlink.substr(1, xlink.length);
		for(var id in GmlIdMap) {
			if(id == xlink) {
				var linestring = new LineString();
				linestring.linestringid = GmlIdMap[xlink].linestringid + "_1";
				for(var i = GmlIdMap[xlink].points.length - 3; i >= 0; i-=3) {
					polygon.points.push(GmlIdMap[xlink].points[i]);
					polygon.points.push(GmlIdMap[xlink].points[i + 1]);
					polygon.points.push(GmlIdMap[xlink].points[i + 2]);
				}
				this.geometry.push(linestring);
				break;
			}
		}
		if(this.geometry == 'undefined') 
			PlaceHolder[xlink] = this.geometry;
	}
	
	
	return maxmin_xyz;
}
var CellSpace = function() {
	this.cellid;
	this.cellname = "";
	this.geometry = []; //Polygon array
	this.duality = "";
	this.type = 0;
	this.floor = 0;
	this.partialboundedBy;//boundarysurface
}
CellSpace.prototype.init = function(jsoncontent, maxmin_xyz) {
	this.cellid = jsoncontent.id;

	var description = jsoncontent.description;
	if(typeof description !== 'undefined') {
		var attribute = description.value.split(":");
		var spacetype = attribute[0].split("=")[1];
		if(spacetype == 'Room') this.type = 1;
		else if(spacetype == 'Corridor') this.type = 2;
		else if(spacetype == 'Stair') this.type = 3;
		else if(spacetype == 'Door') this.type = 4;
		if(attribute.length > 2)
			this.floor = attribute[2].split("=")[1]*1;
	}
	var n = jsoncontent.name;
	if(typeof n !== 'undefined') {
		this.cellname = n[0].value;
	}

	var du = jsoncontent.duality;
	if(typeof du !=='undefined') {
		this.duality = du.href;
	}

	var bound = jsoncontent.partialboundedBy;
		if(typeof bound !=='undefined') {
			this.partialboundedBy = bound[0].href;
	}
	var geod = jsoncontent.geometry3D;
	if(typeof geod !== 'undefined') {
		var surfaces = geod.abstractSolid.value.exterior.shell.surfaceMember;
		for(var i = 0; i < surfaces.length; i++) {
			var polygon = new Polygon();
			maxmin_xyz = polygon.init(surfaces[i].abstractSurface.value,maxmin_xyz);
			this.geometry.push(polygon);
		}
	}
	else {
		geod=jsoncontent.geometry2D;
		if(typeof geod !== 'undefined') {
			var temp = geod.abstractSurface;
			if(typeof temp !== 'undefined') {
				var polygon = new Polygon();
				maxmin_xyz = polygon.init(temp.value, maxmin_xyz);
				this.geometry.push(polygon);
			}
		}
	}
	//GmlIdMap[this.cellid] = this;
	return maxmin_xyz;
};

var CellSpaceBoundary = function() {
	this.cellBoundaryid;
	this.cellBoundaryname = "";
	this.geometry = []; //polygon
	this.duality = "";
}
 CellSpaceBoundary.prototype.init = function(jsoncontent, maxmin_xyz) {
	this.cellBoundaryid = jsoncontent.id;
	var n = jsoncontent.name;
	if(typeof n !=='undefined') {
		this.cellBoundaryname = n[0].value;
	}

	//console.log(this.cellname);
	var du = jsoncontent.duality;
	if(typeof du !=='undefined') {
		this.duality = du.href;
	}

	var geod = jsoncontent.geometry3D;
	if(typeof geod !== 'undefined') {
		var temp = geod.abstractSurface.value.exterior;
		if(typeof temp !== 'undefined') {
			var polygon = new Polygon();
			maxmin_xyz = polygon.init(geod.abstractSurface.value, maxmin_xyz);
			this.geometry.push(polygon);
		}
		else {
			var xlink = geod.abstractSurface.value.baseSurface.href;
			xlink = xlink.substr(1, xlink.length);
			for(var id in GmlIdMap) {
				if(id == xlink) {
					var polygon = new Polygon();
					polygon.polyonid = GmlIdMap[xlink].polyonid + "_1";
					for(var i = GmlIdMap[xlink].exterior.length - 3; i >= 0; i-=3) {
						polygon.exterior.push(GmlIdMap[xlink].exterior[i]);
						polygon.exterior.push(GmlIdMap[xlink].exterior[i + 1]);
						polygon.exterior.push(GmlIdMap[xlink].exterior[i + 2]);
					}
					for(var i = GmlIdMap[xlink].interior.length - 3; i >= 0; i-=3) {
						polygon.interior.push(GmlIdMap[xlink].interior[i]);
						polygon.interior.push(GmlIdMap[xlink].interior[i + 1]);
						polygon.interior.push(GmlIdMap[xlink].interior[i + 2]);
					}
					this.geometry.push(polygon);
					break;
				}
			}
			if(this.geometry == 'undefined') 
				PlaceHolder[xlink] = this.geometry;
		
		}
		
	}
	else{
		geod = jsoncontent.geometry2D;
		if(typeof geod !== 'undefined') {
			geod = geod.abstractCurve;
			if(typeof geod !== 'undefined') {
				var linestring = new LineString();
				maxmin_xyz = linestring.init(geod.value,maxmin_xyz);
				this.geometry.push(linestring);
			}
			
		}
		
	}
	//GmlIdMap[this.cellBoundaryid] = this;
	return maxmin_xyz;
};


var State = function() {
	this.stateid;
	this.statename = "";
	this.position = [];
	this.connects = [];
	this.duality = "";
}
 State.prototype.init = function(jsoncontent,maxmin_xyz) {
	//console.log(JSON.stringify(jsoncontent, null, 2));
	this.stateid = jsoncontent.id;
	var n = jsoncontent.name;
	if(typeof n !=='undefined') {
		this.statename = n[0].value;
	}

	var du=jsoncontent.duality;
	if(typeof du !== 'undefined') {
		this.duality = du.href;
	}

	var cons = jsoncontent.connects;
	if(typeof cons !== 'undefined') {
		for(var i = 0; i < cons.length; i++) {
			this.connects.push(cons[i].href);
		}
	}
	var geometry = jsoncontent.geometry;
	if(typeof geometry !== 'undefined') {
		var point = geometry.point.pos.value;
		this.position = [point[0], point[1], point[2]];
		if(floorflag == 0) {
			floorflag = 1;
			maxmin_xyz = [point[0], point[1], point[2], point[0], point[1], point[2]];
		}
		else {
			maxmin_xyz[0] = Math.max(maxmin_xyz[0], point[0]);
			maxmin_xyz[1] = Math.max(maxmin_xyz[1], point[1]);
			maxmin_xyz[2] = Math.max(maxmin_xyz[2], point[2]);
			maxmin_xyz[3] = Math.min(maxmin_xyz[3], point[0]);
			maxmin_xyz[4] = Math.min(maxmin_xyz[4], point[1]);
			maxmin_xyz[5] = Math.min(maxmin_xyz[5], point[2]);
		}
	}
	//GmlIdMap[this.stateid] = this;
	return maxmin_xyz;
	//console.log(this.position);
};




var Transition = function() {
	this.transitionid;
	this.weight;
	this.transitionname = "";
	this.connects = []; //array of size 2
	this.line = []; //point array
	this.duality = "";
}
 Transition.prototype.init = function(jsoncontent,maxmin_xyz) {
	this.transitionid = jsoncontent.id;

	if(typeof jsoncontent.name !== 'undefined') {
		this.transitionname = jsoncontent.name[0].value;
	}

	if(typeof jsoncontent.weight !== 'undefined') {
		this.weight = jsoncontent.weight;
	}
	
	var du = jsoncontent.duality;
	if(typeof du !== 'undefined') {
		this.duality = du.href;
	}

	var cons = jsoncontent.connects;
	for(var i = 0; i < cons.length; i++) {
		this.connects.push(cons[i].href);
	}
	var geometry = jsoncontent.geometry;
	if(typeof geometry !== 'undefined') {
		geometry = geometry.abstractCurve.value.posOrPointPropertyOrPointRep;
		maxmin_xyz = parsePosOrPointPropertyOrPointRep(geometry, this.line, maxmin_xyz);
	}
	//GmlIdMap[this.transitionid] = this;
	return maxmin_xyz;
};

var Graph = function() {
	this.graphid;
	this.graphname = "";
	this.stateMember = []; //State array
	this.transitionMember = []; //Transition array
}
 Graph.prototype.init = function(jsoncontent, maxmin_xyz) {
	//console.log(JSON.stringify(jsoncontent, null, 2));

	this.graphid = jsoncontent.id;

	var name = jsoncontent.name;
	if(typeof name !== 'undefined') {
		this.graphname = name[0].value
	}



	var states = jsoncontent.nodes[0].stateMember;
	if(typeof states !== 'undefined') {
		for(var i = 0; i < states.length; i++){
			var state = new State();
			maxmin_xyz = state.init(states[i].state, maxmin_xyz);
			this.stateMember.push(state);
		}
	}


	var trans = jsoncontent.edges[0].transitionMember;
	if(typeof trans !== 'undefined'){
		for(var i = 0; i < trans.length; i++) {
			var transition = new Transition();
			maxmin_xyz = transition.init(trans[i].transition, maxmin_xyz);
			this.transitionMember.push(transition);
		}
	}
	//GmlIdMap[this.graphid] = this;
	return maxmin_xyz;
};




var InterLayerConnection = function() {
	this.connectId;
	this.topoType;//overlap,contain,equals,within,crosses,intersects
	this.stateConnects = []; //array of size 2
	this.layerConnects = []; //array of size 2
}





 var Indoor = function() {
		this.primalSpaceFeature = []; //CellSpace array
		this.cellSpaceBoundaryMember = [];
		this.multiLayeredGraph = []; //Graph array
		this.interLayerConnectionMember = []; //InterLayerConnection array
 }
 Indoor.prototype.init = function(jsoncontent) {
 	floorflag = 0;
	var maxmin_xyz = [];
	var primalspace = jsoncontent.value.primalSpaceFeatures;
	if(typeof primalspace !== 'undefined') {
		var cells = primalspace.primalSpaceFeatures.cellSpaceMember;
		if(typeof cells !=='undefined') {
			for(var i = 0; i < cells.length; i++){
				var c = new CellSpace();
				maxmin_xyz = c.init(cells[i].abstractFeature.value, maxmin_xyz);
				this.primalSpaceFeature.push(c);
			}
		}
		var cellboundarys = primalspace.primalSpaceFeatures.cellSpaceBoundaryMember;
		if(typeof cellboundarys !=='undefined') {
			
			for(var i = 0; i < cellboundarys.length; i++) {
				var cb = new CellSpaceBoundary();
				maxmin_xyz = cb.init(cellboundarys[i].abstractFeature.value, maxmin_xyz);
				this.cellSpaceBoundaryMember.push(cb);
			}
		}
	}
	

	var layers = jsoncontent.value.multiLayeredGraph.spaceLayers[0].spaceLayerMember;
	//layers[0].space
	//console.log(jsoncontent);
	if(typeof layers !== 'undefined') {
		for(var i = 0; i < layers.length; i++) {
			var g = new Graph();
			maxmin_xyz = g.init(layers[i].spaceLayer, maxmin_xyz);
			this.multiLayeredGraph.push(g);

		}
	}
	return maxmin_xyz;


};
var node = function() {
	this.parent;
	this.me;
	this.children = [];
	this.childtrue;
}
node.prototype.init = function(group,parent) {
	this.parent = parent;
	this.me = group;
	var children = group.children;
	this.childtrue = children.length;
	for(var i = 0;i < children.length;i++) {
		var child = new node();
		child.init(group.children[i], this);
		this.children.push(child);
	}
}
node.prototype.childset = function(flag) {
	this.me.visible = flag;
	for(var i = 0; i < this.children.length; i++) {
		this.children[i].childset(flag);
	}
}
node.prototype.parentset = function() {
	if(this.childtrue == 0) {
		this.me.visible = false;
	}
	else {
		this.me.visible = true;
	}
	if(this.parent !== null) {
		if(this.me.visible == true) {
			this.parent.childtrue++;
		}
		else {
			this.parent.childtrue--;
		}
		this.parent.parentset();
	}
}
node.prototype.change = function(group) {

	if(this.me == group) {
		if(this.parent !== null) {
			if(group.visible == true) {
				this.parent.childtrue++;
			}
			else {
				this.parent.childtrue--;
			}
			this.parent.parentset();
		}

		var children = this.children;
		for(var i = 0;i < children.length;i++) {
			children[i].childset(group.visible);
		}
	}
	else if(this.children !== 'undefined') {
		for(var i = 0;i < this.children.length;i++) {
			this.children[i].change(group);
		}
	}
}
