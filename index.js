module.exports = require("./lib/build-report.js");
/*jslint node: true, vars: true, indent: 4 */
(function (module) {
    "use strict";

    var projects = require("./lib/projects"),
        path = require("path"),
        templates = path.join(__dirname, "templates"),
        pubdir = path.join(__dirname, "public");

    module.exports = {
        "hostname": "release-notes.jolira.com",
        "public": pubdir,
        "googleAnalyticsWebPropertyID": "UA-3602945-1",
        "title": "Release Notes",
        "stylesheets": [
            "css/style.css",
            "css/release-notes.less"
        ],
        "metas": [{
            "name": "description",
            "content": "Release Notes from Jenkins and Mingle"
        },
            {
                "viewport" : "width=device-width,user-scalable=no,initial-scale=1"
            }
        ],
        "templateFiles": [
            path.join(templates, "project-template.html")
        ],
        "htmlFiles": [
            path.join(templates, "main.html")
        ],
        scripts: [
            "js/libs/modernizr-2.5.2.min.js"
        ],
        "dispatcher": {
            projects: projects
        }
    };
})(module);