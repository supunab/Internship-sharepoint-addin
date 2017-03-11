angular.module("mainModule").factory("userService", function () {
    var factory = {};
    var userType = "Student"; // Admin, Company or Student(default)
    factory.userLoaded = false;

    var clientContext = SP.ClientContext.get_current();
    var user = clientContext.get_web().get_currentUser();
    var groups = user.get_groups();

    // Get user groups
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

        factory.userLoaded = true;

    }
    , onError);


    // Get user email
    clientContext.load(user);
    clientContext.executeQueryAsync(function () {
        factory.userEmail = user.get_email();
    }, onError);

    factory.getUserType = function () {
        return userType;
    }

    function onError(err) {
        console.log(err);
        alert("An error has occured while getting data from the server. This may be due to bad internet connectino or server overload. Please perform the task again.");
    }

    factory.appWebUrl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl")).split("#")[0];
    factory.hostWebUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));

    // Get parameters from the query string.
    function getQueryStringParameter(paramToRetrieve) {
        var params = document.URL.split("?")[1].split("&");
        for (var i = 0; i < params.length; i = i + 1) {
            var singleParam = params[i].split("=");
            if (singleParam[0] == paramToRetrieve) return singleParam[1];
        }
    }

    return factory;

});