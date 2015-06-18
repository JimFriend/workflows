// Include stack libraries
var angular 	= require( 'angular' );
var ngRoute 	= require( 'angular-route' );
var Firebase 	= require( 'firebase' );
var angularFire = require( 'angularfire' );

var myApp = angular.module('myApp', ['ngRoute', 'appControllers', 'firebase'])
	.constant('FIREBASE_URL', 'https://salaries.firebaseio.com/');

var appControllers = angular.module('appControllers', ['firebase']);

myApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/about', {
			templateUrl: 'views/about.html'
			// controller: 'AboutController'
		}).
		when('/contact', {
			templateUrl: 'views/contact.html'
			// controller: 'ContactController'
		}).
		when('/', {
			templateUrl: 'views/home.html'
			// controller: 'AboutController'
		}).
		otherwise({
			redirectTo: '/'
		});
}]);