var app = angular.module('my-app', ['ngRoute', 'ngCookies']);



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
  },
  total: null
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
    order.total = 7.00;
    $location.path('/delivery');
  };

  $scope.submit2 = function(quantity) {
    order.options.grind = $scope.coffeeOptionFamily;
    order.options.quantity = quantity;
    order.total = 20.00;
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

app.controller('paymentController', function($scope, $http, $location, $cookies) {
  $scope.pay = function() {
    $location.path('/thankyou');
    $http.post('http://localhost:8000/orders', {
      token: $cookies.get('Token'),
      order: order
    });
  };
  $scope.cancel = function() {
    $location.path('/');
  };
  $scope.order = order;
});

app.controller('registerController', function($scope, $http, $location) {
  var credentials = {
    "_id": null,
    "password": null,
    "email": null
  };

  $scope.register = function() {
    if ($scope.password !== $scope.confirmPassword) {
      $location.path('/register');
    } else {
      credentials._id = $scope.username;
      credentials.password = $scope.password;
      credentials.email = $scope.email;
    }
    $http.post('http://localhost:8000/signup', credentials).success(function(data) {
      $location.path('/login');
    });
  };
});

app.controller('loginController', function($scope, $http, $location, $cookies) {
  var credentials = {
    "_id": null,
    "password": null,
    "email": null
  };

  $scope.login = function() {
    credentials._id = $scope.username;
    credentials.password = $scope.password;
    $http.post('http://localhost:8000/login', credentials).success(function(data) {
      $cookies.put('Token', data.token);
      $location.path('/options');
    });
  };
});

app.controller('mainController', function() {

});

app.controller('thankyouController', function() {

});

app.run(function($rootScope, $location, $cookies) {
  $rootScope.$on('$locationChangeStart', function(event, nextUrl, currentUrl) {
    currentUrl = currentUrl.split('#');
    nextUrl = nextUrl.split('#');
    token = $cookies.get('Token');
    if (token === undefined) {
      if (nextUrl[1] === '/') {
        $location.path('/');
      } else if (nextUrl[1] === '/login') {
        $location.path('/login');
      } else if (nextUrl[1] === '/register') {
        $location.path('/register');
      } else if (nextUrl[1] === '/options' || '/delivery' || '/payment') {
        $location.path('/login');
      }
    }
    if (token !== undefined) {
      $location.path(nextUrl[1]);
    }
    $cookies.put('nextUrl', nextUrl[1]);
    });
  });
