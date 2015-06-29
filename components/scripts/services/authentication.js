myApp.factory( 'Authentication', function( $firebaseArray, $firebaseObject, $firebaseAuth, $rootScope, $routeParams, $location, FIREBASE_URL ) {

	var ref 	= new Firebase( FIREBASE_URL );
	var auth 	= $firebaseAuth( ref );	

	auth.$onAuth( function( authUser ) {
		if( authUser ) {
			
			// for some reason i am not able to tie the logged in Firebase user to the custom fields for that same user
			// by using the authUser.uid below. It works in the tutorial but not here. The commented out line works fine,
			// but calling .uid returns something like "simplelogin:12" instead of the string in the commented out line.
			// I can't tell if this is something I'm doing wrong or if it's differences between current Firebase code and
			// older code that the tutorial might be using...for now, it isn't stopping me from continuing the tutorial, 
			// so I'm going to leave it broken.
			console.log( 'Logged in as: ' + authUser.uid );
			//var refUser = new Firebase(FIREBASE_URL+'/users/'+authUser.uid);
			//var refUser = new Firebase(FIREBASE_URL+'/users/-Jr_ohq3Vpd7Y-jVYmTF');
			//var userObj = $firebaseObject(refUser);
			
			//console.log("userObj: " + refUser);
			$rootScope.currentUser = authUser;
		} else {
			$rootScope.currentUser = '';
			console.log( 'Logged out' );
		}
	});
	
	// temporary object
	var myObject = {
		
		login: function( user ) {
			return auth.$authWithPassword({
				email 		: user.email,
				password 	: user.password
			}); // authwithPassword
		}, // login

		logout: function( user ) {
			return auth.$unauth();
		}, // logout

		register: function( user ) {
			return auth.$createUser({
				email 		: user.email,
				password 	: user.password
			});
		}, // register
		
		requireAuth: function() {
			return auth.$requireAuth();
		}, // require authentication

		waitForAuth: function() {
			return auth.$waitForAuth();
		} // wait until user is authenticated

	}; // myObject
	
	return myObject;

}); // Authentication Factory