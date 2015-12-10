app.factory('Auth', function($http){
  var signupUrl = '/auth/signup';
  var loginUrl = '/auth/login';
  var logoutUrl = '/auth/logout';
  var currentUser = null;
  
  $http.get('/auth/me').then(function(res){
    currentUser = res.data;
  });
  
  var auth = {
    signup: function(cred) {
      return $http.post(signupUrl, cred).then(function(user){
        currentUser = user;
        return user;
      })
        .then(null, function(error){
        throw error;
      });
    },

    login: function(cred) {
      return $http.post(loginUrl, cred).then(function(user){
        currentUser = user;
        return user;
      }).then(null, function(error){
        throw error;
      });
    },

    logout: function() {
      return $http.post(logoutUrl).then( function() {
        currentUser = null;
        return true;
      }).then( null, function( error ) {
        throw error;
      });
    },
    isAuthenticated: function(){
      return currentUser !== null;
    },
    isSuperUser: function() {
      return currentUser !== null && currentUser.isAdmin;
    },
    getUser: function() {
      return currentUser;
    }

  }
  return auth;
})