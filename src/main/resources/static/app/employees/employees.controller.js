(function(){
  'use strict';

  /* reference to module */
 angular.module('myApp.employees.module')

    .controller('employeesCtrl', [
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
      'employeesFactory',
      'storesFactory',
      '$mdToast',

      function ($rootScope, $log, $http, $q, $state, $scope, 
                $timeout, $location, $mdDialog, $resource, employeesFactory, storesFactory, $mdToast) {
    	  
    	var vm = this;

      // load / reload
    	vm.reload = function() {
        // Load stores 
        employeesFactory.getAllEmployees().then(function successCallback(result){
            vm.employees = result.data;
            console.log("Got all employees: ", vm.employees);
        });
        storesFactory.getAllStores().then(function successCallback(result){
            vm.stores = result.data;
            console.log("Got all stores: ", vm.stores);
        });
      };

      vm.reload();

      vm.roles = [{"name":"ADMIN"}, {"name":"USER"}];
      console.log("Roles print ******* ", vm.roles);

      vm.toastMessage = function(message) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(message)
            .hideDelay(3000)
        );
      };





      vm.removeItem = function(employee) {
          console.log("selected product to delete", customer);
          employeesFactory.deleteCustomer(customer.id).then(function successCallback(result){


              var index = vm.customers.indexOf(customer);
              console.log("index", index);
              vm.customers.splice(index, 1);

              vm.toastMessage("Customer deleted successfully");
          });
      };

      vm.editItem = function(employee, event) {
          console.log("selected Customers to edit", customer);
          vm.openCustomerForm(customer, event);
      };



	    vm.openEmployeeForm = function(employee, event) {

          console.log("Roles print ******* ", vm.roles);

	        $mdDialog.show({
            //isolateScope: false,
            locals:{
              selectedEmployee: employee,
              roles: vm.roles,
              stores: vm.stores
            },
	          controller: DialogController,
	          templateUrl: 'app/employees/employeeForm.html',
	          parent: angular.element(document.body),
	          targetEvent: event,
	          clickOutsideToClose:true,
	          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
	        })
	        .then(function(answer) {
	          $scope.status = 'Employee Saved "' + answer + '".';
	        }, function() {
	          $scope.status = 'You cancelled the dialog.';
	        });
	     };

      function DialogController($scope, $mdDialog, roles, stores, selectedEmployee, employeesFactory) {
          // inject brands from parent ctrl and set to dialogs isolated scope variable

          $scope.selectedStoreIndex = -1;
          $scope.selectedRoleIndex = -1;

          $scope.headerName = "...";
          $scope.roles = roles;
          $scope.stores = stores;
          
          if(angular.isUndefined(selectedEmployee) || selectedEmployee === null)
          {
            console.log("Dialog controller - new Employee");
            $scope.headerName = "New Employee Form!";
          }
          else
          {
            update = true;
            console.log("dialog controller, employee is not null");
            $scope.headerName = "Edit Employee";
            /*$scope.tradePriceEx = selectedProduct.tradePriceEx;
            $scope.description = selectedProduct.description;
            $scope.barcode = selectedProduct.barcode;
            $scope.markup = selectedProduct.markup;*/
            
            //$scope.brand = selectedProduct.brand;
            /*for (var i = 0; i < brands.length; i++) {
                if (angular.equals(brands[i], selectedProduct.brand)) {$scope.selectedBrandIndex = i;
                }
            }
            //$scope.taxBand = selectedProduct.taxBand;  // ?????????
            for (var i = 0; i < taxBands.length; i++) {
                if (angular.equals(taxBands[i], selectedProduct.taxBand)) {$scope.selectedTaxIndex = i;
                }
            }*/
            
          };

          $scope.hide = function() {
            $mdDialog.hide();
          };
  
          $scope.cancel = function() {
            $mdDialog.cancel();
          };

          $scope.clear = function() {
            // set all model variables to "";
          };
  
          $scope.save = function(answer) {
            
            // Create the Employee object
            var employee = {
              firstName : $scope.firstName,
              lastName : $scope.lastName,
              email : $scope.email,
              contact : $scope.contact,
              username : $scope.username,
              password : $scope.password,
              roles:[],
              store: $scope.store
            };

            console.log("Email Sent????");
            vm.toastMessage("Email link sent to customer!");
            employeesFactory.sendCustomerLink(email).then(function successCallback(response) {
                console.log("Email Sent????");
                vm.toastMessage("Email link sent to customer!");
            });

            //vm.reload();
            $mdDialog.hide(answer);
          }; // end of save
      }; // end of Dialog Controller
	     

    }]) // END OF employeesCtrl

/*    // Controller for registration page
    .controller('registrationCtrl', [
      '$rootScope',
      '$log',
      '$http',
      '$q',
      '$state',
      '$scope',
      '$timeout',
      '$location',
      '$resource',
      'customersFactory',
      '$mdToast',

      function ($rootScope, $log, $http, $q, $state, $scope, 
                $timeout, $location, $resource, customersFactory, $mdToast) {
        
      $scope.toastMessage = function(message) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(message)
            .hideDelay(3000)
        );
      };

      $scope.save = function() {
        console.log("In save function for new customer");
        // Create the product object
        var customer = {
          name : $scope.name,
          email : $scope.email,
          contact : $scope.contact,
          address1 : $scope.address1,
          address2 : $scope.address2,
          address3 : $scope.address3,
          username: $scope.username,
          password: $scope.password
        };

        customersFactory.insertCustomer(customer).then(function successCallback(response) {
          //customer.id = response.data.id;

          // Direct to Thankyou for registering page.. maybe link to app on playstore

          // refresh the list of products and quantity (less efficient but easier for now)
          //vm.reload();
          $scope.toastMessage("Added successfully");
        });
      };

    }]) // END OF customersCtrl*/

})();