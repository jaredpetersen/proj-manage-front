'use strict';

var app = angular.module('tangram', ['ui.router', 'ui.sortable']);

// Configure our routes
app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider

        // route for the home/commandcenter
        .state('home', {
            url: '/',
            templateUrl : 'views/launchpad.html',
            controller  : 'LaunchPadController'
        })

        // route for the individual project page
        .state('project', {
            url: '/projects/:id',
            templateUrl : 'views/project.html',
            controller  : 'ProjectController'
        })

        // route for the individual task page
        .state('task', {
            url: '/tasks/:id',
            templateUrl : 'views/task.html',
            controller  : 'TaskController'
        })

        // route for the user page
        .state('user', {
            url: '/settings',
            templateUrl : 'views/user.html',
            controller  : 'UserController'
        });

    // Removes the # from the URL
    $locationProvider.html5Mode(true);
});
