(function(){
  'use strict';

  /* reference to module */
 angular.module('myApp.transactions.module')

    .controller('transactionsCtrl', [
      '$rootScope',
      '$log',
      '$http',
      '$q',
      '$state',
      '$scope',
      '$timeout',
      '$location',
      '$mdDialog',
      '$resource',
      'customersFactory',
      '$mdToast',

      function ($rootScope, $log, $http, $q, $state, $scope, 
                $timeout, $location, $mdDialog, $resource, customersFactory, $mdToast) {
    	  
    	var vm = this;

    }]) // END OF customersCtrl

})();