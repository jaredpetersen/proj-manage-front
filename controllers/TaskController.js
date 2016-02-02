'use strict';

angular.module('tangram').controller('TaskController', function($scope, $rootScope, $stateParams, $timeout, $filter, ApiService, AuthService) {

    // Contains information on the task
    $scope.task = {};

    // Indicates when the edit details window is up
    $scope.editTaskDetailsState = false;
    // Indicates when the edit description window is up
    $scope.editTaskDescriptionState = false;
    // Edit task data
    $scope.editTask = {'description': null, 'owner': null, 'due': null};

    // Indicates when the new subtask window is up
    $scope.newSubtaskState = false;

    // Set up options for the datepicker
    $scope.datepicker = {options: {defaultDate: null, format: 'MM/DD/YYYY'}};

    // Loads all of the data from the API
    var loadData = function() {
        // Grab the task information
        ApiService.getSingleTask(AuthService.getToken(), $stateParams.id).then (
            function success(response) {
                // Send task information to the view
                $scope.task = response.data;
                $scope.editTask.description = response.data.description;
                $scope.datepicker.options.defaultDate = response.data.created;

                // Update page title
                $rootScope.pageTitle = response.data.name;

                // Grab all the subtasks for the task
                ApiService.getTaskSubtasks(AuthService.getToken(), response.data.project, $scope.task._id).then (
                    function success(subtaskResponse) {
                        $scope.task.subtasks = subtaskResponse.data;
                    },
                    function error(subtaskResponse) {
                        console.log(subtaskResponse);
                    }
                );

                // Grab the owner name if it has one
                if (response.data.owner) {
                    ApiService.getUser(response.data.owner).then (
                        function success(userResponse) {
                            $scope.task.ownerName = userResponse.data.first_name + ' ' + userResponse.data.last_name
                        },
                        function error(userResponse) {
                            console.log(userResponse);
                        }
                    );
                }

                // Grab the project name and members
                ApiService.getSingleProject(AuthService.getToken(), response.data.project).then (
                    function success(projectResponse) {
                        $scope.task.projectName = projectResponse.data.name;

                        // Clear out the existing members
                        $scope.members = []

                        // Grab the project members for the edit dialog
                        angular.forEach(projectResponse.data.members, function(member, key) {
                            ApiService.getUser(member).then (
                                function success(memberResponse) {
                                    $scope.members.push(
                                        {'full_name': memberResponse.data.first_name + ' ' + memberResponse.data.last_name,
                                         '_id': memberResponse.data._id});
                                },
                                function error(memberResponse) {
                                    console.log(memberResponse);
                                }
                            );
                        });
                    },
                    function error(projectResponse) {
                        console.log(projectResponse);
                    }
                );
            },
            function error(response) {
                console.log(response);
            }
        );
    }

    // Edit task details
    $scope.editTaskDetails = function() {
        if ($scope.editTaskDetailsState == true) {
            // Small fix since you can't have null value in input
            var owner = $scope.editTask.owner;
            if (owner == undefined) owner = null;

            // Convert the date to something the API likes -- have to make time = 0 because of a bug in the form
            if ($scope.editTask.due === null) {
                var due = null;
            }
            else {
                var due = $filter('date')($scope.editTask.due._d, "yyyy-MM-dd'T'00:00:00.000'Z'");
            }

            // Switching back to view mode, save the data
            ApiService.updateTask(AuthService.getToken(), $stateParams.id, $scope.task.name, $scope.task.description, due, owner, $scope.task.project, $scope.task.status).then (
                function success(updateResponse) {
                    // Update complete, switch the edit details state and reload data
                    $scope.editTaskDetailsState = false;
                    loadData();
                },
                function error(updateResponse) {
                    console.log(updateResponse);
                }
            );
        }
        else {
            // Switching to edit mode
            $scope.editTaskDetailsState = true;
        }
    }

    // Switch edit task details back to view
    $scope.hideEditTaskDetails = function() {
        // Switching to view mode
        $scope.editTaskDetailsState = false;
    }

    // Edit task description
    $scope.editTaskDescription = function(status) {
        if ($scope.editTaskDescriptionState == true) {
            // Switching back to view mode, save the data
            ApiService.updateTask(AuthService.getToken(), $stateParams.id, $scope.task.name, $scope.editTask.description, $scope.task.owner, $scope.task.project).then (
                function success(updateResponse) {
                    // Update complete, switch the edit description state and reload data
                    $scope.editTaskDescriptionState = false;
                    loadData();
                },
                function error(updateResponse) {
                    console.log(updateResponse);
                }
            );
        }
        else {
            // Switching to edit mode
            $scope.editTaskDescriptionState = true;
        }
    }

    // Switch the new subtask dialog box to visible/invisible
    $scope.switchNewSubtaskState = function() {
        if ($scope.newSubtaskState == true) $scope.newSubtaskState = false;
        else $scope.newSubtaskState = true;
    }

    // Edit task details
    $scope.addSubtask = function(newSubtask) {
        ApiService.createSubtask(AuthService.getToken(), $scope.task.project, $scope.task._id, newSubtask.name, newSubtask.due)
        .then (
            function success(response) {
                loadData();
                $scope.newSubtaskState = false;
                $scope.newSubtask = null;
            },
            function error(response) { console.log(response); }
        );
    }

    // Edit task details -- Not in use
    $scope.updateSubtaskStatus = function(subtask) {
        // Switch the subtask view state
        if (subtask.status == 'incomplete') subtask.status = 'complete';
        else subtask.status = 'incomplete';

        // Update the subtask
        ApiService.updateSubtaskStatus(AuthService.getToken(), $scope.task.project, $scope.task._id, subtask._id, subtask.status)
        .then (
            function success(response) {},
            function error(response) { console.log(response); }
        );
    }

    // Delete subtask
    $scope.deleteSubtask = function(projectID, taskID, subtaskID) {
        ApiService.deleteSubtask(AuthService.getToken(), projectID, taskID, subtaskID)
        .then (
            function success(response) { loadData(); },
            function error(response) { console.log(response); }
        );
    }

    // Grab the authentication token from the auth service
    if (AuthService.getToken() == null) {
        // Not authenticated, kick them out
        AuthService.redirect();
    }
    else {
        // The user is authenticated, proceed to load data
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
                // Subtask was moved
                var dropTarget = ui.item.sortable.droptarget[0].id;
                //console.log(item, fromIndex, toIndex, dropTarget);
                changeStatus(item, dropTarget);
            }
        }
    };

});
