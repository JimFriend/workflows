// Include stack libraries
$ = jQuery = require('jquery');
var angular 	= require( 'angular' );
var ngRoute 	= require( 'angular-route' );
var Firebase 	= require( 'firebase' );
var angularFire = require( 'angularfire' );

var myApp = angular.module( 'myApp', ['ngRoute', 'appControllers', 'firebase'] )
	.constant( 'FIREBASE_URL', 'https://mycoffeenotes.firebaseio.com/' );

var appControllers = angular.module( 'appControllers', ['firebase'] );

myApp.run( ['$rootScope', '$location',
	function( $rootScope, $location ) {
		$rootScope.$on( '$routeChangeError',
			function( event, next, previous, error ) {
				if( error === 'AUTH_REQUIRED' ) {
					$rootScope.message = 'Sorry, you must login to access that page.';
					$location.path( '/' );
				}
			}
		);
	}
]);

myApp.config( ['$routeProvider', function( $routeProvider ) {
	$routeProvider.
		when( '/about', {
			templateUrl: 'views/about.html'
			// controller: 'AboutController'
		}).
		when( '/contact', {
			templateUrl: 'views/contact.html'
			// controller: 'ContactController'
		}).
		when( '/', {
			templateUrl: 'views/home.html'
			// controller: 'AboutController'
		}).
		otherwise( {
			redirectTo: '/'
		});
}]);