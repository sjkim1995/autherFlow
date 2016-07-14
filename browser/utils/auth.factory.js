'use strict';

app.factory('Auth', function ($http, $rootScope) {
  return {
    login: function (info) {
      return $http.post('/auth/login', info)
      .then(function (response) {
        $rootScope.currentUser = response.data;
      });
    },
    signup: function (info) {
      return $http.post('/auth/signup', info)
      .then(function (response) {
        $rootScope.currentUser = response.data;
      });;
    },
    fetchCurrentUser: function () {
      return $http.get('/auth/me')
      .then(function (response) {
        return response.data;
      });
    },
    logout: function () {
      return $http.get('/auth/logout')
      .then(function () {
        $rootScope.currentUser = null;
      });
    }
  }
});