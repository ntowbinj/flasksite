var visual = {
    resize: function()
    {
        browserversion= (function(){
        var ua= navigator.userAgent, tem, 
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
            return ['IE', (tem[1] || '')];
        }
        if(M[1]=== 'Chrome'){
            tem= ua.match(/\bOPR\/(\d+)/)
            if(tem!= null) return 'Opera '+tem[1];
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        return M;
        })();
        if(browserversion[0] == 'Firefox' && parseInt(browserversion[1]) >= 29){
            $('nav').removeClass("notBoxsized");
            $('nav').addClass("boxsized");
        }

    },
    currentPage: function() {
        var title = "#" + $.trim($("title")[0].text);
        $(title).addClass("currentPage");
    }

}

    
