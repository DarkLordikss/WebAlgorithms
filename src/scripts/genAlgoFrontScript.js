//Импорт отдельных функций из нужных модулей
import {findShortestRouteGen} from "./genAlgo";
//правильный импорт jQuery
import * as $ from "./jQueryMain.js";

let pointsBox = "#pointing_box";
let pointsCounter = "#points_counter";
let gen_block = "#gens_counter";
let evo_block = "#evolution_changer";
let start_b = "#start_button";
let speed_block = "#speed_mode";
let pointsPosArray = [];

let colors = ["#9BFFD4", "#9BFFAF", "#9EFF9B", "#AFFF9B",
"#C3FF9B", "#D4FF9B", "#E5FF9B", "#F6FF9B", "#FFF99B",
"#FFE386", "#FFC772", "#FF9B4E", "#FF6F3A", "#FF4022",
"#D40078", "#A500B0"];

let text_colors = ["black", "black", "black", "black", "black", "black", "black", "black", "black", "black",
"white", "white", "white", "white", "white", "white"];

let routes_classes = ["yellow", "red", "pink", "purple", "blue", "cyan", "green", "lime"];

let line_time = 500;

/*берёт количество поколений*/
function get_gens_count() {
    let n = $(gen_block).val();
    if (n === undefined || n <= 0){
        return 0;
    }
    else if (n >= 100){
        return 100;
    }
    return n;
}

/*берёт шанс мутации*/
function get_chance() {
    let n = $(evo_block).val();
    if (n === undefined || n <= 1){
        return 1;
    }
    else if (n >= 100){
        return 100;
    }
    return n;
}

/*изменяет размер коробки с точками*/
function resize_pointsBox() {
    if ($(pointsBox).length) {
        setTimeout(() => {
            let prev_w = parseInt($(pointsBox).css("width").split("px"));
            let prev_h = parseInt($(pointsBox).css("height").split("px"));

            let width = window.innerWidth / 1.5;
            let height = window.innerHeight / 1.5;

            let koef_horizontal = width / prev_w;
            let koef_vertical = height / prev_h;


            $(pointsBox).css({
                "width": width,
                "height": height,
                "left": width * 0.25,
                "top": height * 0.25
            });

            let pointRadius = width * 0.0125;

            if (pointsPosArray.length > 1) {
                for (let index = 0; index < pointsPosArray.length; index++) {
                    let myPos = pointsPosArray[index];
                    $("#" + index).css({
                        "left": myPos[0] * koef_horizontal - pointRadius,
                        "top": myPos[1] * koef_vertical - pointRadius,
                        "height": pointRadius * 2 - 4,
                        "width": pointRadius * 2 - 4,
                    });
                    pointsPosArray[index][0] = myPos[0] * koef_horizontal;
                    pointsPosArray[index][1] = myPos[1] * koef_vertical;
                }
            }
        }, 25);
    }
}

/*возвращает позицию мыши с точкой отсчёта от позиции нужного элемента*/
function get_mousePos_in_element(element, event){
    let mPos = [event.clientX, event.clientY];
    let ePos = [parseInt(element.css("left")), parseInt(element.css("top"))];
    let pointPos = [mPos[0]-ePos[0], mPos[1]-ePos[1]];
    
    return pointPos;
}

/*принимает на вход позицию новой точки [x, y] и индекс точки int, существующей  в массиве
проверяет не слишком ли близко они находятся друг к другу*/
function collide(pos1, point2) {
    let pos2 = pointsPosArray[point2];

    if (((pos1[0]-pos2[0])**2 + (pos1[1]-pos2[1])**2)**0.5 > parseInt($(pointsBox).css("width"))*0.025+5) {
        return true;
    }
    return false;
}

