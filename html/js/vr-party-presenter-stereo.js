var _socket = io();
var _isThreeLegged = false;
var _selectedOption;
var _sessionId;
var _viewer;
var _last_distance_to_target;
var _view_data_bucket = 'forgevr';
var _default_models = {
    //'pumpkin'       : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnJwYXJ0eS9wdW1rcGluX3YxLjcyODk1MjAzLTIzZTQtNGRkZi05MThlLWZhNjliOTlhYWJiOC5mM2Q',
    //'robot arm'     : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL1JvYm90QXJtLmR3Zng=',
    //'welding robot' : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnJwYXJ0eS9BQkJfcm9ib3QuZHdm',
    //'ergon chair'   : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL0VyZ29uLnppcA==',
    //'differential'  : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL0RpZmYuZHdmeA==',
    //'suspension'    : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL1N1c3BlbnNpb24uZHdm',
    //'house'         : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL2hvdXNlLmR3Zng=',
    //'flyer one'     : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL0ZseWVyT25lLmR3Zng=',
    //'motorcycle'    : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL01vdG9yY3ljbGUuZHdmeA==',
    //'V8 engine'     : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL1Y4RW5naW5lLnN0cA==',
    //'aotea'         : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL2FvdGVhMy5kd2Y=',
    //'dinghy'        : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL2RpbmdoeS5mM2Q=',
    //'column'        : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL3RhYmxldDIuemlw',
    //'tablet'        : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6c3RlYW1idWNrL2VneXB0NC56aXA=',
    //'trophy'        : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnJwYXJ0eS9Ucm9waHlfQW5nZWxIYWNrLmYzZA==',
    //'cake'          : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnJwYXJ0eS9IQkM0LmR3Zng='
    //'movement'      : 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dnJwYXJ0eS9FVEFfNjQ5Ny0xX01vdmVtZW50X0NvcnJlY3RlZF8zLmR3Zg',
	'sports car'	: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9yZ2V2ci9TcG9ydHMlMjBDYXIuZHdmeA',
	'Building'		: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9yZ2V2ci9PZmZpY2UlMjBCdWlsZGluZy5ud2M=',
	'House'			: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9yZ2V2ci9Ib3VzZSUyMERlc2lnbi5ydnQ=',
	'Conference Room'	: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9yZ2V2ci92aXN1YWxpemF0aW9uXy1fY29uZmVyZW5jZV9yb29tLmR3Zw',
	//X-Wing from grabcad.com lowradiation
	'X-Wing'		: 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Zm9yZ2V2ci83NTEwMl9QT0UnU19YLVdJTkdfRklHSFRFUi5zdHA'
};
var _hosts = [ 'murmuring-cove-16220.herokuapp.com' ];

//Adams variable
var MyVars = {
    keepTrying: true
};

//
//  Initialize
//

function initialize() {
    
    _isThreeLegged = false;
    _sessionId = getURLParameter('session');
    if (_sessionId) {        
        // Only generate the UI if a session ID was passed in via the URL

        // Populate our initial UI with a set of buttons, one for each function in the Buttons object
        var panel = document.getElementById('control');
        for (var name in _default_models) {
            var urn = _default_models[name];
            addButton(panel, name, function(urn) { return function() { launchUrn(urn); } }(urn));
        }
    
        var base_url = window.location.origin;
        if (_hosts.indexOf(window.location.hostname) > -1) {
            // Apparently some phone browsers don't like the mix of http and https
            // Default to https on Heroku deployment
            base_url = 'https://' + window.location.hostname;
        }
    
        var url = base_url + '/participant2.html?session=' + _sessionId;
        $('#url').attr('href', url);
        $('#qrcode').qrcode(url);
        
        // If the provided session exists then load its data (right now just its URN)
        $.get(
            window.location.origin + '/api/getSession/' + _sessionId,
            function(req2, res2) {
                if (res2 === "success") {

                    readCookiesForCustomModel();
                    initializeSelectFilesDialog();

                    if (req2 !== "") {
                        Autodesk.Viewing.Initializer(getViewingOptions(), function() {
                            launchUrn(req2);
                        });
                    }
                    else {
                        // Otherwise we'll create a session with this name
                        // (we may want to disable this for security reasons,
                        // but it's actually a nice way to create sessions
                        // with custom names)
                        _socket.emit('create-session', { id: _sessionId });

                        // Initialize viewing but don't start a viewer                        
                        Autodesk.Viewing.Initializer(getViewingOptions(), function() {
                            showAbout();
                            !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
                        });
	                }
                }
            }
        );
    }
    else {
        // If no session was provided, redirect the browser to a session
        // generated by the server
        $.get(
            window.location.origin + '/api/sessionId',
            function(res) {
                _sessionId = res;
                window.location.href = window.location.href + "?session=" + _sessionId;
                //window.location.replace(window.location.origin + "?session=" + _sessionId);
            }
        );    
    }
}


//
//  Terminate
//

function terminate() {
    if (_sessionId) {
        _socket.emit('close-session', { id: _sessionId });
    }
}


function addButton(panel, buttonName, loadFunction) {
    var button = document.createElement('div');
    button.classList.add('cmd-btn-small');

    button.innerHTML = buttonName;
    button.onclick = loadFunction;

    panel.appendChild(button);
}


function launchUrn(urn) {

    var viewerToClose;
    
    // Uninitializing the viewer helps with stability
    if (_viewer) {
        viewerToClose = _viewer;
        _viewer = null;
    }
    
    if (urn) {
        
        $('#aboutDiv').hide();
        $('#3dViewDiv').show();
        
        _socket.emit('lmv-command', { session: _sessionId, name: 'load', value: urn });
    
        urn = urn.ensurePrefix('urn:');
        
        Autodesk.Viewing.Document.load(
            urn,
            function(documentData) {
                var model = getModel(documentData);
                if (!model) return;
    
                _viewer = new Autodesk.Viewing.Private.GuiViewer3D($('#3dViewDiv')[0]);
                _viewer.start();
                _viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, onCameraChange);
                _viewer.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, onIsolate);
                _viewer.addEventListener(Autodesk.Viewing.HIDE_EVENT, onHide);
                _viewer.addEventListener(Autodesk.Viewing.SHOW_EVENT, onShow);
                _viewer.addEventListener(Autodesk.Viewing.EXPLODE_CHANGE_EVENT, onExplode);
                _viewer.addEventListener(Autodesk.Viewing.CUTPLANES_CHANGE_EVENT,onSection);
                _viewer.addEventListener(Autodesk.Viewing.RENDER_OPTION_CHANGED_EVENT, onRenderOption);

                resetSize(_viewer.container);
                    
                if (viewerToClose) {
                    viewerToClose.finish();
                }
                
                loadModel(_viewer, model);
            }
        );
    }
    else {
        // Create a blank viewer on first load
        _viewer = new Autodesk.Viewing.Private.GuiViewer3D($('#3dViewDiv')[0]);
        resetSize(_viewer.container);
    }
}


