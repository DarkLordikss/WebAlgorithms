// Возвращает путь в формате и все пройденные точки в формате:
// { goodPath: [оптимальный путьот стартовой точки (левый верхний угол)
//              до конечной точки (правый нижний угол)],
//   wandering: [все пройденные точки] }
//
// Точка возвращается в формате [i, j]
function aStarPathfinding(matrix) {
    if (matrix === undefined){
        return;
    }
    const start = [1, 1];
    console.log(matrix);
    const end = [matrix.length - 2, matrix[0].length - 2];

    function heuristic(node) {
        let dx = node[0] - end[0];
        let dy = node[1] - end[1];

        return Math.sqrt(dx*dx + dy*dy);
    }

    function isValidPosition(row, col) {
        return row >= 0 && row < matrix.length && col >= 0 && col < matrix[0].length && matrix[row][col] === 1;
    }

    function getNeighbors(node) {
        const [row, col] = node;
        let neighbors = [];

        if (isValidPosition(row - 1, col)) {
            neighbors.push([row - 1, col]);
        }

        if (isValidPosition(row, col - 1)) {
            neighbors.push([row, col - 1]);
        }

        if (isValidPosition(row + 1, col)) {
            neighbors.push([row + 1, col]);
        }

        if (isValidPosition(row, col + 1)) {
            neighbors.push([row, col + 1]);
        }

        return neighbors;
    }

    class PriorityQueue {
        constructor() {
            this.elements = [];
        }

        isEmpty() {
            return this.elements.length === 0;
        }

        enqueue(node, priority) {
            this.elements.push({node, priority});
            this.elements.sort((a, b) => a.priority - b.priority);
        }

        dequeue() {
            return this.elements.shift().node;
        }
    }

    let openSet = new PriorityQueue();
    let cameFrom = {};
    let visited = [];
    let gScore = {[start]: 0};
    let fScore = {[start]: heuristic(start)};

    openSet.enqueue(start, fScore[start]);

    function reconstructPath(current) {
        let path = [current];

        while (current in cameFrom) {
            current = cameFrom[current];
            path.unshift(current);
        }

        visited.push(end);
        return { goodPath: path,
                 wandering: visited };
    }

    while (!openSet.isEmpty()) {
        let current = openSet.dequeue();

        if (current[0] === end[0] && current[1] === end[1]) {
            return reconstructPath(current);
        }

        let currentScore = gScore[current] + heuristic(current);

        fScore[current] = currentScore;

        if (!(current in visited) || currentScore < fScore[cameFrom[current]]) {
            visited.push(current);

            let neighbors = getNeighbors(current);

            for (let neighbor of neighbors) {
                const neighborScore = gScore[current] + 1;
                if (!(neighbor in gScore) || neighborScore < gScore[neighbor]) {
                    gScore[neighbor] = neighborScore;
                    const neighborPriority = neighborScore + heuristic(neighbor);
                    openSet.enqueue(neighbor, neighborPriority);
                    cameFrom[neighbor] = current;
                }
            }
        }
    }

    return { goodPath: [],
             wandering: visited };
}

export {aStarPathfinding};