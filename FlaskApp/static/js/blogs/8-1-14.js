function Trie(){
    this.isWord = false;
    this.children = [];
}

Trie.prototype.add = function(word) {
    if(word.length == 0){
        this.isWord = true;
    }
    else{
        var child = word[0];
        var tail = word.substring(1, word.length);
        if(!this.getChild(child)){
            this.children[child.charCodeAt(0)] = new Trie();
        }
        this.getChild(child).add(tail);
    }
}

Trie.prototype.has = function(word) {
    if(word.length == 0){
        return this.isWord;
    }
    else{
        var child = word[0];
        var tail = word.substring(1, word.length);
        if(!this.getChild(child)){
            return false;
        }
        else{
            return this.getChild(child).has(tail);
        }
    }
}
Trie.prototype.getChild = function(c) {
    return (this.children[c.charCodeAt(0)]);
}

var data = {
    T: undefined,
    string: "",
    candidates: [],
    get: function(){
        (function(){
            this.string = $("#string").val().toLowerCase().replace(" ", "");
        }).call(data);
    },
    getCandidates: function(){
        (function(){
            if(!this.T){return;}
            this.candidates = [];
            this.candidates = this.recGetCandidates(0, this.string, []);
        }).call(data);
    },
    recGetCandidates: function(start, s, memo)
    {
        var ret = [];
        if(!s.length) return ret;
        var cur = this.T;
        for(var i=start; i<s.length; i++){
            if(!cur.getChild(s[i])){
                break;
            }
            else{
                cur = cur.children[s[i].charCodeAt(0)];
            }
            if(cur.isWord){
                if(i == s.length-1) ret.push(s.substring(start, s.length + 1));
                else{
                    var recRes = memo[i+1];
                    if(recRes == undefined) {
                        recRes = this.recGetCandidates(i+1, s, memo);
                        memo[i+1] = recRes;
                    }
                    for(var j = 0; j<recRes.length; j++){
                        ret.push(s.substring(start, i+1) + " " + recRes[j]);
                    }
                }
            }
            else{
            }
        }
        return ret;
    }
};

var control = {
    setStaticButtons: function(){
        $("#submit").click(function(){
            data.get();
            data.getCandidates();
            show.showCandidates();
        })
    }
};

var show = {
    showCandidates: function(){
        var listhtml = "";
        for(var i = 0; i<data.candidates.length; i++)
        {
            listhtml += "<li>" + data.candidates[i] + "</li>";
        }
        $("#resultList").html(listhtml);
    },
    target: undefined,
    spinner: undefined,
    init: function(){
        (function(){
            var opts = {
                lines: 13, // The number of lines to draw
                length: 5, // The length of each line
                width: 1.5, // The line thickness
                radius: 4, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 48, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors
                speed: 1.1, // Rounds per second
                trail: 100, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: '50%', // Top position relative to parent
                left: '45%' // Left position relative to parent
            }
            this.target = document.getElementById('form')
            this.spinner = new Spinner(opts).spin()
            this.target.appendChild(this.spinner.el);
        }).call(show);
    }
};


    
function buildTrie(){
    $.get("/wordlist.txt", function(result){
        var T = new Trie();
        var words = result.split("\n");
        var count = 0;
        for(var i = 0; i<words.length; i++){
            if(words[i].length > 1 || words[i].match(/i|a/)){
                T.add(words[i]);
            }
        }
        data.T = T;
        show.spinner.stop();
    });
}

function blog8_1_14Setup(){
    control.setStaticButtons();
    buildTrie();
    show.init();
};
onloads.push(blog8_1_14Setup);