function resetSize(elem, fullHeight) {
    elem.style.width = window.innerWidth - 360 + 'px'; // subtract the left column
    if (fullHeight) {
        elem.style.height = '';
    }
    else {
        elem.style.height = (window.innerHeight - 40) + 'px'; // subtract the table padding
    }
}


//
//  Viewer3D events
//

function onCameraChange(event) {
    
    // With OBJ models the target moves to keep equidistant from the camera
    // So we just check the distance from the origin rather than the target
    // It seems to work, anyway!
    var distance_to_target = _viewer.navigation.getPosition().length(); //distanceTo(_viewer.navigation.getTarget());
    if (_last_distance_to_target === undefined || Math.abs(distance_to_target - _last_distance_to_target) > 0.1) {
        _socket.emit('lmv-command', { session: _sessionId, name: 'zoom', value: distance_to_target });
        _last_distance_to_target = distance_to_target;
    }
}


// Translate a list of objects (for R13 & R14) to a list of IDs
// Socket.io prefers not to have binary content to transfer, it seems
function getIdList(ids) {
    if (ids.length > 0 && typeof ids[0] === 'object') {
       ids = ids.map(function(obj) { return obj.dbId;});
    }
    return ids;
}

function onIsolate(event) {
    _socket.emit('lmv-command', { session: _sessionId, name: 'isolate', value: getIdList(event.nodeIdArray) });
}


function onHide(event) {
    _socket.emit('lmv-command', { session: _sessionId, name: 'hide', value: getIdList(event.nodeIdArray) });
}


function onShow(event) {
    _socket.emit('lmv-command', { session: _sessionId, name: 'show', value: getIdList(event.nodeIdArray) });
}


function onExplode() {
    _socket.emit('lmv-command', { session: _sessionId, name: 'explode', value: _viewer.getExplodeScale() });
}


function onSection(event) {
    _socket.emit('lmv-command', { session: _sessionId, name: 'section', value: _viewer.getCutPlanes() });
}


function onRenderOption(event) {
    _socket.emit('lmv-command', { session: _sessionId, name: 'render', value: _viewer.impl.currentLightPreset() });
}


//
//  Models upload
//

function onFileSelect() {
    var el = document.getElementById('fileElem');
    if (el) {
        el.click();
    }
}


function cancel() {
    $(this).dialog('close');
    $('#upload-button').html('Upload file');
}


function upload() {

    $('#upload-button').html('Uploading...');
    
    var filteredForUpload = new Array();

    $(':checkbox').each(function() {
        if ($(this).is(':checked')) {
            // 'filesToUpload' seems to be not a regular array, 'filter()'' function is undefined
            for (var i = 0; i < filesToUpload.length; ++i) {
                var file = filesToUpload[i];
                if (file.name == $(this).val()) {
                    filteredForUpload.push(file);
                }
            }
        }
    });

    console.log("Filtered for upload");
    for (var i = 0; i < filteredForUpload.length; ++i) {
        var file = filteredForUpload[i];
        console.log('Selected file: ' + file.name + ' size: ' + file.size);
    }

    onUpload(filteredForUpload);

    $(this).dialog('close');
}


function deselectAllFiles() {
    $(':checkbox').prop('checked', false);
    $(":button:contains('OK')").prop("disabled", true).addClass("ui-state-disabled");
}


function selectAllFiles() {
    $(':checkbox').prop('checked', true);
    $(":button:contains('OK')").prop("disabled", false).removeClass("ui-state-disabled");
}


function initializeSelectFilesDialog() {
    var dlg = document.getElementsByName("upload-files");

    if (dlg.length == 0) {

        var dlgDiv = document.createElement("div");
        dlgDiv.id = "upload-files";
        dlgDiv.title='Uploading files';
        document.getElementsByTagName("body")[0].appendChild(dlgDiv);

        $('#upload-files').append("<p>The following files are larger than 2MB. Are you sure you want to upload them?</p>");

        var buttons = {
            Cancel: cancel,
            'OK': upload,
            'Deselect All': deselectAllFiles,
            'Select All': selectAllFiles
        };

        $('#upload-files').dialog({ 
            autoOpen: false, 
            modal: true,
            buttons: buttons,
            width:"auto",
            resizable: false,
        });
    }
}


function clearCheckBoxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (checkboxes) {
        checkboxes.parentNode.removeChild(checkboxes);
    }

    checkboxes = document.createElement('div');
    checkboxes.id = "checkboxes";
    $('#upload-files').append(checkboxes);
}


function createCheckBox(fileName) {
    var id = "filename-checkbox-" + fileName;
    var checkbox = document.createElement('input');
    checkbox.id = id;
    checkbox.type = "checkbox";
    checkbox.name = "upload-files";
    checkbox.value = fileName;
    
    $("#upload-files").change(function() {
        var numberChecked = $("input[name='upload-files']:checked").size();
        if (numberChecked > 0) {
            $(":button:contains('OK')").prop("disabled", false).removeClass("ui-state-disabled");
        } else {
            $(":button:contains('OK')").prop("disabled", true).addClass("ui-state-disabled");
        }
    });

    var label = document.createElement('label');
    label.htmlFor = id;
    label.appendChild(document.createTextNode(fileName));

    var br = document.createElement('br');

    $('#checkboxes').append(checkbox);
    $('#checkboxes').append(label);
    $('#checkboxes').append(br);
}


