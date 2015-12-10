app.controller('SignupController', function($scope, $state, Auth){
  $scope.signup = function(cred) {
    Auth.signup(cred).then(function(user){
      console.log(user);
      $state.go('home');
    }).then(null, function(error){
      console.error(error);
    });
  }
});