//Импорт отдельных функций из нужных модулей
import {step, initGroups} from "./KMeans";
import { mainAnimation } from "./clusterBackgroundAnimation";
//правильный импорт jQuery
import * as $ from "./jQueryMain.js";

let pointsBox = "#pointing_box_cl";
let pointsCounter = "#points_counter";
let clusterClounter = "#cluster_counter";
let startButton = "#clust_start_button";
let canvasFon = "#canvasFon";
let canvasBack = "#canvasBack";
let pointsPosArray = [];

let algo_processing = false;

let userDrawing = false;
let clusterizationInProgess = false;

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

/*Изменяет отображаемый и фактический размеры канваса*/
function resize_canvas(width, height) {
    $(canvasFon).css({
        "width": width,
        "height": height
    });
    $(canvasFon).attr("width", width);
    $(canvasFon).attr("height", height);
}

/*Взять поле для рисования*/
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

            resize_canvas(width, height);

            $(canvasBack).attr("width", window.innerWidth);
            $(canvasBack).attr("height", window.innerHeight);

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
    clearCanv();
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
    clearCanv();

    let ind = element.id.split("_");
    let index = pointsPosArray.indexOf([parseInt(ind[1]), parseInt(ind[2])]);

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
    
    pointsPosArray.splice(index, 1);
    let points_count = pointsPosArray.length;
    $(pointsCounter).text(points_count);
}

/*генерирует стартовые данные для алгоритма*/
function send_data() {
    let myClusters = initGroups(getClustersCount(), getField());
    let newStep = step(myClusters, convertPoints(pointsPosArray));
    return(newStep);
}

/*очищает канвас*/
function clearCanv(){
    let field = document.getElementById("canvasFon");
    if (field != null) {
        let ctx = field.getContext("2d");
        let width = parseInt($(canvasFon).attr("width"));
        let height = parseInt($(canvasFon).attr("height"));
        ctx.clearRect(0, 0, width, height);
    }
}

/*ход кластеризации*/
function goCluster(myRes) {
    clusterizationInProgess = true
    clearCanv();
    for (let cl = 0; cl < myRes.clusters.length; cl++) {
        let nowCluster = myRes.clusters[cl];
        for (let dt = 0; dt < nowCluster.dots.length; dt++){
            let nowDot = nowCluster.dots[dt];
            let elem = "#point_" + nowDot.x + "_" + nowDot.y;
            $(elem).css({
                "background-color": nowCluster.color,
                "border-radius": "100vw"
            });
        }
    }
    if (!myRes.finished){
        setTimeout(() => {
            myRes = step(myRes.clusters, myRes.dots);
            goCluster(myRes);
            return;
        }, 500);
    }
    else{
        drawClusters(myRes);
        clusterizationInProgess = false;
    }
    return (myRes);
}

/*нарисовать границы кластеров*/
function drawClusters(resul){
    let clusters = resul.clusters;
    for (let clI = 0; clI < clusters.length; clI++){
        let field = document.getElementById("canvasFon");
        let ctx = field.getContext("2d");
        for (let dotI = 0; dotI < clusters[clI].dots.length; dotI++) {
            for (let dotJ = 0; dotJ < clusters[clI].dots.length; dotJ++) {
                if (dotJ !== dotI){
                    for (let dotK = 0; dotK < clusters[clI].dots.length; dotK++) {
                        if (dotK !== dotI && dotK !== dotJ){
                            ctx.beginPath();
                            ctx.moveTo(clusters[clI].dots[dotI].x, clusters[clI].dots[dotI].y);

                            ctx.lineTo(clusters[clI].dots[dotJ].x, clusters[clI].dots[dotJ].y);
                            ctx.lineTo(clusters[clI].dots[dotK].x, clusters[clI].dots[dotK].y);
                            ctx.lineTo(clusters[clI].dots[dotI].x, clusters[clI].dots[dotI].y);

                            ctx.fillStyle = clusters[clI].color;
                            ctx.fill();
                            ctx.closePath();
                        }
                    }
                }
            }
        }
    }
}

$(document).ready(function () {
    if($(pointsBox).length === 0){
        return;
    }
    if ($(canvasBack).length !== 0){
        let width = window.innerWidth;
        let height = window.innerHeight;
        mainAnimation(width, height, document.getElementById("canvasBack"));
    }
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

    $(startButton).mousedown(function (){
        if (!clusterizationInProgess){
            let res = send_data();
            goCluster(res);
        }
    });
});

/*изменять коробку с точками при изменении размера окна*/
$(window).resize(function () { 
    resize_CLpointsBox();
    clearCanv();
});

/*отозвать рисование*/
$(window).mouseup(function () { 
    userDrawing = false;
});