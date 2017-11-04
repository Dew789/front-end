var container = document.getElementById('container'),
    box1 = document.getElementById('box1'),
    box2 = document.getElementById('box2'),
    box1Left = box1.offsetLeft,
    box1Width = box1.offsetWidth,
    box2Left = box2.offsetLeft,
    box2Width = box2.offsetWidth,
    winW = document.documentElement.scrollWidth || document.body.scrollWidth,
    winH = document.documentElement.scrollHeight || document.body.scrollHeight,
    lastIndex = null,
    isHolder = false;

// Create placeholder
var placeHolder = document.createElement("li");
placeHolder.className = "holder";

container.onmousedown = function () {
    var event = event || window.event,
        target = event.target,
        copy = target.cloneNode(true);

    if (target.nodeName.toLowerCase() == "li") {
        var disX = event.clientX - target.offsetLeft,
            disY = event.clientY - target.offsetTop;
        // Stop
        document.onmousemove = function() {
            if (!isHolder) {
                // Set Placeholder
                target.parentNode.insertBefore(placeHolder, target);
                isHolder = true;
            }
            target.style.position = "absolute";
            var event = event || window.event;
            move(target, event, disX, disY);
        }
        // Move
        document.onmouseup = function() {
            if (isHolder) {
                target.parentNode.removeChild(target);
                // Replace Placeholder
                placeHolder.parentNode.replaceChild(copy, placeHolder);
                isHolder = false;
            }
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }
}

function swapNode(node1, node2) {
    node1Copy = node1.cloneNode(true);
    node1.parentNode.insertBefore(node2, node1);
    node1.parentNode.removeChild(node1);
    node2.parentNode.replaceChild(node1Copy, node2);
}

// Insert Placeholder
function inertHolder(box, t) {
    var top = box.offsetTop,
        item = box.getElementsByTagName('li');
    if (t > top) {
        var index = Math.ceil((t-top)/50);
        if (index != lastIndex) {
            box.insertBefore(placeHolder, item[index]);
            lastIndex = index;
        }
    } else if (t <= top) {
        box.insertBefore(placeHolder, item[0]);
        lastIndex = 0;
    }
}

function move(target, e, posX, posY) {
    var l = e.clientX - posX,
        t = e.clientY - posY,
        maxW = winW - target.offsetWidth,
        maxH = winH - target.offsetHeight;
    // Keep away from border
    if (l < 0) {
        l = 0;
    } else if ( l > maxW) {
        l = maxW;
    }
    if( t < 0){
        t = 0;
    } else if(t > maxH){
      t = maxH;
    }

    if ((box1Left-90)<l && l<(box1Left-90+box1Width)) {
        inertHolder(box1, t);
    } else if ((box2Left-90)<l && l<(box2Left-120+box2Width)) {
        inertHolder(box2, t);
    }

    target.style.left = l + 'px';
    target.style.top = t + 'px';
}
