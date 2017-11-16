define(function(require) {
    var $  = require("jquery");

    // 单例模式原形函数
    var singleton = function(fn) {
        var result;
        return function() {
            return result || ( result = fn.apply(this, arguments) );
        }
    };

    // 创建遮罩
    var createMask = singleton(function() {
        var $html = $('<div class="mask hide"></div>');
        $("body").append($html);
        return $html;
    });

    // 创建新类面板
    var createClassPannel = singleton(function() {
        var html = [
            '<div class="new-class hide">',
                '<p>输入新的分类:</p>',
                '<input type="text">',
                '<div>',
                    '<span class="btn" name="confirm">确认</span>',
                    '<span class="btn" name="cancel">取消</span>',
                    '<div>',
            '</div>'
        ];
        var $html = $(html.join(''));
        $("body").append($html);
        return $html;
    });

    // 创建删除面板
    var createDeletePannel = singleton(function() {
        var html = [
            '<div class="deletePannel">',
                '<p class="move-area">删除</p>',
                '<p class="message">确认删除？</p>',
                '<div>',
                    '<span class="btn" name="confirm">确认</span>',
                    '<span class="btn" name="cancel">取消</span>',
                '</div>',
            '</div>'
        ];
        var $html = $(html.join(""));
        $("body").append($html);
        return $html;
    });

    // 显示删除面板
    function showDeletePannel(deleteFn) {
        var $deletePannel = createDeletePannel(),
            $moveArea = $deletePannel.find('.move-area'),
            $confirm = $deletePannel.find('.btn[name=confirm]'),
            $cancel = $deletePannel.find('.btn[name=cancel]');
        $deletePannel.removeClass("hide");

        // 防止对外界影响
        $deletePannel.click(function() {
            event.stopPropagation();
        })

        $moveArea.mousedown(function(event) {
            // 光标按下时光标和面板之间的距离
            var disX = event.pageX - $deletePannel.offset().left,
                disY = event.pageY - $deletePannel.offset().top;
            // 移动
            $(document).mousemove(function(event) {
                fnMove(event, disX, disY);
            })
            // 释放鼠标
            $(document).mouseup(function() {
                $(document).unbind("mousemove");
                $(document).unbind("mouseup");
            })
        })
        function fnMove(e, posX, posY){
            var l = e.pageX - posX,
                t = e.pageY - posY,
                winW = document.documentElement.scrollWidth || document.body.scrollWidth,
                winH = document.documentElement.scrollHeight || document.body.scrollHeight,
                maxW = winW - $deletePannel.outerWidth(),
                maxH = winH - $deletePannel.outerHeight();
            if (l < 0) {
                l = 0;
            }
            else if (l > maxW) {
                l = maxW;
            }
            if ( t < 0 ) {
                t = 0;
            }
            else if(t > maxH){
              t = maxH;
            }
            $deletePannel.css("left", l+"px");
            $deletePannel.css("top", t+"px");
        }
        function reset() {
            $moveArea.unbind("mousedown");
            $deletePannel.addClass("hide");
            $confirm.unbind();
            $cancel.unbind();
            $deletePannel.css("left", "530px");
            $deletePannel.css("top", "250px");
        }
        $confirm.click(function() {
            deleteFn();
            reset();
        });
        $cancel.click(function() {
            reset();
        })
    }

    return {
        createMask: createMask,
        createClassPannel, createClassPannel,
        showDeletePannel, showDeletePannel
    };
});
