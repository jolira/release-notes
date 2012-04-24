(function (module) {
    "use strict";
    var debug = require('./debug'),
        parse = require('./parser'),
        createNotes = require('./notes');

    function loadReleases(client, release, cb) {
        if (!release) {
            return cb(undefined, []);

        }
        client("api/v2/projects/" + release + "/cards.xml", function (err, data) {
            if (err) {
                return cb(err);
            }

            var cards = data.card;

            if (!cards) {
                return cb();
            }

            if (!Array.isArray(cards)) {
                cards = [ cards ];
            }

            var result = [];

            cards.forEach(function(card){
                result.push({
                    id: card.number["#"],
                    name: card.name
                });
            });

            debug("projects found", result);

            cb(undefined, result);
        });
    }

    function loadProjects(client, cb) {
        client("api/v2/projects.xml", function (err, data) {
            if (err) {
                return cb(err);
            }

            var projects = data.project;

            if (!projects) {
                return cb();
            }

            if (!Array.isArray(projects)) {
                projects = [ projects ];
            }

            var result = [];

            projects.forEach(function(project){
                result.push({
                    id: project.identifier,
                    name: project.name
                });
            });

            debug("projects found", result);

            cb(undefined, result);
        });
    }

    function loadReleaseNotes(mingleClient, jenkinsClient, project, release, cb) {
        mingleClient("api/v2/projects/" + project + "/cards/" + release + ".xml", function (err, data) {
            if (err) {
                return cb(err);
            }

            return parse(data.description, function(err, request){
                if (err) {
                    return cb(err);
                }

                return createNotes(jenkinsClient, request, cb);
            });
        });
    }

    module.exports = function(mingleClient, jenkinsClient){
        return {
            GET: function(cb, unused, project, release) {
                if (!project) {
                    return loadProjects(mingleClient, cb);
                }
                if (!release) {
                    return loadReleases(mingleClient, project, cb);
                }
                return loadReleaseNotes(mingleClient, jenkinsClient, project, release, cb);
            }
        };
    };
})(module);
