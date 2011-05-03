var BOOTSTRAP = (function(self) {    
    self.simplex     = null,
    self.pdir        = 3,         // Player direction (NW = 0, NE = 1, SE = 2, SW = 3)
    self.KEY_NW      = 37,        // Directional keys
    self.KEY_NE      = 38,
    self.KEY_SE      = 39,
    self.KEY_SW      = 40;

    self.initGame = function()
    {
        // Set the seed, get a simplex noise object and clear the map
        Math.seedrandom(self.randomseed);
        self.simplex = new self.SimplexNoise();
        self.map     = {};
        
        // Seed our center area (render will start in initRenderer or timeout)
        self.seed(self.gx, self.gy, self.settings.rstep);
    }

    self.seed = function(x, y, r)
    {
        for (var xstep = x - r; xstep <= x + r; xstep++) {
            if (!(xstep in self.map)) {
                self.map[xstep] = {};
            }

            for (var ystep = y - r; ystep <= y + r; ystep++) {
                if (!(ystep in self.map[xstep])) {
                    self.map[xstep][ystep] = {};
                    self.setTileHeight(xstep, ystep);
                }
            }
        }
    }

    self.setTileHeight = function(xstep, ystep)
    {
        var z, zrand, zlimit;

        var zrand1 = self.simplex.noise(xstep / self.settings.nstep1, ystep / self.settings.nstep1) * self.settings.namp1;
        var zrand2 = self.simplex.noise(xstep / self.settings.nstep2, ystep / self.settings.nstep2) * self.settings.namp2;

        // TODO: Smooth location around spawn for climbing
        zrand = zrand1 + zrand2;        
        zrand = self.smoothTerrain(zrand, xstep, ystep, self.settings.rstep);

        self.map[xstep][ystep].z = Math.round(zrand);
    }

    self.smoothTerrain = function(z, dx, dy, dr)
    {
        // Quickly check if tile is within square of radius dr
        if (Math.abs(dx) <= dr && Math.abs(dy) <= dr) {
            // Get the distance from tile (circular)
            var r = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

            if (r < dr) {
                return r * z / dr;
            }
        }

        return z;
    }

    return self;
}(BOOTSTRAP || {}));