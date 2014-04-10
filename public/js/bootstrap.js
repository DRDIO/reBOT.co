require.config({
    baseUrl: 'js'
});


require([
    'jquery', 
    'lib/class', 
    'lib/underscore', 
    'lib/jqueryui', 
    'lib/jcanvas',
], function ($) {
    window.$L = $('#loading section');
    
    // Let's get this party started
    $L.html('Loading Core Scripts');
    
    require([
        'game/main',
        'input/keymouse/main',
        'output/canvas/main',
        'config/game',
        'config/output-canvas'
    ], function (Game, Input, Output, confGame, confOutput) {
        // Assign the settings sliders to whatever Output is rendered
        var input = new Input();
        var output = new Output(confOutput);
        new Game(confGame, input, output);
    });
});