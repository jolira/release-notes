/*jslint white: true, forin: false, node: true, indent: 4 */
(function (module, process) {
    "use strict";

    var SUCCESS_URL = "https://localost:12345/success",
        vows = require('vows'),
        jenkins = require("../lib/jenkins"),
        horaa = require("horaa"),
        assert = require("assert"),
        restler = horaa("restler"),
        cbByType = {};

    restler.hijack('get', function (url, opts) {
        process.nextTick(function () {
            if (SUCCESS_URL === url) {
                return cbByType["success"];
            }
        }, 0);

        return {
            on: function (event, cb) {
                if (cbByType[event]) {
                    return assert.fail(cbByType[event], undefined, "callback already defined");
                }

                cbByType[event] = cb;
            }
        };
    });

    // Create a Test Suite
    vows.describe('call jenkins').addBatch({
        'with the success url': {
            topic: jenkins("https://localost:12345/success"),
            "calling": {
                topic: function (client) {
                    client.jobs(this.callback);
                },
                "jobs":function (jobs) {
                    console.log(jobs);
                }
            }
        }
    }).export(module);
})(module, process);
