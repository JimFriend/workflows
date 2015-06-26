// @TODO
// - Add a regex to the password input to enforce strong passwords

myApp.controller( 'RegistrationController', function( $scope, $firebaseAuth, Authentication, $location, FIREBASE_URL) {

	var ref = new Firebase( FIREBASE_URL );
	var auth = $firebaseAuth( ref );

	$scope.login = function() {
		Authentication.login( $scope.user )
			.then( function( user ) {
				$( '#LoginModal' ).modal( 'hide' );
			}).catch( function( error ) {
				$scope.message = error.message;
			});
	}; // login

	$scope.register = function() {

		Authentication.register( $scope.user )
			.then( function( user ) {
				Authentication.login( $scope.user );
				$( '#RegisterModal' ).modal( 'hide' );
			}).catch( function( user ) {
				$scope.message = error.message;
			});

	}; // register

}); // RegistrationController