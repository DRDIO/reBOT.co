var scripts = [
    'noise',        // Simplex Noise Package
    'seedrandom',   // Random Seed Generator
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

var BOOTSTRAP = (function($$)
{
    $$.init = function()
    {
        $$.initDom();
        $$.initKeyboard();

        // All images and sockets must be connected first
        var promises = $$.loadImages();
        promises.push($$.initSocket());

        // Then render and start game
        $.when.apply($, $$.loadImages()).done(function()
        {
            console.log('rendering');
            $$.initRenderer();
            $$.initGame();
       });
    }
    
    return $$;
}({}));

$(function()
{
    var deferred = [];
    for (var i in scripts) {
        deferred.push(loadScript(scripts[i], false));
    }

    $.when.apply($, deferred).done(function() {
        BOOTSTRAP.init();
    });
});

function loadScript(key, dependents)
{
    if (dependents) {
        var deferred = [];

        for (var i in dependents) {
            deferred.push(loadScript(i, dependents[i]));
        }

        return $.when.apply($, deferred).done(function() {
            loadScript(key, false);
        });
    } else {
        return $.getScript('/js/game/' + key + '.js');
    }
}
