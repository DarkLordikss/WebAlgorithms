// TODO: Need adaptation for ReactJS project struct
class KMeans {
    clusters = [];
    dots = [];
    clusterNumber = 0; // K
    dotsNumber = 0; // N

    flag = false;
    WIDTH = 0;
    HEIGHT = 0;
    svg = null;
    lineG;
    dotG;
    centerG;

    constructor(dotNumber, clusterNumber){ //получает
        this.initArea();
        this.init(dotNumber, clusterNumber);
        this.draw();
    }

    initArea(){   // инициализация пространства (чисто визуал кроме одной строки)
        const that = this;
        this.flag = false;
        this.WIDTH = d3.select("#kmeans")[0][0].clientWidth - 20;
        this.HEIGHT = Math.max(300, this.WIDTH * .7);
        this.svg = d3.select("#kmeans svg")
            .attr('width', this.WIDTH)
            .attr('height', this.HEIGHT)
            .style('padding', '10px')
            .style('background', '#83abd4')
            .style('cursor', 'pointer')
            .on('click', function() {
                // d3.event.preventDefault();
                that.step(); // кроме этой строки - нажимая на плоскость совершается шаг работы алгоритма
            });

        this.lineG = this.svg.append('g');   // эти переменные таскают визуал,
        this.dotG = this.svg.append('g');    // тоже не имеют практического значения
        this.centerG = this.svg.append('g'); //   |
    }

    init(dotNumber, clusterNumber) {   // на вход от пользователя нужно получить количество только точек
        this.dotsNumber = dotNumber || 9; // на случай, если от пользователя не пришли данные
        this.clusterNumber = clusterNumber || 35;  // на случай, если от пользователя не пришли данные

        this.initGroups();  // переход к инициализации групп (кластерных центров)
        this.initDots();    // переход к инициализации точек (кластерные элементы)
    }

    initGroups(){   // инициализация групп (кластерных центров)
        this.clusters = [];
        for (let i = 0; i < this.clusterNumber; i++) {
            let g = {
                id: 'group_'+i,   // это потом идет на вывод в консоль - не нужно
                dots: [],
                color: 'hsl(' + (i * 360 / this.clusterNumber) + ',100%,50%)', // цвет в hsl
                center: {
                    x: Math.random() * this.WIDTH, // рандомная задача центра
                    y: Math.random() * this.HEIGHT // теоретически, можно задавать как рандомно центры
                },                                 // так и намеренно, как и точки (элементы) кластера
            };
            g.center = {
                x: g.center.x,
                y: g.center.y
            };
            this.clusters.push(g);

        }
        //console.log('clusters: ', this.clusters); // вывод в консоль кластерных центров
    }

    initDots(){ // инициализация точек (кластерных элементов)
        this.dots = [];
        this.flag = false;
        for (let i = 0; i < this.dotsNumber; i++) {
            let dot ={
                x: Math.random() * this.WIDTH,  // случайная задача координат точек
                y: Math.random() * this.HEIGHT, // необходимо получать от пользователя координаты, куда он жмет
                                                // на плоскости
                group: undefined // изначально, ни одна точка не принадлежит ни одному кластеру
            };
            dot.init = {
                x: dot.x,
                y: dot.y,
                group: dot.group
            };
            this.dots.push(dot);
        }
        // console.log('dots: ', this.dots);  // вывод в консоль всех точек
    }

    step() {                       // основной код
        if (this.flag) {           // в первый раз флаг ложен, поэтому начинается с else
            this.moveCenter();
        } else {
            this.updateGroups();
        }
        this.draw();               // визуал - можно делать, что угодно
        this.flag = !this.flag;
    }

    draw() {                // визуальная часть, которую можно менять
        this.drawCircles(); // уходит рисовать точки (элементы) кластеров

        if (this.dots[0].group) { // если у точки нет цвета, и линий быть не должно
            this.drawLines();
        } else {
            this.lineG.selectAll('line').remove();
        }                        // линии тоже не являются необходимой частью - их можно вообще убрать

        let c = this.centerG.selectAll('path').data(this.clusters);
        let updateCenters = function(centers) { // работа с визуалом центров
            centers
                .attr('transform', function(d) { return "translate(" + d.center.x + "," + d.center.y + ") rotate(45)";})
                .attr('fill', function(d,i) { return d.color; })
                .attr('stroke', '#aabbcc');
        };
        c.exit().remove();
        updateCenters(c.enter()
            .append('path')
            .attr('d', d3.svg.symbol().type('cross'))
            .attr('stroke', '#aabbcc'));
        updateCenters(c
            .transition()
            .duration(500));
    }

    drawCircles(){
        let circles = this.dotG.selectAll('circle').data(this.dots);
        circles.enter().append('circle');
        circles.exit().remove();
        circles
            .transition()
            .duration(1000)
            .attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; })
            .attr('fill', function(d) { return d.group ? d.group.color : '#ffffff'; })
            .attr('r', 10);
    }

    drawLines(){
        let l = this.lineG.selectAll('line').data(this.dots);
        let updateLine = function(lines) {

            lines
                .attr('x1', function(d) { return d.x; })
                .attr('y1', function(d) { return d.y; })
                .attr('x2', function(d) { return d.group.center.x; })
                .attr('y2', function(d) { return d.group.center.y; })
                .attr('stroke', function(d) { return d.group.color; });
        };
        (l.enter().append('line'));
        updateLine(l.transition().duration(500));
        l.exit().remove();
    }

    moveCenter() {
        let finished = false;
        this.clusters.forEach(function(group, i) {

            finished = true;

            if (group.dots.length === 0) return;

            // get center of gravity
            let x = 0, y = 0;
            group.dots.forEach(function(dot) {
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

        if (finished){
            console.log('Algorithm is finished'); // тут возникает маленький диссонанс в определении
        }                                         // идет проверка по первому только кластеру - то есть
    }                                             // если другие смещаются, то все равно может выдать, что алгоритм закончен

    updateGroups() {
        const that = this;
        this.clusters.forEach(function(g) { g.dots = []; });
        this.dots.forEach(function(dot) {
            // find the nearest group
            let min = Infinity;
            let group;
            that.clusters.forEach(function(g) {
                let d = Math.pow(g.center.x - dot.x, 2) + Math.pow(g.center.y - dot.y, 2);
                if (d < min) {
                    min = d;
                    group = g;
                }
            });
            // update group
            group.dots.push(dot);
            dot.group = group;
        });
    }
}
// это еще не все комментарии