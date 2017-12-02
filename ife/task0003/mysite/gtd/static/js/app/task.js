define(function(require, exports) {
    var $ = require("jquery"),
        utils = require("utils"),
        widget = require("widget"),
        handle = require("app/handle"),
        category = require("app/category"),
        current = require("app/current");

    var $content = $(".content"),
        $caption = $content.find(".caption"),
        $date = $content.find(".date"),
        $something = $content.find(".something"),
        $edit = $("#edit"),
        $done = $("#done"),
        $classList = $("#class-list"),
        $taskList = $("#tasks"),
        addFlag,
        old_content;      

    // 防止点击编辑状态的content,修改currentclass
    $caption.click(function() {
        if ($(this).attr("contenteditable")) {
            event.stopPropagation()
        }
    })
        
    $date.click(function() {
        if ($(this).attr("contenteditable")) {
            event.stopPropagation()
        }
    })
        
    $something.click(function() {
        if ($(this).attr("contenteditable")) {
            event.stopPropagation()
        }
    })

    // 清除content区域中的内容和编辑图表
    function clearContent() {
        $caption.text("");
        $date.text("");
        $something.text("");
        showStatus();
        $(".modify").addClass("hide");
    }

    // 取消修改还原原内容
    $("#edit-cancel").click(function() {
        event.stopPropagation();
        $caption.text(old_content[0]);
        $date.text(old_content[1]);
        $something.text(old_content[2]);
        if ($('.modify').hasClass("hide")) {
            showStatus();
            $(".modify").addClass("hide");
        }
        else {
            showStatus();
        }
    })

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

    function submitTasksModifyHandle(pk) {
        var classType = current.$class.attr("class"),
            classid = current.$class.attr("pk");
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
                            head = '<li class="title" pk="' 
                                + task[1] 
                                + '" style="color: #32cd32">'
                        } 
                        else {
                            head = '<li class="title" pk="' + task[1] +'">'
                        }
                        content = content + head
                             + '<span>' + task[0] + '</span>'
                            + '<i class="fa fa-times hide delete" aria-hidden="true"></i>'
                            + '</li>';
                    }
                });
                $taskList.html(content);
                handle.clearStatusHl();
                handle.clearHandelHl();
                $("#all").addClass("select");
                current.$task = $("#tasks").find("li.title[pk="+pk+"]");
                current.$task.css("background-color", "#f2f2f2");
            },
            error: function() {
                alert("显示失败");
            }
        })
    }

    // 确认修改并提交
    $("#edit-confirm").click(function() {
        event.stopPropagation();
        var caption = utils.removeHtmlTag($caption.text()),
            duedate = utils.removeHtmlTag($date.text()),
            content = utils.removeHtmlTag($something.text()),
            classType = current.$class.attr("class"),
            classid = current.$class.attr("pk");

        if (current.$class[0] == $classList[0]) {
            current.$class = $("#default");
            classType = "top-class"
            classid = 1;
        }
        $caption.text(caption);
        $date.text(duedate);
        $something.text(content);
        showStatus();
        if (addFlag) {
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
                    "X-CSRFTOKEN": utils.getCookie("csrftoken")
                },
                success: function(pk) {
                    $done.removeClass("hide");
                    submitTasksModifyHandle(pk);
                    utils.modifyTodoCount(classType, classid, 1);
                },
                error: function(xhr) {
                    alert(xhr.responseText + "添加失败，请重试");
                    editStatus();
                }
            })
        }
        else {
            var taskid = current.$task.attr("pk");
            $.ajax({
                url: "http://127.0.0.1:8000/gtd/task/"+taskid+"/",
                type: "PUT",
                data: {
                    caption: caption,
                    duedate: duedate,
                    content: content
                },
                headers: {
                    "X-CSRFTOKEN": utils.getCookie("csrftoken")
                },
                success: function() {
                    var editItem = $taskList.find("li[pk="+taskid+"]");
                    editItem.first("span").text(caption);
                },
                error: function(xhr) {
                    alert(xhr.responseText + "修改失败，请重试");
                    editStatus();
                }
            })
        }
    })

    // 点击编辑任务按钮
    $edit.click(function() {
        addFlag = false;
        event.stopPropagation();
        old_content = [$caption.text(), $date.text(), $something.text()];
        editStatus();
    })

    // 标记状态完成
    $done.click(function() {
        event.stopPropagation();
        var taskid = current.$task.attr("pk"),
            $that = $(this);    
        $.ajax({
            url: "http://127.0.0.1:8000/gtd/task/"+taskid+"/",
            type: "PUT",
            data: {status: true},
            headers: {
                "X-CSRFTOKEN": utils.getCookie("csrftoken")
            },
            success: function(result) {
                current.$task.css("color", "#32cd32");
                $that.addClass("hide");
                utils.modifyTodoCount(
                    result.class_type, result.class_id, -1);
            },
            error: function() {
                alert("修改状态失败");
            }
        })
    })

    // 点击新增任务按钮
    $("#add-task").click(function() {
        addFlag = true;
        event.stopPropagation();
        handle.clearHandelHl();
        old_content = [$caption.text(), $date.text(), $something.text()];
        // Clear content
        $caption.text("");
        $date.text("截止日期:");
        $something.text("");
        editStatus();
    })    

    exports.clearContent = clearContent;
    exports.old_content = old_content;
    exports.editStatus = editStatus;
    exports.showStatus = showStatus;
});
