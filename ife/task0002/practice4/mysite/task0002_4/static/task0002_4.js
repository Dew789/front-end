var search = document.getElementById('search'),
    suggest = document.getElementById('suggest'),
    container = document.getElementById('container'),
    result = "",
    index = -1,
    shown = false;

function getCookie(cookieName) {
    var re = new RegExp(cookieName + '=(.+?)(?:;|$)');
    value = re.exec(document.cookie)
    if (value){
        return value[1];
    }
    return "";
}

function ajax(url, options) {
    var xhr = new XMLHttpRequest(), 
        sent = "";
    if (options.data) {
        var data = options.data;
        if (typeof data == "object") {
            for (var i in data) {
                sent = sent + i + data[i] + "&";
            }
            sent = sent.slice(0, -1);
        } else if (typeof data == "string") {
            sent = data;
        }
    }
    if (options.type == "get") {
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status==200) {
                    options.onsuccess && options.onsuccess(xhr.responseText, xhr);
                } else{
                    options.onfail && options.onfail(xhr.responseText, xhr);
                }
            }
        }
        xhr.open("GET", url+"?"+sent, true);
        xhr.send();
    } else if (options.type == "post") {
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status==200) {
                    options.onsuccess && options.onsuccess(xhr.responseText, xhr)
                } else{
                    options.onfail && options.onfail(xhr.responseText, xhr)
                }
            }
        }
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        // Django CSRF
        xhr.setRequestHeader("X-CSRFTOKEN", getCookie("csrftoken"));
        xhr.send(sent);
    }
}

search.oninput = function() {
    var content = search.value
        inner = "";

    options= {
        data : `input=${content}`,
        type : "post",
        onsuccess: show
    }
    function show(response, xhr) {
        suggest.style.display = "none";
        result = JSON.parse(response);
        if (shown) {
            var list = suggest.getElementsByTagName("li");
            for (var i = 0; i <= 5; i++) {
                list[i].innerHTML = result.hint[i];
            }
        } else {
            for (var i = 0; i <= 5; i++) {
                inner = inner + `<li index="${i}">${result.hint[i]}</li>`;
                suggest.innerHTML = inner;
            }
            shown = true;
        }
        if (content) {
            suggest.style.display = "block";
        } else {
            suggest.style.display = "none";
        }
    }
    ajax("http://127.0.0.1:8000/task0002_4/suggest", options)
}

search.onfocus =function() {
    var content = search.value;
    if (shown && content) {
        suggest.style.display = "block";
    }
}

search.onclick =function() {
    var event = event || window.event;
    event.stopPropagation?event.stopPropagation():event.cancelBubble=true;
}

function restA(){
    if (index != -1) {
        item = suggest.getElementsByTagName('li')[index];
        item.style.backgroundColor = "#FFF";
    }
}

function resetM(){
    suggest.style.display = "none";
    restA();
    index = -1;
}

suggest.onclick = function() {
    var event = event || window.event;
    event.stopPropagation?event.stopPropagation():event.cancelBubble=true;
    var target = event.target;
    if (target.nodeName.toLowerCase() == "li") {
        search.value = target.innerHTML;
        resetM();
    }
}

suggest.onmouseover = function() {
    var event = event || window.event;
    var target = event.target;
    if (target.nodeName.toLowerCase() == "li") {
        restA();
        target.style.backgroundColor = "#DCDCDC";
        index = target.getAttribute('index');
    }
}

suggest.onmouseout = function() {
    var event = event || window.event;
    var target = event.target;
    if (target.nodeName.toLowerCase() == "li") {
        target.style.backgroundColor = "#FFF";
    }
}

document.onclick = function() {
    resetM();
}

document.onkeydown = function() {
    var event = event || window.event;
    if (suggest.style.display == "block") {
        if (event.keyCode == 38) {
            restA();
            index--;
            if (index < 0) {
                index = 5;
            }
            item = suggest.getElementsByTagName('li')[index];
            item.style.backgroundColor = "#DCDCDC";
            search.value = item.innerHTML;
        } else if(event.keyCode == 40) {
            restA();
            index++;
            if (index > 5) {
                index = 0;
            }
            item = suggest.getElementsByTagName('li')[index];
            item.style.backgroundColor = "#DCDCDC";
            search.value = item.innerHTML;
        } else if(event.keyCode == 13) {
            item = suggest.getElementsByTagName('li')[index];
            search.value = item.innerHTML;
            resetM();
        }
    }
}