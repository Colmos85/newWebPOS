(function(){
  'use strict';

  /* reference to module */
  angular.module('myApp.transactions.module')

    .factory('transactionsFactory', ['$log','$http', function($log, $http) {

      var urlBase = 'transactions/';
      var factory = this;

      factory.getAllTransactions = function(){
        return $http.get(urlBase);
      };

      factory.getTransaction = function (id) {
        return $http.get(urlBase + '/' + id);
      };

      factory.insertTransaction = function (transaction) {
          return $http.post(urlBase, transaction);
      };

      factory.updateTransaction = function (id, transaction) {
          return $http.put(urlBase + '/' + id, transaction)
      };

      factory.deleteTransaction = function (id) {
          return $http.delete(urlBase + '/' + id);
      };

      return factory;

    }]) // END OF productsFactory

})();