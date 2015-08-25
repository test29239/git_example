app.controller('adminCtrl', ['$scope', '$http','$rootScope', '$location','$route',function($scope, $http,$rootScope, $location,$route,fileInput) {
  
  $scope.adminlogin=function(){
    $http.post('/adminlogin', {
      username: $scope.username,
      password: $scope.password,
    })
    .success(function(user){
      // No error: authentication OK
     //console.log(JSON.stringify(user));
      //$route.reload();
      //console.log(user)
      window.location.reload();
    if(user){
      
      $rootScope.user_data=user.sess_id;
      $location.url('/admindashboard')
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
 
 
  }

    $scope.modalShown = false;
    $scope.modalShown1 = false;
    $scope.modalShown2 = false;
    $scope.modalShown3 = false;
    $scope.toggleModal = function() {
      $scope.modalShown = !$scope.modalShown;
    };
    $scope.toggleModal2 = function() {
      $scope.modalShown2 = !$scope.modalShown2;
    };
    
    $scope.toggleModal1 = function(index,id) {
      $scope.getBrand_id=id;
     
      $http.post('/get_single_brand', {
          brand_id: id
        })
        .success(function(user){
           $scope.single_brand_det=user;
          // /$route.reload();
        })
       .error(function(){ $location.path('/admindashboard');});
        $scope.modalShown1 = !$scope.modalShown1;
      };






    $scope.toggleModal3 = function(index,id) {
      $scope.getCircle_id=id;
     
      $http.post('/get_single_circle', {
          brand_id: id
        })
        .success(function(user){
           $scope.single_circle_det=user;
          // /$route.reload();
        })
       .error(function(){ $location.path('/admindashboard');});
        $scope.modalShown3 = !$scope.modalShown3;
      };


      /*$scope.toggleModal4 = function(index,id) {
      $scope.getCircle_id=id;
     
      $http.post('/get_single_circle', {
          brand_id: id
        })
        .success(function(user){
           $scope.single_circle_det=user;
          // /$route.reload();
        })
       .error(function(){ $location.path('/admindashboard');});
        $scope.modalShown4 = !$scope.modalShown4;
      };*/



    $scope.admin_det={};
    $http.get('/admindashboard')
    .success(function(user){
      $scope.admin_det=user
      console.log(JSON.stringify(user))
      
    })

  $scope.brand_details={};
  $scope.get_brand_details=function(){

    $http.get('/brand_list')
      .success(function(user){
        //$scope.admin_det=user
        console.log(JSON.stringify(user)+'get all brands list')
        $scope.brand_details=user
        /*for (var i in user)
        $scope.brand_details.push(user[i]);*/
        
    })
  }

$scope.circle_details={};
  $scope.get_circle_details=function(){

    $http.get('/circle_list')
      .success(function(user){
        //$scope.admin_det=user
        console.log(JSON.stringify(user)+'get all circle list')
        $scope.circle_details=user
        /*for (var i in user)
        $scope.brand_details.push(user[i]);*/
        
    })
  }

  /*$scope.readURL=function(input){
    console.log(input);
      var photofile = input.files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
          $scope.$apply(function() {
              $scope.prev_img = e.target.result;
          });
      };
      reader.readAsDataURL(photofile);
  }*/


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


  $scope.edit_brand=function(b_name,b_desc,b_img,id,old_pic){
    //console.log(index+'----editing---'+id)
    console.log(b_name+'----'+b_desc+'-----'+JSON.stringify(b_img)+'===='+id+'---'+old_pic);
          var fd = new FormData()
          angular.forEach(b_img,function(file){
            fd.append('file',file)
          })

          fd.append("brand_name", b_name);
          fd.append("brand_description", b_desc);
          fd.append("b_id", id);
          fd.append("old_pic", old_pic);
          $http.post('/edit_brand', fd,
          {
             withCredentials : false,
            transformRequest:angular.identity,
            headers:{'Content-Type':undefined}
          })
          .success(function(d) {
               //$rootScope.message = 'pdf successfully inserted into database!';
              //$location.path('/admin');
              $route.reload();
          })

  }

  $scope.remove_brand=function(index,id){
    $http.post('/delete_brand', {
          brand_id: id
        })
        .success(function(user){
           $scope.brand_details.splice(index, 1);
          $route.reload();
        })
       .error(function(){ $location.path('/admindashboard');});
  }

  $scope.remove_circle=function(index,id){
    $http.post('/delete_circle', {
          circle_id: id
        })
        .success(function(user){
           $scope.circle_details.splice(index, 1);
          $route.reload();
        })
       .error(function(){ $location.path('/admindashboard');});
  }


    $scope.add_brand = function(b_name,b_desc,b_img) {
     // console.log(b_name+'----'+b_desc+'-----'+JSON.stringify(b_img))
          var fd = new FormData()
          angular.forEach(b_img,function(file){
            fd.append('file',file)
          })

          fd.append("brand_name", b_name);
          fd.append("brand_description", b_desc);
          $http.post('/add_brand', fd,
          {
             withCredentials : false,
            transformRequest:angular.identity,
            headers:{'Content-Type':undefined}
          })
          .success(function(d) {
               //$rootScope.message = 'pdf successfully inserted into database!';
              //$location.path('/admin');
              $route.reload();
          })
          
        
    }


    $scope.add_circle = function(c_name,c_desc,c_img) {
     // console.log(b_name+'----'+b_desc+'-----'+JSON.stringify(b_img))
          var fd = new FormData()
          angular.forEach(c_img,function(file){
            fd.append('file',file)
          })

          fd.append("circle_name", c_name);
          fd.append("circle_description", c_desc);
          $http.post('/add_circle', fd,
          {
             withCredentials : false,
            transformRequest:angular.identity,
            headers:{'Content-Type':undefined}
          })
          .success(function(d) {
               //$rootScope.message = 'pdf successfully inserted into database!';
              //$location.path('/admin');
              $route.reload();
          })
          
        
    }

    $scope.compose_story=function(desc,img){
      //console.log(JSON.stringify(img)+'img')
        var fd = new FormData()
          angular.forEach(img,function(file){
            fd.append('file',file)
          })

          fd.append("story_description", desc);
          $http.post('/add_story', fd,
          {
             withCredentials : false,
            transformRequest:angular.identity,
            headers:{'Content-Type':undefined}
          })
          .success(function(d) {
               //$rootScope.message = 'pdf successfully inserted into database!';
              //$location.path('/admin');
              $route.reload();
          })

    }

    $scope.story_details={};
    $scope.get_editor_details=function(){
      $http.get('/editor_list')
      .success(function(user){
        //$scope.admin_det=user
        console.log(JSON.stringify(user)+'get all brands list')
        $scope.story_details=user
        /*for (var i in user)
        $scope.brand_details.push(user[i]);*/
        
    })
    }




    $scope.edit_circle=function(b_name,b_desc,b_img,id,old_pic){
    //console.log(index+'----editing---'+id)
    console.log(b_name+'----'+b_desc+'-----'+JSON.stringify(b_img)+'===='+id+'---'+old_pic);
          var fd = new FormData()
          angular.forEach(b_img,function(file){
            fd.append('file',file)
          })

          fd.append("circle_name", b_name);
          fd.append("circle_description", b_desc);
          fd.append("c_id", id);
          fd.append("old_pic", old_pic);
          $http.post('/edit_circle', fd,
          {
             withCredentials : false,
            transformRequest:angular.identity,
            headers:{'Content-Type':undefined}
          })
          .success(function(d) {
               //$rootScope.message = 'pdf successfully inserted into database!';
              //$location.path('/admin');
              $route.reload();
          })

  }
}]);