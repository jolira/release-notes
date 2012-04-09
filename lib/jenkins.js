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
        call(normalized + "job/" + job + "/api/json", opts, function (err, job) {
            if (err) {
                return cb(err);
            }

            return cb(undefined, job);
        });
    }

    function viewJobs(normalized, opts, cb) {
        call(normalized + "api/json?tree=jobs[name]", opts, function (err, result) {
            if (err) {
                return cb(err);
            }

            var jobs = extractJobNames(result.jobs),
                batch = new Batch();

            jobs.forEach(function(job){
                batch.push(function(done){
                    viewJob(normalized, opts, job, done);
                });
            });

            return batch.end(function(err, jobs){
                return cb(err, jobs);
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
