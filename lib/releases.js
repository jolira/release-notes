/*jslint node: true, vars: true, indent: 4 */
(function (module) {
    "use strict";
    var debug = require('./debug');

    function loadReleases(client, id, cb) {
        if (!id) {
            return cb(undefined, []);

        }
        client("api/v2/projects/" + id + "/cards.xml", function (err, data) {
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

    module.exports = function(client){
        return {
            GET: function(cb, unused, id) {
                return loadReleases(client, id, cb);
            }
        };
    };
})(module);
