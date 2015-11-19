'use strict';

angular.module('tangram').controller('LaunchPadController', function($scope, $http, ApiFactory) {
    // Kanban Board
    $scope.backlog = [];
    $scope.inprogress = [];
    $scope.complete = [];

    // Projects list
    $scope.projects = [];

    // Get the tasks and projects from the API
    if ($scope.backlog.length == 0) {
        var kanban = ApiFactory.getTasks();
        $scope.backlog = kanban.backlog;
        $scope.inprogress = kanban.inprogress;
        $scope.complete = kanban.complete;

        $scope.projects = ApiFactory.getProjects();
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
