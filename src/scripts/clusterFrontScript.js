//Импорт отдельных функций из нужных модулей
import {startClusterization, step, initGroups} from "./KMeans";
//правильный импорт jQuery
import * as $ from "./jQueryMain.js";

let pointsBox = "#pointing_box_cl";
let pointsCounter = "#points_counter";
let clusterClounter = "#cluster_counter";
let startButton = "#clust_start_button";
let pointsPosArray = [];

let algo_processing = false;

let colors = ["yellow", "red", "pink", "purple", "blue", "cyan", "green", "lime"];

let line_time = 500;

let userDrawing = false;

/*берёт количество кластеров*/
function getClustersCount() {
    let n = $(clusterClounter).val();
    if (n === undefined){
        n = 1;
    }
    if (n <= 0){
        n = 1;
    }
    if (n > pointsPosArray.length){
        n = pointsPosArray.length;
    }
    $(clusterClounter).val(n);
    return n;
}

function getField() {
    let w = $(pointsBox).css("width");
    let h = $(pointsBox).css("height");
    let field = {
        width: parseInt(w),
        height: parseInt(h)
    }
    return field;
}

function convertPoints(array){
    let converted = [];
    for (let i = 0; i < array.length; i++) {
        let newPoint = {
            x: array[i][0],
            y: array[i][1]
        }
        converted.push(newPoint);
    }
    return converted;
}

/*изменяет размер коробки с точками*/
function resize_CLpointsBox() {
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

    if (((pos1[0]-pos2[0])**2 + (pos1[1]-pos2[1])**2)**0.5 > parseInt($(pointsBox).css("width"))*0.05+5) {
        return true;
    }
    return false;
}

/*добавляет точку с заданной позицией в коробку с точками (если это, конечно, возможно)*/
function add_new_point(pos){
    let pointRadius = parseInt($(pointsBox).css("width"))*0.025;
    if (pos[0]-pointRadius < 0 || pos[1]-pointRadius < 0){
        return;
    }

    for (let index = 0; index < pointsPosArray.length; index++) {
        if (collide(pos, index) === false) {
            return;
        }
        
    }

    let points_count = pointsPosArray.length+1;
    let newID = "#point_" + parseInt(pos[0]).toString() + "_" + parseInt(pos[1]).toString();
    let newPoint = "<div class='point appeared' id='point_" + parseInt(pos[0]) + "_" + parseInt(pos[1]) + "'></div>";
    pointsPosArray.push(pos);
    $(pointsCounter).text(points_count.toString());
    // $(pointsCounter).css({
    //     "background-color": colors[points_count],
    //     "color": text_colors[points_count]
    // });

    $(newPoint).appendTo(pointsBox);
    newPoint = $(newID);
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
}

