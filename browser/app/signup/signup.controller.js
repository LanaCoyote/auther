app.controller('SignupController', function($scope, Auth){
  $scope.signup = function(cred) {
    Auth.signup(cred).then(function(user){
      console.log(user);
    }).then(null, function(error){
      console.error(error);
    });
  }
});