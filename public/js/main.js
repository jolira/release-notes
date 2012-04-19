/*global PhoneGap:false, require:false */
require.config({
    paths:{
        jquery:'libs/zepto-1.0RC1',
        underscore:'libs/underscore/underscore-1.3.2-amdjs',
        backbone:'libs/backbone/backbone-0.9.2-amdjs'
    }
});

require(["underscore", "backbone", "jquery", "models", "views"], function (_, Backbone, $, projects, viewMaker) {
    "use strict";

    Backbone.View.prototype.close = function () {
        console.log('Closing view ' + this);

        if (this.beforeClose) {
            this.beforeClose();
        }
        this.unbind();
    };

    var views = viewMaker(projects, "#project", "#release", "#notes"),
        Router = Backbone.Router.extend({
            routes:{
                ":project":"renderProject",
                ":project/:release":"renderProject",
                "*actions":"renderProject"
            },
            renderProject:function (project, release) {
                if (project) {
                    projects.set({
                        selected:project
                    }, {
                        silent:!!release
                    });
                    if (release) {
                        projects.releases.set({
                            project: project,
                            selected:release
                        });
                    }
                }
            }
        });

    var router = new Router();

    function processModelUpdate() {
        var project = projects.get("selected"),
            release = projects.releases.get("selected"),
            path = project ? project : "";

        if (release) {
            path += "/" + release;
        }

        router.navigate(path, { trigger:false });
    }

    projects.on("change:selected", processModelUpdate);
    projects.releases.on("change:selected", processModelUpdate);

    Backbone.history.start({pushState:false});
});
