$(document).ready(function(){
    // Hide or show post list
    $("h3").click(function(){
        $("ul#poll_list").slideToggle();
    });
    // Count clieck
    num = 0;
    $("img.ac").click(function(){
        $("span.num").show();
        num += 1;
        $("span.num").text(num);
    });
    // Lucky function
    $("button#lucky").click(function(){
        $.get("/polls/lucky/",
            function(response){
                $('a#lucky_q').text(response.question_text);
                $('a#lucky_q').attr("href", response.question_url);
            });
    });
});

// 自定义ajax
function ajax(url, options) {
    var xhr = new XMLHttpRequest(), 
        sent = "";
    if (options.data) {
        var data = options.data;
        if (typeof data == "object") {
            for (var i in data) {
                sent = sent + i + data[i] + "&";
            }
            sent = sent.substring(0, sent.length-1);
        } else if (typeof data == "string") {
            sent = data;
        }
    }
    if (options.type == "get") {
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status==200 && options.onsuccess) {
                    options.onsuccess(xhr.responseText, xhr);
                } else if (options.onfail) {
                    options.onfail(xhr.responseText, xhr);
                }
            }
        }
        xhr.open("GET", url+sent, true);
        xhr.send();
    } else if (options.type == "post") {
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status==200 && options.onsuccess) {
                    options.onsuccess(xhr.responseText, xhr);
                } else if (options.onfail) {
                    options.onfail(xhr.responseText, xhr);
                }
            }
        }
        xhr.open("POST", url+sent, true);
        xhr.send(sent);
    }
}

// 使用示例：
ajax(
    'http://127.0.0.1:8000/polls/lucky/', 
    {
        type : "post",
        onsuccess: function (responseText, xhr) {
            console.log(responseText);
        },
        onfail: function(responseText, xhr) {
            console.log(responseText);
        }
    }
);