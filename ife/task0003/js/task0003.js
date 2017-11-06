var singleton = function(fn) {
    var result;
    return function() {
        return result || ( result = fn.apply(this, arguments) );
    }
};

var createMask = singleton(function() {
    var mask = $('<div class="mask hide"></div>');
    $("body").append(mask);
    return mask;
});

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
    $inputClass = $newClass.find("input");

function hideMask() {
    $newClass.addClass("hide");
    $mask.addClass("hide");
    $inputClass.val("");
}

$inputClass.focus(function() {
    $inputClass.val("");
})

$mask.click(function() {
    hideMask();
})

$newClass.click(function() {
    event.stopPropagation();
    name = $(event.target).attr("name");
    if (name == "cancel") {
        hideMask();
    }
    else if (name == "confirm") {
        var value = $.trim($inputClass.val());
        if (!value) {
            $inputClass.val("输入不能为空");
            return;
        } 
        else if (value.length > 10) {
            $inputClass.val("输入字数不能超过10");
            return;
        }
        var newItem = '<li>'
                     +'<i class="fa fa-folder-open" aria-hidden="true"></i>'
                     +'<span>' + value + '</span>'
                     +'<i id="delete" class="fa fa-times hide" aria-hidden="true"></i>'
                     +'</li>';
        $classList.append(newItem);
        hideMask();
    }
})

$("#add-class").click(function() {
    $newClass.removeClass("hide");
    $mask.removeClass("hide");
})

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