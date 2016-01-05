'use strict';

angular.module('tangram').controller('OverviewController', function($scope, $rootScope, $state, ApiService, AuthService) {

    // API JSONWebToken
    var token = AuthService.getToken();

    // Loads data for the view
    var loadData = function() {
        // Kanban tasks by column
        $scope.backlog = [];
        $scope.inprogress = [];
        $scope.complete = [];

        // Grab all of the tasks the user owns
        ApiService.getTasks(token).then(function(taskResponse) {
            // Grab all of the tasks for sorting
            var tasks = taskResponse.data;

            // Iterate over all of the tasks and grab the project information for each
            angular.forEach(tasks, function(task, key) {
                // Grab the project information
                ApiService.getSingleProject(token, task.project).then(function(projectResponse) {
                    // Add the project name to the task and leave the rest alone
                    task.projectName = projectResponse.data.name;

                    // Add the task to the proper status columns
                    if (task.status == 'backlog') {
                        $scope.backlog.push(task);
                    }
                    else if (task.status == 'in-progress') {
                        $scope.inprogress.push(task);
                    }
                    else {
                        $scope.complete.push(task);
                    }
                });
            });
        });
    }

    // Update the task status - activated when the task is moved to a column
    var changeStatus = function(task, newStatus) {
        ApiService.updateTaskStatus(AuthService.getToken(), task._id, newStatus)
        .then (
            function success(response) {},
            function error(response) {
                console.log(response);
            }
        );
    }

    // Remove the task -- activated by delete button in view
    $scope.deleteTask = function(taskID) {
        ApiService.deleteTask(AuthService.getToken(), taskID)
        .then (
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
        $rootScope.pageTitle = 'overview';
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
                // Task was moved
                var dropTarget = ui.item.sortable.droptarget[0].id;
                //console.log(item, fromIndex, toIndex, dropTarget);
                changeStatus(item, dropTarget);
            }
        }
    };
});
