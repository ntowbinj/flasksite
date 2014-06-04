

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
    var note;
    switch(i)
    {
        case 0:
            note =  'C';
            break;
        case 1:
            note =  'C#';
            break;
        case 2:
            note =  'D';
            break;
        case 3:
            note =  'Eb';
            break;
        case 4:
            note =  'E';
            break;
        case 5:
            note =  'F';
            break;
        case 6:
            note =  'F#';
            break;
        case 7:
            note =  'G';
            break;
        case 8:
            note =  'Ab';
            break;
        case 9:
            note =  'A';
            break;
        case 10:
            note =  'Bb';
            break;
        case 11:
            note =  'B';
            break;
    }
    return note;
}

var dom;

var cons = {
    labelRight: 40
}

var view = {
    init: function(){
        this.setLabels();
    },
    message: function(m){
        dom.message.html(m);
    },
    updateMinSep: function(){
        dom.minSep.find("input").each(function(){
            if($(this).prop("value") == config.sep){
                $(this).prop("checked", true);
            }
            else $(this).prop("checked", false);
        })
    },
    setLabels: function(wait){
        var delay = function() {
            $.each(["minNote", "maxNote"], function(index, value){
                var n, name, oct;
                n = $("#pitch-range").slider("values", index);
                name = noteName(n); 
                oct = Math.floor(n/12);
                dom[value].html("<span class='noteName'>" + name + "</span><span class='noteOct'>" + oct + "</span>");
                dom[value].position({
                    my: 'right+' + cons.labelRight + ' center',
                    at: 'center center',
                    of: $("#pitch-range a:eq(" + index  + ")")
                });
            });
        };
        setTimeout(delay, wait);
    }
}

