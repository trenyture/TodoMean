angular.module('app', ['ngRoute'])
	.factory('Todos', function($http){
		return {
			read: function() {
				return $http.get('/api/tasks');
			},
			readOne: function(id) {
				return $http.get('/api/tasks/'+id);
			}
		};
	})
	.controller('TodoController', ['$scope', 'Todos', function ($scope, Todos) {
		$scope.todos = [];

		var handleSuccess = function(data, status) {
			$scope.todos = data;
			console.log($scope.todos);
		};
		Todos.read().success(handleSuccess);
	}])
	.controller('AddController', ['$scope', '$http', '$location', 'Todos', function ($scope, $http, $location, Todos) {
		$scope.add = function(todo) {
	        $http.post('/api/tasks/',angular.copy(todo)).success(function (data, status, headers) {
	            $location.path('/'); 
	        });
	    };
	}])
	.controller('UpdateController', ['$scope', '$http', '$routeParams', '$location', 'Todos', function ($scope, $http, $routeParams, $location, Todos) {
	    $scope.todos = [];

		var handleSuccess = function(data, status) {
			$scope.todos = data;
			console.log($scope.todos);
		};
		Todos.readOne($routeParams.id).success(handleSuccess);

		$scope.update = function(todo) {
			console.log(angular.copy(todo));
	        $http.put('/api/tasks/'+$routeParams.id,angular.copy(todo)).success(function (data, status, headers) {
	            $location.path('/'); 
	        });
	    };
	}])
	.controller('RemoveController', ['$scope', '$http', '$routeParams', '$location', 'Todos', function ($scope, $http, $routeParams, $location, Todos) {
		 $http.delete('/api/tasks/' + $routeParams.id)
	        .success(function (data, status, headers) {
	            $location.path('/'); 
	        });	
	}]) 
	
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl: '/todos.html',
			controller: 'TodoController'
		})
		.when('/add', {
			templateUrl: '/add.html',
			controller: 'AddController'
		})
		.when('/update/:id', {
			templateUrl: '/update.html',
			controller: 'UpdateController'
		})
		.when('/remove/:id', {
			templateUrl: '/remove.html',
			controller: 'RemoveController'
		});
	}]);