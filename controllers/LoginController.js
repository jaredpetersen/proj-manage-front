'use strict';

angular.module('tangram').controller('LoginController', function($scope, $state, ApiService) {
    $scope.user = {};
    $scope.badLogin;

    $scope.login = function() {
        $scope.badLogin = false;
        ApiService.login($scope.user.email, $scope.user.password)
        .then(
            function success(response) {
                $state.go('home', {}, {reload: true});
            },
            function error(response) {
                console.log("Not allowed");
                $scope.badLogin = true;
            }
        );
    }

});
