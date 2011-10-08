var $ = require('jquery-browserify');

module.exports = function (unit, remote) {
    var finished = false;
    $('#calc-0').click(function () {
        var tr = $(this).parents('tr');
        var val = tr.find('input.value').val();
        
        if (val === (3 * 4 + 11 - 3).toString()) {
            tr.find('.ok').text('ok!');
            
            if (!finished) {
                remote.addPoints(5);
                finished = true;
            }
        }
        else {
            tr.find('.ok').text('not ok');
        }
    });
};
