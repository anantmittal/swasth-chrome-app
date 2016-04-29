angular.module('myApp', [])
	.controller('MainCtrl', function ($scope, $timeout, $http) {
		// Build the date object
		$scope.date = {};

		// Update function
		var updateTime = function () {
			$scope.date.raw = new Date();
			$timeout(updateTime, 1000);
		}
		
		$http.get('http://apps.swasth.org/shc/index.php/myswasth/myswasth/get_personids_from_cardnumber/10').success(function (data) {
			console.log(data);
			window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
			window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

			if (!window.indexedDB) {
				window.alert("Your browser doesn't support a stable version of IndexedDB.")
			}else{
				var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

				// Open (or create) the database
				var open = indexedDB.open("MyDatabase", 1);

				// Create the schema
				open.onupgradeneeded = function() {
					console.log("Onupgraded");
				    var db = open.result;
				    var store = db.createObjectStore("MyObjectStore", {keyPath: "id"});
				    var index = store.createIndex("NameIndex", ["name", "gender"]);
				};

				open.onsuccess = function() {
					console.log("Onsuccess");
				    // Start a new transaction
				    var db = open.result;
				    var tx = db.transaction("MyObjectStore", "readwrite");
				    var store = tx.objectStore("MyObjectStore");
				    var index = store.index("NameIndex");
				    
				   /* for(d in data){
				    	console.log(data[d].id +  data[d].name + data[d].age);
				    	store.put({id: Number(data[d].id), name: data[d].name, gender: data[d].gender});
				    }*/
				    
				   
				    // Add some data
				    //store.put({id: 12345, name: {first: "John", last: "Doe"}, age: 42});
				    //store.put({id: 67890, name: {first: "Bob", last: "Smith"}, age: 35});
				    
				    // Query the data
				    var getJohn = store.get(12345);

				    var getPerson = store.get(2074007);
				    //var getPerson = index.get(["Haresh Bhagat", "MALE"]);
				    var getBob = index.get(["Smith", "Bob"]);

				    getJohn.onsuccess = function() {
				        console.log(getJohn.result.name.first);  // => "John"
				    };
				    
				    getPerson.onsuccess = function() {
				        console.log(getPerson.result);  // => "John"
				    };

				    getBob.onsuccess = function() {
				        console.log(getBob.result.name.first);   // => "Bob"
				    };

				    // Close the db when the transaction is done
				    tx.oncomplete = function() {
				        db.close();
				    };
				}
			}
		});
		
		// Kick off the update function
		updateTime();
	});