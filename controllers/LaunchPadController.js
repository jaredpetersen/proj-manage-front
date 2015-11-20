'use strict';

angular.module('tangram').controller('LaunchPadController', function($scope, $http, ApiService) {

    var loadData = function() {
        // Kanban Board
        $scope.backlog = [];
        $scope.inprogress = [];
        $scope.complete = [];

        // Projects list
        $scope.projects = [];

        ApiService.getTasks().then(function(taskResponse) {
            var tasks = taskResponse.data;

            // Perform an application-level join to get the name of the project
            angular.forEach(tasks, function(task, key) {
                ApiService.getSingleProject(task.project).then(function(projectResponse) {
                    task.projectName = projectResponse.data.name;
                    console.log(projectResponse);

                    // TODO Better column filtering
                    if (task.description == 'Task 1 Description') {
                        $scope.backlog.push(task);
                    }
                    else {
                        $scope.inprogress.push(task);
                    }
                });
            });
        });

        ApiService.getProjects().then(function(response) {
            $scope.projects = response.data;
        });
    }

    loadData();

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
