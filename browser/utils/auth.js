app.factory('Auth', function($http){
  var signupUrl = '/auth/signup';
  var loginUrl = '/auth/login';
  var logoutUrl = '/auth/logout';

  var auth = {
    signup: function(cred) {
      return $http.post(signupUrl, cred).then(function(user){
        return user;
      })
        .then(null, function(error){
        throw error;
      });
    },

    login: function(cred) {
      return $http.post(loginUrl, cred).then(function(user){
        return user;
      }).then(null, function(error){
        throw error;
      });
    },

    logout: function() {
      return $http.post(logoutUrl).then( function() {
        return true;
      }).then( null, function( error ) {
        throw error;
      });
    }

  }
  return auth;
})