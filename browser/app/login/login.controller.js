app.controller('LoginController', function($scope, $state, Auth){
  $scope.login = function(cred){
    Auth.login(cred).then(function(user){
      console.log(user);
      $state.go('home');
    }).then(null, function(error){
      console.error(error);
    });
  }
});