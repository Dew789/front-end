require.config({
    baseUrl: "../static/js/lib/",

    paths: {
        app: '../app/'
    }
});

require(["jquery", "app/current", "app/task", "app/category"], function($, current, task, category) {
    $("body").click(function() {
        category.clearClassHl();
        current.$class = $classList;
    })
})
