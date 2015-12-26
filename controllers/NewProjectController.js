'use strict';

angular.module('tangram').controller('NewProjectController', function($scope, $state, ApiService, AuthService) {

    $scope.createProject = function(project) {
        // Create the new project
        ApiService.createProject(AuthService.getToken(), project.name, project.description)
        .then(
            function success(response) {
                $state.go('projects');
            },
            function error(response) {
                console.log(response);
            }
        );
    }

    // Verify that the user is authenticated on page load
    if (AuthService.getToken() == null) {
        // Not authenticated, kick them out
        AuthService.redirect();
    }
    else {
        // The user is authenticated, proceed to load data
        loadData();
    }
});
