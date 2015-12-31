'use strict';

angular.module('tangram').controller('TaskController', function($scope, $rootScope, $stateParams, ApiService, AuthService) {

    $scope.task = {}

    var loadData = function() {
        // API JSONWebToken
        var token = AuthService.getToken();

        // Grab the task information
        ApiService.getSingleTask(token, $stateParams.id).then (
            function success(response) {
                // Send task information to the view
                $scope.task = response.data;

                // Grab the owner name
                ApiService.getUser(response.data.owner).then (
                    function success(userResponse) {
                        $scope.task.ownerName = userResponse.data.first_name + ' ' + userResponse.data.last_name
                    },
                    function error(userResponse) {
                        console.log(userResponse);
                    }
                );

                // Grab the project name
                ApiService.getSingleProject(token, response.data.project).then (
                    function success(projectResponse) {
                        $scope.task.projectName = projectResponse.data.name;
                    },
                    function error(projectResponse) {
                        console.log(projectResponse);
                    }
                );

                // Update page title
                $rootScope.pageTitle = response.data.name;
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
        $rootScope.pageTitle = 'task';
        loadData();
    }

    // Connect/enable the drag and drop lists
    $scope.sortableOptions = {
        connectWith: '.kanban',
        stop: function(e, ui) {
            var item = ui.item.sortable.model;
            var fromIndex = ui.item.sortable.index;
            var toIndex = ui.item.sortable.dropindex;
            if (ui.item.sortable.droptarget != undefined) {
                // Subtask was moved
                var dropTarget = ui.item.sortable.droptarget[0].id;
                //console.log(item, fromIndex, toIndex, dropTarget);
                changeStatus(item, dropTarget);
            }
        }
    };

});
