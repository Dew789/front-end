define(function(require) {
    var $ = require("jquery"),
        utils = require("utils"),
        current = require("app/current"),
        task = require("app/task"),
        widget = require("widget");

    var $classList = $("#class-list"),
        classList = $classList[0],
        $taskList = $("#tasks"),
        taskList = $taskList[0];

    function clearHandelHl() {
        var $item = $taskList.find(".title");
        $item.css("background-color", "#fff");
    }

    // Handle部分
    function getCurrentTasksWithStatus(status) {
        var classType = current.$class.attr("class"),
            classid = current.$class.attr("pk");
        // Change "top-class" into "topclass" 
        classType = classType.split("-").join("");
        $.ajax(category.getTasks(classType, classid, status))
    }

    function clearStatusHl() {
        $(".status li").removeClass("select");
    }

    // 所有
    $("#all").click(function() {
        event.stopPropagation();
        if (current.$class[0] === $classList[0]) {
            $.ajax(category.getTasks("", "", "all"))
            category.clearClassHl();
        } 
        else {
            getCurrentTasksWithStatus("all");
        }
        clearStatusHl();
        $(this).addClass("select");
    })

    // 未完成
    $("#todo").click(function() {
        event.stopPropagation();
        if (current.$class[0] === $classList[0]) {
            $.ajax(category.getTasks("", "", "todo"))
            category.clearClassHl();
        }
        else {
            getCurrentTasksWithStatus("todo");
        }
        clearStatusHl();
        $(this).addClass("select");
    })

    // 已完成
    $("#finish").click(function() {
        event.stopPropagation();
        if (current.$class[0] === $classList[0]) {
            $.ajax(category.getTasks("", "", "finish"))
            category.clearClassHl();
        }
        else {
            getCurrentTasksWithStatus("finish");
        }
        clearStatusHl();
        $(this).addClass("select");
    })

    $taskList.delegate(".title", "mouseover", function() {
        var $del = $(this).find(".delete");
        $del.removeClass("hide");
    })
    
    $taskList.delegate(".title", "mouseout", function() {
        var $del = $(this).find('.delete');
        $del.addClass("hide");
    })
    
    // 删除任务
    function deleteTask(event) {
        event.stopPropagation();
        var $target = $(event.target);
        if ($target.is(".delete")) {
            var $taskItem = $target.parent(),
                taskid = $taskItem.attr("pk");
            function delTask() {
                $.ajax({
                    url: "http://127.0.0.1:8000/gtd/task/"+taskid+"/",
                    type: "DELETE",
                    headers: {
                        "X-CSRFTOKEN": utils.getCookie("csrftoken")
                    },
                    success: function() {
                        if (($taskItem.next().is(".date") || !$taskItem.next().html())
                            && $taskItem.prev().is(".date")) {
                            $taskItem.prev().remove();
                        }
                        $taskItem.remove();
                        // modifyTodoCount();
                    },
                    error: function() {
                        alert("删除失败");
                    }
                })
            }
            widget.showDeletePannel(delTask);
        }
    }
    
    // 获取任务
    function getContent(event) {
        event.stopPropagation();
        var $target = $(event.target);
        if ($target.is("li.title")) {
            var taskid = $target.attr("pk");
                $that = $target;
            $.ajax({
                url: "http://127.0.0.1:8000/gtd/task/"+taskid+"/",
                type: "GET",
                headers: {
                    "X-CSRFTOKEN": utils.getCookie("csrftoken")
                },            
                success: function(result) {
                    clearHandelHl();
                    // 显示编辑按钮
                    $done.css("display", "inline-block");
                    $edit.css("display", "inline-block");
    
                    $that.css("background-color", "#f2f2f2")
                    $caption.text(result.title);
                    $date.text("截止日期:"+result.date);
                    $something.text(result.content);
                    result.status?$done.addClass("hide"):$done.removeClass("hide");
                    current.$task = $target;
                },
                error: function() {
                    alert("获取失败");
                }
            })
        }
    }
    
    taskList.addEventListener("click", deleteTask, false);
    taskList.addEventListener("click", getContent, false);    

    return {
        clearHandelHl: clearHandelHl;
    };
});