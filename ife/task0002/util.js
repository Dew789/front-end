// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
    return Array.isArray(arr);
}

// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn) {
    return typeof fn == 'function';
}

// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、srcect对象。不会包含函数、正则对象等
function clonesrcect(src){ 
    var obj = src.constructor === Array ? [] : {}; 
    for(var i in src){ 
        if(src.hasOwnProperty(i)){ 
            obj[i] = typeof src[i] === "object" ? clonesrcect(src[i]) : src[i]; 
        }
    } 
    return obj;
} 

function clonesrcect2(src){ 
    var src = JSON.stringify(src); 
    var obj = JSON.parse(src); 
    return obj;
}

// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray_1(arr) {
    var r = arr.filter(function (element, index, self) {
        return self.indexOf(element) === index;
    });
    return r;
}

function uniqArray_2(arr) {
  const seen = new Map()
  return arr.filter((a) => !seen.has(a) && seen.set(a, 1))
}

function uniqArray_3(arr) {
  return Array.from(new Set(arr))
}

// 实现一个简单的trim函数，用于去除一个字符串，头部和尾部的空白字符
// 假定空白字符只有半角空格、Tab
// 练习通过循环，以及字符串的一些基本方法，分别扫描字符串str头部和尾部是否有连续的空白字符，并且删掉他们，最后返回一个完成去除的字符串
function simpleTrim(str) {
    // From start to end
    for (var i = 0; i < str.length; i++) {
        letter = str[i];
        if (letter !== ' ' && letter !== '	') {
            str = str.substring(i);
            break;
        }
    }
    // From end to start
    for (var i = str.length - 1; i >= 0; i--) {
        letter = str[i];
        if ( letter !== ' ' && letter !== '	') {
            str = str.substring(0, i+1);
            break;
        }
    }
    return str;
}

// 很多同学肯定对于上面的代码看不下去，接下来，我们真正实现一个trim
// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
// 尝试使用一行简洁的正则表达式完成该题目
function trim(str) {
    // your implement
    var re = /\s+(\S+)\s+/;
    var trim_str = re.exec(str)[1];
    return trim_str;
}

// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr, fn) {
    arr.map(fn);
}

// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj) {
    var count = 0;
    for (var i in obj) {
        count++;
    }
    return count;
}

// 判断是否为邮箱地址
function isEmail(emailStr) {
    var re = /^\S+@\S+\.com$/
    if (re.test(emailStr)) {
        console.log("It's email address.")
    } else {
        console.log("It's not email address.")
    }
}

// 判断是否为手机号
function isMobilePhone(phone) {
    var re = /^\d{11}$/
    if (re.test(phone)) {
        console.log("It's mobile munber.")
    } else {
        console.log("It's not mobile munber.")
    }
}

// 为element增加一个样式名为newClassName的新样式
function addClass(element, className) {
    element.classList.add(className);
}

// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
    element.classList.remove(className);
}

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
    if (element.parentNode === siblingNode.parentNode) {
        return true;
    }
    return false;
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    var position = element.getBoundingClientRect();
    return {'x': position.left, 'y': position.top};
}


// 实现一个简单的Query
function $(selector) {
    var id  = /^#(\S+)$/.exec(selector);
    var tag = /^[^#\[\.]\S*/.exec(selector);
    var cls = /^\.(\S+)$/.exec(selector);
    var attr = /^\[([^=]+)\]$/.exec(selector);
    var attr_value = /^\[(\S+)=(\S+)\]$/.exec(selector);
    var id_cls = /^#(\S+)\s+\.(\S+)/.exec(selector);

    if (id) {
        return document.getElementById(id[1]);
    } else if (tag) {
        return document.getElementsByTagName(tag)[0];
    } else if (cls) {
        var elements = document.getElementsByTagName("*");
        for (var ele of elements) {
            var ele_cls = ele.className.split(" ");
            if (ele_cls.indexOf(cls[1]) !== -1) {
                return ele;
            }
        }
    } else if (attr) {
        var elements = document.getElementsByTagName("*");
        for (var ele of elements) {
            if (ele.getAttribute(attr[1])) {
                return ele;
            }
        }
    } else if (attr_value) {
        var elements = document.getElementsByTagName("*");
        for (var ele of elements) {
            if (ele.getAttribute(attr_value[1]) === attr_value[2]) {
                return ele;
            }
        }
    } else if (id_cls) {
        var id_tag = document.getElementById(id_cls[1]);
        if (id_tag) {
            var elements = id_tag.getElementsByTagName("*");
            for (var ele of elements) {
                var ele_cls = ele.className.split(" ");
                if (ele_cls.indexOf(id_cls[2]) !== -1) {
                    return ele;
                }
            }
        }
    } else {
        return null;
    }
}


$.on = function(selector, event, listener) {
    element = $(selector);
    if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    } else if (element.attachEvent) {
        element.attachEvent('on'+event, listener);
    } else {
        element['on'+event] = listener;
    }
}

$.click = function(selector, listener) {
              element = $(selector);
              if (element.addEventListener) {
                  element.addEventListener('click', listener, false);
              } else if (element.attachEvent) {
                  element.attachEvent('onclick', listener);
              } else {    
                  element['onclick'] = listener;
              }
          }

$.un = function(selector, event, listener) {
           element = $(selector);
           if (element.removeEventListener) {
               element.removeEventListener(event, listener, false);
           } else if (element.detachEvent) {
               element.detachEvent('on'+event, listener);
           } else {
               element['on'+event] = null;
           }
       }

$.delegate = function(selector, tag, eventName, listener) {
                element = $(selector);
                $.on(element, eventName, function(){
                    var e = event || window.event;
                    var target = e.target ||e.srcElement;
                    if (target.tagName == tag) {
                        listener();
                    }
                })
             }
