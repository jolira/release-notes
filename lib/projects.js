/*jslint node: true, vars: true, indent: 4 */
(function (module) {
    "use strict";

    module.exports = {
        "GET": function(cb) {
            delete arguments[0];

            return cb(undefined, arguments);
        }
    };
})(module);
