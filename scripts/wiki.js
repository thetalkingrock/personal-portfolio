$(document).ready(function(){
	
	var lastSearchTerm = "";
	var containersFull = false;
	//fade in everything once page loads
	$("#image-container").fadeIn(1500, function () {
		$("#random-link-container").fadeIn(1500, function () {
			$("#search-container").fadeIn(1500);
		});
	});
	
	function cleanUpInputVal(searchTerm){
		searchTerm = searchTerm.trim();
		searchTerm = searchTerm.replace(/\s\s+/g, " ");
		searchTerm = searchTerm.replace(/\s/, "+");
		return searchTerm;		
	}
	
	$(document).keypress(function (e) {
		//if enter is pressed AND search term has been entered in the input area
		//AND this is the first search that has been made
		if(e.which == 13 && $("input").val() !== "" && $("input").val() != null && !containersFull){
			//clean up input value
			var searchTerm = $("input").val();
			searchTerm = cleanUpInputVal(searchTerm);
			lastSearchTerm = searchTerm;
			
			var wikiURL = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=";
			wikiURL += searchTerm;
			wikiURL += "&utf8=&format=json";
			//retrieve data from wikipedia api
			$.ajax({
				type: "GET",
				url: wikiURL,
				dataType: "jsonp",
				success: function(data){
					var numResults = data["query"]["search"].length;
					//put each search result 
					for(var x = 0; x < numResults; x++){
						//place correct page in href attribute
						var currentResult = data["query"]["search"][x]["title"];
						var result = "<a href=";
						var link = "https://en.wikipedia.org/wiki/";
						link += currentResult.replace(/\s/g, "_");
						
						result += link;
						result += " target=_blank";
						result += ">";
						result += "<div class='result-container'>" + currentResult + "</div>";
						result += "</a>";
						//add div to page
						$("#results-container").append(result);
					}
					
					$(".result-container").each(function () {
						$(this).fadeIn(1500);
					});
					//move window down to place more results in view
					var rect = document.getElementById("search-container").getBoundingClientRect();
					console.log(rect.top);
					window.scrollTo(0, rect.top);
				}
			});
			containersFull = true;
		}
		//for when search has already been performed at least once
		else if(e.which == 13 && $("input").val() !== "" && $("input").val() != null && containersFull){
			
			var searchTerm = $("input").val();
			searchTerm = cleanUpInputVal(searchTerm);
			
			if(searchTerm !== lastSearchTerm){
				lastSearchTerm = searchTerm;
				
				$("#results-container").fadeTo(1000, 0, function(){
				
					var wikiURL = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=";
					wikiURL += searchTerm;
					wikiURL += "&utf8=&format=json";
				
					$.ajax({
						type: "GET",
						url: wikiURL,
						dataType: "jsonp",
						success: function(data){
							var numResults = data["query"]["search"].length;
							for(var x = 0; x < numResults; x++){
								var currentResult = data["query"]["search"][x]["title"];
							
								var link = "https://en.wikipedia.org/wiki/";
								link += currentResult.replace(/\s/g, "_");
								//update containers and links
								$("#results-container a").eq(x).attr("href", link);
								$("#results-container div").eq(x).text(currentResult);
							}
							$("#results-container").fadeTo(1000, 1);
						}
					});
				});	
			}
		}
	});
});