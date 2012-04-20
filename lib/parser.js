(function (module) {
    "use strict";

    var debug = require('./debug');

    function parse(regexp, desc) {
        var result = [],
            match;

        while(match = regexp.exec(desc)) {
            result.push(match);
        }

        return result.length ? result : undefined;
    }

    module.exports = function(description, cb) {
        // RegExp created using http://regexpal.com/
        var jobsRegExp = /\|\s*\*\s*Jenkins\s+Jobs\s*\*\s*\|\s*([\w\d\s\-,]+)\s*\|/ig,
            firstRegExp = /\|\s*\*\s*First\s+Build\s*\*\s*\|\s*([\w\d\/]+)\s*\|/i,
            lastRegExp = /\|\s*\*\s*Last\s+Build\s*\*\s*\|\s*([\w\d\/]+)\s*\|/i,
            headerRegExp = /\|\s*\*\s*Project\s*\*\s*\|\s*\*\s*Cards\s*\*\s*\|/i,
            jobs = parse(jobsRegExp, description),
            first = firstRegExp.exec(description),
            last = lastRegExp.exec(description);

        return cb(undefined, {
            jobs: jobs,
            first: first,
            last: last,
            header: headerRegExp.exec(description).index
        });
    };
})(module);
