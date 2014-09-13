

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
    all: Array.apply(null, Array(23)).map(function(_, i){return i - 11;}),
    labelRight: 40,
    barRate: 250,
    tries: 3
}

var view = {
    init: function(){
        this.setLabels();
        dom.inARow.val(config.inARow);
        this.updateMinSep();
        this.updateIntvList(dom.lower, config.lower);
        this.updateIntvList(dom.upper, config.upper);
    },
    message: function(m){
        dom.message.html(m);
    },
    updateIntvList: function(domEl, intvSet){
        list = intvSet.intervals;
        var i = Math.floor(list.length/2); // only look at positive intervals
        domEl.find(".all").prop("checked", intvSet.allToggled);
        domEl.find(".single").each(function(){
            var val = parseInt($(this).prop("value"));
            var checked = false;
            if(val == Math.abs(list[i])){
                checked = true;
                i++;
            }
            else{
                checked = false;
            }
            $(this).prop("checked", checked);
        });
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
    },
    showAnswer: function(){
        html = "";
        var all = player.answer.map(function(ar){
            return ar.map(function(note){
                return noteName(note);
            });
        });
        for(var i = all[0].length-1; i>=0; i--){
            html+= "<p>";
            for(var j = 0; j<all.length; j++){
                html += "<span class='answerNote'>";
                html += all[j][i] + " </span>";
            }
            html += "</p>"
        }
        dom.answer.html(html);
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
                config.sep = parseInt($(this).prop("value"));
                view.updateMinSep(); 
            });
        });
        $("#start").click(function(){
            player.initPlay();
        });
        $("#stop").click(function(){
            player.stop();
        });
        var intvListClick = function(){
            config.fetchIntvs($(this).attr('id'));
        }
        dom.lower.click(intvListClick);
        dom.upper.click(intvListClick);
        $.each(["#duration", "#between"], function(index, value){
            $(value).click(function(){
                if(!player.stopped){
                    player.correctEvent();
                }
            });
        });
        dom.inARow.on('change', function(){config.inARow = $(this).val()});
    }
};

function IntervalSet(){
    this.intervals = [];
    this.allToggled = false;
}


var config = {
    disturbance: false,
    message: "",
    notes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    lowerBound: 0,
    upperBound: 0,
    sep: 15,
    duration: 0,
    inARow: 1,
    between: 0,
    answerWait: .2,
    lower: new IntervalSet(),
    upper: new IntervalSet(),
    fetch: function(){
        config.fetchIntvs();
    },
    fetchIntvs: function (whichSet){
        var intvSet = config[whichSet];
        var domEl = dom[whichSet];
        var signalUpdate = false;
        oldAll = intvSet.allToggled;
        intvSet.allToggled = domEl.find(".all").prop("checked");
        intvSet.intervals = [];
        domEl.find(".single").each(function(){
            if($(this).prop("checked")){
                intv = parseInt($(this).prop("value"));
                intvSet.intervals.push(intv);
                intvSet.intervals.push(-1*intv);
            }
        });
        if(!oldAll && intvSet.allToggled){
            intvSet.intervals = cons.all;
            signalUpdate = true;
        }
        if(oldAll){
            signalUpdate = true;
            if(intvSet.allToggled){
                intvSet.allToggled = false;
            }
            else{
                intvSet.intervals = [];
            }
        }
        var numeric = function(a, b){return a-b};
        intvSet.intervals = intvSet.intervals.sort(numeric);
        if(signalUpdate) view.updateIntvList(domEl, intvSet);
    },
    init: function(){
        this.lowerBound = 40;
        this.duration = 1000;
        this.upperBound = 60;
        this.sep = 8;
        this.lower.intervals = [-5, 5];
        this.upper.intervals = [-4, 4];
        //this.lower.intervals = [-4, -3, 3, 4];
        //this.upper.intervals = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
        this.between = 3000;
        this.inARow = 1;
    }
}