var controller = {
    init: function(){
        $("#answerWait").slider({
            min: 0,
            max: 1,
            step: 0.2,
            value: config.answerWait, 
            change: function(event, ui) {
                config.answerWait = ui.value;
            }
        });
        $("#between").slider({
            min: 0,
            max: 5000,
            step: 100,
            value: config.between, 
            change: function(event, ui) {
                config.between = ui.value;
                if(!player.stopped){
                    player.correctEvent();
                }
            }
        });
        $("#duration").slider({
            min: 300,
            max: 5000,
            step: 100,
            value: config.duration, 
            change: function(event, ui) {
                config.duration = ui.value;
                if(!player.stopped){
                    player.correctEvent();
                }
            }
        });
        $("#pitch-range").slider({
            orientation: "vertical",
            range: true,
            min: 0,
            max: 100,
            values: [config.lowerBound, config.upperBound],
            slide: function(event, ui) {
                config.disturbance = true;
                config.lowerBound = ui.values[0];
                config.upperBound = ui.values[1];
                view.setLabels(5);
            }
        });
        dom.wait.progressbar({
            value: 0
        });
        dom.intervalLabels.find("a").each(function(){
            $(this).click(function(e){
                e.preventDefault();
            });
        });
        dom.minSep.find("input").each(function(){
            $(this).click(function(){
                if(!player.stopped) config.disturbance = true;
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
            player.play(start[0], start[1]); 
        });
        $("#stop").click(function(){
            player.stop();
        });
        $("#intvLists").click(function(){config.fetchIntvs();});
        $.each(["#duration", "#between"], function(index, value){
            $(value).click(function(){
                if(!player.stopped){
                    player.correctEvent();
                }
            });
        });
    }
};

           
var config = {
    disturbance: false,
    message: "",
    notes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    lowerBound: 0,
    upperBound: 0,
    sep: 15,
    duration: 0,
    between: 0,
    answerWait: .5,
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
        else maxdex = i-1;
    }
    return undefined;
}

function startNotes(){
    var range = config.upperBound - config.lowerBound;
    var bottRange = range - config.sep;
    if(bottRange > 0){
        var l = Math.floor(Math.random()*bottRange) + config.lowerBound;
        var u = l+config.sep;
        if(candidates(l, u).length) return [l, u]; //attempt random start notes
        else{ // if that fails, try room maximizing deterministic option
            l = config.lowerBound;
            u = config.lowerBound + config.sep;
            if(candidates(l, u).length){return [l, u];}
        }
    }
    else return undefined;
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
config.duration = 1000;
config.upperBound = 60;
config.sep = 8;
config.bottomInterval = [-4, -3, 3, 4];
config.topInterval = [-5, -4, -3, -2, -1, 2, 3, 4, 5];
config.between = 3000;


var player = {
    on: false,
    startTime: 0,
    play: function(noteL, noteU){
        view.message("");
        MIDI.setVolume(0, 127);
        if(this.stopped){
            return;
        }
        else {
            if(!this.on){
                MIDI.noteOn(0, noteL, 127, 0);
                MIDI.noteOn(0, noteU, 127, 0);
                this.notesOn = [noteL, noteU];
                var that = this;
                this.on = true;
                this.startTime = new Date().getTime();
                this.setEvent(function(){that.play(noteL, noteU);}, config.duration);
            }
            else {
                MIDI.noteOff(0, noteL, 0);
                MIDI.noteOff(0, noteU, 0);
                this.notesOn = [];
                var that = this;
                var nextOptions = candidates(noteL, noteU);
                if(!nextOptions.length){
                    var fail = true;
                    if(config.disturbance){
                        var newStart = startNotes();
                        if(newStart){
                            fail = false;
                            noteL = newStart[0];
                            noteU = newStart[1];
                        }
                    }
                    if(fail){
                        this.stop();
                        view.message("error: this configuration is too limiting. Try allowing smaller intervals or a larger range.");
                        return;
                    }
                }
                else{
                    var index = Math.floor(Math.random()*nextOptions.length);
                    noteL += nextOptions[index][0];
                    noteU += nextOptions[index][1];
                }
                if(!player.stopped) config.disturbance = false;
                this.on = false;
                this.setEvent(function(){that.play(noteL, noteU);}, config.between);
            }
        }
    },
    stop: function(){
        this.stopped = true;
        clearTimeout(this.timeOut);
        clearTimeout(this.barTimeOut);
        for(var i = 0; i<this.notesOn.length; i++){
            MIDI.noteOff(0, this.notesOn[i], 0);
        }
        this.on = false;
        this.notesOn = [];
    },
    setEvent: function(impending, when){
        clearTimeout(this.timeOut);
        clearTimeout(this.barTimeOut);
        this.time = new Date().getTime();
        this.impending = impending;
        this.timeOut = setTimeout(this.impending, when);
        this.moveBar();
    },
    moveBar: function(){
        var oldval = dom.wait.progressbar("option", "value");
        var val;
        if(oldval<100){
            val = 100.0*(new Date().getTime() - this.startTime)/(config.answerWait*(config.duration+config.between));
            that = this;
            this.barTimeOut = setTimeout(function(){that.moveBar()}, (val<100) ? 100 : 200);
        }
        else {
            val = 0;
        }
        dom.wait.progressbar("option", "value", val);
    },
    correctEvent: function(){
        var elapsed = new Date().getTime() - this.time;
        var wait;
        if(this.notesOn.length) wait = config.duration; 
        else wait = config.between;
        if(elapsed > wait){
            this.setEvent(this.impending, 0);
        }
        else{
            var remaining = wait - elapsed;
            this.setEvent(this.impending, remaining);
        }
    },
    notesOn: [],
    timeOut: undefined,
    barTimeOut: undefined,
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
        between: $("#between"),
        answerWait: $("#answerWait"),
        minNote: $("#minNote"),
        maxNote: $("#maxNote"),
        minOct: $("#minOct"),
        maxOct: $("#maxOct"),
        message: $("#message"),
        wait: $("#wait")
    };
    controller.init();
    view.init();
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

