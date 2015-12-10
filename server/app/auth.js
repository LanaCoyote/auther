var router = require('express').Router();
var User = require('../api/users/user.model');

router.post('/signup', function(req, res, next){
  User.create(req.body).then(function(user){
    req.session.userId = user._id;
    req.session.signinTime = Date.now();
    res.status(200).json(user);
  }).then(null, function(error){
    error.status = 401;
    next(error);
  });
});

router.post('/login', function(req, res, next){
  User.findOne({ email: req.body.email }).then(function(user){
    if(!user) throw new Error("user not found");
    if(req.body.password !== user.password) {
      throw new Error("Password mismatch");
    }
    else return user;
  }).then(function(user){
    req.session.userId = user._id;
    req.session.signinTime = Date.now();
    res.status(200).json(user);
  }).then(null, function(error){
    error.status = 401;
    next(error);
  });
});

router.post( '/logout', function( req, res, next ) {

  if ( req.session.userId ) {

    delete req.session.userId;
    res.status(200).send();

  } else {

    var error = new Error( "Not logged in" );
    error.status = 401;
    next( error );

  }

});

router.get('/me', function(req, res, next){
  var userId = req.user || (req.session?req.session.userId:null);
  if(userId){
    User.findById(userId).then(function(user){
      res.status(200).json(user);
    }).then(null, function(error){
      error.status = 401;
      next(error);
    });
  }
  else {
    var error = new Error("Not signed in.");
    error.status = 401;
    next(error);
  }
})

// google OAUTH
var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(
  new GoogleStrategy({
    clientID: '1035300304578-po0ohs1abf4rb8l4b95a8gfdbi08mplb.apps.googleusercontent.com',
    clientSecret: 'hSCCGUcuGfqxzPkQylsPnt5Y',
    callbackURL: 'http://127.0.0.1:8080/auth/google/callback'
  },

  function( token, refreshToken, profile, done ) {

    // signing user up
    User.findOne( { 'google.id' : profile.id } ).then( function( user ) {

      if ( user ) {

        return done( null, user );

      } else {
        
        var user = {
          name: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value,

          google : {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            token: token
          }
        };

        User.create( user ).then( function( user ) {
          console.log( "Created user:", user );
          return done( null, user );
        }).then( null, function( error ) {
          return done( error );
        })

      }

    }, function( error ) {

      done( error );

    });

  })
);

// github OAUTH
var GitHubStrategy = require('passport-github');
passport.use( new GitHubStrategy({
    clientID: 'cbc430a4e7029cd09340',
    clientSecret: '81c8e1c720edb8f6db4aec3adc765645f034d662',
    callbackURL: 'http://127.0.0.1:8080/auth/github/callback'
  },

  function( accessToken, refreshToken, profile, done ) {

    User.findOne({ 'github.id': profile.id }).then( function( user ){

      if( user ) {
        return done( null, user );
      } else {

        var user = {
          name : profile.displayName,
          email : profile._json.email || "fakename@mail.com",

          github: {
            id : profile.id,
            name : profile.displayName,
            email : profile._json.email,
            token : accessToken
          }
        }

        User.create( user ).then( function( user ) {
          done( null, user );
        }, function( error ) {
          done( error );
        })

      }

    }, function( error ) {
      return done( error );
    });

  })
);

passport.serializeUser( function( user, done ) {

  done( null, user._id );

});

passport.deserializeUser( function( id, done ) {

  User.findById( id ).then( function( user ) {
    done( null, user );
  }, function( error ) {
    done( error );
  })

});

router.get( '/google', passport.authenticate( 'google', { scope: 'email' }));
router.get( '/google/callback', 
  passport.authenticate( 'google', {
    successRedirect : '/',
    failureRedirect : '/'
  }));

router.get( '/github', passport.authenticate( 'github', { scope: 'email' }));
router.get( '/github/callback',
  passport.authenticate( 'github', {
    successRedirect : '/',
    failureRedirect : '/'
  }));

module.exports = router;











