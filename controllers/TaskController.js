'use strict';

angular.module('tangram').controller('TaskController', function($scope, $stateParams) {
    // create a message to display in our view
    $scope.message = 'This is the task page. Controlled by the TaskController';
    $scope.id = $stateParams.id;
});
