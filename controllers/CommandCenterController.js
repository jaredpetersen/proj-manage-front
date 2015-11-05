'use strict';

angular.module('tangram').controller('CommandCenterController', function($scope) {
    // 3 kanban lists
    $scope.backlog = [
        {title: "Task Title", project: "Project A", due: "11/13/2015"},
        {title: "Task Title", project: "Project B", due: "11/14/2015"},
        {title: "Task Title", project: "Project C", due: "11/17/2015"},
        {title: "Task Title", project: "Project B", due: "11/20/2015"}
    ];

    $scope.inprogress = [
        {title: "Task Title", project: "Project A", due: "11/11/2015"}
    ];

    $scope.complete = [
        {title: "Task Title", project: "Project A", due: "11/10/2015"},
        {title: "Task Title", project: "Project B", due: "11/05/2015"}
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
});
