var app = angular.module('my-app', ['ngRoute']);



app.config(function($routeProvider) {
  $routeProvider

  .when('/', {
    templateUrl: 'home.html',
    controller: 'mainController'
  })
  .when('/register', {
    templateUrl: 'register.html',
    controller: 'registerController'
  })
  .when('/login', {
    templateUrl: 'login.html',
    controller: 'loginController'
  })
  .when('/options', {
    templateUrl: 'options.html',
    controller: 'optionsController'
  })
  .when('/delivery', {
    templateUrl: 'delivery.html',
    controller: 'deliveryController'
  })
  .when('/payment', {
    templateUrl: 'payment.html',
    controller: 'paymentController'
  })
  .when('/thankyou', {
    templateUrl: 'thankyou.html',
    controller: 'thankyouController'
  });
});

var order = {
  options: {
    "grind": null,
    "quantity": null
  },
  address: {
    "name": null,
    "address": null,
    "address2": null,
    "city": null,
    "state": null,
    "zipCode": null,
    "deliveryDate": null
  }
};

app.controller('optionsController', function($scope, $http, $location) {
  var API = 'http://localhost:8000';
  $http.get(API + '/options')
  .success(function(data) {
    $scope.coffeeOptions = data;
  });

  $scope.submit1 = function(quantity) {
    order.options.grind = $scope.coffeeOptionSingle;
    order.options.quantity = quantity;
    $location.path('/delivery');
  };

  $scope.submit2 = function(quantity) {
    order.options.grind = $scope.coffeeOptionFamily;
    order.options.quantity = quantity;
    $location.path('/delivery');
  };
});

app.controller('deliveryController', function($scope, $http, $location) {
  $scope.submit3 = function() {
    order.address.name = $scope.name;
    order.address.address = $scope.address;
    order.address.address2 = $scope.address2;
    order.address.city = $scope.city;
    order.address.state = $scope.state;
    order.address.zipCode = $scope.zipCode;
    order.address.deliveryDate = $scope.deliveryDate;
    $location.path('/payment');
  };
});

app.controller('paymentController', function($scope, $http, $location) {
  $scope.pay = function() {
    $location.path('/thankyou');
  };
  $scope.cancel = function() {
    $location.path('/');
  };
  $scope.order = order;
});
