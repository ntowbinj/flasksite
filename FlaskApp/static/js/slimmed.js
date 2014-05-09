

function intvName(i){
    switch(i)
    {
        case 0:
           return 'unison';
           break;
        case 1:
           return 'minor 2nd';
           break;
        case 2:
           return 'major 2nd';
           break;
        case 3:
           return 'minor 3rd';
           break;
        case 4:
           return 'major 3rd';
           break;
        case 5:
           return 'perfect 4th';
           break;
        case 6:
           return 'tritone';
           break;
        case 7:
           return 'perfect 5th';
            break;
        case 8:
            return 'minor 6th';
            break;
        case 9:
            return 'major 6th';
            break;
        case 10:
            return 'minor 7th';
            break;
        case 11:
            return 'major 7th';
            break;
        case 12:
            return 'octave';
            break;
        default:
            alert('interval too big');
    }
}

function noteName(i){
    i = i%12;
    switch(i)
    {
        case 0:
            return 'C';
            break;
        case 1:
            return 'C#';
            break;
        case 2:
            return 'D';
            break;
        case 3:
            return 'Eb';
            break;
        case 4:
            return 'E';
            break;
        case 5:
            return 'F';
            break;
        case 6:
            return 'F#';
            break;
        case 7:
            return 'G';
            break;
        case 8:
            return 'Ab';
            break;
        case 9:
            return 'A';
            break;
        case 10:
            return 'Bb';
            break;
        case 11:
            return 'B';
            break;
    }
}

var dom;

var view = {
    updateMinSep: function(){
        dom.minSep.find("input").each(function(){
            if($(this).prop("value") == config.sep){
                $(this).prop("checked", true);
            }
            else{
                $(this).prop("checked", false);
            }
        })
    }
}

var controller = {
    setStaticButtons: function(){
        dom.intervalLabels.find("a").each(function(){
            $(this).click(function(e){
                e.preventDefault();
            });
        });
        dom.minSep.find("input").each(function(){
            $(this).click(function(){
                config.sep = $(this).prop("value");
                view.updateMinSep(); 
            });
        });
        $("#start").click(function(){
            config.fetch();
            player.stop();
            player.stopped = false;
            var start = startNotes();
            console.log(start);
            player.play(start[0], start[1], true); 
        });
        $("#stop").click(function(){
            player.stop();
        });
        $("#intvLists").click(function(){config.fetchIntvs();});
        $.each(["#duration", "#between"], function(index, value){
            $(value).click(function(){
                if(!player.stopped){
                    config.fetchTime();
                    player.correctEvent();
                }
            });
        });
    }
};

           
var config = {
    notes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    lowerBound: 0,
    upperBound: 0,
    sep: 15,
    duration: 0,
    between: 0,
    bottomInterval: (function(){
        var ret = new Array();
        for(var i = -23; i<24; i++){
            ret.push(i);
        }
        return ret;
    }()),
    topInterval: this.bottomInterval,
    fetch: function(){
        config.fetchIntvs();
        config.fetchTime();
    },
    fetchTime: function(){
        config.duration = dom.duration.prop("value");
        config.between = dom.between.prop("value");
    },
    fetchIntvs: function (){
        var getIntvs = function(intvList){
            intvList.length = 0;
            this.find("input").each(function(){
                if($(this).prop("checked")){
                    intv = parseInt($(this).prop("value"));
                    intvList.push(intv);
                    intvList.push(-1*intv);
                }
            });
        };
        getIntvs.call(dom.lowerVoiceIntervals, config.bottomInterval);
        getIntvs.call(dom.upperVoiceIntervals, config.topInterval);
        var numeric = function(a, b){return a-b};
        config.bottomInterval = config.bottomInterval.sort(numeric);
        config.topInterval = config.topInterval.sort(numeric);
    }
}
Array.prototype.bindexOfClosest = function (targ, side){ //binary search for index containing largest element *less* than target or symmetric case
    var mindex = 0;
    var maxdex = this.length - 1;
    var i;
    var check;
    var self = this;
    switch(side)
    {
        case -1:
            check = function(i){
                if(i < self.length - 1) return (self[i] < targ && self[i+1] >= targ);
                else return (self[i] < targ);
            };
            break;
        case 1:
            check = function(i){
                if(i > 0) return (self[i] > targ && self[i-1] <= targ);
                else return (self[i] > targ);
            };
            break;
    }
    while(mindex <= maxdex){
        i = (mindex + maxdex)/2 | 0;
        if(check(i)){
            return i;
        }
        else if(this[i] < targ){
            mindex = i+1;
        }
        else{
            maxdex = i-1;
        }
    }
    return undefined;
}

function startNotes(){
    /*var range = config.upperBound - config.lowerBound;
    var l = Math.floor(Math.random()*range/2) + config.lowerBound;
    var u = Math.floor(Math.random()*range/2) + config.lowerBound + range/2;
    console.log(l);
    return [l, u];*/
    var range = config.upperBound - config.lowerBound;
    var bottRange = range - config.sep;
    if(range > 0){
        var l = Math.floor(Math.random()*bottRange) + config.lowerBound;
        var u = l+config.sep;
        return [l, u];
    }
    else{
        alert("BAD");
    }
}

