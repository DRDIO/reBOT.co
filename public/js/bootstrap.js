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

    socketConnect();
});

function socketConnect()
{
    if (typeof io == 'object') {        
        socket = new io.Socket();
        socket.on('connect', function()
        {
            console.log('connected');
            socket.send({playerMove: ['meow', 'pop', 'lock']});
        });

        socket.on('message', function(response)
        {
            console.log('test');
            console.log(response);
        });

        socket.connect();
    } else {
        console.log('still waiting');
        settimeout(socketConnect, 1000);
    }
}

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