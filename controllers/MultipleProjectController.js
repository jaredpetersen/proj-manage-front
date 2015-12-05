'use strict';

angular.module('tangram').controller('MultipleProjectController', function($scope, ApiService, AuthService) {
    // create a message to display in our view
    $scope.message = 'This is the project page. Controlled by the MultipleProjectController';
    $scope.projects = [];

    var loadData = function() {
        // API JSONWebToken
        var token = AuthService.getToken();

        ApiService.getProjects(token)
        .then(
            function success(response) {
                $scope.projects = response.data;
            },
            function error(response) {
                console.log(response);
            }
        );
    }

    // Run on page load
    console.log(AuthService.getToken() == null);
    if (AuthService.getToken() == null) {
        AuthService.redirect();
    }
    else {
        loadData();
    }
});
