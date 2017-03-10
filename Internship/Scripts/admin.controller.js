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

}]);