'use strict';

angular.module('tangram').controller('LaunchPadController', function($scope, $state, ApiService, AuthService) {

    // API JSONWebToken
    var token = AuthService.getToken();

    var loadData = function() {
        // Kanban Board
        $scope.backlog = [];
        $scope.inprogress = [];
        $scope.complete = [];

        ApiService.getTasks(token).then(function(taskResponse) {
            var tasks = taskResponse.data;

            // Perform an application-level join to get the name of the project
            angular.forEach(tasks, function(task, key) {
                ApiService.getSingleProject(token, task.project).then(function(projectResponse) {
                    task.projectName = projectResponse.data.name;

                    // TODO Better column filtering
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

    var changeStatus = function(task, newStatus) {
        ApiService.updateTaskStatus(token, task._id, newStatus)
        .then (
            function success(response) {},
            function error(response) {
                console.log(response);
            }
        );
    }

    $scope.deleteTask = function(taskID) {
        ApiService.deleteTask(token, taskID)
        .then (
            function success(response) {
                // TODO remove the task from the column instead of reloading
                // all of the data all over again
                loadData();
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
