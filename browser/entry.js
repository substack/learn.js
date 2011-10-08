var $ = require('jquery-browserify');
var dnode = require('dnode');
var cookie = require('cookie-cutter');

$(window).resize(function () {
    var h = $(window).height() - $('#header').height();
    $('#content').height(h).show();
    $('#header').width($(window).width() - 5).show();
});

var handler = require('./handler');
$(window).load(function () {
    if (cookie.get('name')) {
        $('#name').val(cookie.get('name'));
    }
    else {
        var s = (Math.random() * Math.pow(2,32)).toString(16);
        $('#name').val(s).trigger('change');
    }
    
    dnode.connect(handler);
    $(window).trigger('resize');
    
    var toggleMap = (function () {
        var map = $('#classroom .map');
        var button = $('#classroom .button');
        return function () {
            if (map.is(':visible')) {
                button.removeClass('active')
                map.fadeOut(200);
                $('.desk').fadeOut(200);
            }
            else {
                button.addClass('active')
                map.fadeIn(200);
                $('.desk').fadeIn(200);
            }
        };
    })();
    
    $('#classroom .button').click(toggleMap);
    $('#classroom .close').click(toggleMap);
    
    var toggleRepl = (function () {
        var repl = $('#top-repl .repl-container');
        var button = $('#top-repl .button');
        return function () {
            if (repl.is(':visible')) {
                button.removeClass('active')
                repl.fadeOut(200);
            }
            else {
                button.addClass('active')
                repl.fadeIn(200);
            }
        };
    })();
    
    $('#top-repl .button').click(toggleRepl);
    $('#top-repl .close').click(toggleRepl);
});
