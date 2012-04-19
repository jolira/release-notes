define(["underscore", "backbone", "jquery"], function (_, Backbone, $) {
    var ReleaseNotesView = Backbone.View.extend({
            initialize:function () {
                this.model.bind('reset', this.render, this);
                this.model.fetch();
            },
            template:_.template($('#project-template').html()),
            render:function () {
                return this;
            }
        });

    return function (project, release) {
        return new ReleaseNotesView({
            model:new ReleaseNotes({
                id: project + '/' + release
            })
        });
    };
});