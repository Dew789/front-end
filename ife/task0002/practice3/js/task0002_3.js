var list = document.getElementById('list'),
    buttonBlock = document.getElementById('btn'),
    container = document.getElementById('container'),
    index = 0,
    timer;

var buttons = buttonBlock.getElementsByTagName('span');

function getStyle(element, attr) {
    if(element.currentStyle) {
        return element.currentStyle[attr];
    } else {
        return getComputedStyle(element, false)[attr];
    }
}

function setBtn() {
    for (var button of buttons ) {
        if (button.className == "on") {
            button.className = "";
        }
    }
    buttons[index].className = "on";
}

function move(forward, circle) {
    var newLeft = parseInt(getStyle(list, "left"));
    if (forward > 0) {
        index += forward;
        console.log(forward)
        newLeft = newLeft - 440*forward;
        if (index == 5) {
            if (circle) {
                index = 0;
                newLeft = 0;
            } else {
                return;
            }
        } 
    } else if (forward < 0) {
        index += forward;
        newLeft = newLeft - 440*forward;
        if (index == -1) {
            if (circle) {
                index = 4;
                newLeft = -1760;
            } else {
                return;
            }
        } 
    }
    setBtn();
    list.style.left = newLeft + "px";
}

function play(interval, forward, circle) {
    function roll() {
        move(forward, circle);
    }
    timer = setInterval(roll, interval);
}

function stop(){
    clearInterval(timer);
}

buttonBlock.onclick = function(){
    event = event || window.event;
    target = event.target;
    if (target.tagName.toLowerCase() == "span") {
        span = target.getAttribute("index") - index;
        move(span, false);
    }
}

function run() {
    play(1000, -1, true)
}

container.onmouseover = stop;
container.onmouseout = run;

run();