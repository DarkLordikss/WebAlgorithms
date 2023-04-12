const alphaParameter = 0.5; //phero
const bethaParameter = 4; //dist
const pathValueCoefficient = 300;
const evaporationRate = 0.10;
const defaultPheromone = 3;

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
* 	TO DO: OPTIMIZE DEFAULT PHEROMONE LEVEL
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

// is correct for integers; begin <= end
function randomInteger(begin, end) {
	return begin + Math.floor(Math.random() * (end - begin + 1));
}

// TO DO: FIND GOOD pathValueCoefficient AND evaporationRate
// returns new pheromone matrix. Path is array of all points' indexes
function updatePheromoneMatrix(pheromoneMatrix, path, pathLength) {
	if(!pheromoneMatrix || !path || !pathLength) {
		return;
	}
	let newPheromoneMatrix = new Array(pheromoneMatrix.length);
	for(let i = 0; i < pheromoneMatrix.length; i++) {
		newPheromoneMatrix[i] = new Array(pheromoneMatrix.length);
		for(let j = 0; j < pheromoneMatrix.length; j++) {
			newPheromoneMatrix[i][j] = {
				pheromone: pheromoneMatrix[i][j].pheromone * (1 - evaporationRate)**path.length,
				distance: pheromoneMatrix[i][j].distance,
			};
		}
	}
	let numberOfPoints = path.length - 1;
	for(let i = 0; i < numberOfPoints; i++) {
		let pheromoneDelta = pathValueCoefficient / pheromoneMatrix[path[i]][path[i+1]].distance;
		newPheromoneMatrix[path[i]][path[i+1]].pheromone += pheromoneDelta;
		newPheromoneMatrix[path[i+1]][path[i]].pheromone += pheromoneDelta;
	}
	return newPheromoneMatrix;
}

/*
*	Input: edge is ceil of adjacency matrix,
*	it has edge.pheromone and edge.distance.
*
*	Output: number
*/
// TO DO: FIND GOOD alphaParameter and bethaParameter
function antPriority(edge) {
	if(!edge) {
		return;
	}
	return (1/edge.distance)**bethaParameter * (edge.pheromone)**alphaParameter;
}

//sum(probabilityList) is 1, returns point's index
function randomPoint(probabilityList)
{
	if(!probabilityList) {
		return;
	} 
	let randomNumber = Math.random()*probabilityList.reduce((accum, a)=>{return accum+a;}, 0);
	let currentProbabilitySum = 0;
	for(let i = 0; i < probabilityList.length; i++) {
		if(currentProbabilitySum + probabilityList[i] >= randomNumber) {
			return i;
		}
		currentProbabilitySum += probabilityList[i];
	}
	return;
}

/*
*	Input: adjacency matrix of pairs {distance, pheromone}
*
*	Makes one ant path from random point 
*
*	Returns structure with obj.matrix, obj.path and obj.pathLength
*	obj.matrix is pheromone matrix same to input matrix
*	obj.path is array of points' numbers
*	obj.pathLength is sum of all distances during the path
*/
function antBasicIteration(pheromoneMatrix) {
	if(!pheromoneMatrix || !Array.isArray(pheromoneMatrix)) {
		return;
	}
	const numberOfPoints = pheromoneMatrix.length;
	let currentPoint = randomInteger(0, numberOfPoints - 1);
	let path = [];
	let pathLength = 0;
	let isPointVisited = new Array(pheromoneMatrix.length);
	isPointVisited.fill(false);
	isPointVisited[currentPoint] = true;
	path.push(currentPoint);
	for(let visitedCount = 1; visitedCount < numberOfPoints; visitedCount++) {
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
		let previousPoint = currentPoint;
		currentPoint = randomPoint(priorityList);
		path.push(currentPoint);
		pathLength += pheromoneMatrix[previousPoint][currentPoint].distance;
		isPointVisited[currentPoint] = true;
	}
	path.push(path[0]);
	console.log(path); //remove console log
	pathLength += pheromoneMatrix[path[numberOfPoints-1]][path[numberOfPoints]].distance;
	console.log(pathLength); //remove console log
	let newMatrix = updatePheromoneMatrix(pheromoneMatrix, path, pathLength);
	return { matrix: newMatrix, path, pathLength };
}


//console.log(makePheromoneMatrix([{x: 1, y: 2}, {x: 2, y: 0}, {x: 0, y: 0}]));
//for(let i = 0; i < 100; i++) { console.log(randomInteger(1, 10)); }
//
export {makePheromoneMatrix, antBasicIteration};