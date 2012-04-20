module.exports = require("./lib/build-report.js");
/*jslint node: true, vars: true, indent: 4 */
(function (module) {
    "use strict";

    if (!process.env.MINGLE_URL) {
        console.error("MINGLE_URL environment variable must be set");
        process.exit(-1);
    }

    var mingle = require("./lib/mingle"),
        projects = require("./lib/projects"),
        path = require("path"),
        templates = path.join(__dirname, "templates"),
        pubdir = path.join(__dirname, "public");

    module.exports = function (defaults, cb, options) {
        var mingleClient = mingle(process.env.MINGLE_URL, process.env.MINGLE_USERNAME, process.env.MINGLE_PASSWORD);

        defaults.hostname = "release-notes.jolira.com";
        defaults["public"] = pubdir,
        defaults.googleAnalyticsWebPropertyID = "UA-3602945-1";
        defaults.title = "Release Notes";
        defaults.stylesheets = [
            "css/style.css",
            "css/release-notes.less"
        ];
        defaults.metas = [
            {
                "name":"description",
                "content":"Release Notes from Jenkins and Mingle"
            },
            {
                "viewport":"width=device-width,user-scalable=no,initial-scale=1"
            }
        ];
        defaults.templateFiles = [
            path.join(templates, "project-template.html")
        ];
        defaults.htmlFiles = [
            path.join(templates, "main.html")
        ];
        defaults.scripts = [
            "js/libs/modernizr-2.5.2.min.js"
        ];
        defaults.dispatcher = {
            projects:projects(mingleClient)
        };

        return cb(undefined, defaults);
    };
})(module);