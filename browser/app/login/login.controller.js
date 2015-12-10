app.controller('LoginController', function($scope, Auth){
  $scope.login = function(cred){
    Auth.login(cred).then(function(user){
      console.log(user);
    }).then(null, function(error){
      console.error(error);
    });
  }
});