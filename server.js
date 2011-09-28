#!/usr/bin/env node
var argv = require('optimist')
    .demand(1)
    .usage('Usage: $0 [lesson]')
    .argv
;
var path = require('path');
var units = require(path.resolve(process.cwd(), argv._[0]));

var express = require('express');
var app = express.createServer();
app.use(express.static(__dirname + '/static'));

app.use(require('browserify')({
    entry : __dirname + '/browser/entry.js',
    watch : true,
}));

var dnode = require('dnode');
dnode(require('./lib/service')(units)).listen(app);

var port = argv.port || 8000;
app.listen(port);
console.log('Listening on :' + port);
