define(["underscore", "backbone", "jquery"], function (_, Backbone, $) {
    var ReleaseView = Backbone.View.extend({
            tagName:"option",
            render:function () {
                var vals = this.model.toJSON();

                this.$el.html(vals.name);
                this.$el.val(vals.id);

                if (this.id && this.id == vals.id) {
                    this.$el.attr("selected", true);
                }

                return this;
            }
        }),
        ReleaseListView = Backbone.View.extend({
            events:{
                "change":"selectRelease"
            },
            initialize:function () {
                this.model.bind('list:reset', this.addAll, this);
                this.model.fetch();
            },
            selectRelease:function () {
                var selected = this.$el.val();

                this.model.set({
                    selected:selected
                });
            },
            addAll:function () {
                this.$el.removeAttr("disabled");
                this.$el.find('option').remove();
                var current = this.model.get("selected"),
                    self = this;

                this.model.list.each(function (project) {
                    var view = new ReleaseView({
                        model:project,
                        id: current
                    });
                    self.$el.append(view.render().el);
                });

                var selected = this.$el.val();

                if (selected && selected !== current) {
                    this.model.set({
                        selected:selected
                    });
                }
            }
        }),
        ProjectView = Backbone.View.extend({
            tagName:"option",
            render:function () {
                var vals = this.model.toJSON();

                this.$el.html(vals.name);
                this.$el.val(vals.id);

                if (this.selected && this.id == vals.id) {
                    this.$el.attr("selected", true);
                }

                return this;
            }
        }),
        ProjectListView = Backbone.View.extend({
            events:{
                "change":"selectProject"
            },
            initialize:function () {
                this.$el.attr("disabled", true);
                this.model.bind('list:reset', this.addAll, this);
                this.model.fetch();
            },
            selectProject:function () {
                var selected = this.$el.val();

                this.model.set({
                    selected:selected
                });
            },
            addAll:function () {
                this.$el.removeAttr("disabled");
                this.$el.find('option').remove();
                var current = this.model.get("selected"),
                    self = this;

                this.model.list.each(function (project) {
                    var view = new ProjectView({
                        model:project,
                        id:current
                    });
                    self.$el.append(view.render().el);
                });

                var selected = this.$el.val();

                if (selected && selected !== current) {
                    this.model.set({
                        selected:selected
                    });
                }
            }
        });

    return function (projects, projectID, releaseID, notesID) {
        var projectList = new ProjectListView({
                el:$(projectID),
                model:projects
            }),
            releaseList = new ReleaseListView({
                el:$(releaseID),
                model:projects.releases
            });

        return {
            projectList: projectList,
            releaseList: releaseList
        };
    };
});