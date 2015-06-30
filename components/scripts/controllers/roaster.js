// @TODO
// - Closing out modal after a successful submission is buggy. Need to clear messages and form fields.
// - Should success messaging be done on the page or on the modal?

myApp.controller( 'RoasterController', function( $scope, $rootScope, $firebaseArray, FIREBASE_URL) {

	$scope.addRoaster = function() {
		var ref 	= new Firebase( FIREBASE_URL + '/roasters' );
		var roasters = $firebaseArray( ref );

		var roaster = {
			created_date 		: Firebase.ServerValue.TIMESTAMP,
			created_by	 		: $rootScope.currentUser.uid,
			roaster_name		: $scope.roaster.name
		}; // roaster data

		roasters.$add( roaster )
			.then( function( ref ) {
				var id = ref.key();
				console.log( 'New roaster added: ' + id );
				roasters.$indexFor( id ); // returns location in the array
				$scope.success = "You have successfully added your roaster!";
			});

	};

	$scope.closeModal = function() {
		$scope.success = "";
		$( '#RoasterModal' ).modal( 'hide' );
	};
	
}); // RoasterController