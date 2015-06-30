myApp.controller( 'CoffeeController', function( $scope, $rootScope, $firebaseArray, FIREBASE_URL) {

	$scope.addCoffee = function() {
		var ref 	= new Firebase( FIREBASE_URL + '/coffees' );
		var coffees = $firebaseArray( ref );

		var coffee = {
			created_date 		: Firebase.ServerValue.TIMESTAMP,
			created_by	 		: $rootScope.currentUser.uid,
			coffee_name			: $scope.coffee.name,
			coffee_roaster		: $scope.coffee.roaster,
			coffee_description	: $scope.coffee.description

		}; // coffee data

		coffees.$add( coffee )
			.then( function( ref ) {
				var id = ref.key();
				console.log( 'New coffee added: ' + id );
				coffees.$indexFor( id ); // returns location in the array
				$scope.success = "You have successfully added your coffee!";
			});

	};

	$scope.closeModal = function() {
		$( '#CoffeeModal' ).modal( 'hide' );
	};
	
}); // CoffeeController