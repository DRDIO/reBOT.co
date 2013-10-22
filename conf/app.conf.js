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
    host:       'localhost',
    port:       8080,
    secret:     'catmeowtown',
    publicPath: __dirname + '/../public'
};

exports.oauth = {
    domain:          'http://localhost:8080',

    requestUrl:      'http://www.tumblr.com/oauth/request_token',
    accessUrl:       'http://www.tumblr.com/oauth/access_token',
    authorizeUrl:    'http://www.tumblr.com/oauth/authorize',
    authenticateUrl: 'http://api.tumblr.com/v2/user/info',

    consumerKey:     'ppScb9ojaMJTkJVDsOa6x0oM8RQuLh3dNMK75xqdzh3Tvg9Rvs',
    consumerSecret:  'kvalaarF1xdEYfN6SvSMQiTQuxkUKyGze3T4XlN3X2vXaGYWSB',

    appHtmlPath:     exports.server.publicPath + '/content.html'
};

exports.socketio = {
    logLevel: 2
};