'use strict';

angular.module('tangram').controller('TaskController', function($scope, $stateParams, ApiService, AuthService) {

    // API JSONWebToken
    var token = AuthService.getToken();
    $scope.task = {}

    var loadData = function() {
        ApiService.getTask(token).then (
            function success(response) {
                $scope.task = response.data;
            },
            function error(response) {
                console.log(response);
            }
        );
    }

    // Run on page load
    console.log(AuthService.getToken() == null);
    if (AuthService.getToken() == null) {
        AuthService.redirect();
    }
    else {
        loadData();
    }

});
