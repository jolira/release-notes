define(["underscore", "backbone", "jquery"], function (_, Backbone, $) {
    var Release = Backbone.Model.extend({}),
        ReleaseView = Backbone.View.extend({
            tagName:"option",
            template:_.template($('#project-template').html()),
            render:function () {
                var vals = this.model.toJSON();

                this.$el.html(vals.name);
                this.$el.val(vals.id);

                if (this.selected && this.selected == vals.id) {
                    this.$el.attr("selected", "true");
                }

                return this;
            }
        }),
        ReleaseList = Backbone.Collection.extend({
            initialize:function (models, options) {
                this.id = options.id;
            },
            model:Release,
            url:function () {
                if (!this.id) {
                    return "/releases"
                }
                return "/releases/" + this.id;
            }
        }),
        ReleaseListView = Backbone.View.extend({
            initialize:function () {
                this.model.bind('reset', this.addAll, this);
                this.model.fetch();
            },
            events:{
                "change":"selectRelease"
            },
            selectRelease:function () {
                var selected = this.$el.val();

                this.options.router.navigate(selected);
            },
            addAll:function () {
                this.$el.removeAttr("disabled");
                this.$el.find('option').remove();
                var self = this;

                this.model.each(function (project) {
                    var view = new ReleaseView({
                        model:project
                    });
                    view.selected = self.selected;
                    self.$el.append(view.render().el);
                });

                var selected = this.$el.val();

                if (selected && selected !== self.selected) {
                    this.options.router.navigate(selected);
                }
            },
            setSelected:function (release) {
                if (release !== this.selected) {
                    this.selected = release;
                }
            }
        }),
        Project = Backbone.Model.extend({}),
        ProjectView = Backbone.View.extend({
            tagName:"option",
            render:function () {
                var vals = this.model.toJSON();

                this.$el.html(vals.name);
                this.$el.val(vals.id);

                if (this.selected && this.selected == vals.id) {
                    this.$el.attr("selected", "true");
                }

                return this;
            }
        }),

        ProjectList = Backbone.Collection.extend({
            model:Project,
            url:'/projects'
        }),
        ProjectListView = Backbone.View.extend({
            events:{
                "change":"selectProject"
            },
            initialize:function () {
                this.model.bind('reset', this.addAll, this);
                this.model.fetch();
            },
            selectProject:function () {
                var selected = this.$el.val();

                this.options.router.navigate(selected);
            },
            addAll:function () {
                this.$el.removeAttr("disabled");
                this.$el.find('option').remove();
                var self = this;

                this.model.each(function (project) {
                    var view = new ProjectView({
                        model:project
                    });
                    view.selected = self.selected;
                    self.$el.append(view.render().el);
                });

                var selected = this.$el.val();

                if (selected && selected !== self.selected) {
                    this.options.router.navigate(selected);
                }
            },
            setSelected:function (project, release) {
                if (project !== this.selected) {
                    this.selected = project;

                    if (this.releaseListView) {
                        this.releaseListView.close();
                    }

                    var self = this;
                    this.releaseListView = new ReleaseListView({
                        el:$("#release"),
                        model:new ReleaseList(undefined, { id:project }),
                        router:{
                            navigate: function(selected) {
                                self.options.router.navigate(self.selected, selected);
                           }
                        }
                    });
                }
                this.releaseListView.setSelected(release);
            }
        }),
        projectListView;

    return function (router, project, release) {
        if (!projectListView) {
            projectListView = new ProjectListView({
                el:$("#project"),
                model:new ProjectList(),
                router:router
            });
        }

        projectListView.setSelected(project, release);
    };
});