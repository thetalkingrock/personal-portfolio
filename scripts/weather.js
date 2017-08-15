$(document).ready(function(){
	
	//convert degrees in celsius to degrees in fahrenheit and vice versa
	$("#degree-type").click(function(){
		
		var currentDegreeType = $("#degree-type").text();
		
		var currentTemp = Number($("#temp").text());
		$("#temp-container").fadeTo(500, 0, function(){
			
			if(currentDegreeType === "C"){
				var newTemp = Math.floor(currentTemp * 1.8 + 32);
				$("#temp").text(newTemp);
				$("#degree-type").text("F");
			}else if(currentDegreeType === "F"){
				var newTemp = Math.floor((currentTemp - 32) / 1.8);
				$("#temp").text(newTemp);
				$("#degree-type").text("C");
			}
			
			$("#temp-container").fadeTo(500, 1);
		});
		
	});	
	//retrieve user's location
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(gotLocation, displayErrorMessage);
	}else{
		displayErrorMessage();
	}
	//if able to access user's location, this function is called and updates page with information about the local weather
	function gotLocation(position){
		var longitude = position.coords.longitude;
		var latitude = position.coords.latitude;
		$.getJSON("https://fcc-weather-api.glitch.me/api/current?lat=" + latitude
		 + "&lon=" + longitude, function (data) {
			
			$("#temp").text(Math.round(data["main"]["temp"]) + $("#temp").text());
			
			$("#weather").text(data["weather"][0]["main"]);
			
			$("#humidity").text(data["main"]["humidity"] + "%");
			
			$("#wind-info").text(data["wind"]["speed"] + " mph " + convertDegreesToDirection(data["wind"]["deg"]));
			
			var weatherDescription = data["weather"][0]["main"];
			//update background image depending on weather
			if(weatherDescription.toLowerCase().indexOf("rain") >= 0 || weatherDescription.toLowerCase().indexOf("drizzle") >= 0){
				$("body").css("background", "url(../assets/images/rain.jpg) no-repeat center center fixed;");
			}else if(weatherDescription.toLowerCase().indexOf("cloud") >= 0){
				$("body").css("background", "url(../assets/images/cloudy.jpg) no-repeat center center fixed;");
			}else if(weatherDescription.toLowerCase().indexOf("sun") >= 0 || weatherDescription.toLowerCase().indexOf("clear") >= 0){
				$("body").css("background", "url(../assets/images/sunny.jpg) no-repeat center center fixed;");
			}else if(weatherDescription.toLowerCase().indexOf("storm") >= 0){
				$("body").css("background", "url(../assets/images/storm.jpg) no-repeat center center fixed;");
			}else if(weatherDescription.toLowerCase().indexOf("snow") >= 0){
				$("body").css("background", "url(../assets/images/snow.jpg) no-repeat center center fixed;");
			}
			
			//$("body").css("background-size", "100% 100%");
			
		});
		//uses the google map api to get location name via reverse geocoding
		$.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=" + "AIzaSyAdK12U8IEM2GsHQpQUmadq4Ws5a_Ah0ko", function (data) {
				
				var cityName = data["results"][0]["address_components"][2]["long_name"];
				var stateName = data["results"][0]["address_components"][4]["short_name"];
				$("#main-container").css("visibility", "visible");
				$("#city-name").text(cityName + ", " + stateName);
		});
	}
	
	function displayErrorMessage(){
		$("#main-container").css("visibility", "visible");
		$("h1").text("Location could not be accessed");	
	}
	//converts wind direction from degrees to compass directions
	function convertDegreesToDirection(windDirectionInDegrees){
		
		if((windDirectionInDegrees >= 348.75 && windDirectionInDegrees <= 360) || (windDirectionInDegrees >= 0) && windDirectionInDegrees <= 11.25){
			return "N";
		}
		else if(windDirectionInDegrees > 11.25 && windDirectionInDegrees <= 33.75){
			return "NNE";
		}
		else if(windDirectionInDegrees > 33.75 && windDirectionInDegrees <= 56.25){
			return "NE";
		}
		else if(windDirectionInDegrees > 56.25 && windDirectionInDegrees <= 78.75){
			return "ENE";
		}
		else if(windDirectionInDegrees > 78.75 && windDirectionInDegrees <= 101.25){
			return "E";
		}
		else if(windDirectionInDegrees > 101.25 && windDirectionInDegrees <= 123.75){
			return "ESE";
		}
		else if(windDirectionInDegrees > 123.75 && windDirectionInDegrees <= 146.25){
			return "SE";
		}
		else if(windDirectionInDegrees > 146.25 && windDirectionInDegrees <= 168.75){
			return "SSE";
		}
		else if(windDirectionInDegrees > 168.75 && windDirectionInDegrees <= 191.25){
			return "S";
		}
		else if(windDirectionInDegrees > 191.25 && windDirectionInDegrees <= 213.75){
			return "SSW";
		}
		else if(windDirectionInDegrees > 213.75 && windDirectionInDegrees <= 236.25){
			return "SW";
		}
		else if(windDirectionInDegrees > 236.25 && windDirectionInDegrees <= 258.75){
			return "WSW";
		}
		else if(windDirectionInDegrees > 258.75 && windDirectionInDegrees <= 281.25){
			return "W";
		}
		else if(windDirectionInDegrees > 281.25 && windDirectionInDegrees <= 303.75){
			return "WNW";
		}
		else if(windDirectionInDegrees > 303.75 && windDirectionInDegrees <= 326.25){
			return "NW";
		}
		else if(windDirectionInDegrees > 326.25 && windDirectionInDegrees <= 348.75){
			return "NNW";
		}
	}
	
});