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

      var type = "info",
          markerIndex = 1,
          infoIndex = 0,
          addedinfoMarker = [],
          addeddirMarkers = [],
          infoWindowHtml= [];
      $scope.info = [];

      var infoHtml = "<div class='infoWindow'></div>";

      d3.selectAll("input.typeBox").on("change", change);
      
      var map = new google.maps.Map(d3.select("div.mapContainer").node(), {
          zoom: 14,
          center: new google.maps.LatLng(12.930748, 77.633042),
          scaleControl: true,
          overviewMapControl: true,
          overviewMapControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER 
          },
          zoomControl: true,
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.LEFT_BOTTOM
          },
          rotateControl: true,
          streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
          },
          mapTypeId: google.maps.MapTypeId.TERRAIN
      });

      var marker = new google.maps.Marker({
        position: map.getCenter(),
        map:map,
        title: 'Current location'
      });

      addeddirMarkers[1] = marker;
      d3.select("h1.firstLocation").text("First Location");
      d3.select("p.firstLocationLat").text(map.getCenter().k);
      d3.select("p.firstLocationLong").text(map.getCenter().B);

      var styles = [ 
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [
            {visibility: "simplified"},
            {color: "#EAE71F"}
          ]
        },
        {
          featureType: "road.arterial",
          elementType: "labels.icon",
          stylers: [
            {color: "#C71010"}
          ]
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [
            {color: "#1FEA39"}
          ]
        },
        {
          featureType: "transit.line",
          elementType: "geometry",
          stylers: [
            {color: "#382DDF"}
          ]
        }
        // {
        //   featureType: "Marker",
        //   // elementType: "geometry",
        //   stylers: [
        //     {color: "#1FEA39"}
        //   ]
        // }
      ];

      map.setOptions({styles: styles});

      var infoWindow = new google.maps.InfoWindow({});
      infoWindow.setContent(infoHtml);

      var dirPath = new google.maps.Polyline({
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
          editable: true,
          draggable: true
        });

      dirPath.setMap(map);

      var dirCoordinates = dirPath.getPath();
      dirCoordinates.setAt(0, map.getCenter());
      console.log(map.getCenter());

      google.maps.event.addListener(map, 'click', function(event) {
        console.log(event);
        infoWindow.close();
        if(placeMarker !== undefined) {
          placeMarker(event.latLng);
        }
      });

      google.maps.event.addListener(map, 'dblclick', function(event) {
        console.log(marker.getPosition());
        map.panTo(marker.getPosition());
      });

      // for(var marker in addedinfoMarker) {
      //   addedinfoMarker[marker].on('click', function(event) {
      //     console.log("markerdblclick" + this);
      //     this.setMap(null);
      //   });
      // }

      function change() {
        type = this.value;
        console.log("type: " + type);
        if(type === "info") {
          d3.select("div.directionsContainer").style("display", "none");
          d3.select("div.detailsContainer").style("display", "inline-block");
        }

        if (type === "dir") {
          d3.select("div.detailsContainer").style("display", "none");
          d3.select("div.directionsContainer").style("display", "inline-block");
        }
      }

      function placeMarker(location) {
        if(type === "info") {
          infoPlaceMarker(location);
        }

        if (type === "dir") {
          dirPlaceMarker(location);
        }
      }

      function infoPlaceMarker(location) {
        console.log("infoPlaceMarker");
        addedinfoMarker[infoIndex] = new google.maps.Marker({
          position: location,
          draggable: true,
          animation: google.maps.Animation.DROP,
          map: map
        });

        google.maps.event.addListener(addedinfoMarker[infoIndex], 'click', function(event) {
          console.log("markerclick" + this);
          infoWindow.open(map,this);
          console.log(event);

          infoWindowHtml = '<form accept="image/gif, image/jpeg" class="info">'+
                                      '<div class="row inputinfo">'+
                                      '<div class="col-lg-4"><label class="infolbl">Name: </label></div>'+
                                      '<div class="col-lg-8">'+
                                      '<input type="text" name="name" placeHolder="Type the name of the location" class="name">'+
                                      '</div>'+
                                      '</div>'+
                                      '<div class="row inputinfo">'+
                                      '<div class="col-lg-4"><label class="infolbl">Description: </label></div>'+
                                      '<div class="col-lg-8"><textarea class="descr" placeHolder="Write the description of the location"></textarea></div>'+
                                      '</div>'+
                                      '<div class="row inputinfo">'+
                                      '<div class=col-lg-4><label>Image: </label></div>'+
                                      '<div class=col-lg-8><input type="file" class="image"></div>'+
                                      '</div>'+
                                      '<div><button type="button" class="submitBtn' + infoIndex + '">Submit</button></div>'+
                                      '</form>'+
                                      '<div class="afterSubmit">'+
                                      '<h1 class="infoName"></h1>'+
                                      '<p>Latitude: ' + event.latLng.B + '</p>'+
                                      '<p>Longitude: ' + event.latLng.k + '</p>'+
                                      '<button class="editInfo">Edit</button>'
                                      '</div>';

          d3.selectAll("div.infoWindow").html(infoWindowHtml);
          d3.selectAll("button.submitBtn" + infoIndex).on("click", click);
        });

        google.maps.event.addListener(addedinfoMarker[infoIndex++], 'dblclick', function(event) {
          console.log("markerdblclick" + this);
          this.setMap(null);
        });
      }

      function dirPlaceMarker(location) {
        if (markerIndex === 1) {
          markerIndex = 2;
        } else {
          markerIndex = 1;
        }

        updateLocation(markerIndex, location);

        if (addeddirMarkers[markerIndex] !== undefined) {
          addeddirMarkers[markerIndex].setMap(null);
        }

        addeddirMarkers[markerIndex] = new google.maps.Marker({
          position:location,
          map: map
        });
        dirCoordinates.setAt(markerIndex-1, location);
        console.log(dirCoordinates);
        console.log(google.maps.geometry.spherical.computeLength(dirCoordinates.getArray()));

        d3.select("p.distance").text("Distance between the two places is " + google.maps.geometry.spherical.computeLength(dirCoordinates.getArray()));
      }

      function click(d) {
        var nameInfo = $("input.name").val(),
            descrInfo = $("textarea.descr").val(),
            imgInfo = $("input.image").val();

        imgInfo = imgInfo.replace('fakepath', 'detailsimg');
        imgInfo = imgInfo.replace('C:', 'images');
        console.log(nameInfo, descrInfo, imgInfo);
        console.log(d);

        d3.select("img.detailsImg").attr("src", imgInfo);

        d3.select("h1.details").text(nameInfo);

        d3.select("p.details").text(descrInfo);

        d3.select("form.info").style("display", "none");

        d3.select("div.afterSubmit").style("display", "block");

        d3.select("h1.infoName").text(nameInfo);

        d3.select("div.detailsContainer")
        .style("opacity", 0)
        .transition()
        .duration(3000)
        .style("opacity", 1);

      }

      function updateLocation(mIndex, location) {
        console.log(mIndex);
        console.log(location);
        if(mIndex === 1) {
          d3.select("h1.firstLocation").text("First Location");
          d3.select("p.firstLocationLat").text(location.k);
          d3.select("p.firstLocationLong").text(location.B);
        }

        if (mIndex === 2) {
          d3.select("h1.secondLocation").text("Second Location");
          d3.select("p.secondLocationLat").text(location.k);
          d3.select("p.secondLocationLong").text(location.B);
        }
      }

      
    }
  };
}