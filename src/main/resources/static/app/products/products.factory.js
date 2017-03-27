(function(){
  'use strict';

  /* reference to module */
  angular.module('myApp.products.module')

    .factory('productsFactory', ['$log','$http', function($log, $http) {

      var urlBase = 'products/';
      var factory = this;

      factory.getAllProducts = function(){
        return $http.get(urlBase);
      }

      factory.getProduct = function (id) {
        return $http.get(urlBase + '/' + id);
      };

      factory.insertProduct = function (product) {
          return $http.post(urlBase, product);
      };

      factory.updateProduct = function (id, product) {
          return $http.put(urlBase + '/' + id, product)
      };

      factory.deleteProduct= function (id) {
          return $http.delete(urlBase + '/' + id);
          //products.
      };

/*      factory.getOrders = function (id) {
          return $http.get(urlBase + '/' + id + '/orders');
      };
*/
      return factory;

    }]) // END OF productsFactory


    .factory('brandsFactory', ['$log','$http', function($log, $http) {

      var urlBase = 'brands/';
      var factory = this;
      

      factory.getAllBrands = function(){
        return $http.get(urlBase);
      }

      factory.getBrand = function (id) {
        return $http.get(urlBase + '/' + id);
      };

      factory.createBrand = function (brand) {
          return $http.post(urlBase, brand);
      };

      factory.updateBrand = function (brand) {
          return $http.put(urlBase + '/' + brand.ID, brand)
      };

      factory.deleteBrand = function (id) {
          return $http.delete(urlBase + '/' + id);
      };

      return factory;

    }]) // END OF brandsFactory

    .factory('taxBandsFactory', ['$log','$http', function($log, $http) {

      var urlBase = 'taxbands/';
      var factory = this;
      

      factory.getAllTaxBands = function(){
        return $http.get(urlBase);
      }

      factory.getTaxBand = function (id) {
        return $http.get(urlBase + '/' + id);
      };

      factory.createTaxBand = function (brand) {
          return $http.post(urlBase, brand);
      };

      factory.updateTaxBand = function (brand) {
          return $http.put(urlBase + '/' + brand.ID, brand)
      };

      factory.deleteTaxBand = function (id) {
          return $http.delete(urlBase + '/' + id);
      };

      return factory;

    }]) // END OF tax bands Factory

    .factory('stockFactory', ['$log','$http', function($log, $http) {

      var urlBase = 'stock/';
      var factory = this;

      factory.createStock = function (stock) {
          return $http.post(urlBase, stock);
      };

      factory.updateStock = function (stock) {
          return $http.put(urlBase + '/' + brand.ID, brand)
      };

      factory.deleteStock = function (id) {
          return $http.delete(urlBase + '/' + id);
      };

      return factory;

    }]) // END OF tax bands Factory
})();