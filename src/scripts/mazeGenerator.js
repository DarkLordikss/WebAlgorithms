// Лабиринт представляет из себя матрицу размера n * 2 + 1, где n - размер,
// который хочет пользователь. 0 - прохода нет, 1 - проход есть. Сами клетки
// расположены на нечетных i и j, а на всех остальных местах стены или проходы,
// поэтому необходимо отмечать стены, клетки и проходы разными цветами.
// Сама же функция возвращает объект типа { maze: [лабиринт],
//                                          wandering: [клетки, по которым прошел алгоритм, пробивая стены,
//                                                      в местах где они есть] }
// Формат клетки в wandering: [i, j]
function generateMaze(n) {
    if (n == undefined){
        return;
    }

    const size = 2 * n + 1;
    let visitedCount = 0;

    let maze = new Array(size).fill(0).map(() => new Array(size).fill(0));
    let points = [];
    let visited = new Array(size).fill(0).map(() => new Array(size).fill(0));

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (i % 2 !== 0 && j % 2 !== 0) maze[i][j] = 1;
        }
    }

    let current = {
        x: 1,
        y: 1
    };

    let wandering = [];

    while (visitedCount < n*n) {
        let neibs = getNear(current, visited, size);
        wandering.push([current.x, current.y]);

        if (neibs.length !== 0) {
            points.push(current);

            let newPoint = neibs[Math.floor(Math.random() * neibs.length)];

            if (newPoint.x < current.x) maze[newPoint.x + 1][newPoint.y] = 1;
            else if (newPoint.x > current.x) maze[newPoint.x - 1][newPoint.y] = 1;
            else if (newPoint.y < current.y) maze[newPoint.x][newPoint.y + 1] = 1;
            else if (newPoint.y > current.y) maze[newPoint.x][newPoint.y - 1] = 1;

            visited[newPoint.x][newPoint.y] = 1;
            visitedCount += 1;
            current = newPoint;
        }
        else if (points.length !== 0) {
            current = points.pop();
        }
        else {
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (i % 2 !== 0 && j % 2 !== 0 && visited[i][j] === 0) {
                        current.x = j;
                        current.y = i;
                    }
                }
            }
        }
    }

    wandering.push([current.x, current.y]);
    return { maze: maze,
        wandering: wandering };
}


function getNear(point, visited, size) {
    let neibs = []

    if (point.y - 2 >= 0) {
        if (!visited[point.x][point.y - 2]) {
            neibs.push({
                x: point.x,
                y: point.y - 2
            });
        }
    }

    if (point.x + 2 < size) {
        if (!visited[point.x + 2][point.y]) {
            neibs.push({
                x: point.x + 2,
                y: point.y
            });
        }
    }

    if (point.y + 2 < size) {
        if (!visited[point.x][point.y + 2]) {
            neibs.push({
                x: point.x,
                y: point.y + 2
            });
        }
    }

    if (point.x - 2 >= 0) {
        if (!visited[point.x - 2][point.y]) {
            neibs.push({
                x: point.x - 2,
                y: point.y
            });
        }
    }

    return neibs;
}

export {generateMaze};