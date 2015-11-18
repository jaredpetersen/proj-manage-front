'use strict';

angular.module('tangram').factory('ApiFactory', function($http) {
    var urlBase = '/api/customers';
    var apiFactory = {};

    apiFactory.getTest = function() {
      console.log("FactoryTest");
    }

    return apiFactory;
});
