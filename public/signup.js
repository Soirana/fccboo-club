$(document).ready(function() {
	var mail = $( "#email" );
	var passw = $( "#passw" );
	var repass = $( "#repassw" );
	$("#signer").on("click", function() {
		var passwLine= passw.val();
		var mailLine= mail.val();
		var repassLine = repass.val();
		if (passwLine.length<6){
			$('#warner').text('Needs at least 6 characters');
			return;
		}
		if (passwLine !== repassLine){
			$('#warner').text('Passwords do not match');
			return;
		}
	    var mailcheck = /[^\s@]+@[^\s@]+\.[^\s@]+/;
	    // from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    	if (!mailcheck.test(mailLine)){
    		$('#warner').text('Does not seem to be valid email');
			return;	
    	}
    				$.get( "/add", {
    					email: mailLine,
    					password: passwLine})
    					.done(function( data ) {
    						if(data.error){
    							window.location.href = "/signup.html";
    						} else{
    							window.location.href = "/login.html";
    						}
    					});
	});
});