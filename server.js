var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const querystring = require('querystring');
//const http = require("http");
const https = require("https");

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
		extended: false
	})

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
	//res.sendFile( __dirname + "/" + "index.htm" );
})

//YELP API IMPLEMENTATION
//Search with query, location
app.get('/search', urlencodedParser, function (req, res) {
	//prepare the request in JSON format
	query = {
		term: req.query.search_query,
		categories: req.query.search_category,
		longitude: req.query.longitude,
		latitude: req.query.latitude

	};
	performYelpRequest('/v3/businesses/search', 'GET', query, function (data) {
		res.render('search', data); //TODO DO SOMETHING WITH DATA
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
var server = app.listen(8081, function () {
		var host = server.address().address
			var port = server.address().port

			console.log("Example app listening at http://%s:%s", host, port)

	})
