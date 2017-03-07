angular.module("mainModule").controller("homeController", ["$scope", "$state", function ($scope, $state) {
    
    $scope.test = "Hello from the controller";

    $scope.redirect = function () {
        $state.transitionTo("student", { arg: "arg" });
    }

}]);