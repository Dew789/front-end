window.onload = function(){
    var btn = document.getElementById('submit'),
        time_input = document.getElementById('time'),
        count_down = document.getElementById('count-down');

    time_input.onfocus = function() {
        time_input.value = "";
    }

    function get_time(future) {
        var now = Date.now();
        var count = parseInt((future - now) / 1000);
        if (count <= 0) {
            return "时间到";
        }

        var remain;
        var day = parseInt(count / (60*60*24));
        remain = count % (60*60*24);
        var hour = parseInt(remain / (60*60));
        remain = remain % (60*60);
        var minute = parseInt(remain / 60);
        remain = remain % 60;
        var second = remain;

        return "还有"+day+"天"+hour+"小时"+minute+"分"+second+"秒";
    }

    btn.onclick = function() {
        var future = new Date(time_input.value+"T00:00:00");
        timer = setInterval(
            function(){
                var time = get_time(future);
                if (time === "时间到") {
                    clearInterval(timer);
                }
                count_down.innerHTML = time;
            }, 1000);
    }

}