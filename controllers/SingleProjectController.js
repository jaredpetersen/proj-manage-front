'use strict';

angular.module('tangram').controller('SingleProjectController', function($scope, $rootScope, $stateParams, ApiService, AuthService) {

    // Task Information
    $scope.backlogCount = 0;
    $scope.inprogressCount = 0;
    $scope.completeCount = 0;

    // Project Information
    $scope.project;
    $scope.projectId = $stateParams.id;

    // Giant line chart data
    $scope.lineData = {
        labels: ['12/01', '12/02', '12/03', '12/04', '12/05', '12/06', '12/07'],
        series: [
            [7, 4, 10, 6, 10, 5, 12],
            [10, 1, 4, 3, 5, 0, 1],
            [0, 5, 6, 9, 11, 13, 15]
        ]
    };

    // Giant line chart configuration
    $scope.lineOptions = {
        fullWidth: true,
        height: 350,
        chartPadding: {
            left: 10,
            right: 21
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
        // API JSONWebToken
        var token = AuthService.getToken();

        // Project information
        $scope.project = {};

        // Grab information about the project
        ApiService.getSingleProject(token, $scope.projectId)
        .then(
            function success(projectResponse) {
                $scope.project = projectResponse.data;
                $rootScope.pageTitle = projectResponse.data.name;

                // Grab the project owner name
                ApiService.getUser(projectResponse.data.owner).then (
                    function success(ownerResponse) {
                        $scope.project.ownerName = ownerResponse.data.first_name + ' ' + ownerResponse.data.last_name;
                    },
                    function error(ownerResponse) {
                        console.log(ownerResponse);
                    }
                );

                // Grab the project member names
                angular.forEach(projectResponse.data.members, function(member, key) {
                    // Add the member name to the list
                    $scope.project.memberNames = [];

                    ApiService.getUser(projectResponse.data.owner).then (
                        function success(memberResponse) {
                            $scope.project.memberNames.push(memberResponse.data.first_name + ' ' + memberResponse.data.last_name);
                        },
                        function error(memberResponse) {
                            console.log(memberResponse);
                        }
                    );
                });
            },
            function error(response) {
                console.log(response);
            }
        );

        // Grab all the project tasks
        ApiService.getProjectTasks(token, $scope.projectId)
        .then(
            function success(response) {
                // Count the number of tasks up
                angular.forEach(response.data, function(task, key) {
                    if (task.status == 'backlog') {
                        $scope.backlogCount++;
                    }
                    else if (task.status == 'in-progress') {
                        $scope.inprogressCount++;
                    }
                    else {
                        $scope.completeCount++;
                    }
                });
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
        loadData();
    }
});
