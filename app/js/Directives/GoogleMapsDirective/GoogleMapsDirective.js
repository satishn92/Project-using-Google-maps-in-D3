angular.module('app.directives', [])
.directive('googleMapsDirective', GoogleMapsDirective);

function GoogleMapsDirective() {
  console.log("Welcome to google maps directive");
  return {
    restrict: 'EA',
    scope: {
      data: '='
    },
    templateUrl: 'templates/GoogleMapsTemplate.html',
    link: function($scope, $element, $attr) {
      console.log($scope.data);
      var map = new google.maps.Map(d3.select("div.mapContainer").node(), {
          zoom: 14,
          center: new google.maps.LatLng(12.930748, 77.633042),
          mapTypeId: google.maps.MapTypeId.TERRAIN
      });

      var marker = new google.maps.Marker({
        position: map.getCenter(),
        map:map,
        title: 'click to zoom'
      });

      google.maps.event.addListener(map, 'click', function(event) {
        console.log(event.latLng);
        if(placeMarker !== undefined) {
          placeMarker(event.latLng);
        }
      });

      function placeMarker(location) {
        var addedMarker = new google.maps.Marker({
          position: location,
          map: map
        });
      }

      // var overlay = new google.maps.OverlayView();

      // overlay.onAdd = function() {
      //   var layer = d3.select(this.getPanes().overlayClickTarget)
      //                 .append("div")
      //                 .attr("class", "stations");

      //   layer
      //   .on("click", mapClick);
      //   // .on("mouseover", mapMouseOver)
      //   // .on("mousemove", mouseMove);

      //   function mapClick(d) {
      //     console.log(d);
      //   }

      //   function mapMouseOver(d) {
      //     console.log(d);
      //   }

      //   function mouseMove(d) {
      //     console.log(d);
      //   }
      // }

      // overlay.setMap(map);

      // overlay
      // .on("click", mapClick)
      // .on("mouseover", mapMouseOver)
      // .on("mousemove", mouseMove);

      
    }
  };
}