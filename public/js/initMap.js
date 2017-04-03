function initMap(){
	var user = {
		lat: parseFloat(getParameterByName('latitude')),
		lng: parseFloat(getParameterByName('longitude'))
	};
	var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: user
		});
	var infowindow = new google.maps.InfoWindow();
	for (var i = 0; i < data.length; i++) {
		var lat = parseFloat(data[i]['coordinates']['latitude']);
		var lng = parseFloat(data[i]['coordinates']['longitude']);
		var coords = new google.maps.LatLng(lat,lng);
		var marker = new google.maps.Marker({
				position: coords,
				map: map,
				label: {text: i+1+'', fontWeight:'bold'}
			});
		google.maps.event.addListener(marker, 'click', (function (marker, i) {
				return function() {
					var address = data[i]['location']['display_address'];
					var contentString = 
						"<div style='padding-bottom:5px;font-size:16px;'>"
							+'<b>' + (i+1) + ' ' + data[i]['name'] + '</b></br>'
						+'</div>'
						+'<div>'
							+"<div style='inline-block; float:left; padding-right:5px;'>"
								+"<img style='height:60px; border-radius:30px;', src='" 
								+ data[i]['image_url'].substr(0, data[i]['image_url'].length-5)
								+ "90s.jpg', alt="
								+ data[i]['name']+ ' image'
								//+ data[i]['image_url']
								+ '>'
							+'</div>'
							+"<div style='inline-block; float:right;'>"
								+ address[0] + '</br>'
								+ address[1]
							+'</div>'
						+'</div>';
					infowindow.setContent(contentString);
					infowindow.open(map, marker);
				}
			})(marker, i));
	}
}