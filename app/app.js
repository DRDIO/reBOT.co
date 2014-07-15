var express = require('express.io'),
    app = express(),
    routes  = require('./routes'),
    jade    = require('jade'),
    confOauth = require('../config/oauth.js'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    StrategyFacebook = require('passport-facebook').Strategy;

app.http().io();

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new StrategyFacebook(
    confOauth.facebook,
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'my_precious' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(__dirname + '/../public'));
});

app.get('/',
    passport.authenticate('facebook'),
    function (req, res) {
        // Silence
    }
);

app.get('/account', ensureAuthenticated, function (req, res) {
    res.render('account', { user: req.user });
});

app.get('/', function (req, res) {
    res.render('login', { user: req.user });
});

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function (req, res) {
        res.redirect('/account');
    }
);

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// port
app.listen(process.env.PORT || 3000);

// test authentication
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/')
}