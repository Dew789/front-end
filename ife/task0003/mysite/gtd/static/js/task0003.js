require.config({
    baseUrl: "../static/js/lib",

    paths: {
        app: '../app'
    }
});

require(["app/current", "app/category", "app/handle", "app/task"],)
