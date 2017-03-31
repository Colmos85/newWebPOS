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
              else if($scope.balance < $scope.paymentAmount) // change is due. PAYMENY AMOUNT LARGER THAN BALANCE
              {
                  if($scope.payments.length === 0) { // first payment
                      payment.type = paymentType;
                      payment.amount = new Decimal($scope.displayPrice($scope.paymentAmount));
                      $scope.payments.push(payment);
                      $scope.makeTransaction(new Decimal($scope.displayPrice(new Decimal($scope.paymentAmount).minus(new Decimal($scope.balance)))));
                      //$scope.balance = $scope.displayPrice(new Decimal(0.00));
                  }else { // second payment
                      payment.type = paymentType;
                      payment.amount = new Decimal($scope.displayPrice($scope.paymentAmount));
                      $scope.payments.push(payment); 
                      $scope.makeTransaction(new Decimal($scope.displayPrice(new Decimal($scope.paymentAmount).minus(new Decimal($scope.balance)))));
                      //$scope.balance = $scope.displayPrice(new Decimal(0.00));
                  }
              }
          }
        }



        $scope.makeTransaction = function(change){

          var transaction = {
              onHold: 0,
              transactionItems: $scope.saleItems,
              employee: AuthService.user,
              changeValue: change 
          };

          if($scope.payments.length >= 1){
              transaction.payment1Type = $scope.payments[0].type; 
              transaction.payment1Value = $scope.payments[0].amount;  
          }
          if($scope.payments.length === 2){
            transaction.payment2Type = $scope.payments[1].type; 
            transaction.payment2Value= $scope.payments[1].amount; 
          }

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
              $scope.payments = [];
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
        $scope.vegetables = $scope.customers;
        $scope.selectedVegetables = [];
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