function resetSelectedFiles() {
   var fileElem = $("#fileElem");
    fileElem.wrap("<form>").closest("form").get(0).reset();
    fileElem.unwrap();
}


function onFilesDialogCalled(files) {
    filesToUpload = [];
    var sizeLimit = 2097152; // 2MB

    clearCheckBoxes();

    var numberFilesLargerThanLimit = 0;
    for (var i = 0; i < files.length; ++i) {
        var file = files[i];
        if (file.size > sizeLimit) {
            ++numberFilesLargerThanLimit;
            createCheckBox(file.name);
        }

        filesToUpload.push(file);
    }

    // select all files in the confirmation dialog
    selectAllFiles();

    // reset FilesSet property of the input element
    resetSelectedFiles();

    if (numberFilesLargerThanLimit > 0) {
        $('#upload-files').dialog('open');
    } else {
        onUpload(filesToUpload);
    }
}


function onUpload(files) {
    $.get(
        window.location.origin + '/api/uploadtoken',
        function(accessTokenResponse) {
            var viewDataClient = new Autodesk.ADN.Toolkit.ViewData.AdnViewDataClient(
                'https://developer.api.autodesk.com',
                accessTokenResponse
            );
            viewDataClient.getBucketDetailsAsync(
                _view_data_bucket,
                function(bucketResponse) {
                    //onSuccess
                    console.log('Bucket details successful:');
                    console.log(bucketResponse);
                    uploadFiles(viewDataClient, _view_data_bucket, files);
                },
                function(error) {
                    //onError
                    console.log("Bucket doesn't exist");
                    console.log('Attempting to create...');
                }
            );
        }
    );
}


function uploadFiles(viewDataClient, bucket, files) {
    for (var i = 0; i < files.length; ++i) {
        var file = files[i];
        console.log('Uploading file: ' + file.name + ' ...');
        viewDataClient.uploadFileAsync(
            file,
            bucket,
            file.name.replace(/ /g,'_'), // Translation API cannot handle spaces...
            function(response) {
                //onSuccess
                console.log('File upload successful:');
                console.log(response);
                var fileId = response.objects[0].id;
                var registerResponse = viewDataClient.register(fileId);

                if (registerResponse.Result === 'Success' ||
                    registerResponse.Result === 'Created') {
                    console.log('Registration result: ' + registerResponse.Result);
                    console.log('Starting translation: ' + fileId);

                    checkTranslationStatus(
                        viewDataClient,
                        fileId,
                        1000 * 60 * 5, //5 mins timeout
                        function(viewable) {
                            //onSuccess
                            console.log('Translation successful: ' + response.file.name);
                            console.log('Viewable: ');
                            console.log(viewable);

                            var urn = viewable.urn;

                            // add new button
                            var panel = document.getElementById('control');
                            var name = truncateName(response.file.name);
                            addButton(panel, name, function(urn) { return function() { launchUrn(urn); } }(urn));

                            // open it in a viewer
                            launchUrn(urn);

                            // and store as a cookie
                            createCookieForCustomModel('custom_model_' + response.file.name, urn);
                        });
                }
            },

            //onError
            function (error) {
                console.log('File upload failed:');
                console.log(error);
            });
    }
}


function checkTranslationStatus(viewDataClient, fileId, timeout, onSuccess) {
    var startTime = new Date().getTime();
    var timer = setInterval(function() {
        var dt = (new Date().getTime() - startTime) / timeout;
        if (dt >= 1.0) {
            clearInterval(timer);
        } else {
            viewDataClient.getViewableAsync(
                fileId,
                function(response) {
                    console.log(response);
                    console.log('Translation Progress ' + fileId + ': ' + response.progress);
                    $('#upload-button').html(response.progress);

                    if (response.progress === 'complete') {
                        clearInterval(timer);
                        onSuccess(response);
                        $('#upload-button').html('Upload file');
                    }
                },
                function(error) {}
            );
        }
    }, 2000);
};


//
//  Models stored in cookies
//

function truncateName(name) {
    var dotIdx = name.lastIndexOf(".");
    if (dotIdx != -1) {
        var name = name.substring(0, dotIdx);

        if (name.length > 8) {
            name = name.substring(0, 8) + "...";
        }
    }

    return name;
}


function createCookieForCustomModel(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        var expires = '; expires=' + date.toGMTString();
    } else {
        var expires = '';
    }

    var urn = encodeURIComponent(value);
    document.cookie = name + '=' + urn + expires + '; path=/';
}


function readCookiesForCustomModel() {
    var prefix = 'custom_model_';
    var cookies = document.cookie.split(';');

    for (var i in cookies) {
        var c = cookies[i];
        if (c.indexOf(prefix) != -1) {
            c = c.replace(prefix, '');
            var nameValue = c.split('=');
            if (nameValue) {
                var panel = document.getElementById('control');
                addButton(panel, truncateName(nameValue[0]), function(urn) {
                    return function() { launchUrn(urn); }
                }(decodeURIComponent(nameValue[1])));
            }
        }
    }
}


function showAbout() {
    $('#aboutDiv').css('text-indent', 0);
    resetSize($('#layer2')[0], true);
    $('#3dViewDiv').hide();
    $('#aboutDiv').show();
}


// Prevent resize from being called too frequently
// (might want to adjust the timeout from 50ms)
var resize = debounce(function() {
    var div = $('#3dViewDiv');
    var viewing = div.is(':visible');
    resetSize(viewing ? _viewer.container : $('#layer2')[0], !viewing);
}, 50);


