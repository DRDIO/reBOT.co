// A global namespace
var APP = {};

// Required to show loading screen and have jquery
var SCRIPT_CORE = [
    'jquery',
    '/js/lib/jquery/jqueryui.js',
];

// All secondary scripts after loading script is up
var SCRIPT_GAME = [
    '/js/lib/jquery/canvas.js', // This will assist in canvas drawing
    '/socket.io/socket.io.js',  // The server socket code

    'settings',         // Depended on by most files below
    'dom',              // Connects UI, events, and admin setting toggles
    'keyboard',         // Helps map keys to useful methods

    'seedrandom',       // Allows for random seed generation
    'simplexnoise',     // Terrain generation algorithms (DEP: seedrandom)

    'cookie',           // Web cookies
    'socket',           // Client side websockets (DEP: cookie)

    'sprite',           // Holds image, canvas, and context data for every sprite (tile, player, enemy)
    'spritealbum',      // A collection of all sprites and some helper methods for cleanup (DEP: sprite)

    // 'entity',           // The basic block for all items, buildings, enemies, players
    'player',           // The controlling player

    'tile',             // The individual tiles of the world
    'world',            // A 2-dimensional grid of tiles (DEP: tile)
    
    'game',             // CONTROLLER OVERLORD OF ALL
    'renderer',         // Renders game (2D Canvas)
];

// Let's get this party started
$('#loading section').html('Loading Core Scripts');

// Load core scripts, set JS path, update message, then load secondary
require({baseUrl: '/js/game'}, SCRIPT_CORE, function($) {
        $('#loading section').html('Loading Game Scripts');

        require(SCRIPT_GAME, function() {
            // This will connect to socket, load images, connect keyboard, and start game
            BOOTSTRAP.init()
        });
    }
);