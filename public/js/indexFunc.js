function clearCategory(){
	document.getElementById('search-category').value = '';
}
function clearQuery(){
	document.getElementById('search-query').value = '';
}
function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
}
var hungryApp = angular.module("imHungry", []);
hungryApp.controller("hungerController", function($scope){
	$scope.hungry = ["No.", "YES I'M HUNGRY!!!"]; //use this for "im feeling lucky" feature
	$scope.dismiss = function(){ //hide section
		document.getElementById('lucky').style.display=("none");
	}
	$scope.goRandom = function(){
		var parameters = {
			search_query:'',
			search_category:'food',
			longitude: document.getElementById("longitude").value,
			latitude: document.getElementById("latitude").value,
			limit:7,
			sort_by:"distance",
			open_now: true,
			radius:2000,
		}
		post('/search/', parameters, 'GET');
	}
});

var questioner = angular.module("myCategories",['ngAnimate']);
questioner.controller("myCtrl", function($scope) {
	$scope.noncultural = noncultural;
	$scope.noncultural_titles = [];
	for(var i = 0; i < $scope.noncultural.length; i++){
		$scope.noncultural_titles.push($scope.noncultural[i]['title']);
	}
	$scope.cultural = cultural;
	$scope.cultural_titles = [];
	for(var i = 0; i < $scope.cultural.length; i++){
		$scope.cultural_titles.push($scope.cultural[i]['title']);
	}
	$scope.openCultural = function(){
		console.log("CULTURAL CLICKED"); //TODO, load in cultural
	}
	$scope.openItem = function(index){
		clearQuery();
		document.getElementById('search-category').value = index['alias'];
		document.getElementById('search').submit();
		
	}
});
questioner.directive('.fade', function(){
	return{
		hide: function($scope, element, attrs){
			element.css('background-color', 'yellow');
		}
	}
});


angular.bootstrap(document.getElementById('lucky'), ['imHungry']);
angular.bootstrap(document.getElementById('questions'), ['myCategories']);
			