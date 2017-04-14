(function () {

  'use strict';

// Declare app level module which depends on filters, and services

  angular.module('myApp', [
    'myApp.controllers',
    'myApp.products.module',
    'myApp.cashier.module',
    'myApp.auth.module',
    'myApp.general.module',
    'myApp.customers.module',
    'myApp.employees.module',
    'myApp.transactions.module',
    'ngAnimate',
    'ui.router',
    'ngMaterial',
    'ngAria',
    'ui.bootstrap',
    'ngMessages',
    'ngResource',
    'smart-table',
    'chart.js',
    'ngPrint'
  ])
    .run(function(AuthService, HomeService, storesFactory, $rootScope, $state) {

      //////////////////storesFactory.initLoadStores();
      // For implementing the authentication with ui-router we need to listen the
      // state change. For every state change the ui-router module will broadcast
      // the '$stateChangeStart'.
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        if(localStorage.getItem('store') !== null)
        {
            var storeObject = localStorage.getItem('store');
            HomeService.store = JSON.parse(storeObject);
        }

        if(localStorage.getItem('till') !== null)
        {
            var tillObject = localStorage.getItem('till');
            HomeService.till = JSON.parse(tillObject);
        }

        if(localStorage.getItem('user') !== null)
        {
            var userObject = localStorage.getItem('user');
            AuthService.user = JSON.parse(userObject);
        }
        // checking the user is logged in or not
        if (!AuthService.user  /* && !localStorage.getItem('user') /*&& localStorage.getItem('user') !== null*/) {
          // To avoiding the infinite looping of state change we have to add a
          // if condition.
        	if (toState.name != 'login' && toState.name != 'customerRegistration') {
            event.preventDefault();
            $state.go('login');
        	}
        }

        
      }); // end of $rootscope.$on


    })
    .config(function ($mdThemingProvider, $locationProvider, $compileProvider) {
      $compileProvider.preAssignBindingsEnabled(true);
      $locationProvider.html5Mode(false);
      /*$mdThemingProvider.theme('default')
        .primaryPalette('light-blue', {
          'default': '300'
        })
        .accentPalette('deep-orange', {
          'default': '500'
        });*/
    })
    .config(function ($httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
    
    .config(['$stateProvider', '$urlRouterProvider', '$logProvider',
      function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/gettingstarted");
        //$urlMatcherFactoryProvidor.caseInsensitive(true);
        $stateProvider
          .state('customerRegistration', {
            url: '/customerRegistration',
            data: {
              requireLogin: false // this property will apply to all children of 'app'
            },
            views: {

              '@': {
                templateUrl: 'app/views/customerRegistration.html',
                controller: 'registrationCtrl'
              }
            }
        })
        $stateProvider
          .state('login', {
            url: '/login',
            data: {
              requireLogin: false // this property will apply to all children of 'app'
            },
            views: {

              '@': {
                templateUrl: 'app/Authentication/auth.login.html',
                controller: 'loginCtrl'
              }
            }
        })
        $stateProvider
          .state('home', {
            url: '/',
            data: {
              requireLogin: true // this property will apply to all children of 'app'
            },
            views: {

              '@': {
                templateUrl: 'app/views/home.view.html',
                controller: 'homeCtrl as vm'
              }
            }
          })
          .state('home.gettingstarted', {
            url: 'gettingstarted',

            views: {

              'content@home': {
                templateUrl: 'app/views/gettingstarted.view.html',
                controller: 'gettingStartedCtrl'
              }
            }
          })
          .state('home.customers', {
            url: 'customers',

            views: {

              'content@home': {
                templateUrl: 'app/customers/customers.view.html',
                controller: 'customersCtrl as customersCtrl'
              }
            }
          })
          .state('home.employees', {
            url: 'employees',

            views: {

              'content@home': {
                templateUrl: 'app/employees/employees.view.html',
                controller: 'employeesCtrl as employeesCtrl'
              }
            }
          })
          /*************  Routes For Cashier ****************/
          .state('home.cashier', {
            url: 'cashier',
            abstract: true
          })
          .state('home.cashier.sales', {
            url: '/sales',

            views: {

              'content@home': {
                templateUrl: 'app/cashier/cashier.sales.view.html',
                controller: 'cashierCtrl'
              }
            }
          })
          .state('home.cashier.previousSales', {
            url: '/previousSales',

            views: {

              'content@home': {
                templateUrl: 'app/cashier/cashier.previousSales.view.html',
                controller: 'previousSalesCtrl as previousSalesCtrl'
              }
            }
          })
          .state('home.cashier.openclose', {
            url: '/openclose',

            views: {

              'content@home': {
                templateUrl: 'app/cashier/cashier.openclose.view.html',
                controller: 'opencloseCtrl as opencloseCtrl'
              }
            }
          })
          /*************  Routes For Products ****************/
          .state('home.products', {
            url: 'products',
            abstract: true
          })
          .state('home.products.products', {
            url: '/products',
            /*data : {
              role : 'ADMIN'
            },*/
            views: {

              'content@home': {
                templateUrl: 'app/products/products.products.view.html',
                controller: 'productsCtrl as productsCtrl'
              }
            }
          })
          .state('home.products.categorys', {
            url: '/categorys',

            views: {

              'content@home': {
                templateUrl: 'app/products/products.categorys.view.html',
                controller: 'productsCtrl as productsCtrl'
                /*resolve: {
                    products: function(productsFactory) {
                        return productsFactory.getProducts();
                    }
                }*/
              }
            }
          })
          .state('home.products.brands', {
            url: '/brands',

            views: {

              'content@home': {
                templateUrl: 'app/products/products.brands.view.html',
                controller: 'brandsCtrl as brandsCtrl'
              }
            }
          })
          /*************  Routes For Settings ****************/
          .state('home.settings', {
            url: 'settings',
            abstract: true
          })
          .state('home.settings.general', {
            url: '/general',

            views: {

              'content@home': {
                templateUrl: 'app/general/generalsettings.view.html',
                controller: 'generalSettingsCtrl as generalSettingsCtrl'
              }
            }
          })
          .state('home.settings.storesandregisters', {
            url: '/storesandregisters',

            views: {

              'content@home': {
                templateUrl: 'app/general/storesandregisters.view.html',
                controller: 'storesandregistersCtrl as storesandregistersCtrl'
              }
            }
          })
          /*.state('home.settings.taxandcurrency', {
            url: '/openclose',

            views: {

              'content@home': {
                templateUrl: 'app/settings/cashier.openclose.view.html',
                controller: 'cashierCtrl'
              }
            }
          })*/

      }])
    //take all whitespace out of string
    .filter('nospace', function () {
      return function (value) {
        return (!value) ? '' : value.replace(/ /g, '');
      };
    })
    //replace uppercase to regular case
    .filter('humanizeDoc', function () {
      return function (doc) {
        if (!doc) return;
        if (doc.type === 'directive') {
          return doc.name.replace(/([A-Z])/g, function ($1) {
            return '-' + $1.toLowerCase();
          });
        }

        return doc.label || doc.name;
      };
    });

})();