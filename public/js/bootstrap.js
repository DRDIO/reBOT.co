var SCRIPT_CORE = [
    'jquery',
    '/js/lib/jquery/jqueryui.js',
];

var SCRIPT_GAME = [
    '/js/lib/jquery/canvas.js',
    '/socket.io/socket.io.js',
    'simplexnoise',
    'seedrandom',
    'cookie',
    'socket',
    'player',
    'dom',
    'game',
    'images',
    'keyboard',
    'renderer',
    'settings'
];

var APP = {};

$('#loading section').html('Loading Core Scripts');

require({baseUrl: '/js/game'}, SCRIPT_CORE, function($) {
        $('#loading section').html('Loading Game Scripts');

        require(SCRIPT_GAME, function() {
            BOOTSTRAP.init()
        });
    }
);