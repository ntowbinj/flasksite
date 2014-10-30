function Piano(numOct, callback){
    this.KEYS_IN_OCT = 12;
    this.WHITES_IN_OCT = 7;
    this.snap = Snap("#piano");
    this.snap.rect(500, 300, 50, 50);
    this.callback = callback;
    this.numOct = numOct;
    this.whiteW = 100/(numOct*7);
    this.whiteH = 100;
    this.blackH = .6*this.whiteH;
    this.blackW = .6*this.whiteW;
    var bOffset = .7;
    var whiteW = this.whiteW;
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
        + (Math.floor(n/this.KEYS_IN_OCT) * this.whiteW*this.WHITES_IN_OCT);
    switch(this.colors[octaveless]){
        case 'w':
            color = 'white';
            width = this.whiteW;
            height = this.whiteH;
            break;
        case 'b':
            color = 'rgb(30, 80, 120)';
            width = this.blackW;
            height = this.blackH;
    }
    var keyImg = this.snap.rect(x + "%", 0, width + "%", height + "%");
    keyImg.attr({
        fill: color,
        stroke: "black",
        strokeWidth: 3,
    });
    var callback = this.callback;
    keyImg.click(function(){callback(n);});
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

Piano.prototype.createNth = function(n){
    var octaveless = n%this.KEYS_IN_OCT;
    var cornerX = 
        this.relPositions[octaveless]
        + (Math.floor(n/this.KEYS_IN_OCT) * this.whiteW*this.WHITES_IN_OCT);
    switch(this.colors[octaveless]){
        case 'w':
            return new Key(this.snap, n, cornerX, 'white', this.whiteW, this.whiteH, this.callback);
        case 'b':
            return new Key(this.snap, n, cornerX, 'black', this.blackW, this.blackH, this.callback);
    }
}



function initPiano(){
    var callback = function(noteNumber){
        console.log(noteNumber);
    };
    piano = new Piano(3, callback);
    piano.drawLayered();
}



