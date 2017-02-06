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

function authenticate() {
    var env = $("#env").val();
    $.ajax({
        url: '/api/authenticate',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            'env': env
        })
    }).done(function(url) {
        // iframes are not allowed
        PopupCenter(url, "Autodesk Login", 800, 400);
    }).fail(function(err) {
        console.log('authenticate error\n' + err.statusText);
    });
}
// http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
function PopupCenter(url, title, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
}