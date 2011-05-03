var BOOTSTRAP = (function(self)
{
    self.initKeyboard = function()
    {
        $(window).keydown(function(e) {
            var key    = e.which;
            var gxtemp = self.gx, gytemp = self.gy, pdirtemp = self.pdir;

            if (key == self.KEY_NW) {
                self.gx  -= 1;
                self.pdir = 0;
            } else if (key == self.KEY_NE) {
                self.gy  -= 1;
                self.pdir = 1;
            } else if (key == self.KEY_SE) {
                self.gx  += 1;
                self.pdir = 2;
            } else if (key == self.KEY_SW) {
                self.gy  += 1;
                self.pdir = 3;
            }

            // Let them turn around without moving
            if (self.pdir != pdirtemp) {
                self.gx = gxtemp;
                self.gy = gytemp;
            }

            // Make sure a tile exists at coords
            self.seed(self.gx, self.gy, self.settings.rstep);

            var userTile = self.map[self.gx][self.gy].z;
            var nextTile = self.map[gxtemp][gytemp].z;

            // If jetpack is off, only small z traversal (small blocks)
            if (!self.settings.jetpack && Math.abs(userTile - nextTile) > self.settings.zjump) {
                self.gx = gxtemp;
                self.gy = gytemp;
            }
        });
    };

    return self;
}(BOOTSTRAP || {}));