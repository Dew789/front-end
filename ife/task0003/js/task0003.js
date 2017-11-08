// 单例模式原形函数
var singleton = function(fn) {
    var result;
    return function() {
        return result || ( result = fn.apply(this, arguments) );
    }
};

// 交换类
jQuery.fn.extend({
    replaceClass: function(cls1, cls2) {
        this.removeClass(cls1);
        this.addClass(cls2);
    }
});

// 创建遮罩
var createMask = singleton(function() {
    var mask = $('<div class="mask hide"></div>');
    $("body").append(mask);
    return mask;
});

// 创建新类面板
var createClass = singleton(function() {
    var $prompt = $('<div class="new-class hide">'
                    + '<p>输入新的分类:</p>'
                    + '<input type="text">'
                    + '<div>'
                    + '<span class="btn" name="confirm">确认</span>'
                    + '<span class="btn" name="cancel">取消</span>'
                    + '<div>'
                    + '</div>');
    $("body").append($prompt);
    return $prompt;
});

var $mask = createMask(),
    $newClass = createClass(),
    $classList = $("#level1Class"),
    $inputName = $newClass.find("input"),
    $currentClass = $classList;

// 显示遮罩并清除输入的新分类
function hideMask() {
    $newClass.addClass("hide");
    $mask.addClass("hide");
    $inputName.val("");
}

$inputName.focus(function() {
    $inputName.val("");
})

$mask.click(function() {
    hideMask();
})

// 点击确认添加新类
$newClass.click(function() {
    event.stopPropagation();
    var name = $(event.target).attr("name");
    if (name == "cancel") {
        hideMask();
    }
    else if (name == "confirm") {
        var value = $.trim($inputName.val());
        if (!value) {
            $inputName.val("输入不能为空");
            return;
        } 
        else if (value.length > 10) {
            $inputName.val("输入字数不能超过10");
            return;
        }
        // 判断一级还是二级类
        var idName = $currentClass.attr("id");
        if (idName == "level1Class") {
            var newItem = '<li id="level2Class">'
                         +'<i class="fa fa-folder-open" aria-hidden="true"></i>'
                         +'<span>' + value + '</span>'
                         +'<i id="delete" class="fa fa-times hide" aria-hidden="true"></i>'
                         +'</li>';
            $currentClass.append(newItem);
        } 
        else if (idName == "level2Class") {
            var newItem = '<li>'
                        +'<i class="fa fa fa-file-o" aria-hidden="true"></i>'
                        +'<span>' + value + '</span>'
                        +'<i id="delete" class="fa fa-times hide" aria-hidden="true"></i>'
                        +'</li>';
            // 判断是否存在唯一ul子元素，也可以用单例模式
            if ($currentClass.next().is("li") || !$currentClass.next().html()) {
                var newSubling = $('<ul id="level3Class"></ul>');
                newSubling.append(newItem);
                $currentClass.after(newSubling);
            } else if($currentClass.next().is("ul")) {
                $currentClass.next().append(newItem);
            }
        }
        hideMask();
    }
})

$("#add-class").click(function() {
    event.stopPropagation();
    $newClass.removeClass("hide");
    $mask.removeClass("hide");
})

// Hover任务列表显示删除按钮
$classList.delegate("li", "mouseover", function() {
    var $del = $(this).find('#delete'),
        $that = $(this);
    $del.removeClass("hide");
    $del.click(function() {
        $that.remove();
    })
})

$classList.delegate("li", "mouseout", function() {
    var $del = $(this).find('#delete');
    $del.addClass("hide");
})

// 清除类别中高亮状态
function clearHl() {
    var $item = $classList.find("li");
    $item.css("background-color", "#f2f2f2");
}

$classList.delegate("li", "click", function() {
    event.stopPropagation();    
    clearHl();
    $(this).css("background-color", "#fff");
    $currentClass = $(this);
})

$("body").click(function() {
    $currentClass = $classList;
    clearHl();
})

// 任务部分
var $caption = $(".caption"),
    $date = $(".date"),
    $something = $(".something"),
    $content = $(".content"),
    old_content;

function editStatus() {
    // Caption part
    $caption.replaceClass("caption", "edit-caption");
    $('.modify').addClass("hide");
    $caption.attr("contenteditable", "true");
    // Date part
    $date.replaceClass("date", "edit-date");
    $date.attr("contenteditable", "true");
    // text area
    $something.replaceClass("something", "edit-something");
    $something.attr("contenteditable", "true");
    // show Confirm footer
    $(".footer-confirm").removeClass("hide");    
}

// 新增内容
$("#add-task").click(function() {
    // Clear content
    $caption.text("");
    $date.html("截止日期:&nbsp;");
    $something.text("");
    old_content = $content.html();
    editStatus();
})

// 编辑任务
$("#edit").click(function() {
    old_content = $content.text();
    editStatus();
})

$("#edit-confirm").click(function() {
    // Caption
    $caption.replaceClass("edit-caption", "caption");
    $('.modify').removeClass("hide");
    $caption.attr("contenteditable", "false");
    // Date
    $date.replaceClass("edit-date", "date");
    $date.attr("contenteditable", "false"); 
    // Text area confirm
    $something.replaceClass("edit-something", "something");
    $something.attr("contenteditable", "false");
    // Hide confirm bar  
    $(".footer-confirm").addClass("hide");
})

$("#edit-cancel").click(function() {    
    $content.html(old_content);
    // Hide confirm bar  
    $(".footer-confirm").addClass("hide");    
})

// 完成
$("#done").click(function() {
    $(this).addClass("hide");
})