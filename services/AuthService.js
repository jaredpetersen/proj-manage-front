'use strict';

angular.module('tangram').factory('AuthService', function($state, $cookies) {
    var authFactory = {};

    // Store the token
    authFactory.addToken = function(token) {
        $cookies.put('tangram', token);
    }

    // Return the token
    authFactory.getToken = function() {
        return $cookies.get('tangram');
    }

    // Redirect back to login page
    authFactory.redirect = function() {
        $state.go('login', {}, {reload: true});
    }

    // Logout
    authFactory.clearToken = function() {
        $cookies.remove('tangram');
    }

    return authFactory;
});
