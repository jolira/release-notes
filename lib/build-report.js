/*jslint node: true, vars: true, indent: 4 */
(function (module) {
    "use strict";

    var jenkinsinit = require('./jenkins');
    var fs = require('fs');

    module.exports = function (url, job, username, password) {
        var jenkins = jenkinsinit(url, username, password);

        // TODO(s):
        // https://www.pivotaltracker.com/projects/469923 shows inconsistent mingle URIs (mingle, mingle.bsc.bscal.com)
        // Will multiple mingle URIs be referenced in a single SVN commit?
        // EXPECT: Mingle Project in group 1, Card # in group 2
        var pattern = /.*https{0,1}:\/\/mingle.*\/projects\/(\w+)\/cards\/(\d+).*/mg;

        // Log details using tab delimiters to STDOUT
        function logEntry(project, card, name, commit_date, author, build_version, approved) {
            console.log([
                project ? project : 'n/a',
                card ? card : 'n/a',
                // TODO: will not log card name until this can be retrieved from mingle.
                //name?name:'n/a',
                // TODO: manipulate iso-8601 format for easy excel manipulation?
                commit_date,
                author,
                build_version,
                approved ? 'yes' : 'no'
            ].join('\t'));
        }

        var StoryApproval = function () {
            /*
             * placeholder function to retrieve approved stories
             * currently this will read from a file called approved.txt
             * later this could be implemented to query a mingle story and
             * parse the (unstructured?) data.
             */
            function getApprovedCards() {
                var approvedCards = {};

                // For each line in approved.txt
                var file = fs.readFileSync('approved.txt', 'utf8');
                file.split(/\n+/).forEach(function (it) {
                    it = it.trim();
                    // If line contains more than a non-'#' character
                    if (it.match(/^[^#]+/)) {
                        // Create a map entry in approvedCards. The value doesn't matter, only that the key exist.
                        approvedCards[it] = true;
                    }
                });

                return approvedCards;
            }

            var approvedCards = getApprovedCards();

            /*
             * placeholder function to retrieve story name.
             * currently this will return a constant 'UNKNOWN'
             * later this could be retrieved from mingle
             */
            this.getStoryName = function (project, card) {
                return 'UNKNOWN';
            }

            this.isApproved = function (project, card) {
                return approvedCards[project + ':' + card] != null;
            }
        };

        var sa = new StoryApproval();

        jenkins.builds(job, function (builds) {
            builds.forEach(function (build) {
                // For each build retrieved from jenkins for specified project
                jenkins.build(job, build.number, function (result) {
                    // For every associated changeSet item (SVN commit)
                    result.changeSet.items.forEach(function (it) {
                        // Check if SVN commit message matched against pre-defined mingle URI pattern
                        var r = pattern.exec(it.msg);

                        // If SVN commit log contain a mingle story URI?
                        if (r != null) {
                            var mProject = r[1];
                            var mCard = r[2];
                            var mStoryName = sa.getStoryName(mProject, mCard);
                            var approved = sa.isApproved(mProject, mCard);
                            logEntry(mProject, mCard, mStoryName, it.date, it.user, build.number, approved);
                        }
                        else {
                            logEntry(null, null, null, it.date, it.user, build.number, false);
                        }
                    });
                });
            });
        });
    }
})(module);
