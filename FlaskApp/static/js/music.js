var soundcloudIframes = {
    gray: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/114306377&amp;color=2040cd&amp;auto_play=false&amp;hide_related=false&amp;show_artwork=true&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false",
    kid: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/129879035&amp;color=2040cd&amp;theme_color=000000&amp;auto_play=false&amp;hide_related=false&amp;show_artwork=true&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false",
    thomas: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/161018583&amp;color=2040cd&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"
};
var youtubeIframes = {
    kid: "//www.youtube.com/embed/IgjXhG8g1CI",
    thomas: "//www.youtube.com/embed/66CApDQ_nBU",
    blimp: "//www.youtube.com/embed/ukNejCx57uo",
    five: "//www.youtube.com/embed/cgCocWU7EW8",
    hihats: "//www.youtube.com/embed/R-eNyHCe46w"
}

var images = {};
[
    'whitewater0', 
    'whitewater1', 
    'joint0',
    'ballroom0',
    'film0',
    'film1',
    'film2'
].map(function(value) {
    images[value] = "/static/img/" + value + ".jpg";
});

var orders = {
    sound: ['thomas', 'gray', 'kid'],
    yout: ['blimp', 'thomas', 'kid', 'hihats', 'five'],
    img: ['whitewater1', 'ballroom0', 'whitewater0', 'joint0', 'film2', 'film0', 'film1']
};

var config = {
    indexes: {sound: 0, yout: 0, img: 0}
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
        },
        img: function(){
            dom.image.attr('src', images[orders['img'][config.indexes.img]]);
        }
    }
};
var controller = {
    init: function(){
        var pvs = ['sound', 'yout', 'img'];
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
    els = ['soundcloud', 'youtube', 'nextsound', 'prevsound', 'nextyout', 'prevyout', 'nextimg', 'previmg', 'image'];
    for(var i = 0; i<els.length; i++){
        dom[els[i]] = $("#" + els[i]);
    }
    view.init();
    controller.init();
}
