var BOOTSTRAP = (function($$)
{
    $$.initDom = function()
    {
        $('<div/>').attr('id', 'tooltip').addClass('ui-widget ui-widget-content ui-corner-all').appendTo('body').hide();

        $('#panel>div').buttonset();

        for (var i in $$.initSettings) {
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
                            $$.settings[key] = parseInt(value);
                            
                        }).bind('slide', function(e, ui) {
                            if (properties.r) {
                                $$.initGame();
                            }
                        })
                        .slider()
                    );
            })(i, $$.initSettings[i]);
        }

        $('#panel').hover(function() {
            $(this).fadeTo(250, 1);
        }, function() {
            $(this).fadeTo(250, 0.25);
        });

        $('#setting-refresh').click(function() {
            $$.randomseed = Math.random();
            $$.initGame();
        });

        $('#setting-hash').click(function() {
            $$.updateHash();
        });
    };

    $$.updateHash = function()
    {
        // Update URL with developer settings
        var hash = '';
        for (var i in $$.settings) {
            hash += i + ':' + $$.settings[i] + ',';
        }
        location.hash = hash + 'gx:' + $$.player.gx + ',gy:' + $$.player.gy;
    }
    
    return $$;
}(BOOTSTRAP || {}));