'use strict';

angular.module('tangram').controller('NavbarController', function($scope, $state, AuthService) {
    // Log the user out
    $scope.logout = function() {
        // Remove the token/cookie from the auth service
        AuthService.clearToken();
        // Kick the user out
        AuthService.redirect();
    }
});
