angular.module("mainModule").factory("userService", function () {
    var factory = {};
    var userType = "Student"; // Admin, Company or Student(default)
    factory.userLoaded = false;

    var clientContext = SP.ClientContext.get_current();
    var user = clientContext.get_web().get_currentUser();
    var groups = user.get_groups();

    clientContext.load(groups);

    clientContext.executeQueryAsync(function () {
        var enumerator = groups.getEnumerator();

        // It is assumed that one person can only be in one group
        while (enumerator.moveNext()) {
            var group = enumerator.get_current().get_title();

            if (group === "Admin" || group === "Company") {
                // Admin person
                userType = group;
                break;
            }

        }

        console.log("user deatails loaded from the server");
        factory.userLoaded = true;
        return factory;

    }
    ,
    function () {
        // An error has occured
        alert("An error has occured while getting data from the server. This may be due to bad internet connectino or server overload. Please perform the task again.")
    })

    factory.getUserType = function () {
        return userType;
    }

    return factory;

});