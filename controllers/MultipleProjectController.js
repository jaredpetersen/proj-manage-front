'use strict';

angular.module('tangram').controller('MultipleProjectController', function($scope, $stateParams) {
    // create a message to display in our view
    $scope.message = 'This is the task page. Controlled by the MultipleProjectController';
    $scope.id = $stateParams.id;
});
