
var grobjects =[];

function findObj(name) {
    var rv = null;
    grobjects.forEach(function(obj) {
        if (obj.name == name) {
            rv = obj;
        }
    });
    return rv;
};