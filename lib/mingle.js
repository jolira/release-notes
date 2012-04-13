/*jslint node: true, vars: true, indent: 4 */
(function (module) {
    "use strict";

    var rest = require('restler'),
        Batch = require('batch'),
        debug = require('./debug');

    function call(url, opts, cb) {
        debug("calling", url, opts);

        return rest.get(url, opts).on('complete',
            function (result, response) {
                debug("result", url, result);

                if (result instanceof Error) {
                    return cb(result, undefined, response)
                }

                return cb(undefined, result, response)
            });
    }

    function viewProjects(normalized, opts, cb) {
        var url = normalized + "api/v2/projects.xml";

        call(url, opts, function (err, result) {
            if (err) {
                return cb(err);
            }

            cb(undefined, result);
        });
    }

    module.exports = function (url, opts) {
        var normalized = url.charAt(url.length-1) === '/' ? url : url + '/';

        opts.parser = rest.parsers.xml;

        return {
            "viewProjects": function (cb) {
                return viewProjects(normalized, opts, cb);
            }
        };
    };
})(module);
