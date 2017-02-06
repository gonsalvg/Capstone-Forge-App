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
var Auth_url = "https://developer.api.autodesk.com/authentication/v1/authorize?response_type=code&client_id=DZPRPW3dMysLmkiVb0eeulKRaGjH8GpQ&redirect_uri=https://murmuring-cove-16220.herokuapp.com/&scope=data:read"
    var token = makeSyncRequest('/api/token');
    if (token != '') console.log('Get current token: ' + token);
    return token;
	
function makeSyncRequest(VarUrl) {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", VarUrl, false);
    xmlHttp.send(null);
    var response = xmlHttp.responseText;
	console.log(response);
}


/*
    var urlSuffix = urlSuffixes[env];
//    $('head').append('<script src="https://developer' + urlSuffix + '.api.autodesk.com/viewingservice/v1/viewers/viewer3D.min.js"></script>');
//    $('head').append('<link rel="stylesheet" type="text/css" href="https://developer' + urlSuffix + '.api.autodesk.com/viewingservice/v1/viewers/style.min.css">');
//
//    $('head').append('<script src="js/extensions/Roomedit3dTranslationTool.js"></script>');
//    $('head').append('<script src="js/roomedit3dapiclient.js"></script>');

    // Get the tokens
    var token = getToken();// get3LegToken();
    var auth = $("#authenticate");
    if (token === '') {
        $("#env").prop('disabled', false);
        auth.click(authenticate);
    }
    else {
        $("#env").prop('disabled', true);
        MyVars.token3Leg = token
        MyVars.token2Leg = get2LegToken();

        auth.html('You\'re logged in');
        auth.click(function () {
            if (confirm("You're logged in and your token is " + token + '\nWould you like to log out?')) {
                $.ajax({
                    url: '/api/logoff',
                    type: 'POST',
                    success: function (url) {
                        window.location.reload();
                    }
                }).done(function (url) {
                    window.location.reload();
                }).fail (function (xhr, ajaxOptions, thrownError) {
                    alert('logoff error!') ;
                }) ;
            }
        });
    
});

function getToken() {
    var token = makeSyncRequest('/api/token');
    if (token != '') console.log('Get current token: ' + token);
    return token;
}

function get2LegToken() {
    var token = makeSyncRequest('/api/2LegToken');
    console.log('2 legged token (Developer Authentication): ' + token);
    return token;
}

function useToken(token) {
    $.ajax({
        url: '/api/token',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            'token': token
        })
    });
}



function authenticate() {
    var env = $("#env").val();
    $.ajax({
    $.ajax({
        url: '/api/authenticate',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            'env': env
        })
    }).done(function (url) {
        // iframes are not allowed
        PopupCenter(url, "Autodesk Login", 800, 400);
    }).fail(function (err) {
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
*/