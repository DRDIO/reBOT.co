var scripts = [
    'noise',        // Simplex Noise Package
    'seedrandom',   // Random Seed Generator
    'cookie',
    'socket',    
    'dom',
    'game',
    'images',
    'keyboard',
    'renderer',
    'settings'
];

var BOOTSTRAP = (function(self)
{
    self.init = function()
    {
        self.initDom();
        self.initKeyboard();

        // All images and sockets must be connected first
        var promises = self.loadImages();
        promises.push(self.initSocket());

        // Then render and start game
        $.when.apply($, self.loadImages()).done(function()
        {
            console.log('rendering');
            self.initRenderer();
            self.initGame();
       });
    }
    
    return self;
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
        return $.getScript('/js/' + key + '.js');
    }
}
