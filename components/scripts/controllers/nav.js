myApp.controller( 'NavController', function( $scope, $rootScope, $location) {

	$scope.isViewActive = function ( viewLocation ) { 
        return viewLocation === $location.path();
    };
	
}); // NavController