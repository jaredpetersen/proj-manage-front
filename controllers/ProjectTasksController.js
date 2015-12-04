'use strict';

angular.module('tangram').controller('ProjectTasksController', function($scope, $stateParams, ApiService, AuthService) {

    $scope.newTaskState = false;

    var loadData = function() {
        // Kanban Board
        $scope.backlog = [];
        $scope.inprogress = [];
        $scope.complete = [];

        // API JSONWebToken
        var token = AuthService.getToken();
        // Project ID
        var id = $stateParams.id;

        ApiService.getProjectTasks(token, id).then(function(taskResponse) {
            var tasks = taskResponse.data;

            angular.forEach(tasks, function(task, key) {
                if (task.status == 'backlog') {
                    $scope.backlog.push(task);
                }
                else if (task.status == 'inprogress') {
                    $scope.inprogress.push(task);
                }
                else {
                    $scope.complete.push(task);
                }
            });
        });
    }

    $scope.switchNewTaskState = function() {
        if ($scope.newTaskState == true) $scope.newTaskState = false;
        else $scope.newTaskState = true;
    }

    $scope.addTask = function(newTask) {
        var token = AuthService.getToken();

        ApiService.createTask(token, newTask.name, newTask.description, $stateParams.id)
        .then(
            function success(response) {
                console.log(response);
                loadData();
                $scope.switchNewTaskState();
            },
            function error(error) {
                console.log(error);
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
                console.log(item, fromIndex, toIndex, dropTarget);
                // TODO: Update the task with the new location in the list and new status
            }
        }
    };
});
