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
      
      function ($rootScope, $scope, $log, $state, 
                $timeout, $location, $mdDialog, $mdToast, 
                $resource, productsFactory, cashierFactory, customersFactory, 
                transactionsFactory, AuthService, mdHideAutocompleteOnEnter) {

        //$scope.products=[];
        productsFactory.getAllProducts().then(function successCallback(result){
            $scope.products=result.data;
        });

        customersFactory.getAllCustomers().then(function successCallback(result){
            $scope.customers=result.data;
        });

        Decimal.set({ precision: 5, rounding: 4 })

        var empty = new Decimal(0.00);//$scope.displayPrice(0.00);
        empty.toFixed(2);
        $scope.subTotal = empty;
        $scope.tax = empty; // = $scope.displayPrice(0.00);
        $scope.total = empty; // = $scope.displayPrice(0.00);
        $scope.balance = empty; // = $scope.displayPrice(0.00);

        $scope.payments = [{type:'Cash', amount:'50.00'}, {type:'Credit', amount:'60.00'}];

        $scope.saleItems=[];

        /*Hot Pick Buttons*/
        $scope.productsTopRow=[
        {brand:'Microsoft',description:'Office home&business 2017'},
        {brand:'Dell',description:'xps gaming laptop'},
        {btand:'AOC',description:'21inch Monitor'},
        {brand:'Microsoft',description:'Office home&business 2017'},
        {brand:'Dell',description:'xps gaming laptop'}];

        //description, unitPrice, quantity, price



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

          //if( $scope.balance)

          var transaction = {
              onHold: 0,
              payment1Type: paymentType,
              payment1Value: new Decimal($scope.paymentAmount), 
              transactionItems: $scope.saleItems,
              employee: AuthService.user,
              changeValue: 0.00 /* balance - payment amount */
          };

          transactionsFactory.insertTransaction(transaction).then(function successCallback(result){
              $scope.toastMessage("Transaction Made - redirect to print reciept");
              //$scope.products=result.data;

              //clear transaction items & price
              $scope.saleItems = [];
              $scope.subTotal = $scope.displayPrice(0.00);
              $scope.tax = $scope.displayPrice(0.00);
              $scope.total = $scope.displayPrice(0.00); //new Decimal(0.00);
              $scope.balance = $scope.displayPrice(0.00);

              $scope.paymentAmount="";
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
          
          // remove focus

        }

      }])
  
      .directive('mdHideAutocompleteOnEnter', function ($compile) {
        return {
           restrict: 'A',
           require: 'mdAutocomplete',
           link: function(scope, element) {
              element.on('keydown keypress', function($event) {
                 // 13: Enter
                 if ($event.keyCode == 13) {
                    var eAcInput = this.getElementsByTagName('input')[0];
                    eAcInput.blur();
                 }
              });
           },
        };
      });



})();