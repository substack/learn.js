module.exports = function (remote) {
    var names = {};
    
    remote.names(function (names_) {
        for (var key in names) delete names[key];
        for (var key in names_) names[key] = names_[key];
    });
    
    remote.on('name', function (name, id) {
        names[id] = name;
    });
    
    remote.on('name', function (name, id) {
        names[id] = name;
    });
    
    remote.on('connect', function (id) {
        names[id] = null;
    });
    
    remote.on('disconnect', function (id) {
        delete names[id];
    });
    
    return names;
};