//Adams script code 
$(document).ready(function () {
    //debugger;

    // Make sure that "change" event is fired
    // even if same file is selected for upload
    $("#forgeUploadHidden").click(function (evt) {
        evt.target.value = "";
    });

    $("#forgeUploadHidden").change(function(evt) {

        showProgress("Uploading file... ", "inprogress");
        var data = new FormData () ;
        var fileName = this.value;
        data.append (0, this.files[0]) ;
        $.ajax ({
            url: '/dm/files',
            type: 'POST',
            headers: { 'x-file-name': fileName, 'wip-href': MyVars.selectedNode.original.href },
            data: data,
            cache: false,
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            complete: null
        }).done (function (data) {
            console.log('Uploaded file "' + data.fileName + '" with urn = ' + data.objectId);

            // Refresh file tree
            //$('#forgeFiles').jstree("refresh");

            showProgress("Upload successful", "success");
        }).fail (function (xhr, ajaxOptions, thrownError) {
            alert(fileName + ' upload failed!') ;
            showProgress("Upload failed", "failed");
        }) ;
    });

    var upload = $("#uploadFile").click(function(evt) {
        evt.preventDefault();
        $("#forgeUploadHidden").trigger("click");
    });

    get3LegToken(function(token) {
        var auth = $("#authenticate");

        if (!token) {
            auth.click(signIn);
        } else {
            MyVars.token3Leg = token;

            auth.html('You\'re logged in');
            auth.click(function () {
                if (confirm("You're logged in and your token is " + token + '\nWould you like to log out?')) {
                    logoff();
                }
            });

            // Fill the tree with A360 items
            prepareFilesTree();

            // Download list of available file formats
            fillFormats();
        }
    });

    $('#progressInfo').click(function() {
        MyVars.keepTrying = false;
        showProgress("Translation stopped", 'failed');
    });
});

function base64encode(str) {
    var ret = "";
    if (window.btoa) {
        ret = window.btoa(str);
    } else {
        // IE9 support
        ret = window.Base64.encode(str);
    }

    // Remove ending '=' signs
    // Use _ instead of /
    // Use - insteaqd of +
    // Have a look at this page for info on "Unpadded 'base64url' for "named information" URI's (RFC 6920)"
    // which is the format being used by the Model Derivative API
    // https://en.wikipedia.org/wiki/Base64#Variants_summary_table
    var ret2 = ret.replace(/=/g, '').replace(/[/]/g, '_').replace(/[+]/g, '-');

    console.log('base64encode result = ' + ret2);

    return ret2;
}

function signIn() {
    $.ajax({
        url: '/user/authenticate',
        success: function (rootUrl) {
            console.log("succeeded with sign in" + rootUrl);
            location.href = rootUrl;
        },
        error: function() {
            console.log("Failure at sign in");
        }
    });
}

function logoff() {
    $.ajax({
        url: '/user/logoff',
        success: function (oauthUrl) {
            location.href = oauthUrl;
        }
    });
}

