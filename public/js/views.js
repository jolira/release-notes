define(["underscore", "backbone", "jquery"], function (_, Backbone, $) {
    var OptionView = Backbone.View.extend({
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
                this.model.bind('change:project', this.reload, this);
                this.model.fetch();
            },
            reload:function () {
                this.$el.attr("disabled", true);
                this.$el.find('option').remove();
                this.$el.append($("<option>Loading...</option>"))
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
                    var view = new OptionView({
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
        ProjectListView = Backbone.View.extend({
            events:{
                "change":"selectProject"
            },
            initialize:function () {
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
                    var view = new OptionView({
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