const radius = 23;
const adjacencyList = {};
var graphLength = 0;
var edgeNum = 0;
var vButtonToggle = false;
var eButtonToggle = false;
var dButtonToggle = false;
var foundVertex1 = false;
var foundVertex2 = false;
var selectedColor = "#008000";

const svg = d3.select('#graph-container');
var box = document.getElementById("graph-container");

var vButtonState = document.getElementById("vButton");
var eButtonState = document.getElementById("eButton");
var dButtonState = document.getElementById("dButton");

var colorBox = document.getElementById("colorPicker");

const drag = d3.drag()
    .on("start", dragStart)
    .on("drag", draggingVertex)
    .on("end", dragEnd);

const linkGen = d3.line()
        .x(d => d[0])
        .y(d => d[1])
        .curve(d3.curveCardinal.tension(0));

//.curve(d3.curveCardinal.tension(0.1));
function dragStart(event){
    
}

function dragEnd(event){
}

function draggingVertex(event){

    var xCoord = event.x;
    var yCoord = event.y;

    const draggedElement = d3.select(this);
    if(draggedElement.attr('class') === 'vertex')
    {
        draggedShape = draggedElement.select('circle')
        draggedLabel = draggedElement.select('text')
    
        const xDiff = (draggedShape.attr("cx") - xCoord);
        const yDiff = (draggedShape.attr("cy") - yCoord);

        draggedShape.attr("cx", xCoord);
        draggedShape.attr("cy", yCoord);
        draggedLabel.attr("x", xCoord);
        draggedLabel.attr("y", yCoord + 7);
    
        if (adjacencyList[draggedElement.attr("id")] !== undefined) 
        {
            if(adjacencyList[draggedElement.attr('id')].length !== 0) updatePath(draggedElement.attr('id'), xDiff, yDiff);
        }
    }

}
colorBox.addEventListener("change", function(event)
{
    selectedColor = event.target.value;
});

