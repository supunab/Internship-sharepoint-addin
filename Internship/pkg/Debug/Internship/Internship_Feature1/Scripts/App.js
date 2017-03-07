var app = angular.module("mainModule", ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");

    $stateProvider
    .state("student.state", {
        url: "/student",
        templateUrl: "student.html",
        controller: "studentController"
    })

    .state("company.state", {
        url: "/company",
        templateUrl: "company.html",
        controller: "companyController"
    })

    .state("admin.state", {
        url: "/admin",
        templateUrl: "admin.html",
        controller: "adminController"
    })

    .state("home.state", {
        url: "/home",
        templateUrl: "home.html",
        controller: "homeController"
    })

});