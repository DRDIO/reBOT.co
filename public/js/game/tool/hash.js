define(function()
{
    /**
     * @class Hash
     */
    return $C.extend({
        /**
         * Override the settings with url defined hash settings
         *
         * @param settings
         * @returns {*}
         */
        parse: function(settings)
        {
            if (location.hash) {
                var pairs = location.hash.substr(1).split(',');

                for (var i in pairs) {
                    var keyvalue = pairs[i].split(':');

                    if (keyvalue[0] in settings) {
                        settings[keyvalue[0]] = parseInt(keyvalue[1]);
                    }
                }
            }

            return settings;
        },

        /**
         * Update Hash with data from settings object
         *
         * @param settings
         * @returns {Hash}
         */
        update: function(settings)
        {
            // Update URL with developer settings
            var data = '';
            for (var i in settings) {
                data += i + ':' + settings[i] + ',';
            }

            location.hash = data;

            return this;
        }
    });
});