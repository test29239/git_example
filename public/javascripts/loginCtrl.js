app.controller('LoginCtrl', ['$scope', '$http','$rootScope', '$location','$route',function($scope, $http,$rootScope, $location,$route,fileInput) {
  // This object will be filled by the form
  
  $scope.tag_details=["Mr","Mrs","Ms"];

    $scope.type_details=["members","others"];

    $scope.gender_details=["male","female","others"];
    $scope.city_list={};
    $scope.country_list=[
      {
        "country":"india",
        "city":["bangalore","mysore","mangalore"]
      },{
        "country":"australia",
        "city":["melbourne"]
      },{
        "country":"america",
        "city":["las vegas","california"]
      }
    ];
    
$scope.setFile = function(element) {
    $scope.currentFile = element.files[0];
     var reader = new FileReader();

    reader.onload = function(event) {
      $scope.image_source = event.target.result
      $scope.$apply()

    }
    // when the file is read it triggers the onload event above.
    reader.readAsDataURL(element.files[0]);
  }

  $scope.login = function(){
    $http.post('/login', {
      username: $scope.username,
      password: $scope.password,
    })
    .success(function(user){
      // No error: authentication OK
     //console.log(JSON.stringify(user));
      //$route.reload();
      window.location.reload();
    if(user){
      
      $rootScope.user_data=user.sess_id;
      $location.url('/dashboard')
      }
     if(user==0){
        $rootScope.message = 'Authentication failed.';
     }
    })
    .error(function(){
      // Error: authentication failed
      $rootScope.message = 'Authentication failed.';
      $location.url('/');
    });
  };
 

$scope.logout=function(){
  $http.post('/logout')
      .success(function(user){
            // No error: authentication OK
            $rootScope.message = '';
            $location.url('/');
          })
}

  $scope.modalShown = false;
  $scope.modalShown1 = false;
  $scope.modalShown2 = false;
  $scope.modalShown3 = false;
  $scope.modalShown_chat = false;
  
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };

  $scope.toggleModal1 = function() {
    $scope.modalShown1 = !$scope.modalShown1;
  };
  $scope.toggleModal2 = function() {
    $scope.modalShown2 = !$scope.modalShown2;
  };
  $scope.toggleModal3 = function() {
    $scope.modalShown3 = !$scope.modalShown3;
  };


   $scope.chat_modal = function() {
    $scope.modalShown_chat = !$scope.modalShown_chat;
  };


    $scope.registration=function(){
      $location.url('/registration');
    }


    $scope.forgot_password=function(){
      $location.url('/forgotpassword');
      
    }
console.log($rootScope.user_data+'user_data12321312')

    $scope.request_access=function(){
      $location.url('/request_access');
      
    }
     $scope.access_code=function(){
        $location.url('/access_reg')
      }

    $http.get('/view_list').success(function(user_details){
        $rootScope.details =user_details
      /*for (var i in user_details)
        $scope.question_details.push(que_name[i]);*/
    });

   
   $scope.user_det={};
    $http.get('/dashboard')
        .success(function(user){
          $scope.user_det=user
          console.log(JSON.stringify(user)+'hi machi')
          
        })
$scope.user_othergroup_det=[]
    $http.get('/other_group_invited')
        .success(function(user){
          $scope.user_othergroup_det.push(user)
          console.log(JSON.stringify(user)+'hi machi1232')
          
        })

    $scope.user_group=[]
    $http.get('/group_chat_details')
    .success(function(user){
      $scope.user_group.push(user)
      console.log(JSON.stringify(user)+'hi machi group char details')
      
    })


      $scope.select_city=function(country_val){
       
        for (var i in $scope.selectCountry)
              $scope.city_list.city_val=$scope.selectCountry[i];
      }


  $scope.edit_privacy_setting=function(){
    console.log($scope.user_det[0].user._id+'user_det[0].user.properties.privacy')    ;
     $http.post('/privacy_setting', {
          id:               $scope.user_det[0].user._id,
          privacy:          $scope.user_det[0].user.properties.privacy,
          history:          $scope.user_det[0].user.properties.history,
          tagging:          $scope.user_det[0].user.properties.tagging,
          post:             $scope.user_det[0].user.properties.post,
          followers:        $scope.user_det[0].user.properties.followers,
          following:        $scope.user_det[0].user.properties.following,
          reviews:          $scope.user_det[0].user.properties.reviews,
          circle:           $scope.user_det[0].user.properties.circle
        })
        .success(function(user){
          $route.reload();
          
          /*$scope.details.push($scope.text);
          $location.path('/dashboard');
          */
        })
  }

$scope.setFile = function(element) {
    $scope.currentFile = element.files[0];
     var reader = new FileReader();

    reader.onload = function(event) {
      $scope.image_source = event.target.result
      $scope.$apply()

    }
    // when the file is read it triggers the onload event above.
    reader.readAsDataURL(element.files[0]);
  }

  $scope.update_personalDetails=function(profile_image,old_pic){

          var fd = new FormData()
          angular.forEach(profile_image,function(file){
            fd.append('file',file)
          })

          fd.append("id", $scope.user_det[0].user._id);
          fd.append("username", $scope.user_det[0].user.properties.username);
          fd.append("phone", $scope.user_det[0].user.properties.phone);
          fd.append("title", $scope.user_det[0].user.properties.title);
          fd.append("gender", $scope.user_det[0].user.properties.gender);
          fd.append("description", $scope.user_det[0].user.properties.description);
          fd.append("old_pic", old_pic);
          $http.post('/update_profile', fd,
          {
             withCredentials : false,
            transformRequest:angular.identity,
            headers:{'Content-Type':undefined}
          })
          .success(function(d) {
               //$rootScope.message = 'pdf successfully inserted into database!';
              //$location.path('/admin');
               //$rootScope.message1 = d;
              $route.reload();
          })
    
  }

  $scope.change_password=function(np,cp){
    console.log(np+'---'+cp+'==='+$scope.user_det[0].user.properties.password)
    if(np===cp){

      $http.post('/change_pass', {
            id:     $scope.user_det[0].user._id,
            password:    np,
            
          })
          .success(function(user){
            $rootScope.message2 = user;
            //$location.path('/');
            
          })
    }else{
      $rootScope.message2 = 'New and confirm password doesnot match'
      
    }
  }

  $scope.create_group=function(id,name){
    console.log(id+'===='+name)
    $http.post('/create_group', {
            id:   id,
            groupName:  name,
            
          })
          .success(function(user){
            console.log(user+'user created');
            $rootScope.message_chat = user;
            //$location.path('/');
            //$scope.chatgroup_name=""
            
          })
  }




    $scope.chat_with_group=function(index,id){
      //console.log(cat_name+'----'+id)
      $location.url('/chatGroup/:'+id);
    }
  $scope.remove_from_group=function(index,id){
    $http.post('/delete_fromGroup', {
        id: id
      })
      .success(function(user){
         $scope.user_group.splice(index, 1); 
         console.log(user+'total group present');
        $route.reload();
      })
     .error(function(){ $location.path('/');});
  }

}]);

