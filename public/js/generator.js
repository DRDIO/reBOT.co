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
		zlimit = zstep * 5000,				// Height Limit of world (+-)
		
		nstep  = 32, 						// Noise Frequency
		namp   = 24,						// Noise Amplitude
		
		fps    = 10,
		
		steps  = 32,						// Number of steps to generate out from player (init)
		rstep  = 32,						// Number of tiles to render
		gx     = 0,
		gy     = 0;
		pdir   = 3;							// Player direction (NW = 0, NE = 1, SE = 2, SW = 3)
		
	// Directional keys
	var KEY_NW = 37,
		KEY_NE = 38,
		KEY_SE = 39,
		KEY_SW = 40;
		
	// Init Remaining Globals
	var simplex, settingLock, settingRandom, settingJetpack;
				
	build.width  = w;
	build.height = h;
			
	// Manage change event for setting toggles
    $('#setting-lock input, #setting-random input').change(init);	
	$('#setting-jetpack input').change(function() {
		settingJetpack = $('#setting-jetpack input:checked').val();
	});
	
	$('#setting-refresh').button().click(init);
	
	$(window).keydown(function(e) {
		key = e.which;
		
		var gxtemp = gx, gytemp = gy, pdirtemp = pdir;
		
		if (key == KEY_NW) {
			gx  -= 1;
			pdir = 0;
		} else if (key == KEY_NE) {
			gy  -= 1;
			pdir = 1;
		} else if (key == KEY_SE) {
			gx  += 1;
			pdir = 2;
		} else if (key == KEY_SW) {
			gy  += 1;
			pdir = 3;
		}
		
		// Let them turn around without moving
		if (pdir != pdirtemp) {
			gx = gxtemp;
			gy = gytemp;
		}
		
		// Make sure a tile exists at coords
		seed(gx, gy, steps);
		
		// If jetpack is off, only zstep traversal (small blocks)
		if (settingJetpack == 'off' && Math.abs(map[gx][gy].z - map[gxtemp][gytemp].z) > zstep) {
			gx = gxtemp;
			gy = gytemp;
		}
	});
	
    function convertTerrain() 
	{			
		tile.width  = terrain.dirt.obj.width; 
		tile.height = terrain.dirt.obj.height;
		tileCtx.drawImage(terrain.dirt.obj, 0, 0);
				
		// TODO: Proper image loading screen
		npc.player.obj.onload = convertNpc;
		npc.player.obj.src    = imgDir + npc.player.url;
	}
	
	function convertNpc() 
	{			
		player.width  = npc.player.obj.width; 
		player.height = npc.player.obj.height;
		playerCtx.drawImage(npc.player.obj, 0, 0);
		
		init();
	}
	
	function init()
	{
		simplex 	   = new SimplexNoise();
		settingLock    = $('#setting-lock input:checked').val();
		settingRandom  = $('#setting-random input:checked').val();	
		settingJetpack = $('#setting-jetpack input:checked').val();		
		
		gx  = 0;
		gy  = 0;
		map = {};
		
		seed(gx, gy, steps);
		render();
	}
	
	function seed(x, y, r)
	{
		for (var xstep = x - r; xstep <= x + r; xstep++) {
			if (!(xstep in map)) {
				map[xstep] = {};
			}
			
            for (var ystep = y - r; ystep <= y + r; ystep++) {
				if (!(ystep in map[xstep])) {
					map[xstep][ystep] = {};
					setTileHeight(xstep, ystep);
				}							
            }
        }
	}
	
	function setTileHeight(xstep, ystep)
	{
		var z,
			zrange = searchNeighbors(xstep, ystep);
		
		if (!zrange) {
			z = zstep;
		} else {
			var zrand, zlimit;
						
			if (settingRandom == 'simplex') {				
				zrand = simplex.noise(xstep / nstep, ystep / nstep);
				
				// TODO: Smooth location around spawn for climbing
				zrand = smoothTerrain(zrand, xstep, ystep, namp);
				
				
			} else {
				zrand = Math.random();
			}
			
			if (settingLock == 'lock') {
				var zoff = (zrange.zmax - zrange.zmin);
				zlimit = zrand * zoff + zrange.zmin;
			} else if (settingLock == 'free') {
				zlimit = zrand * zstep * namp;
			} else {
				zlimit = zstep;
			}
			
			z = Math.round(zlimit / zstep) * zstep;
		}
		
		map[xstep][ystep].z = z;
	}
	
	function smoothTerrain(z, dx, dy, dr) 
	{
		// Quickly check if tile is within square of radius dr
		if (Math.abs(dx) <= dr && Math.abs(dy) <= dr) {
			// Get the distance from tile (circular)
			var r = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
				
			if (r < dr) {
				// Use weights to smooth terrain to zstep values
				return (r * z) / dr;
			}
		}
		
		return z;
	}
	
	function render()
	{	
		// Clear Canvases
		$('#game').clearRect(0, 0, w, h);
		buildCtx.clearRect(0, 0, w, h);
	   
		for (var xstep = gx - rstep; xstep <= gx + rstep; xstep++) {
			for (var ystep = gy - rstep; ystep <= gy + rstep; ystep++) {
				if (xstep in map && ystep in map[xstep]) {
					var xtile = xstep - gx, ytile = ystep - gy;
					var ztile = map[xstep][ystep].z - map[gx][gy].z;
					renderTile(xtile, ytile, ztile);
				}
            }
        }
		
		// Overlay a translucent player to deal with obfuscation
		renderPlayer(true);
		
		var time = new Date().getTime();
		var time = Math.abs(time % 30000 - 15000) / 30000;
		buildCtx.fillStyle = 'rgba(10, 50, 80, ' + time + ')';
		buildCtx.fillRect(0, 0, w, h);
		
		// Put the build canvas onto the display canvas
		$('#game').canvasContext().drawImage(build, 0, 0, w, h, 0, 0, w, h);
		
		setTimeout(render, 1000 / fps);
    }
	
	function renderTile(xstep, ystep, z) 
	{
		// Translate 3D coordinates to 2D Isometric		
		var xpos = xc + xstep * terrain.dirt.xoff - ystep * terrain.dirt.xoff - terrain.dirt.xoff;
		var ypos = yc + xstep * terrain.dirt.yoff + ystep * terrain.dirt.yoff - z - terrain.dirt.yoff;
					
		buildCtx.drawImage(tile, xpos, ypos);
		
		if (xstep == 0 && ystep == 0) {
			// Draw the player at moment of layer pass
			renderPlayer();
		}
	}
	
	function renderPlayer(isGhost)
	{
		if (isGhost) {
			buildCtx.globalAlpha = 0.5;
		}
		
		var sx = npc.player.w * pdir, 
			sy = 0, 
			sw = npc.player.w, 
			sh = npc.player.h, 
			dx = xc - npc.player.xoff, 
			dy = yc - npc.player.yoff;
			
		buildCtx.drawImage(player, sx, sy, sw, sh, dx, dy, sw, sh);		
		buildCtx.globalAlpha = 1;
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