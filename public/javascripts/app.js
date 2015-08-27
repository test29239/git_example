'use strict';

/**********************************************************************
 * Angular Application
 **********************************************************************/
var app = angular.module('app', ['ngResource', 'ngRoute'])
  .config(function($routeProvider, $locationProvider, $httpProvider) {
    
     var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user){
        // Authenticated
        if (user !== '0'){
          /*$timeout(deferred.resolve, 0);*/
        $location.url($location.path())
          deferred.resolve();
          
        }

        // Not Authenticated
        else {
       
          deferred.resolve();
          $location.url('/');
        }
      });



      return deferred.promise;
    };

    var checkLoggedin_admin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin_admin').success(function(user){
        // Authenticated
        if (user !== '0'){
          /*$timeout(deferred.resolve, 0);*/
        $location.url($location.path())
          deferred.resolve();
          
        }

        // Not Authenticated
        else {
       
          deferred.resolve();
          $location.url('/adminlogin');
        }
      });

      

      return deferred.promise;
    };
  
    //================================================
    // Define all the routes
    //================================================
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'LoginCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .when('/view_list', {
        templateUrl: 'views/view_list.html',
        controller: 'LoginCtrl'
      })
      .when('/registration', {
        templateUrl: 'views/registration.html',
        controller: 'RegCtrl'
      })
      .when('/access_reg', {
        templateUrl: 'views/access_reg.html',
        controller: 'RegCtrl'
      })
      .when('/forgotpassword', {
        templateUrl: 'views/forgotpassword.html',
        controller: 'FPCtrl'
      })
      .when('/resetpassword/:token/:email', {
        templateUrl: 'views/resetpassword.html',
        controller: 'FPCtrl'
      })
      .when('/request_access', {
        templateUrl: 'views/req_access.html',
        controller: 'Req_accessCtrl'
      })


      .when('/adminlogin', {
        templateUrl: 'views/adminlogin.html',
        controller: 'adminCtrl'
      })
      .when('/admindashboard', {
        templateUrl: 'views/admindashboard.html',
        controller: 'adminCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .when('/chatGroup/:id', {
        templateUrl: 'views/chatGroup.html',
        controller: 'chatGroup',
        resolve: {
          loggedin: checkLoggedin
        }
      })


      
      .otherwise({
        redirectTo: '/'
      });
    //================================================

  }) // end of config()
.run(function($rootScope, $http,$location){
   

  });
/**********************************************************************
 * Login controller
 **********************************************************************/




 app.directive('fileInput',['$parse',function($parse){
      return {
        restrict:'A',
        link:function(scope,elm,attrs){
          elm.bind('change',function(){
            $parse(attrs.fileInput)
            .assign(scope,elm[0].files)
            scope.$apply()
          })
        }
      }
    }])




app.controller('FPCtrl', ['$scope', '$http','$rootScope', '$location','$route','$routeParams',function($scope, $http,$rootScope, $location,$route,$routeParams) {
  
  $scope.fp_check=function(){
    $http.post('/forgotpassword', {
          email:$scope.email,
        })
        .success(function(user){
         
          $scope.email=""
          $rootScope.message = user;

        })
  }

 /* var token=$routeParams.token.split(':')[1];
      var email=$routeParams.email.split(':')[1];
      console.log(token+'----'+email)*/
 
 /*$http.get('/resetpassord/:'+token+'/:'+email).success(function(users){
    $scope.user_details=users
  });  */

  $scope.reset_password=function(){

      
  }

}]);


app.controller('Req_accessCtrl', ['$scope', '$http','$rootScope', '$location','$route',function($scope, $http,$rootScope, $location,$route) {
  
  $scope.req_acc=function(){
    $http.post('/request_access', {
          email:  $scope.email,
        })
        .success(function(user){
          $scope.email=""
          $rootScope.message = user;

        })
  }




}]);




app.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
     template:  '<div class="ng-modal" ng-show="show">' + 
              '<div class="ng-modal-overlay" ng-click="hideModal()"></div>' + 
              '<div class="ng-modal-dialog" ng-style="dialogStyle">' + 
                '<div class="ng-modal-close" ng-click="hideModal()"">X</div>' + 
                '<div class="ng-modal-dialog-content" ng-transclude></div>' + 
              '</div>' + 
            '</div>' ,
  };
});



