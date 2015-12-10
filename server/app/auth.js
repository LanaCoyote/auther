var router = require('express').Router();
var User = require('../api/users/user.model');

router.post('/signup', function(req, res, next){
  User.create(req.body).then(function(user){
    res.status(200).json(user);
  }).then(null, function(error){
    res.status(401);
    next();
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
    res.status(200).json(user);
  }).then(null, function(error){
    error.status = 401;
    next(error);
  });
});

module.exports = router;