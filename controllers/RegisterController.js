'use strict';

angular.module('tangram').controller('RegisterController', function($scope, $state, ApiService) {
    $scope.user = {};

    $scope.register = function() {
        console.log('register');
    }

});
