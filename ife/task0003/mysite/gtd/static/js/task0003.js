require.config({
    baseUrl: "../static/js/lib",
});

require(["jquery", "widget", "utils"], function($, widget) {
    var $classList = $("#class-list"),
        classList = $classList[0],
        $taskList = $("#tasks"),
        taskList = $taskList[0],
        $currentClass = $classList,
        $currentTask = null,
        $content = $(".content"),
        $caption = $content.find(".caption"),
        $date = $content.find(".date"),
        $something = $content.find(".something"),
        $edit = $("#edit"),
        $done = $("#done"),
        old_content;

    // 触发遮罩以及添加面板
    $("#add-class").click(function() {
        event.stopPropagation();
        var $mask = widget.createMask(),
            $addClassPanel = widget.createClassPannel(),
            $inputName = $addClassPanel.find("input");
    
        $addClassPanel.removeClass("hide");
        $mask.removeClass("hide");
    
        function hideMask() {
            $addClassPanel.addClass("hide");
            $mask.addClass("hide");
            $inputName.val("");
            $mask.unbind();
            $inputName.unbind();
            $addClassPanel.unbind();
        }
    
        // 隐藏遮罩
        $mask.click(function() {
            hideMask();
        })
        
        // 清空输入文本
        $inputName.focus(function() {
            $inputName.val("");
        })
    
        // 添加新分类
        $addClassPanel.click(function() {
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
                var newItem = ''
                    + '<li class="second-class" pk="'+result+'">'
                    +     '<i class="fa fa fa-file-o" aria-hidden="true"></i>'+'\n'
                    +     '<span>' + value + '</span>'
                    +     '<span class="todo-count">(0)</span>'
                    +     '<i class="fa fa-times delete hide" aria-hidden="true"></i>'
                    + '</li>';
                // 判断是否存在唯一ul子元素
                if ($currentClass.next().is("li") || !$currentClass.next().html()) {
                    var newSubling = $('<ul class="second-class-wrap"></ul>');
                    newSubling.append(newItem);
                    $currentClass.after(newSubling);
                } 
                else if ($currentClass.next().is("ul")) {
                    $currentClass.next().append(newItem);
                }
                hideMask();
            }
            function addTopClass(result) {
                var newItem = ''
                 + '<li class="top-class" pk="'+result+'">'
                 +     '<i class="fa fa-folder-open" aria-hidden="true"></i>'+'\n'
                 +     '<span>' + value + '</span>'
                 +     '<span class="todo-count">(0)</span>'
                 +     '<i class="fa fa-times delete hide" aria-hidden="true"></i>'
                 + '</li>';
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
                        "X-CSRFTOKEN": utils.getCookie("csrftoken")
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
                        "X-CSRFTOKEN": utils.getCookie("csrftoken")
                    },
                    success: addSecondClass,
                    error: function(xhr) {
                        alert(xhr.responseText + "添加失败，请重试");
                    }
                })            
            }
            }
        })
    })

    // 显示以及移除删除按钮
    $classList.delegate("li", "mouseover", function() {
        var $del = $(this).find(".delete");
        $del.removeClass("hide");
    })
    
    $classList.delegate("li", "mouseout", function() {
        var $del = $(this).find('.delete');
        $del.addClass("hide");
    })

    // 清除类别中高亮状态
    function clearClassHl() {
        var $item = $classList.find("li");
        $item.css("background-color", "#f2f2f2");
    }

    $("body").click(function() {
        clearClassHl();
        $currentClass = $classList;
    })

    // 点击删除按钮删除类
    function deleteClass(event)  {
        event.stopPropagation();
        var $target = $(event.target);
        if ($target.is(".delete")) {
            var $classItem = $target.parent(),
                classid = $classItem.attr("pk"),
                idName = $classItem.attr("class");
    
            if (idName == "top-class") {
                function delTopClass() {
                    $.ajax({
                        url: "http://127.0.0.1:8000/gtd/topclass/"+classid+"/",
                        type: "DELETE",
                        headers: {
                            "X-CSRFTOKEN": utils.getCookie("csrftoken")
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
                widget.showDeletePannel(delTopClass);
            }
            else if (idName == "second-class") {
                function delSecClass() {
                    $.ajax({
                        url: "http://127.0.0.1:8000/gtd/secondclass/"+classid+"/",
                        type: "DELETE",
                        headers: {
                            "X-CSRFTOKEN": utils.getCookie("csrftoken")
                        },            
                        success: function() {
                            $classItem.remove();
                        },
                        error: function() {
                            alert("删除失败");
                        }
                    })
                }
                widget.showDeletePannel(delSecClass);  
            }
        }
    }

    function getTasks(classType, classid, contentType) {
        var type = classType?classType+"/":"task/";
            id = classid?classid+"/":"";
            cType = contentType?contentType+"/":"";
    
        var result  = {
            url: "http://127.0.0.1:8000/gtd/"+type+id+cType,
            type: "GET",
            success: function(result) {
                var handleList = "";
                $.each(result, function(date, tasks){
                    handleList = handleList + '<li class="date">' + date + '</li>'
                    for (var task of tasks) {
                        var head;
                        if (task[2]) {
                            head = '<li class="title" pk="'
                                + task[1]
                                + '"style="color: #32cd32">'
                        } 
                        else {
                            head = '<li class="title" pk="'+ task[1]+ '">'
                        }
                        handleList = handleList
                            + head
                            + task[0]
                            + '<i class="fa fa-times hide delete" aria-hidden="true"></i>'
                            + '</li>';
                    }
                });
                $taskList.html(handleList);
                clearContent();
            },
            error: function() {
                alert("显示失败");
            }
        }
        return result;
    }

    // 获取当前类的task项目
    function getClassTasks(event) {
        event.stopPropagation();
        var $target = $(event.target);
        if ($target.is(".delete")) {
            return;
        }
        $mainTarget = $target.is("li")?$target:$target.parent();
        if ($mainTarget.is("li")) {
            clearClassHl();
            $mainTarget.css("background-color", "#fff");
            $currentClass = $mainTarget;
            var classType = $currentClass.attr("class"),
                classid = $currentClass.attr("pk");
            // Change "top-class" into "topclass" 
            classType = classType.split("-").join("");
            $.ajax(getTasks(classType, classid, "all"))
        }
    }
    
    classList.addEventListener("click", deleteClass, false);
    classList.addEventListener("click", getClassTasks, false);


    // Handle部分
    function getCurrentTasksWithStatus(status) {
        var classType = $currentClass.attr("class"),
            classid = $currentClass.attr("pk");
        // Change "top-class" into "topclass" 
        classType = classType.split("-").join("");
        $.ajax(getTasks(classType, classid, status))
    }

    function clearStatusHl() {
        $(".status li").removeClass("select");
    }

    // 所有
    $("#all").click(function() {
        event.stopPropagation();
        if ($currentClass === $classList) {
            $.ajax(getTasks("", "", "all"))
            clearClassHl();
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
        if ($currentClass === $classList) {
            $.ajax(getTasks("", "", "todo"))
            clearClassHl();
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
        if ($currentClass === $classList) {
            $.ajax(getTasks("", "", "finish"))
            clearClassHl();
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
    
    function clearHandelHl() {
        var $item = $taskList.find(".title");
        $item.css("background-color", "#fff");
    }
    
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
                    $currentTask = $target;
                },
                error: function() {
                    alert("获取失败");
                }
            })
        }
    }
    
    taskList.addEventListener("click", deleteTask, false);
    taskList.addEventListener("click", getContent, false);
    
    // 任务部分
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

    // 点击新增任务按钮
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

    // 点击编辑任务按钮
    $edit.click(function() {
        event.stopPropagation();
        old_content = [$caption.text(), $date.text(), $something.text()];
        editStatus();
    })

    // 标记状态完成
    $done.click(function() {
        event.stopPropagation();
        var taskid = $currentTask.attr("pk"),
            $that = $(this);
        $.ajax({
            url: "http://127.0.0.1:8000/gtd/task/"+taskid+"/",
            type: "PUT",
            headers: {
                "X-CSRFTOKEN": utils.getCookie("csrftoken")
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
                            head = '<li class="title" pk="' 
                                + task[1] 
                                + '" style="color: #32cd32">'
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

    // 重新计算并在catalogry处显示未完成时间数
    function addTodoCount(classType, classid) {
        function addOne($item) {
            var count = $item.text().slice(1, -1);
            var newCount = parseInt(count) + 1;
            $item.text("("+newCount+")")
        }
        if (classType == "top-class") {
            var $top = $(".top-class[pk="+classid+"]").find(".todo-count");
            addOne($top);
        }
        else if (classType == "second-class") {
            var $secondItem = $(".second-class[pk="+classid+"]");
            var $second = $secondItem.find(".todo-count");
            var $top = $secondItem.parent().prev().find(".todo-count");
            addOne($top);
            addOne($second);
        }
        // 任务列表
        var $total = $(".header .todo-count");
        addOne($total);
    }

    // 确认修改并提交
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
                "X-CSRFTOKEN": utils.getCookie("csrftoken")
            },
            success: function(pk) {
                submitTasksModifyHandle(pk);
                addTodoCount(classType, classid);
                clearStatusHl();
                $("#all").addClass("select");
            },
            error: function(xhr) {
                alert(xhr.responseText + "添加失败，请重试");
            }
        })
    
        showStatus();
    })

    // 取消修改还原原内容
    $("#edit-cancel").click(function() {
        event.stopPropagation();
        $caption.text(old_content[0]);
        $date.text(old_content[1]);
        $something.text(old_content[2]);
        showStatus();
    })
    
    // 防止点击编辑状态的content,修改currentclass
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
    
    // 清除content区域中的内容和编辑图表
    function clearContent() {
        $caption.text("");
        $date.text("");
        $something.text("");
        $done.css("display", "none");
        $edit.css("display", "none");
    }
})
