//JS and jQuery for RQ
$('document').ready(function(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;
			var key = returnAPIKey();
			getWeather(latitude, longitude, key);
		});
	}

});


var latitude;
var longitude;

var getWeather = function(latitude, longitude,key){
	
	//This version of the GET request uses freegeoip since it allows for JSONP use

	// $.getJSON('http://freegeoip.net/json/?callback', function(json){
	// 	var myStr = JSON.stringify(json);
	// 	alert(myStr);
	// });

	//Use the previous code if crossorigin.me stops working
	$.getJSON('https:crossorigin.me/https://api.darksky.net/forecast/' + key + '/' + latitude + ','+ longitude, function(json){
		var myStr = JSON.stringify(json);
		// alert(myStr);
		var myObj = JSON.parse(myStr);
		var timezone = myObj['timezone'];
		var summary = myObj.currently['icon'];
		var precipProbability = myObj.currently['precipProbability'];
		var temperature = myObj.currently['temperature'];
		var windSpeed = myObj.currently['windSpeed'];

		displayWeatherData(timezone, summary, precipProbability, temperature, windSpeed);
	});
}


var returnAPIKey = function(){
	var darkskyKey = '4bfbaa11fbe9c3b3c5911e4b8ca8f5ac';
	return darkskyKey;
}


var displayWeatherData = function(timezone, summary, precipProbability, temperature, windSpeed){
	$('#weather-icon').html(summary);
	$('#temperature').html(temperature + '  &#8457');
	$('#precip-prob').html('Precipitation: '+ precipProbability + '% change');
	$('#wind-speed').html(windSpeed + ' MPH');
}