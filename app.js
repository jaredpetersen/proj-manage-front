'use strict';

var app = angular.module('tangram', ['ui.router', 'ui.sortable']);

// Configure our routes
app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    // Removes the # from the URL
    // Leaving this commented out for development since the Python SimpleHTTPServer
    // is taking over the routing when it shouldn't be:
    // http://stackoverflow.com/questions/24087188/ui-routers-urlrouterprovider-otherwise-with-html5-mode
    // http://stackoverflow.com/a/22362994
    //$locationProvider.html5Mode(true);

    $stateProvider

        .state('common', {
            templateUrl: 'views/common.html',
            abstract: true,
        })

        // route for the login
        .state('login', {
            url: '/',
            templateUrl : 'views/login.html',
            controller  : 'LoginController'
        })

        // route for the home/commandcenter
        .state('home', {
            url: '/launchpad',
            templateUrl : 'views/launchpad.html',
            controller  : 'LaunchPadController',
            parent: 'common'
        })

        // route for the individual project page
        .state('project', {
            url: '/projects/:id',
            templateUrl : 'views/project.html',
            controller  : 'ProjectController',
            parent: 'common'
        })

        // route for the individual task page
        .state('task', {
            url: '/tasks/:id',
            templateUrl : 'views/task.html',
            controller  : 'TaskController',
            parent: 'common'
        })

        // route for the user page
        .state('user', {
            url: '/settings',
            templateUrl : 'views/user.html',
            controller  : 'UserController',
            parent: 'common'
        });

    $urlRouterProvider.otherwise('/');
});
