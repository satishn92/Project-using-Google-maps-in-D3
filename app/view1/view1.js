angular.module('myApp.view1', ['ngRoute'])

.controller('View1Ctrl', [ 'settings' , '$scope', View1Ctrl]);


function View1Ctrl(settings, $scope) {
  console.log("Welcome to controller 1");
  $scope.data = settings.data;
}
