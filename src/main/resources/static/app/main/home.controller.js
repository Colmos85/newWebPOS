(function(){
  'use strict';

  angular.module('myApp.controllers')
  
    .controller('homeCtrl', [
      '$rootScope',
      '$log',
      '$state',
      '$timeout',
      '$location',
      'menu',
      '$http',
      function ($rootScope, $log, $state, $timeout, $location, menu, $http/*, AuthService*/) {

        var vm = this;
        
        vm.test = "This is a test string";
        
        // Set the token from storage to be the default on http requests
        // After refresh page the token will be retrieved from storage
      	if(localStorage.getItem('token')){
      		$http.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
      	}

        //vm.user = AuthService.user;

        //functions for menu-link and menu-toggle
        vm.isOpen = isOpen;
        vm.toggleOpen = toggleOpen;
        vm.autoFocusContent = false;
        vm.menu = menu;

        vm.status = {
          isFirstOpen: true,
          isFirstDisabled: false
        };


        function isOpen(section) {
          return menu.isSectionSelected(section);
        }

        function toggleOpen(section) {
          menu.toggleSelectSection(section);
        }

      }])

    .controller("titleController", function($rootScope, $log, $state, $timeout, $location, $scope, $interval, AuthService) {
        
      	// set the username for the title bar
      	if(AuthService.user !== null){
          console.log("titleController - if AuthService had a username!");
      		$scope.username = AuthService.user.firstName;
      	}
        else{ // get it from the localstorage
          console.log("titleController - if AuthService has NO username!");
          if(localStorage.getItem('user') !== null)
          {
            console.log("titleController - else local storage has user!");
            var retrievedObject = localStorage.getItem('user');
            AuthService.user = JSON.parse(retrievedObject);
            $scope.username = AuthService.user.firstName;
          }
          else{console.log("titleController - else local storage has NO user!");};
        };
    		
        $scope.activeRegister = "Main Register";

        
        
        var tick = function() {
            $scope.clock = Date.now();
        };
        tick();
        $interval(tick, 1000);

        $scope.$on('LoginSuccessful', function() {
          $scope.username = AuthService.user.firstName;
        });
        $scope.$on('LogoutSuccessful', function() {
          $scope.username = null;
        });
        $scope.logout = function() {
          AuthService.user = null;
          localStorage.setItem('user', null);
          localStorage.setItem('token', null);
          $rootScope.$broadcast('LogoutSuccessful');
          $state.go('login');
        };
    })

    .controller("sidebarController", function($scope, $mdSidenav, AuthService) {
        $scope.controllerName = "sidebarController";
        $scope.showMobileMainHeader = true;
        $scope.openSideNavPanel = function() {
            $mdSidenav('left').open();
        };
        $scope.closeSideNavPanel = function() {
            $mdSidenav('left').close();
        };
    })
})();