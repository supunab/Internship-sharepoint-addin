var app = angular.module("mainModule", ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/student");

    $stateProvider
    .state("student", {
        url: "/student",
        templateUrl: "student.html",
        controller: "studentController"
    })

    .state("company", {
        url: "/company",
        tempalteUrl: "company.html",
        controller: "companyController"
    })

    .state("admin", {
        url: "/admin",
        templateUrl: "admin.html",
        controller: "adminController"
    })

});