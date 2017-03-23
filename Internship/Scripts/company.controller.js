angular.module("mainModule").controller("companyController", ["$scope", "$state", "userService", function ($scope, $state, userService) {
    $scope.studentEmails = [];
    $scope.students = {};
    $scope.company;
    $scope.dataLoaded = false;
    
    if (!userService.userLoaded) {
        // Goto home on refresh
        $state.transitionTo("home");
    }

    $scope.hostWeb = userService.hostWebUrl;
    var userEmail = userService.userEmail;

    // Find what is the company
    var clientContext = SP.ClientContext.get_current();
    var companyEmailList = clientContext.get_web().get_lists().getByTitle("CompanyEmailList");

    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml("<View><Query><Where><Eq><FieldRef Name='Email' /><Value Type='Text'>" + userEmail + "</Value></Eq></Where></Query></View>");
    var items = companyEmailList.getItems(camlQuery);

    clientContext.load(items);
    clientContext.executeQueryAsync(function () {
        // Can only exist one record
        var enumerator = items.getEnumerator();
        if (enumerator.moveNext()) {
            $scope.company = enumerator.get_current().get_item("Company");
        } else {
            $("#modalHeader").html("Unknown Email Address");
            $("#modalBody").html("Your email address is not registered as a company email address. Please contact the internship coordinator if there is any issue.");
            $("#dialogModal").modal();
        }

        // Since this is a callback, $apply to show changes in the view
        $scope.$apply();

        // Now get students allocated for the company
        getStudentList();

    }, onError);


    function getStudentList() {
        var studentList = clientContext.get_web().get_lists().getByTitle("StudentList");
        camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml("<View><Query><Where><Or><Eq><FieldRef Name='Company1' /><Value Type='Text'>" + $scope.company + "</Value></Eq><Eq><FieldRef Name='Company2' /><Value Type='Text'>" + $scope.company + "</Value></Eq></Or></Where></Query></View>");

        items = studentList.getItems(camlQuery);
        clientContext.load(items);

        clientContext.executeQueryAsync(function () {
            var enumerator = items.getEnumerator();

            while (enumerator.moveNext()) {
                $scope.studentEmails.push(enumerator.get_current().get_item("Email"));
            }

            // Retrive CV data for the above emails
            getCVData();

        }, onError)
    }

    function getCVData() {
        var hostWebUrl = userService.hostWebUrl;
        var hostClientContext = new SP.AppContextSite(clientContext, hostWebUrl);

        var internshipList = hostClientContext.get_web().get_lists().getByTitle("InternshipList");
        camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml("<View><Query><Where><Eq><FieldRef Name='Company' /><Value Type='Text'>" + $scope.company + "</Value></Eq></Where></Query></View>");

        items = internshipList.getItems(camlQuery);
        clientContext.load(items);

        clientContext.executeQueryAsync(function () {
            enumerator = items.getEnumerator();

            while (enumerator.moveNext()) {
                var current = enumerator.get_current();
                $scope.students[current.get_item("Email")] = current.get_item("FileLeafRef");
            }

            // Since this is a callback function, to update view $apply
            $scope.dataLoaded = true;
            $scope.$apply();

            $("#studentTable").DataTable();

        }, onError)
    }

    function onError(err) {
        console.log(err);
        $("#modalHeader").html("An Error Occurred");
        $("#modalBody").html("Something went wrong. This might be due to internet connection problem. Please perform the task again.");
        $("#dialogModal").modal();
    }

}]);