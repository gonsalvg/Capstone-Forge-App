var Auth_URL = window.location.toString();

// Splits this https://murmuring-cove-16220.herokuapp.com/?code=QF2BHBpC6ZMh2PszqRpvKoMIdnSjzPbvu1r-uQId
// ------------------------------------------------------
// into https://murmuring-cove-16220.herokuapp.com/
// and code=QF2BHBpC6ZMh2PszqRpvKoMIdnSjzPbvu1r-uQId

var checker = Auth_URL.split( '?' );

// Splits this code=QF2BHBpC6ZMh2PszqRpvKoMIdnSjzPbvu1r-uQId
// ------------------------------------------------------
// into code
// and QF2BHBpC6ZMh2PszqRpvKoMIdnSjzPbvu1r-uQId

var Auth_Code_Parts = checker[1].split( '=' );

// Should return "code"
console.log(Auth_Code_Parts[0]);

if (Auth_Code_Parts[0] == "code") {
	
	//The actual code we can now use.
	var Auth_code = Auth_Code_Parts[1]
	console.log(Auth_Code);
	
}