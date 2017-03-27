(function(){
  'use strict';

  /* reference to module */
  angular.module('myApp.cashier.module')


    .factory('cashierFactory', ['$resource', function($resource) {

        return $resource('products/:id', {id : '@id'});

      }])

})();