'use strict';

angular.module('tangram').controller('MultipleProjectController', function($scope, $rootScope, ApiService, AuthService) {
    // Project Information
    $scope.projects = [];

    // Indicates when the new project window is up
    $scope.newProjectState = false;
    // New project data
    $scope.newProject = {};

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

    $scope.switchNewProjectState = function() {
        if ($scope.newProjectState == true) {
            // Hide new project window
            $scope.newProjectState = false;
        }
        else {
            // Display new project window
            $scope.newProjectState = true;
        }
    }

    // Create a new project
    $scope.createProject = function(newProject) {
        ApiService.createProject(AuthService.getToken(), newProject.name, newProject.description)
        .then(
            function success(response) {
                loadData();
                // Reset new project dialog
                $scope.newProject = null;
                $scope.newProjectState = false;
            },
            function error(response) {
                console.log(response);
            }
        );
    }

    // Delete the specified project
    $scope.deleteProject = function(projectID) {
        ApiService.deleteProject(AuthService.getToken(), projectID)
        .then(
            function success(response) {
                loadData();
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
