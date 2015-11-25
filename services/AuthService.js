'use strict';

angular.module('tangram').factory('AuthService', function($state, $cookies) {
    var authFactory = {};

    // Store the token
    authFactory.addToken = function(token) {
        $cookies.put('tangram', token);
    }

    // Get the token
    authFactory.getToken = function() {
        return $cookies.get('tangram');
    }

    // Logout
    authFactory.clearToken = function() {
        $cookies.remove('tangram');
    }

    // Redirect back to login page
    authFactory.redirect = function() {
        $state.go('login', {}, {reload: true});
    }

    return authFactory;
});
