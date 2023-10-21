var graphLength = 0;
const radius = 20;
const adjacencyList = {};
var vButtonToggle = false;
var eButtonToggle = false;

const svg = d3.select('#graph-container');
var box = document.getElementById("graph-container");
var vButtonState = document.getElementById("vButton");
var eButtonState = document.getElementById("eButton");


box.addEventListener("click", function (event) {

    var xCoord = event.clientX - box.getBoundingClientRect().left;
    var yCoord = event.clientY - box.getBoundingClientRect().top;

    if (!findOverlap(xCoord, yCoord) && withinBox(xCoord, yCoord)){

        if(vButtonToggle)
        {
            addVertex(xCoord, yCoord, graphLength);
            ++graphLength;
        }   
    }
});

vButtonState.addEventListener("click", function (event) {

    var vButtonState = document.getElementById("vButton");

    if(vButtonToggle) // not active/clicked
    {
        vButtonToggle = false;
        vButtonState.style.backgroundColor = "white";
        vButtonState.style.borderColor = "rgb(164, 164, 164)";
        vButtonState.style.fontWeight = "100";
    }
    else{  // active/clicked
        if(eButtonToggle)
        {
            eButtonToggle = true;
            eButtonState.click();
        }
        vButtonToggle = true;
        vButtonState.style.backgroundColor = "rgb(210, 210, 210)";
        vButtonState.style.borderColor = "rgb(87, 87, 87)"
        vButtonState.style.fontWeight = "1000";
    }
    
});

eButtonState.addEventListener("click", function (event) {

    var eButtonState = document.getElementById("eButton");

    if(eButtonToggle)  // not active/clicked
    {
        eButtonToggle = false;
        eButtonState.style.backgroundColor = "white";
        eButtonState.style.borderColor = "rgb(164, 164, 164)";
        eButtonState.style.fontWeight = "100";
    }
    else{  // active/clicked
        if(vButtonToggle)
        {
            vButtonToggle = true;
            vButtonState.click();
        }
        eButtonToggle = true;
        eButtonState.style.backgroundColor = "rgb(210, 210, 210)";
        eButtonState.style.borderColor = "rgb(87, 87, 87)";
        eButtonState.style.fontWeight = "1000";
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