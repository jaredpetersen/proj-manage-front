'use strict';

angular.module('tangram').factory('ApiService', function($http, $q) {
    var baseURL = 'http://api.tangr.am';
    var apiFactory = {};

    // Get all projects
    apiFactory.getTasks = function(token) {
        return $http.get(baseURL + '/tasks', {headers: {'x-access-token': token}});
    }

    // Get all projects
    apiFactory.getProjects = function(token) {
        return $http.get(baseURL + '/projects', {headers: {'x-access-token': token}});
    }

    // Get a single project
    apiFactory.getSingleProject = function(id) {
        return $http.get(baseURL + '/projects/' + id);
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
