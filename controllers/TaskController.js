'use strict';

angular.module('tangram').controller('TaskController', function($scope, $rootScope, $stateParams, ApiService, AuthService) {

    // API JSONWebToken
    var token = AuthService.getToken();
    $scope.task = {}

    var loadData = function() {
        ApiService.getSingleTask(token, $stateParams.id).then (
            function success(response) {
                $scope.task = response.data;
                console.log(response.data);
                // Update page title
                $rootScope.pageTitle = response.data.name;
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
        $rootScope.pageTitle = 'task';
        loadData();
    }

    // Connect/enable the drag and drop lists
    $scope.sortableOptions = {
        connectWith: '.kanban',
        stop: function(e, ui) {
            var item = ui.item.sortable.model;
            var fromIndex = ui.item.sortable.index;
            var toIndex = ui.item.sortable.dropindex;
            if (ui.item.sortable.droptarget != undefined) {
                // Subtask was moved
                var dropTarget = ui.item.sortable.droptarget[0].id;
                //console.log(item, fromIndex, toIndex, dropTarget);
                changeStatus(item, dropTarget);
            }
        }
    };

});
