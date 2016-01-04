'use strict';

angular.module('tangram').controller('TaskController', function($scope, $rootScope, $stateParams, ApiService, AuthService) {

    // Contains information on the task
    $scope.task = {};

    // List of all of the members associated with the project's task
    $scope.members = [];

    // Indicates when the edit window is up
    $scope.editTaskState = false;
    // Edit task data
    $scope.editTask = {};

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

                // Update the status banner color
                if ($scope.task.status == 'backlog') $scope.statusCSS = 'column-heading-red';
                else if ($scope.task.status == 'in-progress') $scope.statusCSS = 'column-heading-yellow';
                else $scope.statusCSS = 'column-heading-blue';

                // Update page title
                $rootScope.pageTitle = response.data.name;

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

    // Switch the edit task dialog box to visible/invisible
    $scope.switchEditTaskState = function(status) {
        if ($scope.editTaskState == true) {
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
                    // Update complete, switch the edit state and reload data
                    $scope.editTaskState = false;
                    loadData();
                    console.log("update logged");
                },
                function error(updateResponse) {
                    console.log(updateResponse);
                }
            );
        }
        else {
            // Switching to edit mode
            $scope.editTaskState = true;
        }
    }

    // Grab the authentication token from the auth service
    if (AuthService.getToken() == null) {
        // Not authenticated, kick them out
        AuthService.redirect();
    }
    else {
        // The user is authenticated, proceed to load data
        $rootScope.pageTitle = 'task';
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
