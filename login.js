"use strict";
angular.module("myApp", ["ngAnimate", "ngCookies", "ngResource", "ngRoute", "ngSanitize", "ngTouch", "ui.bootstrap"]).config(["$routeProvider", function(a) {
    a.when("/", {
        templateUrl: "views/login.html",
        controller: "LoginCtrl"
    }).when("/login", {
        templateUrl: "views/login.html",
        controller: "LoginCtrl"
    }).when("/signUp", {
        templateUrl: "views/signup.html",
        controller: "SignupCtrl"
    }).when("/dashboard", {
        templateUrl: "views/dashboard.html",
        controller: "DashboardCtrl"
    }).otherwise({
        templateUrl: "views/404.html"
    })
}]).run(["$rootScope", "$timeout", "$location", "apiConnector", function(a, b, c, d) {
    a.$on("$routeChangeSuccess", function() {
        b(function() {
            a.isViewLoading = !1
        }, 1e3)
    }), a.$on("$routeChangeStart", function(b, e) {
        a.isViewLoading = !0, d.get("api/users/authenticated").then(function(b) {
            b.data.authenticated === !0 ? (a.authenticated = b.data.authenticated, a.deName = b.data.deName, a.deUser = b.data.deUser, a.deMail = b.data.deMail) : angular.isObject(e.$$route) && "/signUp" !== e.$$route.originalPath && "/login" !== e.$$route.originalPath && c.path("/")
        })
    })
}]), angular.module("myApp").controller("LoginCtrl", ["$scope", "$location", "apiConnector", "$timeout", function(a, b, c, d) {
    a.login = {
        username: null,
        password: null
    }, a.loading = !1, a.alerts = [], a.btLogin = "Log In", a.logout = function() {
        c.get("api/users/logout").then(function(c) {
            "error" === c.status && (a.loading = !1, a.addAlert("danger", c.message)), "success" === c.status && (a.addAlert("success", c.message), d(function() {
                b.path("/")
            }, 1e3))
        })
    }, a.submitFormLogin = function() {
        a.loading = !0, a.btLogin = "loading...", c.post("api/users/loginApi", {
            login: a.login
        }).then(function(c) {
            "error" === c.status && (a.loading = !1, a.btLogin = "Log In", a.addAlert("danger", c.message)), "success" === c.status && (a.addAlert("success", c.message), d(function() {
                b.path("dashboard")
            }, 1e3))
        })
    }, a.addAlert = function(b, c) {
        var d = "";
        d = "danger" === b ? "glyphicon glyphicon-exclamation-sign" : "glyphicon glyphicon-ok-sign", a.alerts = [{
            type: b,
            msg: c,
            icone: d
        }]
    }, a.closeAlert = function() {
        a.alerts.splice(0, 1)
    }
}]), angular.module("myApp").controller("SignupCtrl", ["$scope", "$location", "apiConnector", function(a, b, c) {
    a.signUp = {
        deName: null,
        username: null,
        email: null,
        password: null,
        confirmPassword: null
    }, a.alerts = [], a.loading = !1, a.btSignUp = "Sign Up", a.$watchCollection("signUp", function(b, d) {
        angular.isUndefined(a.signUpForm) || (a.signUpForm.username.$dirty && !a.signUpForm.username.$invalid && b.username !== d.username && c.post("api/users/verifyUsernameIsRegistered", {
            username: b.username
        }).then(function(b) {
            "error" === b.status ? a.signUpForm.username.$error.usernameAlreadyRegistered = !0 : "success" === b.status && (a.signUpForm.username.$error.usernameAlreadyRegistered = !1)
        }), a.signUpForm.email.$dirty && !a.signUpForm.email.$invalid && b.email !== d.email && c.post("api/users/verifyEmailIsRegistered", {
            email: b.email
        }).then(function(b) {
            "error" === b.status ? a.signUpForm.email.$error.emailAlreadyRegistered = !0 : "success" === b.status && (a.signUpForm.email.$error.emailAlreadyRegistered = !1)
        }))
    }), a.submitFormSignUp = function() {
        c.post("api/users/signUpApi", {
            signUp: a.signUp
        }).then(function(c) {
            "error" === c.status && (a.loading = !1, a.btLogin = "Log In", a.addAlert("danger", c.message)), "success" === c.status && b.path("dashboard")
        })
    }, a.addAlert = function(b, c) {
        var d = "";
        d = "danger" === b ? "glyphicon glyphicon-exclamation-sign" : "glyphicon glyphicon-ok-sign", a.alerts = [{
            type: b,
            msg: c,
            icone: d
        }]
    }, a.closeAlert = function() {
        a.alerts.splice(0, 1)
    }
}]), angular.module("myApp").service("apiConnector", ["$http", function(a) {
    var b = "",
        c = {};
    return c.get = function(c) {
        return a.get(b + c).then(function(a) {
            return a.data
        })
    }, c.post = function(c, d) {
        return a.post(b + c, d).then(function(a) {
            return a.data
        })
    }, c.put = function(c, d) {
        return a.put(b + c, d).then(function(a) {
            return a.data
        })
    }, c["delete"] = function(c) {
        return a["delete"](b + c).then(function(a) {
            return a.data
        })
    }, c
}]), angular.module("myApp").controller("DashboardCtrl", ["$scope", function(a) {
    a.alerts = [], a.addAlert = function(b, c) {
        var d = "";
        d = "danger" === b ? "glyphicon glyphicon-exclamation-sign" : "glyphicon glyphicon-ok-sign", a.alerts = [{
            type: b,
            msg: c,
            icone: d
        }]
    }, a.closeAlert = function() {
        a.alerts.splice(0, 1)
    }
}]), angular.module("myApp").directive("compareTo", function() {
    return {
        scope: {
            otherModelValue: "=compareTo"
        },
        require: "ngModel",
        link: function(a, b, c, d) {
            var e = function() {
                var c = b.val(),
                    d = a.otherModelValue;
                return null !== d ? c === d : void 0
            };
            a.$watch(e, function(a) {
                d.$setValidity("errorCompareTo", a)
            })
        }
    }
}), angular.module("myApp").directive("validatePassword", function() {
    return {
        scope: !0,
        require: "ngModel",
        link: function(a, b, c, d) {
            var e = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/,
                f = function() {
                    var b = a.$eval(c.ngModel);
                    return null !== b ? e.test(b) : void 0
                };
            a.$watch(f, function(a) {
                d.$setValidity("passwordIsNotValid", a)
            })
        }
    }
}), angular.module("myApp").directive("validateUsername", function() {
    return {
        scope: !0,
        require: "ngModel",
        link: function(a, b, c, d) {
            var e = /^[A-Z][a-zA-Z0-9]{8,24}$/,
                f = function() {
                    var b = a.$eval(c.ngModel);
                    return null !== b ? e.test(b) : void 0
                };
            a.$watch(f, function(a) {
                d.$setValidity("usernameIsNotValid", a)
            })
        }
    }
});