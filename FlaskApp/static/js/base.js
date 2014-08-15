var onloads = [];

window.onload = function() {
    visual.resize();
    visual.currentPage();
    for(var i = 0; i<onloads.length; i++)
    {
        onloads[i]();
    }
};
