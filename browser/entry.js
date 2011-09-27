var $ = require('jquery-browserify');

$(window).resize(function () {
    var h = $(window).height() - $('#header').height();
    $('#content').height(h).show();
});

$(window).load(function () {
    $(window).trigger('resize');
});

