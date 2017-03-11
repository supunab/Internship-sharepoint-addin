angular.module("mainModule").controller("adminCompanyController", ["$scope", function ($scope) {
    $scope.test = "Hello from the controller";
    $scope.companyList;
    $scope.currentCompanyList = [];

    // load the current company list
    loadCurrentCompanyList();

    $scope.readCSV = function () {
        // Check file extention
        var fileExt = document.getElementById("companyFile").value;
        fileExt = fileExt.split(".");
        fileExt = fileExt[fileExt.length - 1];

        if (fileExt !== "csv") {
            alert("Only CSV files are allowed. Please upload a .CSV file.");
            return;
        }

        var files = document.getElementById("companyFile").files;

        if (!files.length) {
            alert("You have to upload a file");
            return;
        }

        var file = files[0];

        var reader = new FileReader();

        reader.onloadend = function (evt) {
            if (evt.target.readyState == FileReader.DONE) {
                $scope.companyList = Papa.parse(evt.target.result).data;

                // Remove the first row; (Header row)
                $scope.companyList = $scope.companyList.slice(1);

                // Apply changes to $scope since this is called from a callback
                $scope.$apply();
            }
        };

        reader.readAsText(file);
    }

    $scope.uploadToDatabase = function(){
        var clientContext = SP.ClientContext.get_current();
        var companyEmailList = clientContext.get_web().get_lists().getByTitle("CompanyEmailList");

        // Retrive all items and delete
        var items = companyEmailList.getItems(new SP.CamlQuery());
        clientContext.load(items, "Include(Id)");

        clientContext.executeQueryAsync(function () {
            var enumerator = items.getEnumerator();
            var tempArray = [];

            while (enumerator.moveNext()) {
                tempArray.push(enumerator.get_current());
            }

            for (var i in tempArray) {
                tempArray[i].deleteObject();
            }

            // Execute delete operation async, and add all items in the callback
            clientContext.executeQueryAsync(function () {
                for (var i = 0; i < $scope.companyList.length - 1; i++) {
                    item = companyEmailList.addItem(new SP.ListItemCreationInformation());
                    item.set_item("Company", $scope.companyList[i][0]);
                    item.set_item("Email", $scope.companyList[i][1]);
                    item.update();
                }

                clientContext.executeQueryAsync(function () {
                    alert("Added successfully");
                    // Load the company list to the view
                    loadCurrentCompanyList();

                }, onError);
            }, onError);
        }, onError)
    }

    function onError(err) {
        console.log(err);
        alert("Something went wrong. This may be due to an internet connection problem. Please perform the task again.");
    }

    function loadCurrentCompanyList() {
        var clientContext = SP.ClientContext.get_current();
        var companyEmailList = clientContext.get_web().get_lists().getByTitle("CompanyEmailList");

        var items = companyEmailList.getItems(new SP.CamlQuery());
        clientContext.load(items);

        clientContext.executeQueryAsync(function () {
            var enumerator = items.getEnumerator();

            while (enumerator.moveNext()) {
                var current = enumerator.get_current();
                $scope.currentCompanyList.push([current.get_item("Company"), current.get_item("Email")]);
            }

            // Since this is happening inside a callback, $apply to update the $scope
            $scope.$apply();

        }, onError)
    }

    
}])