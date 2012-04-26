/*jslint node: true, vars: true, indent: 4 */
(function (module) {
    "use strict";

    var mingle = require("./lib/mingle"),
        jenkins = require("./lib/jenkins"),
        projects = require("./lib/projects"),
        bootstrap = require("site-manager-bootstrap"),
        path = require("path"),
        templates = path.join(__dirname, "templates"),
        pubdir = path.join(__dirname, "public"),
        localLessdir = path.join(pubdir, "less"),
        bootstrapLessdir = path.join(bootstrap, "less");

    module.exports = function (defaults, cb, options) {
        var mopts = options.mingle,
            jopts = options.jenkins,
            mingleClient = mingle(mopts.url, mopts.username, mopts.password),
            jenkinsClient = jenkins(jopts.url, jopts.username, jopts.password),
            pubdirs = [ pubdir, localLessdir, bootstrapLessdir, bootstrap ];

        defaults["public"].forEach(function (dir) {
            pubdirs.push(dir);
        });
        defaults.hostname = "release-notes.jolira.com";
        defaults["public"] = pubdirs;
        defaults.googleAnalyticsWebPropertyID = "UA-3602945-1";
        defaults.title = "Release Notes";
        defaults.stylesheets = [
            "bootstrap.less",
            "responsive.less"
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
            projects:projects(mingleClient, jenkinsClient)
        };

        return cb(undefined, defaults);
    };
})(module);