#!/usr/bin/env node
var argv = require('optimist')
    .demand(1)
    .usage('Usage: $0 [lesson]')
    .argv
;
var path = require('path');
var fs = require('fs');

var unitPath = path.resolve(process.cwd(), argv._[0]);
var units = require(unitPath).map(function (unit) {
    if (!unit.body && unit.filename) {
        var file = path.resolve(unitPath, unit.filename);
        unit.body = fs.readFileSync(file, 'utf8');
    }
    
    if (unit.script) {
        var script = path.resolve(unitPath, unit.script);
        unit.scriptBody = fs.readFileSync(script, 'utf8');
    }
    return unit;
});

var express = require('express');
var app = express.createServer();
app.use(express.static(__dirname + '/static'));

var dnode = require('dnode');
dnode(require('./lib/service')(units)).listen(app);

var port = argv.port || 8000;
app.listen(port);
console.log('Listening on :' + port);
