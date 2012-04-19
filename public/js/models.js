define(["underscore", "backbone", "jquery"], function (_, Backbone, $) {
    var ReleaseNotes = Backbone.Model.extend({
            url:function () {
                return "/projects/" + this.id;
            }
        }),
        Release = Backbone.Model.extend({}),
        Project = Backbone.Model.extend({}),
        ReleaseList = Backbone.Collection.extend({
            model:Release,
            initialize:function (options) {
                this.id = options.id;
            },
            url:function () {
                return "/projects/" + this.id;
            }
        }),
        ProjectList = Backbone.Collection.extend({
            url:"/projects",
            model:Project
        }),
        SelectableReleaseList = Backbone.Model.extend({
            initialize:function (attributes) {
                var self = this;
                this.on("change:project", function (mdl, project) {
                    if (self.list) {
                        self.list.off();
                    }
                    self.list = new ReleaseList({
                        id:project
                    });
                    self.list.on("all", function () {
                        arguments[0] = "list:" + arguments[0];
                        Backbone.Events.trigger.apply(self, arguments);
                    });
                });
                this.on("change:selected", function (mdl, value) {
                    if (self.notes) {
                        self.notes.off();
                    }
                    var project = self.get("project"),
                        release = value;

                    self.notes = release ? new ReleaseNotes({
                        id:project + '/' + release
                    }) : undefined;

                    if (self.notes) {
                        self.notes.on("all", function () {
                            console.log("notes event", arguments);
                            arguments[0] = "notes:" + arguments[0];
                            Backbone.Events.trigger.apply(self, arguments);
                        });
                    }
                });
                this.fetchList = function () {
                    return self.list && self.list.fetch();
                };
                this.fetchNotes = function () {
                    return self.notes && self.notes.fetch();
                };
            }
        }),
        SelectableProjectList = Backbone.Model.extend({
            initialize:function (attributes) {
                var self = this;
                this.list = new ProjectList();
                this.releases = new SelectableReleaseList();
                this.on("change:selected", function (mdl, project) {
                    self.releases.set({
                        project:project
                    });
                });
                self.list.on("all", function () {
                    arguments[0] = "list:" + arguments[0];
                    Backbone.Events.trigger.apply(self, arguments);
                });
                this.fetch = function () {
                    return self.list.fetch();
                };
            }
        });

    return new SelectableProjectList();
});