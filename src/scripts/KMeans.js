// мне нужна такая же плоскость и точки, как в генетике идут на вход
// для работы сего алгоритма; если где я посеял ошибки, то пофиксить их будет делом минутным

function startClusterization(){ // как кстати запустить алгоритм? Или вы сами пропишите на div его работу
    let clusterNumber = undefined;            // clusterNumber получаю тоже от пользователя в виде числа
    let dots = undefined;                     // надо получать из взаимодействия с пользователем. Получаю координаты точки, и сколько их
    let clusters = initGroups(clusterNumber);
    step(clusters, dots);
}

function initGroups(clusterNumber){   // инициализация групп (кластерных центров)
    let clusters = [];
    for (let i = 0; i < clusterNumber; i++) {
        let g = {
            id: i,
            dots: [],
            color: 'hsl(' + (i * 360 / clusterNumber) + ',100%,50%)',
            center: {
                x: Math.random(),
                y: Math.random() // надо определить границы допустимого рандома,
            },                   // относительно плоскости, на которой будет все происходить
        };
        g.center = {
            x: g.center.x,
            y: g.center.y
        };
        clusters.push(g);
    }
    return clusters;
}

function step(clusters, dots) //
{
    while (true) {
        setTimeout(updateGroups,1000, clusters, dots);       // таймауты, чтоб алгоритм не сразу выполнился
        if (setTimeout(moveCenter,1000, clusters, dots)){    // можно будет наблюдать процесс выполнения
            break;
        }
    }
}

function  updateGroups(clusters, dots) {
    clusters.forEach(function(cluster) { cluster.dots = [] });
    dots.forEach(
        function(dot) {
            let min = Infinity;
            let group;
            clusters.forEach(
                function(cluster) {
                    let d = Math.pow(cluster.center.x - dot.x, 2) + Math.pow(cluster.center.y - dot.y, 2);
                    if (d < min) {
                        min = d;
                        group = cluster;
                    }
                });
            dots.push(dot);
            dot.group = group;
        });
}

function moveCenter(clusters, dots) {
    let finished = true;

    clusters.forEach(function (group) {

        if (group.dots.length === 0) return;

        let x = 0, y = 0;
        group.dots.forEach(function (dot) {
            x += dot.x;
            y += dot.y;
        });

        let oldPos = {x: group.center.x, y: group.center.y};

        group.center = {
            x: x / dots.length,
            y: y / dots.length
        };
        let newPos = {x: group.center.x, y: group.center.y};

        if (oldPos.x !== newPos.x || oldPos.y !== newPos.y) finished = false;
    });
    return finished;
}

export {startClusterization};
 // базовая кластеризция - K-means, без всякой мишуры фронтовой
 // все что нужно на выход, переменные или что там, для показа - пишите, я вынесу
 // идея есть внести остальные алгоритмы вниз это этого, но как к ним уходить...
 // Может через фронтовое взаимодействие, через кнопочки