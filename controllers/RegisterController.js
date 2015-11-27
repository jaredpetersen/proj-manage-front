'use strict';

angular.module('tangram').controller('RegisterController', function($scope, $state, ApiService) {

    $scope.register = function(user) {
        console.log('register');
        if (user.password1 == user.password2) {
            ApiService.register(user.firstName, user.lastName, user.email, user.password1)
            .then(
                function success(response) {
                    // Send the user to the launchpad
                    $state.go('login', {}, {reload: true});
                },
                function error(response) {
                    console.log("Account not created");
                }
            );
        }
        else {
            console.log("Passwords do not match");
        }

    }

});
