'use strict';

angular.module('tangram').controller('SingleProjectController', function($scope, $rootScope, $state, $stateParams, ApiService, AuthService) {

    // Task Information
    $scope.backlogCount = 0;
    $scope.inprogressCount = 0;
    $scope.completeCount = 0;

    // Project Information
    $scope.project = {};
    $scope.projectId = $stateParams.id;

    // Giant line chart data
    $scope.lineData = {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        series: [
            [],
            [],
            []
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
        // Grab information about the project
        ApiService.getSingleProject(AuthService.getToken(), $scope.projectId).then(
            function success(projectResponse) {
                $scope.project = projectResponse.data;

                // Set the page title
                $rootScope.pageTitle = projectResponse.data.name + ' - Metrics';

                // Grab the project data for the charts
                ApiService.getSingleProjectCharts(AuthService.getToken(), $scope.projectId).then(
                    function success(chartResponse) {
                        console.log(chartResponse.data.historical_status);

                        // Going to do a seven day chart

                        // Set up the actual date values
                        var weekdays = [];

                        // Set up the labels
                        // Clear out the existing labels
                        $scope.lineData.labels = [];
                        var i; // Iterator for the seven day period
                        for (i = 6; i >= 0; i--) {
                            // Get the day
                            var dayBefore = moment().utc().subtract(i, 'days').startOf('day');
                            // Add it to our date range
                            weekdays.push(dayBefore);
                            // Format the date as a nice string and add it to the labels
                            $scope.lineData.labels.push(dayBefore.format("MM/DD"));
                        }

                        // Chart data
                        var seriesIter;
                        for (seriesIter = 0; seriesIter < 3; seriesIter++) {
                            // Get the proper data for the series
                            var chartResponseSeries;
                            if (seriesIter == 0) chartResponseSeries = chartResponse.data.historical_status.backlog;
                            else if (seriesIter == 1) chartResponseSeries = chartResponse.data.historical_status['in-progress'];
                            else chartResponseSeries = chartResponse.data.historical_status.complete;

                            // Loop over the days of the week
                            $scope.lineData.series[seriesIter] = [];
                            var backlogDayCount;
                            for (backlogDayCount = 0; backlogDayCount <= 6; backlogDayCount++) {

                                var taskDayIter;
                                var chartTaskHistoryLength = chartResponseSeries.length;
                                for (taskDayIter = 0; taskDayIter < chartTaskHistoryLength; taskDayIter++) {
                                    var taskDay = moment(chartResponseSeries[taskDayIter]._id).utc();
                                    if (taskDay.isSame(weekdays[backlogDayCount])) {
                                        $scope.lineData.series[seriesIter].push(chartResponseSeries[taskDayIter].total);
                                        break;
                                    }
                                    else if (taskDay > weekdays[backlogDayCount]) {
                                        // Too far, use the total from the previous
                                        if (taskDayIter == 0) {
                                            $scope.lineData.series[seriesIter].push(chartResponseSeries[taskDayIter].total);
                                        }
                                        else {
                                            $scope.lineData.series[seriesIter].push(chartResponseSeries[taskDayIter - 1].total);
                                        }
                                        break;
                                    }
                                    else {
                                        if (taskDayIter == chartTaskHistoryLength - 1) {
                                            $scope.lineData.series[seriesIter].push(chartResponseSeries[taskDayIter].total);
                                        }
                                    }
                                }
                            }
                        }

                        // Make sure the task counts are accurate
                        $scope.backlogCount = $scope.lineData.series[0][$scope.lineData.series[0].length - 1];
                        $scope.inprogressCount = $scope.lineData.series[1][$scope.lineData.series[1].length - 1];
                        $scope.completeCount = $scope.lineData.series[2][$scope.lineData.series[2].length - 1];
                    },
                    function error(chartResponse) {
                        console.log(chartResponse);
                    }
                );

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
            function error(response) { console.log(response); }
        );
    }

    // Delete the specified project
    $scope.deleteProject = function(projectID) {
        ApiService.deleteProject(AuthService.getToken(), projectID)
        .then(
            function success(response) {
                $state.go('projects', {}, {reload: true});
            },
            function error(response) { console.log(response); }
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
