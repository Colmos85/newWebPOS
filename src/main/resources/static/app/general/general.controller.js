(function(){
  'use strict';

  /* reference to module */
 angular.module('myApp.general.module')
 

    .controller('generalSettingsCtrl', [
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
      
/*      // Load products 
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
      

       
    }]) // END OF generalSettingsCtrl

    .controller('storesandregistersCtrl', [
      '$rootScope',
      '$mdToast',
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
      'AuthService',
      'tillsFactory',

      function ($rootScope, $mdToast, $log, $http, $q, $state, $scope, 
                $timeout, $location, $mdDialog, $resource, storesFactory, AuthService, tillsFactory) {
        
      var vm = this;

      vm.reload = function(){
        storesFactory.getAllStores().then(function successCallback(result){
            vm.stores=result.data;
        });
      }

      vm.reload();


      vm.hasAccess = function(){
        if(AuthService.user.roles[0] !== "ADMIN"){
          return false;
        }
        else
        {
          return true;
        }
      };

      /************************************************/
      /***************** STORES ***********************/
      /************************************************/

      vm.editStore = function(store, event) {
          console.log("selected store to edit", store);
          vm.openStoreForm(store, event);
      };

      vm.removeStore = function(store) {
          console.log("selected store to delete", store);
          storesFactory.deleteStore(store.id).then(function successCallback(result){
              var index = vm.stores.indexOf(store);
              console.log("index", index);
              vm.store.splice(index, 1);
              vm.toastMessage("Store deleted successfully");
          });
      };

      vm.openStoreForm = function(store, event){
          $mdDialog.show({
          locals:{
            selectedStore: store
          },
          controller: StoreDialogController,
          templateUrl: 'app/general/storeForm.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose:true,
          fullscreen: false // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          $scope.status = 'Store Saved "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });

      }


      function StoreDialogController($scope, $mdDialog, selectedStore, storesFactory) {

        $scope.headerName = "...";
        var update = false;

        if(angular.isUndefined(selectedStore) || selectedStore === null)
        {
          console.log("Store Dialog controller - new Store");
          $scope.headerName = "New Store Form!";
        }
        else
        {
          update = true;
          console.log("Store Dialog controller, store is not null");
          $scope.headerName = "Edit Store";
          $scope.name = selectedStore.name;
          $scope.contactNum = selectedStore.contactNum;
          $scope.address1 = selectedStore.address1;
          $scope.address2 = selectedStore.address2;
          $scope.address3 = selectedStore.address3;
        }

        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.clear = function() {
          //$mdDialog.cancel();
          // set all model variables to "";
        };

        $scope.save = function(answer) {

          // Create the Store object
          var store = {
            name : $scope.name,
            contactNum : $scope.contactNum,
            address1 : $scope.address1,
            address2 : $scope.address2,
            address3 : $scope.address3
          };

          if(update) // edit button pressed
          {
            storesFactory.updateStore(selectedStore.id, store).then(function successCallback(response) {
                product.id = response.data.id; // return new store id
                vm.reload();
                vm.toastMessage("Store Updated");
                $mdDialog.hide(answer);
              });
          }
          else // else new store button was pressed
          {
            // send request to factory to create new Product in the database
            storesFactory.insertStore(store).then(
              function successCallback(response) {
                store.id = response.data.id;
                vm.reload();
                vm.toastMessage("Store added successfully");
                $mdDialog.hide(answer);
              }, function errorCallback(response) {
                if(response.status === 409)
                {
                  console.log("error - 409");
                  vm.toastMessage(response.errorMessage);
                }
            });

          }; // end of else
          console.log("Store with id?", store);
        };

      }; // END OF DialogController





      vm.toastMessage = function(message) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(message)
            .hideDelay(3000)
        );
      };

      /***********************************************/
      /***************** TILLS ***********************/
      /***********************************************/

      vm.editTill = function(store, till, event) {
          console.log("selected till to edit", till);
          vm.openTillForm(store, till, event);
      };

      vm.removeTill = function(store, till) {
          console.log("selected till to delete", till);
          storesFactory.deleteTill(till.id).then(function successCallback(result){
              var storeIndex = vm.stores.indexOf(store);
              var tillIndex = vm.stores[storeIndex].indexOf(till);
              console.log("index", tillIndex);
              vm.stores[storeIndex].splice(tillIndex, 1);
              vm.toastMessage("Till deleted successfully");
          });
      };

      vm.openTillForm = function(store, till, event){
        $mdDialog.show({
          locals:{
            selectedStore: store,
            selectedTill: till
          },
          controller: TillDialogController,
          templateUrl: 'app/general/tillForm.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose:true,
          fullscreen: false // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          $scope.status = 'Store Saved "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
      }



      function TillDialogController($scope, $mdDialog, selectedStore, selectedTill, storesFactory, tillsFactory) {

        $scope.headerName = "...";
        var update = false;

        if(angular.isUndefined(selectedTill) || selectedTill === null)
        {
          console.log("Till Dialog controller - new Till for store:", selectedStore);
          $scope.headerName = "New Till Form!";
        }
        else
        {
          update = true;
          console.log("Till Dialog controller, till is not null");
          $scope.headerName = "Edit Till";
          $scope.name = selectedTill.name
        }

        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.clear = function() {
          //$mdDialog.cancel();
          // set all model variables to "";
        };

        $scope.save = function(answer) {

          // Create the Store object
          var till = {
            name : $scope.name,
            store : selectedStore
          };

          if(update) // edit button pressed
          {
            tillsFactory.updateTill(till.id, till).then(function successCallback(response) {
                till.id = response.data.id; // return new store id
                vm.reload();
                vm.toastMessage("till Updated");
                $mdDialog.hide(answer);
              });
          }
          else // else new store button was pressed
          {
            // send request to factory to create new Product in the database
            tillsFactory.insertTill(till).then(
              function successCallback(response) {
                till.id = response.data.id;
                vm.reload();
                vm.toastMessage("Till added successfully");
                $mdDialog.hide(answer);
              }, function errorCallback(response) {
                if(response.status === 409)
                {
                  console.log("error - 409 - ",response);
                  vm.toastMessage(response.data.errorMessage);
                }
            });

          }; // end of else
          console.log("Till with id?", till);
        };

      }; // END OF TillDialogController
       
    }]) // END OF storesCtrl



})();