myApp.controller( 'NavController', function( $scope, $location) {

	$scope.isViewActive = function ( viewLocation ) { 
        return viewLocation === $location.path();
    };

    // Dummy user object to be used until full authentication and login is in place
    var currentUser = {
    	loggedIn : false
    };
    $scope.currentUser = currentUser;
	
}); // NavController