function get3LegToken(callback) {

    if (callback) {
        $.ajax({
            url: '/user/token',
            success: function (data) {
                MyVars.token3Leg = data.token;
                console.log('Returning new 3 legged token (User Authorization): ' + MyVars.token3Leg);
                callback(data.token, data.expires_in);
            },
            error: function() {
                console.log("Err in get3legtoken callback ajax");
            }
        });
    } else {
        console.log('else version of Returning saved 3 legged token (User Authorization): ' + MyVars.token3Leg);

        return MyVars.token3Leg;
    }
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

function downloadDerivative(urn, derUrn, fileName) {
    console.log("downloadDerivative for urn=" + urn + " and derUrn=" + derUrn);
    // fileName = file name you want to use for download
    var url = window.location.protocol + "//" + window.location.host +
        "/md/download?urn=" + urn +
        "&derUrn=" + derUrn +
        "&fileName=" + encodeURIComponent(fileName);

    window.open(url,'_blank');
}

function getThumbnail(urn) {
    console.log("downloadDerivative for urn=" + urn);
    // fileName = file name you want to use for download
    var url = window.location.protocol + "//" + window.location.host +
        "/dm/thumbnail?urn=" + urn;

    window.open(url,'_blank');
}

function isArraySame(arr1, arr2) {
    // If both are undefined or has no value
    if (!arr1 && !arr2)
        return true;

    // If just one of them has no value
    if (!arr1 || !arr2)
        return false;

    return (arr1.sort().join(',') === arr2.sort().join(','));
}

function getDerivativeUrns(derivative, format, getThumbnail, objectIds) {
    console.log(
        "getDerivativeUrns for derivative=" + derivative.outputType +
        " and objectIds=" + (objectIds ? objectIds.toString() : "none"));
    var res = [];
    for (var childId in derivative.children) {
        var child = derivative.children[childId];
        // using toLowerCase to handle inconsistency
        if (child.role === '3d' || child.role.toLowerCase() === format) {
            if (isArraySame(child.objectIds, objectIds)) {
                // Some formats like svf might have children
                if (child.children) {
                    for (var subChildId in child.children) {
                        var subChild = child.children[subChildId];

                        if (subChild.role === 'graphics') {
                            res.push(subChild.urn);
                            if (!getThumbnail)
                                return res;
                        } else if (getThumbnail && subChild.role === 'thumbnail') {
                            res.push(subChild.urn);
                            return res;
                        }
                    }
                } else {
                    res.push(child.urn);
                    return res;
                }
            }
        }
    }

    return null;
}

// OBJ: guid & objectIds are also needed
// SVF, STEP, STL, IGES:
// Posts the job then waits for the manifest and then download the file
// if it's created
function askForFileType(format, urn, guid, objectIds, rootFileName, fileExtType, onsuccess) {
    console.log("askForFileType " + format + " for urn=" + urn);
    var advancedOptions = {
        'stl' : {
            "format": "binary",
            "exportColor": true,
            "exportFileStructure": "single" // "multiple" does not work
        },
        'obj' : {
            "modelGuid": guid,
            "objectIds": objectIds
        }
    };

    $.ajax({
        url: '/md/export',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(
            {
                urn: urn,
                format: format,
                advanced: advancedOptions[format],
                rootFileName: rootFileName,
                fileExtType: fileExtType
            }
        )
    }).done(function (data) {
        console.log(data);

        if (data.result === 'success' // newly submitted data
            || data.result === 'created') { // already submitted data
            getManifest(urn, function (res) {
                onsuccess(res);
            });
        }
    }).fail(function(err) {
        showProgress("Could not start translation", "fail");
        console.log('/md/export call failed\n' + err.statusText);
    });
}

// We need this in order to get an OBJ file for the model
function getMetadata(urn, onsuccess) {
    console.log("getMetadata for urn=" + urn);
    $.ajax({
        url: '/md/metadatas/' + urn,
        type: 'GET'
    }).done(function (data) {
        console.log(data);

        // Get first model guid
        // If it does not exists then something is wrong
        // let's check the manifest
        // If get manifest sees a failed attempt then it will
        // delete the manifest
        var md0 = data.data.metadata[0];
        if (!md0) {
            getManifest(urn, function () {});
        } else {
            var guid = md0.guid;
            if (onsuccess !== undefined) {
                onsuccess(guid);
            }
        }
    }).fail(function(err) {
        console.log('GET /md/metadata call failed\n' + err.statusText);
    });
}

function getHierarchy(urn, guid, onsuccess) {
    console.log("getHierarchy for urn=" + urn + " and guid=" + guid);
    $.ajax({
        url: '/md/hierarchy',
        type: 'GET',
        data: {urn: urn, guid: guid}
    }).done(function (data) {
        console.log(data);

        // If it's 'accepted' then it's not ready yet
        if (data.result === 'accepted') {
            // Let's try again
            if (MyVars.keepTrying) {
                window.setTimeout(function() {
                        getHierarchy(urn, guid, onsuccess);
                    }, 500
                );
            } else {
                MyVars.keepTrying = true;
            }

            return;
        }

        // We got what we want
        if (onsuccess !== undefined) {
            onsuccess(data);
        }
    }).fail(function(err) {
        console.log('GET /md/hierarchy call failed\n' + err.statusText);
    });
}

function getProperties(urn, guid, onsuccess) {
    console.log("getProperties for urn=" + urn + " and guid=" + guid);
    $.ajax({
        url: '/md/properties',
        type: 'GET',
        data: {urn: urn, guid: guid}
    }).done(function (data) {
        console.log(data);

        if (onsuccess !== undefined) {
            onsuccess(data);
        }
    }).fail(function(err) {
        console.log('GET /api/properties call failed\n' + err.statusText);
    });
}

function getManifest(urn, onsuccess) {
    console.log("getManifest for urn=" + urn);
    $.ajax({
        url: '/md/manifests/' + urn,
        type: 'GET'
    }).done(function (data) {
        console.log(data);

        if (data.status !== 'failed') {
            if (data.progress !== 'complete') {
                showProgress("Translation progress: " + data.progress, data.status);

                if (MyVars.keepTrying) {
                    // Keep calling until it's done
                    window.setTimeout(function() {
                            getManifest(urn, onsuccess);
                        }, 500
                    );
                } else {
                    MyVars.keepTrying = true;
                }
            } else {
                showProgress("Translation completed", data.status);
                onsuccess(data);
            }
        // if it's a failed translation best thing is to delete it
        } else {
            showProgress("Translation failed", data.status);
            // Should we do automatic manifest deletion in case of a failed one?
            //delManifest(urn, function () {});
        }
    }).fail(function(err) {
        showProgress("Translation failed", 'failed');
        console.log('GET /api/manifest call failed\n' + err.statusText);
    });
}

function delManifest(urn, onsuccess) {
    console.log("delManifest for urn=" + urn);
    $.ajax({
        url: '/md/manifests/' + urn,
        type: 'DELETE'
    }).done(function (data) {
        console.log(data);
        if (data.status === 'success') {
            if (onsuccess !== undefined) {
                onsuccess(data);
            }
        }
    }).fail(function(err) {
        console.log('DELETE /api/manifest call failed\n' + err.statusText);
    });
}

/////////////////////////////////////////////////////////////////
// Formats / #forgeFormats
// Shows the export file formats available for the selected model
/////////////////////////////////////////////////////////////////

function getFormats(onsuccess) {
    console.log("getFormats");
    $.ajax({
        url: '/md/formats',
        type: 'GET'
    }).done(function (data) {
        console.log(data);

        if (onsuccess !== undefined) {
            onsuccess(data);
        }
    }).fail(function(err) {
        console.log('GET /md/formats call failed\n' + err.statusText);
    });
}

function fillFormats() {
    getFormats(function(data) {
        var forgeFormats = $("#forgeFormats");
        forgeFormats.data("forgeFormats", data);

        var download = $("#downloadExport");
        download.click(function() {
            MyVars.keepTrying = true;

            var elem = $("#forgeHierarchy");
            var tree = elem.jstree();
            var rootNodeId = tree.get_node('#').children[0];
            var rootNode = tree.get_node(rootNodeId);

            var format = $("#forgeFormats").val();
            var urn = MyVars.selectedUrn;
            var guid = MyVars.selectedGuid;
            var fileName = rootNode.text + "." + format;
            var rootFileName = MyVars.rootFileName;
            var nodeIds = elem.jstree("get_checked", null, true);

            // Only OBJ supports subcomponent selection
            // using objectId's
            var objectIds = null;
            if (format === 'obj') {
                objectIds = [-1];
                if (nodeIds.length) {
                    objectIds = [];

                    $.each(nodeIds, function (index, value) {
                        objectIds.push(parseInt(value, 10));
                    });
                }
            }

            // The rest can be exported with a single function
            askForFileType(format, urn, guid, objectIds, rootFileName, MyVars.fileExtType, function (res) {
                if (format === 'thumbnail') {
                    getThumbnail(urn);

                    return;
                }

                // Find the appropriate obj part
                for (var derId in res.derivatives) {
                    var der = res.derivatives[derId];
                    if (der.outputType === format) {
                        // found it, now get derivative urn
                        // leave objectIds parameter undefined
                        var derUrns = getDerivativeUrns(der, format, false, objectIds);

                        // url encode it
                        if (derUrns) {
                            derUrns[0] = encodeURIComponent(derUrns[0]);

                            downloadDerivative(urn, derUrns[0], fileName);
                        } else {
                            showProgress("Could not find specific OBJ file", "failed");
                            console.log("askForFileType, Did not find the OBJ translation with the correct list of objectIds");
                        }

                        return;
                    }
                }

                showProgress("Could not find exported file", "failed");
                console.log("askForFileType, Did not find " + format + " in the manifest");
            });

        });

        var deleteManifest = $("#deleteManifest");
        deleteManifest.click(function() {
            var urn = MyVars.selectedUrn;

            cleanupViewer();

            delManifest(urn, function() { });
        });
    });
}

function updateFormats(format) {

    var forgeFormats = $("#forgeFormats");
    var formats = forgeFormats.data("forgeFormats");
    forgeFormats.empty();

    // obj is not listed for all possible files
    // using this workaround for the time being
    //forgeFormats.append($("<option />").val('obj').text('obj'));

    $.each(formats.formats, function(key, value) {
        if (key === 'obj' || value.indexOf(format) > -1) {
            forgeFormats.append($("<option />").val(key).text(key));
        }
    });
}

/////////////////////////////////////////////////////////////////
// Files Tree / #forgeFiles
// Shows the A360 hubs, projects, folders and files of
// the logged in user
/////////////////////////////////////////////////////////////////

function prepareFilesTree() {
    console.log("prepareFilesTree");
    $('#forgeFiles').jstree({
        'core': {
            'themes': {"icons": true},
            'check_callback': true, // make it modifiable
            'data': {
                "url": '/dm/treeNode',
                "dataType": "json",
                "data": function (node) {
                    return {
                        "href": (node.id === '#' ? '#' : node.original.href)
                    };
                }
            }
        },
        'types': {
            'default': {
                'icon': 'glyphicon glyphicon-cloud'
            },
            '#': {
                'icon': 'glyphicon glyphicon-user'
            },
            'hubs': {
                'icon': 'glyphicon glyphicon-inbox'
            },
            'projects': {
                'icon': 'glyphicon glyphicon-list-alt'
            },
            'items': {
                'icon': 'glyphicon glyphicon-briefcase'
            },
            'folders': {
                'icon': 'glyphicon glyphicon-folder-open'
            },
            'versions': {
                'icon': 'glyphicon glyphicon-time'
            }
        },
        "plugins": ["types", "contextmenu"], // let's not use sort or state: , "state" and "sort"],
        'contextmenu': {
            'select_node': false,
            'items': filesTreeContextMenu
        }
    }).bind("select_node.jstree", function (evt, data) {
        // Clean up previous instance
        cleanupViewer();

        // Disable the hierarchy related controls for the time being
        $("#forgeFormats").attr('disabled', 'disabled');
        $("#downloadExport").attr('disabled', 'disabled');

        if (data.node.type === 'versions') {
            $("#deleteManifest").removeAttr('disabled');
            $("#uploadFile").removeAttr('disabled');

            MyVars.keepTrying = true;
            MyVars.selectedNode = data.node;

            // Clear hierarchy tree
            $('#forgeHierarchy').empty().jstree('destroy');

            // Clear properties tree
            $('#forgeProperties').empty().jstree('destroy');

            // Delete cached data
            $('#forgeProperties').data('forgeProperties', null);

            updateFormats(data.node.original.fileType);

            // Store info on selected file
            MyVars.rootFileName = data.node.original.rootFileName;
            MyVars.fileName = data.node.original.fileName;
            MyVars.fileExtType = data.node.original.fileExtType;

            if ($('#wipVsStorage').hasClass('active')) {
                console.log("Using WIP id");
                MyVars.selectedUrn = base64encode(data.node.original.wipid);
            } else {
                console.log("Using Storage id");
                MyVars.selectedUrn = base64encode(data.node.original.storage);
            }

            // Fill hierarchy tree
            // format, urn, guid, objectIds, rootFileName, fileExtType
            showHierarchy(
                MyVars.selectedUrn,
                null,
                null,
                MyVars.rootFileName,
                MyVars.fileExtType
            );
            console.log(
                "data.node.original.storage = " + data.node.original.storage,
                "data.node.original.wipid = " + data.node.original.wipid,
                ", data.node.original.fileName = " + data.node.original.fileName,
                ", data.node.original.fileExtType = " + data.node.original.fileExtType
            );

            // Show in viewer
            //initializeViewer(data.node.data);
        } else {
            $("#deleteManifest").attr('disabled', 'disabled');
            $("#uploadFile").attr('disabled', 'disabled');

            // Just open the children of the node, so that it's easier
            // to find the actual versions
            $("#forgeFiles").jstree("open_node", data.node);

            // And clear trees to avoid confusion thinking that the
            // data belongs to the clicked model
            $('#forgeHierarchy').empty().jstree('destroy');
            $('#forgeProperties').empty().jstree('destroy');
        }
    });
}

function downloadAttachment(href, attachmentVersionId) {
    console.log("downloadAttachment for href=" + href);
    // fileName = file name you want to use for download
    var url = window.location.protocol + "//" + window.location.host +
        "/dm/attachments/" + encodeURIComponent(attachmentVersionId) + "?href=" + encodeURIComponent(href);

    window.open(url,'_blank');
}

function deleteAttachment(href, attachmentVersionId) {
    alert("Functionality not available yet");
    return;

    console.log("deleteAttachment for href=" + href);
    $.ajax({
        url: '/dm/attachments/' + encodeURIComponent(attachmentVersionId),
        headers: { 'wip-href': href },
        type: 'DELETE'
    }).done(function (data) {
        console.log(data);
        if (data.status === 'success') {
            if (onsuccess !== undefined) {
                onsuccess(data);
            }
        }
    }).fail(function(err) {
        console.log('DELETE /api/manifest call failed\n' + err.statusText);
    });
}

function filesTreeContextMenu(node, callback) {
    if (node.type === 'versions') {
        $.ajax({
            url: '/dm/attachments',
            data: {href: node.original.href},
            type: 'GET',
            success: function (data) {
                var menuItems = null;
                data.data.forEach(function (item) {
                    if (item.meta.extension.type === "auxiliary:autodesk.core:Attachment") {
                        var menuItem = {
                            "label": item.displayName,
                            "action": function (obj) {
                                alert(obj.item.label + " with versionId = " + obj.item.versionId);
                            },
                            "versionId": item.id,
                            "submenu" : {
                                "open": {
                                    "label": "Open",
                                    "action": function (obj) {
                                        downloadAttachment(obj.item.href, obj.item.versionId);
                                    },
                                    "versionId": item.id,
                                    "href": node.original.href
                                },
                                "delete": {
                                    "label": "Delete",
                                    "action": function (obj) {
                                        deleteAttachment(obj.item.href, obj.item.versionId);
                                    },
                                    "versionId": item.id,
                                    "href": node.original.href
                                }
                            }
                        };

                        menuItems = menuItems || {};
                        menuItems[item.id] = menuItem;
                    }
                })

                if (!menuItems) {
                    callback({noItem: {label: "No attachments", action: function () {}}});
                } else {
                    callback(menuItems);
                }
            }
        });
    }

    return;
}

/////////////////////////////////////////////////////////////////
// Hierarchy Tree / #forgeHierarchy
// Shows the hierarchy of components in selected model
/////////////////////////////////////////////////////////////////

function showHierarchy(urn, guid, objectIds, rootFileName, fileExtType) {

    // You need to
    // 1) Post a job
    // 2) Get matadata (find the model guid you need)
    // 3) Get the hierarchy based on the urn and model guid

    // Get svf export in order to get hierarchy and properties
    // for the model
    var format = 'svf';
    var files = [rootFileName];
    askForFileType(format, urn, guid, objectIds, rootFileName, fileExtType, function (manifest) {
        getMetadata(urn, function (guid) {
            showProgress("Retrieving hierarchy...", "inprogress");

            getHierarchy(urn, guid, function (data) {
                showProgress("Retrieved hierarchy", "success");

                for (var derId in manifest.derivatives) {
                    var der = manifest.derivatives[derId];
                    // We just have to make sure there is an svf
                    // translation, but the viewer will find it
                    // from the urn
                    if (der.outputType === 'svf') {

                        initializeViewer(urn);
                    }
                }

                prepareHierarchyTree(urn, guid, data.data);
            });
        });
    });
}

function addHierarchy(nodes) {
    for (var nodeId in nodes) {
        var node = nodes[nodeId];

        // We are also adding properties below that
        // this function might iterate over and we should skip
        // those nodes
        if (node.type && node.type === 'property' || node.type === 'properties') {
            // skip this node
            var str = "";
        } else {
            node.text = node.name;
            node.children = node.objects;
            if (node.objectid === undefined) {
                node.type = 'dunno'
            } else {
                node.id = node.objectid;
                node.type = 'object'
            }
            addHierarchy(node.objects);
        }
    }
}

function prepareHierarchyTree(urn, guid, json) {
    // Convert data to expected format
    addHierarchy(json.objects);

    // Enable the hierarchy related controls
    $("#forgeFormats").removeAttr('disabled');
    $("#downloadExport").removeAttr('disabled');

    // Store info of selected item
    MyVars.selectedUrn = urn;
    MyVars.selectedGuid = guid;

    // init the tree
    $('#forgeHierarchy').jstree({
        'core': {
            'check_callback': true,
            'themes': {"icons": true},
            'data': json.objects
        },
        'checkbox' : {
            'tie_selection': false,
            "three_state": true,
            'whole_node': false
        },
        'types': {
            'default': {
                'icon': 'glyphicon glyphicon-cloud'
            },
            'object': {
                'icon': 'glyphicon glyphicon-save-file'
            }
        },
        "plugins": ["types", "sort", "checkbox", "ui", "themes", "contextmenu"],
        'contextmenu': {
            'select_node': false,
            'items': hierarchyTreeContextMenu
        }
    }).bind("select_node.jstree", function (evt, data) {
        if (data.node.type === 'object') {
            var urn = MyVars.selectedUrn;
            var guid = MyVars.selectedGuid;
            var objectId = data.node.original.objectid;

            // Empty the property tree
            $('#forgeProperties').empty().jstree('destroy');

            fetchProperties(urn, guid, function (props) {
                preparePropertyTree(urn, guid, objectId, props);
                selectInViewer([objectId]);
            });
        }
    }).bind("check_node.jstree uncheck_node.jstree", function (evt, data) {
        // To avoid recursion we are checking if the changes are
        // caused by a viewer selection which is calling
        // selectInHierarchyTree()
        if (!MyVars.selectingInHierarchyTree) {
            var elem = $('#forgeHierarchy');
            var nodeIds = elem.jstree("get_checked", null, true);

            // Convert from strings to numbers
            var objectIds = [];
            $.each(nodeIds, function (index, value) {
                objectIds.push(parseInt(value, 10));
            });

            selectInViewer(objectIds);
        }
    });
}

function selectInHierarchyTree(objectIds) {
    MyVars.selectingInHierarchyTree = true;

    var tree = $("#forgeHierarchy").jstree();

    // First remove all the selection
    tree.uncheck_all();

    // Now select the newly selected items
    for (var key in objectIds) {
        var id = objectIds[key];

        // Select the node
        tree.check_node(id);

        // Make sure that it is visible for the user
        tree._open_to(id);
    }

    MyVars.selectingInHierarchyTree = false;
}

function hierarchyTreeContextMenu(node, callback) {
    var menuItems = {};

    var menuItem = {
        "label": "Select in Fusion",
        "action": function (obj) {
            var path = $("#forgeHierarchy").jstree().get_path(node,'/');
            alert(path);

            // Open this in the browser:
            // fusion360://command=open&file=something&properties=MyCustomPropertyValues
            var url = "fusion360://command=open&file=something&properties=" + encodeURIComponent(path);
            $("#fusionLoader").attr("src", url);
        }
    };
    menuItems[0] = menuItem;

    //callback(menuItems);

    //return menuItems;
    return null; // for the time being
}

/////////////////////////////////////////////////////////////////
// Property Tree / #forgeProperties
// Shows the properties of the selected sub-component
/////////////////////////////////////////////////////////////////

// Storing the collected properties since you get them for the whole
// model. So when clicking on the various sub-components in the
// hierarchy tree we can reuse it instead of sending out another
// http request
function fetchProperties(urn, guid, onsuccess) {
    var props = $("#forgeProperties").data("forgeProperties");
    if (!props) {
        getProperties(urn, guid, function(data) {
            $("#forgeProperties").data("forgeProperties", data.data);
            onsuccess(data.data);
        })
    } else {
        onsuccess(props);
    }
}

// Recursively add all the additional properties under each
// property node
function addSubProperties(node, props) {
    node.children = node.children || [];
    for (var subPropId in props) {
        var subProp = props[subPropId];
        if (subProp instanceof Object) {
            var length = node.children.push({
                "text": subPropId,
                "type": "properties"
            });
            var newNode = node.children[length-1];
            addSubProperties(newNode, subProp);
        } else {
            node.children.push({
                "text": subPropId + " = " + subProp.toString(),
                "type": "property"
            });
        }
    }
}

// Add all the properties of the selected sub-component
function addProperties(node, props) {
    // Find the relevant property section
    for (var propId in props) {
        var prop = props[propId];
        if (prop.objectid === node.objectid) {
            addSubProperties(node, prop.properties);
        }
    }
}

function preparePropertyTree(urn, guid, objectId, props) {
    // Convert data to expected format
    var data = { 'objectid' : objectId };
    addProperties(data, props.collection);

    // init the tree
    $('#forgeProperties').jstree({
        'core': {
            'check_callback': true,
            'themes': {"icons": true},
            'data': data.children
        },
        'types': {
            'default': {
                'icon': 'glyphicon glyphicon-cloud'
            },
            'property': {
                'icon': 'glyphicon glyphicon-tag'
            },
            'properties': {
                'icon': 'glyphicon glyphicon-folder-open'
            }
        },
        "plugins": ["types", "sort"]
    }).bind("activate_node.jstree", function (evt, data) {
       //
    });
}

/////////////////////////////////////////////////////////////////
// Viewer
// Based on Autodesk Viewer basic sample
// https://developer.autodesk.com/api/viewerapi/
/////////////////////////////////////////////////////////////////

function cleanupViewer() {
    // Clean up previous instance
    if (MyVars.viewer && MyVars.viewer.model) {
        console.log("Unloading current model from Autodesk Viewer");

        MyVars.viewer.impl.unloadModel(MyVars.viewer.model);
        MyVars.viewer.impl.sceneUpdated(true);
    }
}

function initializeViewer(urn) {
    cleanupViewer();

    console.log("Launching Autodesk Viewer for: " + urn);
    //Hide the about html after the user selects which of there files they would like to view
    $('#aboutDiv').hide();
    $('#3dViewDiv').show();


    _isThreeLegged = true;

    var options = {
        'document': 'urn:' + urn,
        'env': 'AutodeskProduction',
        //extensions: ['Autodesk.Viewing.WebVR'],
        //experimental: ['webVR_orbitModel'],
        'getAccessToken': get3LegToken // this works fine, but if I pass get3LegToken it only works the first time
    };

    _socket.emit('lmv-command', { session: _sessionId, name: 'load', value: options });

    if (MyVars.viewer) {
        loadDocument(MyVars.viewer, options.document);
    } else {
        //call 3dViewDiv instaed of forgeViewer
        var viewerElement = document.getElementById('3dViewDiv');
        MyVars.viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {});
        
        //temporary fix for viewing.
        Autodesk.Viewing.Private.token.tokenRefreshInterval = 0;
        //reset the size of the div for the viewer.
        resetSize(MyVars.viewer.container);
        Autodesk.Viewing.Initializer(
            options,
            function () {
                MyVars.viewer.start(); // this would be needed if we also want to load extensions
                loadDocument(MyVars.viewer, options.document);
                addSelectionListener(MyVars.viewer);
            }
        );

    }
}

