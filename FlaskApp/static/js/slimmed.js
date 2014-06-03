

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
            if($(this).prop("value") == model.sep){
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
            value: model.answerWait, 
            change: function(event, ui) {
                model.answerWait = ui.value;
            }
        });
        $("#between").slider({
            min: 0,
            max: 5000,
            step: 100,
            value: model.between, 
            change: function(event, ui) {
                model.between = ui.value;
                if(!player.stopped && !player.on){
                    player.correctEvent();
                }
            }
        });
        $("#duration").slider({
            min: 300,
            max: 5000,
            step: 100,
            value: model.duration, 
            change: function(event, ui) {
                model.duration = ui.value;
                if(!player.stopped && player.on){
                    player.correctEvent();
                }
            }
        });
        $("#pitch-range").slider({
            orientation: "vertical",
            range: true,
            min: 0,
            max: 100,
            values: [model.lowerBound, model.upperBound],
            slide: function(event, ui) {
                model.disturbance = true;
                model.lowerBound = ui.values[0];
                model.upperBound = ui.values[1];
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
                if(!player.stopped) model.disturbance = true;
                model.sep = $(this).prop("value");
                view.updateMinSep(); 
            });
        });
        $("#start").click(function(){
            model.fetch();
            player.stop();
            player.stopped = false;
            var start = startNotes();
            console.log(start);
            player.notesOn = start;
            player.play(); 
        });
        $("#stop").click(function(){
            player.stop();
        });
        $("#intvLists").click(function(){model.fetchIntvs();});
        $.each(["#duration", "#between"], function(index, value){
            $(value).click(function(){
                if(!player.stopped){
                    player.correctEvent();
                }
            });
        });
    }
};

           
var model = {
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
        model.fetchIntvs();
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
        getIntvs.call(dom.lowerVoiceIntervals, model.bottomInterval);
        getIntvs.call(dom.upperVoiceIntervals, model.topInterval);
        var numeric = function(a, b){return a-b};
        model.bottomInterval = model.bottomInterval.sort(numeric);
        model.topInterval = model.topInterval.sort(numeric);
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
    var range = model.upperBound - model.lowerBound;
    var bottRange = range - model.sep;
    if(bottRange > 0){
        var l = Math.floor(Math.random()*bottRange) + model.lowerBound;
        var u = l+model.sep;
        if(candidates(l, u).length) return [l, u]; //attempt random start notes
        else{ // if that fails, try room maximizing deterministic option
            l = model.lowerBound;
            u = model.lowerBound + model.sep;
            if(candidates(l, u).length){return [l, u];}
        }
    }
    else return undefined;
}

function candidates(currL, currU){ //assume bottomInterval and topInterval are already sorted
    var optionsL = new Array();
    var optionsU = new Array();
    for(var i = 0; i<model.bottomInterval.length; i++){
        var result = currL + model.bottomInterval[i];
        if(result >= model.lowerBound && result <= model.upperBound){
            optionsL.push(model.bottomInterval[i]);
        }
    }
    for(var i = 0; i<model.topInterval.length; i++){
        var result = currU + model.topInterval[i];
        if(result >= model.lowerBound && result <= model.upperBound){
            optionsU.push(model.topInterval[i]);
        }
    }
    var rightward = new Array();
    var gap = currU - currL;
    //console.log("gap: " + gap);
    var ret = new Array();
    var count = 0;
    for(var i = optionsL.length-1; i>=0; i--){ // largest leftward leap to largest rightward
        //var remaining = gap - optionsL[i] - model.sep; // remaining space after leap (if leap left/positive, is less) 
        var remaining = gap - optionsL[i] - model.sep + 1;
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

model.lowerBound = 40;
model.duration = 1000;
model.upperBound = 60;
model.sep = 8;
model.bottomInterval = [-4, -3, 3, 4];
model.topInterval = [-5, -4, -3, -2, -1, 2, 3, 4, 5];
model.between = 3000;


var player = {
    unit: 100,
    until: 0,
    on: false,
    startTime: 0,
    play: function(){
        that = this;
        view.message("");
        MIDI.setVolume(0, 127);
        if(this.stopped) return;
        if(!this.until){
            this.startTime = new Date().getTime();
            if(!this.on){
                for(var i = 0; i<this.notesOn.length; i++)
                    MIDI.noteOn(0, this.notesOn[i], 127, 0);
                this.until = model.duration/this.unit;
                this.on = true;
                this.setEvent(function(){that.play();}, this.unit);
            }
            else{
                for(var i = 0; i<this.notesOn.length; i++)
                   MIDI.noteOff(0, this.notesOn[i], 0);
                var nextOptions = candidates(this.notesOn[0], this.notesOn[1]);
                if(!nextOptions.length){
                    var fail = true;
                    if(model.disturbance){
                        var newStart = startNotes();
                        if(newStart){
                            fail = false;
                            this.notesOn = newStart;
                        }
                    }
                    if(fail){
                        this.stop();
                        view.message("error: this configuration is too limiting. Try alowing smaller intervals or a larger range.");
                        return;
                    }
                }
                else{
                    var index = Math.floor(Math.random()*nextOptions.length);
                    this.notesOn[0] += nextOptions[index][0];
                    this.notesOn[1] += nextOptions[index][1];
                }
                if(!player.stopped) model.disturbance = false;
                this.until = model.between/this.unit;
                this.on = false;
                this.setEvent(function(){that.play();}, this.unit);
            }
        }
        else{
            this.until--;
            this.setEvent(function(){that.play();}, this.unit);
        }
        if(this.on){
            val = (100.0*(new Date().getTime() - this.startTime)/model.duration)
            console.log(val);
            dom.wait.progressbar("option", "value", val);
        }
        else{
            dom.wait.progressbar("option", "value", 0);
        }
    },
    stop: function(){
        this.stopped = true;
        clearTimeout(this.timeOut);
        for(var i = 0; i<this.notesOn.length; i++){
            MIDI.noteOff(0, this.notesOn[i], 0);
        }
        this.on = false;
        this.until = 0;
        this.notesOn = [];
    },
    setEvent: function(impending, when){
        clearTimeout(this.timeOut);
        this.time = new Date().getTime();
        this.impending = impending;
        this.timeOut = setTimeout(this.impending, when);
        //if(this.notesOn.length) this.moveBar(((model.duration*1000 + model.between*1000)*model.answerWait - new Date().getTime())*this.bar.fillRate/100.0);
    },
    correctEvent: function(){
        var elapsed = new Date().getTime() - this.startTime;
        var wait;
        if(this.notesOn.length) wait = model.duration; 
        else wait = model.between;
        if(elapsed > wait){
            console.log("full time elapsed");
            this.until = 0;
            this.setEvent(this.impending, 0);
        }
        else{
            var remaining = wait - elapsed;
            this.until = Math.floor(remaining/this.unit);
            this.setEvent(this.impending, remaining);
        }
    },
    notesOn: [],
    timeOut: undefined,
    impending: function(){},
    stopped: true,
    bar: {timeOut: undefined, fillRate: 10}
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

