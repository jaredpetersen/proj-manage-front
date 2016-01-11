'use strict';

angular.module('tangram').factory('ApiService', function($http, $q) {
    var baseURL = 'http://api.tangr.am';
    var apiFactory = {};

    // Get all user tasks
    apiFactory.getTasks = function(token) {
        return $http.get(baseURL + '/tasks', {headers: {'x-access-token': token}});
    }

    // Get all tasks for a project
    apiFactory.getProjectTasks = function(token, id) {
        return $http.get(baseURL + '/projects/' + id + '/tasks', {headers: {'x-access-token': token}});
    }

    // Get single task
    apiFactory.getSingleTask = function(token, id) {
        return $http.get(baseURL + '/tasks/' + id, {headers: {'x-access-token': token}});
    }

    // Add new task
    apiFactory.createTask = function(token, name, description, project) {
        return $http.post(baseURL + '/tasks', {'name': name, 'description': description, 'project': project}, {headers: {'x-access-token': token}});
    }

    // Update task -- has to pass all of the data
    apiFactory.updateTask = function(token, id, name, description, owner, project, status) {
        return $http.put(baseURL + '/tasks/' + id, {'name': name, 'description': description, 'owner': owner, 'project': project, 'status': status}, {headers: {'x-access-token': token}});
    }

    // Update task (just status)
    apiFactory.updateTaskStatus = function(token, id, status) {
        return $http.put(baseURL + '/tasks/' + id, {'status': status}, {headers: {'x-access-token': token}});
    }

    // Delete task
    apiFactory.deleteTask = function(token, id, status) {
        return $http.delete(baseURL + '/tasks/' + id, {headers: {'x-access-token': token}});
    }

    // Get all subtasks for a task
    apiFactory.getTaskSubtasks = function(token, pid, tid) {
        return $http.get(baseURL + '/projects/' + pid + '/tasks/' + tid + '/subtasks', {headers: {'x-access-token': token}});
    }

    // Get all projects
    apiFactory.getProjects = function(token) {
        return $http.get(baseURL + '/projects', {headers: {'x-access-token': token}});
    }

    // Get a single project
    apiFactory.getSingleProject = function(token, id) {
        return $http.get(baseURL + '/projects/' + id, {headers: {'x-access-token': token}});
    }

    // Add new project
    apiFactory.createProject = function(token, name, description) {
        return $http.post(baseURL + '/projects', {'name': name, 'description': description}, {headers: {'x-access-token': token}});
    }

    // Delete project
    apiFactory.deleteProject = function(token, id) {
        return $http.delete(baseURL + '/projects/' + id, {headers: {'x-access-token': token}});
    }

    // Get a single user
    apiFactory.getUser = function(id) {
        return $http.get(baseURL + '/users/' + id);
    }

    // Authenticate and get a JSONWebToken
    apiFactory.login = function(email, password) {
        return $http.post(baseURL + '/authenticate', {'email': email, 'password': password});
    }

    // Register an account
    apiFactory.register = function(firstname, lastname, email, password) {
        return $http.post(baseURL + '/users', {'first_name': firstname, 'last_name': lastname, 'email': email, 'password': password});
    }

    return apiFactory;
});
