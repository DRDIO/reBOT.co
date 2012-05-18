var BOOTSTRAP = (function($$) {    
    $$.init = function()
    {
        $('#loading section').html('Connecting &amp; Loading Images');

        // All images and sockets must be connected first
        var tiles = [
            '1x1',
            '2x1',
            '3x1',
            '4x1',
            '5x1',
            '6x1',
            '7x1',
            '8x1',
            '8x2',
            '9x1',
            '9x2',
            '9x3',
            '9x4'
        ];

        for (var i in tiles) {
            var path = '/img/terrain/' + tiles[i] + '.png';
            APP.spriteAlbum.set(path, 64, 31, 32, 16, $.Deferred());
        }

        // Add player
        APP.spriteAlbum.set(APP.PLAYER_PATH, 32, 48, 16, 40, $.Deferred());

        var promises = APP.spriteAlbum.getPromises();

        // Add sockets to the list of promises to wait for
        promises.push($$.initSocket());

        // Then render and start game
        $.when.apply($, promises).done(function()
        {
            $$.initRenderer();
            $$.initGame();
            
            // When everything is setup, allow mouse and keyboard movements
            APP.attachEvents();

            $('#page').fadeIn(250);
            $('#loading').stop().fadeOut(250);
       });
    }

    $$.initGame = function()
    {
        APP.world.init();
        APP.world.seed(APP.player.globalX, APP.player.globalX, $$.settings.rstep);
    }

    $$.userApproved = function(user)
    {
        // console.log(user);
    }

    return $$;
}(BOOTSTRAP || {}));