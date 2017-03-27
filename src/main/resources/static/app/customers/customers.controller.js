(function(){
  'use strict';

  /* reference to module */
 angular.module('myApp.customers.module')

    .controller('customersCtrl', [
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

      // load / reload
    	vm.reload = function() {
        // Load stores 
        customersFactory.getAllCustomers().then(function successCallback(result){
            vm.customers=result.data;
        });
      };

      vm.reload();

      vm.toastMessage = function(message) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(message)
            .hideDelay(3000)
        );
      };


      vm.removeItem = function(customer) {
          console.log("selected product to delete", customer);
          customersFactory.deleteCustomer(customer.id).then(function successCallback(result){


              var index = vm.customers.indexOf(customer);
              console.log("index", index);
              vm.customers.splice(index, 1);

              vm.toastMessage("Customer deleted successfully");
          });
      };

      vm.editItem = function(customer, event) {
          console.log("selected Customers to edit", customer);
          vm.openCustomerForm(customer, event);
      };

	    vm.openCustomerForm = function(customer, event) {

          var template ='app/customers/customerForm.html';
          if(customer !=null){
            console.log("Existing Custimer");
            template = 'app/customers/customerForm.html';
          }

	        $mdDialog.show({
            //isolateScope: false,
            locals:{
              selectedCustomer: customer
            },
	          controller: DialogController,
	          templateUrl: template,
	          parent: angular.element(document.body),
	          targetEvent: event,
	          clickOutsideToClose:true,
	          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
	        })
	        .then(function(answer) {
	          $scope.status = 'Customer Saved "' + answer + '".';
	        }, function() {
	          $scope.status = 'You cancelled the dialog.';
	        });
	     };

      function DialogController($scope, $mdDialog, selectedCustomer, customersFactory) {
          // inject brands from parent ctrl and set to dialogs isolated scope variable

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
            var email = $scope.email;
            customersFactory.sendCustomerLink(email).then(function successCallback(response) {
                console.log("Email Sent????");
                vm.toastMessage("Email link sent to customer!");
            });

            //vm.reload();
            $mdDialog.hide(answer);
          }; // end of save
      }; // end of Dialog Controller
	     

    }]) // END OF customersCtrl

    // Controller for registration page
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

    }]) // END OF customersCtrl

})();