/*анимация тряски при максимальном количестве точек*/
function max_points_count() {
    $(pointsCounter).addClass("dynamic");
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            $(pointsCounter).css({
                "transform": "rotate(5deg)",
                "width": "11vh",
                "height": "3.2vh",
                "font-size": "2.4vh",
                "left": "27vh",
                "top": "2.6vh",
            });
            setTimeout(() => {
                $(pointsCounter).css({
                    "transform": "rotate(0deg)",
                    "width": "11vh",
                    "height": "3.2vh",
                    "font-size": "2.4vh",
                    "left": "27vh",
                    "top": "2.6vh",
                });
                setTimeout(() => {
                    $(pointsCounter).css({
                        "transform": "rotate(-5deg)",
                        "width": "11vh",
                        "height": "3.2vh",
                        "font-size": "2.4vh",
                        "left": "27vh",
                        "top": "2.6vh",
                    });
                    setTimeout(() => {
                        $(pointsCounter).css({
                            "transform": "rotate(0deg)",
                            "width": "11vh",
                            "height": "3.2vh",
                            "font-size": "2.4vh",
                            "left": "27vh",
                            "top": "2.6vh",
                        });
                    }, 20);
                }, 20);
            }, 20);
        }, 80*i);
    }
    setTimeout(() => {
        $(pointsCounter).css({
            "transform": "rotate(0deg)",
            "width": "9vh",
            "height": "2.8vh",
            "font-size": "2vh",
            "left": "28vh",
            "top": "2.8vh",
        });
        $(pointsCounter).removeClass("dynamic");
    }, 80*7);
    
}

/*добавляет точку с заданной позицией в коробку с точками (если это, конечно, возможно)*/
function add_new_point(pos){
    let pointRadius = parseInt($(pointsBox).css("width"))*0.0125;
    if (pos[0]-pointRadius < 0 || pos[1]-pointRadius < 0){
        return;
    }
    if (pointsPosArray.length >= 15){
        max_points_count();
        return;
    }

    for (let index = 0; index < pointsPosArray.length; index++) {
        if (collide(pos, index) === false) {
            return;
        }
        
    }

    let points_count = pointsPosArray.length+1;
    let newPoint = "<div class='point appeared' id='" + (points_count - 1) + "'></div>";
    pointsPosArray.push(pos);
    $(pointsCounter).text(points_count.toString());
    $(pointsCounter).css({
        "background-color": colors[points_count],
        "color": text_colors[points_count]
    });

    $(newPoint).appendTo(pointsBox);
    newPoint = $("#" + (points_count-1));
    newPoint.css({
        "width": 0,
        "height": 0,
        "left": pos[0],
        "top": pos[1],
    });

    setTimeout(() => {
        newPoint.removeClass("appeared");
        newPoint.css({
            "width": pointRadius*2-4,
            "height": pointRadius*2-4,
            "left": pos[0]-pointRadius,
            "top": pos[1]-pointRadius,
        });
    }, 1);
    // if (pointsPosArray.length >= 2){
    //     create_line_from_1_to_2(pointsPosArray[pointsPosArray.length-2], pointsPosArray[pointsPosArray.length-1], 100);
    // }
}

/*удаляет выбранную точку из коробки с точками*/
function delete_point(element){
    let index = parseInt(element.id);

    let rePos1 = undefined;
    if (index > 0){
        rePos1 = index-1;
    }
    let reIndDeleted = index;
    let rePos2 = undefined;
    if (index < pointsPosArray.length - 1){
        rePos2 = index+1;
    }

    //reorganize_line(rePos1, reIndDeleted, rePos2, pointsPosArray);

    let pos = [parseInt($(element).css("left"))+parseInt($(element).css("width"))/2, parseInt($(element).css("top"))+parseInt($(element).css("width"))/2]
    $(element).addClass("appeared");
    $(element).css({
        "width": 0,
        "height": 0,
        "left": pos[0],
        "top": pos[1],
    });
    setTimeout(() => {
        element.remove();
    }, 200);
    for (let i = index; i < pointsPosArray.length; i++) {
        $("#" + i).attr("id", (i-1).toString());
    }
    pointsPosArray.splice(index, 1);
    let points_count = pointsPosArray.length;
    $(pointsCounter).text(points_count);
    $(pointsCounter).css({
        "background-color": colors[points_count],
        "color": text_colors[points_count]
    });
}

/*переводит радианды в градусы*/
function toDEG(rad) {
    return (rad * 180) / Math.PI;
}

/*считает величину угла для отрисовки линии*/
function calculate_angle(pos1, pos2){
    let angle = 0;

    let opposite = Math.abs(pos1[1]-pos2[1]);
    let adjacent = Math.abs(pos1[0]-pos2[0]);

    angle = toDEG(Math.atan(opposite/adjacent));

    if (pos1[1] > pos2[1]){
        angle *= (-1);
    }
    if (pos1[0] > pos2[0]){
        angle *= (-1);
        angle += 180;
    }

    return angle;
}

