'use strict';

angular.module('tangram').controller('ProjectTasksController', function($scope, $rootScope, $stateParams, ApiService, AuthService) {

    // Indicates when the new task window is up
    $scope.newTaskState = false;

    // Loads data for the view
    var loadData = function() {
        // API JSONWebToken
        var token = AuthService.getToken();

        // Kanban tasks by column
        $scope.backlog = [];
        $scope.inprogress = [];
        $scope.complete = [];

        // Grab the project ID from the URL for API calls
        var id = $stateParams.id;

        // Grab all the tasks for the project
        ApiService.getProjectTasks(token, id).then(function(taskResponse) {
            // Grab all of the tasks for sorting
            var tasks = taskResponse.data;

            // Add the tasks to the proper status columns
            angular.forEach(tasks, function(task, key) {
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

    // Switch the new task dialog box to visible/invisible
    $scope.switchNewTaskState = function(status) {
        if ($scope.newTaskState == true) $scope.newTaskState = false;
        else $scope.newTaskState = true;
    }

    // Add a new task to backlog
    $scope.addTask = function(newTask) {
        ApiService.createTask(AuthService.getToken(), newTask.name, newTask.description, $stateParams.id)
        .then(
            function success(response) {
                // Reload all of the tasks
                loadData();
                $scope.newTask = null;
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
        $rootScope.pageTitle = 'project kanban';
        loadData();
    }

    // Connect/enable the drag and drop kanban columns
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
