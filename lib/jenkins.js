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

    function extractJobNames(jobs) {
        var names = [];

        jobs.forEach(function(job){
            names.push(job.name);
        });

        return names;
    }

    function viewJob(normalized, opts, job, cb) {
        var url = normalized + "job/" + job + "/api/json?depth=256";

        call(url, opts, function (err, job) {
            if (err) {
                return cb(err, undefined, url);
            }

            return cb(undefined, job);
        });
    }

    function viewJobs(normalized, opts, cb) {
        var url = normalized + "api/json?tree=jobs[name]";

        call(url, opts, function (err, result) {
            if (err) {
                return cb(err);
            }

            var jobs = extractJobNames(result.jobs),
                batch = new Batch(),
                result = {};

            jobs.forEach(function(job){
                batch.push(function(done){
                    viewJob(normalized, opts, job, function(err, info, msic){
                        if (err) {
                            console.log("error while processing", msic, err);
                            return done();
                        }

                        result[job] = info;
                        done();
                    });
                });
            });

            return batch.end(function(err){
                return cb(err, result);
            });
        });
    }

    module.exports = function (url, opts) {
        var normalized = url.charAt(url.length-1) === '/' ? url : url + '/';

        opts.parser = rest.parsers.json;

        return {
            "viewJobs": function (cb) {
                return viewJobs(normalized, opts, cb);
            }
        };
    };
})(module);