function candidates(currL, currU){ //assume bottomInterval and topInterval are already sorted
    var optionsL = new Array();
    var optionsU = new Array();
    for(var i = 0; i<config.bottomInterval.length; i++){
        var result = currL + config.bottomInterval[i];
        if(result >= config.lowerBound && result <= config.upperBound){
            optionsL.push(config.bottomInterval[i]);
        }
    }
    for(var i = 0; i<config.topInterval.length; i++){
        var result = currU + config.topInterval[i];
        if(result >= config.lowerBound && result <= config.upperBound){
            optionsU.push(config.topInterval[i]);
        }
    }
    var rightward = new Array();
    var gap = currU - currL;
    //console.log("gap: " + gap);
    var ret = new Array();
    var count = 0;
    for(var i = optionsL.length-1; i>=0; i--){ // largest leftward leap to largest rightward
        //var remaining = gap - optionsL[i] - config.sep; // remaining space after leap (if leap left/positive, is less) 
        var remaining = gap - optionsL[i] - config.sep + 1;
        var limit = optionsU.bindexOfClosest(-remaining, 1); // positive 1 for closest but greater than since left is negative
        //console.log("limitdex: " + limit);
        if(typeof limit != 'undefined'){
            //console.log("limit: " + optionsU[limit]);
            rightward = optionsU.slice(limit, optionsU.length).concat(rightward);
            optionsU = optionsU.slice(0, limit);
            for(var j = 0; j<rightward.length; j++){
                ret[count] = new Array(optionsL[i], rightward[j]);
                count++;
            }
        }
    }
    return ret;
}

config.lowerBound = 40;
config.duration = 1;
config.upperBound = 60;
config.sep = 8;
config.bottomInterval = [-4, -3, 3, 4];
config.topInterval = [-5, -4, -3, -2, -1, 2, 3, 4, 5];
var result = candidates(5, 10);
console.log(result);
config.play = true;            
config.between = 3;


var player = {
    play: function(noteL, noteU, on){
        console.log(noteL + " " + noteU);
        console.log("on: " + on);
        MIDI.setVolume(0, 127);
        if(this.stopped){
            return;
        }
        else {
            if(on){
                //alert("on");
                MIDI.noteOn(0, noteL, 127, 0);
                MIDI.noteOn(0, noteU, 127, 0);
                this.notesOn = [noteL, noteU];
                var that = this;
                //console.log("l and u: " + noteL + " " + noteU);
                this.setEvent(function(){that.play(noteL, noteU, false);}, config.duration*1000);
            }
            else {
                MIDI.noteOff(0, noteL, 0);
                MIDI.noteOff(0, noteU, 0);
                this.noteOn = [];
                var that = this;
                var nextOptions = candidates(noteL, noteU);
                var index = Math.floor(Math.random()*nextOptions.length);
                noteL += nextOptions[index][0];
                noteU += nextOptions[index][1];
                this.setEvent(function(){that.play(noteL, noteU, true);}, config.between*1000);

            }
        }
    },
    stop: function(){
        this.stopped = true;
        clearTimeout(this.timeOut);
        for(var i = 0; i<this.notesOn.length; i++){
            MIDI.noteOff(0, this.notesOn[i], 0);
        }
        this.notesOn = [];
    },
    setEvent: function(impending, when){
        this.time = new Date().getTime();
        this.impending = impending;
        this.timeOut = setTimeout(this.impending, when);
    },
    correctEvent: function(){
        var elapsed = new Date().getTime() - this.time;
        var wait;
        if(this.notesOn.length){wait = config.duration*1000;}
        else{wait = config.between*1000;}
        if(elapsed > wait){
            //this.stop();
            clearTimeout(this.timeOut);
            //this.impending();
            this.setEvent(this.impending, 0);
        }
        else{
            var remaining = wait - elapsed;
            clearTimeout(this.timeOut);
            this.setEvent(this.impending, remaining);
        }
    },
    notesOn: [],
    timeOut: undefined,
    impending: function(){},
    stopped: true,
}

function midiSetup(){
    dom = {
        lowerVoiceIntervals: $("#lowerVoiceIntervals"),
        upperVoiceIntervals: $("#upperVoiceIntervals"),
        intervalLabels: $("#intervalLabels"),
        minSep: $("#minSep"),
        duration: $("#duration"),
        between: $("#between")
    };
    controller.setStaticButtons();
    view.updateMinSep();
    $(window).bind("beforeunload", function(){player.stop();});
    MIDI.loader = new widgets.Loader;
    MIDI.loadPlugin({
        instrument: "acoustic_grand_piano",
        soundfontUrl: "/static/js/MIDI.js/soundfont/",
        callback: function() {
            MIDI.loader.stop();	
        }
    });
        
};

