var BOOTSTRAP = (function(self) 
{
    // Build out core objects
    self.imgDir = 'img/',
    self.tiles  = {
            'dirt': {
                'url':  'terrain/001x50.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'mud': {
                'url':  'terrain/002.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'water1': {
                'url':  'terrain/008.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'water2': {
                'url':  'terrain/009.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'ice': {
                'url':  'terrain/003.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'stone': {
                'url':  'terrain/004.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'sand': {
                'url':  'terrain/005.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'plain': {
                'url':  'terrain/007.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'hill': {
                'url':  'terrain/006.png',
                'xoff': 32,
                'yoff': 16,
                'w':    64,
                'h':    31
            },
            'player': {
                'url':  'npc/001.png',
                'xoff': 21,
                'yoff': 31,
                'w'   : 42,
                'h'   : 42
            }
        },
        self.map      = {},
        self.promises = [];

    self.loadImages = function()
    {
        // Create terrain object (TODO: Loop)
        for (var i in self.tiles) {
            (function(tile, promise) {
                tile.img        = new Image();
                tile.img.src    = self.imgDir + tile.url;
                tile.img.onload = function() {
                    tile.cvs        = document.createElement('canvas');
                    tile.cvs.width  = tile.img.width;
                    tile.cvs.height = tile.img.height;
                    tile.ctx        = tile.cvs.getContext('2d');

                    tile.ctx.drawImage(tile.img, 0, 0);
                    // delete tile.img;

                    promise.resolve();
                }
            })(self.tiles[i], self.promises[self.promises.push($.Deferred()) - 1]);
        }

        // When all images load, run INIT()
        return self.promises;
    };

    return self;
}(BOOTSTRAP || {}));