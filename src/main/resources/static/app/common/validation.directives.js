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




    /**
      * This directive can be used with any input tag which will show validation against the server for duplicates.
      *
      *<input name="brandName" ng-model="brand.brandName" md-autofocus record-availability-validator="/brands/exists/" required>
      *<div ng-messages="brandForm.brandName.$error" >
      *    <div ng-message="recordLoading">
      *    Checking database...
      *    </div>
      *  <div ng-message="recordAvailable">
      *      The object?? name is already in use...
      *  </div>
      *</div>
      *
      */
    .directive('recordAvailabilityValidator', ['$http', function($http) {
        return {
            /*restrict: 'A',*/
            /*scope: {
              recordAvailabilityValidator: "="
            },*/
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {

                var apiUrl = attrs.recordAvailabilityValidator;

                function setAsLoading(bool) {
                    ngModel.$setValidity('recordLoading', !bool);
                }

                function setAsAvailable(bool) {
                    ngModel.$setValidity('recordAvailable', bool);
                }
                ngModel.$parsers.push(function(value) {
                    if (!value || value.length == 0) 
                    {
                      setAsLoading(false);
                      setAsAvailable(true);
                      return value;
                    }
                    apiUrl = attrs.recordAvailabilityValidator.concat(value);
                    setAsLoading(true);
                    setAsAvailable(false);
                    $http.get(apiUrl, {
                        v: value
                    }).then(function successCallback(response) {
                        //value = response.data;
                        if(response.data === false) // if object does not exist
                        {
                          //value = response.data;
                          setAsLoading(false);
                          setAsAvailable(true);
                        }else{
                          //value = response.data;
                          setAsLoading(false);
                          setAsAvailable(false);
                        }
                        
                    })/*.error(function() {
                        setAsLoading(false);
                        setAsAvailable(false);
                    })*/;
                    return value;
                })
            }
        }
    }])