box.addEventListener("click", function (event) {

    var xCoord = event.clientX - box.getBoundingClientRect().left;
    var yCoord = event.clientY - box.getBoundingClientRect().top;
    console.log("x: " + xCoord + " y: " + yCoord)

    if (withinBox(xCoord, yCoord)){

        if(vButtonToggle && !findOverlap(xCoord, yCoord))
        {
            addVertex(xCoord, yCoord, graphLength);
            ++graphLength;
        }
        else if(dButtonToggle)
        {
            var foundElem = findOverlap(xCoord, yCoord, 0);
            if(foundElem[0] === 'v') deleteVertex(foundElem); // found vertex

            foundElem = findOverlap(xCoord, yCoord, 1);
            if(foundElem[0] === 'e') deleteEdge(foundElem); // found edge
        }
        else if(eButtonToggle)
        {
            if(!foundVertex1){ // new/first
                foundVertex1 = findOverlap(xCoord, yCoord);
                return;
            }

            if (!foundVertex2){
                foundVertex2 = findOverlap(xCoord, yCoord);
            }

            if(foundVertex1 && foundVertex2) addEdge(foundVertex1, foundVertex2); // found 2 vertices
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
    if(!eButtonToggle) foundVertex1 = foundVertex2 = false;
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
            eButtonToggle = vButtonToggle = false;
            break;
      }
}

function findOverlap(x, y, z){

    const elements = box.querySelectorAll("*");

    for (const element of elements) {

        if('vertex' === element.getAttribute('class'))
        {
            const vertexGroup = d3.select(element);
            const vertexShape = vertexGroup.select('.vertexShape');
    
            const xCoord = parseFloat(vertexShape.attr('cx'))
            const yCoord = parseFloat(vertexShape.attr('cy'))
    
            const distance = Math.sqrt((x - xCoord) ** 2 + (y - yCoord) ** 2);
            if(distance <= radius) return vertexGroup.attr('id')
        }
        else if('edge' === element.getAttribute('class') && z === 1)
        {
            const edgeMid = d3.select(element);

            const xCoord = parseFloat(edgeMid.attr('cx'))
            const yCoord = parseFloat(edgeMid.attr('cy'))

            const distance = Math.sqrt((x - xCoord) ** 2 + (y - yCoord) ** 2);
            if(distance <= radius) return edgeMid.attr('id')
        }
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

    const vertexGroup = svg.append('g')
        .attr('class', 'vertex')
        .attr('id', vID);

    const vertexElement = vertexGroup.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', radius)
        .attr('class', 'vertexShape')
        .style("cursor", "pointer")
        .style("fill", selectedColor);

    vertexGroup.append('text')
        .attr('x', x)
        .attr('y', y + 7)
        .text('v' + num)
        .attr('class', 'vertexLabel')
        .attr('text-anchor', 'middle')
        .style("fill", "white")
        .style("cursor", "pointer");
     

    adjacencyList[vID] = [];

    const draggableVertex = d3.select('#' + vID);
    draggableVertex.call(drag)
}

function updateMidPath(id, x, y){

    const edgePath = d3.select('#' + id);

    const pathData = edgePath.data() // [ [x1,y1], [midx,midy], [x2,y2] ]
    pathData[0][1] = [x, y]

    edgePath.attr("d", linkGen(pathData[0]));
}

function updatePath(id, x, y){

    const vGroup = d3.select('#' + id);
    const vShape = vGroup.select('.vertexShape');

    for(const nPair of adjacencyList[id]){
        const nGroup = d3.select('#' + nPair[0]);
        const nShape = nGroup.select('.vertexShape');

        var path = d3.select('#' + nPair[1]) // edge

        var newPathData = []
        if(nGroup.attr('id') !== id) {
            newPathData = getArcPoint(vShape.attr('cx'), vShape.attr('cy'), nShape.attr('cx'), nShape.attr('cy'));
        }
        else {
            newPathData = createLoop(vShape.attr('cx'), vShape.attr('cy'));
        }

        path
            .data([newPathData])
            .attr("d", linkGen(newPathData)); 

        var midPath = d3.select('#' + nPair[1] + 'm')
            .attr('cx', newPathData[1][0])
            .attr('cy', newPathData[1][1]);
    }
}

function getArcPoint(vx1, vy1, vx2, vy2)
{
    const xCoord1 = parseFloat(vx1);
    const yCoord1 = parseFloat(vy1);
    const xCoord2 = parseFloat(vx2);
    const yCoord2 = parseFloat(vy2);

    var angle1 = Math.atan2(yCoord2 - yCoord1, xCoord2 - xCoord1);
    var angle2 = Math.atan2(yCoord1 - yCoord2 , xCoord1 - xCoord2);

    const x1 = xCoord1 + radius * Math.cos(angle1)
    const y1 = yCoord1 + radius * Math.sin(angle1)
    const x2 = xCoord2 + radius * Math.cos(angle2)
    const y2 = yCoord2 + radius * Math.sin(angle2)

    const xMid = (x2 + x1) / 2;
    const yMid = (y2 + y1) / 2;

    var pathData = [
        [x1.toFixed(2),y1.toFixed(2)],
        [xMid, yMid],
        [x2.toFixed(2),y2.toFixed(2)]
    ];

    return pathData
}

function addNeighbor(vertex, neighbor, edge){
    // if (adjacencyList[vertex] includes([neighbor, any])) // parallel edge
    // {
    //     return;
    // }
    adjacencyList[vertex].push([neighbor, edge]);
    
}

function createLoop(x, y)
{
    const xCoord = parseFloat(x);
    const yCoord = parseFloat(y);

    var angle1 = 240 * (Math.PI / 180)
    var angle2 = 300 * (Math.PI / 180)

    const x1 = xCoord + radius * Math.cos(angle1)
    const y1 = yCoord + radius * Math.sin(angle1)

    const x2 = xCoord + radius * Math.cos(angle2)
    const y2 = y1

    const xMid = (x2 + x1) / 2;
    const yMid = y1 - 10

    var pathData = [
        [x1.toFixed(2),y1.toFixed(2)],
        [xMid, yMid],
        [x2.toFixed(2),y2.toFixed(2)]
    ];

    return pathData
}

function addEdge(id1, id2){

    const eID = 'e' + edgeNum;
    const mID = eID + 'm';

    if(id1 !== id2)
    {
        var vertexGroup1 = d3.select('#' + id1);
        var vertexGroup2 = d3.select('#' + id2);
    
        const vertexShape1 = vertexGroup1.select('.vertexShape');
        const vertexShape2 = vertexGroup2.select('.vertexShape');
    
        const pathData = getArcPoint(vertexShape1.attr('cx'), vertexShape1.attr('cy'), vertexShape2.attr('cx'), vertexShape2.attr('cy'));
    
        const edge = svg.append('path')
            .data([pathData])
            .attr("d", linkGen(pathData))
            .attr("id", eID)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 3)
            .attr('stroke-linecap', 'round');        
        
        const midEdge = svg.append('circle')
            .attr('cx', pathData[1][0])
            .attr('cy', pathData[1][1])
            .attr('r', 4)
            .attr('class', 'edge')
            .attr("id", mID)
            .style("cursor", "pointer")
            .style("fill", 'black');
    
        ++edgeNum;
        foundVertex1 = foundVertex2 = false;
        addNeighbor(id1, id2, eID);
        addNeighbor(id2, id1, eID);
    }
    else // self loop
    {
        var vertexGroup = d3.select('#' + id1);
        const vertexShape = vertexGroup.select('.vertexShape');
    
        const pathData = createLoop(vertexShape.attr('cx'), vertexShape.attr('cy'));
    
        const edge = svg.append('path')
            .data([pathData])
            .attr("d", linkGen(pathData))
            .attr("id", eID)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 3)
            .attr('stroke-linecap', 'round');        
        
        const midEdge = svg.append('circle')
            .attr('cx', pathData[1][0])
            .attr('cy', pathData[1][1])
            .attr('r', 4)
            .attr('class', 'edge')
            .attr("id", mID)
            .style("cursor", "pointer")
            .style("fill", 'black');
    
        ++edgeNum;
        foundVertex1 = foundVertex2 = false;
        addNeighbor(id1, id1, eID);
    }

}

function deleteVertex(id){
    var vertexGroup = d3.select('#' + id);

    for (const vertex in adjacencyList){
        var updatedList = [];

        for(const pair of adjacencyList[vertex])
        {
            if (pair[0] !== id) // neighbor isn't vertex
            {
                updatedList.push(pair)
            }
            else{
                var removeEdge = d3.select('#' + pair[1]);
                var removeMidEdge = d3.select('#' + pair[1] + 'm');
                removeEdge.remove();
                removeMidEdge.remove();
            }
        }

        adjacencyList[vertex] = updatedList;
    }

    delete adjacencyList[id];
    vertexGroup.remove();
}

function deleteEdge(id){

    edgeID = id.slice(0, -1);

    for (const vertex in adjacencyList){
        var updatedList = [];

        for(const pair of adjacencyList[vertex])
        {
            if (pair[1] !== edgeID) // isn't edge
            {
                updatedList.push(pair)
            }

            else{ //if (vertex === pair[0]) { // self loop
                var removeEdge = d3.select('#' + pair[1]);
                var removeMidEdge = d3.select('#' + pair[1] + 'm');
                removeEdge.remove();
                removeMidEdge.remove();
            }
        }

        adjacencyList[vertex] = updatedList;
    }

}