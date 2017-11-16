define(
    function(require) {
        var $ = require("jquery");

        var $class = $("#class-list"),
            $task = null;

        return {
            $class: $class,
            $task: $task
        }
    }
)
