(function(){
  'use strict';

  /* reference to module */
  angular.module('myApp.customers.module')

    .factory('customersFactory', ['$log','$http', function($log, $http) {

      var urlBase = 'customers/';
      var factory = this;

      factory.sendCustomerLink = function(email){
         return $http.post("register/sendcustomerlink/", email);
      };

      factory.getAllCustomers = function(){
        return $http.get(urlBase);
      };

      factory.getCustomer = function (id) {
        return $http.get(urlBase + '/' + id);
      };

      factory.insertCustomer = function (customer) {
          return $http.post(urlBase, customer);
      };

      factory.updateCustomers = function (id, customer) {
          return $http.put(urlBase + '/' + id, customer)
      };

      factory.deleteCustomers = function (id) {
          return $http.delete(urlBase + '/' + id);
      };

      return factory;

    }]) // END OF productsFactory

})();