angular.module("mainModule").controller("adminController", ["$scope", function ($scope) {
    
    var csvContent;
    $scope.studentArray = [];

    $scope.readFile = function(){
        var files = document.getElementById("studentCompanyList").files;

        if (!files.length) {
            alert("Please upload a file");
        }

        var file = files[0];

        var reader = new FileReader();

        reader.onloadend = function (evt) {
            if (evt.target.readyState == FileReader.DONE) {
                csvContent = evt.target.result;
            }
        };

        reader.readAsText(file);

        console.log(Papa.parse(csvContent));
    }



}]);