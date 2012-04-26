(function (module) {
    "use strict";

    var debug = require('./debug'),
        Batch = require("batch");

    /* {
     date:new Date(),
     jobs:jobs,
     first:first,
     last:last,
     approved:approved
     } */

    function isApproved(request, project, card) {
        var cards = request.approved[project];

        if (!cards) {
            return false;
        }

        return cards[card];
    }

    function loadJobs(client, names, cb) {
        var batch = new Batch();

        names.forEach(function (name) {
            batch.push(function (done) {
                client.loadJob(name, done);
            });
        });

        batch.end(cb);
    }

    function processJobs(request, jobs, cb) {
        var result = [];

        jobs.forEach(function (job) {
            if (!job || !job.builds) {
                return;
            }

            // job.name
            // job.url
            job.builds.forEach(function (build) {
                if (request.first && build.timestamp < request.first.getTime()) {
                    return;
                }
                if (request.last && build.timestamp > request.last.getTime()) {
                    return;
                }
                build.changeSet.items.forEach(function (item) {
                    var change = {
                        jenkins:{
                            name:job.name,
                            date: new Date(item.date),
                            author: item.user,
                            number:build.number,
                            url:build.url
                        }
                    };
                    var project,
                        card;

                    if (item.msg) {
                        var match = /https{0,1}:\/\/[^/]*\/projects\/(\w+)\/cards\/(\d+)/.exec(item.msg);

                        if (match) {
                            change.mingle = {
                                project:match[1],
                                card:match[2],
                                approved:isApproved(request, match[1], match[2])
                            };
                        }
                    }

                    result.push(change);
                });
            });
        });

        return cb(undefined, result);
    }

    module.exports = function (client, request, cb) {
        return loadJobs(client, request.jobs, function (err, jobs) {
            if (err) {
                return cb(err);
            }

            return processJobs(request, jobs, function (err, changes) {
                if (err) {
                    return cb(err);
                }

                return cb(undefined, {
                    request:request,
                    changes:changes
                });
            });
        });
    };
})(module);
