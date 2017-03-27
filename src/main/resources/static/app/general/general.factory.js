(function(){
  'use strict';

  /* reference to module */
  angular.module('myApp.general.module')

    .factory('storesFactory', ['$log','$http', function($log, $http) {

      var urlBase = 'stores/';
      var factory = this;

      var allStores = [/*{"name":"Mallow Store","address1":"Main St.","address2":"Mallow","address3":"Co. Cork","contactNum":"0863538355",
  "stock":[{"id":1,"quantity":50},{"id":3,"quantity":98}],"storeId":1}*/];

      factory.initLoadStores = function(){
        return $http.get('stores/');
      }
      
      
      factory.loadAllStores = function(){
          console.log("Load all stores: ");
          $http({
              method : 'GET',
              url : 'stores/'
          }).then(function successCallback(response) {
              console.log("Load all stores - Success");
            	allStores = response.data;
              //return allStores;
          }, function errorCallback(response) {
              console.log(response.statusText);
              console.log("Load all stores - Failure");
          });
      };
      
      factory.loadAllStores();
      //loadAllStores(); // not defined on load

      factory.getAllStores = function () {
          console.log("Get all stores: ", allStores);
          factory.loadAllStores();
          return allStores;
      };

      return factory;
    }])
    

})();