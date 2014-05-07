var visual = {
    resize: function()
    {
        var body = document.body,
            html = document.documentElement;

        var height = Math.max( body.scrollHeight, body.offsetHeight, 
                html.clientHeight, html.scrollHeight, html.offsetHeight );
        var middleHeight = document.getElementById('middle').style.height;
        document.getElementById('middle').style.height = height + 'px';
    }
}

    
