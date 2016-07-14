'use strict';

app.controller('LoginCtrl', function ($scope, Auth, $state) {
  $scope.sendCredentials = function (creds) {
    Auth.login(creds)
    .then(function () {
      $state.go('stories');
    });
  };
});