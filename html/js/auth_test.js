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
	var Auth_Code = Auth_Code_Parts[1];
	console.log(Auth_Code);
	
}

//curl -v 'https://developer.api.autodesk.com/authentication/v1/gettoken'
//  -X 'POST'
//  -H 'Content-Type: application/x-www-form-urlencoded'
//  -d 'client_id=DZPRPW3dMysLmkiVb0eeulKRaGjH8GpQ&client_secret=M14nblPOBp90vxOa&grant_type=authorization_code&code=Auth_Code&redirect_uri=https://murmuring-cove-16220.herokuapp.com/'