function addSelectionListener(viewer) {
    viewer.addEventListener(
        Autodesk.Viewing.SELECTION_CHANGED_EVENT,
        function (event) {
            selectInHierarchyTree(event.dbIdArray);

            var dbId = event.dbIdArray[0];
            if (dbId) {
                viewer.getProperties(dbId, function (props) {
                   console.log(props.externalId);
                });
            }
        });
}

function loadDocument(viewer, documentId) {
    //Autodesk.Viewing.HTTP_REQUEST_HEADERS['x-ads-acm-namespace'] = 'WIPDM';
    //Autodesk.Viewing.HTTP_REQUEST_HEADERS['x-ads-acm-check-groups'] = 'true';

    Autodesk.Viewing.Document.load(
        documentId,
        // onLoad
        function (doc) {
            var geometryItems = [];
            // Try 3d geometry first
            geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
                'type': 'geometry',
                'role': '3d'
            }, true);

            // If no 3d then try 2d
            if (geometryItems.length < 1)
                geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
                    'type': 'geometry',
                    'role': '2d'
                }, true);

            if (geometryItems.length > 0) {
                var path = doc.getViewablePath(geometryItems[0]);
                //viewer.load(doc.getViewablePath(geometryItems[0]), null, null, null, doc.acmSessionId /*session for DM*/);
                var options = {};
                viewer.loadModel(path, options);
            }
        },
        // onError
        function (errorMsg) {
            //showThumbnail(documentId.substr(4, documentId.length - 1));
        }
    )
}

