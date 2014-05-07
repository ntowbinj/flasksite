var synConfig, synView, synController;

synConfig = {
    duration: 400,
    allow: true,
    origin: "",
    destination: "",
    skip: [],
    path: [],
    avoids: [],
    avoidsMax: 20,
    message: "",
    get: function()
    {
        (function(){
            this.origin = $("#origin").val().toLowerCase();
            this.destination = $("#destination").val().toLowerCase();
        }).call(synConfig);
    }
}
synView = {
    input:  function()
    {
        $("#origin").val(synConfig.origin); 
        $("#destination").val(synConfig.destination); 
    },

    avoids: function()
    {
        var addx = '<a class="addx">&#10006;</a>';
        var listhtml = "";
        for(var i = 0; i<synConfig.avoids.length; i++)
        {
            listhtml += "<li><span class='highlight'>";
            listhtml += addx + "<span class='word'>";
            listhtml += synConfig.avoids[i] + "</span></span></li>";
        }
        $("#avoidlist").html(listhtml);
        $(".addx").hover(
            function(e)
            {
                $(this).parent().addClass("selectedgreen");
            },
            function(e)
            {
                $(this).parent().removeClass("selectedgreen");
            })
        visual.resize();
    },

    output: function(){
        $("#message").html(synConfig.message);
        var synresultul = $("#synresultul");
        synresultul.hide();
        var listhtml = "";
        var deletex = '<a class="deletex">&#10006;</a>';
        var blank ='<span class="firstlast">&#10006;</span>';
        for(var i = 0; i<synConfig.path.length; i++)
        {
            listhtml += "<li><span class='highlight'>";
            if(i != 0 && i != synConfig.path.length - 1)
                listhtml += deletex;
            else
                listhtml += blank;
            listhtml +=  "<span class='word'>" + synConfig.path[i] + "</span></span></li>";
        }
        synresultul.html(listhtml);
        synresultul.fadeIn();
        $(".deletex").hover(
            function(e)
            {
                $(this).parent().addClass("selectedred");
            },
            function(e)
            {
                $(this).parent().removeClass("selectedred");
            })

        visual.resize();
    },
    setLengthAndRemainder: function()
    {
        remainder = $("#remainder");
        if(synConfig.avoids.length)
        {
            var rem = synConfig.avoidsMax - synConfig.avoids.length;
            remainder.html(" (" + rem + " left)"); 
        }
        else
            remainder.html("");
    }
}

synController = {
    setDeleteHandler: function(){
        $(".deletex").click(
            function(e)
            {
                var rem = synConfig.avoidsMax - synConfig.avoids.length;
                if(synConfig.allow && rem && !$(this).parent().is(':animated')){
                    synConfig.avoids.push($(this).parent().find(".word").text());
                    $(this).parent().fadeOut();
                    synController.submit();
                    synView.avoids();
                    synView.setLengthAndRemainder();
                }
            })
        $(".addx").click(
            function(e){
                if(synConfig.allow){
                    var remove = ($(this).parent().find(".word").text());
                    synConfig.avoids.splice(synConfig.avoids.indexOf(remove), 1);
                    $(this).parent().fadeOut();
                    synView.setLengthAndRemainder();
                    synController.submit();
                }
            })
    },

    submit: function(){
        var obj = {
            'origin': synConfig.origin,
            'destination': synConfig.destination,
            'avoids': synConfig.avoids
        };
        dataString = JSON.stringify(obj);
        $.ajax({
            type: 'POST',
            url: '/getpath',
            data: JSON.stringify(obj),
            traditional: true,
            success: function(data){
                var result = JSON.parse(data);
                if(result.message){
                    synConfig.message = result.message;
                    synConfig.path = [];
                }
                else{
                    synConfig.path = JSON.parse(data).path;
                    synConfig.message = "";
                }
                synView.output();
                synController.setDeleteHandler();
            }});
        synConfig.allow = false;
        setTimeout(function(){synConfig.allow = true;}, 300);
    },
    setStaticButtons: function()
    {
        $("#submit").click(function() {
            if(synConfig.allow)
            {
                synConfig.get();
                synController.submit();
            }
        });
        var byenter = function(e){
            if(e.which ==13){
                $("#submit").click();
            }
        };
        $("#origin").keypress(byenter);
        $("#destination").keypress(byenter);
        $(".example").click(function(e) {
            pair = $(this).html().split(" -&gt; ");
            e.preventDefault(); // prevent reload
            synConfig.origin = pair[0];
            synConfig.destination = pair[1];
            synView.input()
            synController.submit()
        });
    }
}



function synonymSetup(){
    synController.setStaticButtons();    
    
}
