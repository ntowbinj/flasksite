var visual = {
    resize: function()
    {
        return;
        alert('didnt return');
        var body = document.body,
            html = document.documentElement;

        var height = Math.max( body.scrollHeight, body.offsetHeight, 
                html.clientHeight, html.scrollHeight, html.offsetHeight );
        var middleHeight = document.getElementById('middle').style.height;
        document.getElementById('middle').style.height = height + 'px';
    },
    currentPage: function() {
        var title = "#" + $.trim($("title")[0].text);
        $(title).addClass("currentPage");
    }

}

    
