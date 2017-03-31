angular.module('common.directives')

.directive('recordChecker', ['$q', '$http', function($q, $http) {
        
        return {
          require: 'ngModel',
          link: function (scope, element, attrs, ctrl) {

            var apiUrl = attrs.recordChecker;

            ctrl.$asyncValidators.recordexists = function (modelValue, viewValue) {
              return $q(function(resolve, reject){
                  apiUrl = attrs.recordChecker.concat(viewValue);
                  $http.get(apiUrl,{
                      viewValue: viewValue
                  }).then(function successCallback(response) {
                      //value = response.data;
                      if(response.data === false) // if object does not exist
                      {
                        console.log("Does not exist");
                        //return true;
                        resolve();
                      }else{
                        console.log("Does exist");
                        //return false;
                        reject();
                      }
                      
                  });
              });
            };
          }
        };
    }]) // END OF DIRECTIVE

    .directive('integerValidator', ['$q', '$http', function($q, $http) {
        var REGEX = /^\-?\d+$/;

        return {
          require: 'ngModel',
          link: function (scope, element, attrs, ctrl) {

            ctrl.$validators.integer = function (modelValue, viewValue) {

              if (REGEX.test(viewValue)) {
                return true
              }
              return false;
            };
          }
        };
    }]) // END OF DIRECTIVE