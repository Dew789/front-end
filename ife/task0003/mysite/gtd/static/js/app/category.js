define(function(require) {
    var $ = require("jquery"),
        utils = require("utils"),
        current = require("app/current"),
        task = require("app/task"),
        widget = require("widget");

    var $classList = $("#class-list"),
        classList = $classList[0],
        $taskList = $("#tasks");

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
                var idName = current.$class.attr("class");
                function addSecondClass(result) {
                    var newItem = ''
                        + '<li class="second-class" pk="'+result+'">'
                        +     '<i class="fa fa fa-file-o" aria-hidden="true"></i>'+'\n'
                        +     '<span>' + value + '</span>'
                        +     '<span class="todo-count">(0)</span>'
                        +     '<i class="fa fa-times delete hide" aria-hidden="true"></i>'
                        + '</li>';
                    // 判断是否存在唯一ul子元素
                    if (current.$class.next().is("li") || !current.$class.next().html()) {
                        var newSubling = $('<ul class="second-class-wrap"></ul>');
                        newSubling.append(newItem);
                        current.$class.after(newSubling);
                    } 
                    else if (current.$class.next().is("ul")) {
                        current.$class.next().append(newItem);
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
                    current.$class.prepend(newItem);
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
                            topClass: current.$class.find("span:first").text()
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
                    task.clearContent();
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
                current.$class = $mainTarget;
                var classType = current.$class.attr("class"),
                    classid = current.$class.attr("pk");
                // Change "top-class" into "topclass" 
                classType = classType.split("-").join("");
                $.ajax(getTasks(classType, classid, "all"))
            }
    }
    
    classList.addEventListener("click", deleteClass, false);
    classList.addEventListener("click", getClassTasks, false);

    return {
        clearClassHl: clearClassHl,
        getTasks: getTasks
    }
});
