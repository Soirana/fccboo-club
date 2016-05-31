$(document).ready(function() {
		var name =   $( "#nameOrig" );
		var  email=  $( "#emailOrig" );
		var country = $("#countryOrig");
		var region =  $( "#regionOrig" );
		var city =  $( "#cityOrig" );
		$.get( "/profile", {})
			.done(function(data) {
				name.html("Name: <span>"+data.name+"</span>");
				email.html("Email: <span>"+data.email+"</span>");
				country.html("Country: <span>"+data.country+"</span>");
				region.html("Region/State: <span>"+data.region+"</span>");
				city.html("City: <span>"+data.city+"</span>");
		});
		$("#updater").on("click", function() {
			var update = {};
			var upName = $( "#name" ).val(),
				upCountry= $( "#country" ).val(),
				upRegion= $( "#region" ).val(),
				upCity = $( "#city" ).val();
				console.log (upRegion);
			var check = false;
			if (upName !== "") {
				check = true;
				update.name = upName;
			}
			if (upCountry !== "") {
				check = true;
				update.country = upCountry;
			}
			if (upRegion !== "") {
				check = true;
				update.region = upRegion;
			}
			if (upCity !== "") {
				check = true;
				update.city = upCity;
			}
			if (check) {
				
				$.get( "/profileUpdate", update)
					.done(function(data) {
						 location.reload();
						 }) 
			}
		});	
});