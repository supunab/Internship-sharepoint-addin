var app = angular.module("mainModule", ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");

    $stateProvider
    .state("student", {
        url: "/student",
        templateUrl: "student.html",
        controller: "studentController"
    })

    .state("company", {
        url: "/company",
        templateUrl: "company.html",
        controller: "companyController"
    })

    .state("admin", {
        url: "/admin",
        templateUrl: "admin.html",
        controller: "adminController"
    })

    .state("home", {
        url: "/home",
        templateUrl: "home.html",
        controller: "homeController"
    })

});