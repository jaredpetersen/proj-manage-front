'use strict';

angular.module('tangram').controller('ProjectTasksController', function($scope, $rootScope, $stateParams, $filter, ApiService, AuthService) {

    // Indicates when the new task window is up
    $scope.newTaskState = false;

    // Kanban tasks by column
    $scope.backlog = [];
    $scope.inprogress = [];
    $scope.complete = [];

    // Set up options for the datepicker
    $scope.datepicker = {options: {defaultDate: null, format: 'MM/DD/YYYY'}};

    // Loads data for the view
    var loadData = function() {
        // Clear out the tasks
        $scope.backlog = [];
        $scope.inprogress = [];
        $scope.complete = [];

        // Grab the project ID from the URL for API calls
        var id = $stateParams.id;

        // Grab the project name
        ApiService.getSingleProject(AuthService.getToken(), id)
        .then(
            function success(projectResponse) {
                // Set up the page title
                $rootScope.pageTitle = projectResponse.data.name + ' - Tasks';

                // Grab all the tasks for the project
                ApiService.getProjectTasks(AuthService.getToken(), id).then(function(taskResponse) {
                    // Grab all of the tasks for sorting
                    var tasks = taskResponse.data;

                    // Iterate over each of the tasks
                    angular.forEach(tasks, function(task, key) {
                        // Add the tasks to the proper status columns
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

                // Grab the project members for the edit dialog
                $scope.members = []
                angular.forEach(projectResponse.data.members, function(member, key) {
                    ApiService.getUser(member).then (
                        function success(memberResponse) {
                            $scope.members.push(
                                {'full_name': memberResponse.data.first_name + ' ' + memberResponse.data.last_name,
                                 '_id': memberResponse.data._id});
                        },
                        function error(memberResponse) { console.log(memberResponse); }
                    );
                });
            },
            function error(projectResponse) { console.log(projectResponse); }
        );
    }

    // Update the task status - activated when the task is moved to a column
    var changeStatus = function(task, newStatus) {
        ApiService.updateTaskStatus(AuthService.getToken(), task._id, newStatus)
        .then (
            function success(response) {},
            function error(response) { console.log(response); }
        );
    }

    // Switch the new task dialog box to visible/invisible
    $scope.switchNewTaskState = function(status) {
        if ($scope.newTaskState == true) {
            $scope.newTaskState = false;
            angular.element('#backlog').css('min-height', '60px');
        }
        else {
            $scope.newTaskState = true;
            angular.element('#backlog').css('min-height', '0px');
        }
    }

    // Add a new task to backlog
    $scope.addTask = function(newTask) {
        // Convert the date to something the API likes -- have to make time = 0 because of a bug in the form
        console.log(newTask.due);
        if (newTask.due === undefined) {
            var due = null;
        }
        else {
            var due = $filter('date')(newTask.due._d, "yyyy-MM-dd'T'00:00:00.000'Z'");
        }

        ApiService.createTask(AuthService.getToken(), newTask.name, newTask.description, due, newTask.owner, $stateParams.id)
        .then(
            function success(response) {
                // Reload all of the tasks
                loadData();
                // Clear out the new task text boxes
                $scope.newTaskState = false;
                $scope.newTask = null;
                angular.element('#backlog').css('min-height', '60px');

            },
            function error(response) { console.log(response); }
        );
    }

    // Remove the task -- activated by delete button in view
    $scope.deleteTask = function(taskID) {
        ApiService.deleteTask(AuthService.getToken(), taskID)
        .then (
            function success(response) { loadData(); },
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

    // Connect/enable the drag and drop kanban columns
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
