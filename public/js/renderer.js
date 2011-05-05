var BOOTSTRAP = (function(self) 
{
    self.initRenderer = function()
    {
        // Implement Game Canvas
        $('#game').canvas();

        self.w        = $('#game').canvasWidth(),  // Setup common dimensions
        self.h        = $('#game').canvasHeight(),
        self.xc       = self.w / 2,
        self.yc       = self.h / 2,
        self.build    = document.createElement('canvas'),
        self.buildCtx = self.build.getContext('2d');

        self.build.width  = self.w;
        self.build.height = self.h;

        // Create Custom Player
        self.tiles.player.ctx.clearRect(0, 0, self.tiles.player.cvs.width, self.tiles.player.cvs.height);
        self.tiles.player.ctx.drawImage(self.tiles.player.img, 0, 0);
        self.tintCanvas(self.tiles.player.ctx,
            self.tiles.player.cvs.width,
            self.tiles.player.cvs.height,
            Math.round(Math.random() * 128),
            Math.round(Math.random() * 128),
            Math.round(Math.random() * 128));

        self.render();
    }

    self.tintCanvas = function(ctx, w, h, r, g, b)
    {
        var imgData = ctx.getImageData(0, 0, w, h);
        for (var i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i]     += r;
            imgData.data[i + 1] += g;
            imgData.data[i + 2] += b;
        }

        ctx.putImageData(imgData, 0, 0);
    }

    self.render = function()
    {
        $('#game').clearRect(0, 0, self.build.width, self.build.height);
        self.buildCtx.clearRect(0, 0, self.build.width, self.build.height);

        // Clear Canvases
        var time = new Date().getTime();

        for (var xstep = self.gx - self.settings.rstep; xstep <= self.gx + self.settings.rstep; xstep++) {
            for (var ystep = self.gy - self.settings.rstep; ystep <= self.gy + self.settings.rstep; ystep++) {
                if (xstep in self.map && ystep in self.map[xstep]) {
                    var tile    = self.tiles.dirt;
                    var zsource = self.map[xstep][ystep].z;
                    var zrel    = self.map[self.gx][self.gy].z;
                    var ztype   = zsource;
                    var zmax    = (self.settings.namp1 + self.settings.namp2) / 100;

                    if (self.settings.random) {
                        ztype *= Math.random();
                    }

                    // type settings are percentages of max z range of map
                    if (self.map[xstep][ystep].t) {
                        tile = self.tiles[self.map[xstep][ystep].t];
                    } else if (ztype < self.settings.lvlwater * zmax) {
                        tile    = self.tiles.mud;
                    } else if (ztype < self.settings.lvlbeach * zmax) {
                        tile    = self.tiles.sand;
                    } else if (ztype < self.settings.lvlplain * zmax) {
                        tile    = self.tiles.plain;
                    } else if (ztype > self.settings.lvlsnow * zmax) {
                        tile    = self.tiles.ice;
                    } else if (ztype > self.settings.lvlmount * zmax) {
                        tile    = self.tiles.stone;
                    } else if (ztype > self.settings.lvlhill * zmax) {
                        tile    = self.tiles.hill;
                    }

                    var xtile = xstep - self.gx, ytile = ystep - self.gy;
                    var ztile = zsource - zrel;

                    self.renderTile(tile, xtile, ytile, ztile);

                    if (!self.settings.drought && ztype < self.settings.lvlwater * zmax) {
                        ztile = self.settings.lvlwater * zmax - zrel;
                        tile  = self.tiles['water' + (Math.round(time % 500 / 500) + 1)];
                        self.renderTile(tile, xtile, ytile, ztile);
                    }
                }
            }
        }

        // Overlay a translucent player to deal with obfuscation
        self.renderPlayer(true);

        // Time of Day
        // self.timeOfDay();

        // Put the build canvas onto the display canvas
        $('#game').canvasContext().drawImage(self.build, 0, 0, self.w, self.h, 0, 0, self.w, self.h);

        setTimeout(self.render, 1000 / self.settings.fps);
    }

    self.renderTile = function(tile, xstep, ystep, z)
    {
        // Translate 3D coordinates to 2D Isometric
        var xpos = self.xc + xstep * tile.xoff - ystep * tile.xoff - tile.xoff;
        var ypos = self.yc + xstep * tile.yoff + ystep * tile.yoff - tile.yoff - z * self.settings.zstep;

        self.buildCtx.drawImage(tile.cvs, xpos, ypos);

        if (xstep == 0 && ystep == 0) {
            // Draw the player at moment of layer pass
            self.renderPlayer();
        }
    }

    self.renderPlayer = function(isGhost)
    {
        if (isGhost) {
            self.buildCtx.globalAlpha = 0.5;
        }

        var sx = self.tiles.player.w * self.pdir,
            sy = 0,
            sw = self.tiles.player.w,
            sh = self.tiles.player.h,
            dx = self.xc - self.tiles.player.xoff,
            dy = self.yc - self.tiles.player.yoff;

        self.buildCtx.drawImage(self.tiles.player.cvs, sx, sy, sw, sh, dx, dy, sw, sh);
        self.buildCtx.globalAlpha = 1;
    }

    self.timeOfDay = function()
    {
        time = Math.abs(time % 30000 - 15000) / 60000;
        self.buildCtx.fillStyle = 'rgba(10, 50, 80, ' + time + ')';
        self.buildCtx.fillRect(0, 0, self.w, self.h);
    }

    return self;
}(BOOTSTRAP || {}));