/*удаляет выбранную точку из коробки с точками*/
function delete_point(element){
    let rePos1 = undefined;
    let rePos2 = undefined;

    let ind = element.id.split("_");
    let index = pointsPosArray.indexOf([parseInt(ind[1]), parseInt(ind[2])]);

    let lines_arr = $(".line");
    for (let line_i = 0; line_i < lines_arr.length; line_i++) {
        let myLine_id = $(lines_arr[line_i]).attr("id").split("_");
        if (parseInt(myLine_id[1]) === index) {
            rePos2 = parseInt(myLine_id[2]);
        }
        if (parseInt(myLine_id[2]) === index) {
            rePos1 = parseInt(myLine_id[1]);
        }
    }

    // reorganize_line(rePos1, index, rePos2, pointsPosArray);

    let pos = [parseInt($(element).css("left"))+parseInt($(element).css("width"))/2, parseInt($(element).css("top"))+parseInt($(element).css("width"))/2]
    $(element).addClass("appeared");
    $(element).attr("id", "deleted_point")
    $(element).css({
        "width": 0,
        "height": 0,
        "left": pos[0],
        "top": pos[1],
    });
    setTimeout(() => {
        element.remove();
    }, 200);
    // for (let i = index; i < pointsPosArray.length; i++) {
    //     $("#" + i).attr("id", (i-1).toString());
    // }
    pointsPosArray.splice(index, 1);
    let points_count = pointsPosArray.length;
    $(pointsCounter).text(points_count);
    // $(pointsCounter).css({
    //     "background-color": colors[points_count],
    //     "color": text_colors[points_count]
    // });
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

/*преобразует значение индекса в валидное*/
function valid_index(ind, array_ln){
    if (ind < 0){
        ind = array_ln - 1;
    }else if (ind >= array_ln){
        ind = 0;
    }
    return ind;
}

/*перерисовывает линии при удалении точки (вызывается в соответсвующей функции)*/
function reorganize_line(pos1 = undefined, deleted, pos2 = undefined, myArray) {
    if (pos1 !== undefined){
        let myIndex = "line_" + pos1 + "_" + deleted;
        let minusIndex = "line_" + deleted + "_" + pos1;
        if ($("#"+myIndex).length > 0){
            delete_line_between(myArray[pos1], myArray[deleted], pos1, deleted, "end");
        }
        else if ($("#"+minusIndex).length > 0){
            delete_line_between(myArray[deleted], myArray[pos1], deleted, pos1, "start");
        }
        // delete_line_between(myArray[pos1], myArray[deleted], pos1, deleted, "start");
    }
    if (pos2 !== undefined){
        let myIndex = "line_" + deleted + "_" + pos2;
        let minusIndex = "line_" + pos2 + "_" + deleted;
        if ($("#"+myIndex).length > 0){
            delete_line_between(myArray[deleted], myArray[pos2], deleted, pos2, "start");
        }
        else if ($("#"+minusIndex).length > 0){
            delete_line_between(myArray[pos2], myArray[deleted], pos2, deleted, "end");
        }
    }
    let lines = $(".line");
    for (let k = 0; k < lines.length; k++) {
        let his_id = $(lines[k]).attr("id").split("_");
        if (his_id[0] === "line"){
            let start = parseInt(his_id[1]);
            let end = parseInt(his_id[2]);
            if (start >= deleted) {
                start -= 1;
            }
            if (end >= deleted){
                end -= 1;
            }
            start = valid_index(start, pointsPosArray.length - 1);
            end = valid_index(end, pointsPosArray.length - 1);
            $(lines[k]).attr("id", "line_" + start + "_" + end);
        }
    }
}

/*рисует линию от 1 точки до 2*/
function create_line_from_1_to_2(pos1, pos2, time, color = "black"){
    if (time < 5){
        time = 5;
    }
    let myIndex = "line_" + pointsPosArray.indexOf(pos1).toString() + "_" + pointsPosArray.indexOf(pos2).toString();
    let minusIndex = "line_" + pointsPosArray.indexOf(pos2).toString() + "_" + pointsPosArray.indexOf(pos1).toString();
    if ($("#"+myIndex).length > 0){
        delete_line_between(pos1, pos2, undefined, undefined, "end");
    }
    else if ($("#"+minusIndex).length > 0){
        delete_line_between(pos2, pos1, undefined, undefined, "start");
    }
    let new_line = "<div id='" + myIndex + "'></div>";
    myIndex = "#" + myIndex;
    $(pointsBox).append(new_line);
    $(myIndex).css({
        "transition": (line_time/1000).toString() + "s",
    });

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

function send_data() {
    let myClusters = initGroups(getClustersCount(), getField());
    let newStep = step(myClusters, convertPoints(pointsPosArray));
    return(newStep);
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

function goCluster(myRes) {
    console.log(myRes);
    for (let cl = 0; cl < myRes.clusters.length; cl++) {
        for (let dt = 0; dt < myRes.clusters[cl].dots.length; dt++){
            let nowDot = myRes.clusters[cl].dots[dt];
            let elem = "#point_" + nowDot.x + "_" + nowDot.y;
            $(elem).css({
                "background-color": myRes.clusters[cl].color,
                "box-shadow": "0 0 50px 25px "+myRes.clusters[cl].color
            });
        }
    }
    if (!myRes.finished){
        setTimeout(() => {
            myRes = step(myRes.clusters, myRes.dots);
            goCluster(myRes);
        }, 500);
    }
}

$(document).ready(function () {
    // if($(pointsBox).length !== 1){
    //     return;
    // }
    resize_CLpointsBox();
    $(pointsBox).mousedown(function (e) {
        userDrawing = true;
        if (!algo_processing) {
            if (e.target.id.toString() !== "pointing_box_cl"){
                if ($(e.target).hasClass("point")){
                    delete_point(e.target);
                }
            }
            else{
                let mouse_pos = get_mousePos_in_element($(this), e);
                add_new_point(mouse_pos);
            }
        }
    });
    
    $(pointsBox).mousemove(function (e) { 
        if (userDrawing) {
            if (!algo_processing) {
                let mouse_pos = get_mousePos_in_element($(this), e);
                add_new_point(mouse_pos);
            }
        }
    });

    $(startButton).mousedown(function (e){
        let res = send_data();
        let k = 1
        console.log(res);
        goCluster(res);
        
    });
});



/*изменять коробку с точками при изменении размера окна*/
$(window).resize(function () { 
    resize_CLpointsBox();
});

$(window).mouseup(function () { 
    userDrawing = false;
});