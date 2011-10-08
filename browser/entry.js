var $ = require('jquery-browserify');
var vm = require('vm');
var dnode = require('dnode');
var cookie = require('cookie-cutter');

var stringify = require('./stringify');

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
        var map = $('#classroom .container');
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
    
    [ '#top-repl', '#top-script' ].forEach(function (name) {
        var toggle = (function () {
            var container = $(name + ' .container');
            var button = $(name + ' .button');
            return function () {
                if (container.is(':visible')) {
                    button.removeClass('active')
                    container.fadeOut(200);
                }
                else {
                    button.addClass('active')
                    container.fadeIn(200);
                }
            };
        })();
        $(name + ' .button').click(toggle);
        $(name + ' .close').click(toggle);
    });
    
    $('.script .run input[type="button"]').click(function () {
        var script = $(this).parents('.script');
        var src = script.find('textarea').val();
        var output = script.find('.output');
        output.empty();
        
        var lines = [];
        var context = {
            require : require,
            console : {
                log : function (s) {
                    lines.push(s);
                },
                dir : function (obj) {
                    var s = stringify(obj);
                    lines.push(s);
                }
            }
        };
        vm.runInNewContext(src, context);
        output.text(lines.join('\n'));
    });
});
