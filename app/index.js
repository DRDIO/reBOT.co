// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Extremely Easy Oauth Socket Start
// Just include the required config file and an object with the following prototype methods
// * init()
// * onMessage(response)
// * onDisconnect()

var config   = require('../config/config'),
    worldobj = require('./game');

require('./lib/socketconnect')(config, worldobj);