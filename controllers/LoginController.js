'use strict';

angular.module('tangram').controller('LoginController', function($scope, $state, ApiService, AuthService) {
    $scope.user = {};
    $scope.badLogin;
    $scope.checkRegister = false;

    $scope.login = function() {
        $scope.badLogin = false;
        ApiService.login($scope.user.email, $scope.user.password)
        .then(
            function success(response) {
                // Store the JSONWebToken in the AuthenticationService for later use
                AuthService.addToken(response.data.token);
                // Send the user to the launchpad
                $state.go('home', {}, {reload: true});
            },
            function error(response) {
                console.log("Not allowed");
                $scope.badLogin = true;
            }
        );
    }

    $scope.switchView = function() {
        $scope.checkRegister = !$scope.checkRegister;
    }

});
