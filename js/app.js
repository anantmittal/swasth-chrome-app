angular
		.module('myApp', [])
		.controller(
				'MainCtrl',
				function($scope, $timeout, $http) {
					// Build the date object
					// $scope.date = {};
					// Update function
					/*
					 * var updateTime = function () { $scope.date.raw = new
					 * Date(); $timeout(updateTime, 1000); }
					 */

					window.IDBTransaction = window.IDBTransaction
							|| window.webkitIDBTransaction
							|| window.msIDBTransaction;
					window.IDBKeyRange = window.IDBKeyRange
							|| window.webkitIDBKeyRange || window.msIDBKeyRange

					if (!window.indexedDB) {
						window
								.alert("Your browser doesn't support a stable version of IndexedDB.")
					} else {
						var indexedDB = window.indexedDB || window.mozIndexedDB
								|| window.webkitIndexedDB || window.msIndexedDB
								|| window.shimIndexedDB;

						var req = indexedDB.deleteDatabase("MyDatabase");
					}

					$scope.readlat = function() {
						//console.log("Read");
						var open = indexedDB.open("MyDatabase", 1);
						open.onsuccess = function() {
							//console.log("Onsuccess");
								var db = open.result;
								var tx = db.transaction("MyObjectStore","readwrite");
								var store = tx.objectStore("MyObjectStore");

								var j = 0;

								store.openCursor().onsuccess = function(event) {
									var cursor = event.target.result;
									j++;
									if (cursor) {
										cursor.advance(Math.floor(Math.random() * (50000) + 1));
										if(j==2){
											//console.log(cursor.value);
											tx.abort();
										}
									} 
									else {
										console.log('Entries all displayed.');
									}
								};
						}
					}
					
					$scope.readFn = function(){
						for (var i = 0; i < 10000; i++) {
							var d1 = new Date();
							var n1 = d1.getTime();
							$scope.readlat();
							var d2 = new Date();
							var n2 = d2.getTime();
							var t = n2 - n1;
							console.log("Record-" + i + "|" + t);
						}
					}
					
					$scope.writelat = function() {
						//console.log("Write");
						$http.get('../data/50000.json').success(
								function(data) {
									// console.log(data);
									$scope.lala = data.length;
									var open = indexedDB.open("MyDatabase", 1);

									open.onupgradeneeded = function() {
										//console.log("Onupgraded");
										var db = open.result;
										var store = db.createObjectStore(
												"MyObjectStore", {
													keyPath : "id"
												});
										// var store =
										// db.createObjectStore("MyObjectStore2",
										// {keyPath: "id"});
										// var index =
										// store.createIndex("NameIndex",
										// ["name",
										// "gender"]);
									};

									open.onsuccess = function() {
										//console.log("Onsuccess");
										// Start a new transaction
										var db = open.result;
										/*
										 * var tx =
										 * db.transaction("MyObjectStore",
										 * "readwrite"); var store =
										 * tx.objectStore("MyObjectStore");
										 * 
										 * var i = 0; for(d in data){
										 * store.put({id: i, data: data[d].id});
										 * i++; }
										 */

										var tx = db.transaction(
												"MyObjectStore", "readwrite");
										var store = tx
												.objectStore("MyObjectStore");

										// var index = store.index("NameIndex");
										// store.put({id: 0, data:data});
										var i = 0;
										for (d in data) {
											var d1 = new Date();
											var n1 = d1.getTime();
											store.put({
												id : Number(data[d].id),
												data : data[d]
											});
											var d2 = new Date();
											var n2 = d2.getTime();
											++i;
											var t = n2 - n1;
											console.log("Record-" + i + "|" + t);
										}
									}

								});
					}

					// Kick off the update function
					// updateTime();
				});