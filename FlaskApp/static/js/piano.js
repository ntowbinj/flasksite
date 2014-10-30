function Piano(numOct, downHandler, upHandler){
    this.KEYS_IN_OCT = 12;
    this.WHITES_IN_OCT = 7;
    this.snap = Snap("#piano");
    this.snap.rect(500, 300, 50, 50);
    this.downHandler = downHandler;
    this.upHandler = upHandler;
    this.numOct = numOct;
    this.white = {
        w: 100/(numOct*7),
        h: 100,
        color: 'white',
        downColor: 'rgb(150, 170, 150)'
    }
    this.black = {
        w: .6*this.white.w,
        h: .6*this.white.h,
        color: 'rgb(30, 80, 120)',
        downColor: 'gray'
    }
    var bOffset = .7;
    whiteW = this.white.w;
    this.relPositions = [
        0, 
        0 + bOffset,
        1,
        1 + bOffset,
        2,
        3,
        3 + bOffset,
        4,
        4 + bOffset,
        5,
        5 + bOffset,
        6].map(
            function(offsetUnitless){
                return offsetUnitless*whiteW;
            });
    this.colors = "w b w b w w b w b w b w".split(" ");
}

Piano.prototype.drawKey = function(n){
    var color;
    var width;
    var height;
    var octaveless = n%this.KEYS_IN_OCT;
    var x = this.relPositions[octaveless]
        + (Math.floor(n/this.KEYS_IN_OCT) * this.white.w*this.WHITES_IN_OCT);
    switch(this.colors[octaveless]){
        case 'w':
            colorName = 'white';
            break;
        case 'b':
            colorName = 'black';
    }
    color = this[colorName].color;
    width = this[colorName].w;
    height = this[colorName].h;
    var keyImg = this.snap.rect(x + "%", 0, width + "%", height + "%");
    keyImg.attr({
        fill: color,
        stroke: "black",
        strokeWidth: 3,
    });
    var that = this;
    keyImg.mousedown(function(){
        that.downHandler(n);
        keyImg.attr({fill: that[colorName].downColor});
    });
    keyImg.mouseup(function(){
        that.upHandler(n);
        keyImg.attr({fill: color});
    });
}

Piano.prototype.drawLayered = function(){
    for(var i = 0; i<this.numOct*12; i++){
        if(this.colors[i%12] == 'w'){
            this.drawKey(i);
        }
    }
    for(var i = 0; i<this.numOct*12; i++){
        if(this.colors[i%12] == 'b'){
            this.drawKey(i);
        }
    }
}

function initPiano(){
    var downHandler = function(noteNumber){
        console.log(noteNumber);
    };
    var upHandler = function(noteNumber){
        console.log(noteNumber);
    };
    piano = new Piano(3, downHandler, function(){;});
    piano.drawLayered();
}



