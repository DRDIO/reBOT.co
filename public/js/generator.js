$(function() {
	var imgDir  = 'img/terrain/';
	var terrain = {
		'dirt': {
			'obj':   null,
			'url':   '001.png',
			'xoff':  21,
			'yoff':  7,
			'wtile': 42,
			'htile': 13
		}
	}
	
	var map = {};
			
	$('#game').canvas();
	
	var w  = $('#game').canvasWidth();
	var h  = $('#game').canvasHeight();
	var xc = w / 2;
	var yc = h / 2;	
	
	var zstep  = 8,
		zlimit = zstep * 5000,
		ystep  = 0,
		xstep  = 0, 
		steps  = 8;
	
	terrain.dirt.obj        = new Image();
	terrain.dirt.obj.onload = render;	
	terrain.dirt.obj.src    = imgDir + terrain.dirt.url;
	
	function render() {
		var context = $('#game').canvasContext();
		var simplex = new SimplexNoise();
		
		for (var xstep = -steps; xstep <= steps; xstep++) {
			map[xstep] = {};
			
			for (var ystep = -steps; ystep <= steps; ystep++) {	
				map[xstep][ystep] = {};
				
				var z,
					zrange = searchNeighbors(xstep, ystep);
				
				if (!zrange) {
					z = zstep * 8;
				} else {
					var zoff  = (zrange.zmax - zrange.zmin);
					// var zrand = Math.random();
					// z = Math.round((zrand * zoff + zrange.zmin) / zstep) * zstep;
					
					var zrand = (simplex.noise(xstep / 16, ystep / 16) / 2 + 0.5);
					z = Math.round((zrand * zoff + zrange.zmin) / zstep) * zstep;
					// z = Math.round(zrand * zstep) * 8;
				}
				
				var xpos = xc + xstep * terrain.dirt.xoff - ystep * terrain.dirt.xoff;
				var ypos = yc + xstep * terrain.dirt.yoff + ystep * terrain.dirt.yoff - z;
				
				map[xstep][ystep].z = z;
				
				context.drawImage(terrain.dirt.obj, xpos, ypos);
			}
		}
	}
	
	function searchNeighbors(xstep, ystep)
	{
		var zmax = -zlimit, zmin = zlimit;
		
		for (var xtemp = -1; xtemp <= 1; xtemp++) {
			for (var ytemp = -1; ytemp <= 1; ytemp++) {
				var x = xstep + xtemp, y = ystep + ytemp;
				if ((xtemp != 0 || ytemp != 0) && x in map && y in map[x]) {
					zmax = Math.max(zmax, map[x][y].z);
					zmin = Math.min(zmin, map[x][y].z);
				}
			}
		}
		
		return (zmax != -zlimit ? {'zmax': zmax - zstep, 'zmin': zmin + zstep} : null);
	}
});