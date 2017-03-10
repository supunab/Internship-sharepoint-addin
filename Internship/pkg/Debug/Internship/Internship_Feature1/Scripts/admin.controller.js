angular.module("mainModule").controller("adminController", ["$scope", function ($scope) {
    $scope.studentArray;

    $scope.readFile = function () {
        // Check file extention
        var fileExt = document.getElementById("studentCompanyList").value;
        fileExt = fileExt.split(".");
        fileExt = fileExt[fileExt.length - 1];

        if (fileExt !== "csv") {
            alert("Only CSV files are allowed. Please upload a .CSV file.");
            return;
        }
        

        var files = document.getElementById("studentCompanyList").files;

        if (!files.length) {
            alert("Please upload a file");
            return;
        }

        var file = files[0];

        var reader = new FileReader();

        reader.onloadend = function (evt) {
            if (evt.target.readyState == FileReader.DONE) {
                console.log("Done reading");
                $scope.studentArray = Papa.parse(evt.target.result).data;
                
                // Remove the first row; (Header row)
                $scope.studentArray = $scope.studentArray.slice(1);

                // Apply changes to $scope since this is called from a callback
                $scope.$apply();
            }
        };

        reader.readAsText(file);

    }

    $scope.updateToDatabase = function () {
        // Delete all the current records
        var clientContext = SP.ClientContext.get_current();
        var studentList = clientContext.get_web().get_lists().getByTitle("StudentList");
        var camlQuery = new SP.CamlQuery();
        var items = studentList.getItems(camlQuery);

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

            // Now execute the delete operation and perform the add operation
            clientContext.executeQueryAsync(function () {
                // Add every element in the $scope.studentArray
                for (var i = 0; i < $scope.studentArray.length - 1 ; i++) {
                    var itemCreationInfo = new SP.ListItemCreationInformation();
                    var newItem = studentList.addItem(itemCreationInfo);
                    newItem.set_item("Email", $scope.studentArray[i][0]);
                    newItem.set_item("Company1", $scope.studentArray[i][1]);
                    newItem.set_item("Company2", $scope.studentArray[i][2]);
                    newItem.update();
                }

                clientContext.executeQueryAsync(function () {
                    alert("Success!");

                }, onError);



            }, onError)
        },
        onError);


        // After that Add all the new records

    }

    function onError(err) {
        console.log(err);
        alert("There has been an error, this migth be becuase of an internet connection problem. Please try to perform the task again.");
    }

}]);