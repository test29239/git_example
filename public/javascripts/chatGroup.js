
app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

app.controller('chatGroup', ['$scope', '$http','$rootScope', '$location','$route','$routeParams','socket',function($scope, $http,$rootScope, $location,$route,$routeParams,socket) {
  
 $scope.modalShown_ppl = false;
  
  $scope.add_ppl = function() {
    $scope.modalShown_ppl = !$scope.modalShown_ppl;
  };

  $scope.all_user=[]
    $http.get('/display_all_user')
    .success(function(user){
    	
      angular.isUndefined(user);
      //console.log(JSON.stringify(user)+'hi machi group char details');
      	for(i=0;i<user.length;i++){
		 	//console.log(a[i].u.properties.username)
		 	if(!user[i].u.properties.username){
				$scope.all_user.push(user)	 		
		 	}

		
		}
      
    })


	/*console.log('----'+$routeParams.id.split(':')[1])
	$http.get('/display_addedUser').success(function(users){
      console.log('abccccccc'+users)
      
    })*/
	$scope.personal_group_det=[]
    $http.post('/chatGroup/:id',{ 
        id : $routeParams.id.split(':')[1]
      }).success(function(users){
        console.log('abccccccc'+JSON.stringify(users))
        $scope.personal_group_det.push(users)
        
      });



	$scope.Add_group=function(index,id,groupName){
		console.log(index+'---'+id);
		 $http.post('/add_to_group', {
            id: id,
            group_Name:groupName
          })
          .success(function(user){
          	console.log(user)
          	//$route.reload();
            $rootScope.message_chat = user;
            //$location.path('/');
            
          })
	}

  

  // Socket listeners
  // ================

  
  socket.on('send:message', function (message) {
    $scope.messages.push(message);
  });

  

  $scope.messages = [];

  $scope.sendMessage = function () {
    socket.emit('send:message', {
      message: $scope.message
    });
    $http.post('/post_groupChat_comment', {
            message: $scope.message
          })
          .success(function(data){
            console.log(data)
            //$route.reload();
            //$rootScope.message_chat = user;
            //$location.path('/');
            
          })
    
    // clear message box
    $scope.message = '';
  };





}]);
























