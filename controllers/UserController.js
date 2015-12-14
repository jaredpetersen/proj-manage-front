'use strict';

angular.module('tangram').controller('UserController', function($scope, $rootScope) {
    // create a message to display in our view
    $scope.message = 'This is the user page. Controlled by the UserController.';
    $rootScope.pageTitle = 'settings'
});
