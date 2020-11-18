
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global d3 */

var width = 400,
    height = 400;

var margin = {
    top: 100,
    right: 0,
    bottom: 0,
    left: 30
};

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var xScale = d3.scaleLinear()
    .range([margin.left, width - margin.right]);

var yScale = d3.scaleBand()
    .range([margin.top, height - margin.bottom])
    .paddingInner(0.2);

var yAxis = d3.axisLeft(yScale)
    .tickSizeOuter(0);

var letters = "ABCDEFGHIJ".split("");

var color = d3.scaleSequential(d3.interpolateViridis)
    .domain([0, letters.length]);

svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis);

draw();
d3.select("#updateButton")
    .on("click", draw);

function draw() {

    var data = getData();

    xScale.domain([0, d3.max(data, function (d) {
        return d.value;
    })]);
    yScale.domain(data.map(function (d) {
        return d.title;
    }));

    var bars = svg.selectAll(".bars")
        .data(data, function (d) {
            return d.title;
        });

    bars.exit()
        //.transition()
        //.duration(1000)
        //.attr("width", 0)
        .remove();

    bars.enter()
        .append("rect")
        .attr("class", "bars")
        .attr("x", xScale(0) + 1)
        .attr("y", function (d) {
            return yScale(d.title);
        })
        .attr("width", 0)
        .attr("height", yScale.bandwidth())
        .attr("fill", function (d) {
            return color(letters.indexOf(d.title) + 1);
        })
        .merge(bars).transition()
        .duration(1000)
        //.delay(1000)
        .attr("y", function (d) {
            return yScale(d.title);
        })
        .attr("width", function (d) {
            return xScale(d.value) - margin.left;
        });

    d3.select(".y.axis")
        .transition()
        .duration(1000)
        //.delay(1000)
        .call(yAxis);
}

function getData() {
    var title = "ABCDEFGHIJ".split("");
    var data = [];
    for (var i = 0; i < 5; i++) {
        var index = Math.floor(Math.random() * title.length);
        data.push({
            title: title[index],
            value: Math.floor(Math.random() * 100)
        });
        title.splice(index, 1);
    }
    data = data.sort(function (a, b) {
        return d3.descending(a.value, b.value);
        //return d3.ascending(a.title, b.title);
    });
    return data;
}




