var soundcloudIframes = {
    gray: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/114306377&amp;color=2040cd&amp;auto_play=false&amp;hide_related=false&amp;show_artwork=true&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false",
    kid: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/129879035&amp;color=2040cd&amp;auto_play=false&amp;hide_related=false&amp;show_artwork=true&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"
};

var soundcloudOrder = ['kid', 'gray'];

var config = {
    index: 0
};
var view = {
    init: function(){
        var prevnext = ['next', 'prev'];
        for(var i = 0; i<prevnext.length; i++){
            (function(i){
                dom[prevnext[i]].mouseover(function(){
                  $(this).find('img').attr('src', '/static/img/' + prevnext[i] + 'hover.png');
                });
                dom[prevnext[i]].mouseout(function(){
                  $(this).find('img').attr('src', '/static/img/' + prevnext[i] + '.png');
                });
            })(i);
        };
    },
    showSoundcloud: function(){
        dom.soundcloud.attr('src', soundcloudIframes[soundcloudOrder[config.index]]);
    }
};
var controller = {
    init: function(){
        dom.next.click(function(e){
            e.preventDefault();
            config.index++;
            config.index = config.index%soundcloudOrder.length;
            view.showSoundcloud();
        });
        dom.prev.click(function(e){
            e.preventDefault();
            config.index--;
            config.index = config.index%soundcloudOrder.length;
            view.showSoundcloud();
        });
    }
};
var dom;

function musicSetup(){
    dom = {
        next: $("#next"),
        prev: $("#prev"),
        soundcloud: $("#soundcloud")
    };
    controller.init();
    view.init();
    var src = soundcloudIframes['kid'];
    dom.soundcloud.attr('src', src);
}
