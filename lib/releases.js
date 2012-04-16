/*jslint node: true, vars: true, indent: 4 */
(function (module) {
    "use strict";
    var debug = require('./debug');

    function loadReleases(client, id, cb) {
        if (!id) {
            return cb(undefined, []);

        }
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

    module.exports = function(client, id){
        return {
            GET: function(cb) {
                return loadReleases(client, id, cb);
            }
        };
    };
})(module);
