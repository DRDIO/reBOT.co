define(function() 
{
    
    var Dom = $C.extend({
        init: function()
        {
            $L.html('Initializing DOM');
            
            $('#panel>div').buttonset();
        },
        
        attachToolbar: function(game, settingsMixer) 
        {  
            $L.html('Attaching Toolbar');
            
            for (var i in settingsMixer) {
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

                            // Bind a settings update on change
                            .bind('slide slidechange', function(e, ui) {
                                var value = $(this).slider('option', 'value');
                                var key   = $(this).attr('id').substr(8);
        
                                $(ui.handle).html(value);
                                game.settings[key] = parseInt(value, 0);
                                game.restart();
        
                            }).bind('slide', function(e, ui) {
                                if (properties.r) {
                                    // TODO: Reboot renderer
                                }
                            })
                            .slider()
                        );
                })(i, settingsMixer[i]);
            }
            
            return this;
        },

        start: function()
        {
            $L.html('Starting Game');
            
            $('#page').fadeIn(250);
            $('#loading').stop().fadeOut(250);
            
            return this;
        },

        toggleSettings: function()
        {
            if ($('#panel').is(':hidden')) {
                $('#page').animate({width: '960px', marginLeft: '-480px'}, 250);
                $('#panel').fadeIn(250);
            } else {
                $('#page').animate({width: '640px', marginLeft: '-320px'}, 250);
                $('#panel').fadeOut(250);
            }
            
            return this;
        }
        
    });
    
    return Dom;
    
});
