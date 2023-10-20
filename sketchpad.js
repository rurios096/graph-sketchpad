var graphLength = 0;
const radius = 20;
const adjacencyList = {};

const svg = d3.select('#graph-container');
var box = document.getElementById("graph-container");

box.addEventListener("click", function (event) {

    var xCoord = event.clientX - box.getBoundingClientRect().left;
    var yCoord = event.clientY - box.getBoundingClientRect().top;

    addVertex(xCoord, yCoord, graphLength);
    ++graphLength;
        
});

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