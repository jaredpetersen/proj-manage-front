'use strict';

angular.module('tangram').controller('NavbarController', function($scope, $state, AuthService) {
    // create a message to display in our view
    $scope.logout = function() {
        AuthService.clearToken();
        AuthService.redirect();
    }

    // Set page title based on state
    if (typeof $state.current.data == 'undefined') {
        $scope.pageTitle = 'tangram'
    }
    else {
        $scope.pageTitle = $state.current.data.pageTitle;
    }
});
