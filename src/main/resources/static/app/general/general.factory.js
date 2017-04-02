(function(){
  'use strict';

  /* reference to module */
  angular.module('myApp.general.module')

    .factory('storesFactory', ['$log','$http', function($log, $http) {

      var urlBase = 'stores/';
      var factory = this;

      var allStores = [];

/*      factory.initLoadStores = function(){
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
      
      factory.loadAllStores();*/
      //loadAllStores(); // not defined on load

/*      factory.getAllStores = function () {
          console.log("Get all stores: ", allStores);
          factory.loadAllStores();
          return allStores;
      };*/




      factory.getAllStores = function(){
        return $http.get(urlBase);
        //console.log("Request made for all stored, lenght is: ", allStores.lenght);
        //return allStores;
      }

      factory.getStore = function (id) {
        return $http.get(urlBase + '/' + id);
      };

      factory.insertStore = function (store) {
          return $http.post(urlBase, store);
      };

      factory.updateStore = function (id, store) {
          return $http.put(urlBase + '/' + id, store)
      };

      factory.deleteStore = function (id) {
          return $http.delete(urlBase + '/' + id);
      };

      return factory;
    }]) // End of stores factory



    .factory('tillsFactory', ['$log','$http', function($log, $http) {

      var urlBase = 'tills/';
      var factory = this;

      factory.getAllTills = function(){
        return $http.get(urlBase);
      }

      factory.getTill = function (id) {
        return $http.get(urlBase + '/' + id);
      };

      factory.insertTill = function (till) {
          return $http.post(urlBase, till);
      };

      factory.updateTill = function (id, till) {
          return $http.put(urlBase + '/' + id, till)
      };

      factory.deleteTill = function (id) {
          return $http.delete(urlBase + '/' + id);
          //products.
      };

      return factory;

    }]) // END OF tillsFactory
    

})();