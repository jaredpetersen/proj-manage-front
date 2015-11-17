'use strict';

var app = angular.module('tangram', ['ui.router', 'ui.sortable']);

// configure our routes
app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider

        // route for the home page
        .state('home', {
            url: '/',
            templateUrl : 'views/commandcenter.html',
            controller  : 'CommandCenterController'
        })

        // route for the individual project page
        .state('project', {
            url: '/project/:id',
            templateUrl : 'views/project.html',
            controller  : 'ProjectController'
        })

        // route for the individual task page
        .state('task', {
            url: '/task/:id',
            templateUrl : 'views/task.html',
            controller  : 'TaskController'
        })

        // route for the contact page
        .state('contact', {
            url: '/contact',
            templateUrl : 'views/contact.html',
            controller  : 'ContactController'
        });

    // Removes the # from the URL
    $locationProvider.html5Mode(true);
});
