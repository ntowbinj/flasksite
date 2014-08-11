
function blogSetup(){
    prettyPrint();
    $("iframe").each(function(){
        var src = $(this).attr('name');
        $(this).attr('src', src);
        $(this).attr('name', "");
    });
}
