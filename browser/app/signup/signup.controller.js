'use strict';

app.controller('SignupCtrl', function (Auth, $scope, $state) {
  $scope.sendCredentials = function (creds) {
    Auth.signup(creds)
    .then(function () {
      $state.go('stories');
    });
  };
});