/*global PhoneGap:false, require:false */
require.config({
    paths:{
        jquery:'libs/zepto-1.0RC1',
        underscore:'libs/underscore/underscore-1.3.2-amdjs',
        backbone:'libs/backbone/backbone-0.9.2-amdjs'
    }
});

require(["underscore", "backbone", "jquery", "project"], function (_, Backbone, $, project) {
    "use strict";

    Backbone.View.prototype.close = function () {
        console.log('Closing view ' + this);

        if (this.beforeClose) {
            this.beforeClose();
        }
        this.remove();
        this.unbind();
    };

    var Router = Backbone.Router.extend({
        routes:{
            ":proj":"renderProject",
            ":proj/:release":"renderProject",
            "*actions":"renderProject"
        },
        renderProject:function (proj, release) {
            var self = this;
            project.call(self, {
                navigate:function (proj, release) {
                    var path = proj ? proj : "";
                    if (release) {
                        path += "/" + release;
                    }
                    self.navigate(path, { trigger:true });
                }
            }, proj, release);
        }
    });

    new Router();
    Backbone.history.start({pushState:false});
    $(function () {
    });
});