exports = module.exports = function(appId, appSecret, dbConnect) {
  return new Auth(appId, appSecret, dbConnect);
};

// Imports
var pg = require('pg');
var request = require('request');

function Auth(appID, appSecret, dbConnect) {
  this.appID = appID;
  this.appSecret = appSecret;
  this.appToken = appID + '|' + appSecret;
  this.dbConnect = dbConnect;
}

Auth.prototype.addUser = function(userid, callback) {
/*
  pg.connect(this.dbConnect, function(err, client, done) {
    var queryCfg = {
      text: 'INSERT INTO wingmen VALUES ($1)',
      values: [userid]
    };

    if (err) {
      done();
      callback(err);
      console.error(err);
      return;
    }

    client.query(queryCfg, function(err, result) {
      done();
      if (!err) {
        callback(null);
      } else {
        switch(err.code) {
        case '23505':
          // user logged in before
          callback(null);
          break;
        default:
          callback(err);
          break;
        }
      }

    });
  });
  */
  callback(null);
};

Auth.prototype.login = function (req, res) {
  var userID = req.body.userID;
  var token = req.body.accessToken;

  var reqString = 'https://graph.facebook.com/'
    + 'debug_token?'
    + 'input_token=' + token + '&'
    + 'access_token=' + this.appToken;

  var _this = this;
  request({url: reqString, json: true}, function(err, fbRes, body){
    if (!err && body.data !== undefined) {
      var data = body.data;

      if(data.is_valid && data.user_id === userID
          && data.app_id === _this.appID) {
        //successfully validated

        _this.addUser(userID, function(err) {
          if (err) {
            res.send(500);
            console.error(err);
            return;
          }

          /*
          req.session.userID = userID;
          req.session.accessToken = token;
          */
          var resObj = {
            success: true
          };
          res.json(resObj);
          return;
        });

        return;
      }

      //invalid credentials
      var resObj = {
        success: false,
        errno: 1
      };
      console.log("Invalid credentials");
      res.json(resObj);
      return;
    }

    //unable to authenticate with facebook
    var resObj = {
      success: false,
      errno: 2
    };
    res.json(resObj);
  });
};