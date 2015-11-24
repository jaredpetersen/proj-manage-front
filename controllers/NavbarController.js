'use strict';

angular.module('tangram').controller('NavbarController', function($scope, AuthService) {
    // create a message to display in our view
    $scope.logout = function() {
        AuthService.clearToken();
        AuthService.redirect();
    }
});
