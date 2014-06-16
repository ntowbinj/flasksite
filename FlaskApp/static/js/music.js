var soundcloudIframes = {
    gray: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/114306377&amp;color=2040cd&amp;auto_play=false&amp;hide_related=false&amp;show_artwork=true&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false",
    kid: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/129879035&amp;color=2040cd&amp;auto_play=false&amp;hide_related=false&amp;show_artwork=true&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"
};
var youtubeIframes = {
    thomas: "//www.youtube.com/embed/66CApDQ_nBU",
    kid: "//www.youtube.com/embed/IgjXhG8g1CI",
    blimp: "//www.youtube.com/embed/ukNejCx57uo"
}

var orders = {
    sound: ['kid', 'gray'],
    yout: ['thomas', 'blimp', 'kid'],
};

var config = {
    indexes: {sound: 0, yout: 0}
};
var view = {
    init: function(){
        $("a.prev").each(function(){
            $(this).find('img').mouseover(function(){
                $(this).attr('src', '/static/img/prevhover.png');
            });
            $(this).find('img').mouseout(function(){
                $(this).attr('src', '/static/img/prev.png');
            });
        });
        $("a.next").each(function(){
            $(this).find('img').mouseover(function(){
                $(this).attr('src', '/static/img/nexthover.png');
            });
            $(this).find('img').mouseout(function(){
                $(this).attr('src', '/static/img/next.png');
            });
        });
        for(var i in this.show){
            this.show[i]();
        }
    },
    show: {
        sound: function(){
            dom.soundcloud.attr('src', soundcloudIframes[orders['sound'][config.indexes.sound]]);
        },
        yout: function(){
            dom.youtube.attr('src', youtubeIframes[orders['yout'][config.indexes.yout]]);
        }
    }
};
var controller = {
    init: function(){
        var pvs = ['sound', 'yout'];
        for(var i = 0; i<pvs.length; i++){
            (function(i){
                dom['next' + pvs[i]].click(function(e){
                    e.preventDefault();
                    config.indexes[pvs[i]]++;
                    config.indexes[pvs[i]] %= orders[pvs[i]].length;
                    view.show[pvs[i]]();
                });
                dom['prev' + pvs[i]].click(function(e){
                    e.preventDefault();
                    config.indexes[pvs[i]] += orders[pvs[i]].length -1;
                    config.indexes[pvs[i]] %= orders[pvs[i]].length;
                    view.show[pvs[i]]();
                });
            })(i);
        }
    }
};
var dom;

function musicSetup(){
    dom = {};
    els = ['soundcloud', 'youtube', 'nextsound', 'prevsound', 'nextyout', 'prevyout'];
    for(var i = 0; i<els.length; i++){
        dom[els[i]] = $("#" + els[i]);
    }
    view.init();
    controller.init();
}
