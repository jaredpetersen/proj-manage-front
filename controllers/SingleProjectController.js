'use strict';

angular.module('tangram').controller('SingleProjectController', function($scope, $stateParams, ApiService, AuthService) {
    // create a message to display in our view
    $scope.backlogCount;
    $scope.inprogressCount;
    $scope.completeCount;
    $scope.percentComplete;
    $scope.project;
    $scope.projectId = $stateParams.id;

    var calculatePercentComplete = function(backlog, inprogress, complete) {
        var total = backlog + inprogress + complete;
        return Math.round((complete/total) * 100);
    }

    var loadData = function() {
        // Projects list
        $scope.project = {};

        // API JSONWebToken
        var token = AuthService.getToken();

        ApiService.getSingleProject(token, $scope.projectId)
        .then(
            function success(projectResponse) {
                var project = projectResponse.data;
                var members = projectResponse.data.members;
                project.members = [];
                $scope.project = project;

                angular.forEach(members, function(user, key) {
                    ApiService.getUser(token, user)
                    .then(
                        function success(userResponse) {
                            $scope.project.members.push(userResponse.data);
                        },
                        function error(response) {
                            console.log(response);
                        }
                    );
                });
            },
            function error(response) {
                console.log(response);
            }
        );

        ApiService.getProjectTasks(token,$scope.projectId)
        .then(
            function success(response) {
                var backlogCount = 0;
                var inprogressCount = 0;
                var completeCount = 0;

                angular.forEach(response.data, function(task, key) {
                    if (task.status == 'backlog') {
                        backlogCount++;
                    }
                    else if (task.status == 'in-progress') {
                        inprogressCount++;
                    }
                    else {
                        completeCount++;
                    }
                });

                $scope.percentComplete = calculatePercentComplete(backlogCount, inprogressCount, completeCount);
                $scope.backlogCount = backlogCount;
                $scope.inprogressCount = inprogressCount;
                $scope.completeCount = completeCount;
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
});
