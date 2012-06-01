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
    
    require(['game/main', 'game/config/config'], function (Game, config) {
        new Game(config);
    });
});