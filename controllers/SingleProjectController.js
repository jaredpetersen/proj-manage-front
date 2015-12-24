'use strict';

angular.module('tangram').controller('SingleProjectController', function($scope, $rootScope, $stateParams, ApiService, AuthService) {

    // Authorization token
    var token = AuthService.getToken();

    // Task Information
    $scope.backlog = [];
    $scope.inprogress = [];
    $scope.complete = [];

    // Project Information
    $scope.project;
    $scope.projectId = $stateParams.id;

    // Giant line chart
    $scope.lineData = {
        labels: ['12/01', '12/02', '12/03', '12/04', '12/05', '12/06', '12/07'],
        series: [
            [7, 4, 10, 6, 10, 5, 12],
            [10, 1, 4, 3, 5, 0, 1],
            [0, 5, 6, 9, 11, 13, 15]
        ]
    };
    $scope.lineOptions = {
        fullWidth: true,
        height: 275,
        chartPadding: {
            left: 0,
            right: 11
        },
        axisY: {
            onlyInteger: true,
            offset: 20,
            labelOffset: {
                x: 0,
                y: 4
           }
        },
        axisX: {
            labelOffset: {
                x: -10,
                y: 0
           }
       },
       lineSmooth: false
    };

    // Grab data from the API to populate the view
    var loadData = function() {
        // Project information
        $scope.project = {};

        // Grab information about the project
        ApiService.getSingleProject(token, $scope.projectId)
        .then(
            function success(projectResponse) {
                $scope.project = projectResponse.data;
                $rootScope.pageTitle = project.name;
            },
            function error(response) {
                console.log(response);
            }
        );

        // Grab all the project tasks
        ApiService.getProjectTasks(token,$scope.projectId)
        .then(
            function success(response) {
                // Iterate over the tasks
                angular.forEach(response.data, function(task, key) {
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
            },
            function error(response) {
                console.log(response);
            }
        );
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

    $scope.switchNewTaskState = function(status) {
        if ($scope.newTaskState == true) $scope.newTaskState = false;
        else $scope.newTaskState = true;
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
                console.log('test');
                changeStatus(item, dropTarget);
            }
        }
    };
});
