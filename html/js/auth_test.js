var URL = window.location;

//should print full url 
console.log(URL);

// Splits this https://murmuring-cove-16220.herokuapp.com/?code=QF2BHBpC6ZMh2PszqRpvKoMIdnSjzPbvu1r-uQId
// ------------------------------------------------------
// into https://murmuring-cove-16220.herokuapp.com/
// and code=QF2BHBpC6ZMh2PszqRpvKoMIdnSjzPbvu1r-uQId

var checker = window.location.pathname.split( '?' );

// Splits this code=QF2BHBpC6ZMh2PszqRpvKoMIdnSjzPbvu1r-uQId
// ------------------------------------------------------
// into code
// and QF2BHBpC6ZMh2PszqRpvKoMIdnSjzPbvu1r-uQId

var Auth_Code = checker.pathname.split( '=' );

// Should return "code"
console.log(Auth_Code[0]);

if Auth_Code[0] == 'code' {
	
	//The actual code we can now use.
	Auth_code = Auth_Code[1]
	console.log(Auth_Code);
	
}