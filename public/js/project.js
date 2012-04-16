define(["underscore", "backbone", "jquery"], function (_, Backbone, $) {
    var Release = Backbone.Model.extend({});
    var ReleaseView = Backbone.View.extend({
        tagName:"li",
        template:_.template($('#project-template').html()),
        events:{
            "click":"viewNotes"
        },
        render:function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));
            this.input = this.$('.edit');
            return this;
        },
        viewNotes:function () {

        }
    });
    var ReleaseList = Backbone.Collection.extend({
        model:Release,
        url:'/releases'
    });
    var ReleaseListView = Backbone.View.extend({
        initialize:function () {
            this.model.bind('reset', this.addAll, this);
            this.model.fetch();
        },
        addAll:function () {
            this.model.each(function (release) {
                var view = new ReleaseView({model:project});
                this.$("#release-list").append(view.render().el);
            });
        }
    });

    var Project = Backbone.Model.extend({
        // read-only
    });

    var ProjectView = Backbone.View.extend({
        tagName:"option",
        render:function () {
            var vals = this.model.toJSON();

            this.$el.value = vals.id;
            this.$el.html(vals.name);

            return this;
        }
    });

    var ProjectList = Backbone.Collection.extend({
        model:Project,
        url:'/projects'
    });

    var ProjectListView = Backbone.View.extend({
        el: $("select"),
        initialize:function () {
            this.model.bind('reset', this.addAll, this);
            this.model.fetch();
        },
        addAll:function () {
            var self = this;
            self.$el.removeAttr("disabled");
            self.$el.find('option').remove();

            this.model.each(function (project) {
                var view = new ProjectView({model:project});
                self.$el.append(view.render().el);
            });
        }
    });

    return function () {
        return new ProjectListView({
            model:new ProjectList()
        })
    };
});