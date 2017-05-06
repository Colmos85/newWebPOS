(function(){
  'use strict';

  angular.module('common.services', []);
  angular.module('myApp.auth.module', ['ui.bootstrap',
    'ngMessages','ngMaterial']);
  angular.module('myApp.controllers', ['common.directives']);
  angular.module('common.directives', ['common.services']);

  angular.module('myApp.general.module', ['ui.bootstrap',
    'ngMessages','ngMaterial']);
  
  angular.module('myApp.products.module', ['ui.bootstrap',
    'ngMessages','ngMaterial', 'myApp.general.module']);
  angular.module('myApp.cashier.module', ['ui.bootstrap',
    'ngMessages','ngMaterial']);
  angular.module('myApp.customers.module', ['ui.bootstrap',
    'ngMessages','ngMaterial']);
  angular.module('myApp.employees.module', ['ui.bootstrap',
    'ngMessages','ngMaterial']);
  angular.module('myApp.transactions.module', []);

  angular.module('myApp.reports.module', [])
    .config(function($mdThemingProvider) {
      $mdThemingProvider.theme('blue')
        .primaryPalette('blue', {
          'default': '200',
          'hue-1': '100',
          'hue-2': '600',
          'hue-3': 'A100'
        });
      $mdThemingProvider.theme('red')
        .primaryPalette('red', {
          'default': '300',
          'hue-1': '100',
          'hue-2': '600',
          'hue-3': 'A100'
        });
      $mdThemingProvider.theme('pink')
        .primaryPalette('pink', {
          'default': '200',
          'hue-1': '100',
          'hue-2': '600',
          'hue-3': 'A100'
        });
      $mdThemingProvider.alwaysWatchTheme(true);
    });

})();  
  