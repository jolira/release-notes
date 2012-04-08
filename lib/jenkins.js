/*jslint node: true, vars: true, indent: 4 */
(function (module) {
    "use strict";

    var rest = require('restler');

    function call(url, path, cb) {
        var jsonURL = url + '/api/json';

        if (path) {
            jsonURL += path;
        }

        return rest.get(jsonURL, {parser:rest.parsers.json }).on('success',
            function (data, response) {
                return cb(undefined, data, response)
            }).on('fail', function (data, response) {
                return cb(data, undefined, response)
            }).on('error', function (data, response) {
                return cb(data, undefined, response)
            });
    }

    module.exports = function (url) {
        return {
            jobs:function (cb) {
                call(url, undefined, function (err, result) {
                    cb(err, result.jobs);
                });
            },
            builds:function (job, cb) {
                call(url, '/job/' + job, function (err, result) {
                    cb(err, result.builds);
                });
            },
            build:function (job, build, cb) {
                call(url, '/job/' + job + '/' + build, function (err, result) {
                    cb(err, result);
                })
            }
        };
    };
})(module);
