'use strict';

angular.module('tangram').controller('TaskController', function($scope, $rootScope, $stateParams, ApiService, AuthService) {

    // Contains information on the task
    $scope.task = {};

    // List of all of the members associated with the project's task
    $scope.members = [];

    // Indicates when the edit details window is up
    $scope.editTaskDetailsState = false;
    // Indicates when the edit description window is up
    $scope.editTaskDescriptionState = false;
    // Edit task data
    $scope.editTask = {};

    // Indicates when the new subtask window is up
    $scope.newSubtaskState = false;

    // The CSS class for the status banner
    $scope.statusCSS;

    var loadData = function() {
        // API JSONWebToken
        var token = AuthService.getToken();

        // Grab the task information
        ApiService.getSingleTask(token, $stateParams.id).then (
            function success(response) {
                // Send task information to the view
                $scope.task = response.data;

                // Update page title
                $rootScope.pageTitle = response.data.name;

                // Grab all the subtasks for the task
                ApiService.getTaskSubtasks(token, response.data.project, $scope.task._id).then (
                    function success(subtaskResponse) {
                        $scope.task.subtasks = subtaskResponse.data;
                        console.log($scope.task.subtasks);
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
                ApiService.getSingleProject(token, response.data.project).then (
                    function success(projectResponse) {
                        $scope.task.projectName = projectResponse.data.name;

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
    $scope.editTaskDetails = function(status) {
        if ($scope.editTaskDetailsState == true) {
            // API JSONWebToken
            var token = AuthService.getToken();

            // Small fix since you can't have null value in select tags
            var owner = $scope.editTask.owner;
            if (owner == undefined) {
                owner = null;
            }

            // Switching back to view mode, save the data
            ApiService.updateTask(token, $stateParams.id, $scope.task.name, $scope.task.description, owner, $scope.task.project).then (
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

    // Edit task description
    $scope.editTaskDescription = function(status) {
        if ($scope.editTaskDescriptionState == true) {
            // API JSONWebToken
            var token = AuthService.getToken();

            // Small fix since you can't have null value in select tags
            var description = $scope.editTask.description;
            if (description == undefined) {
                description = null;
            }

            // Switching back to view mode, save the data
            ApiService.updateTask(token, $stateParams.id, $scope.task.name, description, $scope.task.owner, $scope.task.project).then (
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
            function error(response) {
                console.log(response);
            }
        );
    }

    // Edit task details
    $scope.deleteSubtask = function(projectID, taskID, subtaskID) {
        ApiService.deleteSubtask(AuthService.getToken(), projectID, taskID, subtaskID)
        .then (
            function success(response) {
                loadData();
            },
            function error(response) {
                console.log(response);
            }
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
