(function(){
  'use strict';

  angular.module('myApp.controllers')

    .service('HomeService', function() {
      return {
        store : null,
        till : null
      }
    })
  
    .controller('homeCtrl', [
      '$rootScope',
      '$scope',
      '$log',
      '$state',
      '$timeout',
      '$location',
      'menu',
      '$http',
      'storesFactory',
      'HomeService',
      function ($rootScope, $scope, $log, $state, $timeout, $location, menu, $http, storesFactory, HomeService/*, AuthService*/) {

        var vm = this;
        
        vm.test = "This is a test string";
        
        // Set the token from storage to be the default on http requests
        // After refresh page the token will be retrieved from storage
      	if(localStorage.getItem('token')){
      		$http.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
      	}

        //functions for menu-link and menu-toggle
        vm.isOpen = isOpen;
        vm.toggleOpen = toggleOpen;
        vm.autoFocusContent = false;
        vm.menu = menu;

        vm.status = {
          isFirstOpen: true,
          isFirstDisabled: false
        };


        vm.enableCashiersButton = false;
        $scope.$on('till:updated', function(event,data) {
            vm.enableCashiersButton = true;
        });



        function isOpen(section) {
          return menu.isSectionSelected(section);
        }

        function toggleOpen(section) {
          menu.toggleSelectSection(section);
        }

      }])


    .controller("gettingStartedCtrl", [
      '$scope',
      '$rootScope',
      '$log',
      '$state',
      '$timeout',
      '$location',
      'menu',
      '$http',
      'storesFactory',
      'HomeService',
      function ($scope, $rootScope, $log, $state, $timeout, $location, menu, $http, storesFactory, HomeService) {
        /***********************************  Getting Started Page Controller ****************************************/
        

        // Load in stores 
        $scope.selectedStoreIndex = -1;
        $scope.selectedTillIndex = -1;
        $scope.store = null;
        $scope.till = null;
        $scope.stores = [];

        storesFactory.getAllStores().then(function successCallback(result){
            $scope.stores = result.data;

            console.log("ALL STORES RETRIEVED!!!!!!!!!!!!!!!!!");
            
            if(localStorage.getItem('store') !== null)
            {
              console.log("STORE IN LOCAL STORAGE");
              var retrievedStore = localStorage.getItem('store');
              HomeService.store = JSON.parse(retrievedStore);
              // set The store on load
              for (var i = 0; i < $scope.stores.length; i++) {
                  if (angular.equals($scope.stores[i], HomeService.store)) {
                    $scope.selectedStoreIndex = i;
                    $scope.store = $scope.stores[i];

                    if(localStorage.getItem('till') !== null)
                    {
                      var retrievedTill = localStorage.getItem('till');
                      HomeService.till = JSON.parse(retrievedTill);
                      // set The store on load
                      for (var i = 0; i < $scope.store.tills.length; i++) {
                          if (angular.equals($scope.store.tills[i], HomeService.till)) {
                            $scope.selectedTillIndex = i;
                            $rootScope.$broadcast('till:updated', $scope.till);
                          }
                      }
                    }
                  }
              };
            };
        });

        
        // Do on blur on store combobox
        $scope.setStore = function(){
            localStorage.setItem('store', JSON.stringify($scope.store));
            HomeService.store = $scope.store;   
            // set till to null
            $scope.selectedTillIndex = -1;
            HomeService.till = null;
            // remove from local storage
            localStorage.setItem('till', null);
        }

        // Do on blur on till combobox
        $scope.setTill = function(){
            localStorage.setItem('till', JSON.stringify($scope.till));
            HomeService.till = $scope.till;
            // broadcast message so title ctrl will pick it up and change the till name on title
            $rootScope.$broadcast('till:updated', $scope.till); 
        }






    }]) // END of Getting started controller

    .controller("titleController", function($http, $rootScope, $log, $state, $timeout, $location, $scope, $interval, AuthService, HomeService) {
        
      	// set the username for the title bar
      	if(AuthService.user !== null){
      		$scope.username = AuthService.user.firstName;
      	}
        else{ // get it from the localstorage
          if(localStorage.getItem('user') !== null)
          {
            var retrievedObject = localStorage.getItem('user');
            AuthService.user = JSON.parse(retrievedObject);
            $scope.username = AuthService.user.firstName;
          }
          else{console.log("titleController - else local storage has NO user!");};
        };
    		
        // set the till name on title bar
        var till = localStorage.getItem('till');
        if(localStorage.getItem('till') !== null )
        {
            var retrievedTill = localStorage.getItem('till');
            HomeService.till = JSON.parse(retrievedTill);
            $scope.activeRegister = HomeService.till.name;
        }

        // recieve broadcast on till change 
        $scope.$on('till:updated', function(event,data) {
            if(data !== null){
              $scope.activeRegister = data.name;
            }
        });

        
        var tick = function() {
            $scope.clock = Date.now();
        };
        tick();
        $interval(tick, 1000);

        //$http.post(urlBase, product);
        $scope.logout = function() {
          $http.post("logout/", AuthService.user.username).then(function successCallback(response) {

            AuthService.user = null;
            localStorage.setItem('user', null);
            localStorage.setItem('token', null);
            $state.go('login');
          }); 
        };
    }) // END OF TITLE CONTROLLER



    .controller("sidebarController", function($scope, $mdSidenav, AuthService) {
        $scope.controllerName = "sidebarController";
        $scope.showMobileMainHeader = true;

        $scope.enableCashiersButton = false;
        $scope.$on('till:updated', function(event,data) {
            $scope.enableCashiersButton = true;
        });

        $scope.openSideNavPanel = function() {
            $mdSidenav('left').open();
        };
        $scope.closeSideNavPanel = function() {
            $mdSidenav('left').close();
        };
    })
})();