// Load config
var config = require('../config/config');
var cookieSecret = config.cookieSecret;
var appID = config.appID;
var appSecret = config.appSecret;
var dbConnect = config.dbConnect;

// NPM Imports
var bodyParser = require('body-parser');
var express = require('express');
var http = require ('http');

// Imports from within this project
var auth = require('./auth')(appID, appSecret, dbConnect);

var app = express();
app.use (bodyParser());
app.get('/api/login', auth.login.bind(auth));

var httpServer = http.createServer(app);
httpServer.listen(8000);
console.info('Server running...');
