(function(){
  'use strict';

  /* reference to module */
  angular.module('myApp.employees.module')

    .factory('employeesFactory', ['$log','$http', function($log, $http) {

      var urlBase = 'employees/';
      var factory = this;

      /*factory.sendCustomerLink = function(email){
         return $http.post("register/sendcustomerlink/", email);
      };*/

      factory.getAllEmployees = function(){
        return $http.get(urlBase);
      };

      factory.getEmployee = function (id) {
        return $http.get(urlBase + '/' + id);
      };

      factory.insertEmployee = function (employee) {
          return $http.post(urlBase, employee);
      };

      factory.updateEmployees = function (id, employee) {
          return $http.put(urlBase + '/' + id, employee)
      };

      factory.deleteEmployee = function (id) {
          return $http.delete(urlBase + '/' + id);
      };

      return factory;

    }]) // END OF productsFactory

})();