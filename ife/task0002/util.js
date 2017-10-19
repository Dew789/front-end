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
}

// 使用示例
var str = '   hi!  ';
str = simpleTrim(str);
console.log(str); // 'hi!'

