function clearCategory(){
	document.getElementById('search-category').value = '';
}
function clearQuery(){
	document.getElementById('search-query').value = '';
}

var hungryApp = angular.module("imHungry", []);
hungryApp.controller("hungerController", function($scope){
	$scope.hungry = ["No.", "YES I'M HUNGRY!!!"]; //use this for "im feeling lucky" feature
	$scope.dismiss = function(){ //hide section
		document.getElementById('lucky').style.display=("none");
	}
	$scope.goRandom = function(){
		console.log("gorandom");
		//TODO direct to random place
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
			