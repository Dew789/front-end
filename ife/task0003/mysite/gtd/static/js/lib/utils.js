define(
    function(require) {
        var jQuery = require("jquery");
        // 交换类
        jQuery.fn.extend({
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

        return {
            getCookie: getCookie
        };
    }
);