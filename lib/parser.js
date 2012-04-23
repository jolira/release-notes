(function (module) {
    "use strict";

    var debug = require('./debug');

    function parse(regexp, desc) {
        var result = [],
            match;

        while(match = regexp.exec(desc)) {
            var projects = match[1];

            if (!projects) {
                continue;
            }

            var projectList = projects.split(/[,\s]+/);

            if (projectList) {
                projectList.forEach(function(project){
                    result.push(project);
                });
            }
        }

        return result.length ? result : undefined;
    }

    function firstMatchingDate(exp, val) {
        var val = exp.exec(val);

        if (!val) {
            return;
        }

        var date = val[1];

        if (!date) {
            return;
        }

        return new Date(date);
    }

    module.exports = function(description, cb) {
        // RegExp created using http://regexpal.com/
        var jobsRegExp = /\|\s*\*\s*Jenkins\s+Jobs\s*\*\s*\|\s*([\w\d\s\-,]+)\s*\|/ig,
            firstRegExp = /\|\s*\*\s*First\s+Build\s*\*\s*\|\s*([\w\d\/]+)\s*\|/i,
            lastRegExp = /\|\s*\*\s*Last\s+Build\s*\*\s*\|\s*([\w\d\/]+)\s*\|/i,
            projectHeaderRegExp = /\|\s*\*\s*Project\s*\*\s*\|\s*\*\s*Cards\s*\*\s*\|/i,
            jobs = parse(jobsRegExp, description),
            first = firstMatchingDate(firstRegExp, description),
            last = firstMatchingDate(lastRegExp, description),
            projectHeader = projectHeaderRegExp.exec(description);

        return cb(undefined, {
            date: new Date(),
            jobs: jobs,
            first: first,
            last: last,
            header: projectHeader ? projectHeader.index : undefined
        });
    };
})(module);
