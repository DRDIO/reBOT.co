define(['settings', 'keyboard'], function(keyboard) {
    $('#panel>div').buttonset();

    for (var i in BOOTSTRAP.initSettings) {
        (function(key, properties) {
            $('<div/>')
                .insertAfter('#panel>h2')
                .append($('<label/>').html(properties.l))
                .append($('<span/>')
                    .addClass('slider')
                    .attr('id', 'setting-' + key)
                    .bind('slidecreate', function(e, ui) {
                        $(this).slider('option', 'min',   properties.i);
                        $(this).slider('option', 'max',   properties.a);
                        $(this).slider('option', 'step',  properties.s);
                        $(this).slider('option', 'value', properties.v);

                        $(ui.handle).html(properties.v);
                    })
                    .bind('slide slidechange', function(e, ui) {
                        var value = $(this).slider('option', 'value');
                        var key   = $(this).attr('id').substr(8);

                        $(ui.handle).html(value);
                        BOOTSTRAP.settings[key] = parseInt(value);

                    }).bind('slide', function(e, ui) {
                        if (properties.r) {
                            BOOTSTRAP.initGame();
                        }
                    })
                    .slider()
                );
        })(i, BOOTSTRAP.initSettings[i]);
    }

    APP.attachEvents = function() {
        $(window).keydown(function(e) {
            var action = APP.keyboard.press(e.which);
            if (action == 'settings') {
                BOOTSTRAP.toggleSettings();
            } else if (action == 'move') {
                console.log(APP.keyboard.getKey());
                var dir = APP.keyboard.mapDirection();
                BOOTSTRAP.player.move(dir);
            }
        });

        $(window).keyup(function(e) {
            APP.keyboard.release(e.which);
        });

        $('#panel').hover(function() {
            $(this).fadeTo(250, 1);
        }, function() {
            $(this).fadeTo(250, 0.25);
        });

        $('#setting-refresh').click(function() {
            // Force a new seed and reboot game
            Math.random();
            BOOTSTRAP.initGame();
        });

        $('#setting-hash').click(function() {
            APP.updateHash();
        });
    };

    APP.updateHash = function() {
        // Update URL with developer settings
        var hash = '';
        for (var i in BOOTSTRAP.settings) {
            hash += i + ':' + BOOTSTRAP.settings[i] + ',';
        }

        location.hash = hash + 'gx:' + BOOTSTRAP.player.gx + ',gy:' + BOOTSTRAP.player.gy;
    }
});

var BOOTSTRAP = (function($$)
{
    $$.initDom = function()
    {

    };


    return $$;
}(BOOTSTRAP || {}));