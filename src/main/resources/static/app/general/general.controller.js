(function(){
  'use strict';

  /* reference to module */
 angular.module('myApp.general.module')

    .controller('storesCtrl', [
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
      'storesFactory',

      function ($rootScope, $log, $http, $q, $state, $scope, 
                $timeout, $location, $mdDialog, $resource, storesFactory) {
    	  
    	var vm = this;
        
    	vm.stores =[];
    	
/*    	// Load products 
        $http({
            method : 'GET',
            url : 'stores/'
        }).then(function successCallback(response) {
        	vm.stores = response.data;
        }, function errorCallback(response) {
            console.log(response.statusText);
        });
    	
    	vm.test = function(productId) {
    		vm.stores = genrealFactory.getAllStores();
        };*/
    	

	     
    }]) // END OF storesCtrl




})();