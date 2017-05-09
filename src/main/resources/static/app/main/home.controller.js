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
      'employeesFactory',
      'HomeService',
      'AuthService',
      function ($scope, $rootScope, $log, $state, $timeout, $location, menu, $http, storesFactory, employeesFactory, HomeService, AuthService) {
        /***********************************  Getting Started Page Controller ****************************************/
        

        // Load in stores 
        $scope.selectedStoreIndex = -1;
        $scope.selectedTillIndex = -1;
        $scope.store = null;
        $scope.till = null;
        $scope.stores = [];

        $scope.data = [];
        $scope.labels = [];

        $scope.showPDF = false;

        var someJSONdata = [
            {
               name: 'John Doe',
               email: 'john@doe.com',
               phone: '111-111-1111'
            },
            {
               name: 'Barry Allen',
               email: 'barry@flash.com',
               phone: '222-222-2222'
            },
            {
               name: 'Cool Dude',
               email: 'cool@dude.com',
               phone: '333-333-3333'
            }
         ];

        storesFactory.getAllStores().then(function successCallback(result){
            $scope.stores = result.data;
            
            if(localStorage.getItem('store') !== null)
            {
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

        var docDefinition = {
          content: [
            'First paragraph',
            'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
          ]
        }

        $scope.print = function(){


          /* ********* PDFMAKE *********** */

          /*   
          // makepdf
          var whatsThis = pdfMake.createPdf(docDefinition);//.print();
          console.log("Compuile: ", whatsThis);
          */

          const pdfDocGenerator = pdfMake.createPdf(docDefinition);
          
          //printJS(file);
          var link = "";
          // The will create a link
          pdfDocGenerator.getDataUrl((dataUrl) => { // create link to download file
              const targetElement = document.querySelector('#iframeContainer'); //id of download button?
              const iframe = document.createElement('iframe');
              iframe.src = dataUrl;
              //targetElement.appendChild(iframe);



              link = iframe.src;
              console.log("Link: ",link);  // URI data:application/pdf;Base64,jjhdf .......

              //var fileURL = window.URL.createObjectURL(link);
              //console.log("fileURL: ",fileURL);

              $scope.link = link;

              //window.open(link); - opens in new tab

              //$scope.showPDF = true; // to embed in <object> - does not render??
              //////////////////////////////////////////////////////////////printJS(testFile);
              //var file = new Blob([data], {type: 'application/pdf'});

              //printJS('app/scripts/printjob.pdf'); // directly goes to print in iframe
              //printJS(pdfDocGenerator, 'html');




              //create data in JSON format
              var newdata = [];
              var row = {};
              var info = $scope.data[0];
              for (var i = 0; i < $scope.labels.length; i++) {
                var x = $scope.labels[i];
                console.log("Label: ", x);
                row[x] = "€"+info[i];
              }
              newdata.push(row);

              //printJS({printable: newdata, properties: $scope.labels, type: 'json', header: 'User performance'});

          });

          //var file = new Blob([data], {type: 'application/pdf'});
          //var fileURL = URL.createObjectURL(file); //window.URL.createObjectURL(file);
          //printJS(file.pdf);

          
          //pdfMake.createPdf(docDefinition).print(); // opens a new tab with rendered pdf then tries to print

          //pdfMake.createPdf(docDefinition).download();

          //pdfMake.createPdf(docDefinition).open(); //makes a blob and opens in new tab

          /*pdfMake.createPdf(docDefinition).print();*/



           /* NOT WORKING with CANVAS bar chart*/
          /*html2canvas(document.getElementById('test2id'), {
              onrendered: function (canvas) {
                  var data = canvas.toDataURL();
                  var docDefinition = {
                      content: [{
                          image: data,
                          width: 500,
                      }]
                  };
                  pdfMake.createPdf(docDefinition).print();
              }
          });*/






          /* ********* PRINT.JS *********** */
          /* ********* Good if printing pdf file from link in backend *********** */
          /* ********* Good if printing with html2canvas *********** */
          /* ********* Good for JSON to print in table *********** */
          //printJS('performance-chart', 'html'); //print an element - css required??
          //printJS('performance-chart', 'html');

          /*<button type="button" onclick="printJS('printJS-form', 'html')">
              Print Form
          </button>*/

          /*<button type="button" onclick="printJS({ printable: 'printJS-form', type: 'html', header: 'PrintJS - Form Element Selection' })">
              Print Form with Header
          </button>*/


          /* ********* NG-PRINT *********** */
          /* ****** goes straight to print, no new tab *********** */
          //done on html
          /*<md-button ng-click="print()" ng-print print-element-id="sales-summary">
               Print
          </md-button>*/


          /* ********** KENDO ********* */ // WORKS TO SAVE IMAGE OF HTML
         /* console.log("Called print() function"); // does not work on testidtwo, but works on testid
          kendo.drawing.drawDOM($("#linechart")).then(function(group) {
              kendo.drawing.pdf.saveAs(group, "Converted PDF.pdf"); //saves the html element as pdf
              var draw = kendo.drawing;
              console.log(draw);
          });*/
        }

        
        

        
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



        /*******************************   Performance Chart **************************************/

        //Load data for chart..


        employeesFactory.getEmployeeWeeklyPerformance(AuthService.user.id).then(function successCallback(result){
            var data = result.data;
            $scope.data = [data.data];
            $scope.labels = data.labels;
            console.log("Weekly returns data: ", $scope.data);
            console.log("Weekly returns labels: ", $scope.labels);
        });

        $scope.series = ['Sales'];
        /*$scope.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];      
        $scope.data = [[6542, 5990, 8001, 8110, 5645, 5555, 4950, 8001, 8110, 5645, 5555, 5785]];*/

        $scope.onClick = function (points, evt) {
          console.log(points, evt);
        };
        //$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
        $scope.options = {
          responsive: true,
          maintainAspectRatio: true,
          lineTension: 0.2,
          title: {
            display: true,
            text: 'Sales Totals',
            fontColor: 'rgba(0,0,0,0.8)',
            fontSize: 16
          },
          scales: {
            yAxes: [
              {
                id: 'y-axis-1',
                type: 'linear',
                display: true,
                position: 'left'
              }
            ]
          }
        };

        $scope.performanceBy = "weekly";
        $scope.getData = function(value){
          
          if(value == "weekly"){
            console.log("Get ", value, " data");
            //get weekly data
            employeesFactory.getEmployeeWeeklyPerformance(AuthService.user.id).then(function successCallback(result){
                var data = result.data;
                console.log("Weekly returns: ", data);
                $scope.data = [data.data];
                $scope.labels = data.labels;
            });
          }else{
            console.log("Get ", value, " data");
            // get monthly data
            employeesFactory.getEmployeeMonthlyPerformance(AuthService.user.id).then(function successCallback(result){
                var data = result.data;
                console.log("Weekly returns: ", data);
                $scope.data = [data.data];
                $scope.labels = data.labels;
            });
          }
        }


/*        $scope.getWeeklyData = function(){
          console.log("Get weekly data");
        }

        $scope.getMonthlyData = function(){
          console.log("Get monthly data");
        }*/



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