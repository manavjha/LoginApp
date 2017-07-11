var app = angular.module('myApp', ["ngRoute","ngSanitize"]);

app.controller('loginCntrl', ['$scope','$timeout','db', function($scope,$timeout,db){
	$scope.msg =" ";

	$scope.username = "";
	$scope.password = "";
	$scope.pt = db.getMeds(1);
    $scope.doLogin  = function(){

	if( $scope.username == "Admin" && $scope.password == "Admin"){

		$timeout(function(){
			 $scope.msg =" hello World !!";
			 console.log(" hello World !!");
			}, 2000);
     
	}else{
		$scope.msg =" Error!!";
	}
    }
	
}]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "main.html"
    })
    .when("/london", {
        templateUrl : "london.html"
    })
    .when("/paris", {
        templateUrl : "paris.html"
    });
});

app.controller("ProductCntrl", function ($scope) {
    $scope.msg = "I love London";
});
app.controller("ProductDetailsCntrl", function ($scope) {
    $scope.msg = "I love Paris";
});

app.service('db', function() {
    var meds = [{
      "id": "1",
      "name": "Judith",
      "dob":"Jan 13th 1990"
    },  {
      "id": "2",
      "name": "Fiyona",
      "dob":"Aug 03rd 1991"
    }, {
      "id": "3",
      "name": "James",
      "dob":"March 12th 1970"
    }];

    return {
      getMeds: function(medid) {
        if (medid === 0) {
          return meds;
        } else {
          return meds[medid - 1];
        }
      }
    };
  });