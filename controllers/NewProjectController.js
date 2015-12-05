'use strict';

angular.module('tangram').controller('NewProjectController', function($scope, $state, ApiService, AuthService) {

    $scope.createProject = function(project) {
        // API JSONWebToken
        var token = AuthService.getToken();

        ApiService.createProject(token, project.name, project.description)
        .then(
            function success(response) {
                $state.go('projects');
            },
            function error(response) {
                console.log(response);
            }
        );
    }

    // Run on page load
    if (AuthService.getToken() == null) {
        AuthService.redirect();
    }
});
