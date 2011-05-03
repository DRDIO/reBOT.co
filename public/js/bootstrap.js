var scripts = [
    'noise',        // Simplex Noise Package
    'seedrandom',   // Random Seed Generator
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
            
        $.when.apply($, self.loadImages()).done(function() {
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