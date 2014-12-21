var geocoder;
var map;
function initialize() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(1.451385980291502, 103.8200479802915);
  var mapOptions = {
    zoom: 14,
    center: latlng
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}
function codeAddress() {
  var address = document.getElementById('pincode').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function getGeocode(){
  var address = document.getElementById('pincode').value;
  var geolocation;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      geolocation=results[0].geometry.location;
      // var location=results[0].geometry.location.k+","+results[0].geometry.location.D;
      console.log(geolocation);
      return geolocation;
    }
  });

  console.log(geolocation);

  // return geolocation;

}

google.maps.event.addDomListener(window, 'load', initialize);
