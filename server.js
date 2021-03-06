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

//YELP API IMPLEMENTATION
//Search with query, location
app.get('/search', urlencodedParser, function (req, res) {
	//prepare the request in JSON format
	query = {};
	var error = false;
	if('longitude' in req.query && req.query.longitude.length >0)		query.longitude = req.query.longitude;
	else{
		res.redirect('/locationerror');
		error = true;
	}
	if('latitude' in req.query && req.query.latitude.length >0) query.latitude = req.query.latitude;
	else{
		res.redirect('/locationerror');
		error = true;
	}
	if('search_query' in req.query) query.term = req.query.search_query;
	if('search_category' in req.query) query.categories = req.query.search_category;
	if('limit' in req.query) query.limit = req.query.limit;
	if('sort_by' in req.query) query.sort_by = req.query.sort_by;
	if('open_now' in req.query) query.open_now = req.query.open_now;
	if('radius' in req.query) query.radius = req.query.radius;
	if(!error){
		performYelpRequest('/v3/businesses/search', 'GET', query, function (data) {
			if('businesses' in data){
				data.query = query;
				res.render('search', data);
			}
			else res.render('error');
		});
	}
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
				var responseObject = {};
				try{
					responseObject = JSON.parse(responseString);
				} catch(err){
					return console.error(e);
				}
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

app.get('/locationerror', function(req, res){
	res.render('locationerror');
});

app.get('*', function(req, res){
  res.render('error');
});

//server config
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
