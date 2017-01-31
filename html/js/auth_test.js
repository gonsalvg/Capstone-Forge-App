var URL_test = window.location;
var Auth_Code = window.location.pathname.split( '=' );

//should print full url 
console.log(URL_test);

//should print murmur url then code by itself
console.log(Auth_Code[0]);
console.log(Auth_Code[1]);
//should be undefined
console.log(Auth_Code[2]);

//The actual code we can now use.
Auth_code = Auth_Code[1]
console.log(Auth_Code);