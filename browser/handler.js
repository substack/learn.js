var $ = require('jquery-browserify');
var cookie = require('cookie-cutter');
var namesList = require('./names_list');

module.exports = function (remote, conn) {
    var names = namesList(remote);
    
    var to = null;
    function setName () {
        var name = $(this).val();
        var ex = new Date;
        ex.setDate(ex.getDate() + 30);
        cookie.set('name', name, { expires : ex });
        
        if (!to) to = setTimeout(function () {
            remote.myNameIs(name);
            to = null;
        }, 250);
    }
    $('#name').change(setName).keyup(setName);
};
