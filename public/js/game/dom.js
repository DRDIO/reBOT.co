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
        
        attachEvents: function(game)
        {     
            $L.html('Attaching User Events');
            
            var dom = this;
            
            $(window).keydown(function(e) {
                var action = game.keyboard.press(e.which);
                
                if (action == 'settings') {
                    dom.toggleSettings();
                } else if (action == 'move') {
                    var dir = game.keyboard.mapDirection();                
                    game.world.movePlayer(dir);
                }
            });
    
            $(window).keyup(function(e) {
                game.keyboard.release(e.which);
            });
    
            $('#panel').hover(function() {
                $(this).fadeTo(250, 1);
            }, function() {
                $(this).fadeTo(250, 0.25);
            });
    
            $('#setting-refresh').click(function() {
                // Force a new seed and reboot game
                game.settings.seed = Math.random();
                game.restart();
            });
    
            $('#setting-hash').click(function() {
                dom.updateHash();
            });  
            
            return this;
        },
        
        start: function()
        {
            $L.html('Starting Game');
            
            $('#page').fadeIn(250);
            $('#loading').stop().fadeOut(250);
            
            return this;
        },
        
        loadHash: function(settingsMixer)
        {
            var gx    = 0, 
                gy    = 0;

            if (location.hash) {
                var pairs = location.hash.substr(1).split(',');
                    
                for (var i in pairs) {
                    var keyvalue = pairs[i].split(':');
                    
                    if (keyvalue[0] in settingsMixer) {
                        settingsMixer[keyvalue[0]].v = parseInt(keyvalue[1]);
                    } else if (keyvalue[0] == 'gx') {
                        gx = parseInt(keyvalue[1]);
                    } else if (keyvalue[0] == 'gy') {
                        gy = parseInt(keyvalue[1]);
                    }
                }
            }
            
            var settings = this.parseMixer(settingsMixer);

            settings.gx = gx;
            settings.gy = gy;

            return settings;
        },

        parseMixer: function(settingsMixer)
        {
            var settings = {};
            for (var i in settingsMixer) {
                settings[i] = settingsMixer[i].v;
            }

            return settings;
        },
    
        updateHash: function(settings, playerX, playerY) 
        {
            // Update URL with developer settings
            var hash = '';
            for (var i in settings) {
                hash += i + ':' + settings[i] + ',';
            }
    
            location.hash = hash + 'gx:' + playerX + ',gy:' + playerY;
            
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
