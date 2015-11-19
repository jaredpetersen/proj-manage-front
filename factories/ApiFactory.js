'use strict';

angular.module('tangram').factory('ApiFactory', function($http) {
    var urlBase = '/api/customers';
    var apiFactory = {};

    // Grab all of the tasks
    apiFactory.getTasks = function() {
        // Kanban Columns
        var kanban = {
            backlog: [],
            inprogress: [],
            complete: []
        }

        // Tasks without project data (project name)
        var tasks = [];

        $http.get("http://api.tangr.am/tasks")
        .then(function(taskResponse) {
            var tasks = taskResponse.data;

            // Loop over all of the tasks and grab the project name for each one
            // (Application-level join)
            angular.forEach(tasks, function(task, key) {
                $http.get("http://api.tangr.am/projects/" + task.project)
                .then(function(projectResponse) {
                    // Add name of project to the task object
                    task.projectName = projectResponse.data.name;
                    // TODO Perform sorting based on task status
                    if (task.description == 'Task 1 Description') {
                        kanban.backlog.push(task);
                    }
                    else {
                        kanban.inprogress.push(task);
                    }

                });
            });
        });

        return kanban;
    }

    apiFactory.getProjects = function() {
        var projects = [];

        console.log(projects);
        return projects;
    }

    return apiFactory;
});
