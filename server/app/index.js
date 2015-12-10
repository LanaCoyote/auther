'use strict'; 

var app = require('express')();
var path = require('path');
var passport = require('passport');
var session = require('express-session');

app.use(require('./logging.middleware'));

app.use(require('./requestState.middleware'));

app.use(session({
    secret: "tongiscool"
}));

app.use(passport.initialize());
app.use(passport.session());

var timeout = 30 * 60 * 1000;

app.use( function( req, res, next ) {
  if( req.user ) {
    console.log( "request from user:", req.user.email );
    if(req.session.signinTime + timeout < Date.now()) {
      delete req.session.userId;
      console.log("Signin timedout");
    }
  } else {
    console.log( "request from someone who isn't logged in")
  }

  next();
})

app.use(require('./statics.middleware'));

app.use('/auth', require('./auth'));
app.use('/api', require('../api/api.router'));


var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
	app.get(stateRoute, function (req, res) {
		res.sendFile(indexPath);
	});
});

app.use(require('./error.middleware'));

module.exports = app;