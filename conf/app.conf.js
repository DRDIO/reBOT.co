exports.timerList = {
    cleanup: 2.5 * 60000,
    remove:  2.5 * 60000,
    idle:    5   * 60000,
    kick:    20  * 60000        
};

exports.dft = {
    room:  'main',
    owner: 'kevinnuut'
};

exports.db = {
    'database': 'mongodb://rebot:rebot@flame.mongohq.com:27074/rebot'
};

exports.server = {
    host:       '0.0.0.0',
    port:       process.env.PORT,
    secret:     'XXXX',
    publicPath: __dirname + '/../public'
};

exports.oauth = {
    domain:          'http://rebot_co.kevinnuut.c9.io',

    requestUrl:      'http://www.tumblr.com/oauth/request_token',
    accessUrl:       'http://www.tumblr.com/oauth/access_token',
    authorizeUrl:    'http://www.tumblr.com/oauth/authorize',
    authenticateUrl: 'http://api.tumblr.com/v2/user/info',

    consumerKey:     'iksYWpIjHgyxW814wOWv3RC42WUjTgRM9b32e08t7FwPr3xmgy',
    consumerSecret:  'eYVu67LR237W3AfApDOQVfHqgbkfLPoIBqEwo6GWPDBJ94FVPx',

    appHtmlPath:     exports.server.publicPath + '/content.html'
};

exports.socketio = {
    logLevel: 2
};