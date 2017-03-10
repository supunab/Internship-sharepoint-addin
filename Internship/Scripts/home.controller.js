angular.module("mainModule").controller("homeController", ["$scope", "$state", "$interval", "userService", function ($scope, $state, $interval, userService) {

    var redirectPromise = $interval(function () {
        if (userService.userLoaded) {
            var userType = userService.getUserType();

            switch (userType) {
                case "Admin":
                    $state.transitionTo("admin");
                    break;

                case "Company":
                    $state.transitionTo("company");
                    break;

                default:
                    // Default user is considered as student
                    $state.transitionTo("student");
                    break;
            }

            stopInterval();

        }

    }, 1000);

    function stopInterval() {
        $interval.cancel(redirectPromise);
    }

}]);