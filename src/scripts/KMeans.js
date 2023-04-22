// мне нужна такая же плоскость и точки, как в генетике идут на вход
// для работы сего алгоритма; если где я посеял ошибки, то пофиксить их будет делом минутным

// clusterNumber получаю тоже от пользователя в виде числа
// dots надо получать из взаимодействия с пользователем. Получаю координаты точки, и сколько их
function startClusterization(clusterNumber = undefined, dots = undefined){ // как кстати запустить алгоритм? Или вы сами пропишите на div его работу
    let points = dots;
    let number = clusterNumber;
    let clusters = initGroups(number);
    step(clusters, points);
}

// по сути всё что сверху можно удалить, ни мне, ни фронту это не нужно

function initGroups(clusterNumber, field){   // инициализация групп (кластерных центров)
    let place = field;
    let number = clusterNumber;
    let clusters = [];
    for (let i = 0; i < number; i++) {
        let g = {
            id: i,
            dots: [],
            color: 'hsl(' + (i * 360 / number) + ',100%,50%)',
            center: {
                x: Math.random()*place.width,
                y: Math.random()*place.height // надо определить границы допустимого рандома,
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

function step(clusters, dots) {
    let stepClusters = clusters;
    let stepDots = dots;
    let res = updateGroups(stepClusters, stepDots);
    let finish = moveCenter(stepClusters, stepDots);
    let result = {
        clusters: res[0],
        dots: res[1],
        finished: finish
    };
    return result;
}

function updateGroups(clusters, dots) {
    clusters.forEach(function(cluster) { cluster.dots = [] });
    dots.forEach(function(dot) {
        let min = Infinity;
        let group = undefined;
        clusters.forEach(function(cluster) {
            let d = Math.pow(cluster.center.x - dot.x, 2) + Math.pow(cluster.center.y - dot.y, 2);
            if (d < min) {
                min = d;
                group = cluster;
            }
        });
        if (group !== undefined){
            group.dots.push(dot);
            dot.group = group;
        }
    });
    return [clusters, dots];
}

function moveCenter(clusters, dots) {
    let finished = false;

    clusters.forEach(function (group) {
        finished = true;
        if (group.dots.length === 0) return;
        let x = 0
        let y = 0;
        group.dots.forEach(function (dot) {
            x += dot.x;
            y += dot.y;
        });

        let oldPos = {x: group.center.x, y: group.center.y};

        group.center = {
            x: x / group.dots.length,
            y: y / group.dots.length
        };
        let newPos = {x: group.center.x, y: group.center.y};

        if (oldPos.x !== newPos.x || oldPos.y !== newPos.y) finished = false;
    });
    return finished;
}

///////////////////////
//////Hierarchy////////
///////////////////////

// Итак, я попытался подогнать иерархию под вид того, как выглядит KMeans
// Однако мне в некоторых местах надо получать другие данные, отличные от тех, что в КМ
// где-что поменять я припишу комменты. Когда я попробовал сам заменить, выбил ошибок 10
// поэтому я решил ничего не трогать - только хуже получалось
// и чтоб не вызвалось косяков с первой все функции начинаются с H
function HinitGroups(clusterNumber, dots){   // вместо field нужно dots
    let number = clusterNumber;
    let clusters = [];
    for (let i = 0; i < dots.length; i++) {
        let g = {
            id: i,
            dots: [dots[i]],
            color: 'hsl(' + (i * 360 / dots.length) + ',100%,50%)',
            center: {
                x: dots[i].x,
                y: dots[i].y
            },
        };
        g.center = {
            x: g.center.x,
            y: g.center.y
        };
        clusters.push(g);
    }
    return clusters;
}

function Hstep(clusters, dots, clusterNumber) { //clusterNumber - максимум массивов, при котором алгоритм законичит работу
    let stepClusters = clusters;               //надо подать его, чтобы при проверке максимума массивов дать сигнал к концу работы
    let stepDots = dots;
    let res = HupdateGroups(stepClusters, stepDots);
    let finish = HmoveCenter(stepClusters, stepDots, clusterNumber);
    let result = {
        clusters: res[0],
        dots: res[1],
        finished: finish
    };
    return result;
}

function HmoveCenter(clusters, dots, clusterNumber) {
    let finish = false;
    if (clusterNumber < clusters.length) {
        clusters.forEach(function (group) {
            if (group.dots.length === 0) return;
            let x = 0
            let y = 0;
            group.dots.forEach(function (dot) {
                x += dot.x;
                y += dot.y;
            });
            group.center = {
                x: x / group.dots.length,
                y: y / group.dots.length
            };
        });
    } else
        finish = true;

    return finish;
}

function  HupdateGroups(clusters, dots) {
    let index;
    let group;
    clusters.forEach(function(groupTo, i)
    {
        clusters.forEach(function(groupFrom, j){
            let min = Infinity;
            if (i < j) {
                let delta = Math.pow(groupTo.center.x - groupFrom.center.x, 2) + Math.pow(groupTo.center.y - groupFrom.y, 2);
                if (delta < min) {
                    min = delta;
                    group = groupFrom;
                    index = j;
                }
            }
        });
        for (let k = 0; k < group.dots.length; k++)
            clusters.dots.push(group.dots[k]);

        clusters.splice(index); // удаление конкретного элемента массива, со смещением
    });
    return [clusters, dots];
}
// чуть позже добавлю еще один алгоритм, который подгоню под то, как оформлен первый
// есть мысль переключаться между видами алгоритма посредством того, как на генетике идет переключение между скоростью или анимацией
// и да, есть неиллюзорное ощущение косяков, но суть записана, поэтому с отдельно взятами косяками я разоберусь за часик другой
export {startClusterization, step, initGroups};