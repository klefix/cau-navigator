if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault('counter', 0);

    Meteor.startup(function () {
        GoogleMaps.load();
    });

    Template.hello.helpers({
        counter: function () {
            return Session.get('counter');
        },
        exampleMapOptions: function () {
            // Make sure the maps API has loaded
            if (GoogleMaps.loaded()) {
                // Map initialization options
                return {
                    center: new google.maps.LatLng(54.3460549, 10.1125135),
                    zoom: 17
                };
            }
        }
    });

    var directionsService;
    var directionsDisplay;
    var marker;
    var target;

    Template.hello.onCreated(function () {
        var self = this;

        // We can use the `ready` callback to interact with the map API once the map is ready.
        GoogleMaps.ready('exampleMap', function (map) {


            directionsService = new google.maps.DirectionsService;
            directionsDisplay = new google.maps.DirectionsRenderer;

            directionsDisplay.setMap(map.instance);

            // Create and move the marker when latLng changes.
            self.autorun(function () {
                var latLng = Geolocation.latLng();
                if (!latLng)
                    return;

                // If the marker doesn't yet exist, create it.
                if (!marker) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(latLng.lat, latLng.lng),
                        map: map.instance
                    });
                }
                // The marker already exists, so we'll just change its position.
                else {
                    marker.setPosition(latLng);
                }

                directionsService.route({
                    origin:  Geolocation.latLng(),
                    destination: target,
                    travelMode: google.maps.TravelMode.WALKING
                }, function(response, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                    } else {
                        window.alert('Directions request failed due to ' + status);
                    }
                });

                // Center and zoom the map view onto the current position.
                map.instance.setCenter(marker.getPosition());
                map.instance.setZoom(17);
            });
        });
    });

    Template.body.events({
        'click .location': function (event) {
            console.log(event.target);
            place = $(event.target).data('place');
            if(place != null) {
                target = {placeId: place};
            } else {
                target = $(event.target).data('address');
            }
            console.log(target);

            directionsService.route({
                origin:  Geolocation.latLng(),
                destination: target,
                travelMode: google.maps.TravelMode.WALKING
            }, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
