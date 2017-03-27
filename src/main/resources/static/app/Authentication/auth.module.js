(function() {
  var app = angular.module('myApp.auth.module');

  app.service('AuthService', function() {
    return {
      user : null
    }
  });

  app.controller('loginCtrl', function ($http, $q, $scope, $state, $mdToast, AuthService, $rootScope) {

    $scope.login = function() {
        // requesting the token by usename and passoword
        $http({
          url : 'authenticate',
          method : "POST",
          params : {
            username : $scope.username,
            password : $scope.password
          }
        }).then(function successCallback(response) {
          // checking if the token is available in the response
          if (response.data.token) {
            $scope.toastMessage("Login Successful");
            // setting the Authorization Bearer token with JWT token
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
            localStorage.setItem('token', response.data.token);
            
            // setting the user in AuthService
            AuthService.user = response.data.user;
            // transform user object to string for storing in local storage 
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            $rootScope.$broadcast('LoginSuccessful');
            // going to the home page
            $state.go('home.gettingstarted');
          }
        }, function errorCallback(response) {
          if(response.status === 401)
          {
            console.log("401 Error returned");
            $scope.toastMessage("Login Failed - Username or password is incorrect");
            $scope.password = "";
          }
        });
      };

      $scope.toastMessage = function(message) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(message)
            .hideDelay(3000)
        );
      };

  });

})();
