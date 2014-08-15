function Trie(){
    this.isWord = false;
    this.children = {};
}

Trie.prototype.add = function(word) {
    if(word.length == 0){
        this.isWord = true;
    }
    else{
        var child = word[0];
        var tail = word.substring(1, word.length);
        if(!(child in this.children)){
            this.children[child] = new Trie();
        }
        this.children[child].add(tail);
    }
}
Trie.prototype.has = function(word) {
    if(word.length == 0){
        return this.isWord;
    }
    else{
        var child = word[0];
        var tail = word.substring(1, word.length);
        if(!this.hasChild(child)){
            return false;
        }
        else{
            return this.children[child].has(tail);
        }
    }
}
Trie.prototype.hasChild = function(c) {
    return (c in this.children);
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
            if(!this.T){ alert("not ready");}
            this.candidates = [];
            this.candidates = this.recGetCandidates(this.string);
        }).call(data);
    },
    recGetCandidates: function(s)
    {
        var ret = [];
        if(!s.length) return ret;
        var cur = this.T;
        for(var i = 0; i<s.length; i++){
            if(!cur.hasChild(s[i])){
                break;
            }
            else{
                cur = cur.children[s[i]];
            }
            if(cur.isWord){
                if(i == s.length-1) ret.push(s);
                else{
                    recRes = this.recGetCandidates(s.substring(i+1, s.length));
                    for(var j = 0; j<recRes.length; j++){
                        ret.push(s.substring(0, i+1) + " " + recRes[j]);
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
    });
}

function blog8_1_14Setup(){
    control.setStaticButtons();
    buildTrie();
};
onloads.push(blog8_1_14Setup);
