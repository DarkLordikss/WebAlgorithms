//Считает дистастанцию между 2 городами
function calculateDistance(city1, city2) {
    const xDiff = city1[0] - city2[0];
    const yDiff = city1[1] - city2[1];
    return Math.sqrt(xDiff ** 2 + yDiff ** 2);
}

//Выводит показатель пригодности пути (обратная величина длины)
function calculateFitness(route) {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
        const currentCity = route[i];
        const nextCity = route[i + 1];
        totalDistance += calculateDistance(currentCity, nextCity);
    }
    totalDistance += calculateDistance(route[route.length - 1], route[0]);
    return 1 / totalDistance;
}

//Cоздает начальную популяцию особей. Функция возвращает массив особей,
//где каждая особь представляет собой случайный маршрут через все города из cityList.
function createInitialPopulation(cityList, populationSize) {
    const population = [];
    for (let i = 0; i < populationSize; i++) {
        let route = cityList.slice();
        for (let j = 0; j < route.length; j++) {
            const randomIndex = Math.floor(Math.random() * route.length);
            const temp = route[j];
            route[j] = route[randomIndex];
            route[randomIndex] = temp;
        }
        population.push(route);
    }
    return population;
}

//Отбирает наиболее приспособленные особи из популяции с использованием метода рулетки.
//функция выбирает двух родительских особей, используя метод рулетки.
//Она генерирует случайное число в диапазоне от 0 до 1 и сравнивает его с вероятностью выбора каждой особи
//в порядке их расположения в массиве population. Когда сгенерированное случайное число становится меньше или
//равным вероятности выбора текущей особи, эта особь выбирается в качестве одного из родительских особей.
//Этот процесс повторяется до тех пор, пока не будут выбраны две родительские особи.
function selection(population) {
    const fitnessScores = population.map(route => calculateFitness(route));
    const totalFitness = fitnessScores.reduce((a, b) => a + b, 0);
    const selectionProbabilities = fitnessScores.map(score => score / totalFitness);
    const selectedParents = [];
    while (selectedParents.length < 2) {
        let rouletteValue = Math.random();
        for (let i = 0; i < population.length; i++) {
            rouletteValue -= selectionProbabilities[i];
            if (rouletteValue <= 0) {
                selectedParents.push(population[i]);
                break;
            }
        }
    }
    return selectedParents;
}

//Функция выбирает случайную точку разреза в маршруте каждого из родителей,
//а затем создает нового потомка, выбирая гены до точки разреза от одного родителя и гены после точки разреза от другого родителя.
//Возвращает ребенка
function crossover(parent1, parent2) {
    const child = Array(parent1.length).fill(null);
    const subsetStart = Math.floor(Math.random() * parent1.length);
    const subsetEnd = Math.floor(Math.random() * (parent1.length - subsetStart)) + subsetStart;
    for (let i = subsetStart; i <= subsetEnd; i++) {
        child[i] = parent1[i];
    }
    let parent2Index = 0;
    for (let i = 0; i < child.length; i++) {
        if (child[i] === null) {
            while (child.includes(parent2[parent2Index])) {
                parent2Index++;
            }
            child[i] = parent2[parent2Index];
            parent2Index++;
        }
    }
    return child;
}

//Функция случайным образом меняет два города местами в маршруте с вероятностью, заданной коэффициентом мутации.
function mutate(route, mutationRate) {
    for (let i = 0; i < route.length; i++) {
        if (Math.random() < mutationRate) {
            const randomIndex = Math.floor(Math.random() * route.length);
            const temp = route[i];
            route[i] = route[randomIndex];
            route[randomIndex] = temp;
        }
    }
    return route;
}

//Производит эволюцию популяции, создавая новое поколение особей. Функция выбирает двух родителей из текущей популяции,
//используя метод рулетки, и создает новых потомков. Затем функция производит мутацию новых потомков.
function evolve(population, mutationRate) {
    const newPopulation = [];
    while (newPopulation.length < population.length) {
        const [parent1, parent2] = selection(population);
        const child = crossover(parent1, parent2);
        const mutatedChild = mutate(child, mutationRate);
        newPopulation.push(mutatedChild);
    }
    return newPopulation;
}

//Считает дистанцию лучшего пути
function calculateTotalDistance(route) {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
        const [x1, y1] = route[i];
        const [x2, y2] = route[i + 1];
        totalDistance += Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    return totalDistance;
}

//Функция внаходит лучший путь в процессе эволюции
//На вход нужно: список городов в формате [x, y], размер популяции, количество поколений, шанс мутации.
//Выход: { bestRoute: наикратчайший путь как список городов [x, y],
//         bestRouteLen: длина наикратчайшего пути
//         allRoutes: список списков списков городов [x, y] (я больной, лечите), найденных за поколение.
//         bestOnIteration: лучший путь на каждой итерации,
//         bestWaysOnIterationsLens: длина лучшего пути на текущей итерации
//       }
function findShortestRouteGen(cityList, populationSize, generations, mutationRate) {
    const allRoutes = [];
    let currentPopulation = createInitialPopulation(cityList, populationSize);
    let shortestRoute = currentPopulation[0];
    let bestRoutes = [];
    let bestWayLens = [];

    for (let i = 0; i < generations; i++) {
        currentPopulation = evolve(currentPopulation, mutationRate);
        const bestRoute = currentPopulation.reduce((best, current) => {
            const bestFitness = calculateFitness(best);
            const currentFitness = calculateFitness(current);
            return currentFitness > bestFitness ? current : best;
        });
        if (calculateFitness(bestRoute) > calculateFitness(shortestRoute)) {
            shortestRoute = bestRoute;
        }
        allRoutes.push(currentPopulation);
        bestRoutes.push(bestRoute);
        bestWayLens.push(calculateTotalDistance(bestRoute));
    }
    return {
        bestRoute: shortestRoute,
        bestRouteLen: calculateTotalDistance(shortestRoute),
        allRoutes: allRoutes,
        bestOnIteration: bestRoutes,
        bestWaysOnIterationsLens: bestWayLens
    };
}

export {findShortestRouteGen};