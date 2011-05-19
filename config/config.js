// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Configuration Variables, YAY!
//
exports.ipaddr   = '';
exports.port     = 8080;
exports.interval = 10000;
exports.idle     = 300000;

exports.protocol        = 'http://';
exports.domain          = 'rebot.loc:8080';
exports.requestUrl      = 'http://www.tumblr.com/oauth/request_token';
exports.accessUrl       = 'http://www.tumblr.com/oauth/access_token';
exports.authorizeUrl    = 'http://www.tumblr.com/oauth/authorize';
exports.authenticateUrl = 'http://www.tumblr.com/api/authenticate';

exports.consumerKey    = 'oQRq1Wpo1BiygSFYGdUJUZq2DgcRzm4Jjx7ooxh19wQ3WCAcSU';
exports.consumerSecret = 'Ak59AnEOWHWpgbtzqJYJL08IIQ8DNxA96CbsBh5FJDpMDbiij0';
exports.callbackUrl    = exports.protocol + exports.domain + '/callback';
exports.sessionSecret  = 'fjoppjPsofjaPspojdfPJF1324fPapjfPAojr05523Pfojfp22';