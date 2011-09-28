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
                $('#classroom .map').fadeOut(200);
            }
            else {
                button.addClass('active')
                $('#classroom .map').fadeIn(200);
            }
        };
    })();
    
    $('#classroom .button').click(toggleMap);
    $('#classroom .close').click(toggleMap);
});
