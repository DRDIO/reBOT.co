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
			
	$('#game').canvas();
	
	var w  = $('#game').canvasWidth();
	var h  = $('#game').canvasHeight();
	var xc = w / 2;
	var yc = h / 2;	
		
	terrain.dirt.obj        = new Image();
	terrain.dirt.obj.onload = render;	
	terrain.dirt.obj.src    = imgDir + terrain.dirt.url;
	
	function render() {
		var context = $('#game').canvasContext();
		
		var ystep, xstep = 0, steps = 24;
		for (var ystep = -steps; ystep <= steps; ystep++) {
			for (var xstep = -steps; xstep <= steps; xstep++) {
				var zoff = Math.round(Math.random() * 4) * 4;
				var xpos = xc + xstep * terrain.dirt.xoff - ystep * terrain.dirt.xoff;
				var ypos = yc + xstep * terrain.dirt.yoff + ystep * terrain.dirt.yoff + zoff;
				
				context.drawImage(terrain.dirt.obj, xpos, ypos);
			}
		}
		
		
	};
});