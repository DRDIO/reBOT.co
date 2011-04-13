$(function() 
{
	// Build out core objects
    var imgDir  = 'img/',
		terrain = {
			'dirt': {
				'obj':   null,
				'url':   'terrain/001x50.png',
				'xoff':  21,
				'yoff':  10,
				'w':     42,
				'h':     20,
			}
		},
		npc = {
			'player': {
				'obj': null,
				'url': 'npc/001.png',
				'xoff': 21,
				'yoff': 31,
				'w'   : 42,
				'h'   : 42
			}
		},
		map = {};
			
	// Create terrain object (TODO: Loop)
    terrain.dirt.obj        = new Image();
    terrain.dirt.obj.onload = convertTerrain;
    terrain.dirt.obj.src    = imgDir + terrain.dirt.url;

	// Create player object (TODO: Loop)
	npc.player.obj        = new Image();
    npc.player.obj.onload = convertNpc;
    npc.player.obj.src    = imgDir + npc.player.url;
	
	// Implement Game Canvas
    $('#game').canvas();
	
	var build     = document.createElement ('canvas'),
		buildCtx  = build.getContext('2d'),
		tile      = document.createElement('canvas'),
		tileCtx   = tile.getContext('2d'),
		player    = document.createElement('canvas'),
		playerCtx = player.getContext('2d');
		
	// Setup common dimensions
    var w  	   = $('#game').canvasWidth(),
		h  	   = $('#game').canvasHeight(),
		xc 	   = w / 2,
		yc 	   = h / 2,	
		zstep  = 8,
		zlimit = zstep * 5000,
		ystep  = 0,
		xstep  = 0,
		steps  = 8;
					
	build.width  = w;
	build.height = h;
			
	// Manage change event for setting toggles
    $('#panel input').change(function() {
       $('#game').clearRect(0, 0, w, h);
	   buildCtx.clearRect(0, 0, w, h);
       map = {};
       render();
    });
	
	var simplex, settingLock, settingRandom;
	
    function convertTerrain() 
	{			
		tile.width  = terrain.dirt.obj.width; 
		tile.height = terrain.dirt.obj.height;
		tileCtx.drawImage(terrain.dirt.obj, 0, 0);
		
		render();
	}
	
	function convertNpc() 
	{			
		player.width  = npc.player.obj.width; 
		player.height = npc.player.obj.height;
		playerCtx.drawImage(npc.player.obj, 0, 0);
	}
	
	function render()
	{	
		simplex 	  = new SimplexNoise();
		settingLock   = $('#setting-lock input:checked').val();
		settingRandom = $('#setting-random input:checked').val();

        for (var xstep = -steps; xstep <= steps; xstep++) {
			map[xstep] = {};
			
            for (var ystep = -steps; ystep <= steps; ystep++) {
				map[xstep][ystep] = {};
				renderTile(xstep, ystep);
            }
        }
		
		// Put the build canvas onto the display canvas
		$('#game').canvasContext().drawImage(build, 0, 0, w, h, 0, 0, w, h);
    }
	
	function renderTile(xstep, ystep) 
	{
		var z,
			zrange = searchNeighbors(xstep, ystep);
		
		if (!zrange) {
			z = zstep;
		} else {
			var zrand, zlimit;

			if (settingRandom == 'simplex') {
				var nstep = 16,
					zoff  = (zrange.zmax - zrange.zmin);

				zrand = (simplex.noise(xstep / nstep, ystep / nstep) / 2 + 0.5);
			} else {
				zrand = Math.random();
			}
			
			if (settingLock == 'lock') {
				zlimit = zrand * zoff + zrange.zmin;
			} else if (settingLock == 'free') {
				zlimit = zrand * 128;
			} else {
				zlimit = zstep;
			}
			
			z = Math.round(zlimit / zstep) * zstep;
		}
		
		var xpos = xc + xstep * terrain.dirt.xoff - ystep * terrain.dirt.xoff - terrain.dirt.xoff;
		var ypos = yc + xstep * terrain.dirt.yoff + ystep * terrain.dirt.yoff - z - terrain.dirt.yoff;
		
		map[xstep][ystep].z = z;
		
		if ((xstep == 1 && ystep == 1 || xstep == 1 && ystep == 0 || xstep == 0 && ystep == 1) && z > map[0][0].z) {
			// Test altering tiles
			tileData = tileCtx.getImageData(0, 0, tile.width, tile.height);
			for (var i = 0; i < tileData.data.length; i += 4) {
				tileData.data[i + 3] -= 128;
			}
			
			var temp    = document.createElement('canvas'),
				tempCtx = temp.getContext('2d');
				
			temp.width  = tile.width;
			temp.height = tile.height;
			tempCtx.putImageData(tileData, 0, 0);
			
			buildCtx.drawImage(temp, xpos, ypos);
		} else {
			buildCtx.drawImage(tile, xpos, ypos);
		}
		
		if (xstep == 0 && ystep == 0) {
			buildCtx.drawImage(npc.player.obj, xc - npc.player.xoff, yc - z - npc.player.yoff);
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
		
        return (zmax != -zlimit ? {
            'zmax': zmax - zstep,
            'zmin': zmin + zstep
            } : null);
    }
});