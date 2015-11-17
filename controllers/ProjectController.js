'use strict';

angular.module('tangram').controller('ProjectController', function($scope, $stateParams) {
    // create a message to display in our view
    $scope.message = 'This is the project page. Controlled by the ProjectController';
    $scope.id = $stateParams.id;
});
