var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var querystring = require('querystring');
const http = require("http");
var https = require("https");

var privateKey = fs.readFileSync('sslcert/server.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
		extended: false
	});

app.use(express.static('public'));
app.set('view engine', 'jade');

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
app.get('/search', urlencodedParser, function (req, res) {
	//prepare the request in JSON format
	query = {
		term: req.query.search_query,
		categories: req.query.search_category
	};
	if('longitude' in req.query && req.query.longitude.length >0)		query.longitude = req.query.longitude;
	else{
		res.redirect('/locationerror');
	}
	if('latitude' in req.query && req.query.latitude.length >0) query.latitude = req.query.latitude;
	else{
		res.redirect('/locationerror');
	}
	if('limit' in req.query) query.limit = req.query.limit;
	if('sort_by' in req.query) query.sort_by = req.query.sort_by;
	if('open_now' in req.query) query.open_now = req.query.open_now;
	if('radius' in req.query) query.radius = req.query.radius;
	console.log(req.query.radius);
	performYelpRequest('/v3/businesses/search', 'GET', query, function (data) {
		res.render('search', data);
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
http.createServer(app).listen(8080);
https.createServer(credentials, app).listen(8443);