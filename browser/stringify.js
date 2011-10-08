var traverse = require('traverse');

module.exports = function (obj) {
    var s = '';
    traverse(obj).forEach(function to_s (node) {
        if (this.circular) {
            s += '[Circular]';
        }
        else if (this.level > 5) {
            s += '...';
        }
        else if (Array.isArray(node)) {
            this.before(function () { s += '[ ' });
            this.post(function (child) {
                if (!child.isLast) s += ', ';
            });
            this.after(function () { s += ' ]' });
        }
        else if (typeof node == 'object') {
            this.before(function () { s += '{ ' });
            this.pre(function (x, key) {
                to_s(key);
                s += ' : ';
            });
            this.post(function (child) {
                if (!child.isLast) s += ', ';
            });
            this.after(function () { s += ' }' });
        }
        else if (typeof node == 'string') {
            s += '"' + node.toString().replace(/"/g, '\\"') + '"';
        }
        else if (typeof node == 'function') {
            s += 'null';
        }
        else {
            s += node.toString();
        }
    });
    return s;
};
