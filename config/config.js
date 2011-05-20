// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Configuration Variables, YAY!
//
exports.ipaddr   = '';
exports.port     = 8081;
exports.interval = 10000;
exports.idle     = 300000;

exports.publicPath      = 'public';
exports.indexPage       = 'index.html';
exports.errorPage       = 'error.html';

exports.indexRelUrl     = '/';
exports.clearRelUrl     = '/clear';
exports.callbackRelUrl  = '/callback';

exports.protocol        = 'http://';
exports.domain          = 'rebot.loc:8081';
exports.requestUrl      = 'http://www.tumblr.com/oauth/request_token';
exports.accessUrl       = 'http://www.tumblr.com/oauth/access_token';
exports.authorizeUrl    = 'http://www.tumblr.com/oauth/authorize';
exports.authenticateUrl = 'http://www.tumblr.com/api/authenticate';

exports.consumerKey     = 'iksYWpIjHgyxW814wOWv3RC42WUjTgRM9b32e08t7FwPr3xmgy';
exports.consumerSecret  = 'eYVu67LR237W3AfApDOQVfHqgbkfLPoIBqEwo6GWPDBJ94FVPx';
exports.callbackUrl     = exports.protocol + exports.domain + exports.callbackRelUrl;
exports.sessionSecret   = 'fjoppjPsofjaPspojdfPJF1324fPapjfPAojr05523Pfojfp22';