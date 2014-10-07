angular.module('app.directives', [])
.directive('googleMapsDirective', GoogleMapsDirective);

function GoogleMapsDirective() {
  console.log("Welcome to google maps directive");
  return {
    restrict: 'EA',
    templateUrl: 'templates/GoogleMapsTemplate.html',
    link: function($scope, $element, $attr) {}
  };
}