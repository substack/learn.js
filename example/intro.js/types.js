var $ = require('jquery-browserify');

module.exports = function (unit, remote) {
    var values = [
        'number',
        'string',
        'number',
        'object',
        'string',
        'boolean',
        'boolean'
    ];
    
    values.forEach(function (value, ix) {
        var finished = false;
        $('#types-' + ix).click(function () {
            var tr = $(this).parents('tr');
            var val = tr.find('input.value').val();
            
            if (val === value.toString()) {
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
    });
};
