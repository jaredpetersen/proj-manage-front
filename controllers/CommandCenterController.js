'use strict';

angular.module('tangram').controller('CommandCenterController', function($scope) {
    // Kanban lists
    $scope.backlog = [
        {id: 1, title: "Task Title 1", project: "Project A", due: "11/13/2015"},
        {id: 2, title: "Task Title 2", project: "Project B", due: "11/14/2015"},
        {id: 3, title: "Task Title 3", project: "Project C", due: "11/17/2015"},
        {id: 4, title: "Task Title 4", project: "Project B", due: "11/20/2015"}
    ];

    $scope.inprogress = [
        {id: 5, title: "Task Title 5", project: "Project A", due: "11/11/2015"}
    ];

    $scope.complete = [
        {id: 6, title: "Task Title 6", project: "Project A", due: "11/10/2015"},
        {id: 7, title: "Task Title 7", project: "Project B", due: "11/05/2015"}
    ];

    // Activity list
    $scope.activities = [
        {title: "Sally added a new task"},
        {title: "Task Title marked as complete"},
        {title: "Task Title due date changed"},
        {title: "More . . ."},
    ]

    // Projects list
    $scope.projects = [
        {title: "Project A"},
        {title: "Project B"},
        {title: "Project C"},
        {title: "More . . ."},
    ];

    // Connect the drag and drop lists
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
