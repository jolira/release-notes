define(["underscore", "backbone", "jquery"], function (_, Backbone, $) {
    // Model
    // ----------
    var Project = Backbone.Model.extend({
        // read-only
    });

    // Collection
    // ---------------
    var ProjectList = Backbone.Collection.extend({
        model:Project,
        url:'/projects'
    });

    // Project View
    // --------------
    var ProjectView = Backbone.View.extend({
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
        }
    });

    // Project List View
    // --------------
    var ProjectListView = Backbone.View.extend({
        initialize:function () {
            this.model.bind('reset', this.addAll, this);
            this.model.fetch();
        },

        addOne:function (todo) {
            var view = new TodoView({model:todo});
            this.$("#todo-list").append(view.render().el);
        },

        // Add all items in the **Todos** collection at once.
        addAll:function () {
            Todos.each(this.addOne);
        }
    });

    return function () {
        return new ProjectListView({ model:new ProjectList() })
    };
});