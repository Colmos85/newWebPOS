(function(){
  'use strict';

  /* reference to module */
 angular.module('myApp.cashier.module')

    .controller('cashierCtrl', [
      '$rootScope',
      '$scope',
      '$log',
      '$state',
      '$timeout',
      '$location',
      '$mdDialog',
      '$mdToast',
      '$resource',
      'productsFactory',
      'cashierFactory',
      'customersFactory',
      'transactionsFactory',
      'AuthService',
      'HomeService',
      
      function ($rootScope, $scope, $log, $state, 
                $timeout, $location, $mdDialog, $mdToast, 
                $resource, productsFactory, cashierFactory, customersFactory, 
                transactionsFactory, AuthService, HomeService, mdHideAutocompleteOnEnter) {

        var currentTransaction = {};

        $scope.showSalesSummary = false;

        //$scope.products=[];
        productsFactory.getAllProducts().then(function successCallback(result){
            $scope.products=result.data;
        });

        customersFactory.getAllCustomers().then(function successCallback(result){
            $scope.customers=result.data;
        });

        Decimal.set({ precision: 5, rounding: 4 })

        var empty = new Decimal(0.00);
        empty.toFixed(2);
        $scope.subTotal = empty;
        $scope.tax = empty;
        $scope.total = empty; 
        $scope.balance = empty; // = $scope.displayPrice(0.00);

        $scope.saleItems=[];
        $scope.payments=[];

        /*Hot Pick Buttons - Load in from database*/
        $scope.productsTopRow=[
        {brand:'Microsoft',description:'Office home&business 2017'},
        {brand:'Dell',description:'xps gaming laptop'},
        {btand:'AOC',description:'21inch Monitor'},
        {brand:'Microsoft',description:'Office home&business 2017'},
        {brand:'Dell',description:'xps gaming laptop'}];

        $scope.removeProduct = function(barcode)
        {
            for (var i = 0; i < $scope.saleItems.length; i++) {
              if($scope.saleItems[i].product.barcode === barcode){
                  if($scope.saleItems[i].quantity === 1) // then remove from the list
                  {
                    $scope.saleItems.splice(i,1);
                    $scope.updatePrices();
                  }
                  else{
                    $scope.saleItems[i].quantity --;
                    $scope.saleItems[i].unitTotalDisplayPrice = $scope.displayPrice(new Decimal($scope.saleItems[i].product.retailPriceInc).times(new Decimal($scope.saleItems[i].quantity)));
                    // update subTotal, tax and total
                    $scope.updatePrices();
                  }
              }
            }
        }

        $scope.addProduct = function(barcode)
        {
            // check items in transaction already
            var currentSaleItem = false;
            for (var i = 0; i < $scope.saleItems.length; i++) {
              if($scope.saleItems[i].product.barcode === barcode){
                  $scope.saleItems[i].quantity ++;
                  $scope.saleItems[i].unitTotalDisplayPrice = $scope.displayPrice(new Decimal($scope.saleItems[i].product.retailPriceInc).times(new Decimal($scope.saleItems[i].quantity)));
                  // update subTotal, tax and total
                  $scope.updatePrices();
                  // set flag to true
                  currentSaleItem = true;
              }
            }
            
            // if item is not in list already then search item from all products
            if(!currentSaleItem)
            {

              for (var i = 0; i < $scope.products.length; i++) {
                if($scope.products[i].barcode === barcode)
                {
                    // push found object to the array of sale items
                    var transactionItem = {
                      product:$scope.products[i]
                    } 
                    $scope.saleItems.push(transactionItem);
                    // get the object and add a property for quantity and unitDisplayPrice
                    for (var j = 0; j < $scope.saleItems.length; j++) {
                      if($scope.saleItems[j].product.barcode === $scope.products[i].barcode){
                          $scope.saleItems[j].quantity = 1; // number of this product
                          $scope.saleItems[j].unitDisplayPrice = $scope.displayPrice($scope.products[i].retailPriceInc);
                          $scope.saleItems[j].unitTotalDisplayPrice = $scope.displayPrice($scope.products[i].retailPriceInc); // salesPriceIncVat * purchaseQuantity
                      }
                    }
                    // change subTotal, tax and total - balance
                    $scope.updatePrices();
                }
              }
            }
            //$scope.inputProduct = ""; /* Used when search box was an input, not md-autocomplete
            $scope.selectedItem = null;
            $scope.searchText = '';
        }


        /* Function to update listing prices for the transaction*/
        $scope.updatePrices = function(){
          var subTotal = new Decimal(0.00);//0.00;
          var tax = new Decimal(0.00);//0.00;
          var total = new Decimal(0.00);//0.00;
          var balance = new Decimal(0.00);//0.00;
          for (var i = 0; i < $scope.saleItems.length; i++) {
            var calcSubTotal = new Decimal($scope.saleItems[i].product.retailPriceEx).times(new Decimal($scope.saleItems[i].quantity)); //$scope.displayPrice($scope.displayPrice($scope.saleItems[i].retailPriceEx) * $scope.saleItems[i].purchaseQuantity);
            subTotal = calcSubTotal.plus(subTotal);
            
            var calcTotal = new Decimal($scope.saleItems[i].product.retailPriceInc).times(new Decimal($scope.saleItems[i].quantity)); 
            total = calcTotal.plus(total);

            tax = total.minus(subTotal);
            balance = total;

          }
          $scope.subTotal = $scope.displayPrice(subTotal);
          $scope.total = $scope.displayPrice(total);
          $scope.tax = $scope.displayPrice(tax);
          $scope.balance = $scope.displayPrice(balance);
        }


        /* Rounds prices to two decimal places for display purposes*/
        $scope.displayPrice = function(price)
        {
          var stringPrice = price.toFixed(2);
          return stringPrice;
        }


        $scope.makePayment = function(paymentType){

          var payment = {}; 
          if($scope.saleItems.length >= 1)
          {
              // cash or credit button pressed with no payment Value - indicate the balance is being paid off exactly in one go
              if(($scope.paymentAmount === null) || ($scope.paymentAmount === "") || (typeof $scope.paymentAmount == "undefined")){ 
                  if($scope.payments.length === 0) { // first payment
                    payment.type = paymentType;
                    payment.amount = $scope.displayPrice(new Decimal($scope.balance));
                    $scope.payments.push(payment);
                    $scope.makeTransaction(0.00);
                  }else { // second payment
                    payment.type = paymentType;
                    payment.amount = $scope.displayPrice(new Decimal($scope.balance));
                    $scope.payments.push(payment);
                    $scope.makeTransaction(0.00);
                  }
              }else if($scope.balance > $scope.paymentAmount){ //PAYMENT AMOUNT LESS THAN BALANCE
                  if($scope.payments.length === 0) { // first payment - cant be second as it is restricted to two payments (second payment must be equal to or more than the balance)
                    // change balance
                    $scope.balance = $scope.displayPrice(new Decimal($scope.balance).minus(new Decimal($scope.paymentAmount)));
                    payment.type = paymentType;
                    payment.amount = $scope.displayPrice($scope.paymentAmount);
                    $scope.paymentAmount = "";
                    $scope.payments.push(payment); 
                  }else if($scope.payments.length === 1){ //toast message saying the payment must match or be greater than balance
                    $scope.toastMessage("Second Payment must be equal or greater than the balance!!"); // should be alert??
                    $scope.paymentAmount = "";
                  } 
              }
              else if($scope.balance <= $scope.paymentAmount) // change is due. PAYMENY AMOUNT LARGER THAN BALANCE
              {
                  if($scope.payments.length === 0) { // first payment
                      payment.type = paymentType;
                      payment.amount = $scope.displayPrice($scope.paymentAmount);
                      $scope.payments.push(payment);
                      $scope.makeTransaction(new Decimal($scope.displayPrice(new Decimal($scope.paymentAmount).minus(new Decimal($scope.balance)))));
                      //$scope.balance = $scope.displayPrice(new Decimal(0.00));
                  }else { // second payment
                      payment.type = paymentType;
                      payment.amount = $scope.displayPrice($scope.paymentAmount);//new Decimal($scope.displayPrice($scope.paymentAmount));
                      $scope.payments.push(payment); 
                      $scope.makeTransaction(new Decimal($scope.displayPrice(new Decimal($scope.paymentAmount).minus(new Decimal($scope.balance)))));
                      //$scope.balance = $scope.displayPrice(new Decimal(0.00));
                  }
              }
          }
        }


        $scope.backToSale = function(){
          $scope.showSalesSummary = false;
        }


        $scope.finishTransaction = function()
        {
            console.log("Finish transaction");
            $scope.saleItems = [];
            $scope.subTotal = $scope.displayPrice(0.00);
            $scope.tax = $scope.displayPrice(0.00);
            $scope.total = $scope.displayPrice(0.00); //new Decimal(0.00);
            $scope.balance = $scope.displayPrice(0.00);

            $scope.paymentAmount="";
            $scope.payments = [];

            $scope.selectedCustomers=[];

            $scope.showSalesSummary = false;
        }




        $scope.print = function() {
          console.log("Transaction Object: ", $scope.transaction);
          function buildTableBody(data, columns) {
              var tbody = [];

              tbody.push(columns); // push the column headers to the object

              data.forEach(function(row) { //row is the transaction item object
                  console.log("NUM 1: ", row);
                  var dataRow = [];

                  dataRow.push(row.quantity.toString());
                  dataRow.push(row.product.description.toString());
                  dataRow.push(row.product.retailPriceInc.toString());

                  /*var counter = 1;
                  columns.forEach(function(column) {
                      console.log("NUM 2: ", row[column]);
                      if(counter == 2){ // product object
                        dataRow.push(row[column].product.description.toString());
                      }
                      else if(counter == 3){ dataRow.push(row[column].product.retailPriceInc.toString());}
                      else{
                        dataRow.push(row[column].toString());
                      }
                      counter ++;
                  })*/

                  tbody.push(dataRow);
              });

              /*var returnThis = {
                table
                      widths: [100, '*', '*', 50],
                      body: [
                        tbody
                      ]
              }*/
              /*var returnThis = {
                table: {
                  widths: [100, '*', 50],
                  body: [
                    tbody
                  ]
                }
              }*/
              

              return tbody;
          }

          function table(data, columns) {
              return {
                  table: {
                      headerRows: 1,
                      body: buildTableBody(data, columns)
                  }
              };
          }
          //var itemsObj = [{quantity:}, {desc: }, {price: }];
          var receipt = {
            content: 
            [
                { text: $scope.transaction.store.name, style: 'header', alignment: 'center'},
                { text: $scope.transaction.store.address1, style: 'header', alignment: 'center'},
                { text: $scope.transaction.store.address2, style: 'header', alignment: 'center'},
                { text: $scope.transaction.store.address3, style: 'header', alignment: 'center'},
                /*table(externalDataRetrievedFromServer, ['name', 'age'])*/
                {
                  style: 'tableExample',
                  table: {
                    widths: [100, '*', '*', 50],
                    body: [
                      ['width=100', 'star-sized', 'width=200', 'star-sized'],
                      ['fixed-width cells have exactly the specified width', {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}, {text: 'nothing interesting here', italics: true, color: 'gray'}]
                    ]
                  }
                },
                {
                bold: true,
                ul: [
                    'auto',
                    'star',
                    'fixed value'
                    ]
                },
                /*{
                  style: 'tableExample',
                  table: table($scope.transaction.transactionItems, ['quantity', 'description', 'price'])
                },*/
                {
                  style: 'tableExample',
                  table: {
                    widths: [100, '*', 100],
                    body: [table($scope.transaction.transactionItems, ['quantity', 'description', 'price'])]
                  }
                },
                /*table($scope.transaction.transactionItems, ['quantity', 'description', 'price'])*/
            ],
              styles: {
                header: {
                  fontSize: 18,
                  bold: true,
                  margin: [0, 0, 0, 10]
                },
                subheader: {
                  fontSize: 16,
                  bold: true,
                  margin: [0, 10, 0, 5]
                },
                tableExample: {
                  margin: [0, 5, 0, 15]
                },
                tableHeader: {
                  bold: true,
                  fontSize: 13,
                  color: 'black'
                }
            },
            defaultStyle: {
              // alignment: 'justify'
            }

          }

          pdfMake.createPdf(receipt).print(); //open in new tab and print
            /////// Not any better than ng-print - printJS('sales-summary', 'html');
            //var printContents = document.getElementById("sales-summary").innerHTML;
            //var popupWin = window.open('', '_blank', 'width=450,height=700');
            //popupWin.document.open();
            //popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
            //popupWin.document.close();
            //$mdDialog.hide();
            //$scope.showSalesSummary = false; 
        };

        $scope.makeTransaction = function(change){

          var transaction = {
              onHold: 0,
              transactionItems: $scope.saleItems,
              employee: AuthService.user,
              changeValue: $scope.displayPrice(change),// change.toFixed(2),
              store: HomeService.store,
              till: HomeService.till
          };

          currentTransaction = transaction;

          $scope.transaction = transaction; 

          console.log("This trasnaction: ", $scope.transaction);

          if($scope.selectedCustomers.length > 0)
          {
              transaction.customer = $scope.selectedCustomers[0];
          }

          if($scope.payments.length >= 1){
              transaction.payment1Type = $scope.payments[0].type; 
              transaction.payment1Value = $scope.payments[0].amount;  
          }
          if($scope.payments.length === 2){
            transaction.payment2Type = $scope.payments[1].type; 
            transaction.payment2Value= $scope.payments[1].amount; 
          }

          $scope.showSalesSummary = true;

          //var params = {'transaction': transaction, 'till':HomeService.till};
          transactionsFactory.insertTransaction(transaction).then(function successCallback(result){
              $scope.toastMessage("Transaction Complete");
              //$scope.products=result.data;

              

              /*$mdDialog.show({
                locals:{
                  subTotal: $scope.subTotal,
                  total: $scope.total,
                  tax: $scope.tax,
                  payments: $scope.payments,
                  transaction: transaction
                },
                controller: DialogController,
                templateUrl: 'app/cashier/sale.summary.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose:false,
                fullscreen: false // Only for -xs, -sm breakpoints.
              })
              .then(function(answer) {
                $scope.status = 'Brand Saved "' + answer + '".';
              }, function() {
                $scope.status = 'You cancelled the dialog.';
              });

              function DialogController($scope, $mdDialog, subTotal, total, tax, payments, transaction) {

                $scope.subTotal = subTotal;
                $scope.total = total;
                $scope.tax = tax
                $scope.payments = payments;
                $scope.transaction = transaction;

                console.log("Transaction: ", $scope.transaction);

                $scope.print = function() {
                  var printContents = document.getElementById("sales-summary").innerHTML;
                  var popupWin = window.open('', '_blank', 'width=300,height=300');
                  popupWin.document.open();
                  popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
                  popupWin.document.close();
                  $mdDialog.hide();
                };

                $scope.email = function() {
                  $mdDialog.hide();
                };
        
                $scope.close = function() {
                  $mdDialog.cancel();
                };

              }; // END OF DialogController*/

              //clear transaction items & price

          });

          

        } 

        $scope.toastMessage = function(message) {
          $mdToast.show(
            $mdToast.simple()
              .textContent(message)
              .hideDelay(3000)
          );
        };





        /******************* AutoComplete Search Bar ******************/

        $scope.selectedItemChange = function(item) {
          if(typeof item !== 'undefined')
          {
            $scope.addProduct(item.barcode);
          }
          // remove text from search bar
          $scope.selectedItem = null;
          $scope.searchText = '';
          
          // remove focus ?
        }

        /******************* Add Customer chip ******************/

        $scope.readonly = false;
        $scope.selectedItem = null;
        $scope.searchText = null;
        //$scope.custList = $scope.customers;
        $scope.selectedCustomers = [];
        $scope.numberBuffer = '';
        $scope.autocompleteDemoRequireMatch = true;

        /**
         * Return the proper object when the append is called.
         */
        $scope.transformChip = function(chip) {
          // If it is an object, it's already a known chip
          if (angular.isObject(chip)) {
            return chip;
          }
          // Otherwise, create a new one ************************** CHANGE THIS
          return { name: chip, type: 'new' }
        }


      }])

      
      .controller('previousSalesCtrl', [
          '$rootScope',
          '$scope',
          '$log',
          '$state',
          '$timeout',
          '$location',
          '$mdDialog',
          '$mdToast',
          '$resource',
          'productsFactory',
          'cashierFactory',
          'customersFactory',
          'transactionsFactory',
          'AuthService',
          'HomeService',
          
          function ($rootScope, $scope, $log, $state, 
                    $timeout, $location, $mdDialog, $mdToast, 
                    $resource, productsFactory, cashierFactory, customersFactory, 
                    transactionsFactory, AuthService, HomeService) {

          var vm = this;

          Decimal.set({ precision: 5, rounding: 4 })

          var empty = new Decimal(0.00);
          empty.toFixed(2);

          // Load Brands
          transactionsFactory.getEmployeeLatestTransactions(HomeService.till.id).then(function successCallback(result){
                vm.prevoiusTransactions = result.data;
                // after loading in past twenty transactions - need to do some calculations..
                vm.calculateTotals();

              }, function errorCallback(response) {
              console.log("Unsuccessful - load last twenty transactions");
          });

          vm.calculateTotals = function(){
             for (var i = 0; i < vm.prevoiusTransactions.length; i++) {
                  var total = empty;
                  for (var j = 0; j < vm.prevoiusTransactions[i].transactionItems.length; j++) {
                      var calcTotal = new Decimal(vm.prevoiusTransactions[i].transactionItems[j].product.retailPriceInc).times(new Decimal(vm.prevoiusTransactions[i].transactionItems[j].quantity));
                      vm.prevoiusTransactions[i].transactionItems[j].lineTotalPrice = calcTotal.toFixed(2);
                      total = calcTotal.plus(total);
                  }
                  vm.prevoiusTransactions[i].totalIncVat = total.toFixed(2);
              }
          }

         
      }])  // END of Brands Controller

      .controller('opencloseCtrl', [
          '$rootScope',
          '$scope',
          '$log',
          '$state',
          '$timeout',
          '$location',
          '$mdDialog',
          '$mdToast',
          '$resource',
          'productsFactory',
          'cashierFactory',
          'employeesFactory',
          'AuthService',
          'HomeService',
          
          function ($rootScope, $scope, $log, $state, 
                    $timeout, $location, $mdDialog, $mdToast, 
                    $resource, productsFactory, cashierFactory, employeesFactory, 
                    AuthService, HomeService) {

          var vm = this;

          vm.openSession = true;

          Decimal.set({ precision: 5, rounding: 4 })

          var empty = new Decimal(0.00);
          empty.toFixed(2);

          vm.numTransactions = 0;
          vm.closeReg = [{cardTotals:"0.00"}, {cashTotals:"0.00"}, {allTotal:"0.00"}];
          vm.total = 0.00;
          vm.totalCounted = 0.00;
          vm.totalDifference = 0.00;

          vm.totalCashCounted = null;
          vm.totalCardCounted = null;

          vm.totalCashDifference = 0.00;
          vm.totalCardDifference = 0.00;
          
          /*var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
          var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];*/

          // Get current transaction
          employeesFactory.getEmployeeActiveTillSession(AuthService.user.id).then(function successCallback(result){
                if(result.status === 204)
                {
                    vm.openSession = false; // no open till/sales session for logged in Employee
                }
                else{
                    vm.currentSession = result.data;
                    vm.numTransactions = vm.currentSession.transactions.length;
                    var date = moment(vm.currentSession.openDateTime, 'DD-MM-YYYY HH:mm:ss')
                    vm.openDate = moment(date).format('dddd MMMM Do YYYY, HH:mm:ss');

                    // get totals from current session
                    employeesFactory.getEmployeeActiveTillSessionTotals(AuthService.user.id).then(function successCallback(result){
                          vm.closeReg = result.data;
                          var total =  new Decimal(vm.closeReg.cashTotals).plus(vm.closeReg.cardTotals);
                          vm.closeReg.allTotal = total.toFixed(2);

                          var recordedTotal = new Decimal(new Decimal(200.00)).plus(new Decimal(vm.closeReg.allTotal)); 
                          vm.total = recordedTotal.toFixed(2);

                          // Initally set these..
                          vm.totalCashDifference = -(vm.closeReg.cashTotals);
                          vm.totalCardDifference = -(vm.closeReg.cardTotals);
                          var initalDifference = new Decimal(vm.closeReg.cashTotals).plus(new Decimal(vm.closeReg.cardTotals)).plus(new Decimal(200));
                          vm.totalDifference = -initalDifference;
                    });
                }

                //$scope.numTransactions = len;
              }, function errorCallback(response) {
              console.log("Unsuccessful - No open till session????");
          });


          //vm.totalCounted = new Decimal(200.00).toFixed(2);

          vm.onCashCountedChange = function()
          {
            var totalCashDifference = new Decimal(vm.totalCashCounted).minus(new Decimal (vm.closeReg.cashTotals));
            vm.totalCashDifference = totalCashDifference.toFixed(2);
            if(vm.totalCardCounted !== null){
              var totalCounted =  new Decimal(vm.totalCashCounted).plus(new Decimal(vm.totalCardCounted));
              vm.totalCounted = totalCounted.toFixed(2);
            }else{
              var totalCounted =  new Decimal(vm.totalCashCounted);
              vm.totalCounted = totalCounted.toFixed(2);
            }
            
            var totalDifference = new Decimal(vm.totalCashDifference).plus(new Decimal(vm.totalCardDifference));
            vm.totalDifference = totalDifference.toFixed(2);
          }

          vm.onCardCountedChange = function()
          {
            var totalCardDifference = new Decimal(vm.totalCardCounted).minus(new Decimal(vm.closeReg.cardTotals));
            vm.totalCardDifference = totalCardDifference.toFixed(2);
            if(vm.totalCashCounted !== null){
              var totalCounted =  new Decimal(vm.totalCashCounted).plus(new Decimal(vm.totalCardCounted));
              vm.totalCounted = totalCounted.toFixed(2);
            }else{
              var totalCounted =  new Decimal(vm.totalCardCounted);
              vm.totalCounted = totalCounted.toFixed(2);
            }

            var totalDifference = new Decimal(vm.totalCashDifference).plus(new Decimal(vm.totalCardDifference));
            vm.totalDifference = totalDifference.toFixed(2);
          }

          
          /*vm.totalCounted = 
          vm.totalDifference = */

         
      }])  // END of Open/Close Controller



})();