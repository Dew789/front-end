// 单例模式原形函数
var singleton = function(fn) {
    var result;
    return function() {
        return result || ( result = fn.apply(this, arguments) );
    }
};

// Get cookie
function getCookie(cookieName) {
    var re = new RegExp(cookieName + '=(.+?)(?:;|$)');
    value = re.exec(document.cookie)
    if (value){
        return value[1];
    }
    return "";
}

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
    $classList = $("#class-list"),
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

// 添加新类型
$newClass.click(function() {
    event.stopPropagation();
    var name = $(event.target).attr("name");
    if (name == "cancel") {
        hideMask();
    }
    else if (name == "confirm") {
        var value = $.trim($inputName.val());
        if (!value) {
            alert("输入不能为空");
            return;
        } 
        else if (value.length > 10) {
            alert("输入字数不能超过10");
            return;
        }
        var idName = $currentClass.attr("id");
        function addSecondClass(result) {
            var newItem = '<li id="second-class">'
                        +'<a style="display: none">'+ result +'</a>'
                        +'<i class="fa fa fa-file-o" aria-hidden="true"></i>'+'\n'
                        +'<span>' + value + '</span>'+'<span>(0)</span>'
                        +'<i id="delete" class="fa fa-times hide" aria-hidden="true"></i>'
                        +'</li>';
            // 判断是否存在唯一ul子元素
            if ($currentClass.next().is("li") || !$currentClass.next().html()) {
                var newSubling = $('<ul class="second-class-wrap"></ul>');
                newSubling.append(newItem);
                $currentClass.after(newSubling);
            } else if($currentClass.next().is("ul")) {
                $currentClass.next().append(newItem);
            }
            hideMask();
        }
        function addTopClass(result) {
            var newItem = '<li id="top-class">'
             +'<a style="display: none">'+ result +'</a>'
             +'<i class="fa fa-folder-open" aria-hidden="true"></i>'+'\n'
             +'<span>' + value + '</span>'+'<span>(0)</span>'
             +'<i id="delete" class="fa fa-times hide" aria-hidden="true"></i>'
             +'</li>';
            $currentClass.append(newItem);
            hideMask();
        }
        if (idName == "class-list") {
            $.ajax({
                url: "http://127.0.0.1:8000/gtd/topclass/",
                type: "POST",
                data: {
                    name: value
                },
                headers: {
                    "X-CSRFTOKEN": getCookie("csrftoken")
                },
                success: addTopClass,
                error: function(xhr) {
                    alert(xhr.responseText + "添加失败，请重试");
                }
            })
        }
        else if (idName == "top-class") {
            $.ajax({
                url: "http://127.0.0.1:8000/gtd/secondclass/",
                type: "POST",
                data: {
                    name: value,
                    topClass: $currentClass.find("span:first").text()
                },
                headers: {
                    "X-CSRFTOKEN": getCookie("csrftoken")
                },
                success: addSecondClass,
                error: function(xhr) {
                    alert(xhr.responseText + "添加失败，请重试");
                }
            })            
        }
    }
})

$("#add-class").click(function() {
    event.stopPropagation();
    $newClass.removeClass("hide");
    $mask.removeClass("hide");
})

// 显示删除按钮
$classList.delegate("li", "mouseover", function() {
    var $del = $(this).find("#delete");
    $del.removeClass("hide");
})

$classList.delegate("li", "mouseout", function() {
    var $del = $(this).find('#delete');
    $del.addClass("hide");
})

// 删除类别
$classList.delegate("#delete", "click", function() {
    event.stopPropagation();
    var $classItem = $(this).parent();
        classid = $classItem.find("a").text(),
        idName = $classItem.attr("id");

    if (idName == "top-class") {
        $.ajax({
            url: "http://127.0.0.1:8000/gtd/topclass/"+classid+"/",
            type: "DELETE",
            headers: {
                "X-CSRFTOKEN": getCookie("csrftoken")
            },            
            success: function() {
                $classItem.remove();
            },
            error: function() {
                alert("删除失败");
            }
        })
    }
    else if (idName == "second-class") {
        $.ajax({
            url: "http://127.0.0.1:8000/gtd/secondclass/"+classid+"/",
            type: "DELETE",
            headers: {
                "X-CSRFTOKEN": getCookie("csrftoken")
            },            
            success: function() {
                $classItem.remove();
            },
            error: function() {
                alert("删除失败");
            }
        })            
    }
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
var $content = $(".content"),
    $caption = $content.find(".caption"),
    $date = $content.find(".date"),
    $something = $content.find(".something"),
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

function showStatus() {
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
}

// 新增内容
$("#add-task").click(function() {
    event.stopPropagation();
    old_content = [$caption.text(), $date.text(), $something.text()];
    // Clear content
    $caption.text("");
    $date.text("截止日期:");
    $something.text("");
    editStatus();  
})

// 编辑任务
$("#edit").click(function() {
    event.stopPropagation();
    old_content = [$caption.text(), $date.text(), $something.text()];
    editStatus();
})

$("#edit-confirm").click(function() {
    event.stopPropagation();
    var caption = $caption.text(),
        duedate = $date.text(),
        content = $something.text(),
        idName = $currentClass.attr("id"),
        classid = $currentClass.find("a").text();

    $.ajax({
        url: "http://127.0.0.1:8000/gtd/task/",
        type: "POST",
        data: {
            caption: caption,
            duedate: duedate,
            content: content,
            idName: idName,
            classid: classid
        },
        headers: {
            "X-CSRFTOKEN": getCookie("csrftoken")
        },
        success: function() {
            alert("添加成功");
        },
        error: function(xhr) {
            alert(xhr.responseText + "添加失败，请重试");
        }
    })    
    showStatus();
})

$("#edit-cancel").click(function() {
    event.stopPropagation();
    $caption.text(old_content[0]);
    $date.text(old_content[1]);
    $something.text(old_content[2]);
    showStatus();
})

// 事件完成
$("#done").click(function() {
    event.stopPropagation();
    $(this).addClass("hide");
})