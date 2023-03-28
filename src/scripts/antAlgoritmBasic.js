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
	if(!vertexList || !vertexList.isArray()) {
		return;
	}
	const defaultPheromone = 3;
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
	const pathValueCoefficient = 1;
	const evaporationRate = 0.3;
	let newPheromoneMatrix = new Array(pheromoneMatrix.length);
	for(let i = 0; i < pheromoneMatrix.length; i++) {
		newPheromoneMatrix[i] = new Array(pheromoneMatrix.length);
		for(let j = 0; j < pheromoneMatrix.length; j++) {
			newPheromoneMatrix[i][j] = pheromoneMatrix[i][j] * (1 - evaporationRate);
		}
	}
	let numberOfPoints = path.length - 1;
	let pheromoneDelta = pathValueCoefficient / pathLength;
	for(let i = 0; i < numberOfPoints; i++) {
		newPheromoneMatrix[path[i]][path[i+1]] += pheromoneDelta;
		newPheromoneMatrix[path[i+1]][path[i]] += pheromoneDelta;
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
	const alphaParameter = 1;
	const bethaParameter = 2;
	return (1/edge.distance)**bethaParameter * (edge.pheromone)**alphaParameter;
}

//sum(probabilityList) is 1, returns point's index
function randomPoint(probabilityList)
{
	if(!probabilityList) {
		return;
	} 
	let randomNumber = Math.random();
	let currentProbabilitySum = 0;
	for(let i = 0; i < probabilityList.length; i++) {
		if(currentProbabilitySum + probabilityList[i] > randomNumber) {
			return i;
		}
		currentProbabilitySum += probabilityList[i];
	}
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
	if(!pheromoneMatrix || !pheromoneMatrix.isArray()) {
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
				let currentPriority = antPriority(matrix[currentPoint][i]);
				prioritySum += currentPriority;
				priorityList[i] = currentPriority;
			}
		}
		for(priority of priorityList) {
			priority /= prioritySum;
		}
		let previousPoint = currentPoint;
		currentPoint = randomPoint(priorityList);
		path.push(currentPoint);
		pathLength += pheromoneMatrix[previousPoint][currentPoint].distance;
		isPointVisited[currentPoint] = true;
	}
	path.push(path[0]);
	pathLength += pheromoneMatrix[path[numberOfPoints-1]][path[numberOfPoints-2]].distance;
	newMatrix = updatePheromoneMatrix(pheromoneMatrix, path, pathLength);
	return { matrix: newMatrix, path, pathLength };
}


//console.log(makePheromoneMatrix([{x: 1, y: 2}, {x: 2, y: 0}, {x: 0, y: 0}]));
//for(let i = 0; i < 100; i++) { console.log(randomInteger(1, 10)); }
//
export {makePheromoneMatrix, antBasicIteration};