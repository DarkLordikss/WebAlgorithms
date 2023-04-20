const alphaParameter = 1; //phero
const bethaParameter = 3; //dist
const pathValueCoefficient = 450; //near average edge length
const evaporationRate = 0.35;  //0.5 isn't good
const defaultPheromone = 3;  // always is more then zero

// points are objects with obj.x, obj.y
function countDistance(point1, point2) {
    if(!point1 || !point2) {
        return;
    }
    return ((point1.x - point2.x)**2 + (point1.y - point2.y)**2)**0.5;
}


/*
*	Input: array of points (objects with properties obj.x and obj.y)
*
*	This function makes adjacency matrix, where matrix[i][j] value is pair of 
*	distance and pheromone value (obj.distance, obj.pheromone).
*	The order of points is preserved.
*/
function makePheromoneMatrix(vertexList) {
    if(!vertexList || !Array.isArray(vertexList)) {
        return;
    }
    let matrixSize = vertexList.length;
    let pheromoneMatrix = new Array(matrixSize);
    for(let i = 0; i < matrixSize; i++) {
        pheromoneMatrix[i] = new Array(matrixSize);
    }
    for(let i = 0; i < matrixSize; i++) {
        for(let j = i; j < matrixSize; j++) {
            pheromoneMatrix[i][j] = {
                distance: countDistance(vertexList[i], vertexList[j]),
                pheromone: defaultPheromone,
            };
            pheromoneMatrix[j][i] = pheromoneMatrix[i][j];
        }
    }
    return pheromoneMatrix;
}

// modifies matrix after one ant step
function updatePheromoneMatrix(pheromoneMatrix, vertex1, vertex2) {
    if(!pheromoneMatrix || vertex1.isNaN || vertex2.isNaN) {
        return;
    }
    let pheromoneDelta = pathValueCoefficient / pheromoneMatrix[vertex1][vertex2].distance;
    pheromoneMatrix[vertex1][vertex2].pheromone += pheromoneDelta;
    pheromoneMatrix[vertex2][vertex1].pheromone += pheromoneDelta;
}

// use after everyone's step, modifies matrix
function evaporatePheromones(pheromoneMatrix) {
    if(!pheromoneMatrix) {
        return;
    }
    for(let i = 0; i < pheromoneMatrix.length; i++) {
        for(let j = 0; j < pheromoneMatrix.length; j++) {
            pheromoneMatrix[i][j].pheromone *= (1 - evaporationRate);
        }
    }
}

/*
*	Input: edge is ceil of adjacency matrix,
*	it has edge.pheromone and edge.distance.
*
*	Output: number
*/
function antPriority(edge) {
    if(!edge) {
        return;
    }
    return (1/edge.distance)**bethaParameter * (edge.pheromone)**alphaParameter;
}

//sum(probabilityList) is near 1 (fixed), returns point's index
function randomPoint(probabilityList)
{
    if(!probabilityList) {
        return;
    } 
    let randomNumber = Math.random()*probabilityList.reduce((accum, a)=>{
                                                                return accum+a;
                                                            }, 0);
    let currentProbabilitySum = 0;
    for(let i = 0; i < probabilityList.length; i++) {
        if(currentProbabilitySum + probabilityList[i] >= randomNumber) {
            return i;
        }
        currentProbabilitySum += probabilityList[i];
    }
    return;
}

//use "new Ant(vertex)" in code, has path and pathLength fields
function Ant(startVertex = 0) {
    this.path = [ startVertex ];
    this.pathLength = 0;
    return this;
}

/*
*	Input: adjacency matrix of pairs {distance, pheromone}, ant (object made by "new Ant(vertex)")
*	Makes one ant step from previous point 
*/
function antBasicIteration(pheromoneMatrix, ant) {
    if(!ant || !Array.isArray(pheromoneMatrix)) {
        return;
    }
    const numberOfPoints = pheromoneMatrix.length;
    let currentPathLength = ant.path.length;
    if(currentPathLength > numberOfPoints) {
        ant.path = [ ant.path[0] ];
//		console.log(ant.pathLength);
		ant.pathLength = 0;
        currentPathLength = 1;
    }
    if(currentPathLength == numberOfPoints) {
        ant.path.push(ant.path[0]);
    } else {
        const currentPoint = ant.path[currentPathLength - 1];
        let isPointVisited = new Array(pheromoneMatrix.length);
        isPointVisited.fill(false);
        for(let point of ant.path) {
            isPointVisited[point] = true;
        }
        let prioritySum = 0;
        let priorityList = new Array(numberOfPoints);
        for(let i = 0; i < numberOfPoints; i++) {
            if(isPointVisited[i]) {
                priorityList[i] = 0;
            } else {
                let currentPriority = antPriority(pheromoneMatrix[currentPoint][i]);
                prioritySum += currentPriority;
                priorityList[i] = currentPriority;
            }
        }
        for(let priority of priorityList) {
            priority /= prioritySum;
        }
        ant.path.push(randomPoint(priorityList));
    }
    ant.pathLength += pheromoneMatrix[ant.path[currentPathLength]]
                                     [ant.path[currentPathLength-1]].distance;
}

/*
* input: pheromoneMatrix (modifies by function!!!!!!),
* array of "new Ant(v)" objects
* output: undefined
*/
function algoBasicIteration(pheromoneMatrix, antList) {
    if(!Array.isArray(pheromoneMatrix) || !Array.isArray(antList)) {
        return;
    }
	for(let ant of antList) {
        antBasicIteration(pheromoneMatrix, ant);
        updatePheromoneMatrix(pheromoneMatrix, ant.path[ant.path.length-1],
                              ant.path[ant.path.length-2]);
    }
    evaporatePheromones(pheromoneMatrix);
}

export {makePheromoneMatrix, Ant, algoBasicIteration};