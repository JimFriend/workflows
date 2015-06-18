myApp.controller( 'NavController', function( $scope, $location) {

	$scope.isViewActive = function ( viewLocation ) { 
        return viewLocation === $location.path();
    };
	
}); // NavController