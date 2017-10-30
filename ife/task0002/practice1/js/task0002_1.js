window.onload = function(){
    var hobby = document.getElementsByTagName('textarea')[0],
        submit = document.getElementsByName('submit')[0],
        show = document.getElementById('show'),
        message = document.getElementById('mesg');

    function trim(str) {
        // your implement
        var re = /\s*(.+\S)\s*/;
        var result = re.exec(str);
        if (result) {
            return result[1];
        }
        return "";
    }

    hobby.onfocus = function() {
        this.value = "";
    }

    submit.onclick = function() {
        var content = trim(hobby.value);
        var value = content.split(/\n|\r|\r\n|\s+|\,|\，|\、|\;|\；/);
 
        if (value.length > 10 || content == "") {
            message.style.display = "block";
            return;
        } else {
            message.style.display = "none";
        }
        value = Array.from(new Set(value));

        var str = "";
        for (var i of value) {
            str = str + '<label><input type="checkbox"  />'+ i +'</label>';
        }
        show.innerHTML = str;
    }
}