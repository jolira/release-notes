/*global PhoneGap:false, require:false */
require.config({
    paths: {
        jquery: 'libs/zepto-1.0RC1',
        underscore: 'libs/underscore/underscore-1.3.2-amdjs',
        backbone: 'libs/backbone/backbone-0.9.2-amdjs'
    }
});

require(["underscore", "backbone", "jquery", "project"], function (_, Backbone, $, project) {
    "use strict";

        var Router = Backbone.Router.extend({
            routes: {
                "nodes/:project":          "renderProject",
                "nodes/:project/:release": "renderProject",
                "*actions":                "renderProject"
            },
            renderProject: function(){
                project.apply(this, arguments);
            }
        });

        new Router();
        Backbone.history.start({pushState: true});
    $(function() {
    });
});