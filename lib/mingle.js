/*jslint node: true, vars: true, indent: 4 */
(function (module) {
    "use strict";

    var rest = require('restler'),
        Batch = require('batch'),
        debug = require('./debug');

    module.exports = function (url, username, password) {
        var normalized = url.charAt(url.length - 1) === '/' ? url : url + '/',
            opts = {
                parser: rest.parsers.xml
            };
        debug("mingle", normalized);

        if (username) {
            opts.username = username;
            opts.password = password;
        }

        return function (path, cb) {
            var qurl = url + path;

            debug("calling", qurl);

            opts.parser = rest.parsers.xml;

            return rest.get(qurl, opts).on('complete',
                function (result, response) {
                    debug("result", qurl, result);

                    if (result instanceof Error) {
                        return cb(result, undefined, response)
                    }

                    return cb(undefined, result, response)
                });
        }
    }
})(module);
