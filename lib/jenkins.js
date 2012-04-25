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

    function loadJob(normalized, opts, job, cb) {
        var url = normalized + "job/" + job + "/api/json?depth=5";

        call(url, opts, function (err, job) {
            if (err) {
                debug("suppressing error", err, "for", url);
                return cb(undefined, undefined, url);
            }

            return cb(undefined, job);
        });
    }

    module.exports = function (url, username, password) {
        var opts = {},
            normalized = url.charAt(url.length-1) === '/' ? url : url + '/';

        opts.parser = rest.parsers.json;

        if (username) {
            opts.username = username;
            opts.password = password;
        }

        return {
            "loadJob": function (job, cb) {
                return loadJob(normalized, opts, job, cb);
            }
        };
    };
})(module);
