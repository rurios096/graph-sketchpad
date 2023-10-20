var graphLength = 0;
const radius = 20;
const adjacencyList = {};

const svg = d3.select('#graph-container');
var box = document.getElementById("graph-container");

box.addEventListener("click", function (event) {

    var xCoord = event.clientX - box.getBoundingClientRect().left;
    var yCoord = event.clientY - box.getBoundingClientRect().top;

    if (!findOverlap(xCoord, yCoord) && withinBox(xCoord, yCoord))
    {
        addVertex(xCoord, yCoord, graphLength);
        ++graphLength;
    }
        
});

function findOverlap(x, y) {

    const elements = box.querySelectorAll("*");

    for (const element of elements) {

        if('vertex' !== element.getAttribute('class')) continue;

        const xCoord = parseFloat(element.getAttribute('cx'))
        const yCoord = parseFloat(element.getAttribute('cy'))

        const distance = Math.sqrt((x - xCoord) ** 2 + (y - yCoord) ** 2);
        if(distance < radius * 2) return true
    }

    return false;
}

function withinBox(x, y) {
    if(y >= radius && x >= radius) return true;
    return false;
}

function addVertex(x, y, num)
{
    const vertexGroup = svg.append('g');

    const vertexElement = vertexGroup.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', radius)
    .attr('class', 'vertex')
    .style("cursor", "pointer")

    vertexGroup.append('text')
        .attr('x', x)
        .attr('y', + y + 5)
        .text('v' + num)
        .attr('text-anchor', 'middle')
        .style("fill", "white")
        .style("cursor", "pointer");

    /*vertexGroup
        .on('mouseover', function () {
            d3.select(this).transition()
                .transition('100')
                    .duration(800)
                .attr('opacity', '.70')
            })
        .on("mouseout", function () {
            d3.select(this).classed("hovered", false) // Remove the class on mouseout
            d3.select(this).transition()
                .attr('opacity', '1')
        });
        */      
    adjacencyList[num] = [];
}