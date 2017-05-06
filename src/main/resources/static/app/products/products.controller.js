(function(){
  'use strict';

  /* reference to module */
 angular.module('myApp.products.module')

    .controller('productsCtrl', [
      '$rootScope',
      '$log',
      '$http',
      '$q',
      '$state',
      '$scope',
      '$timeout',
      '$location',
      '$mdDialog',
      '$resource',
      'productsFactory',
      'storesFactory',
      'brandsFactory',
      'taxBandsFactory',
      'stockFactory',
      '$mdToast',

      function ($rootScope, $log, $http, $q, $state, $scope, 
                $timeout, $location, $mdDialog, $resource, productsFactory, storesFactory, brandsFactory, taxBandsFactory, stockFactory, $mdToast) {
    	  
    	var vm = this;

      // load / reload
    	vm.reload = function(productId) {
        // Load stores 
        storesFactory.getAllStores().then(function successCallback(result){
            vm.stores=result.data;
        });
        // Load products 
        productsFactory.getAllProducts().then(function successCallback(result){
            vm.products=result.data;
        });
        // Load Brands
        brandsFactory.getAllBrands().then(function successCallback(result){
            vm.brands = result.data;
        });
        // Load Tax Bands
        taxBandsFactory.getAllTaxBands().then(function successCallback(result){
            vm.taxBands = result.data;
        });
      };

      vm.reload();


      Decimal.set({ precision: 5, rounding: 4 })

      var empty = new Decimal(0.00);
      empty.toFixed(2);

      // function to load quantitys on accordian table for store/product 
      vm.getStoreQuantity = function(storeStock, productStock)
      {
        var quantity = 0;
        for (var i = 0, len = storeStock.length; i < len; i++) {
          for(var j = 0, len1 = productStock.length; j < len1; j++){
            if (storeStock[i].id === productStock[j].id) {
              return storeStock[i].quantity;
            }
          } 
        }  
        return quantity;
      }

      vm.removeItem = function(product) {
          console.log("selected product to delete", product);
          productsFactory.deleteProduct(product.id).then(function successCallback(result){


              var index = vm.products.indexOf(product);
              console.log("index", index);
              vm.products.splice(index, 1);

              vm.toastMessage("Product deleted successfully");
          });
      };

      vm.editItem = function(product, event) {
          console.log("selected product to edit", product);
          vm.openProductForm(product, event);
      };

      vm.toastMessage = function(message) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(message)
            .hideDelay(3000)
        );
      };

	    vm.openProductForm = function(product, event) {
          // product may be null if new product or an object if existing

	        $mdDialog.show({
            //isolateScope: false,
            locals:{
              brands: vm.brands,
              stores: vm.stores,
              taxBands: vm.taxBands,
              selectedProduct: product
            },
	          controller: DialogController,
	          templateUrl: 'app/products/productForm.html',
	          parent: angular.element(document.body),
	          targetEvent: event,
	          clickOutsideToClose:true,
	          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
	        })
	        .then(function(answer) {
	          $scope.status = 'Product Saved "' + answer + '".';
	        }, function() {
	          $scope.status = 'You cancelled the dialog.';
	        });
	     };

      function DialogController($scope, $mdDialog, brands, stores, taxBands, selectedProduct, 
                                brandsFactory, storesFactory, productsFactory, stockFactory) {
          // inject product from parent ctrl and set to dialogs isolated scope variable

          $scope.selectedBrandIndex = -1;
          $scope.selectedTaxIndex = -1;

          $scope.headerName = "...";
          $scope.brands = brands;
          $scope.stores = stores;
          $scope.taxBands = taxBands;

          var update = false;
          
          $scope.addQuantity = {};
          $scope.currentStock = {}; // say an array for each store???

          if(angular.isUndefined(selectedProduct) || selectedProduct === null)
          {
            $scope.headerName = "New Product Form!";
            $scope.barcodeDisabled = false;
          }
          else
          {
            update = true;
            $scope.barcodeDisabled = true; // disable the barcode input
            $scope.headerName = "Edit Product";
            $scope.tradePriceEx = selectedProduct.tradePriceEx.toFixed(2);//.toFixed(2);
            $scope.description = selectedProduct.description;
            $scope.barcode = selectedProduct.barcode;
            $scope.markup = selectedProduct.markup.toFixed(3);
            
            //$scope.brand = selectedProduct.brand;
            for (var i = 0; i < brands.length; i++) {
                if (angular.equals(brands[i], selectedProduct.brand)) {$scope.selectedBrandIndex = i;
                }
            }
            for (var i = 0; i < taxBands.length; i++) {
                if (angular.equals(taxBands[i], selectedProduct.taxBand)) {$scope.selectedTaxIndex = i;
                }
            }

            $scope.salesPriceEx = selectedProduct.retailPriceEx.toFixed(2);
            $scope.salesPriceInc = selectedProduct.retailPriceInc.toFixed(2);


            for (var i = 0, len = stores.length; i < len; i++) {
                $scope.currentStock[i] = vm.getStoreQuantity(stores[i].stock, selectedProduct.stock);
            };
            
          };


          $scope.formatTradePriceEx = function()
          {   
              if($scope.tradePriceEx > 0)
              {
                  $scope.tradePriceEx = parseFloat($scope.tradePriceEx).toFixed(2);
              }
          }
          $scope.formatMarkup = function()
          {
             if($scope.salesPriceEx > 0 /*$scope.product.markup.length !== 0 || typeof $scope.markup !== 'undefined'*/)
              {
                  $scope.markup = parseFloat($scope.markup).toFixed(3);
              }
          }
          $scope.formatSalesPriceEx = function()
          {
             if($scope.salesPriceEx > 0 )
              {
                  $scope.salesPriceEx = parseFloat($scope.salesPriceEx).toFixed(2);
              }
          }
          $scope.formatSalesPriceInc = function()
          {
              if($scope.salesPriceInc > 0 )
              {
                  $scope.salesPriceInc = parseFloat($scope.salesPriceInc).toFixed(2);
              }
          }

          // calculations for price???
          $scope.tradePriceExChange = function() {
            if($scope.tradePriceEx <= 0 )
            {
              $scope.markup = "";
              $scope.salesPriceEx = "";
              $scope.salesPriceInc = "";
            }
            if($scope.markup > 0 )
            {
                var markup = ($scope.markup / 100) + 1; 
                $scope.salesPriceEx = ($scope.tradePriceEx * markup).toFixed(2);
                if(typeof $scope.taxBand !== 'undefined')
                {
                    var taxBand = ($scope.taxBand.rate / 100) + 1; 
                    $scope.salesPriceInc = ($scope.salesPriceEx * taxBand).toFixed(2);
                }
            }
          }; 

          $scope.markupChange = function() {
            if($scope.tradePriceEx <= 0 || $scope.markup <= 0)
            {
              $scope.salesPriceEx = "";
              $scope.salesPriceInc = "";
            }
            if($scope.tradePriceEx > 0 && $scope.markup > 0)
            {
                var markup = ($scope.markup / 100) + 1; 
                $scope.salesPriceEx = ($scope.tradePriceEx * markup).toFixed(2);
                if(typeof $scope.taxBand !== 'undefined')
                {
                    var taxBand = ($scope.taxBand.rate / 100) + 1; 
                    $scope.salesPriceInc = ($scope.salesPriceEx * taxBand).toFixed(2);
                }
            }
          };

          $scope.salesPriceExChange = function() {
            if($scope.salesPriceEx <= 0 )
            {
              $scope.markup = "";
              $scope.salesPriceInc = "";
            }
            // change the markup based on trade price
            if($scope.tradePriceEx > 0)
            {
                var markup = $scope.salesPriceEx / $scope.tradePriceEx;
                markup = (markup - 1) * 100;
                $scope.markup = markup.toFixed(3);
                console.log($scope.taxBand);
                if(typeof $scope.taxBand !== 'undefined')
                {
                    var taxBand = ($scope.taxBand.rate / 100) + 1; 
                    $scope.salesPriceInc = ($scope.salesPriceEx * taxBand).toFixed(2);
                }
            }
          };


          $scope.taxChanged = function() {
            if(typeof $scope.salesPriceEx !== 'undefined' || $scope.salesPriceEx > 0)
                {
                    var taxBand = ($scope.taxBand.rate / 100) + 1; 
                    $scope.salesPriceInc = ($scope.salesPriceEx * taxBand).toFixed(2);
                }

          }

          $scope.salesPriceIncChange = function() {
            console.log("Sales Price Inc - changed");
            if($scope.salesPriceInc <= 0 )
            {
                $scope.salesPriceInc = "";
            }
            if($scope.salesPriceInc > 0 )
            {
                // change ex vat price
                var tax = ($scope.taxBand.rate / 100) + 1; 
                $scope.salesPriceEx = ($scope.salesPriceInc / tax).toFixed(2);
                if($scope.tradePriceEx > 0)
                {
                    var markup = $scope.salesPriceEx / $scope.tradePriceEx;
                    markup = (markup - 1) * 100;
                    $scope.markup = markup.toFixed(3);
                }
            }
          };



          $scope.hide = function() {
            $mdDialog.hide();
          };
  
          $scope.cancel = function() {
            $mdDialog.cancel();
          };

          $scope.clear = function() {
            // set all model variables to "";
          };
  
          $scope.save = function(answer) {

            // Create the product object
            var product = {
              barcode : $scope.barcode,
              description : $scope.description,
              tradePriceEx : $scope.tradePriceEx,
              markup : $scope.markup,
              retailPriceEx : $scope.salesPriceEx,
              retailPriceInc : $scope.salesPriceInc,
              stock:[],
              taxBand: $scope.taxBand,
              brand: $scope.brand
            };

            // update stock in product object
            for(var index = 0; index < stores.length; index++){
              var thisStock = {
                quantity : $scope.addQuantity[index],
                store: stores[index]
              };
              product.stock.push(thisStock);
            };

            if(update) // edit button pressed
            {
              productsFactory.updateProduct(selectedProduct.id, product).then(
                function successCallback(response) {
                  product.id = response.data.id; // return new product id
                  // refresh the list of products and quantity (less efficient but easier for now)
                  vm.reload();
                  vm.toastMessage("Product Updated");
                  $mdDialog.hide(answer);
                });
            }
            else // else new product button was pressed
            {
              // send request to factory to create new Product in the database
              productsFactory.insertProduct(product).then(
                function successCallback(response) {
                  product.id = response.data.id;
                  // refresh the list of products and quantity (less efficient but easier for now)
                  vm.reload();
                  vm.toastMessage("Product added successfully");
                  $mdDialog.hide(answer);
                }, function errorCallback(response) {
                  if(response.status === 409)
                  {
                    console.log("error - 409");
                    vm.toastMessage(response.errorMessage);
                  }
              });

            }; // end of else
          };// end of save function
       }; // end of Dialog Controller Function
	     
    }]) // END OF productsCtrl
  
    .controller('brandsCtrl', [
        '$rootScope',
        '$scope',
        '$log',
        '$mdDialog',
        'brandsFactory',/*
        'recordAvailabilityValidator',*/

        function($rootScope, $scope, $log, $mdDialog, brandsFactory/*, recordAvailabilityValidator*/) {

          var vm = this;

          // Load Brands
          brandsFactory.getAllBrands().then(function successCallback(result){
              vm.brands = result.data;
              console.log("Success load brands into Controller");
              }, function errorCallback(response) {
              console.log("Unsuccessful - load brands into Controller");
          });

          vm.openBrandForm = function(event) {
            $mdDialog.show({
              controller: DialogController,
              templateUrl: 'app/products/brandForm.html',
              parent: angular.element(document.body),
              targetEvent: event,
              clickOutsideToClose:true,
              fullscreen: false // Only for -xs, -sm breakpoints.
            })
            .then(function(answer) {
              $scope.status = 'Brand Saved "' + answer + '".';
            }, function() {
              $scope.status = 'You cancelled the dialog.';
            });
          };

          function DialogController($scope, $mdDialog, brandsFactory/*, recordAvailabilityValidator*/) {

           ///////////$scope.brandForm.brandName.$setValidity('validationError', true);

            $scope.hide = function() {
              $mdDialog.hide();
            };
    
            $scope.cancel = function() {
              $mdDialog.cancel();
            };

            $scope.clear = function() {
              //$mdDialog.cancel();
              // set all model variables to "";
            };
    
            $scope.save = function(answer) {

              var brand = {
                brandName : $scope.brand.brandName
              };

              brandsFactory.createBrand(brand).then(function successCallback(response) {
                brand.id = response.data.id;
                vm.brands.push(brand);
                /////brandForm.brand.brandName.$error.validationError = true; //$setValidity('custom-err', false); //form.field1.$error.validationError = true;
                $mdDialog.hide(answer);
              }, function errorCallback(response) {
                if(response.status === 409)
                {
                  console.log("error - 409");
                }
                ////////$scope.brandForm.brandName.$setValidity('validationError', false);
                ////////brandForm.brand.brandName.$error.validationError = false; // $setValidity('custom-err', false); //$error.validationError = true;//inputName.$setValidity('custom-err', false);
                console.log("Unsuccessful - ", response.data.errorMessage);
                $scope.errorMessage = response.data.errorMessage

              });
              console.log("Brand with id?", brand);
            };

          }; // END OF DialogController
      }])  // END of Brands Controller

      
      .config(function($mdThemingProvider) {

      // Configure a dark theme with primary foreground yellow

      $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();

    })

})();