/*перерисовывает линии при удалении точки (вызывается в соответсвующей функции)*/
function reorganize_line(pos1 = undefined, deleted, pos2 = undefined, myArray) {
    if (pos1 !== undefined){
        delete_line_between(myArray[pos1], myArray[deleted], pos1, deleted, "start");
    }
    if (pos2 !== undefined){
        delete_line_between(myArray[deleted], myArray[pos2], deleted, pos2, "end");
    }
    let lines = $(".line");
    for (let k = 0; k < lines.length; k++) {
        let his_id = $(lines[k]).attr("id").split("_");
        let start = parseInt(his_id[1]);
        if (start >= deleted) {
            start -= 1;
            let end = parseInt(his_id[2])-1;
            $(lines[k]).attr("id", "line_" + start + "_" + end);
        }
    }
}

/*рисует линию от 1 точки до 2*/
function create_line_from_1_to_2(pos1, pos2, time, color = "black"){
    let total_lines = $(".line").length;
    let myIndex = "line_" + pointsPosArray.indexOf(pos1).toString() + "_" + pointsPosArray.indexOf(pos2).toString();
    let minusIndex = "line_" + pointsPosArray.indexOf(pos2).toString() + "_" + pointsPosArray.indexOf(pos1).toString();
    if ($("#"+myIndex).length > 0){
        delete_line_between(pos1, pos2, undefined, undefined, "end");
        if (time < 5){
            time = 5;
        }
    }
    else if ($("#"+minusIndex).length > 0){
        delete_line_between(pos2, pos1, undefined, undefined, "start");
        if (time < 5){
            time = 5;
        }
    }
    let new_line = "<div id='" + myIndex + "'></div>";
    myIndex = "#" + myIndex;
    $(pointsBox).append(new_line);

    let length = ((pos1[0] - pos2[0])**2 + (pos1[1] - pos2[1])**2)**0.5;
    let adjacent = Math.abs(pos1[0]-pos2[0]);
    let myPos = [pos1[0], (pos1[1]+pos2[1])/2-2];

    if (pos1[0] >= pos2[0]){
        myPos[0] -= Math.abs(pos1[0]-pos2[0]);
    }

    let angle = "rotate(" + calculate_angle(pos1, pos2) + "deg)";

    $(myIndex).css({
        "left": pos1[0],
        "top": pos1[1],
        "transform": angle,
    });
    $(myIndex).addClass("line");
    $(myIndex).addClass(color);

    setTimeout(() => {
        $(myIndex).css({
            "width": length,
            "left": myPos[0]-(length-adjacent)/2,
            "top": myPos[1],
        });
    }, time);
}

/*удаляет линию между 1ым и 2ым элементами
pos1 и pos2 - [x, y] точек 1 и 2
index1 и index2 - индексы точек 1 и 2
type - в какую точку пойдёт анимация*/
function delete_line_between(pos1, pos2, index1 = undefined, index2 = undefined, type = "start"){
    console.log(pos1, pos2);
    let myIndex = "";
    if (index1 === undefined){
        myIndex = "#line_" + pointsPosArray.indexOf(pos1).toString() + "_" + pointsPosArray.indexOf(pos2).toString();
    }
    else{
        myIndex = "#line_" + index1 + "_" + index2;
    }
    
    if (type === "start"){
        $(myIndex).css({
            "left": pos1[0],
            "top": pos1[1],
            "width": 0,
        });
    }else{
        $(myIndex).css({
            "left": pos2[0],
            "top": pos2[1],
            "width": 0,
        });
    }

    $(myIndex).attr("id", "deleted_line");
    

    setTimeout(() => {
        $("#deleted_line").remove();
    }, line_time-1);
}

/*очищает все существующие линии*/
function clear_all_lines() {
    let lines = $(".line");
    for (let i = 0; i < lines.length; i++){
        let myLine = lines[i];
        let lineId = $(myLine).attr("id").split("_");
        if (lineId[0] === "line"){
            let start = parseInt(lineId[1]);
            let end = parseInt(lineId[2]);
            let pos1 = pointsPosArray[start];
            let pos2 = pointsPosArray[end];

            delete_line_between(pos1, pos2, start, end, "end");
        }
    }
}

