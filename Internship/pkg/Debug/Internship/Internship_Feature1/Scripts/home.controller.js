angular.module("mainModule").controller("homeController", ["$scope", "$state", "$timeout", "userService", function ($scope, $state, $timeout, userService) {

    $scope.$watch(function () {
        console.log("here");
        return userService.userLoaded;
    },
    function () {
        console.log("user load watched");
        console.log(userService.userLoaded);
        if (userService.userLoaded) {
            var userType = userService.getUserType();

            console.log(userType);
            switch (userType) {
                case "Admin":
                    $state.transitionTo("admin", { arg : "arg"});
                    break;

                case "Company":
                    $state.transitionTo("company");
                    break;

                default:
                    // Default user is considered as student
                    $state.transitionTo("student");
                    break;
            }

        }

    });

    $scope.redirect = function () {
        $state.transitionTo("student", { arg: "arg" });
    }

}]);