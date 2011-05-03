var BOOTSTRAP = (function(self)
{
    self.initDom = function()
    {
        $('<div/>').attr('id', 'tooltip').addClass('ui-widget ui-widget-content ui-corner-all').appendTo('body').hide();

        $('#panel>div').buttonset();

        for (var i in self.initSettings) {
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
                            self.settings[key] = parseInt(value);
                            
                        }).bind('slide', function(e, ui) {
                            if (properties.r) {
                                self.initGame();
                            }
                        })
                        .slider()
                    );
            })(i, self.initSettings[i]);
        }

        $('#panel').hover(function() {
            $(this).fadeTo(250, 1);
        }, function() {
            $(this).fadeTo(250, 0.25);
        });

        $('#setting-refresh').click(function() {
            self.randomseed = Math.random();
            self.initGame();
        });

        $('#setting-hash').click(function() {
            self.updateHash();
        });
    };

    self.updateHash = function()
    {
        // Update URL with developer settings
        var hash = '';
        for (var i in self.settings) {
            hash += i + ':' + self.settings[i] + ',';
        }
        location.hash = hash + 'gx:' + self.gx + ',gy:' + self.gy;
    }
    
    return self;
}(BOOTSTRAP || {}));