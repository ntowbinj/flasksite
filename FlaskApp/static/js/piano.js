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

function Key(snap, id, x, color, width, height, callback){
    this.draw = function(){
        var keyImg = snap.rect(x + "%", 0, width + "%", height + "%");
        keyImg.attr({
            fill: color,
            stroke: "black",
            strokeWidth: 3,
        });
        keyImg.click(function(){callback(id);});
    }
}

Piano.prototype.drawLayered = function(){
    for(var i = 0; i<this.numOct*12; i++){
        if(this.colors[i%12] == 'w'){
            this.createNth(i).draw();
        }
    }
    for(var i = 0; i<this.numOct*12; i++){
        if(this.colors[i%12] == 'b'){
            this.createNth(i).draw();
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



