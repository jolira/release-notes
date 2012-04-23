/*jslint node: true, vars: true, indent: 4 */
(function (module) {
    "use strict";

    var rest = require('restler'),
        Batch = require('batch'),
        debug = require('./debug'),
        xml2js = require('xml2js');

    module.exports = function (url, username, password) {
        var normalized = url.charAt(url.length - 1) === '/' ? url : url + '/',
            opts = {
                parser:function (data, callback) {
                    if (!data) {
                        return callback(null, null);
                    }

                    var parser = new xml2js.Parser({
                        normalize:false,
                        trim:true
                    });

                    parser.parseString(data, function (err, data) {
                        if (err) {
                            err.message = 'Failed to parse XML body: ' + err.message;
                        }
                        callback(err, data);
                    });
                }
            };
        debug("mingle", normalized);

        if (username) {
            opts.username = username;
            opts.password = password;
        }

        return function (path, cb) {
            var qurl = url + path;

            debug("calling", qurl);

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
