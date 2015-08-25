

app.controller('RegCtrl', ['$scope', '$http','$rootScope', '$location','$route',function($scope, $http,$rootScope, $location,$route) {
  
$scope.tag_details=["Mr","Mrs","Ms"];

$scope.type_details=["members","others"];

$scope.gender_details=["Male","Female","Others"];
$scope.city_list={};
$scope.country_list=[
  {
    "country":"india",
    "city":["Bangalore","Mysore","Mangalore"]
  },{
    "country":"Australia",
    "city":["Melbourne"]
  },{
    "country":"America",
    "city":["Las Vegas","California"]
  }
];

  $scope.select_city=function(country_val){
    
    for (var i in $scope.selectCountry)
          $scope.city_list.city_val=$scope.selectCountry[i];
  }

  $scope.register=function(){

      $http.post('/registration', {
          username:       $scope.username,
          email:          $scope.email,
          password:       $scope.password,
          title:          $scope.selectedtag,
          type_details:    $scope.selectedtype,
          phone:          $scope.phone_number,
          gender:         $scope.selectGender,
          country:        $scope.selectCountry.country,
          city:           $scope.selectcity,
          date_created: new Date()
        })
        .success(function(user){
        
          $scope.username="",$scope.email="",$scope.password="",$scope.selectedtag="",
          $scope.selectedtype="",$scope.phone_number="",$scope.selectGender="",
          $scope.selectCountry.country="",$scope.selectcity=""
          $rootScope.message = user;
          //$location.path('/');
          
        })
  }



  $scope.access_code=function(){
    $location.url('/access_reg')
  }

  $scope.access_login=function(){
     $http.post('/register_access', {
          code1:       $scope.code1,
          code2:          $scope.code2,
          code3:       $scope.code3
        })
        .success(function(user){
          $rootScope.message = user;
          
        })
  }

}]);