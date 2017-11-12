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
        var idName = $currentClass.attr("class");
        function addSecondClass(result) {
            var newItem = '<li class="second-class" pk="'+result+'">'
                        +'<i class="fa fa fa-file-o" aria-hidden="true"></i>'+'\n'
                        +'<span>' + value + '</span>'+'<span>(0)</span>'
                        +'<i class="fa fa-times delete hide" aria-hidden="true"></i>'
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
            var newItem = '<li class="top-class" pk="'+result+'">'
             +'<i class="fa fa-folder-open" aria-hidden="true"></i>'+'\n'
             +'<span>' + value + '</span>'+'<span>(0)</span>'
             +'<i class="fa fa-times delete hide" aria-hidden="true"></i>'
             +'</li>';
            $currentClass.prepend(newItem);
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
    var $del = $(this).find(".delete");
    $del.removeClass("hide");
})

$classList.delegate("li", "mouseout", function() {
    var $del = $(this).find('.delete');
    $del.addClass("hide");
})

// 清除类别中高亮状态
function clearHl() {
    var $item = $classList.find("li");
    $item.css("background-color", "#f2f2f2");
}

$("body").click(function() {
    clearHl();
    $currentClass = $classList;
})

// 删除类别
function deleteClass(event)  {
    event.stopPropagation();
    var $target = $(event.target);
    if ($target.is(".delete")) {
        var $classItem = $target.parent(),
            classid = $classItem.attr("pk"),
            idName = $classItem.attr("class");

        if (idName == "top-class") {
            $.ajax({
                url: "http://127.0.0.1:8000/gtd/topclass/"+classid+"/",
                type: "DELETE",
                headers: {
                    "X-CSRFTOKEN": getCookie("csrftoken")
                },            
                success: function() {
                    if ($classItem.next().is("ul")) {
                        $classItem.next().remove();
                    }                
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
    }
}

function getClassTasks(event) {
    event.stopPropagation();
    var $target = $(event.target);
    if ($target.is(".delete")) {
        return;
    }
    $mainTarget = $target.is("li")?$target:$target.parent();
    if ($mainTarget.is("li")) {
        clearHl();
        $mainTarget.css("background-color", "#fff");
        $currentClass = $mainTarget;
        var classType = $currentClass.attr("class"),
            classid = $currentClass.attr("pk");
        // Change "top-class" into "topclass" 
        classType = classType.split("-").join("");
        $.ajax({
            url: "http://127.0.0.1:8000/gtd/"+classType+"/"+classid +"/"+"all/",
            type: "GET",
            success: function(result) {
                var content = "";
                $.each(result, function(date, tasks){
                    content = content + '<li class="date">' + date + '</li>'
                    for (var task of tasks) {
                        var head;
                        if (task[2]) {
                            head = '<li class="title" pk="'+ task[1]+ '"style="color: #32cd32">'
                        } 
                        else {
                            head = '<li class="title" pk="'+ task[1]+ '">'
                        }
                        content = content + head
                            + task[0]
                            + '<i class="fa fa-times hide delete" aria-hidden="true"></i>'
                            + '</li>';
                    }
                });
                $taskList.html(content);
                $caption.text("");
                $date.text("");
                $something.text("");
            },
            error: function() {
                alert("显示失败");
            }
        })
    }
}

// Jquery代理由于设计方式无法实现此功能
// 采用原生代理
var classList = $classList[0];
classList.addEventListener("click", deleteClass, false);
classList.addEventListener("click", getClassTasks, false);


// Handle部分
function getCurrentTasksWithStatus(status) {
    var classType = $currentClass.attr("class"),
        classid = $currentClass.attr("pk");
    // Change "top-class" into "topclass" 
    classType = classType.split("-").join("");
    $.ajax({
        url: "http://127.0.0.1:8000/gtd/"+classType+"/"+classid +"/"+status+"/",
        type: "GET",
        success: function(result) {
            var content = "";
            $.each(result, function(date, tasks){
                content = content + '<li class="date">' + date + '</li>'
                for (var task of tasks) {
                    var head;
                    if (task[2]) {
                        head = '<li class="title" pk="' + task[1]+ '" style="color: #32cd32">'
                    } 
                    else {
                        head = '<li class="title" pk="' + task[1] +'">'
                    }
                    content = content + head
                        + task[0]
                        + '<i class="fa fa-times hide delete" aria-hidden="true"></i>'
                        + '</li>';
                }
            });
            $taskList.html(content);
        },
        error: function() {
            alert("显示失败");
        }
    })
}

function clearStatusHl() {
    $(".status li").removeClass("select");
}

$("#all").click(function() {
    event.stopPropagation();
    if ($currentClass === $classList) {
        $("#default").trigger("click");
        clearHl();
        $("#default").css("background-color", "#fff")
    } 
    else {
        $currentClass.trigger("click");
    }
    clearStatusHl();
    $(this).addClass("select");
})

$("#todo").click(function() {
    event.stopPropagation();
    if ($currentClass === $classList) {
        $currentClass = $("#default");
        $currentClass.css("background-color", "#fff");
    } 
    getCurrentTasksWithStatus("todo");
    clearStatusHl();
    $(this).addClass("select");
})

$("#finish").click(function() {
    event.stopPropagation();
    if ($currentClass === $classList) {
        $currentClass = $("#default");
        $currentClass.css("background-color", "#fff");
    } 
    getCurrentTasksWithStatus("finish");
    clearStatusHl();
    $(this).addClass("select");
})

var $taskList = $("#tasks");

$taskList.delegate("li.title", "mouseover", function() {
    var $del = $(this).find(".delete");
    $del.removeClass("hide");
})

$taskList.delegate("li.title", "mouseout", function() {
    var $del = $(this).find('.delete');
    $del.addClass("hide");
})

function clearHandelHl() {
    var $item = $taskList.find("li.title");
    $item.css("background-color", "#fff");
}

var $currentTask = null;

function deleteTask(event) {
    event.stopPropagation();
    var $target = $(event.target);
    if ($target.is(".delete")) {
        var $taskItem = $target.parent();
            taskid = $taskItem.attr("pk"),
        $.ajax({
            url: "http://127.0.0.1:8000/gtd/task/"+taskid+"/",
            type: "DELETE",
            headers: {
                "X-CSRFTOKEN": getCookie("csrftoken")
            },            
            success: function() {
                if (($taskItem.next().is(".date") || !$taskItem.next().html())
                    && $taskItem.prev().is(".date")) {
                    $taskItem.prev().remove();
                }
                $taskItem.remove();
            },
            error: function() {
                alert("删除失败");
            }
        })
    }
}

function getTask(event) {
    event.stopPropagation();
    var $target = $(event.target);
    if ($target.is("li.title")) {
        var taskid = $target.attr("pk");
            $that = $target;
        $.ajax({
            url: "http://127.0.0.1:8000/gtd/task/"+taskid+"/",
            type: "GET",
            headers: {
                "X-CSRFTOKEN": getCookie("csrftoken")
            },            
            success: function(result) {
                clearHandelHl();
                $that.css("background-color", "#f2f2f2")
                $caption.text(result.title);
                $date.text("截止日期:"+result.date);
                $something.text(result.content);
                result.status?$("#done").addClass("hide"):$("#done").removeClass("hide");
                $currentTask = $target;
            },
            error: function() {
                alert("获取失败");
            }
        })
    }
}

// Jquery代理由于设计方式无法实现此功能
// 采用原生代理
var taskList = $taskList[0];
taskList.addEventListener("click", deleteTask, false);
taskList.addEventListener("click", getTask, false);


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
    clearHandelHl();
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

function submitTasksModifyHandle(pk) {
    var classType = $currentClass.attr("class"),
        classid = $currentClass.attr("pk");
    // Change "top-class" into "topclass" 
    classType = classType.split("-").join("");
    $.ajax({
        url: "http://127.0.0.1:8000/gtd/"+classType+"/"+classid +"/"+"all/",
        type: "GET",
        success: function(result) {
            var content = "";
            $.each(result, function(date, tasks){
                content = content + '<li class="date">' + date + '</li>'
                for (var task of tasks) {
                    var head;
                    if (task[2]) {
                        head = '<li class="title" pk="' + task[1]+ '" style="color: #32cd32">'
                    } 
                    else {
                        head = '<li class="title" pk="' + task[1] +'">'
                    }
                    content = content + head
                        + task[0]
                        + '<i class="fa fa-times hide delete" aria-hidden="true"></i>'
                        + '</li>';
                }
            });
            $taskList.html(content);
            for (var item of $("#tasks").find("li.title")) {
                if ($(item).attr("pk") == pk) {
                    $currentTask = $(item);
                }
            }
            clearHandelHl();
            $currentTask.css("background-color", "#f2f2f2");
        },
        error: function() {
            alert("显示失败");
        }
    })
}

$("#edit-confirm").click(function() {
    event.stopPropagation();
    var caption = $caption.text(),
        duedate = $date.text(),
        content = $something.text(),
        classType = $currentClass.attr("class"),
        classid = $currentClass.attr("pk");

    if ($currentClass == $classList) {
        $currentClass = $("#default");
        classType = "top-class"
        classid = 1;
    }

    $.ajax({
        url: "http://127.0.0.1:8000/gtd/task/",
        type: "POST",
        data: {
            caption: caption,
            duedate: duedate,
            content: content,
            classType: classType,
            classid: classid
        },
        headers: {
            "X-CSRFTOKEN": getCookie("csrftoken")
        },
        success: function(pk) {
            submitTasksModifyHandle(pk);
            clearStatusHl();
            $("#all").addClass("select");
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

// 修改时间状态为完成
$("#done").click(function() {
    event.stopPropagation();
    var taskid = $currentTask.attr("pk"),
        $that = $(this);
    $.ajax({
        url: "http://127.0.0.1:8000/gtd/task/"+taskid+"/",
        type: "PUT",
        headers: {
            "X-CSRFTOKEN": getCookie("csrftoken")
        },          
        success: function() {
            $currentTask.css("color", "#32cd32");
            $that.addClass("hide");
        },
        error: function() {
            alert("修改状态失败");
        }
    })
})

// 防止编辑状态修改current_class
$(".caption").click(function() {
    if ($(this).attr("contenteditable")) {
        event.stopPropagation()
    }
})

$(".date").click(function() {
    if ($(this).attr("contenteditable")) {
        event.stopPropagation()
    }
})

$(".something").click(function() {
    if ($(this).attr("contenteditable")) {
        event.stopPropagation()
    }
})
