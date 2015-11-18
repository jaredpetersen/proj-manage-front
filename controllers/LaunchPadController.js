'use strict';

angular.module('tangram').controller('LaunchPadController', function($scope, $http, ApiFactory) {
    // Kanban Board
    $scope.backlog = [];
    $scope.inprogress = [];
    $scope.complete = [];

    // Projects list
    $scope.projects = [
        {_id: "user", title: "Project 1"},
        {_id: "user", title: "Project 2"},
        {_id: "user", title: "Project 3"},
        {_id: "user", title: "Project 4"},
        {_id: "user", title: "Project 5"},
        {_id: "user", title: "Project 6"},
        {_id: "user", title: "Project 7"}
    ];

    function getTasks() {
        // Grab all tasks
        var tasks = [];    // Task without project data

        $http.get("http://api.tangr.am/tasks")
        .then(function(taskResponse) {
            var tasks = taskResponse.data;

            // Loop over all of the tasks and grab the project name for each one
            // (Application-level join)
            angular.forEach(tasks, function(task, key) {
                $http.get("http://api.tangr.am/projects/" + task.project)
                .then(function(projectResponse) {
                    task.projectName = projectResponse.data.name;
                    // TODO Perform sorting based on task status
                    if (task.description == 'Task 1 Description') {
                        $scope.backlog.push(task);
                    }
                    else {
                        $scope.inprogress.push(task);
                    }

                });
            });
        });
    }

    // Get the tasks from the api
    if ($scope.backlog.length == 0) {
        getTasks();
        ApiFactory.getTest();
    }
    else {
        console.log("bad news");
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
