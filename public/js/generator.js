$(function() {
    var imgDir  = 'img/terrain/';
    var terrain = {
        'dirt': {
            'obj':   null,
            'url':   '001x50.png',
            'xoff':  21,
            'yoff':  10,
            'wtile': 42,
            'htile': 20
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

    $('#panel input').change(function() {
       $('#game').clearRect(0, 0, w, h);
       map = {};
       render();
    });
    
    function render() {
        var context = $('#game').canvasContext();
        var simplex = new SimplexNoise();
        
        var settingLock   = $('#setting-lock input:checked').val();
        var settingRandom = $('#setting-random input:checked').val();
        
        for (var xstep = -steps; xstep <= steps; xstep++) {
            map[xstep] = {};
			
            for (var ystep = -steps; ystep <= steps; ystep++) {
                map[xstep][ystep] = {};
				
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
		
        return (zmax != -zlimit ? {
            'zmax': zmax - zstep,
            'zmin': zmin + zstep
            } : null);
    }
});