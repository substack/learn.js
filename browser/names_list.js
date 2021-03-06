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
    var myId = null;
    
    remote.subscribe(emit, function (id) {
        myId = id;
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
        var nameSpan = $('<span>')
            .addClass('name')
            .text(users[id].name || '...')
        ;
        
        var pointSpan = $('<span>')
            .addClass('points')
            .text((users[id].points || 0).toString())
        ;
        
        var elem = elems[id] = $('<div>')
            .addClass('desk')
            .append(nameSpan)
            .append('[', pointSpan, ']')
            .fadeIn(400)
            .appendTo($('#classroom'))
            .css({
                'margin-left' : pos.left,
                'margin-top' : pos.top
            })
        ;
        if (map.is(':hidden')) elem.hide();
        
        if (id === myId) {
            var down = false;
            var prev = null;
            elem
                .css('cursor', 'pointer')
                .mousedown(function (ev) {
                    down = true;
                    prev = { x : ev.pageX, y : ev.pageY };
                })
                .mouseup(function () {
                    remote.myPosIs(pos);
                    down = false;
                })
                .mousemove(function (ev) {
                    if (down) {
                        pos.left += ev.pageX - prev.x;
                        pos.top += ev.pageY - prev.y;
                        elem.css({
                            'margin-left' : pos.left,
                            'margin-top' : pos.top
                        });
                        prev = { x : ev.pageX, y : ev.pageY };
                    }
                })
            ;
            map.mousemove(function (ev) {
                if (down) {
                    pos.left += ev.pageX - prev.x;
                    pos.top += ev.pageY - prev.y;
                    elem.css({
                        'margin-left' : pos.left,
                        'margin-top' : pos.top
                    });
                    prev = { x : ev.pageX, y : ev.pageY };
                }
            });
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
                elems[id].find('.name').text(name || '')
            }
        }
    });
    
    em.on('points', function (id, points) {
        if (users[id]) {
            users[id].points = points;
            if (elems[id]) {
                elems[id].find('.points').text((points || 0).toString())
            }
            if (id === myId) {
                $('#points').text(points.toString());
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
