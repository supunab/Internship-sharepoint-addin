angular.module("mainModule").controller("adminStudentController", ["$scope", "userService", function ($scope, userService) {
    
    $scope.studentArray = [];
    $scope.students = {};
    $scope.uploaded = {};

    // Load the data from the table
    var clientContext = SP.ClientContext.get_current();
    var studentList = clientContext.get_web().get_lists().getByTitle("StudentList");

    var camlQuery = new SP.CamlQuery();
    var items = studentList.getItems(camlQuery);

    // This is only for test, Uploaded1 and Uploaded2 should be taken rather than Company1 nad Company2
    clientContext.load(items, "Include(Email, Company1, Company2)");

    clientContext.executeQueryAsync(function () {
        var enumerator = items.getEnumerator();
        while (enumerator.moveNext()) {
            var current = enumerator.get_current();
            var temp = [];
            $scope.studentArray.push(current.get_item("Email"));
            $scope.uploaded[current.get_item("Email")] = [0, 0];
            temp.push(current.get_item("Company1"));
            temp.push(current.get_item("Company2"));
            $scope.students[current.get_item("Email")] = temp;

        }

        // Get uploaded data
        getUploadStatus();

    }, onError);

    function getUploadStatus() {
        var hostWebUrl = userService.hostWebUrl;
        var hostClientContext = new SP.AppContextSite(clientContext, hostWebUrl);

        var internshipList = hostClientContext.get_web().get_lists().getByTitle("InternshipList");
        items = internshipList.getItems(new SP.CamlQuery(), "Include(Email, Company)");
        clientContext.load(items);

        clientContext.executeQueryAsync(function () {
            var enumerator = items.getEnumerator();
            while (enumerator.moveNext()) {
                var current = enumerator.get_current();
                var tempCompany = current.get_item("Company");
                var tempEmail = current.get_item("Email");

                if ($scope.students[tempEmail][0] === tempCompany) {
                    // First Company
                    $scope.uploaded[tempEmail][0] = 1;
                }
                else {
                    // Should be second company
                    $scope.uploaded[tempEmail][1] = 1;
                }
            }

            // Since this is a callback, $apply to update the model
            $scope.$apply();

        }, onError);

    }

    function onError(err) {
        console.log(err);
        alert("Something went wrong. Please try the task again.");
    }


}]);