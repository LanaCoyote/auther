'use strict';

app.controller('StoryDetailCtrl', function ($scope, story, users, Auth) {
	$scope.isAuthenticated = Auth.isAuthenticated;
	$scope.isSuperUser = Auth.isSuperUser;
	$scope.story = story;
	$scope.users = users;
	$scope.$watch('story', function () {
		$scope.story.save();
	}, true);
});