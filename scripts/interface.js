//les labels

//les boutons
load_wasabi = document.querySelector('#load_wasabi');
process_data = document.querySelector('#process_data');
draw_graph = document.querySelector('#draw_graph');
nbMaj = 0;


load_wasabi.addEventListener('click', event => {
    getWasabiData(function(){
        setStatus(wasabiData.length+" données chargées")
        load_wasabi.hidden = true;
        process_data.hidden = false;
    });
    setStatus("Téléchargement...");
});

process_data.addEventListener('click', event => {
    setStatus("Processing...");
    pipeline(function(){
        setStatus(actualData.length+" données chargées")
        process_data.hidden = true;
        draw_graph.hidden = false;
    });
});

draw_graph.addEventListener('click', event => {
    setStatus("Drawing");
    /*drawGraph(function(){
        setStatus(finalData.length+" données dessinées")
        process_data.hidden = true;
        draw_graph.hidden = true;
    });*/
    drawGraph(function(){
        setStatus("La graph a bien été dessiné");
    });
    drawFacet();
});

function onLoad(){
    process_data.hidden = true;
    draw_graph.hidden = true;
}

function setStatus(message){
    $("#status").text(message);
}

function drawGraph(callback){
    chart = d3.parsets()
        .dimensions(["location", "fini","genre"]);

    vis = d3.select("#vis").append("svg")
        .attr("width", chart.width())
        .attr("height", chart.height());
    vis.datum(finalData).call(chart);
        callback()
}

function refreshData() {
    vis.datum(finalData).call(chart);
}

