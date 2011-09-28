var $ = require('jquery-browserify');
var EventEmitter = require('events').EventEmitter;
var json = typeof JSON === 'object' ? JSON : require('jsonify');
var cookie = require('cookie-cutter');

module.exports = function (remote, conn) {
    var map = $('#classroom .map');
    var users = {};
    var elems = {};
    var em = new EventEmitter;
    var emit = function () { em.emit.apply(em, arguments) };
    
    remote.subscribe(emit, function () {
        var cpos = cookie.get('pos');
        var pos = cpos && json.parse(cpos) || {
            top : Math.floor(Math.random() * (map.height() - 10)),
            left : Math.floor(Math.random() * (map.width() - 50))
        };
        cookie.set('pos', json.stringify(pos));
        remote.myPosIs(pos);
    });
    
    function addElem (id) {
        var pos = users[id].position;
        var elem = elems[id] = $('<div>')
            .addClass('desk')
            .text(users[id].name || '...')
            .fadeIn(400)
            .appendTo($('#classroom'))
            .css({
                'margin-left' : pos.left,
                'margin-top' : pos.top
            })
        ;
        if (id === conn.id) {
        }
    }
    
    em.on('pos', function (id, pos) {
        if (users[id]) {
            users[id].position = pos;
            if (!elems[id]) addElem(id)
            else elems[id].css({
                'margin-left' : pos.left,
                'margin-top' : pos.top
            });
        }
    });
    
    em.on('name', function (id, name) {
        if (users[id]) {
            users[id].name = name;
            if (elems[id]) {
                elems[id].text(name)
            }
        }
    });
    
    em.on('connect', function (id) {
        users[id] = {};
    });
    
    em.on('disconnect', function (id) {
        if (elems[id]) {
            elems[id].fadeOut(400, function () {
                $(this).remove();
            });
        }
        delete elems[id];
        delete users[id];
    });
    
    remote.users(function (users_) {
        for (var id in users_) {
            users[id] = users_[id];
            if (users[id].position) {
                addElem(id);
            }
        }
    });
    
    return users;
};
