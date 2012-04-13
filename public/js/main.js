/*global PhoneGap:false, require:false */
require.config({
    paths: {
        jquery: 'libs/zepto-0.8',
        underscore: 'libs/underscore/underscore-1.3.1-amdjs',
        backbone: 'libs/backbone/backbone-0.9.1-amdjs'
    }
});

require(["underscore", "backbone", "jquery", "project"], function (_, Backbone, $, project) {
    "use strict";

    $(function() {
        project();
    });
});