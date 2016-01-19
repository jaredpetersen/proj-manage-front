'use strict';

angular.module('tangram').controller('RegisterController', function($scope, $state, ApiService) {

    // Register the user
    $scope.register = function(user) {
        // Make sure both passwords match
        if (user.password1 == user.password2) {
            // Make the registration API call
            ApiService.register(user.firstName, user.lastName, user.email, user.password1)
            .then(
                function success(response) {
                    // Send the user to the launchpad
                    $state.go('login', {}, {reload: true});
                },
                function error(response) { console.log("Account not created"); }
            );
        }
        // Bro, your passwords don't match.
        else { console.log("Passwords do not match"); }
    }

});
