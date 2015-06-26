myApp.factory('Authentication', function($firebaseArray, $firebaseObject, $firebaseAuth, $rootScope, $routeParams, $location, FIREBASE_URL) {

	var ref 	= new Firebase( FIREBASE_URL );
	var auth 	= $firebaseAuth( ref );	
	
	// temporary object
	var myObject = {
		
		login: function( user ) {
			return auth.$authWithPassword({
				email 		: user.email,
				password 	: user.password
			}); // authwithPassword
		}, // login

		register: function( user ) {
			return auth.$createUser({
				email 		: user.email,
				password 	: user.password
			});
		} // register
		
	}; // myObject
	
	return myObject;

}); // Authentication Factory