/*анимирует решение*/
function visualize_solution(solution) {
    clear_all_lines();
    let routes = solution.allRoutes;
    let bestRoutes = solution.bestOnIteration;
    let everBestRoute = solution.bestRoute;

    let qTime = line_time+1;
    let allDrawingTime = routes.length*(routes[0].length+1)*(routes[0][0].length-1)*qTime
    for (let iteration = 0; iteration < routes.length; iteration++) {
        console.log("NEW SOLUTION");
        //цикл всех решений
        clear_all_lines();
        let bigCycleTime = (routes[iteration].length+1)*(routes[iteration][0].length-1)*qTime
        let afterBigCT = routes[iteration].length*(routes[iteration][0].length-1)*qTime
        setTimeout(() => {
            for (let route_i = 0; route_i < routes[iteration].length; route_i++) {
                console.log("-----NEW ROUTE");
                //цикл всех путей решения
                let cycleTime = (routes[iteration][route_i].length-1)*qTime;
                setTimeout(() => {
                    clear_all_lines();
                    for (let point_i = 0; point_i < routes[iteration][route_i].length-1; point_i++) {
                        console.log("----------NEW WAY");
                        //цикл всех точек пути решения
                        setTimeout(() => {
                            create_line_from_1_to_2(routes[iteration][route_i][point_i], routes[iteration][route_i][point_i+1], 1, routes_classes[route_i%(routes_classes.length)]);
                        }, qTime*point_i);
                    }
                }, cycleTime*route_i);
            }
            setTimeout(() => {
                clear_all_lines();
                for (let point_best = 0; point_best < bestRoutes[iteration].length-1; point_best++) {
                    console.log("---BEST WAY");
                    //цикл лучшего решения на итерации
                    setTimeout(() => {
                        create_line_from_1_to_2(bestRoutes[iteration][point_best], bestRoutes[iteration][point_best+1], 1, "great");
                    }, qTime*point_best);
                }
            }, afterBigCT);
        }, bigCycleTime*iteration);
    }
    setTimeout(() => {
        clear_all_lines();
        //цикл наилучшего пути
        for (let point_i = 0; point_i < everBestRoute.length-1; point_i++) {
            setTimeout(() => {
                create_line_from_1_to_2(everBestRoute[point_i], everBestRoute[point_i+1], 1, "legendary");
            }, qTime*point_i);
        }
    }, allDrawingTime);
}

$(document).ready(function () {
    if($(pointsBox).length !== 1){
        return;
    }
    resize_pointsBox();
    $(pointsBox).mousedown(function (e) {
        if (e.target.id.toString() !== "pointing_box"){
            if ($(e.target).hasClass("point")){
                delete_point(e.target);
            }
        }
        else{
            let mouse_pos = get_mousePos_in_element($(this), e);
            add_new_point(mouse_pos);
        }
    });
    $(start_b).mousedown(function (e) {
        let gensCount = get_gens_count();
        if (pointsPosArray !== undefined && pointsPosArray.length > 1 && gensCount > 0){
            visualize_solution(findShortestRouteGen(pointsPosArray, pointsPosArray.length, gensCount, get_chance()/100));
        }
    });
    $(speed_block).mousedown(function (e) {
        if ($(speed_block).hasClass("false")){
            line_time = 100;
            $(speed_block).removeClass("false");
            $(speed_block).addClass("true");
            $(speed_block).text("fast mode");
        }
        else if ($(speed_block).hasClass("true")){
            line_time = 20;
            $(speed_block).removeClass("true");
            $(speed_block).addClass("ultra");
            $(speed_block).text("ultra mode");
        }
        else if ($(speed_block).hasClass("ultra")){
            line_time = 500;
            $(speed_block).removeClass("ultra");
            $(speed_block).addClass("false");
            $(speed_block).text("slow mode");
        }
    });
    $(evo_block).change(function () {
        let n = get_chance();
        $(evo_block).val(n);
    });
});

/*изменять коробку с точками при изменении размера окна*/
$(window).resize(function () { 
    resize_pointsBox();
});
