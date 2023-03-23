function generateMaze(n) {
    const maze = [];
    for (let i = 0; i < n; i++) {
        maze.push([]);
        for (let j = 0; j < n; j++) {
            maze[i].push(1);
        }
    }

    const startRow = Math.floor(Math.random() * n);
    const startCol = Math.floor(Math.random() * n);
    maze[startRow][startCol] = 0;

    const borders = [];
    const visited = [];

    for (let i = 0; i < n; i++) {
        borders.push([i, 0]);
        borders.push([i, n-1]);
        borders.push([0, i]);
        borders.push([n-1, i]);
        visited.push([]);
        for (let j = 0; j < n; j++) {
            visited[i].push(false);
        }
    }

    visited[startRow][startCol] = true;

    while (borders.length > 0) {
        const borderIndex = Math.floor(Math.random() * borders.length);
        const [row, col] = borders[borderIndex];
        borders.splice(borderIndex, 1);

        const neighbors = [];

        if (row > 0 && !visited[row-1][col]) {
            neighbors.push([row-1, col]);
        }

        if (row < n-1 && !visited[row+1][col]) {
            neighbors.push([row+1, col]);
        }

        if (col > 0 && !visited[row][col-1]) {
            neighbors.push([row, col-1]);
        }

        if (col < n-1 && !visited[row][col+1]) {
            neighbors.push([row, col+1]);
        }

        if (neighbors.length > 0) {
            const neighborIndex = Math.floor(Math.random() * neighbors.length);
            const [nRow, nCol] = neighbors[neighborIndex];

            visited[nRow][nCol] = true;

            if (nRow === row) {
                maze[row][Math.min(col, nCol)+1] = 0;
            } else {
                maze[Math.min(row, nRow)+1][col] = 0;
            }

            if (nRow > 0 && !visited[nRow-1][nCol]) {
                borders.push([nRow-1, nCol]);
            }
            if (nRow < n-1 && !visited[nRow+1][nCol]) {
                borders.push([nRow+1, nCol]);
            }
            if (nCol > 0 && !visited[nRow][nCol-1]) {
                borders.push([nRow, nCol-1]);
            }
            if (nCol < n-1 && !visited[nRow][nCol+1]) {
                borders.push([nRow, nCol+1]);
            }
        }
    }

    return maze;
}
