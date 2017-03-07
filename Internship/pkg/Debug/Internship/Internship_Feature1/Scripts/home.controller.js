angular.module("mainModule").controller("homeController", ["$scope", "$state", function ($scope, $state) {
    
    $scope.redirect = function () {
        $state.transitionTo("student.state", { arg: "arg" });
    }

}]);