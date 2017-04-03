function geoloc() {
	console.log("Getting location...");
	if (navigator.geolocation) {
		var options = {
			enableHighAccuracy : true,
			timeout: 7000,
			maximumAge: 1800000
		};
		navigator.geolocation.getCurrentPosition(updatePosition, error, options);
	} else {
		alert('Geolocation is not supported in your browser');
	}
};
window.onload = geoloc;
function updatePosition(position){
	console.log("Success");
	document.getElementById('longitude').value = position.coords.longitude;
	document.getElementById('latitude').value = position.coords.latitude;
};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  document.getElementById('location-error').innerHTML = 'ERROR: Could not get HTML5 Geolocation!';
};