function selectInViewer(objectIds) {
    if (MyVars.viewer) {
        MyVars.viewer.select(objectIds);
    }
}

/////////////////////////////////////////////////////////////////
// Other functions
/////////////////////////////////////////////////////////////////

function showProgress(text, status) {
    var progressInfo = $('#progressInfo');
    var progressInfoText = $('#progressInfoText');
    var progressInfoIcon = $('#progressInfoIcon');

    var oldClasses = progressInfo.attr('class');
    var newClasses = "";
    var newText = text;

    if (status === 'failed') {
        newClasses = 'btn btn-danger';
    } else if (status === 'inprogress' || status === 'pending') {
        newClasses = 'btn btn-warning';
        newText += " (Click to stop)";
    } else if (status === 'success') {
        newClasses = 'btn btn-success';
    } else {
        newClasses = 'btn btn-info';
    }

    // Only update if changed
    if (progressInfoText.text() !== newText) {
        progressInfoText.text(newText);
    }

    if (oldClasses !== newClasses) {
        progressInfo.attr('class', newClasses);

        if (newClasses === 'btn btn-warning') {
            progressInfoIcon.attr('class', 'glyphicon glyphicon-refresh glyphicon-spin');
        } else {
            progressInfoIcon.attr('class', '');
        }
    }
}

function getThreeLeggedScopedOptions(){
    
    return _selectedOption;   
}