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
app.post('/api/login', auth.login.bind(auth));

var httpServer = http.createServer(app);
httpServer.listen(config.apiPort);
console.info('Server running...');
