/* FIXME: make sure this matches to the correct server location */
var API_URL = "http://localhost:8001/api";

window.fbAsyncInit = function() {
  FB.init({
      appId      : '841727872531922',
      xfbml      : true,
      version    : 'v2.2'
  });

  // Now that we've initialized the JavaScript SDK, we call
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    connectedCallback();
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into this app.';
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into Facebook.';
  }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

function connectedCallback() {
  var accessToken = FB.getAuthResponse()['accessToken'];
  FB.api('/me', function(response) {
    var username = response.name;
    console.log(response);
    console.log('Successful login for: ' + response.name);
    document.getElementById('status').innerHTML =
      'Thanks for logging in, ' + response.name + '!';

    apiLogin(accessToken, response.id);

  });
}

function apiLogin(accessToken, userID) {
  $.ajax({
      method: "POST",
      url: API_URL + "/login",
      data: { accessToken: accessToken, userID: userID },
      success: function (result) {
        if (result.success) {
          console.log(result);
          loggedInSucceed();
        } else {
          console.log(result.message);
        }
      }
  });
}

function loggedInSucceed() {
  var time_interval = 500;
  $('#tsa-welcome').fadeOut(time_interval);
  $('#tsa-content').delay(time_interval).fadeIn();
}
