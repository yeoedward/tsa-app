// Load config
var config = require('../config/config');

// NPM Imports
var bodyParser = require('body-parser');
var express = require('express');
var http = require ('http');

// Imports from within this project
var auth = require('./auth')(config.appID, config.appSecret, config.dbConnect);

var app = express();
app.use (bodyParser());

// FIXME: this is for allowing our testing client (localhost:8001) to access server
// with out having cross-site error. Make sure it configs correctly when deployed.
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8000");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

app.post('/api/login', auth.login.bind(auth));

var httpServer = http.createServer(app);
httpServer.listen(config.apiPort);
console.info('Server running...');
