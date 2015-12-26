'use strict';

angular.module('tangram').controller('MultipleProjectController', function($scope, $rootScope, ApiService, AuthService) {
    // Project Information
    $scope.projects = [];

    // Loads data for the view
    var loadData = function() {
        // Grab all of the projects the user belongs to
        ApiService.getProjects(AuthService.getToken())
        .then(
            function success(response) {
                $scope.projects = response.data;
            },
            function error(response) {
                console.log(response);
            }
        );
    }

    // Grab the authentication token from the auth service
    if (AuthService.getToken() == null) {
        // Not authenticated, kick them out
        AuthService.redirect();
    }
    else {
        // The user is authenticated, proceed to load data
        $rootScope.pageTitle = 'projects';
        loadData();
    }
});
