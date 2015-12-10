app.directive('signIn', function() {
  return {
    restrict: 'E',
    scope: {
      method: '@'
    },
    templateUrl: '/browser/components/signin/signin.html',
  }
});