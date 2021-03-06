//JS and jQuery for RQ
$('document').ready(function(){
	$('#j-conversion-btn').addClass('disabled');

	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;
			getWeather(latitude, longitude);
		});
	}

});


$('#j-conversion-btn').on('click', function(){
	convertUnits();
});

var latitude;
var longitude;

var getWeather = function(latitude, longitude){
	
	//This version of the GET request uses freegeoip since it allows for JSONP use

	// $.getJSON('http://freegeoip.net/json/?callback', function(json){
	// 	var myStr = JSON.stringify(json);
	// 	alert(myStr);
	// });

	var apiURL = 'https://crossorigin.me/https://api.darksky.net/forecast/';
	var exclude = '?exclude=minutely,hourly,daily,alerts,flags';
	var key = returnAPIKey();
	var refreshIntervalId = window.setInterval(function(){
		var progressVal = $('.loading-bar-progress').width();
		// console.log(progressVal);

		progressVal += 4;
		progressVal = String(progressVal);
		// console.log(progressVal);
		$('.loading-bar-progress').css('width', progressVal);
	}, 50);
	//Use the previous code if crossorigin.me stops working
	$.getJSON('' + apiURL + '' + key + '/' + latitude + ','+ longitude + exclude, function(json){
		var myStr = JSON.stringify(json);
		var myObj = JSON.parse(myStr);
		var timezone = myObj['timezone'];
		var summary = myObj.currently['icon'];
		var precipProbability = myObj.currently['precipProbability'];
		var temperature = myObj.currently['temperature'];
		var windSpeed = myObj.currently['windSpeed'];

		displayWeatherData(timezone, summary, precipProbability, temperature, windSpeed);
		$('#j-conversion-btn').removeClass('disabled');
		$('#j-progress-div').hide();
		window.clearInterval(refreshIntervalId);
	});
}


var returnAPIKey = function(){
	var darkskyKey = '4bfbaa11fbe9c3b3c5911e4b8ca8f5ac';
	return darkskyKey;
}


var displayWeatherData = function(timezone, summary, precipProbability, temperature, windSpeed){
	var summaryImg  = getConditions(summary);
	$('#j-weather-icon').html(summaryImg);
	$('#j-temperature').html('<span id="tempFahrenheit" class="fahrenheit">'+ temperature+ '</span> &#8457');
	$('#j-precip-prob').html('Precipitation: <span id="precipProbability">'+ precipProbability + '%</span> chance');
	$('#j-wind-speed').html('Wind speed: <span id="windImp">' + windSpeed +'</span> MPH');
}

var convertUnits = function(){
	var windImp = (parseFloat($('#windImp').html())).toFixed(2);
	var tempImp = (parseFloat($('#tempFahrenheit').html())).toFixed(2);
	
	if($('#tempFahrenheit').hasClass('fahrenheit')){
		// convert and display in celsius);
		var celsiusTemp = (tempImp - 32) * (5/9);
		var kmSpeed = 1.6 * windImp;
		$('#j-temperature').html('<span id="tempFahrenheit">' + celsiusTemp.toFixed(2) + '</span> &#8451');
		$('#j-wind-speed').html('Wind speed: <span id="windImp">' + kmSpeed.toFixed(2) +'</span> KPH');
		$('#j-conversion-btn').html('Get imperial units');
	} else {
		var fahrenheitTemp =(tempImp * 9/5) + 32;
		var mSpeed = windImp / 1.6;
		$('#j-temperature').html('<span id="tempFahrenheit" class="fahrenheit">' + fahrenheitTemp.toFixed(2) + '</span> &#8457');
		$('#j-wind-speed').html('Wind speed: <span id="windImp">' + mSpeed.toFixed(2) +'</span> MPH');
		$('#j-conversion-btn').html('Get metrics units');
	}
}

var getConditions = function(summary){
	var summaryImg;
	switch(summary){
	case 'clear-day':
		summaryImg = '<i class="wi wi-day-sunny"></i>';
		break;
	case 'clear-night':
		summaryImg = '<i class="wi wi-night-clear"></i>';
		break;
	case 'partly-cloudy-day':
		summaryImg = '<i class="wi wi-day-cloudy"></i>';
		break;
	case 'partly-cloudy-night':
		summaryImg = '<i class="wi wi-night-alt-cloudy"></i>';
		break;
	case 'rain':
		summaryImg = '<i class="wi wi-rain"></i>';
		break;
	case 'snow':
		summaryImg = '<i class="wi wi-snow"></i>';
		break;
	case 'sleet':
		summaryImg = '<i class="wi wi-sleet"></i>';
		break;
	case 'wind':
		summaryImg = '<i class="wi wi-windy"></i>';
		break;
	case 'fog':
		summaryImg = '<i class="wi wi-fog"></i>';
		break;
	case 'cloudy':
		summaryImg = '<i class="wi wi-cloudy"></i>';
		break;
	default:
		summaryImg = "There's weather in your future.";
		break;	
	}
	return summaryImg;
}