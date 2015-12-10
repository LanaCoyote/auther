var router = require('express').Router();
var User = require('../api/users/user.model');

router.post('/signup', function(req, res, next){
  User.create(req.body).then(function(user){
    req.session.userId = user._id;
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

module.exports = router;