'use strict';

angular.module('tangram').controller('NewProjectController', function($scope, ApiService, AuthService) {

    var createProject = function(project) {
        // API JSONWebToken
        var token = AuthService.getToken();

        ApiService.createProject(token)
        .then(
            function success(response) {
                $scope.projects = response.data;
            },
            function error(error) {
                console.log(error);
            }
        );
    }

    // Run on page load
    if (AuthService.getToken() == null) {
        AuthService.redirect();
    }
});
