// Load config.
var config = require('../config/config');

// NPM Imports.
var bodyParser = require('body-parser');
var express = require('express');
var http = require('http');
var path = require('path');

// Imports from within this project.
var auth = require('./auth')(config.appID, config.appSecret, config.dbConnect);

var app = express();
app.use(bodyParser());

app.post('/api/login', auth.login.bind(auth));

// Serve static files.
app.use(express.static(path.resolve('client')));

// All other routes go to index.html (so that we can use client side routing if
// we want).
app.use(function(req, res) {
  res.sendFile(path.resolve('client/index.html'));
});

var httpServer = http.createServer(app);
httpServer.listen(config.port);
console.info('Server running...');
