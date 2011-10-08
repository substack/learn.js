var units = [];

units.push({
    title : 'what programming is',
    filename : 'what.html',
    script : 'what.js'
});

units.push({
    title : 'javascript the calculator',
    filename : 'calculator.html',
    challenge : require('./calculator.js')
});

units.push({
    title : 'types',
    filename : 'types.html'
});

units.push({
    title : 'objects'
});

units.push({
    title : 'arrays'
});

units.push({
    title : 'conditionals'
});

units.push({
    title : 'loops'
});

units.push({
    title : 'functions'
});

units.push({
    title : 'higher order functions'
});

var fs = require('fs');
module.exports = units.map(function (unit) {
    if (!unit.body && unit.filename) {
        unit.body = fs.readFileSync(__dirname + '/' + unit.filename, 'utf8');
    }
    
    if (unit.script) {
        unit.scriptBody = fs.readFileSync(
            __dirname + '/' + unit.script, 'utf8'
        );
    }
    return unit;
});
