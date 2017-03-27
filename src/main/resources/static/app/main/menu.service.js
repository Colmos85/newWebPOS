(function(){

  'use strict';

  angular.module('common.services')
    .factory('menu', [
      '$location',
      '$rootScope',
      function ($location) {

        var sections = [{
          name: 'Home',
          state: 'home.gettingstarted',
          type: 'link'
        }];

        sections.push({
          name: 'Cashier',
          type: 'toggle',
          icon: 'fa fa-shopping-cart',
          pages: [{
            name: 'Sales',
            type: 'link',
            state: 'home.cashier.sales',
            icon: 'fa fa-shopping-cart'
          }, {
            name: 'Previous Sales',
            state: 'home.cashier.previousSales',
            type: 'link',
            icon: 'fa fa-archive'
          },
            {
              name: 'Open/Close',
              state: 'home.cashier.openclose',
              type: 'link',
              icon: 'fa fa-plus'
            }]
        });

        sections.push({
          name: 'Customers',
          state: 'home.customers',
          type: 'link'
        })

        sections.push({
          name: 'Products',
          type: 'toggle',
          pages: [{
            name: 'Products',
            type: 'link',
            state: 'home.products.products',
            icon: 'fa fa-product-hunt'
          }, {
            name: 'Category',
            state: 'home.products.categorys',
            type: 'link',
            icon: ''
          },
            {
              name: 'Brands',
              state: 'home.products.brands',
              type: 'link',
              icon: ''
            }]
        });

        sections.push({
          name: 'Employees',
          state: 'home.employees',
          type: 'link'
        })

        sections.push({
          name: 'Reports',
          state: 'home.reports',
          type: 'link'
        })

        sections.push({
          name: 'Settings',
          type: 'toggle',
          pages: [{
            name: 'General',
            type: 'link',
            state: 'munchies.cheetos',
            icon: 'fa fa-group'
          }, {
            name: 'Stores & Registers',
            state: 'munchies.bananachips',
            type: 'link',
            icon: 'fa fa-map-marker'
          },
            {
              name: 'Tax Bands & Currency',
              state: 'munchies.donuts',
              type: 'link',
              icon: 'fa fa-map-marker'
            }]
        });

        var self;

        return self = {
          sections: sections,

          toggleSelectSection: function (section) {
            self.openedSection = (self.openedSection === section ? null : section);
          },
          isSectionSelected: function (section) {
            return self.openedSection === section;
          },

          selectPage: function (section, page) {
            page && page.url && $location.path(page.url);
            self.currentSection = section;
            self.currentPage = page;
          }
        };

        function sortByHumanName(a, b) {
          return (a.humanName < b.humanName) ? -1 :
            (a.humanName > b.humanName) ? 1 : 0;
        }

      }])

})();