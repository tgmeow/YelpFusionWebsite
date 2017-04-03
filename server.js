var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const querystring = require('querystring');
//const http = require("http");
const https = require("https");

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
		extended: false
	});

app.use(express.static('public'));
app.set('view engine', 'jade');
app.set('port', (process.env.PORT || 5000));

//URL RESPONSES
app.get('/', function (req, res) {
	var fs = require("fs");
	var noncult = fs.readFileSync("public/data/US_cat_restaurants_noncultural.json");
	var cult = fs.readFileSync("public/data/US_cat_restaurants_cultural.json");
	var jsonNonCult = JSON.parse(noncult);
	var jsonCult = JSON.parse(cult);
	res.render('index', {
		cultural: jsonCult,
		noncultural:jsonNonCult
	});
})

app.get('/locationerror', function(req, res){
	res.render('locationerror');
});

//YELP API IMPLEMENTATION
//Search with query, location
app.post('/search', urlencodedParser, function (req, res) {
	//prepare the request in JSON format
	query = {
		term: req.body.search_query,
		categories: req.body.search_category
	};
	if('location' in req.body && req.body.location.length>0)
		query.location = req.body.location;
	else{
		if('longitude' in req.body && req.body.longitude.length >0)		query.longitude = req.body.longitude;
		else{
			res.redirect('/locationerror');
		}
		if('latitude' in req.body && req.body.latitude.length >0) query.latitude = req.body.latitude;
		else{
			res.redirect('/locationerror');
		}
	}
	if('limit' in req.body) query.limit = req.body.limit;
	if('sort_by' in req.body) query.sort_by = req.body.sort_by;
	if('open_now' in req.body) query.open_now = req.body.open_now;
	if('radius' in req.body) query.radius = req.body.radius;
	console.log(req.body.radius);
	var response{
		data:data,
		longitude:req.body.longitude,
		latitude:req.body.latitude,
		search_query:req.body.search_query,
		search_category:req.body.search_category
	}
	performYelpRequest('/v3/businesses/search', 'GET', query, function (data) {
		res.render('search', response);
	});
})

//send the request to yelp API
function performYelpRequest(endpoint, method, data, success) {
	var dataString = JSON.stringify(data);

	if (method == 'GET') {
		endpoint += '?' + querystring.stringify(data);
		console.log(endpoint);
	} else {
		headers = {
			'Content-Type': 'application/json',
			'Content-Length': dataString.length
		};
	}

	//YELP API options
	var yelpOptions = {
		host: yelpHost,
		path: endpoint,
		method: method,
		headers: yelpHeaders
	};

	var req = https.request(yelpOptions, function (res) {
			res.setEncoding('utf-8');
			var responseString = '';
			res.on('data', function (data) {
				responseString += data;
			});
			res.on('end', function () {
				var responseObject = JSON.parse(responseString);
				success(responseObject);
			});
		});
	req.write(dataString);
	req.end();
}
//Yelp api config
var yelpHost = 'api.yelp.com';
var yelpHeaders = {
	'Content-Type': 'application/x-www-form-urlencoded',
	'Authorization': 'Bearer yIPR_YhxgA0owa8fm-ZAzOfZNWfQmd74xQdb4RbZE945zPdBMKWZOqyOhR9c9P_nCpcJsqjScDGFuNo3DHKcki4OO55cHKD1biYL_pGp6Vam8DS_9CCYLRrlkBfWWHYx'
}

//server config
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
