(function(){
    'use strict';

    var app = angular.module("homeAccounting", ['ui.bootstrap', 'smart-table']);

    app.controller('HomeController', ['$scope', '$location', '$http', '$window',
        function($scope, $location, $http, $window) {

            $scope.name = '';

            $scope.go = function(){
                $http.post(PATH + '/api/v1/people', {
                    name : $scope.name
                })
                    .success(function(data) {
                        $window.location.href = "people/" + data.id;
                    })
                    .error(function(data) {
                        console.dir(data);
                    });
            };

        }
    ]);

    app.controller('NewUserController', ['$scope', '$location', '$http','$window',
        function($scope, $location, $http, $window) {

            $scope.name = '';
            $scope.surname = '';
            $scope.email = '';

            $scope.insert = function() {

                $http.post(PATH + '/api/v1/people/insert', {
                    name: $scope.name,
                    surname: $scope.surname,
                    email: $scope.email
                })
                .success(function (data) {
                        $window.location.href = "room/" + data.id;

                })
                .error(function (data) {
                    console.dir(data);
                });addRoom

            }



        }
    ]);

    app.controller('PeopleController', ['$scope', '$location', '$http', '$filter','$window',
        function($scope, $location, $http, $filter, $window) {
            $scope.data = res;

            $scope.goToRoom = function(room){
                $window.location.href = "../room/" + userId + "/" + room.id;
            };


        }
    ]);

    app.controller('RoomController', ['$scope', '$location', '$http', '$filter', '$window',
        function($scope, $location, $http, $filter, $window) {
            $scope.newDate = new Date();
            $scope.data = res;
            $scope.transactions = res.transactions;

            /*DatePicker*/



            $scope.open = function($event) {
                $scope.status.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };


            $scope.status = {
                opened: false
            };
            /*DatePicker*/



            $scope.addRoom = function(){
                $http.post(PATH + '/api/v1/rooms/new', {
                    name: $scope.newRoom
                })
                .success(function (data) {
                    $scope.rooms.push(data);
                })
                .error(function (data) {
                    console.dir(data);
                });
            };

            $scope.addTransaction = function() {

                $http.post(PATH + '/api/v1/transaction/insert', {
                    roomId: $scope.data.roomId,
                    peopleId: $scope.data.peopleId,
                    date: $scope.newDate,
                    location: $scope.newLocation,
                    amount: $scope.newAmount
                })
                    .success(function (data) {
                        $scope.transactions.push(data);
                        $scope.newLocation = '';
                        $scope.newAmount = '';
                    })
                    .error(function (data) {
                        console.dir(data);
                    });
            };

            $scope.confirm = function(){

                $http.post(PATH + '/api/v1/transaction/confirm', {
                    roomId: $scope.data.roomId,
                    peopleId: $scope.data.peopleId
                })
                    .success(function (data) {
                        $scope.transactions = [];
                    })
                    .error(function (data) {
                        console.dir(data);
                    });
            };


            $scope.getAllRooms = function(){

                $http.get(PATH + '/api/v1/rooms/' + userId)
                    .success(function (data) {
                        $scope.rooms = data;
                    })
                    .error(function (data) {
                        console.dir(data);
                    });
            };

            $scope.enterRoom = function(room){
                $http.post(PATH + '/api/v1/rooms/add', {
                    roomId: room.id,
                    peopleId: userId
                })
                .success(function (data) {
                        $window.location.href = "../room/" + userId + "/" + room.id;
                })
                .error(function (data) {
                    console.dir(data);
                });

            };

        }
    ]);

})();


