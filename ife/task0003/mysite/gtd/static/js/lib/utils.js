define(function(require) {
    var $ = require("jquery");
    // 交换类
    $.fn.extend({
        replaceClass: function(cls1, cls2) {
            this.removeClass(cls1);
            this.addClass(cls2);
        }
    });

    // Get cookie
    function getCookie(cookieName) {
        var re = new RegExp(cookieName + '=(.+?)(?:;|$)');
        value = re.exec(document.cookie)
        if (value){
            return value[1];
        }
        return "";
    }

    // 重新计算并在catalogry处显示未完成时间数
    function modifyTodoCount(classType, classid, num) {
        function recount($item) {
            var count = $item.text().slice(1, -1);
            var newCount = parseInt(count) + num;
            $item.text("("+newCount+")")
        }
        if (classType == "top-class") {
            var $top = $(".top-class[pk="+classid+"]").find(".todo-count");
            recount($top);
        }
        else if (classType == "second-class") {
            var $secondItem = $(".second-class[pk="+classid+"]");
            var $second = $secondItem.find(".todo-count");
            var $top = $secondItem.parent().prev().find(".todo-count");
            recount($top);
            recount($second);
        }
        // 任务列表
        var $total = $(".header .todo-count");
        recount($total);
    }

    return {
        getCookie: getCookie,
        modifyTodoCount: modifyTodoCount
    };
});