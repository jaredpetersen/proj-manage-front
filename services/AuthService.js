'use strict';

angular.module('tangram').factory('AuthService', function($state) {
    var jsonWebToken;
    var authFactory = {};

    // Store the token
    authFactory.storeToken = function(token) {
        jsonWebToken = token;
    }

    // Return the token
    authFactory.getToken = function() {
        return jsonWebToken;
    }

    // Redirect back to login page
    authFactory.redirect = function() {
        $state.go('login', {}, {reload: true});
    }

    // Logout
    authFactory.clearToken = function() {
        jsonWebToken = null;
    }

    return authFactory;
});
