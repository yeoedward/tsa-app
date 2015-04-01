/* FIXME: make sure this matches to the correct server location */
var API_URL = "http://localhost:8001/api";

/*
 * ==============================================
 * Facebok API
 * ==============================================
 */
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


// Call back function for FB login
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

/*
 * ==============================================
 * TSA App API
 * ==============================================
 */
// POST /api/login
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

// POST /api/logout
function apiLogin() {
  $.ajax({
      method: "POST",
      url: API_URL + "/logout",
      data: { },
      success: function (result) {
        if (result.success) {
          console.log(result);
          loggedOutSucceed();
        } else {
          console.log(result.message);
        }
      }
  });
}


// GET /api/my_buddy
function apiMyBuddy() {
  $.ajax({
      method: "GET",
      url: API_URL + "/my_buddy",
      data: { },
      success: function (result) {
        if (result.success) {
          console.log(result);
          updateMyBuddy(result['data']);
        } else {
          console.log(result.message);
        }
      }
  });
}

// GET /api/buddies
function apiBuddies() {
  $.ajax({
      method: "GET",
      url: API_URL + "/buddies",
      data: { },
      success: function (result) {
        if (result.success) {
          console.log(result);
          updateBuddies(result['data']);
        } else {
          console.log(result.message);
        }
      }
  });
}

// GET /api/completed
function apiCompleted(){
  $.ajax({
      method: "GET",
      url: API_URL + "/completed",
      data: { },
      success: function (result) {
        if (result.success) {
          console.log(result);
          updateCompleted(result['data']);
        } else {
          console.log(result.message);
        }
      }
  });
}

// GET /api/tasks
function apiTasks(){
  $.ajax({
      method: "GET",
      url: API_URL + "/tasks",
      data: { },
      success: function (result) {
        if (result.success) {
          console.log(result);
          updateTasks(result['data']);
        } else {
          console.log(result.message);
        }
      }
  });
}

// POST /api/checkin
function apiCheckin(taskNum){
  $.ajax({
      method: "POST",
      url: API_URL + "/checkin",
      data: { },
      success: function (result) {
        if (result.success) {
          console.log(result);
          // TODO: redirect to history tab
          window.location.href = "/#history";
        } else {
          console.log(result.message);
        }
      }
  });
}


/*
 * ==============================================
 * API Event Callbacks
 * ==============================================
 */
function loggedInSucceed() {
  var time_interval = 500;
  $('#tsa-welcome').fadeOut(time_interval);
  $('#tsa-content').delay(time_interval).fadeIn();
}

function loggedOutSucceed() {
  // refresh current page (will direct to login page)
  location.reload();
}

function updateMyBuddy(data) {
  // TODO: update my buddy, should have:
  // - name
  // - FB url
  // - profile image
}

function updateBuddies(data) {
  // TODO: put the recieved data into the table, should have following in each row:
  // - # rank
  // - buddy 1 (name, facebook url, profile image url)
  // - buddy 2 (name, facebook url, profile image url)
  // - # tasks
}

function updateCompleted(data) {
  // 2 tables will be updated using input data
  // TODO: put data into 2 tables, shoud have following in each completed task:
  // - task name
  // - time
  // - status (string or defined enum number)
}

function updateTasks(data) {
  // TODO: get a list of tasks and update it into the download option list, for each task:
  // - the name of the task
  // - index of the task
}

/*
 * ==============================================
 * GUI Event Callbacks
 * ==============================================
 */
// Event handler for login button
function fbLogin() {

  FB.login(function(response) {
    if (response.authResponse) {
      location.reload();
    } else {
      alarm("WHY? Just Login!");
    }
  });

}

/*
 * ==============================================
 * Main Function
 * ==============================================
 */
$( document ).ready(function() {
  /*
  apiMyBuddy();
  apiBuddies()
  apiCompleted();
  apiTasks()
  */

  // add apiCheckin to button listener
});
