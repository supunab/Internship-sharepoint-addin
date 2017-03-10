angular.module("mainModule").controller("adminStudentController", ["$scope", function ($scope) {
    
    $scope.studentArray = [];

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
            var temp = []
            temp.push(current.get_item("Email"));
            // Company1 and Company2 shoud be changed to Uploaded1 and Uploaded2
            temp.push(current.get_item("Company1"));
            temp.push(current.get_item("Company2"));

            
            $scope.studentArray.push(temp);

        }

        // Since this is a callback, $apply to update the model
        $scope.$apply();

        alert("success");

    }, onError);


    function onError(err) {
        console.log(err);
        alert("Something went wrong. Please try the task again.");
    }


}]);