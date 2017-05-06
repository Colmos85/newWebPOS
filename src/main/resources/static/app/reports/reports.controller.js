(function(){
  'use strict';

  angular.module('myApp.employees.module')
  
    .controller('reportsCtrl', [
      '$rootScope',
      '$scope',
      '$mdToast',
      '$log',
      '$state',
      '$timeout',
      '$location',
      '$http',
      'storesFactory',
      'HomeService',
      function ($rootScope, $scope, $mdToast, $log, $state, $timeout, $location, $http, storesFactory, HomeService) {
          $scope.hideCompare = true;
          $scope.theme = 'red';
          $scope.dataSets = {};
          $scope.type = 'bar';
          $scope.dIndex = 0;

          $scope.themes = ["red", 'blue', 'pink'];

          // Dataset select from md-tabs:
          $scope.dataSet = function(ds) {
            $scope.theme = $scope.themes[ds];
            $scope.dIndex = ds;
          };

          $scope.compareStuff = function() {
            $scope.hideCompare = !$scope.hideCompare;
          }

          $scope.updateCompare = function() {
         $scope.dataSets[3] = [
              [avgArray($scope.dataSets[0][0]), avgArray($scope.dataSets[1][0]), avgArray($scope.dataSets[2][0])]
            ];
            // console.log($scope.dataSets[3]);
            // console.log($scope.dataSets[1]);
            // console.log($scope.dataSets[2]);    
          }

          $scope.printChart = function() {
            $mdToast.show(
              $mdToast.simple()
              .textContent('Printing Chart: bip bip brrt brrt brrt Oh Noes Paper Jam ! ')
              .hideDelay(3000)
              .parent(document.getElementById("toaster"))
              .position('top right')
              .action('x')
            );
          };

          $scope.toggle = function() {
            $scope.type = $scope.type === 'bar' ? 'line' : 'bar';
          };
          $scope.labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          $scope.labelsC = ["Red", "Blue", "Pink"];
          $scope.series = ['Series A'];
          $scope.dataSets[0] = [
            [200, 167, 18, 120, 100, 130, 130, 120, 140, 60, 200, 260]
          ];
          $scope.dataSets[1] = [
            [100, 29, 300, 220, 200, 30, 30, 220, 40, 160, 300, 460]
          ];
          $scope.dataSets[2] = [
            [130, 130, 120, 140, 60, 200, 260, 200, 167, 18, 120, 100]
          ];

          function avgArray(arr) {
            var sum = arr.reduce(function(a, b) {
              return a + b;
            });
            var avg = sum / arr.length;
            return avg.toFixed();
          }

          $scope.dataSets[3] = [
            [avgArray($scope.dataSets[0][0]), avgArray($scope.dataSets[1][0]), avgArray($scope.dataSets[2][0])]
          ];

          $scope.datasetOverrideR = [{
            label: "Red Stuff",
            fill: true,
            lineTension: 0.2,
            borderColor: "rgba(255,0,0,1)",
            backgroundColor: "rgba(255,0,0,0.6)"
          }];
          $scope.datasetOverrideB = [{
            label: "Blue Stuff",
            fill: true,
            lineTension: 0.2,
            borderColor: "rgba(0,100,192,1)",
            backgroundColor: "rgba(0,100,192,0.4)",
          }];
          $scope.datasetOverrideP = [{
            label: "Pink Stuff",
            fill: true,
            lineTension: 0.2,
            borderColor: "rgba(255,105,180,0.4)",
            backgroundColor: "rgba(255,105,180,0.3)",
          }];

          $scope.datasetOverrideC = [{
            backgroundColor: [
              "rgba(255,0,0,0.6)",
              "rgba(0,100,192,0.4)",
              "rgba(255,105,180,0.3)"
            ],
            borderColor: [
              "rgba(255,0,0,1)",
              "rgba(0,100,192,1)",
              "rgba(255,105,180,0.4)"
            ]

          }];

          $scope.onClick = function(points, evt) {
            console.log(points, evt);
          };
          $scope.optionsR = {
            title: {
              display: true,
              text: 'Amount of red stuff in the warehouse',
              fontColor: 'rgba(255,0,0,0.8)',
              fontSize: 16
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            },
          };
          $scope.optionsB = {
            title: {
              display: true,
              text: 'Amount of blue stuff in the warehouse',
              fontColor: 'rgba(0,100,192,0.8)',
              fontSize: 16
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            },
          };
          $scope.optionsP = {
            title: {
              display: true,
              text: 'Amount of pink stuff in the warehouse',
              fontColor: 'rgba(255,105,180,1)',
              fontSize: 16
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            },
          };

          $scope.optionsC = {
            rotation: 0.5 * Math.PI,
            title: {
              display: true,
              text: 'Average amount of stuff through the year',
              fontColor: 'rgba(0,0,0,0.4)',
              fontSize: 16
            },
            legend: {
              display: true
            }
          }
          $scope.seriesC = ['Blue Stuff', 'Red Stuff', 'Pink Stuff'];


      }])
})();