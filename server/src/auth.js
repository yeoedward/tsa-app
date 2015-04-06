exports = module.exports = function(appId, appSecret, dbConnect) {
  return new Auth(appId, appSecret, dbConnect);
};

var Q = require('q');
var pg = require('pg-promise')({
    promiseLib: Q
});
var request = require('request-promise');

const EFBCONN = 1;
const EINVALID = 2;
const EPGPROB = 3;

function Auth(appID, appSecret, dbConnect) {
  this.appID = appID;
  this.appSecret = appSecret;
  this.appToken = appID + '|' + appSecret;
  this.db = pg(dbConnect);
}

Auth.prototype.addUser = function (userData, callback) {
  var deferred = Q.defer(); 
  this.db.none('INSERT INTO users (user_id, token, first_name, last_name, '
              + 'gender) VALUES ($1, $2, $3, $4, $5)',
              [userData.id,
              userData.token,
              userData.first_name,
              userData.last_name,
              userData.gender])
    .then(function() {    
      var firstLogin = true;
      deferred.resolve(firstLogin);  
    })
    .catch(function(err) {
      if (err.code === '23505') {
        // Error code for tuple already existing in db.
        var firstLogin = false;
        deferred.resolve(firstLogin);
        return;
      }

      deferred.reject({
        message: err.message,
        errno: EPGPROB
      });
    });
  return deferred.promise.nodeify(callback);
};

Auth.prototype.login = function (req, res) {
  var userID = req.body.id;
  var token = req.body.token;

  //TODO Need to sanitize?
  var reqString = 'https://graph.facebook.com/'
    + 'debug_token?'
    + 'input_token=' + token + '&'
    + 'access_token=' + this.appToken;

  var _this = this;
  request({url: reqString, json: true})
    .then(function(body) {
      if(body.data.is_valid
          && body.data.user_id === userID
          && body.data.app_id === _this.appID) {
        // Successfully validated
        return _this.addUser(req.body);
      }

      var err = new Error("Invalid credentials");
      err.errno = EINVALID;
      throw err;
    })
    .then(function(firstLogin) {
      /*
      req.session.userID = userID;
      req.session.accessToken = token;
      */
      res.json({
        firstLogin: firstLogin,
        success: true
      });
    })
    .catch(function(err) {
      if (err.errno === EPGPROB) {
        console.error("Postgres error: ", err);
        res.sendStatus(500);
        return;
      }

      if (err.errno === undefined) {
        // Request library doesn't set errno.
        err.errno = EFBCONN;
      }

      res.json({
        success: false,
        err: err.errno
      });
    });
};
