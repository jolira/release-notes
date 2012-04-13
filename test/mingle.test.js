/*jslint white: true, forin: false, node: true, indent: 4 */
(function (module, process) {
    "use strict";

    var SUCCESS_URL = "https://success/",
        SUCCESS_URL = "https://failure/",
        PROJECTS_FILE = "projects.xml",
        PROJECTS_XML = {"@":{"type":"array"}, "project":[
            {"name":"_E Business Releases 2012", "identifier":"_e_business_releases_2012", "description":{"@":{"nil":"true"}}, "created_at":{"#":"2011-12-12T21:33:01Z", "@":{"type":"datetime"}}, "updated_at":{"#":"2012-03-26T02:33:42Z", "@":{"type":"datetime"}}, "created_by":{"@":{"url":"http://mingle.jolira.com/api/v2/users/1.xml"}, "name":"Joachim Kainz", "login":"joachim.kainz"}, "modified_by":{"@":{"url":"http://mingle.jolira.com/api/v2/users/1.xml"}, "name":"Joachim Kainz", "login":"joachim.kainz"}, "keywords":{"keyword":["card", "#"]}, "template":{"@":{"nil":"true"}}, "email_address":"joe.brinskele@blueshieldca.com", "email_sender_name":"Joe Brinskele", "date_format":"%d %b %Y", "time_zone":"Pacific Time (US & Canada)", "precision":{"#":"2", "@":{"type":"integer"}}, "anonymous_accessible":{"#":"false", "@":{"type":"boolean"}}, "auto_enroll_user_type":{"@":{"nil":"true"}}},
            {"name":"Test Agile Project With Tasks", "identifier":"test_agile_project_with_tasks", "description":"Test Agile Project With Tasks", "created_at":{"#":"2012-03-23T22:30:46Z", "@":{"type":"datetime"}}, "updated_at":{"#":"2012-03-23T22:32:13Z", "@":{"type":"datetime"}}, "created_by":{"@":{"url":"http://mingle.jolira.com/api/v2/users/1.xml"}, "name":"Joachim Kainz", "login":"joachim.kainz"}, "modified_by":{"@":{"url":"http://mingle.jolira.com/api/v2/users/1.xml"}, "name":"Joachim Kainz", "login":"joachim.kainz"}, "keywords":{"keyword":["card", "#"]}, "template":{"@":{"nil":"true"}}, "email_address":{}, "email_sender_name":{}, "date_format":"%d/%m/%Y", "time_zone":"Pacific Time (US & Canada)", "precision":{"#":"2", "@":{"type":"integer"}}, "anonymous_accessible":{"#":"false", "@":{"type":"boolean"}}, "auto_enroll_user_type":{"@":{"nil":"true"}}},
            {"name":"Agile hybrid template (3.5)", "identifier":"agile_hybrid_template_3_5", "description":"This template is designed for agile teams that are practicing a blended agile methodology rather than strictly practicing Scrum. Concepts supported include Release and Iteration planning as well as Epic Story, Story and Defect tracking.", "created_at":{"#":"2011-02-10T16:03:47Z", "@":{"type":"datetime"}}, "updated_at":{"#":"2012-03-23T21:47:30Z", "@":{"type":"datetime"}}, "created_by":{"@":{"url":"http://mingle.jolira.com/api/v2/users/1.xml"}, "name":"Joachim Kainz", "login":"joachim.kainz"}, "modified_by":{"@":{"url":"http://mingle.jolira.com/api/v2/users/1.xml"}, "name":"Joachim Kainz", "login":"joachim.kainz"}, "keywords":{"keyword":["card", "#"]}, "template":{"#":"true", "@":{"type":"boolean"}}, "email_address":{}, "email_sender_name":{}, "date_format":"%d %b %Y", "time_zone":"Central America", "precision":{"#":"2", "@":{"type":"integer"}}, "anonymous_accessible":{"#":"false", "@":{"type":"boolean"}}, "auto_enroll_user_type":{"@":{"nil":"true"}}},
            {"name":"Agile hybrid with tasks (3.5)", "identifier":"agile_hybrid_with_tasks_3_5", "description":"This template is identical the Agile Hybrid, but it adds Tasks and Features.", "created_at":{"#":"2011-02-10T16:03:47Z", "@":{"type":"datetime"}}, "updated_at":{"#":"2012-03-23T21:51:01Z", "@":{"type":"datetime"}}, "created_by":{"@":{"url":"http://mingle.jolira.com/api/v2/users/1.xml"}, "name":"Joachim Kainz", "login":"joachim.kainz"}, "modified_by":{"@":{"url":"http://mingle.jolira.com/api/v2/users/1.xml"}, "name":"Joachim Kainz", "login":"joachim.kainz"}, "keywords":{"keyword":["card", "#"]}, "template":{"#":"true", "@":{"type":"boolean"}}, "email_address":{}, "email_sender_name":{}, "date_format":"%d %b %Y", "time_zone":"Central America", "precision":{"#":"2", "@":{"type":"integer"}}, "anonymous_accessible":{"#":"false", "@":{"type":"boolean"}}, "auto_enroll_user_type":{"@":{"nil":"true"}}},
            {"name":"Scrum template (3.5)", "identifier":"scrum_template_3_5", "description":"This template represents a Scrum approach to project tracking that supports product, release and sprint backlog planning, tracking and reporting.", "created_at":{"#":"2011-11-13T21:29:33Z", "@":{"type":"datetime"}}, "updated_at":{"#":"2012-03-23T21:40:42Z", "@":{"type":"datetime"}}, "created_by":{"@":{"url":"http://mingle.jolira.com/api/v2/users/1.xml"}, "name":"Joachim Kainz", "login":"joachim.kainz"}, "modified_by":{"@":{"url":"http://mingle.jolira.com/api/v2/users/1.xml"}, "name":"Joachim Kainz", "login":"joachim.kainz"}, "keywords":{"keyword":["card", "#"]}, "template":{"#":"true", "@":{"type":"boolean"}}, "email_address":{}, "email_sender_name":{}, "date_format":"%d %b %Y", "time_zone":"Central America", "precision":{"#":"2", "@":{"type":"integer"}}, "anonymous_accessible":{"#":"false", "@":{"type":"boolean"}}, "auto_enroll_user_type":{"@":{"nil":"true"}}},
            {"name":"Simple template (3.5)", "identifier":"simple_template_3_5", "description":"This template shows how one card type (story) and a few properties can be used to track progress on a small project. Use this template as an example of how to use Mingle simply and effectively to track work progress.", "created_at":{"#":"2009-03-27T07:32:59Z", "@":{"type":"datetime"}}, "updated_at":{"#":"2012-03-23T21:54:42Z", "@":{"type":"datetime"}}, "created_by":{"@":{"url":"http://mingle.jolira.com/api/v2/users/1.xml"}, "name":"Joachim Kainz", "login":"joachim.kainz"}, "modified_by":{"@":{"url":"http://mingle.jolira.com/api/v2/users/1.xml"}, "name":"Joachim Kainz", "login":"joachim.kainz"}, "keywords":{"keyword":["card", "#"]}, "template":{"#":"true", "@":{"type":"boolean"}}, "email_address":{}, "email_sender_name":{}, "date_format":"%d %b %Y", "time_zone":"Beijing", "precision":{"#":"2", "@":{"type":"integer"}}, "anonymous_accessible":{"#":"false", "@":{"type":"boolean"}}, "auto_enroll_user_type":{"@":{"nil":"true"}}},
            {"name":"XP template (3.5)", "identifier":"xp_template_3_5", "description":"This template is designed for teams that are practicing Extreme Programming (XP) methodology. Concepts supported include Release and Iteration planning as well as Story and Spike tracking and reporting.", "created_at":{"#":"2011-11-02T22:33:51Z", "@":{"type":"datetime"}}, "updated_at":{"#":"2012-03-23T21:53:23Z", "@":{"type":"datetime"}}, "created_by":{"@":{"url":"http://mingle.jolira.com/api/v2/users/1.xml"}, "name":"Joachim Kainz", "login":"joachim.kainz"}, "modified_by":{"@":{"url":"http://mingle.jolira.com/api/v2/users/1.xml"}, "name":"Joachim Kainz", "login":"joachim.kainz"}, "keywords":{"keyword":["card", "#"]}, "template":{"#":"true", "@":{"type":"boolean"}}, "email_address":{}, "email_sender_name":{}, "date_format":"%d %b %Y", "time_zone":"Arizona", "precision":{"#":"2", "@":{"type":"integer"}}, "anonymous_accessible":{"#":"false", "@":{"type":"boolean"}}, "auto_enroll_user_type":{"@":{"nil":"true"}}}
        ]},
        vows = require('vows'),
        mingle = require("../lib/mingle"),
        horaa = require("horaa"),
        assert = require("assert"),
        restler = horaa("restler"),
        cbByType = {};

    restler.hijack('get', function (url, opts) {
        //var success = url.indexOf(SUCCESS_URL) === 0;

        process.nextTick(function () {
            var cb = cbByType["complete"];

            return cb(undefined,PROJECTS_XML);
        }, 0);

        return {
            on:function (event, cb) {
                assert.equal(event, "complete");

                if (cbByType[event]) {
                    return assert.fail(cbByType[event], undefined, "callback already defined");
                }

                cbByType[event] = cb;
            }
        };
    });

    // Create a Test Suite
    vows.describe('call mingle').addBatch({
        'with the success url':{
            topic:mingle(SUCCESS_URL, {}),
            "calling":{
                topic:function (client) {
                    client.viewProjects(this.callback);
                },
                "jobs":function (jobs) {
                    console.log(jobs);
                }
            }
        }
    }).export(module);
})(module, process);
