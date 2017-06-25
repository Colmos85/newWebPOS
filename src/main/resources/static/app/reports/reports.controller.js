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
            [24200.55, 16788.50, 18850.01, 12045.40, 10010.95, 13000.00, 13500.00, 12000.66, 14045.99, 60000.50, 20010.20, 26060.20],
            [10000.00, 29050.00, 30655.95, 2200.00, 20055.95, 24988.60, 30000.00, 22055.95, 40045.99, 54802.22, 30000.00, 46000.00]
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

          // pie chart
          /*$scope.dataSets[3] = [
            [avgArray($scope.dataSets[0][0]), avgArray($scope.dataSets[1][0]), avgArray($scope.dataSets[2][0])]
          ];*/


          // build for each store returned from backend
          $scope.datasetOverrideR = [
          {
            label: "Mallow",
            fill: true,
            lineTension: 0.2,
            borderColor: "rgba(255,0,0,1)",
            backgroundColor: "rgba(255,0,0,0.6)"
          },
          /*{
            label: "Kanturk",
            fill: true,
            lineTension: 0.2,
            borderColor: "rgba(255,0,0,1)",
            backgroundColor: "rgba(255,105,180,0.3)"
          },*/
          {
            label: "Ballincollig",
            fill: true,
            lineTension: 0.2,
            borderColor: "rgba(0,100,192,1)",
            backgroundColor: "rgba(0,100,192,0.4)"
          }];


          // build for each employee retrued in a store
          $scope.datasetOverrideB = [{
            label: "Employees",
            fill: true,
            lineTension: 0.2,
            borderColor: "rgba(0,100,192,1)",
            backgroundColor: "rgba(0,100,192,0.4)",
          }];



          $scope.datasetOverrideP = [{
            label: "General",
            fill: true,
            lineTension: 0.2,
            borderColor: "rgba(255,105,180,0.4)",
            backgroundColor: "rgba(255,105,180,0.3)",
          }];


          // pie chart
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
              text: 'Store revenue comparison',
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
              text: 'Employee Sales comparison',
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
              text: '....',
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