Array.prototype.bindexOfClosest = function (targ, side){ //binary search for index containing largest element *less* than target or symmetric case
    var mindex = 0;
    var maxdex = this.length - 1;
    var i;
    var check;
    var that = this;
    switch(side)
    {
        case -1:
            check = function(i){
                if(i < that.length - 1) return (that[i] < targ && that[i+1] >= targ);
                else return (that[i] < targ);
            };
            break;
        case 1:
            check = function(i){
                if(i > 0) return (that[i] > targ && that[i-1] <= targ);
                else return (that[i] > targ);
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
        var max = 0;
        // default start values if no random value found
        var maxLU = [config.lowerBound, config.upperBound];
        if(!candidates(maxLU[0], maxLU[1]).length){return undefined;} // deterministic metric for "too limiting"
        for(var i = 0; i<cons.tries; i++){
            var l = Math.floor(Math.random()*bottRange) + config.lowerBound;
            var u = l+config.sep;
            var res = candidates(l, u);
            if(res.length > max){
                max = res.length; 
                randPair = res[Math.floor(Math.random()*res.length)];
                maxLU = [l + randPair[0], u + randPair[1]];
            }
        }
        return maxLU;
    }
    else{
        return undefined;
    }
}

function candidates(currL, currU){ //assume lower and upper are already sorted
    var optionsL = new Array();
    var optionsU = new Array();
    for(var i = 0; i<config.lower.intervals.length; i++){
        var result = currL + config.lower.intervals[i];
        if(result >= config.lowerBound && result <= config.upperBound){
            optionsL.push(config.lower.intervals[i]);
        }
    }
    for(var i = 0; i<config.upper.intervals.length; i++){
        var result = currU + config.upper.intervals[i];
        if(result >= config.lowerBound && result <= config.upperBound){
            optionsU.push(config.upper.intervals[i]);
        }
    }
    var rightward = new Array();
    var gap = currU - currL;
    var ret = new Array();
    var count = 0;
    for(var i = optionsL.length-1; i>=0; i--){ // largest leftward leap to largest rightward
        var remaining = gap - optionsL[i] - config.sep + 1;
        var limit = optionsU.bindexOfClosest(-remaining, 1); // positive 1 for closest but greater than since left is negative
        if(typeof limit != 'undefined'){
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


var player = {
    playedInGroup: 0,
    inARowTempCopy: 0,
    answerWaitTempCopy: 0,
    on: false,
    groupStartTime: 0,
    noteStartTime: 0,
    shown: true,
    answer: [],
    initPlay: function(){
            this.stop();
            this.stopped = false;
            var start = startNotes();
            if(!start){
                this.stop();
                view.message("error: this configuration is too limiting. Try allowing smaller intervals or a larger range.");
                return;
            }
            this.startGroup(start[0], start[1]); 
    },
    startGroup: function(noteL, noteU){
            this.playedInGroup = 0;
            this.inARowTempCopy = config.inARow;
            this.answerWaitTempCopy = config.answerWait;
            this.groupStartTime = new Date().getTime();
            this.shown = false;
            this.answer = [];
            this.play(noteL, noteU); 
            this.moveBar();
    },
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
                this.answer.push(this.notesOn);
                this.on = true;
                this.playedInGroup++;
                var that = this;
                this.noteStartTime = new Date().getTime();
                this.setPlayEvent(function(){that.play(noteL, noteU);}, config.duration);
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
                if(this.playedInGroup < this.inARowTempCopy){
                    this.setPlayEvent(function(){that.play(noteL, noteU);}, 0);
                }
                else{
                    this.setPlayEvent(function(){that.startGroup(noteL, noteU);}, config.between);
                }
            }
        }
    },
    stop: function(){
        this.stopped = true;
        if(this.answer.length) this.show();
        clearTimeout(this.timeOut);
        for(var i = 0; i<this.notesOn.length; i++){
            MIDI.noteOff(0, this.notesOn[i], 0);
        }
        this.on = false;
        this.notesOn = [];
    },
    setPlayEvent: function(impending, when){
        clearTimeout(this.timeOut);
        this.time = new Date().getTime();
        this.impending = impending;
        this.timeOut = setTimeout(this.impending, when);
    },
    moveBar: function(){
        var val;
        if(!this.shown && !this.stopped){
            val = 100.0*(new Date().getTime() - this.noteStartTime + (this.playedInGroup-1)*config.duration);
            if(this.inARowTempCopy == 1) val /= (this.answerWaitTempCopy*(config.duration + config.between));
            else val /= (config.duration*this.inARowTempCopy + this.answerWaitTempCopy*config.between);
            if(val>110) this.show();
            that = this;
            this.barTimeOut = setTimeout(function(){that.moveBar()}, (val<100) ? cons.barRate : 2*cons.barRate);
        }
        else {
            val = 0;
        }
        if(!this.answerWaitTempCopy && this.inARowTempCopy <= 1) val = 0;
        dom.wait.progressbar("option", "value", val);
    },
    show: function(){
        this.shown = true;
        view.showAnswer();
    },
    correctEvent: function(){
        var elapsed = new Date().getTime() - this.time;
        var wait;
        if(this.notesOn.length) wait = config.duration; 
        else wait = config.between;
        if(elapsed > wait){
            this.setPlayEvent(this.impending, 0);
        }
        else{
            var remaining = wait - elapsed;
            this.setPlayEvent(this.impending, remaining);
        }
    },
    notesOn: [],
    timeOut: undefined,
    barTimeOut: undefined,
    impending: function(){},
    stopped: true,
}

function midiSetup(){
    dom = {};
    els = [
        "lower",
        "upper",
        "intervalLabels",
        "minSep",
        "duration",
        "between",
        "answerWait",
        "answer",
        "minNote",
        "maxNote",
        "minOct",
        "maxOct",
        "message",
        "wait",
        "inARow"
    ];
    for(var i = 0; i<els.length; i++){
        dom[els[i]] = $("#" + els[i]); 
    }
    config.init();
    controller.init();
    view.init();
    $(window).bind("beforeunload", function(){player.stop();});
    MIDI.loader = new widgets.Loader;
    MIDI.loadPlugin({
        instrument: "acoustic_grand_piano",
        soundfontUrl: "/static/js/MIDI.js/soundfont/",
        callback: function() {
            MIDI.loader.stop();	
            MIDI.noteOn(0, 0, 0, 0); //for instant start
            MIDI.noteOff(0, 0, 100);
        }
    });
        
};
onloads.push(midiSetup);

