var graphLength = 0;
const radius = 23;
const adjacencyList = {};
var vButtonToggle = false;
var eButtonToggle = false;
var dButtonToggle = false;
var selectedColor = "#008000";

const svg = d3.select('#graph-container');
var box = document.getElementById("graph-container");

var vButtonState = document.getElementById("vButton");
var eButtonState = document.getElementById("eButton");
var dButtonState = document.getElementById("dButton");

var colorBox = document.getElementById("colorPicker");

colorBox.addEventListener("change", function(event)
{
    selectedColor = event.target.value;
});

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
    changeButton(vButtonState, vButtonToggle);
    vButtonToggle = !vButtonToggle;
});

eButtonState.addEventListener("click", function (event) {
    changeButton(eButtonState, eButtonToggle);
    eButtonToggle = !eButtonToggle;
});

dButtonState.addEventListener("click", function (event) {

    changeButton(dButtonState, dButtonToggle);
    dButtonToggle = !dButtonToggle;
});

function changeButton(state, toggle){

    if(toggle)  // active/clicked -> not
    {
        toInactiveButton(state)
    }
    else{  // not active/clicked  -> yes
        unclickButtons(state.id);
        state.style.backgroundColor = "rgb(210, 210, 210)";
        state.style.borderColor = "rgb(87, 87, 87)";
        state.style.fontWeight = "1000";
    }
}

function toInactiveButton(state){
    state.style.backgroundColor = "white";
    state.style.borderColor = "rgb(164, 164, 164)";
    state.style.fontWeight = "100";
}

function unclickButtons(stateID){
    switch (stateID) {
        case "vButton":
            if(eButtonToggle) toInactiveButton(eButtonState);
            if(dButtonToggle) toInactiveButton(dButtonState);
            eButtonToggle = dButtonToggle = false;
            break;
        case "eButton":
            if(vButtonToggle) toInactiveButton(vButtonState);
            if(dButtonToggle) toInactiveButton(dButtonState);
            vButtonToggle = dButtonToggle = false;
            break;
        case "dButton":
            if(eButtonToggle) toInactiveButton(eButtonState);
            if(vButtonToggle) toInactiveButton(vButtonState);
            eButtonToggle = eButtonToggle = false;
            break;
      }
}





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
    const vID = 'v' + num;

    const vertexGroup = svg.append('g');

    const vertexElement = vertexGroup.append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', radius)
    .attr('class', 'vertex')
    .attr('id', vID)
    .style("cursor", "pointer")
    .style("fill", selectedColor);

    vertexGroup.append('text')
        .attr('x', x)
        .attr('y', + y + 7)
        .text('v' + num)
        .attr('class', 'vertexLabel')
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