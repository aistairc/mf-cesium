/**
 * @author mrdoob / http://mrdoob.com/
 */

var Loader = function ( ) {
	this.texturePath = '';
	this.loadFile = function ( file ) {
		var filename = file.name;
		var extension = filename.split( '.' ).pop().toLowerCase();
		var reader = new FileReader();
		/*reader.addEventListener( 'progress', function ( event ) {

			var size = '(' + Math.floor( event.total / 1000 ).format() + ' KB)';
			var progress = Math.floor( ( event.loaded / event.total ) * 100 ) + '%';
			console.log( 'Loading', filename, size, progress );

		} );*/
		switch ( extension ) {
			case 'gml': {
				solidtocsv = "id, geom\n";
				var inlineWorkerText =
    			"self.addEventListener('message', function(e) { postMessage(e); } ,false);"
				;
				reader.addEventListener( 'load', function ( event ) {
					console.log("gml file load finish");
					console.log(new Date(Date.now()));
					var contents = event.target.result;
					var indoorgmlLoader = new IndoorGMLLoader();
					var data = indoorgmlLoader.unmarshal(contents);
					//console.log(data);
					//var worker = require('webworkify')(require('./loader/IndoorGMLLoader.js'));
					//worker.addEventListener('message', function (ev) {
					 	console.log("receive json!!");
						console.log(new Date(Date.now()));
						indoor = new Indoor();
						//var maxmin_xyz = indoor.init(ev.data);
						var maxmin_xyz = indoor.init(data);
					draw(indoor,maxmin_xyz);

					//var blob = new Blob([solidtocsv], {type: "text/plain;charset=utf-8"});
					//	saveAs(blob, "lotte.csv");
					//});
					//worker.postMessage(contents);	
				}, false );
				reader.readAsText( file );
				break;
			}
			case 'csv' : {
				var index = 0;
				Papa.parse(file, {
					download: true,
					step: function(row) {
						if(index == 0) {
							makeMF(row);

						}
						else if(index > 1) {
							makeonemft(row);
						}
						index ++;
					},
					complete: function() {
						complete();
					}
				});
				break;
			}
			case 'txt' : {//test
				solidtocsv = "id, geom\n";
				Papa.parse(file, {
					download: true,
					delimiter: " ",
					header: false,
					step: function(row) {
						if(row.data[0])
						drawMultiSurface(row.data[0]);
					},
					complete: function() {
						showInCesium(group,groupline);
						viewer.entities.add({
		                position: new Cesium.Cartesian3.fromDegrees(127.101914, 37.462066, 28.068607),
		                point : {
			                pixelSize : 5,
			                color : Cesium.Color.fromBytes(255, 255, 255, 255)
			              }
		            	});
			            viewer.zoomTo(viewer.entities);
			            var blob = new Blob([solidtocsv], {type: "text/plain;charset=utf-8"});
						saveAs(blob, "boxs.csv");
					}
				});
				break;
			}
			default: {

				alert( 'Unsupported file format (' + extension +  ').' );

				break;
				}

		}

	};

};
