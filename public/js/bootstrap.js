var ENGINE = 'threejs'; // threejs | canvas experimental engines
var GAME   = null;

require.config({
    baseUrl: 'js'
});

require([
    'jquery',
    './lib/class',
    './lib/underscore',
    './lib/jqueryui'
], function ($) {
    window.$L = $('#loading section');
    
    // Let's get this party started
    $L.html('Loading Core Scripts');
    
    require([
        'game/main',
        'input/keymouse/main',
        'output/' + ENGINE + '/main',
        'config/game',
        'config/output-canvas'
    ], function (Game, Input, Output, confGame, confOutput) {
        // Assign the settings sliders to whatever Output is rendered
        var input = new Input();
        var output = new Output(confOutput);

        GAME = new Game(confGame, input, output);
    });
});