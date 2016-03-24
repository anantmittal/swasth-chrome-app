angular.module('myApp', [])
	.controller('MainCtrl', function ($scope, $timeout, $http) {
		// Build the date object
		$scope.date = {};

		// Update function
		var updateTime = function () {
			$scope.date.raw = new Date();
			$timeout(updateTime, 1000);
		}

		window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

		window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
		window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

		if (!window.indexedDB) {
			window.alert("Your browser doesn't support a stable version of IndexedDB.")
		}

		for (i = 60000; i < 80000; i++) {
			$http.get('http://apps.swasth.org/shc/index.php/myswasth/myswasth/get_personid_from_cardnumber/' + i).success(function (data) {
				console.log(data[0].id);
			});
			break;
		}

		// Kick off the update function
		updateTime();
	});