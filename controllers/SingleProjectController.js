'use strict';

angular.module('tangram').controller('ProjectController', function($scope, $stateParams) {
    // create a message to display in our view
    $scope.message = '';
    $scope.id = $stateParams.id;
});
