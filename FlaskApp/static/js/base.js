var onloads = [];

window.onload = function() {
    visual.resize();
    visual.currentPage();
    console.log(onloads.length);
    for(var i = 0; i<onloads.length; i++)
    {
        onloads[i]();
    }
};
